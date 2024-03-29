---
title: "Delayed jobs with Sidekiq"
excerpt: "Delivering fast responses to the client is crucial for any application when user matters - for me that simply means: for ANY application. Delegating time-consuming tasks to the background job is something every developer need to know no matter if one works on API only application or full stack webpages."
slug: "delayed-jobs-with-sidekiq"
tags: []
thumbnail:
  big: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/6de0a110-1411-460e-a492-b2c961cf783e/cover/blog.jpeg"
  full: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/6de0a110-1411-460e-a492-b2c961cf783e/cover/full.jpeg"
  mini: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/6de0a110-1411-460e-a492-b2c961cf783e/cover/mini.jpeg"
  small: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/6de0a110-1411-460e-a492-b2c961cf783e/cover/small.jpeg"
  medium: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/6de0a110-1411-460e-a492-b2c961cf783e/cover/medium.jpeg"
  sharing: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/6de0a110-1411-460e-a492-b2c961cf783e/cover/sharing.jpeg"
  original: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/6de0a110-1411-460e-a492-b2c961cf783e/cover/original.jpeg"
publishedAt: "2018-09-29"
author: "swilgosz"
---

Delivering fast responses to the client is crucial **for any application when user matters** - for me that simply means: for ANY application. Delegating time-consuming tasks to the background job is something every developer need to know no matter if one works on API only application or full stack webpages.

In Rails there are many solutions available to achieve such thing ach of them coming with its own advantages and [Sidekiq](https://github.com/mperham/sidekiq) is not an exception.

We can choose between [SuckerPunch](https://github.com/brandonhilkert/sucker_punch), Sidekiq, setting up listener using [EventStore](https://railseventstore.org/) or even use Serverless to write functions completely independent of our application.

### Why then writing about Sidekiq?

Well, Sidekiq is one of the most popular solutions for rails applications. It's easy to setup and integrate, comes with wide range of built-in features and pretty dashboard to summarize all our stats and running tasks so it's definitely worth of a try.

![](https://driggl-prod.s3.amazonaws.com/media/media_upload/media_file/f610e02d-ae63-4cd9-9508-36ddc1ba7bf4/blog_1538256346930.png)

The dashboard of the Sidekiq Web UI. Fot: <https://github.com/mperham/sidekiq/wiki>

### Sending email without Sidekiq

Our base application is fairly simple. It just have a form that allows to send contact message email from our user to the application admin. The contact message object looks like this:

```ruby
    #app/models/contact_message.rb

    class ContactMessage
      include ActiveModel::Model

      attr_accessor :subject, :content
    end
```

We completely omitted validations here but they are not important for my tutorial application. In the real world example you would definitely need validations to be added, and also require a bit more information, like the sender email, so you could respond to the message requests.

Anyway there is not too much to say about that, so now let's check out the controller:

```ruby
    # app/controllers/contact_messages_controller.rb

    class ContactMessagesController < ApplicationController
      def create
        model = ContactMessage.new(message_params))
        ContactMailer.contact_message(model).deliver_now!
        redirect_to root_url
      end

      private

      def message_params
        params.require(:contact_message).permit(:subject, :content)
      end
    end
```

As you can see, there is only one action here and all it does is instantiating the new contact message object with parameters extracted from the request, and sending the email.

The mailer class could look like this:

```ruby
    class ContactMailer < ApplicationMailer
      def contact_message(message)
        mail(
          to: ENV['APP_ADMIN_EMAIL'],
          subject: message.subject,
          body: message.content
        )
      end
    end
```

Even if sending this email will not take too much time, there is still a delay between calling the method and receiving the confirmation that the email had been successfully sent. We would love to speed up things by avoiding waiting for that confirmation and return the response to the user right away.

This is when we are starting to look for solutions for background job processing.

### Using Sidekiq in Rails application

Sidekiq uses Redis to process the scheduled jobs, so before we add the gem into our application, we'll need to install and run the redis first. If you use the OSX, the easiest way to do so is by using brew package manager.

```bash
    brew install redis
    redis
```

Having that we can add Sidekiq to our Gemfile:

```ruby
    # Gemfile
    gem 'sidekiq'
```

After running bundle install you can define the first worker.

```ruby
    # app/workers/email_worker.rb

    class EmailWorker
      include Sidekiq::Worker

      def perform(message)
        ContactMailer.contact_message(message).deliver_now!
      end
    end
```

As you can see we moved the line responsible for sending the email into the Sidekiq worker and now instead of calling this line directly, in the controller we need to launch the worker to schedule the task in the background queue. The updated controller action will look like this:

```ruby
    # app/controllers/contact_messages_controller.rb

      ...
      def create
        model = ContactMessage.new(message_params))
        EmailWorker.perform_async(model)
        redirect_to root_url
      end
      ...
```

Now when we'll submit the contact message's form, the response will come immediately, as the whole task is scheduled and processed by different process and our application doesn't need to wait for anything.

### Sidekiq dashboard

If you want to use sidekiq with the dashboard that comes with this gem, you'll need to require it explicitly as it's not included by the default.

```ruby
    # config/routes.rb

    require 'sidekiq/web'
    mount Sidekiq::Web => '/sidekiq'
```

Then you can visit the /sidekiq path on your application and check out how the jobs and queues are processed in the real time.

#### Special thanks

1.  [Lalo Hernandez](https://unsplash.com/@lalonchera) for amazing feature photo.
