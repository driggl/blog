---
title: "A gem from Netflix the best serializer?"
excerpt: "Keeping the pace with changing technologies and dependencies is the hardest part in developer's live. The \"Active Model .Serializers\" gem is not longer supported, so we looked for alternative - this time Netflix comes with help."
slug: "from-activemodel-serializers-to-fast-jsonapi"

tags: []
thumbnail:
  big: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/9dfad2e6-326f-47a8-a9aa-d1b94b217c3e/cover/blog.jpeg"
  full: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/9dfad2e6-326f-47a8-a9aa-d1b94b217c3e/cover/full.jpeg"
  mini: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/9dfad2e6-326f-47a8-a9aa-d1b94b217c3e/cover/mini.jpeg"
  small: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/9dfad2e6-326f-47a8-a9aa-d1b94b217c3e/cover/small.jpeg"
  medium: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/9dfad2e6-326f-47a8-a9aa-d1b94b217c3e/cover/medium.jpeg"
  sharing: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/9dfad2e6-326f-47a8-a9aa-d1b94b217c3e/cover/sharing.jpeg"
  original: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/9dfad2e6-326f-47a8-a9aa-d1b94b217c3e/cover/original.jpeg"
publishedAt: "2018-10-16"
author: "swilgosz"
---

Keeping the pace with changing technologies and dependencies is the **hardest part in developer's live**. The "[ActiveModel .Serializers](https://github.com/rails-api/active_model_serializers)" gem is no longer supported, so we looked for an alternative - this time Netflix comes with help.

### ActiveModelSerializers Not updated anymore!

When JSON API format for API responses become a standard, it started to be clear that projects need a nice object serialization solution for unifying code across the whole code base. For a long time I used the ActiveModelSerializers gem for that, but unfortunately, that is not updated anymore.

![](https://driggl-prod.s3.amazonaws.com/media/media_upload/media_file/3876f383-b175-412b-842a-e59e55174e3d/blog_1539073895104.png)

Because of that I looked for alternatives and found that the best candidate to replace obsolete gem is [Fast JsonAPI gem](https://github.com/Netflix/fast_jsonapi) delivered by Netflix.

<CourseAd />

### Moving from ActiveModelSerializers to Fast JSON API

If you have an existing application that uses activemodel_serializers gem and you want to move into the fast_jsonapi, you won't have too much of troubles. Both gems are pretty similar in concept. you define a serializer for each processed resource and you use it in the controller to transform your Ruby objects into JSON hashes in an appropriate structure.

#### Modulized approach instead of inheritance

First of all, let's take a look what is different in both of those gems:

```ruby
    # ActiveModelSerializers approach

    class ArticleSerializer < ActiveModel::Serializer
      attributes :id, :title, :content, :slug
    end
```

In the example above we have the ArticleSerializer class which inherits from ActiveModel::Serializer class to apply expected behavior.

```ruby
    # Fast JSON API approach

    class ArticleSerializer
      include FastJsonapi::ObjectSerializer
      attributes :title, :content, :slug
    end
```

As you can see, there are two key differences.

First of all, you need to include the FastJsonapi::ObjectSerializer instead of inherits from the base gem. This is not a problem if you'll use the application serializer as the base serialization class for your application and inherits from it.

In that approach you would only need to apply this change in one file:

```ruby
    # Fast JSON API approach

    class ApplicationSerializer
      include FastJsonapi::ObjectSerializer
    end

    class ArticleSerializer < ApplicationSerializer
      attributes :title, :content, :slug
    end
```

#### No *:id* in attributes

You probably noticed, that in the second example there is no *:id* key listed in attributes. That's because the _fast_jsonapi_ gem requires *:id* by default on any object you pass in through initialization.

```ruby
      # ActiveModelSerializers approach
      attributes :id, :title, :content, :slug

      # Fast JSON API approach
      attributes :title, :content, :slug
```

No default serializer in controllers

When we used _ActiveModelSerializers_ gem our controller used a serializer that matched our object class by default and personally I liked it more. Thanks to that we could not bother with serializers at all in our controllers keeping them nice and clean:

```ruby
    class ArticlesController < ApplicationController
      def index
        render json: Article.all
      end


      def show
        render json: Article.find(params[:id])
      end
    end
```

Now we need to explicitly define which serializer we want to use by wrapping the rendered result into the new instance of the serializer class.

```ruby
    class ArticlesController < ApplicationController
      def index
        render json: serializer.new(Article.all)
      end


      def show
        render json: serializer.new(Article.find(params[:id]))
      end

      private

      def serializer
        ArticleSerializer
      end
    end
```

Overall I don't think it's too much effort, especially because in every case the serializer initialization looks completely the same, and that allows us to write helper methods that do that for us. However, if you have a big application, you could avoid changing dozens of controllers and writing additional code for each action you add to your application by overriding the render method.

```ruby
    # app/controllers/application_controller

    def render(options={})
      options[:json] = serializer.new(options[:json])
      super(options)
    end
```

Thanks to this change you won't need to do any change in your controllers except defining the _serializer_ method.

#### Manually added extra parameters

If you want to add extra parameters, like metadata or links, they need to be explicitly passed via the _options_ hash. I wrote a whole article guiding [how to add links and metadata to the serialized response](https://driggl.com/blog/a/adding-links-to-fast_jsonapi-serializer) as it's quite a wide topic.

### Summary

It's always hard to keep up to date with trends and dependency updates and we can't avoid such refactoring in our applications from time to time. When we need to do it, however, it's nice to change it the fastest way possible. It's nice to have your application written in a way that supports such changes without too much effort. Here are a few tips I found useful every time I change any gem I use for my application, rewritten for this serialization stuff.

1.  Use the base ApplicationSerializer where you extract any stuff dependent on other libraries.
2.  Don't put logic into your controllers.
3.  Name your serializers, models and all other classes in a unified way.
4.  Keep it DRY

And which gem do you use to serialize API responses? **Share in the comments**!

#### Special thanks

1.  [freestocks](https://unsplash.com/@freestocks) for the great cover photo
