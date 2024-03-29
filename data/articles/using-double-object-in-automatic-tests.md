---
title: "Using double object in automatic tests"
excerpt: "I can imagine you want to learn Test Driven Development like a professional but that's not always straightforward. If you heard about mocking, stubbing and double objects but not sure what's that about, this article is for you!"
slug: "using-double-object-in-automatic-tests"

tags: []
thumbnail:
  big: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/d0a79a18-06c8-41d2-855c-2f8712e1c9dd/cover/blog.jpeg"
  full: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/d0a79a18-06c8-41d2-855c-2f8712e1c9dd/cover/full.jpeg"
  mini: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/d0a79a18-06c8-41d2-855c-2f8712e1c9dd/cover/mini.jpeg"
  small: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/d0a79a18-06c8-41d2-855c-2f8712e1c9dd/cover/small.jpeg"
  medium: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/d0a79a18-06c8-41d2-855c-2f8712e1c9dd/cover/medium.jpeg"
  sharing: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/d0a79a18-06c8-41d2-855c-2f8712e1c9dd/cover/sharing.jpeg"
  original: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/d0a79a18-06c8-41d2-855c-2f8712e1c9dd/cover/original.jpeg"
publishedAt: "2018-10-03"
author: "swilgosz"
---

I can imagine you want to learn Test Driven Development to be able to code like a professional but that's not always straightforward. If you heard about mocking, stubbing and double objects but you are not sure what it is about, this article is for you!

### What is the double object?

When I started working in the big projects for the first time, I constantly discovered new code snippets or smart solutions that I could learn from. I remember when I first saw the _double_ object having no Idea what it does.

So as usual in such cases, I asked Uncle Google and this is what it came with:

> Test double is a generic term for any object that stands in for a real object during a test (think "stunt double"). You create one using the double method. ... any message you have not allowed or expected will trigger an error.... When creating a double, you can allow messages (and set their return values) by passing a hash.

