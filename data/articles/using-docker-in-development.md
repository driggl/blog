---
title: "Using docker in development - the perfect setup"
excerpt: "Have you heard about Docker? It's an amazing tool allowing you to run basically every application in the same way. It's priceless for production usage, but it can also improve your development and speed up your work like crazy! Do you want to know, how? Read this!"
slug: "using-docker-in-development"

tags: ["development","docker"]
thumbnail:
  big: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/12366347-4414-4286-be4f-7f39fefac0de/cover/blog.jpeg"
  full: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/12366347-4414-4286-be4f-7f39fefac0de/cover/full.jpeg"
  mini: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/12366347-4414-4286-be4f-7f39fefac0de/cover/mini.jpeg"
  small: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/12366347-4414-4286-be4f-7f39fefac0de/cover/small.jpeg"
  medium: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/12366347-4414-4286-be4f-7f39fefac0de/cover/medium.jpeg"
  sharing: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/12366347-4414-4286-be4f-7f39fefac0de/cover/sharing.jpeg"
  original: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/12366347-4414-4286-be4f-7f39fefac0de/cover/original.jpeg"
publishedAt: "2020-03-11"
author: "swilgosz"
---

I work with docker in development since 2017 and at the beginning, it was just a pain in a bottom. I couldn't understand how people can work with it and honestly, I thought that they just don't want to admit they were wrong.

However, more and more people told me how Docker is awesome, so I tried again. And again.

Every time tweaking the configuration a little bit to make it better.

Now, as I'm a productivity madman, I'm working with docker all the time and I don't even consider running applications without it on my machine anymore.

Let me first tell you WHY and in the next article,[ I'll show you HOW.](https://driggl.com/blog/a/docker-setup-for-rails-development)

### Why I'm working with Docker in development.

There are a lot of benefits that docker can give you if you'll start implementing it into your daily workflow but there are two crucial that I find really useful.

### No conflicts with dependency versions.

I'm working on multiple applications with different sets of dependencies and supporting software. For example, one of my applications have these sets of services required to be installed to run it:

- Image Proxy
- Postgres
- Maildev
- Memcached
- Redis
- Sidekiq
- Rails API server (with all it's gems)
- Vue + Nuxt UI application

The other one, except all of that, requires to have at least a few more:

- Custom image processing service using ImageMagic
- Event encryption service
- Greg's Event Store
- Authentication service

Installing all of that on my local machine can take a while, and there are possible issues related to the incompatibility with my OS system or clash with versions of those services.

> For example, [Installing _capybara_ on few of the latest versions of Mac OS](<To install capybara on few of the latest versions of mac OS>) required you to downgrade XCode!

Docker solves it all. Each service is wrapped in containers that are encapsulated mini-systems running on virtual machine on your computer.

Whenever I need to have _Postgres 8_ running, I don't care - I just run the proper image. The other project needs _Postgres 10_? No problem, just run the different image.

You need QT installed for capybara? Just run an image with QT installed... - You don't care on which machine you need to run it, as docker takes care of that.

### No boilerplate with the initial setup.

Because everything is normalized and I can run each service I need in the same way, it's pretty easy to write a file with a list of instructions on how to run your initial dev setup.

**My initial setup of the project for one of my clients took me 3 days of work**. You can imagine, that I've looked like this, when I've installed another component and the app crashed again.

![](https://driggl-prod.s3.eu-central-1.amazonaws.com/suggester/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/uploads/0391904b-3387-4737-8a07-eba74277ae64/blog.jpeg)

But when we've dockerized everything and I needed to change my computer, I looked rather like this:

![](https://driggl-prod.s3.eu-central-1.amazonaws.com/suggester/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/uploads/35d47673-07e9-4cb0-8f7d-0452a47064d9/blog.jpeg)

Really. I just needed to clone the repository and run the one script:

```bash
    git clone client@myrepo.git
    cd myrepo
    sh ./scripts/dev_setup.sh
```

Then, this super nice ASCII art appeared on my screen:

```bash
    Please make a coffee, it can take a while.

                        .
                        `:.
                          `:.
                  .:\'     ,::
                  .:\'      ;:\'
                  ::      ;:\'
                  :    .:\'
                    `.  :.
          _________________________
          : _ _ _ _ _ _ _ _ _ _ _ _ :
      ,---:".".".".".".".".".".".".":
    : ,\'"`::.:.:.:.:.:.:.:.:.:.:.::\'
    `.`.  `:-===-===-===-===-===-:\'
      `.`-._:                   :
        `-.__`.               ,\'
    ,--------`"`-------------\'--------.
      `"--.__                   __.--"\'
            `""-------------""\'
```

So I did. And when I came back, the application was up and running on my computer.

This was possible because of Docker. Now I'm doing the same in [Driggl](https://driggl.com) and all my other projects. Whenever a new person joins our team, the only thing they need to do is to run those three lines of code in the terminal. And I don't care about the machine they work on. I don't ask.

And everything works like a charm.

So is the docker a unicorn? For me it is - but - like a unicorn - it can also prick you if you're not careful.

### Downsides of using docker

There are a few downsides of using docker in development that may or may not be important for you. As politicians like to say: It depends. So here are mine.

#### **Resource-heavy**

Because you run every service in the separate microsystem (usually it's Linux), when you sum it up, you'll see that memory usage and processor usage go up like crazy. So to work efficiently with docker, you'll need performant hardware.

#### **Requires regular cleanup**

When you work with a lot of images, after some time you can get out of space. Usually, docker reserves dozens of GB on your hard drive to store data, but yeah - you'll need to clean dangling containers, images and volumes from time to time to free-up the unused space.

So you probably want to have aliases on commands like:

```bash
    docker rmi $(docker images -q) -f
    docker rm $(docker ps -q)
    docker volume rm $(docker volume ls -qf dangling=true)
    docker system prune -a
```

#### **Requires a lot of initial configuration**

A few paragraphs above, I've described you basically the developer's heaven, when you don't need to write ANY configuration or install anything to make application running.

But to achieve that, You'll need to write the configuration in the docker-specific configuration files.

The good thing is, that you do it once, and you benefit from this, but you need to learn how to write the config, what should you use, and how to link everything together.

#### Basic shell installed

If you have bash aliases defined, zsh shell plugins configured on your terminal and much more fancy stuff that other shells allow you to have, Most of it can't be used easily when you'll hook up to the docker machine.

I've found it very annoying sometimes, especially because I like the [shell autocompletion](https://github.com/zsh-users/zsh-completions).

### Summary

After years of trying different approaches, going through Docker-related courses and reading tons of articles about that, I came with solution that I'm really satisfied right now.

I can work with docker on my dev machines and be effective like never before, but it comes with a price of better machine and some learning to be invested.

Fortunately for me, both of them I was keen to pay.

**But what about you? Do you use Docker in development? Why or why not? Tell me in the comments!**

#### **Special Thanks**

1.  [Tim Gouw](https://unsplash.com/@punttim), [Vinicius Wiesehofer](https://unsplash.com/@wiesehofer), [Tyler Nix](<Tyler Nix>) for a great photos
