---
title: "Adding links to the fast_jsonapi serializer "
excerpt: "How to add related links, pagination data and other extra information in your JSON API applications using fast_jsonapi gem?"
slug: "adding-links-to-fast_jsonapi-serializer"

tags: []
thumbnail:
  big: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/7e6bf0a1-a5bb-4962-9b11-2a5e10a3370d/cover/blog.jpeg"
  full: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/7e6bf0a1-a5bb-4962-9b11-2a5e10a3370d/cover/full.jpeg"
  mini: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/7e6bf0a1-a5bb-4962-9b11-2a5e10a3370d/cover/mini.jpeg"
  small: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/7e6bf0a1-a5bb-4962-9b11-2a5e10a3370d/cover/small.jpeg"
  medium: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/7e6bf0a1-a5bb-4962-9b11-2a5e10a3370d/cover/medium.jpeg"
  sharing: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/7e6bf0a1-a5bb-4962-9b11-2a5e10a3370d/cover/sharing.jpeg"
  original: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/7e6bf0a1-a5bb-4962-9b11-2a5e10a3370d/cover/original.jpeg"
publishedAt: "2018-11-21"
author: "swilgosz"
---

Not so far ago I wrote about[ moving your API Rails application to use fast_jsonapi gem from Netflix](https://driggl.com/blog/a/from-activemodel-serializers-to-fast-jsonapi) for serialization purposes. It appeared to be very useful and few of my **students asked if I can also add information about including links in the API response**. So here it is!

### What are the links in JSON API response?

As you probably know, the [fast_jsonapi](https://github.com/Netflix/fast_jsonapi) gem is written to support json API format for server responses which are described very well in the [documentation](https://jsonapi.org/). Basically, it requires the server to respond with a *:data* object where we include all content-related information.

The single object can look like this:

```json
   Single article response

    {
        "data": {
            "id": "7e6bf0a1-a5bb",
            "type": "articles",
            "attributes": {
                "title": "Amazing article,
                "content": "Sample article content",
                ...
                "created_at": "2018-11-20T19:18:13.967Z",
             }
        }
    }
```

Here's an example of JSON API formatted response. All the resource-related data are nested in the _data_ wrapper, which includes the _type_ of requested resource, its _id_ and a hash that consists of all object attributes we want to deliver.

If we request the collection instead of the single object, the main difference is that all you get in the example above is** wrapped in an array.**

```json
Single article response

    {
        "data": [
            {
                "id": "7e6bf0a1-a5bb",
                "type": "articles",
                "attributes": { .. }
            },
            {
                "id": "2lkj50-23n4i7",
                "type": "articles",
                "attributes": { .. }
            }
        ]
    }
```

Nothing special at this point. But there is a problem here. Sometimes you'd like to include some kind of **meta information**, like a current page of the response or a number of total pages in the available collection. If you'll check the [fetching pagination](https://jsonapi.org/format/#fetching-pagination) section of the JSON API documentation, you'll see that this information should be placed in the LINKS root key of the returned JSON.

```json
    "data": { .... },
    "links": {  "self": "https://api.driggl.com/articles" }
```

This links can include information about:

- first page of the collection
- previous page
- current (self) page of the results
- next page
- last available page
- ... something else you think your API consumers would like to have.

The ActiveModelSerializers gem provides that functionality out of the box if you used, for example, a [Kaminari](https://github.com/kaminari/kaminari) gem so the question is: why the Gem from Netflix does not?

<CourseAd />

### Optional sections for JSON API format.

The answer is simple. It's optional.

The quote above comes directly from the documentation and it clearly says, that providing links is completely optional and one does not need to use it at all. Also, there is no mention about the format of the URLs themselves.

This is why in fast_jsonapi Netflix decided to leave implementing the links generation to the application owner, but the good news is, they support adding those extra fields in a super easy way.

### Adding links section to the JSON API response

Let's assume you have an index action in your controller, that looks like this:

```ruby
# app/controllers/articles_controller.rb

    class ArticlesController < ApplicationController
      def index
        paginated = Article.all.page(current_page).per(per_page)
        render json: ArticleSerializer.new(paginated)
      end

      private

      def current_page
        (params[:page] || 1).to_i
      end

      def per_page
        (params[:per_page] || 20).to_i
      end
    end
```

And the serializer that implements the fast_jsonapi gem:

```ruby
# app/serializer/article_serializer.rb

    class ArticleSerializer < ApplicationSerializer
      set_type :articles
      attributes :title, :content
    end



    # ruby: app/serializers/application_serializer.rb
    class ApplicationSerializer
      include FastJsonapi::ObjectSerializer
    end
```

If you'll send the request, you'll end up with only the *:data* key being returned.  To add links, you just need to extend your serializer's initialization by passing a second argument: a hash including the extra root keys you want to pass.

```ruby

# app/controllers/articles_controller.rb

    def index
      paginated = Article.all.page(current_page).per(per_page)
      options = {
        links: {
          first: api_articles_path(per_page: per_page),
          self: api_articles_path(page: current_page, per_page: per_page),
          last: api_articles_path(page: paginated.total_pages, per_page)
        }
      }
      render json: ArticleSerializer.new(paginated, options)
    end
```

This will result with a server response including both: _data_ and _links_ sections returned next to each other:

```json
    "data": { .... },
    "links": {  
        "first": "https://api.driggl.com/articles?per_page=20" 
        "self": "https://api.driggl.com/articles?page=4&per_page=20",
        "self": "https://api.driggl.com/articles?page=18&per_page=20",
    }
```

That's pretty cool, but we can do much better...

### Collection meta generator

First of all, if we would like to have something like metadata included with total pages and current_page listed there, we would not want to repeat the same logic over and over again. The similar thing applies for generating the links only.

As we are professional developers,** we want to keep things DRY**, so placing links generation logic inside of the index action does not seem to be the best idea.

The next problem we would like to solve is the conditional link generation. We would like to add _next_ and _prev_ links but ONLY if proper conditions match.

But that's additional logic, and **adding logic in controllers is BAAAAD.**

So the solution for that would be **a generator class that will be easily reusable wherever we want.**

#### Calling the metadata generator

The idea is to simplify the controller as much as possible while keeping the service as reusable as possible. This is why we resign of using rails path helpers and will pass the request object from the controller to generate URLs base on that.

```ruby
# app/controllers/articles_controller.rb

    ...
        def index
          paginated = Article.all.page(current_page).per(per_page)
          options = PaginationMetaGenerator.
            new(request: request, total_pages: paginated.total_pages).call()
          render json: serializer.new(paginated, options)
        end
    ...
```

We instantiate a PaginationMetaGenerator with a _request_ and _total_pages_ arguments and call the default method to return the _options_ hash. As this functionality is specific to the controllers, it's fine to depend on such object as a request - otherwise, you'd need to pass current_page, per_page, and proper URL to the initializer. I don't like having too many arguments in the list, so I decided to go this way.

#### The scaffold of the service

```ruby
# app/services/pagination_meta_generator.rb

    class PaginationMetaGenerator
      DEFAULT_PAGE = 1
      DEFAULT_PER_PAGE = 20


      def initialize(request:, total_pages:)
        @url = request.base_url + request.path
        @page = request.params[:page].to_i
        @per_page = request.params[:per_page].to_i
        @total_pages = total_pages
        @hash = { links: {}, meta: { current_page: page, total_pages: total_pages }
      end

      def call
        ...
      end

      private

      attr_accessor :url
      attr_reader :per_page, :page, :total_pages

      ...
    end
```

This is the scaffold of our service. It sets up the necessary variables, together with calculating the URL of the request without parameters. Having that I can generate the options hash and return it in the _call_ method.

#### The metadata generation

```ruby
# app/services/pagination_meta_generator.rb

    ...
      def call
        if page > 1
          hash[:links][:first] = generate_url(1)
          hash[:links][:prev] = generate_url(page - 1)
        end
        hash[:links][:self] = generate_url(page)
        if page < total_pages
          hash[:links][:next] = generate_url(page + 1)
          hash[:links][:last] = generate_url(total_pages)
        end
        hash
      end

      private

      attr_reader :per_page, :page, :total_pages
      attr_accessor :url

      def generate_url(page)
        [url, url_params(page)].join("?")
      end

      def url_params(page)
        url_params = {}
        url_params[:per_page] = per_page if include_per_page?
        url_params[:page] = page if include_page?(page)
        url_params.to_query
      end

      def include_per_page?
        (per_page != 0) && (per_page != DEFAULT_PER_PAGE)
      end

      def include_page?(page)
        (page != 0) && (page != DEFAULT_PAGE)
      end
    ...
```

As you can see, there is much more logic here that allows us to dynamically generate links depending on the current page number, and it would be hard to place it all directly in the controller.

### Summary

The fast_jsonapi require a little more code to be written to achieve similar functionality as the ActiveModelSerializers delivers out of the box, but at the same time it gives you more control on your application and delivered response and I kind of like that.

**What do you think about this implementation? Please share your thoughts in the comments!**

#### Special Thanks

- [Fahrul Azmi](https://unsplash.com/@fahrulazmi) for the great cover photo
- [Felipe Diógenes](http://github.com/felipedf) - for inspiring me to write this article.