This quote is from [rspec-mocks documentation](https://relishapp.com/rspec/rspec-mocks/docs/basics/test-doubles), and while some parts of it are quite obvious, others not really.

The _double_ object, is an object that acts as another, mimics behaviour we chose by returning values we specify… if you’ve read any book about object objected programming, you probably know that messages is another name for method - so it becomes even more clear.

**For example:**

```ruby
    RSpec.describe "A test double" do
      it "raises errors when messages not allowed or expected are received" do
        dbl = double("Sample object")
        expect(dbl.foo).to be_truthy
      end
    end
```

Double objects have no methods (except few standard predefined ones), until we specify them. This is why the code above will return an error:

```ruby
    <Double "Sample object"\> received unexpected message :foo with (no args)
```

If we want to make this test passing, we need to specify which messages _double_ object can take and which values it should return.

```ruby
    RSpec.describe "A test double" do
      it "raises errors when messages not allowed or expected are received" do
        dbl = double("Sample object", { foo: true })
        expect(dbl.foo).to be_truthy
      end
    end
```

Now this test should pass.

**Why it is useful?**

You probably think now: “Ok, Seb, you just say truisms, I can read all of this in the doc”, but why I should care? Why using double instead of just calling the objects method?”

> It’s faster to run, and faster to implement - and I have less headache.

Well, best to show it in an example.

In our [Ruby on Rails REST API course](https://www.udemy.com/ruby-on-rails-api-the-complete-guide/?couponCode=DGLWEB) we went through authenticating users using Github OAuth API and [Octokit](https://github.com/octokit/octokit.rb) gem.

I have a _UserAuthenticator::Oauth_ class and I wrote a test to check the behaviour of our service when we provide invalid authorization code to it.

The problem is, that Under the Hood we call the _Octokit::Client_ class with _exchange_code_for_token_ method which sends a request to external API - Github’s in this case, and API returns a proper value.

**From test perspective that’s unnecessary complication.**

1.  First of all, we don’t want to communicate with real API requests. We want our tests to be independent of internet connection and be able to run everywhere, so relying on external API’s responses is not something we want.
2.  Secondly, I expect that both - Gem I used, and API I connect with are already covered with tests so I don’t need to repeat that work. Also sending real http requests can significantly slow down our tests and therefore deploy flow.
3.  Finally I don’t care what Octokit::Client#exchange_code_for_token method does under the hood - I just want to be sure that if that returns an error, my class behaves appropriate, and for success messages it changes the behaviour correctly.

So this is where _double_ object comes handy. Here is how my test could look like:

```ruby
    describe UserAuthenticator::Oauth do
      describe "#perform" do
        let(:authenticator) { described_class.new("sample_code") }
        subject { authenticator.perform }

        context "when code is incorrect" do
            ...
        end

        context "when code is incorrect" do
             ...
        end
      end
    end
```

As you can see, I just instantiated the authenticator with “sample_code” string, then set a subject to be a perform method call. Next I set up two context blocks - for valid and invalid code. Inside I’ll place my tests, so now let’s take a look in the test examples themselves:

```ruby
    ...
        context "when code is incorrect" do
          let(:error) {  double("Sawyer::Resource", error: "bad_verification_code") }
          before do
            allow_any_instance_of(Octokit::Client).to receive(
              :exchange_code_for_token).and_return(error)
          end

          it "returns false" do
            expect{ subject }.to be_falsey
          end
        end
    ...
```

Here the magic begins. As I don’t want to think how to make Github API returning wrong or success values while writing a test and I don’t want the real connection with Github, I can just mock the _Octokit::Client_ and force it to return the value I got from the gem’s documentation.

In term of failure _Octokit::Client_ should return _Sawyer::Resource_ object with a method error having a value _“bad_verification_code”_.

First of all I used the double, because I don’t want to dig into how _Sawyer::Resource_ object is being created and how many dependencies it needs while being instantiated. I only need this one error method and can completely ignore all other complicated logic that possibly exists in _Sawyer::Resource_ class.

**It’s faster to run, and faster to implement - and I have less headache.**

After that is defined, I mocked the Octokit::Client object, so every time there is an exchange*code_for_token method called on it, instead of running through the real method body, I just skip everything and return my \_fake* error object - a double.

This allows me to write another test for valid code in no time:

```ruby
    ...
        context "when code is correct" do
          before do
            allow_any_instance_of(Octokit::Client).to receive(
              :exchange_code_for_token).and_return("token string")
          end

          it "returns true" do
            expect{ subject }.to be_truthy
          end
        end
    ...
```

In this case I omitted the double, as I don’t need it. This time I just mocked the _Octokit::Client_ to return a sample string which it would do for success Github request call.

As the string class is well known for me, there is no need to create a double.

This way I can safely write tests for any classes that make use of external libraries or heavy objects with lot of logic or dependencies required without thinking how to prepare dependent data in the way they work.

**When should I use it?**

Double objects are useful when our classes depends of objects which are not straightforward to be created or calling them can slow down our tests or make them unstable.

**Use it for:**

1.  Speed up your work
2.  Speed up your tests
3.  Wrappers around external services or classes

**Danger zone when using doubles.**

BUT as every single nice coding practice mocking comes with some trade offs.

In our example if we’ll ever update the _Octokit::Client_ gem and instead of raw string it’ll start to return a token object… our service will start to fail but our test won’t catch it.

This is why when we use doubles, we always need to be sure that everything we stub is well covered by tests which don’t use mocks.

Also in cases of changes or updates we constantly need to be aware of what we change and how this can affect other services.

Using mocking in rspec tests can be great speed improvement for our tests, but it also can create a false image of our application and introduce problems that won’t be caught by tests but would be fi we would write slower counterparts.

**But what about you**? Do you use doubles and mocking in your tests? If So, In which cases? If not, why?

Tell me in the comments!
