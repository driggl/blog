---
title: "Token based authorization explained"
excerpt: "There are several authorization method used on the web. In this article we cover token-based authorization explaining multiple types of tokens."
slug: "token-based-authorization"
tags: []
thumbnail:
  big: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/421d19fa-dde7-4481-aa93-2980fb750090/cover/blog.jpeg"
  full: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/421d19fa-dde7-4481-aa93-2980fb750090/cover/full.jpeg"
  mini: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/421d19fa-dde7-4481-aa93-2980fb750090/cover/mini.jpeg"
  small: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/421d19fa-dde7-4481-aa93-2980fb750090/cover/small.jpeg"
  medium: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/421d19fa-dde7-4481-aa93-2980fb750090/cover/medium.jpeg"
  sharing: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/421d19fa-dde7-4481-aa93-2980fb750090/cover/sharing.jpeg"
  original: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/421d19fa-dde7-4481-aa93-2980fb750090/cover/original.jpeg"
publishedAt: "2019-02-15"
author: "swilgosz"
---

In my latest course, the complete guide for API developers loving Ruby on Rails, I created the application using Bearer token authorization method. As I wanted to focus on practice, I never explained what the "Bearer" means and what other Token authentication methods are possible to be used. In this article, I'll try to explain it well.

### What is the access token? 

According to [RFC documentation](https://tools.ietf.org/html/rfc6750), the token is a string that has completely NO MEANING for the end user.

> Bearer Token      A security token with the property that any party in possession of      the token (a "bearer") can use the token in any way that any other      party in possession of it can.

What it simply means, the token is kind of a more secure replacement for the login and password. Anyone who gets the access token, can act like the same person and connect from multiple places.

<CourseAd />

Tokens other than passwords are allowed us to be more flexible. The application can add expiration time for the token and require refreshing/re-logging each time it expires to generate a new one. That simply is not something user-friendly if we would apply the same functionality for passwords. Can also create multiple tokens for multiple clients that connect to our API.

### Access token types

#### Bearer Token

This is default token for most implementations. You can understand it as: "give an access to the bearer of this token". There are no questions, just one token is generated, and the bearer can act as the authorized user.

This token is very easy to implement as it requires only an attribute on the user (or separate table in case you want to easily extend it) and random string generator. Because of its simplicity, we used this one in our course.

#### JWT (JSON web token)

If you use simple random string generator to create your tokens, you'll probably hit a wall very soon. It would be nice to have multiple tokens for different devices or include the current user attributes for each authorized requests, but that is hard to achieve in the previous implementation.

The JSON Web token allows us exactly that. The JWT token consists of three parts: Header, Payload, and Signature.  The Header and the Payload are encoded using Base64 and can include any information you want. Then they are glued together and signed to prevent manipulations, but the Token is not encrypted.

That means the client can easily decode the token and reveal the content hidden in the randomly looking string.

It's a powerful way of dealing with authorization requests, as you don't really need any kind of Database system to store those tokens, you don't need to add table columns to add token attributes and so on.

JWT token allows us to create a completely independent authorization service that'll verify tokens and generate new ones based on the incoming data.

### Why "Bearer" in the request?

When the service supports multiple authorization types, often adding only the token value is not sufficient. This is why it's common practice to prepend the token with the type we use:

```shell
    <token-type\> <token value\>
```

It was first introduced by W3C in [HTTP 1.0](https://tools.ietf.org/html/rfc1945) and reused across the whole web. This is why we end up with something like "Bearer fdalsfgjkvk2kjhi29".

#### Special thanks:

- [James Sutton](https://unsplash.com/@jamessutton_photography) for the great photo.
