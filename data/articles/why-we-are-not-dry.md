---
title: "Why we aren't DRY in Driggl"
excerpt: "You probably hear everywhere to be as DRY as possible. This stands for: Don't Repeat Yourself. Well, I'm here to tell you something else. In this article, I'll tell you why in Driggl, we don't necessarily want to be DRY while still writing the perfect code."
slug: "why-we-are-not-dry"

tags: []
thumbnail:
  big: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/a5be80ba-f06a-4e0f-b3d5-b05cc0800a4c/cover/blog.jpeg"
  full: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/a5be80ba-f06a-4e0f-b3d5-b05cc0800a4c/cover/full.jpeg"
  mini: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/a5be80ba-f06a-4e0f-b3d5-b05cc0800a4c/cover/mini.jpeg"
  small: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/a5be80ba-f06a-4e0f-b3d5-b05cc0800a4c/cover/small.jpeg"
  medium: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/a5be80ba-f06a-4e0f-b3d5-b05cc0800a4c/cover/medium.jpeg"
  sharing: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/a5be80ba-f06a-4e0f-b3d5-b05cc0800a4c/cover/sharing.jpeg"
  original: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/a5be80ba-f06a-4e0f-b3d5-b05cc0800a4c/cover/original.jpeg"
publishedAt: "2020-02-19"
author: "swilgosz"
---

So **you want to be the best developer in the world**. Awesome, let's continue then.

You start coding, writing some personal or commercial projects, and then you hear about being DRY, which stands for: "Don't. Repeat. Yourself". You hear, that whenever the same line of code is repeated in three or more places, it should be extracted to the single, shared library, class or a module and injected wherever it's required.

It's nice, if not to say: **amazing**. Whenever you need to change something, **you only need to apply this change in a single piece of code**.

So what could possibly go wrong with this?

## Be a SOLID developer.

