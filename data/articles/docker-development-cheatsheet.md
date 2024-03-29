---
title: "Docker development cheatsheet"
excerpt: "When you work with docker you'll need to learn a few new shell commands to be effective. Here is a collection of my most useful commands I've found so far."
slug: "docker-development-cheatsheet"

tags: ["docker", "rails"]
thumbnail:
  big: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/7dc69020-89e8-45d7-a3b0-581bfc29fe26/cover/blog.jpeg"
  full: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/7dc69020-89e8-45d7-a3b0-581bfc29fe26/cover/full.jpeg"
  mini: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/7dc69020-89e8-45d7-a3b0-581bfc29fe26/cover/mini.jpeg"
  small: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/7dc69020-89e8-45d7-a3b0-581bfc29fe26/cover/small.jpeg"
  medium: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/7dc69020-89e8-45d7-a3b0-581bfc29fe26/cover/medium.jpeg"
  sharing: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/7dc69020-89e8-45d7-a3b0-581bfc29fe26/cover/sharing.jpeg"
  original: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/7dc69020-89e8-45d7-a3b0-581bfc29fe26/cover/original.jpeg"
publishedAt: "2020-05-09"
author: "swilgosz"
---

In the last article, I've written about [the reasons for choosing Docker](https://driggl.com/blog/a/docker-setup-for-rails-development) in my daily workflow of creating web applications.

Now It's time to share a few tips to stay productive with it.

## The bad side of Docker

Despite how awesome [Docker](https://www.docker.com/) is and all those great things you've heard about it the truth is it also has its disadvantages. Without using it properly it can become a pain in a bottom to all developers in your team.

Let's tackle some of them.

### Resource eater

The philosophy of Docker assumes that every single service you run is launched inside of an encapsulated container - which you can understand as a virtual machine with a micro-system installed in it, designed to run only this specific service.

The usual, not so big web application can easily consist of a set of services like this:

- Postgres server
- Memcached
- Redis
- Application Server
- Background Job server

When you'll set up those applications directly in your operation system, there is not too much overhead and not much of your resources are used.

Imagine, however, what happens, when you'll run those in 5 different docker containers, where each of them runs a separate Unix system to run that service.

Yes, there are somewhat more resources used.

For that issue, there is no solution other than using strong computers. By design, Docker is more resource-heavy than running the app directly from your machine.

But there is more than that.

### Additional Layer of complexity

Docker will not work with your application out of the box. **Especially not, if you have several different services depending on each other**. To make it work, you'll need a bit of configuration and some additional software to be installed.

To easily manage and orchestrate my application's services I'm using the [docker-compose](https://docs.docker.com/compose/) and to detect file changes in my source code I'm using [docker-sync](http://docker-sync.io/).

> The detailed configuration for my flow I've described in the [previous article](https://driggl.com/blog/a/docker-setup-for-rails-development), feel free to check it out.

However, all that requires you to learn a whole new set of shell commands and add it on top of your usual stack.

For example, instead of running the rails application using _rails s_, I need to run it via _docker-sync start && docker-compose up -d_

So is there a way to improve it?

## Docker command cheat sheet

Here is a list of commands I suggest to be familiar with when you plan to move to the dockerized workflow:

#### **Running the services**

```bash
    docker-sync-stack start # runs server and synchronization together, all in one tab.

    docker-sync start # runs synchronization only, in the background
    docker-sync stop # stops synchronization

    docker-compose up # runs all the services in the current process
    docker-compose up -d # runs all the services in the background
    docker-compose stop # stops services while keeping containers alive
    docker-compose down # stops services and remove containers
```

I always run services in the background with synchronization included and I'm doing that with a bash alias defined:

```bash
    alias dcst='docker-compose up -d && docker-sync start'
    alias dcsp='docker-compose stop && docker-sync stop'
    alias dcr='docker-compose down && docker-sync stop && dcst'
```

this allows me to start, stop, and completely restart the server using just a few keystrokes instead of remembering a whole set of commands to juggle with.

#### **Cleaning up**

Sometimes it may happen, that you'll need to clean up your environment. For example, there are situations where syncing files can crash and you need to completely clean up the synchronization cache to be able to fix it.

Or, if you work with a lot of applications, you may run out of hard drive memory reserved for Docker stuff.

Here are some useful commands helping with problems that may occur:

```bash
    docker-sync clean # cleans the synchronization stuff

    docker rm $(docker ps -q) # removes containers
    docker rmi $(docker images -q) -f # removes all images
    docker volume rm $(docker volume ls -qf dangling=true) # removes all volumes without containers associated with it

    docker system prune -a # removes:
                           # - all stopped containers
                           # - all networks not used by at least one container
                           # - all images without at least one container  associated with them
                           # - all build cache
```

This I also like to have transformed into an alias - this time: *dcl *which stands for: "docker clean"

#### Connecting with the services

Now is the fun part. If you work with docker, you cannot just run _rails c_ to open the console as ruby and all gems are not installed on your machine - everything is running inside of a virtual machine running in the separate container.

This means you need to always call commands from within the service contexts.

```bash
    docker exec -it <<CONTAINER_NAME\>\> <<COMMAND\>\> # runs shell command inside of the container

    docker logs -f <<service_name\>\> # show logs for specicic container

    ### docker-compose versions

    docker-compose exec <<SERVICE_NAME\>\> <<COMMAND\>\>
    docker-compose logs -f <<SERVICE_NAME\>\> <<COMMAND\>\>
```

What I usually do is calling:

```bash
    docker-compose exec api bash
```

Which logs me into the running container's shell and keeps the session. From there I can easily use standard Rails or NPM commands depending on which environment I have set up.

But of course, I also have an alias for that: _dce api bash._

## Summary

Working with docker can be tricky sometimes but if you'll take a moment to think about your setup, about the things you're mostly annoyed by, you'll see that it's quite easy to optimize them.

I don't see too much overhead with working with docker except having to work on the stronger computers. You may think that you need to learn the whole stack and all the mechanisms behind it but in the end, what you'll use is:

1.  Starting and stopping the servers: docker-sync-stack start
2.  Logging into the container's shell: _docker-compose exec ..._
3.  Showing logs if you prefer to run services in the background: _docker-compose logs -f ..._
4.  And from time to time cleaning up the garbage from the system: _docker system prune -a_

Of course, there are more things if you want to be fancy, but this is what you'll use daily.

## Do you have a question? Share in the comments!

I know there are other nice flows out there - if you're using docker with development, please share your tips for being productive, and if not - tell me why?
