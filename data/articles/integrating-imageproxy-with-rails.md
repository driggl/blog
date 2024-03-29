---
title: "How we Integrated Image Processing service with rails application"
excerpt: "Image processing in rails applications is pretty easy. There are plenty of solutions almost built-in into the exosystem you can use to make it work. However, there is one approach that beats the Hell out of the competition. Meet Imageproxy"
slug: "integrating-imageproxy-with-rails"

tags: []
thumbnail:
  big: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/fd0ea04e-339e-4be0-9725-e7d01d794156/cover/blog.jpeg"
  full: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/fd0ea04e-339e-4be0-9725-e7d01d794156/cover/full.jpeg"
  mini: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/fd0ea04e-339e-4be0-9725-e7d01d794156/cover/mini.jpeg"
  small: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/fd0ea04e-339e-4be0-9725-e7d01d794156/cover/small.jpeg"
  medium: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/fd0ea04e-339e-4be0-9725-e7d01d794156/cover/medium.jpeg"
  sharing: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/fd0ea04e-339e-4be0-9725-e7d01d794156/cover/sharing.jpeg"
  original: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/fd0ea04e-339e-4be0-9725-e7d01d794156/cover/original.jpeg"
publishedAt: "2020-02-21"
author: "swilgosz"
---

Image processing in rails applications is pretty easy. There are plenty of solutions almost built-in into the ecosystem you can use to make it work. However, there is one approach that beats the Hell out of the competition. **Meet Imageproxy.**

