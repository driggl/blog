---
title: "Installing OptinMonster with Nuxt.js"
excerpt: "OptinMonster is one of the best conversion tools available on the Web. I tried it out and as there is no direct guide how to install this script in Nuxt.js application, I decided to write one on my own. Happy reading!"
slug: "optinmonster-with-nuxt"
tags: ["marketing","tools"]
thumbnail:
  big: "https://driggl-prod.s3.eu-central-1.amazonaws.com/suggester/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/uploads/64313ecc-96ec-4c7e-ab1a-599946618990/blog.jpeg"
  full: "https://driggl-prod.s3.eu-central-1.amazonaws.com/suggester/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/uploads/64313ecc-96ec-4c7e-ab1a-599946618990/full.jpeg"
  mini: "https://driggl-prod.s3.eu-central-1.amazonaws.com/suggester/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/uploads/64313ecc-96ec-4c7e-ab1a-599946618990/mini.jpeg"
  small: "https://driggl-prod.s3.eu-central-1.amazonaws.com/suggester/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/uploads/64313ecc-96ec-4c7e-ab1a-599946618990/small.jpeg"
  medium: "https://driggl-prod.s3.eu-central-1.amazonaws.com/suggester/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/uploads/64313ecc-96ec-4c7e-ab1a-599946618990/medium.jpeg"
  sharing: "https://driggl-prod.s3.eu-central-1.amazonaws.com/suggester/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/uploads/64313ecc-96ec-4c7e-ab1a-599946618990/sharing.jpeg"
  original: "https://driggl-prod.s3.eu-central-1.amazonaws.com/suggester/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/uploads/64313ecc-96ec-4c7e-ab1a-599946618990/original.jpeg"
publishedAt: "2020-03-17"
author: "swilgosz"
---

Recently I've tested the [OptinMonster](https://optinmonster.com) as I was looking for a tool that could help me build my email subscription list. It is amazing so I decided to use it on my blog.

The issue is that my blog is written in Nuxt.js - an SSR framework built on top of Vue. The reason behind that I'll leave for another article.

However, [the official documentation](https://optinmonster.com/docs/using-the-optinmonster-api-with-single-page-applications/) only covers integration with standalone Vue.js application, so to install it properly I was forced to dig a bit deeper.

Here is how to do it properly.

## Install the script in the HTML body

The first step is to place the OptinMonster's script tag into your HTML right before closing the `<body\>` tag. You can find the script in the last step of creating the campaign and should look more or less like this:

```html
<script
  type="text/javascript"
  src="https://a.opmnstr.com/app/js/api.min.js"
  data-account="MY_ACCOUNT_ID"
  data-user="MY_USER_ID"
  async
\></script\>
```

You should replace the _MY_ACCOUNT_ID_ and _MY_USER_ID_ placeholders with your individual identifiers.

Now it's time to add it to your application. The issue you can see is that in the brand new Nuxt application there is no HTML file at all, so where should you paste this script?

Well, **that's a nice question.**

Nuxt generates the HTML file automatically unless you have an app.html file defined in the root of your application.

So to solve this problem, what you need to do is just create a file _app.html_ in the root of your project's folder and type the code below:

```html
# app.html

<!DOCTYPE html\>
<html {{ HTML_ATTRS }}\>
   
  <head\>
        {{ HEAD }}  
  </head\>
   
  <body {{ BODY_ATTRS }}\>
        {{ APP }}    
    <script
      type="text/javascript"
      src="https://a.opmnstr.com/app/js/api.min.js"
      data-account="MY_ACCOUNT_ID"
      data-user="MY_USER_ID"
      async
    \></script\>
  </body\>
</html\>
```

This way you'll have the general HTML layout updated with an Optinmonster's script. All the _{{ TAG }}_ parts of the file will be replaced later by the Nuxt.js with dynamic content.

So this is the first part. Now let's move to the next one.

## Refresh the script on route change

Single-Page applications have this problem, that whenever you'll click on the internal link, the content of the HTML file is replaced by the javascript, and the URL in the browser is also just updated by the javascript of the library.

That means, a lot of manually attached scripts will need to be refreshed on the route change whenever that happens and this is also a case now.

To make sure the OptinMonster scripts will work all the time - not only when your users directly visit the pages with campaigns, but we also need to add a plugin with the tweaked code from the OptinMonster

### Create a plugin file

In the plugins directory create a file: _optinmonster.js_.

```jsx
import Vue from 'vue';
import Router from 'vue-router';

const router = new Router({});

router.beforeEach((to, from, next) => {
  if (window.om5678_1234) {
    window.om5678_1234.reset();
  }
});

Vue.use(Router);
```

According to the docs:

> The method is formatted based on your account and user id: _om{accountId}\_{userId}_ so if your account ID is 1234 and your user ID 5678 the object would be _window.om5678_1234_.

This way just replace the numbers above with the appropriate accountId and userId.

### Install the plugin

Once you've created the plugin, the last part is to inform your application that you want to use it. Open the nuxt.config.js file and find the plugins section and add a path to your plugin file to the array defined there:

```js
    # nuxt.config.js
     ...
     plugins: [
     '~/plugins/optinmonster'
     ],
     ...
```

Once you do it, everything should work like a charm. Just publish your campaigns, and observe how your subscriber lists grow!

### Special Thanks

- [Joanna Kosińska](https://unsplash.com/@joannakosinska) for a great cover photo
- OptinMonster just for being there :D
