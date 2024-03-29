---
title: "How I've improved the RailsEventStore's encryption mechanism in EventStoreClient"
excerpt: "One of my biggest conerns in relation of event-sourced systems were: How to handle GDPR requirements in databases you cannot modify? What should we do when one of our clients will come to us and ask to delete ALL their data, if one of the biggest advantages and benefits of the event-sourced systems is a complete history of what happened in the past? Here is how."
slug: "event-encryption-performance-tweaks"
tags: ["event sourcing", "rails", "ruby" ]
thumbnail:
  big: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/15fc3b3f-be48-40ca-a8c0-1835344d9996/cover/blog.jpeg"
  full: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/15fc3b3f-be48-40ca-a8c0-1835344d9996/cover/full.jpeg"
  mini: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/15fc3b3f-be48-40ca-a8c0-1835344d9996/cover/mini.jpeg"
  small: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/15fc3b3f-be48-40ca-a8c0-1835344d9996/cover/small.jpeg"
  medium: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/15fc3b3f-be48-40ca-a8c0-1835344d9996/cover/medium.jpeg"
  sharing: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/15fc3b3f-be48-40ca-a8c0-1835344d9996/cover/sharing.jpeg"
  original: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/15fc3b3f-be48-40ca-a8c0-1835344d9996/cover/original.jpeg"
publishedAt: "2020-01-30"
author: "swilgosz"
---

