---
title: "Handling exceptions in Rails API applications"
excerpt: "Handling exceptions in your API applications is quite an important thing, and if you want to keep things DRY, you should think how to do it in the proper way."
slug: "handling-exceptions-in-rails-applications"

tags: []
thumbnail:
  big: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/de66af82-1a46-4caa-9d3b-2e221cabc0e1/cover/blog.jpeg"
  full: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/de66af82-1a46-4caa-9d3b-2e221cabc0e1/cover/full.jpeg"
  mini: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/de66af82-1a46-4caa-9d3b-2e221cabc0e1/cover/mini.jpeg"
  small: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/de66af82-1a46-4caa-9d3b-2e221cabc0e1/cover/small.jpeg"
  medium: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/de66af82-1a46-4caa-9d3b-2e221cabc0e1/cover/medium.jpeg"
  sharing: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/de66af82-1a46-4caa-9d3b-2e221cabc0e1/cover/sharing.jpeg"
  original: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/de66af82-1a46-4caa-9d3b-2e221cabc0e1/cover/original.jpeg"
publishedAt: "2018-10-25"
author: "swilgosz"
---

Handling exceptions in your API applications is quite an important thing, and if you want to keep things DRY, you should think how to do it in the proper way. In our [Ruby on Rails API course](https://www.udemy.com/ruby-on-rails-api-the-complete-guide/), I've shown how to implement the error handling using ErrorSerializer and ActiveModelSerializers gem and here I'm going to show you even better approach to this topic when you can unify EVERY error across the whole API application.

<CourseAd />

> UPDATE: I've recently came with even [greater way of handling Errors in Rails Web applications using "dry-monads"](https://hanamimastery.com/episodes/7-untangle-your-app-with-dry-monads)! It still uses this approah to serilize the errors for JSON:API purposes, but the actual mapping can be done in the more neat way!

### The final approach

There is no point to cover the whole thought process of how we came with the final result, but if you're interested in any particular part just say it in the comments. The basic assumptions were to keep things DRY and unified across the whole application.

So here is the code.

#### The standard error.

```ruby
    # app/lib/errors/standard_error.rb

    module Errors
      class StandardError < ::StandardError
        def initialize(title: nil, detail: nil, status: nil, source: {})
          @title = title || "Something went wrong"
          @detail = detail || "We encountered unexpected error, but our developers had been already notified about it"
          @status = status || 500
          @source = source.deep_stringify_keys
        end

        def to_h
          {
            status: status,
            title: title,
            detail: detail,
            source: source
          }
        end

        def serializable_hash
          to_h
        end

        def to_s
          to_h.to_s
        end

        attr_reader :title, :detail, :status, :source
      end
    end
```

First of all we needed to have the Base error, which will be a fallback for any exception risen by our application. As we use [JSON API](https://jsonapi.org/) in every server's response, we wanted to always return an error in the format that JSON API describes.

We extracted all error-specific parts for every HTML status code we wanted to support, having a fallback to _500._

### More detailed errors

As you can see this basic error was just a scaffold we could use to override particular attributes of the error object. Having that implemented, we were able to instantiate several case-specific errors to deliver more descriptive messages to our clients.

```ruby
    # app/lib/errors/unauthorized.rb

    module Errors
      class Unauthorized < Errors::StandardError
        def initialize
          super(
            title: "Unauthorized",
            status: 401,
            detail: message || "You need to login to authorize this request.",
            source: { pointer: "/request/headers/authorization" }
          )
        end
      end
    end



    # app/lib/errors/not_found.rb

    module Errors
      class NotFound < Errors::StandardError
        def initialize
          super(
            title: "Record not Found",
            status: 404,
            detail: "We could not find the object you were looking for.",
            source: { pointer: "/request/url/:id" }
          )
        end
      end
    end
```

All errors are very clean and small, without any unnecessary logic involved. That's reasonable as we don't want to give them an opportunity to fail in an unexpected way, right?

Anyway defining the error objects is only the half of the job.

### Serializing the error in Ruby Application

This approach above allowed us to use something like:

```ruby
    ...
    def show
      Article.find(params[:id])
    rescue ActiveRecord::RecordNotFound
      e = Errors::NotFound.new
      render json: ErrorSerializer.new(e), status: e.status
    end
    ...
```

To serialize the standard responses we use [_fast_jsonapi_ gem from Netflix](https://driggl.com/blog/a/from-activemodel-serializers-to-fast-jsonapi). It's quite nice for the usual approach, but for error handling not so much so we decided to write our own _ErrorSerializer_.

```ruby
    # app/serializers/error_serializer.rb

    class ErrorSerializer
      def initialize(error)
        @error = error
      end

      def to_h
        serializable_hash
      end

      def to_json(payload)
        to_h.to_json
      end

      private

      def serializable_hash
        {
          errors: Array.wrap(error.serializable_hash).flatten
        }
      end

      attr_reader :error
    end
```

The logic is simple. It accepts an object with _status_, _title_, _detail_ and _source_ methods, and creates the serialized responses in the format of:

```json
    # json response

    {
      "errors": [
        {
          "status": 401,
          "title": "Unauthorized",
          "detail": "You need to login to authorize this request.",
          "source": {
            "pointer": "/request/headers/authorization"
          }
        }
      ]
    }
```

The only problem here is that handling all of those errors in every action of the system will end up with a lot of code duplications which is not very DRY, is it? I could just raise proper errors in the services, but standard errors, like _ActiveRecord::RecordNotFound_ would be tricky. This is then what we ended up within our API _ApplicationController_:

```ruby
    # app/controllers/application_controller.rb

    class ApplicationController < ActionController::API
      ...
      include Api::ErrorHandler
      ...
    end
```

We just included the _ErrorHandler_ module, where we implemented all mappings and the logic responsible for all error handling.

```ruby
    module Api::ErrorHandler
      extend ActiveSupport::Concern

      ERRORS = {
        'ActiveRecord::RecordNotFound' => 'Errors::NotFound',
        'Driggl::Authenticator::AuthorizationError' => 'Errors::Unauthorized',
        'Pundit::NotAuthorizedError' => 'Errors::Forbidden'
      }

      included do
        rescue_from(StandardError, with: lambda { |e| handle_error(e) })
      end

      private

      def handle_error(e)
        mapped = map_error(e)
        # notify about unexpected_error unless mapped
        mapped ||= Errors::StandardError.new
        render_error(mapped)
      end

      def map_error(e)
        error_klass = e.class.name
        return e if ERRORS.values.include?(error_klass)
        ERRORS[error_klass]&.constantize&.new
      end

      def render_error(error)
        render json: Api::V1::ErrorSerializer.new([error]), status: error.status
      end
    end
```

At the top, we added a nice mapper for all errors we expect to happen somewhere. Then we rescue from the [default error for the _rescue_ block](https://blog.honeybadger.io/understanding-the-ruby-exception-hierarchy/), which is the _StandardError_, and call the _handle_error_ method with the risen object.

Inside of this method we just do the mapping of the risen error to what we have server responses prepared to. If none of them matches, we fall back to our _Errors::StandardError_ object so client always gets the nice error message in the server response.

We can also add extra notifiers for any error that is not mapped in the handler module, so application admins will be able to track the unexpected results.

### Rising errors in the application

In Driggl we managed to create a unified solution for the whole error handling across our API application. This way we can raise our errors in a clean way without repeating any rescue blocks, and our ApplicationController will always handle that properly.

```ruby
    def show
      Article.find!(params[:id])
    end
```

or

```ruby
    def authorize!
      raise Errors::Unauthorized unless currentuser
    end
```

### Handling validation errors

Well, that is a nice solution, but there is one thing we intentionally omitted so far and it is:** validation failure.**

The problem with validations is that we can't write the error object for invalid request just as we did for the rest, because:

- the failure message differs based on the object type and based on attributes that are invalid
- one JSON response can have multiple errors in the returned array.

This requires us add one more error, named Invalid, which is an extended version of what we had before.

```ruby
    # app/lib/errors/invalid.rb

    module Errors
      class Invalid < Errors::StandardError
        def initialize(errors: {})
          @errors = errors
          @status = 422
          @title = "Unprocessable Entity"
        end

        def serializable_hash
          errors.reduce([]) do |r, (att, msg)|
            r << {
              status: status,
              title: title,
              detail: msg,
              source: { pointer: "/data/attributes/#{att}" }
            }
          end
        end

        private

        attr_reader :errors
      end
    end
```

You can see that the main difference here is the serialized_hash and initialize method. The initialize method allows us to pass error messages hash into our error object, so then we can properly serialize the error for every single attribute and corresponding message.

Our ErrorSerializer should handle that out of the box, returning:

```json
    # json response

    {
      "errors": [
        {
          "status": 422,
          "title": "Unprocessable entity",
          "detail": "Can't be blank",
          "source": {
            "pointer": "/data/attributes/title"
          }
        },
        {
          "status": 422,
          "title": "Unprocessable entity",
          "detail": "Can't be blank",
          "source": {
            "pointer": "/data/attributes/content"
          }
        }
      ]
    }
```

The last thing, however, is to rise it somewhere, so the handler will get the exact error data to proceed.

In the architecture we have, it's a not big deal. It would be annoying if we would go with updating and creating objects like this:

```ruby
    app/controllers/articles_controller.rb

    class ArticlesController < ApplicationController
      def create
        article = Article.new(article_params)
        article.save!
      end

      private

      def article_attributes
        params.permit(:title)
      end
    end 
```

As this would force us to rescue the _ActiveRecord::RecordInvalid_ error in every action, and instantiate our custom error object there like this:

```ruby
      def create
        article = Article.new(article_params)
        article.save!
      rescue ActiveRecord::RecordInvalid
        raise Errors::Invalid.new(article.errors.to_h)
      end
```

Which again would end up with repeating a lot of rescue blocks across the application.

In Driggl however, we do take advantage of Trailblazer architecture, with contracts and operations, which allows us to easily unify every controller action in the system.

```ruby
    # app/controllers/articles_controller.rb

    class ArticlesController < ApplicationController
     def create
        process_operation!(Admin::Article::Operation::Create)
      end

      def update
        process_operation!(Admin::Article::Operation::Update)
      end
    end
```

I won't go into details of Trailbalzer in this article, but the point is that we could handle the validation errors once inside of the _process_operation!_ method definition and everything works like a charm across the whole app, keeping things still nice and DRY

```ruby
    # app/controllers/application_controller.rb

    class ApplicationController < ActionController::API
      private

      def process_operation!(klass)
        result = klass.(serialized_params)
        return render_success if result.success?
        raise Errors::Invalid.new(result['contract.default'].errors.to_h)
      end

      def serialized_params
        data = params[:data].merge(id: params[:id])
        data.reverse_merge(id: data[:id])
      end

      def render_success
        render json: serializer.new(result['model']), status: success_http_status
      end

      def success_http_status
        return 201 if params[:action] == 'create'
        return 204 if params[:action] == 'destroy'
        return 200
      end
    end
```

### Summary

You could think it's a lot of code, but really, for big applications it's just nothing comparing to repeating it in hundred of controllers and other files. In this form we managed to unify all our errors across the whole API application and we don't need to worry anymore about unexpected failures delivering to the client.

I hope this will be useful for you too, and** if you'll find any improvements for this approach, don't hesitate to let me know in the comments!**

#### Special Thanks:

- [Cristopher Jeschke](https://unsplash.com/@cristofer) for a nice cover image

**Other resources: **

- [Custom exceptions in Ruby](https://blog.appsignal.com/2018/07/03/custom-exceptions-in-ruby.html) by Appsignal
- [Error Hierarchy in Ruby](https://blog.honeybadger.io/understanding-the-ruby-exception-hierarchy/) by Starr Horne
