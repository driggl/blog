---
title: "Use the REST (API) with CQRS properly"
excerpt: "If you wonder how to design API for your advanced systems, you are in the right place. In this article, I show that using the REST API with CQRS pattern, advanced business domains, Event Sourcing, and Microservices can be easily applied. And yes, REST API can be enough for your needs!"
slug: "cqrs-rest-api"

tags: ["api", "cqrs", "rest"]
thumbnail:
  big: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/1b50e1a6-f6e9-43db-91b0-13622d6cc6fb/cover/blog.jpeg"
  full: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/1b50e1a6-f6e9-43db-91b0-13622d6cc6fb/cover/full.jpeg"
  mini: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/1b50e1a6-f6e9-43db-91b0-13622d6cc6fb/cover/mini.jpeg"
  small: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/1b50e1a6-f6e9-43db-91b0-13622d6cc6fb/cover/small.jpeg"
  medium: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/1b50e1a6-f6e9-43db-91b0-13622d6cc6fb/cover/medium.jpeg"
  sharing: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/1b50e1a6-f6e9-43db-91b0-13622d6cc6fb/cover/sharing.jpeg"
  original: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/1b50e1a6-f6e9-43db-91b0-13622d6cc6fb/cover/original.jpeg"
publishedAt: "2020-03-07"
author: "swilgosz"
---

I love CQRS pattern in my web applications and experience shows me that the benefits it gives you, are proportional to the size of the application you're working on.

With one of my clients we decided to implement CQRS pattern to complement Domain Driven Design, and we figured out that there are some tricky parts not completely obvious at the beginning and we were frustrated that nobody actually described them well in the past.

I've wrote about the[ ruby implementation of CQRS in the separate article](https://driggl.com/blog/a/cqrs-api-endpoints-in-rails-applications). Here I'll focus on more high-level content.

### Challenges we faced

In our project - a big Job Advertising platform, we've made a decision to redesign the business domain and split the big monolith we had into sets of micro-services, carefully designed, which communicate with each other to do their job in the much more performant and reliable way.

We needed to adapt concepts, like:

- DDD - Domain Driven Design
- ES - Event Sourcing
- CQRS - Command Query Responsibility Segregation
- Microservices
- Designing a good API for it all

There were a lot of new topic to learn about and get familiar with, but all of that needed to communicate with each other somehow. Partially it was done by the streams of events, however, most of the services needed an API so they could be triggered manually.

After some consideration our team decided to use REST API to implement public interface to our services and here are challenges we had.

- Not everything seemed to be a resource
- Not every command is a simple CREATE/UPDATE or DELETE
- Should we expose our Domain and commands to the outside world?

Let's talk about those topics one after the other.

\<CourseAd />

## Does everything map to a resource?

In the REST API you think about resources. Wherever in your API you find a noun, you can more or less map it to a resource.

For example, in a blog application, you have _articles_,_ comments_, _authors_, _categories_, etc.

More robust example would be to describe the ordering in the online shop, adding items to the carts, etc. But everybody do that. Actually, when I'd read the blogs and dag through the conferences this was the most popular example I saw, so I'll not do it here.

The core issue is, that sometimes it's not obvious if the thing we're working with is a resource or not.

Here is the example of non-resource object. The JWT access token.

To create a token or in other words, to login the user, you can send POST request to the \`/auth/tokens\` controller.

Then as a response you'll get something like this:

```json
Sample access token response body

    { token: "dsflgj-34lkwejf1o)JLKFJ3l2lkj" }
```

But access token doesn't seem to be a resource - you don't store it anywhere, you don't have the ID, etc. You don't get information about it, and you don't have an ID or anything like that. Just the value.

But if you'll try hard, You'll be able to map every noun to a resource, and if you'll need more nouns, you can came up with them.

The resources here are in the context of API. Nobody cares, if you save them in your DB or not. You can threat the _SearchRequest_ as a resource, _SearchResultsCount_ as a resource, and _AccessToken_ too.

But then you can perform an actions on those resources.

### Performing API actions

When you define your resources, you can think about all the actions you can call on them.

Let's consider a trivial example first. When you have a blog, you can perform several actions on the article, few of which are:

```bash
- create
- update
- publish
- unpublish
- remove
```

HTTP protocol comes with built-in actions, named GET POST, PUT/PATCH and DELETE.

This is perfect for CRUD applications, where everything can be just updated, removed, or created.

The thing is, that even for example above, this seem to not be enough. Except deleting, creating or updating the article, we also can PUBLISH or UNPUBLISH it.

Well... you can just solve it by sending UPDATE for state attribute... but this won't work for more complicated mechanisms.

The real issue is, that by monkey-patches like that, we loose the connection with the business. When system grows and business domain become more and more complicated, It'll be hard to keep the same language with the non-technical part of the company we're working for.

In this example, much better solution would be, to add two more URLS to publish and unpublish the article:

```bash
    PUT /articles/:id/publish
    PUT /articles/:id/unpublish
