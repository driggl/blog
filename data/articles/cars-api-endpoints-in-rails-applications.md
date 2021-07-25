---
title: "CQRS API endpoints in Rails applications"
excerpt: "CQRS in the API applications may be tricky at the start, but it is an amazing pattern to write complicated, scalable systems. Learn how to do it well."
slug: "cars-api-endpoints-in-rails-applications"
tags: [ "api", "cqrs", "rails", "ruby"]
thumbnail:
  big: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/e4a9621f-8900-4908-a7ae-4311565c5895/cover/blog.jpeg"
  full: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/e4a9621f-8900-4908-a7ae-4311565c5895/cover/full.jpeg"
  mini: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/e4a9621f-8900-4908-a7ae-4311565c5895/cover/mini.jpeg"
  small: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/e4a9621f-8900-4908-a7ae-4311565c5895/cover/small.jpeg"
  medium: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/e4a9621f-8900-4908-a7ae-4311565c5895/cover/medium.jpeg"
  sharing: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/e4a9621f-8900-4908-a7ae-4311565c5895/cover/sharing.jpeg"
  original: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/e4a9621f-8900-4908-a7ae-4311565c5895/cover/original.jpeg"
publishedAt: "2020-01-12"
author: "swilgosz"
---

[CQRS in the API](https://driggl.com/blog/a/cqrs-rest-api) applications may be tricky at the start, but it is an amazing pattern to write complicated, scalable systems.

Here is how we've implemented it in our projects by leveraging the usage of Microservices, Event Sourcing, and DDD.

> **Note:** In this article, I'll focus only on the write-side of the CQRS pattern

# Why CQRS?

In [Driggl](https://driggl.com/), we want to **be SOLID** developers, and though we're looking for ways to implement the best development patterns to keep our applications easy to extend, manage, and change.

Usual MVC architecture is completely insufficient for big web applications. **All of us know stories about a thousand lines controllers, fat models, and business logic in views**.

The issue is, that in the standard MVC architecture you just miss a lot of building blocks for your applications to keep your classes isolated and easy to test.

## Clean controllers

The CQRS pattern allows you to improve your application codebase by implementing transaction classes for every single endpoint you have in your controller.

<CourseAd />

The controller implementing this thing could look like this:

```ruby
# app/controllers/application_controller

    class OrdersController
      include Import[
       checkout: 'ordering.endpoints.checkout.transaction',
       update: 'ordering.endpoints.update.transaction'
      ]

      def update
       process_transaction(update)
      end

      def checkout
       process_transaction(checkout)
      end
    end
```

As you can see, **there is absolutely no logic in the controller itself**, as the knowledge about how to process the specific request lays inside of the transaction object defined per-endpoint.

This way, **all of your controller actions will look exactly the same**, so it's possible to slim the controller down even further by implementing simple DSL!

```ruby
#app/controllers/orders_controller.rb

    class OrdersController
      include Import[
       checkout: 'ordering.endpoints.checkout.transaction',
       update: 'ordering.endpoints.update.transaction'
      ]

      endpoint :update 
      endpoint :checkout
    end
```

But this can be an overhead and **I like to keep my apps in Ruby** without overusing DSLs :D

## A class for every step

Processing an API request can be a complicated thing. Let's take a sneak peek into the **Article publication process** just because it sounds so simple.

When you want to publish the article, you'll need several actions to be performed which could look like these:

- Deserialize request
- Fetch additional data (for example to authorize object)
- Authorize request
- Validate the input
- Change the article object state to _published_
- Publish on Facebook
- Publish on Twitter
- Send email notifications to your subscribers
- Serialize response

In a typical rails application, everything would be squeezed into three classes:

- controller - Deserialization, Fetching resources and authorization.
- model - Updating the database records, and all the rest is handled by the model and its callbacks.
- serializer/view. - Then, the updated model is delivered back to the client using a view or the serializer.

**Can you feel where is the problem? **

Even in this simple transaction, the controller has multiple responsibilities, and the model - even more.

So how can we improve on that?

# Railway oriented development

When the complexity of web applications grew over time, multiple concepts had been designed to solve that issue. One worth of considering is the [trailblazer ecosystem](http://trailblazer.to/) and the other one - the [dry-rb solutions](https://dry-rb.org/).

Trailblazer works great but implements a lot of DSL which makes it harder to learn for new developers coming to the company. Also, [they had some issues with maintaining some of their gems](https://www.ruby-toolbox.com/search?q=trailblazer) (When I write this article, it's much better) which made my clients hesitating to go with their solutions.

I was looking for a more Ruby-way and found _dry-rb_ which also meets all the needs of building extendable and maintainable complex projects. Also worth of mentioning is that [maintenance of their ecosystem ](https://www.ruby-toolbox.com/search?display=compact&q=dry-)is just amaizing.

The idea, however, is always similar. You implement an object being a transaction which collects all the steps needed to process the request.** No more callbacks!** No more models doing everything! No more coupling and loading all the files everywhere!

Here is a sample transaction processing the request described above:

```ruby
# app/endpoints/publish_article/transaction.rb

    module Endpoints
      module PublishArticle
       class Transaction < FastCqrs::Transaction
        import Import[
         'blogging/endpoints/publish_article/request',
         'blogging/endpoints/publish_article/valiator',
         'blogging/endpoints/publish_article/authorizer',
         publisher: 'blogging/services/article_publisher'
        ]

        def call(params, auth:)
         model = yield request.call(params)
         yield authorizer.call(subject: model, auth: auth)
         yield validator.call(model)
         yield update_article_status(model)
         yield article_publisher.call(model)
        end

        private

        def update_article_status(model)
         Article.find(model[:id]).publish!
        end
       end
      end
    end
```

By using [dry-system gem](https://dry-rb.org/gems/dry-system/) we inject dependencies into the transaction, so the transaction is completely agnostic about the implementation details. If you don't want to use _dry-system_, it's super easy to replace the _Import\[]_ call with the standard _initialize_ method:

```ruby
# app/endpoints/publish_article/transaction.rb
      ...

      private

      attr_reader :request, :validator, :authorizer, :publisher

      def initialize(request:, validator:, authorizer: publisher:)
       @validator = validator
       @authorizer = authorizer
       @request = request
       @publisher = publisher
      end
```

The idea is the same - You inject the dependencies from the outside of your class, so the class itself does not need to know about details of the implementation. The transaction class does nothing except orchestrating the blocks to handle the

> **Note:** In most of my projects I use events to handle everything that happens after validation. If the request is valid , I just publish the event to the Event Store and the subscribers handle all actions that should happen asynchronously.

## But Isn't it more code to be written?

It is. And for me, it's fine - you can read more about [why we aren't DRY in Driggl](<why we aren't DRY in Driggl>) to get more insights about our philosophy. I like to write more code if what I get instead is the simplicity of testing, making changes, and extending the project.

<Om om="om-s0j6hwqdlbmhoiehwh2d-holder" />

Too often I needed to work on projects that because of tight coupling everywhere and spaghetti code make impossible to introduce change without breaking a random part of the application.

**So let's go through the benefits** of implementing API request handlers like this:

### 1. Easily testable code 

You can test every single step of the transaction using unit testing, in complete isolation. You don't need to even include the rails framework most of the time which makes everything super fast.

### 2. Fast development

Adding new endpoints, adding changes, or removing the code is super fast and easy. You don't need to even run your server to be sure that the app is working well.

Do you want to remove the endpoint?

1.  Remove the endpoint folder
2.  Remove the action in the controller
3.  Remove the route.

**You'll never have a situation, where, by removing a validation, you'll break a random part of the system.**

### 3. Easy to replace steps

Because you have every single step injected from the outside, it's super easy to just replace any part with anything else.

### 4. Faster CI/CD

Faster tests mean faster deployments, which allow writing better test coverage without increasing the cost and shorten time-to-market for every new feature.

# What about other building blocks?

The thing is, that you can put to the transaction whatever you need to process it.

From my experience, validation, authorization, deserialization, and fetching additional data from the database are the most common steps, used almost everywhere. This is why **I've extracted the shared code for these steps into a gem** named: [FastCqrs](https://github.com/driggl/fast_cqrs) - super simple, super skinny gem when you get a basic configuration for objects like:

1.  **Request** - uses injected deserializer to fetch additional required data from the system and transform given input to the output understandable by transaction
2.  **Authorizer** - a class that accepts the given resource and the authentication data object and returns true or false depending on the access given
3.  **Transaction** - dry-rb based transaction class to orchestrate all building blocks required to process the given request. It uses do-notation and dry-matcher to easily handle failures.

# Summary 

CQRS,** when handled properly**, is a great pattern to speed up the development of the API applications. Even though you write more code at the beginning, **the complexity of each action remains the same, no matter how much the complexity of the whole project grows**.

This is great because the efficiency of your team does not go down over time which means the more complex projects you have, the more profitable it is to extend it!

# What do you think about this approach? 

Do you use CQRS in your applications? Which solution you use and why? Share in the comments!

### Special thanks!

- [Simon Rae](unsplash.com/@simonrae) for a great cover image!
- [Piotr Solnica](https://github.com/solnic) - for creating amazing dry-rb ecosystem