While being DRY is nice, there is one more acronym - [SOLID](https://hackernoon.com/solid-principles-made-easy-67b1246bcdf). So I want to be a SOLID developer more than being DRY because when I'm wet, I also can have a lot of fun and write more SOLID code.

Amen. TLDR, you can finish here.

But if you want to build a big project, have big clients, let me explain in detail the problem I see.

### Developing Big applications.

I struggled a lot with the fact, that nowadays people learn frameworks more than the actual development.

Therefore, things like Rails are being created and everyone starts to put everything in one place.

You've heard about the MVC architectural pattern for web applications, didn't you? To be sure we're on the same stage:

- M - stands for models
- V - are the views
- C - controllers that glues those above together

Of course, you did. You can [create a blog in 15 min in Rails](https://youtu.be/Gzj723LkRJY), and yes, this pattern above will be great to achieve that.

But (un)fortunately projects have a tendency to grow. Especially *successful* projects. And correct me if I'm wrong, but **you want to work on successful projects, don't you**?

Unfortunately, for mature businesses and extra sites, this MVC architectural pattern does not make sense anymore.

Several times I worked with big, old rails applications where always the same problems appeared:

- logic in views
- direct database calls in helpers
- thousands of lines long controller files
- models doing just everything

You can feel, that this is wrong. You know that, however, such frameworks as rails actually doesn't help you with solving the problem. It's because frameworks will not teach you programming.

This is what you need to do on your own.

### So let's focus on API for now.

When you write an API application, You will need endpoints. A lot of them. And I mean -_ a lot_. Keep in mind, that I'm not talking here about single-page applications, company landing pages, blogs or anything like that.

When you want to participate in big projects, you need to prepare yourself, that you'll need a lot of endpoints.

> If you want to grasp an example, take a look at the [Github's Public API](https://developer.github.com/v3/) - and keep in mind that it's **just the public part**.

So you may think:

Ok, if I need authorization for my app, I'll use a [cancancan gem](https://github.com/CanCanCommunity/cancancan) to integrate the access checks. It's amazingly simple in use, and it's DRY. All your access checks are in one place. Easily trackable, easily extendable... but not for long.

At some point, your \`Ability\` class will contain thousands of lines of code because it is designed to collect all the access checks, all possible use cases, user roles and objects and all integrations between them in one place.

This is DRY. But not SOLID. Not at all.

### How could we improve on that?

There is one specific part of the SOLID acronym that I like a lot, and it is the "S" letter in particular. Not because it's the first letter of my name, but rather because it stands for "Single Responsibility Principle".

When You'll think about it, You'll see, that abilities in the Cancancan approach are violating that rule. They just do too much. And of course, you can split them apart, but still - as they're designed this way, they have a tendency to grow.

This is why I think a much better approach is to write a simple *Policy class* for every single endpoint you have in your application. And as the [Pundit gem](https://github.com/varvet/pundit) is so popular, I have a feeling that I'm not alone in this kind of thinking.

However, this is more code. More files. And if I'll need to change something important, there is quite a big chance I'll need to jump into different files and apply the same change in multiple places, so what a trade-off I get instead?

Well, a peaceful mind.

## Benefits of writing more files.

If I'll abandon the idea of keeping things always DRY, a whole lot of possibilities suddenly start to be accessible for me.

- TDD, 100% test coverage in unit testing.
- CQRS.
- Event Sourcing
- Microservices architecture

This is all possible only if we'll get rid of the idea to put everything into your models. In [Driggl](https://driggl.com), and actually, in all the projects I'm working on, we have different classes for:

- Endpoint's actions
- Request deserialization
- Action Policies or Authorizers
- Contracts or Validators
- Controllers
- Models
- Serializers
- Services
- Commands
- Command Handlers
- Events
- Event Handlers
- ... and few more

It can feel like a lot of classes and that's true. But what I have in exchange is that I can test any part of the system explicitly, mocking all the dependencies, and not run the web server at all! That's just super fast and allows us to engage new developers easily to work only in specific components without even knowing about the rest of the applications.

### An example of Not DRY code.

Here is an example of the code, that is not DRY at all, but at the same time is pretty neat.

```ruby
    # ruby: /articles/contracts/create.rb

    module Articles
      module Contracts
       class Create < ::ApplicationContract
        params do
         required(:id).value(Types::UUID)
         required(:author_id).value(Types::UUID)
         required(:blog_id).value(Types::UUID)  
         optional(:title).maybe(Types::String)
         optional(:excerpt).maybe(Types::String)
         optional(:category_id).maybe(Types::UUID)
        end
       end
      end
    end



    # ruby: /articles/contracts/update.rb

    module Articles
      module Contracts
       class Update < ::ApplicationContract
        params do
         required(:id).value(Types::UUID)
         optional(:title).maybe(Types::String)
         optional(:excerpt).maybe(Types::String)
         optional(:category_id).maybe(Types::UUID)
        end
       end
      end
    end
```

In the example above, you have two almost identical classes. There are minor changes in the validations and in standard rails application you'd have probably something like this:

```ruby
    # ruby: /app/models/article.rb

    class Article < ApplicationRecord
      validates :title, presence: true, allow_nil: true
      validates :excerpt, presence: true, allow_nil: true

      belongs_to :author
      belongs_to :blog
      belongs_to :category, optional: true
    end
```

This is a DRY code. **But already this object has a lot of responsibilities**. You can fetch data from DB, you can save, update, and read this model, and now also validate.

More importantly, when you'll add a further logic to, for example, publish the article, you'll need to check if all the necessary fields are actually at the time the post is being published.

Then these validations don't make sense anymore, as you actually can have invalid records in your database.

This is a very simple example but already shows that validations don't really belong to a model but rather to an action or operation you're trying to do.

### Summary

I personally like to be SOLID more than DRY when it comes to coding. This way I will write more code - and that's bad, as I'm lazy. However, at the same time, this code is more reliable, more scalable, testable, easy to read and maintain.

In Driggl, we want to keep things simple to easily introduce new developers and reduce the risk of unexpected bugs to be introduced.

Whenever the big project will need to be split into several independent microservices, our code will be ready for that!

### Special Thanks

- [Piotr Solnica (Solnic)](https://github.com/solnic) - for his great work on [dry-rb](https://github.com/dry-rb) ecosystem which makes ruby programming even more pleasure.
- [Lubomirkin](https://unsplash.com/@lubomirkin) - for a great cover photo
