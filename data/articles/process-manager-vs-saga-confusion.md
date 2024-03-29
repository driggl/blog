---
title: "Process Manager vs Saga Confusion"
excerpt: "People constantly talk about Sagas in DDD word, but often they don't know what they are talking about. If you've been ever confused about process managers and sagas, it's an article for you."
slug: "process-manager-vs-saga-confusion"

tags: []
thumbnail:
  big: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/8ab46c00-101b-41ec-ad12-96c1adec102b/cover/blog.jpeg"
  full: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/8ab46c00-101b-41ec-ad12-96c1adec102b/cover/full.jpeg"
  mini: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/8ab46c00-101b-41ec-ad12-96c1adec102b/cover/mini.jpeg"
  small: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/8ab46c00-101b-41ec-ad12-96c1adec102b/cover/small.jpeg"
  medium: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/8ab46c00-101b-41ec-ad12-96c1adec102b/cover/medium.jpeg"
  sharing: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/8ab46c00-101b-41ec-ad12-96c1adec102b/cover/sharing.jpeg"
  original: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/8ab46c00-101b-41ec-ad12-96c1adec102b/cover/original.jpeg"
publishedAt: "2019-01-05"
author: "swilgosz"
---

When I started being interested in DDD and CQRS, I've hit a lot of walls, in the form of completely new words, building blocks, and coding techniques. One of such things is a definition of a thing named Saga, it's definition and misusage across the whole Internet.

Here I'll try to explain what is the Saga, how to compare it with **process managers**, and how not to go crazy when you'll go through all the resources related to DDD and CQRS across the internet.

### What is the Process Manager?

To properly know what is the saga, it's best to explain what is the process manager.

Usually, if you implement CQRS in your application, you have an actor that calls the command, and then the command handler reacts to this command by publishing an event. When an event is published, however, the event handler can react to it by doing some actions.

![](https://driggl-prod.s3.amazonaws.com/media/project/e4bd6bca-6540-45d5-a89f-43f2dfd43f81/media_upload/d1c116ec-283b-41c3-bccf-452cfea0a15c/media_file/blog_cqrs-simple-flow.png)

```ruby
    UserRegistered = Class.new(ApplicationEvent)

    class RegisterUser < Command
      attributes :username, :email, :password
      # your validations
    end

    class CommandHandlers::RegisterUser
      def call(cmd)
        raise Command::ValidationError unless cmd.valid?
        event_store.publish(UserRegistered.new(data: { username: cmd.username, email: cmd.email })
      end
    end

    class EventHandlers::UserRegistered
      def call(event)
        User.create(event.data.fetch(:username, :email)
        #send confirmation email
      end
    end
```

This example seems to be so trivial, that there is not much to say about. Maybe except for the explanation that I omitted password encryption and so on just because of simplicity.\
It often looks more or less like this, that the event handler reacts for one event in one bounded context, a simple handler is enough. But sometimes you would love to have some kind of automation, where the system Looks for some events in one bounded context, and then call a completely new command. For example, creating a discount when certain conditions happened in the system.

Let's assume, that when a user registered and filled its profile, then give him 10% discount for all products in the store.

![](https://driggl-prod.s3.amazonaws.com/media/project/e4bd6bca-6540-45d5-a89f-43f2dfd43f81/media_upload/8fbe98a4-69e8-4f51-a7e0-a380b3cac973/media_file/blog_process-manager.png)Process manager to add 10% discount after registering user and filling up the proifle.

3

This seems to be clearly a process, that affects two or three different bounded contexts. It observes the UserRegistration bounded context, and also the ProfileBounded Context.

Then finally, it calls the command that creates a discount for a specific user. The discount can be third bounded context.

**This is what the Process manager is**. A class, which based on some events (can be in multiple bounded contexts) automatically triggers an action in our system.

### What is the Saga in domain driven design?

Saga is a term that is often misused across the Internet. Often when people talk about sagas, they really talk about **Process managers**.

The classical definition of the saga is a class which takes care of reverting the complicated multi-transactional actions.

**Example:**

Let's assume the user wants to buy a holiday's ticket. To do so, we need to get a payment, then reserve a place in the Hotel, buy a flight and only then we want to publish the event that everything went fine.

But what if buying the flight was not possible? (For example, all flights were canceled because of bad weather?)

In that case, we would need to cancel the Hotel reservation and probably give all money back to the user. This complicated process of reverting the action is usually handled by a class named _saga_.

![](https://driggl-prod.s3.amazonaws.com/media/project/e4bd6bca-6540-45d5-a89f-43f2dfd43f81/media_upload/88690cef-a1d3-4f12-a7ed-52ec83943bd3/media_file/blog_saga.png)Saga covering whole failure process forcanceliing holiday purchase.

### Saga vs Process Manager confusion

To summarize, the term _saga_ should only be called **when we talk about reverting the multi-transactional action**, but I believe in most cases there is no need to have two different classes for handling the whole process, and another for reverting the process back. The logic handling canceling the process can be included inside of the process manager, and** this is why a lot of people threat sagas and process managers as the same thing** even though they are different being from the theoretical point of view.

### Summary

I was very confused when I tried to get any information about sagas and process managers for the first time and I hope this article will help you understand the difference so it'll be easier for you to understand inconsistent terms across all CQRS and DDD related content resources.

#### Special Thanks

- Andrzej Krzywda from [Arkency](https://blog.arkency.com/) for clarifying that to me.
- [Joseph Gruenthal](https://unsplash.com/@jgruent) for the amazing Cover Image
