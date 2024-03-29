---
title: "The perfect Docker Setup for Rails development"
excerpt: "In this article, I show you how I did the docker configuration for my rails applications setup. I'm working on dozens of applications during the week and switching projects effectively is crucial for me. Here is how I solved most of the problems with proper docker configuration for development."
slug: "docker-setup-for-rails-development"
tags: ["development","docker","productivity","rails"]
thumbnail:
  big: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/7a869378-8f66-428f-9af1-a9bda2cb51e8/cover/blog.jpeg"
  full: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/7a869378-8f66-428f-9af1-a9bda2cb51e8/cover/full.jpeg"
  mini: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/7a869378-8f66-428f-9af1-a9bda2cb51e8/cover/mini.jpeg"
  small: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/7a869378-8f66-428f-9af1-a9bda2cb51e8/cover/small.jpeg"
  medium: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/7a869378-8f66-428f-9af1-a9bda2cb51e8/cover/medium.jpeg"
  sharing: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/7a869378-8f66-428f-9af1-a9bda2cb51e8/cover/sharing.jpeg"
  original: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/7a869378-8f66-428f-9af1-a9bda2cb51e8/cover/original.jpeg"
publishedAt: "2020-04-07"
author: "swilgosz"
---

A few weeks ago I've written about [WHY I've started working with Docker in development](https://driggl.com/blog/a/using-docker-in-development). Now - as promised - **I'm talking about HOW to do it well.**

The goal - one command and you're ready to go.

I work on multiple projects each week - especially because my team is playing around with microservices in our biggest projects - so it's really important to switch between projects as effectively as possible.

**To be honest, however, It was important for me before.**

I am a productivity madman - and I hate to do anything that I need to repeat regularly (maybe except swimming).

In my opinion, **everything that could be automated should be automated**. This is why all the projects I work with are configured in the way, that** I only need a single shell command **being typed in the terminal to **run the whole ecosystem.**

<CourseAd />

For example, to start this blog's CMS, I only need to take two actions:

1.  Open the terminal
2.  Type: dgls - which stands for "driggl start"

Then, what happens, is:

1.  My editor with the whole workspace and setup is opened.
2.  Several Terminal windows and panes are also opened, with selected ruby version, node version, proper folder and anything else the project needs.
3.  My servers are started with development mode in the background
4.  I'm logged in into the console inside of the docker container of my app
5.  The relevant logs are displayed in separate terminal window.
6.  The standard shell command console is set up.

You could say: It sounds crazy, but **it's only a part of what actually happens**. I'll share more details in other articles, but today I'll focus on the app development setup.

> **TLDR**: I've prepared the** Gist for really impatient people**. You can check it [here](https://gist.github.com/swilgosz/59f3aaa5bcebaddd90948f3ee7f703ae), but if you do, please let me know in the comments if it was helpful! ;)

## Dockerized everything.

I've started using docker a few years ago and I've already described that [it was not an easy journey](https://driggl.com/blog/a/using-docker-in-development). Now I'll just tell you what is the current output of my configuration for new services.

### The Dockerfile.

Every project, no matter if it's ruby or not, I have dockerized in development. For basic rails API applications, the Development Dockerfile looks like this:

```Dockerfile
    # shell: Dockerfile

    # Base image
    FROM ruby:2.6.5

    # Installation of dependencies
    RUN apt-get update -yqq \
     && apt-get install -yqq --no-install-recommends \
     build-essential \
     libpq-dev \
     nodejs \
     locales \
     && apt-get clean autoclean \
     && apt-get autoremove -y \
     && rm -rf \
     /var/lib/apt \
     /var/lib/dpkg/* \
     /var/lib/cache \
     /var/lib/log

    RUN locale-gen en_US.UTF-8
    ENV LANG en_US.UTF-8
    ENV LANGUAGE en_US:en
    ENV LC_ALL en_US.UTF-8

    # Add our Gemfile
    # and install gems
    COPY Gemfile* /tmp/
    WORKDIR /tmp
    RUN bundle install

    # Create a directory for our application
    # and set it as the working directory
    ENV APP_HOME /app/api
    RUN mkdir -p $APP_HOME
    WORKDIR $APP_HOME

    # Copy over our application code
    COPY . $APP_HOME

    EXPOSE 3000

    CMD bin/start
```

This allows me to build an image for my application that I can run in the encapsulated container.

```bash
    docker build -t Dockerfile sample/api:dev .
    docker build -t Dockerfile.test sample/api:test .
```

Basically, the biggest benefit I get from it, is that my application is run in the separate OS, independent of my machine or any of my teammates machines. It's irrelevant which version of Ruby I have locally, it's irrelevant if I have the ruby installed, really. Still, I can run an application without any issues as long as I have Docker.

**However, there are some drawbacks.**

Web applications usually have some dependencies.

- Database server
- Redis
- Memcached
- Sidekiq
- Others (for example an Image processing server)

So even if you don't need to have ruby installed, you still need those... or do you?

Thanks to the [big community Docker has](https://hub.docker.com/), you **can find an image for almost anything**. And even if you won't you can still create and publish your own.

So at the end of the day, you could have multiple images running in your local machine with exact versions of software required by your project...

...but it's tedious.

> With dockerized applications any developer in the world can run your applicaiton in one command and remove all the dependencies after stopping working on it.

I bet that just by reading about that, you start to feel dizzy. It looks like a tremendous amount of work, completely overengineering and adding a lot of complexity. We only talk about one project, so you can imagine, how complicated it would be to manage such services between multiple ones manually.

**Fortunately, there is a solution for that.**

### Meet Docker Compose

To manage collections of images required by multiple applications, there was created a tool named: [Docker Compose](https://docs.docker.com/compose/).

It allows you to create a _\*.yml_ files where you can list all the configuration you need, all the services required by your application with all the setup involved.

Then it organizes your services in networks based on the project's folder name. As a result, at the end of the day, each project has a completely independent network of services to be run.

With this, **by running one command, you can run the whole stack of services at once**, restart them, stop them, run in the background, and easily connect with any of them.

Here is an example of a docker-compose.yml file for a standard rails application:

```yml
    version: "3"
    	volumes:
    	  sample-db-data:
    	  sample-redis-data:

    	services:
    	  db:
    	    image: "postgres:10.5"
    	    volumes:
    	      - sample-db-data:/var/lib/postgresql/data
    	  redis:
    	    image: "redis:alpine"
    	    volumes:
    	      - sample-redis-data:/var/lib/redis/data
    	  memcached:
    	    image: memcached:alpine
    	    command: "memcached -m 500 -I 2m"
    	  sidekiq:
    	    image: sample/api:dev #can be changed to production later
    	    depends_on:
    	      - "db"
    	      - "redis"
    	      - "memcached"
    	    command: sidekiq -C config/sidekiq.yml
    	    env_file:
    	      - .env_api_dev
    	    volumes:
    	      - "sourcer-api-sync:/app/api:nocopy"
    	      - /app/api/tmp
    	  api:
    	    image: sample/api:dev
    	    env_file:
    	      - .env_api_dev
    	    command: /app/api/bin/start
    	    # command: ["/bin/sh", "-ec", "while :; do echo '.'; sleep 5 ; done"]
    	    volumes:
    	      - /app/api
    	      - /app/api/tmp
    	    ports:
    	      - "3031:3000"
    	    depends_on:
    	      - "db"
    	      - "redis"
    	      - "memcached"
    	  specs:
    	    image: sample/api:test
    	    env_file:
    	      - .env_api_test
    	    volumes:
    	      - /app/api
    	      - /app/api/tmp
    	    depends_on:
    	      - "db"
    	      - "redis"
    	      - "memcached"
```

With this, just type _docker-compose up_ and you'll have the whole application up and running!

Now, however, there are more "issues" you can see as soon as You'll start working on your application.

### Keeping files in sync after applying changes

When you've built your Docker image using the Dockerfile, maybe you've noticed this line:

```Dockerfile
    # shell: DockerFile

    COPY . $APP_HOME
```

This is copying everything located in the current folder, into the image's app folder. Docker images are separate file systems and running applications in a Docker container is similar to have it running in a virtual machine.

So basically, all your application files are copied to the image when you've built it. This makes some problems because **when you update a code source file in your repository, this is NOT the same file, that is used by the Docker to run the application.**

So your changes are not reflected...

Yes, I know you're mad at this point, but again, **there is a solution for that already**, and it's named: [docker-sync](http://docker-sync.io/).

_Docker Sync_ is a tool that creates additional service used just to keep your local files and image files in the constant synchronization.

When you have it installed, just run _docker-sync start_ command and all your file changes will be immediately reflected in your running application.

To make it working though, you'll need one more \*.yml file named: docker-sync.yml.

```yml
# docker-sync.yml

version: '2'
options:
 compose-file-path: 'docker-compose.yml'

 verbose: false

 cli_mode: 'auto'
 max_attempt: 5

 project_root: 'config_path'

syncs:
 sample-api-sync:
  src: '.'
  notify_terminal: true
  sync_excludes: ['log/*', '.sass-cache', '.gitignore', '.git', '*.dump']
```

This file tells _docker-sync_ that everything in the current folder, except the files listed in the _sync_excludes_ array, should be watched and kept up to date between the container and the local machine.

With this, you can use your favorite editor and work as you usually do but not being bothered about installing manually any of the dependencies in the future.

## Summary

This may look like a lot of configuration, but the nice things with it are:

- You configure it once and you can easily manage the whole app's ecosystem from a level of easy to browse and manage \*.yml files.
- By configuring dockerized containers or networks you can use this configuration in any CI/CD tool and be sure that everything will work out of the box.
- If you'll ever need to update Postgres, ruby or any other dependency, you'll just need to rebuild the images. No manual installations and removal of old software.

And Finally, at the end of the day, **you can run ALL your applications using the same commands!** Totally independent of tech-stack used by them.

[I've prepared the Gist](https://gist.github.com/swilgosz/59f3aaa5bcebaddd90948f3ee7f703ae) with all this configuration ready to use with a brand new rails API project - you can check it out in case of any issues.

## Do you use Docker in development? Why or Why not?

I hope this article will be useful for you and I'm wondering what are your thoughts on that topic. Maybe you know even better flows or toolset for effective development? Please share what you think in the comments!