> **TLDR:** With [ImageProxy](https://github.com/willnorris/imageproxy), the complete file uploader with more flexibility than Capybara or ActiveStorage allows took only 70 lines of code. Se the gist at the bottom for the complete code. Or read to know some thoughts hidden behind.

### The problem - Generating image versions

The challenge we faced is a pretty popular one. If the application does not use images, it's probably just not finished yet.

When you upload images, you usually need some versioning. In our case, the basic usage would be to upload article images and format them without too much effort.

We thought about all the possible requirements we would have, like

1.  Resizing images
2.  Changing image format
3.  Cropping
4.  Rotating
5.  Compressing

And we wanted versioning to be easy to configure, easy to change and implement, and reliable.

### Possible Solutions

As mentioned above, there are several solutions out there already.

- Paperclip
- CarrierWave
- Dragonfly

Those are the most standard libraries to handle this task, especially for older applications.

Then we have a few newer solutions:

- [Active Storage](https://edgeguides.rubyonrails.org/active_storage_overview.html) - Since rails 5, a built-in image processing solution
- [Shrine](https://github.com/shrinerb/shrine) - A modern plugin that allows you to easily switch adapters and configurations, so basically you can easily upload anywhere you need and easily use different engines to compute images.

However, all of those solutions have some drawbacks:

- It's not easy and sometimes not possible to support dynamic versioning and configuration without changing the source code of the application or plugin itself.
- You need to install the whole engine for your image processing in your application's host.

As we work in dockerized environments, I didn't want to always install the ImageMagick and all the software behind it every time I rebuild the application image. I thought that maybe there are solutions that are already finished, with the easy to use API, that you can use as a service to process images?

And surprise, surprise, there are!

## Meet image proxy

After looking at possible image processing services, I finally found the one that perfectly fits our needs. [ImageProxy](https://github.com/willnorris/imageproxy).

It's open-source software that is already dockerized and you can set it up on any host without ANY implementation at all!

### Why

#### 1. Flexibility

Image proxy meets for all the requirements we had and allows for extreme flexibility while there are no human-resources needed to manage it or implement.

It just works out of the box. And as it's an external service with provided API, we can generate all kinds of dynamic versioning without any effort.

**For example:**

Blog's owner can set up the list of image versions that will be generated for all images in his blog from the admin panel. And the code responsible for handling that could look like this:

```ruby
    # ruby: handling dynamic image versions

    image_versions.each do |version|
      upload.versions[version.name] = uploader.upload_version(
        url: upload.original_url, version: version
      )
    end
```

That's just amazing. Just by generating different URLs you can get different versions of images and work with strings is extremely easy comparing to working with raw files.

#### 2. Dev env setup/deployment speed

As the service comes with the already dockerized image, we can install it on a virtual machine independent of at what host we run our application. Again, no configuration required.

And when I'll need to upgrade the dependencies, image versions, build test image, I'll not need to re-install all the meat required to process images.

I just don't need it as I have a separate service for that.

So this is what we tried.

I've set up the ImageProxy as a dockerized container and just wrote a wrapper to communicate with its API.

And it worked like a charm.

### How

First of all, we always upload the original files to AWS S3 first. So basically we always have the URL of the image we want to process.

Then we need a simple uploader, that will

1.  Take the original URL and requested version as an input,
2.  Create the version URL according to ImageProxy specification
3.  Fetch the file from the generated URL
4.  Upload it to s3 with the version name.

#### The uploader object

Before writing the actual upload logic we need a little image version object that will be used to easily translate it to a URL we can work with.

```ruby
    ruby: image_version.rb

    class Version < Dry::Struct
      attribute :name, Types::String.default('original')
      attribute :width, Types::Integer
      attribute :height, Types::Integer
      attribute :gravity, Types::String.default('sm')
      attribute :enlarge, Types::Bool.default(true)
      attribute :resize_type, Types::String.default('auto')
      attribute :extension, Types::String.default('jpeg')
    end
```

This version object is just a list of options allowed by ImageProxy to be passed in the URL itself with some defaults allowing us to omit the mostly used images.

Then we need a basic uploader.

```ruby
    # ruby: uploader.rb

    class Uploader
    ...
      private

      attr_reader :path, :s3, :bucket, :image_processor_host, :image_processor_port

    def initialize(path:)
        @path = path
        @s3 = Aws::S3::Resource.new
        @bucket = ENV['AWS_BUCKET']
        @image_processor_host = ENV['IMAGE_PROCESSOR_HOST']
        @image_processor_port = ENV['IMAGE_PROCESSOR_PORT']
      end
    end
```

The _initialize_ method takes a path as an argument, so you can upload files into any folder you wish. Other than that we need to specify the _image_proxy_ host and port so uploader knows where to look for images.

Then the last part - _S3_ and a _bucket_ are configuration variables required by an [aws-sdk](https://github.com/aws/aws-sdk-ruby) gem to communicate with the AWS S3 API.

#### Generate Image version URL

Having the basic configuration in place, we need to have the method to upload versions to the S3 bucket. First, we need to generate the Image Proxy URL under which we will have the versioned image accessible to download and move to s3 later.

```ruby
    # ruby: generating image version url

    # Exeample version: Version.new(width: 1920, height: 600)
    def upload_version(url:, version:)
      version_path = get_version_path(url: url, version: version)
      # 1. download image from generated URL to tmpfile variable
      # 2. upload the tmp file to s3
      # 3. delete tmp file
    end

    private

    ...

    def get_version_path(url:, version:)
      options_string = [
        version.resize_type,
        version.width,
        version.height,
        version.gravity,
        version.enlarge
      ].join('/')
      "/insecure/#{options_string}/plain/#{url}@#{version.extension}"
    end
```

Here you can see that we use the _insecure_ version of genearted URLs instead of signed and encrypted url hashes.

That's because we use the Image Proxy in our internal docker network (using docker-compose) and nothing of that is accessible out of the intranet. So basically only services build in the same docker network can connect to it.

#### Download version and upload file to s3

Now we need a way to download an image from the generated URL and upload files under a specific path to s3 bucket.

```ruby
    # ruby: upload file to s3

    class Uploader
      def upload_version(url:, version:)
        version_path = get_version_path(url: url, version: version)

        # 1. download image from generated URL to tmpfile variable
        tmpfilename = [version.name, version.extension].join('.')
        File.open(tmpfilename, 'wb') do |file|
          file.write Net::HTTP.get(image_processor_host, version_path, image_processor_port)
        end

        # 2. upload the tmp file to s3
        version_url = ''
        File.open(tmpfilename) do |file|
          version_url = upload(file: file, name: version.name, extension: version.extension)
        end

        # 3. delete tmp file
        File.delete(tmpfilename)
        version_url
      end

      def upload(file:, name:, extension: nil)
        extension ||= File.basename(file).split('.').last
        name = "#{path}/#{name}.#{extension}"

        # create s3 object under specific path
        obj = s3.bucket(bucket).object(name)

        # Upload file to desitnation path
        obj.upload_file(file)
        Aws::S3::Client.new.put_object_acl(
          {
            acl: 'public-read',
            bucket: bucket,
            key: obj.key
          }
        )

        obj.public_url
      end

      private
       ...
    end
```

When you'll go through it step by step, it won't be complicated at all.

First, we fetch the versioned file from under the generated URL. Then we upload it to s3 using the _upload_ method and finally, we remove the temporary file.

We decided to have an extra _upload_ method, because thanks to this you can not only upload files from URLS, but you can also upload binary files to s3 directly.

And that's all. The complete file uploader with more flexibility than Capybara or ActiveStorage allows took only 60 lines of code.

## Alternatives

Chances are that you won't want to run image processing on your own server. Then you can be interested in checking some commercial solutions, like:

- [Imgix](https://www.imgix.com/) - an extended version of ImageProxy, with a lot of cool features and being managed by an external company. That took out of your head an even more overhead.
- [Thumbor](https://github.com/thumbor/thumbor) - another open-sourced library for processing images. Works similar to ImageProxy and depending on how ImageProxy will evolve, we can give this one a try in the future.

### Summary

The nice thing with using external services to process your images is that you can easily change adapters whenever needed.

In our implementation, we'd only need to adjust the \`upload_version\` and \`get_version_path\` methods to communicate with the other hosts.

And yes - that means, it's not perfect. The better way to do so would be by injecting the adapter into the uploader as a dependency and just replace adapter if needed. We'll do that in the future iterations.

**But what about you? How do You handle image processing in your projects?**

**Please share in the comments below!**

## Special Thanks

- [Will Norris](https://github.com/willnorris) for his great work on ImageProxy
