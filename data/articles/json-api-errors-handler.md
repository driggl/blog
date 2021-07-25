---
title: "JSON API Errors Handler - a new way of catching API exceptions in ruby"
excerpt: "JSON API Errors Handler is a natural follow up to the article I already wrote about handling exceptions in Ruby API applications. If you're looking for an easy to use, convenient solution, JSONAPIErrorsHandler is a choice for you."
slug: "json-api-errors-handler"
tags: []
thumbnail:
  big: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/3cf6f52c-14f6-42e1-bf9e-76d516ba053d/cover/blog.jpeg"
  full: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/3cf6f52c-14f6-42e1-bf9e-76d516ba053d/cover/full.jpeg"
  mini: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/3cf6f52c-14f6-42e1-bf9e-76d516ba053d/cover/mini.jpeg"
  small: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/3cf6f52c-14f6-42e1-bf9e-76d516ba053d/cover/small.jpeg"
  medium: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/3cf6f52c-14f6-42e1-bf9e-76d516ba053d/cover/medium.jpeg"
  sharing: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/3cf6f52c-14f6-42e1-bf9e-76d516ba053d/cover/sharing.jpeg"
  original: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/3cf6f52c-14f6-42e1-bf9e-76d516ba053d/cover/original.jpeg"
publishedAt: "2019-04-05"
author: "swilgosz"
---

When some time ago I came with an [advanced way of handling exceptions in Ruby Applications](https://driggl.com/blog/a/handling-exceptions-in-rails-applications) I realized, that this is a wider problem than I thought. A lot of people found the idea very useful and therefore I decided to go with this topic even further.

## JSON API Errors Handler

The natural follow-up is a [JsonapiErrorsHandler gem](https://rubygems.org/gems/jsonapi_errors_handler). This is a small, open-source package that you can hook into any kind of Ruby or Rails application and it helps you handle API errors in the really convenient way.

### How does it work?

The usual error handling in rails applications is well described in my previous post, so let's focus here on how the gem's behavior makes it easier for you to work with API errors.

<CourseAd />

The main idea is to support [JSON API standard](https://jsonapi.org) for your API communication. Whenever you'll raise an error in your application while processing the HTTP request, the _JsonapiErrorsHandler_ will handle that fact and remove the overhead from you by delivering the well-formatted response to the client.

![](https://driggl-prod.s3.amazonaws.com/media/project/e4bd6bca-6540-45d5-a89f-43f2dfd43f81/media_upload/c82c4aba-8f8b-49c3-bb21-0e1591afeb1b/media_file/blog_JsonapiErrorsHandler-Concept.jpg)JsonapiErrorsHandler gem's concept

As you can see, it's fairly simple. The idea is just to remove the responsibility to recognize serializable errors and the logic of translating it into JsonAPI-friendly format out of your application.

### Using JsonapiErrorsHandler gem.

To use the gem in the rails application, just go to your base API controller, and include those two lines at the top:

```ruby
    # app/controllers/api/application_controller.rb

    ...
    include JsonapiErrorsHandler

    rescue_from ::StandardError, with: lambda { |e| handle_error(e) }
    ...
```

By default, gem defines 5 types of errors that, when risen, are handled and transformed out of the box:

```ruby
- _JsonapiErrorsHandler::Errors::Unauthorized_ => status: 401
- _JsonapiErrorsHandler::Errors::Forbidden_ => status: 403
- _JsonapiErrorsHandler::Errors::NotFound_ => status: 404
- _JsonapiErrorsHandler::Errors::Invalid_ => status: 422
- _JsonapiErrorsHandler::Errors::StandardError_ => status: 500
```

If you want to return a friendly error message, just raise any of the errors above in your controller.

```ruby
    def show
      raise JsonapiErrorsHandler::Errors::NotFound unless ... # do the fancy find
    end
```

That's already looking pretty cool, but we can do even better.

JSON API Error Mapper

in rails applications, a very common way to find resources is by using the _find_ method. If you do so, in case of failure, there is already a default _Actvierecord::RecordNotFound_ exception risen. In such cases, Our code would not be too pretty, would it?

```ruby
    def show
      @user = User.find(params[:id])
    rescue ActiveRecord::RecordNotFound
      raise JsonapiErrorsHandler::Errors::NotFound
    end
```

In such cases, the custom ErrorMapper comes handy.

In JsonapiErrorsHandler you can have ANY error being mapped into any API-friendly error. Let's refactor our code above to make use of this feature.

```ruby
    # app/controllers/api/application_controller.rb

    ...
    include JsonapiErrorsHandler
    JsonapiErrorMapper.map_errors!({
      'ActiveRecord::RecordNotFound' => 'JsonapiErrorsHandler::Errors::NotFound'
    })
    rescue_from ::StandardError, with: lambda { |e| handle_error(e) }
    ...
```

Here in the application controller after including the JsonapiErrorsHandler gem we added an error mapping call. This way we informed the gem that whenever the error of a class specified in the key of the mapper is being risen, handle it using an instance of a class specified as a value.

This allows us to completely get rid of error's handling overhead from all controllers in our application:

```ruby
    def show
      @user = User.find(params[:id])
    end
```

### Using JsonapiErrorsHandler in non-rails applications

If you'll look into the gem's repository, currently there is only one line that kind of dependents of rails, and it's a method: _render_error_:

```ruby
    def render_error(error)
      render json: ::JsonapiErrorsHandler::ErrorSerializer.new(error), status: error.status   end
```

Here we use *render *function which is rails-specific. If you want to use the gem in [Sinatra](http://sinatrarb.com/), [Hanami](https://hanamirb.org/), or whatever else, just be sure you take this fact into the account. Either:

1.  Override a _render_error_ method in the class that includes the module
2.  implement the _render_ method, so the including class will have this accessible.

### Drawbacks

#### Help welcome

Currently, this gem was tested only with Rails applications, but it's designed in the way there should not be too much rails dependencies involved. There is still room to improve **So ANY contributions are very welcome**!

#### Next steps

For this gem, I'll work on mutation test coverage, improved code quality and reduce the dependency of any particular framework. Also, I plan to come with a few more useful API gems so **If you have any annoying problems in your Ruby applications, let me know in the comments**.

### Special thanks

1.  [Tamara Bellis](https://unsplash.com/@tamarabellis) for a great cover photo.
2.  [Nguyễn Trịnh Hồng Ngọc](https://medium.com/@ruby277) for a very early contribution to the gem and overall support.
3.  All students of the [Ruby on Rails REST API](https://www.udemy.com/ruby-on-rails-api-the-complete-guide/learn/) course who helped to make this gem real.