I am really amazed by the work he _Arkency_ did in favor of the community doing event-sourcing in Ruby applications and the [RailsEventStore](https://railseventstore.org/) is the best proof of their engagement.

When I've first had a chance to work with it, Immediately I've risen a hand asking about an important issue that was not yet covered - and it was about **handling GDPR issues**.

My concerns about event sourcing systems were: How to handle GDPR rules in databases you cannot modify? What should we do when one of our clients will come to us and ask to delete ALL their data if one of the biggest advantages and benefits of the event-sourced systems is a complete history of what happened in the past?

**Basically, there are three ways to handle it.**

## Three Ways to handle GDPR in event-sourced systems

### 1. Don't do it.

Creating an event-sourced system that matches GDPR restrictions introduces complexity and we all know that **event-sourced systems are more complex in themselves**. No need to add even more complexity on top of it.

**So if you can, just don't do it**. Consider having the part with personal data that possibly need to be removed at some point to be out of the event-sourced system. It can be built in a different service, which stores only the current state and doesn't rely on events.

If that's possible, go for it.

You'll lose the benefits of ES, you'll also need to manage two different sets of data and so on, but if you can, that's the best approach.

### 2. Don't store personal data in events

The second approach is a bit similar but allows you to keep the statistics and history log of what'd happened in the system.

If you want to keep the history of events, you can still be able to keep everything that happened without the personal details. For that, in some scenarios, you could record an event: "UserRegistered" without passing an email in the event's payload.

This may be useful sometimes, but You'll then need to develop a different system to sync your data across services. This is why I am not a big fan of this approach.

### 3. Encrypt event's personal data.

The third option to meet the GDPR requirements **is to encrypt your events**. You don't store personal information in the events anymore, as all personal information is now encrypted and you need an encryption key to access them. Without an encryption key, the data passed to the system becomes just a meaningless random string.

When the user wants to remove all her data, **just remove the encryption key** that points to that user, and none of her data will be able to be restored anymore.

**This approach may seem the best of all, however, it also has some drawbacks.**

1.  It's extremely complicated to be implemented in existing systems, which already processed millions of events.
2.  It'll affect the performance of event processing, as each event needs to be piped through the encryption/decryption mechanism.
3.  You'll not be able to browse the event's logs from the admin panel, or database directly, as encrypted data will be unreadable.

However, for our needs, it was the best choice, and we've handled issues described above this way:

1.  We've built the event-sourced system from scratch. No need to encrypt existing streams as there were none.
2.  We use read models to get a glance of the current state of the application and to browse event logs, we use the ruby projections or console - then all data are decrypted before being logged in the terminal.
3.  The performance is worse, of course, but events are mostly used on the write-side of the data processing, very rarely on the reading part, where the performance is crucial. Probably, it's also not such a big deal in direct DB access and monolithic applications.

However, we've created a [ruby EventStoreClient](https://github.com/yousty/event_store_client) for [EventStoreDB](https://eventstore.org), when we've communicated with the event store db **via the HTTP requests calls.**

**So in **[**Yousty**](https://yousty.ch)**'s ecosystem, we've been indeed concerned about the performance.**

## The Encryption mapper

As I've mentioned in my previous article, while implementing the EventStoreClient, [I've been heavily inspired by Arkency's RailsEventStore](https://blog.arkency.com/introducing-eventstoreclient/). They've already implemented the EncryptedMapper to do exactly what we needed.

By specifying the schema of the encrypted event, we've been able to tell the client which fields should be encrypted before being stored in the database.

The initial concept looked like this:

```ruby
# lib/events/registering_users.rb

    module RegisteringUsers
      module Events
        class UserRegistered < Driggl::EventStoreEvent
          def schema
            Dry::Schema.Params do
              required(:user_id).value(Types::UUID)
              required(:email).value(:string)
              required(:username).value(:string)
            end
          end


          def self.encryption_schema
            {
              username: ->(data) { data.dig(:user_id) },
              email: ->(data) { data.dig(:user_id) }
            }
          end
        end
      end
    end
```

The first method - `schema` is standard information about the event structure. It means, that the event stores three attributes: `user_id`, `email`, and `username` in the `data` hash.

The second method describes, what should be used as an encryption key identifier to encrypt the specific attributes. Basically, if your user_id is: `123`, then this is used as an input to encrypt both of our fields.

**This design allows you to define different keys for different attributes** within the same event. It may be useful, but in our case, when [we've decided to go with very small, encapsulated events](https://blog.arkency.com/big-events-vs-small-events-from-the-perspective-of-refactoring/), this scenario probably will never happen.

Also, this approach has a very bad performance issue.

### Heavily affected performance.

Let's assume you have an encryption key stored in the repository, for example, in the ActiveRecord table.

```ruby
# finding encryption key

    key_id = user_id
    key = EncryptionKey.find(key_id)
```

In the RailsEventStore implementation, you have two methods responsible to encrypt data, and two corresponsing ones to reverse the process.

```ruby
# RailsEventStore encryption transformation

    def encrypt_data(data, meta)
      meta.reduce(data) do |acc, (key, value)|
        acc[key] = encrypt_attribute(acc, key, value)
        acc
      end
    end


    def encrypt_attribute(data, attribute, meta)
      ...
      value = data.fetch(attribute)
      return unless value


      encryption_key = key_repository.key_of(meta.fetch(:identifier))
      encryption_key.encrypt(serializer.dump(value), meta.fetch(:iv))
      ...
    end
```

The issue with this code is, that for EVERY ATTRIBUTE in the event, there is a separate FETCH to the key repository for the corresponding key_id.

Therefore, when you want to read a list of encrypted events, You will get a standard N+1 query. But in this case, it'll be worse, as your `N` is the number of summarized attributes you want to load, not the number of events.

So if you'll get a `UserRegistered` event I've described above, You'll get:

```bash
    # shell: Logs for loading encrypted events

    irb(main):105:0> list = UserList::Retriever.new(
      event_store: Sourcer::Container['event_store']
    )
    irb(main):106:0> list.retrieve.users


    DEBUG -- :   EncryptionKey Load (0.9ms)  
      SELECT  "event_store_encryption_keys".* FROM "event_store_encryption_keys" 
      WHERE "event_store_encryption_keys"."identifier" = 'bd68ff63' 
      AND "event_store_encryption_keys"."cipher" = 'aes-256-cbc' LIMIT 1
    DEBUG -- :   EncryptionKey Load (0.4ms)  
      SELECT  "event_store_encryption_keys".* FROM "event_store_encryption_keys" 
      WHERE "event_store_encryption_keys"."identifier" = 'bd68ff63' 
      AND "event_store_encryption_keys"."cipher" = 'aes-256-cbc' LIMIT 1
```

Event though I have ONLY one `UserRegistered` event in this database, I've got 2 requests to the DB to get all the encryption keys for all the encrypted attributes I've specified.

Maybe it is acceptable for monolithic applications when you've direct access to DB, but I doubt it is. **And it definitely was a bad solution for HTTP communication**, where we had an external service to store our encryption keys!

It's just another proof that events should be small rather than store big hashes of data.

### Improvement

To improve on that issue, I had to agree with our team on one important thing. **We need to go with small, encapsulated events across the whole architecture**.

This way we'll always be able to achieve an environment, when only ONE encryption key will be needed to encrypt the whole event.

Having that in mind, I've transformed the `encrypted_schema` to the form like tihis:

```ruby
    #  EventStoreClient's encryption schema

    def self.encryption_schema
      {
        key: ->(data) { data['user_id'] },
        attributes: %i[first_name last_name email]
      }
    end
```

With this approach you specify the global key for all the data in the event and **you'll get ONLY one request to the encryption key repository to encrypt/decrypt everything**.

It doesn't fully resolves the performance issue, but it speeds up the process a lot, especially when there are several attributes to encrypt.

The code for that is [available in our EventStoreClient gem](https://github.com/yousty/event_store_client/blob/master/lib/event_store_client/mapper/encrypted.rb). You can browse it and soon I'll write more in details how it works.

### Do you want to hear about more content like that?

Follow me on Twitter! [@sebwilgosz](https://twitter.com/sebwilgosz) or subscribe to our newsletter!

<Om om="om-s0j6hwqdlbmhoiehwh2d-holder" />