```

### Not all commands are CRUD-ish

Just another example: You want to apply to a job. You have a job ID, then you click: "apply".

How will you implement that?

- send _PATCH /jobs/:id_ - with a status attribute change
- send _POST /jobs/:id/applications_
- send _PUT /jobs/:id/apply_

What do you do in this case? Do you update one of the job's attributes, or do you create the new Application record?

Or maybe you just **send an email to the recruiter without creating anything**?

CRUD API is good, when you want to show data in a clean and flexible way, allowing to create really interesting clients. But it really hides the business logic from the outside world. Sometimes it's desired, other times not.

In our case, it was... Partially desired.

### When to hide the business logic?

We don't want to show the whole business logic, so we allow frontend team to develop independently, and have flexibility with how they implement the UI.

However, we need to clearly show certain actions on the resources, that can or cannot be done at a time. **Basically, if we have a process that we know it works, we don't want client to implement it wrongly.**

> Don't try to adjust your business to the API endpoints. That will never work.

Under the hood we have CQRS implemented. The APPLY command is our interface to the business domain. While we have the application records, as we can save application drafts before sending them to the company, the real issue is: when we apply, we send the APPLY command to the system. We don't CREATE application nor UPDATE the job.

We struggled a little bit with how to handle such issues to have consistent and logical system. We wanted to have clear rules so our different teams can exactly know which approach should they go with.

### Handling Non-CRUD commands - Spotify API example

Being tired by looking at examples of e-commerce carts I decided to check the real examples of successful companies implementing the Microservices patterns and have business domains that can be non-resource Friendly.

As an example, I'll show the [Spotify API](https://developer.spotify.com/documentation/web-api/reference/player/).

They have a Player service, where you can perform several actions on.

![](https://driggl-prod.s3.eu-central-1.amazonaws.com/suggester/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/uploads/f622c082-5bc1-4a90-9096-619c67af7b0b/original.png)

It's a perfect example of the CQRS pattern implemented in the REST-ful API. The player here can be a resource, and you just trigger the state change by applying the appropriate command.

### Exposing Domain to the outside world

Then we're going to the last question. Should we expose our domain to the outside world, and move all the triggering logic to the client?

This works for Spotify's player, but sometimes it doesn't.

The nice example is the one I described above. When you want to apply to a job.

There are several attributes for the job's application draft that can be changed and I can have different Command and Events being published for every-single attribute that had been changed, but I don't want to force UI to be aware of that.

It introduces a lot of complexity and can cause unnecessary traffic in our system. Instead of that, I see it as much better solution, to have only one endpoint:

```bash
    PATCH /applications/:id
```

Where you can pass different attributes you want to and omit what's not needed to be changed.

Then we hide some of our Business logic from the UI and allow frontend to be more flexible in how they implement the components.

This, however, requires us to implement the [Trigger Pattern](https://hawkins6423.github.io/) or similar, additional abstraction layer which generates [more code to be written](https://driggl.com/blog/a/why-we-are-not-dry).

### Conclusion

RESTful API is more than enough to solve really advanced business problems and the only thing you need to do to release it's full power is to stop thinking CRUD-ish. By exposing some of your business commands to the client you can get a lot of benefits, like

- better control on the flows
- more clean API structure
- more consistent UI implementations
- asynchronous processing
- better cache
- ...and more.

However, going crazy with some rules usually is not good for the business. You need to **design to general strategies, but keep your business case in the first place and adapt it to meet your needs**.

Don't try to adjust your business to the API endpoints. That will never work.

My team went with the approach to **expose some of the business commands whenever it makes sense**, while using simple HTTP update requests and hiding/aggregating several commands in one batch actions in other places.

**It makes sense in our business case, but what works for you?**

#### References:

1.  Brandon Mueller, [_Commanding a more meaningful REST API_](https://www.slideshare.net/fatmuemoo/cqrs-api-v2)
2.  Matt Hawkins, [_Rest vs CQRS: The trigger pattern_](https://hawkins6423.github.io/)
3.  Ali Kheyrollahi, [_Exposing CQRS through a RESTful API_](https://www.infoq.com/articles/rest-api-on-cqrs/)
4.  Spotify, [_API documentation_](https://developer.spotify.com/documentation/web-api/reference/)

### Special thanks

- [Wladislav Muslakov](https://unsplash.com/@entersge) - for a great cover photo

<Om om="om-s0j6hwqdlbmhoiehwh2d-holder" />
