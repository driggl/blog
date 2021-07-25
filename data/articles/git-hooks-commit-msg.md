---
title: "Do you think you know Git? Git Hooks Are here to prove you wrong!"
excerpt: "Git hooks are crazy awesome, but actually I believe that 90% of git users just don't know how cool they are. In this article I show how to prevent invalid commits from being created using commit-msg git hook."
slug: "git-hooks-commit-msg"

tags: []
thumbnail:
  big: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/9d4f64d1-8b67-43de-bafd-147f31cbbce2/cover/blog.jpeg"
  full: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/9d4f64d1-8b67-43de-bafd-147f31cbbce2/cover/full.jpeg"
  mini: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/9d4f64d1-8b67-43de-bafd-147f31cbbce2/cover/mini.jpeg"
  small: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/9d4f64d1-8b67-43de-bafd-147f31cbbce2/cover/small.jpeg"
  medium: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/9d4f64d1-8b67-43de-bafd-147f31cbbce2/cover/medium.jpeg"
  sharing: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/9d4f64d1-8b67-43de-bafd-147f31cbbce2/cover/sharing.jpeg"
  original: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/9d4f64d1-8b67-43de-bafd-147f31cbbce2/cover/original.jpeg"
publishedAt: "2019-03-24"
author: "swilgosz"
---

I know that you know Git. You constantly use methods like _commit_, _pull_, _push_, _merge_ or _rebase_. Sometimes you check _diff_, maybe even _reset_ or _checkout_. Even better when you work in a team - then some knowledge of Git is necessary, but are you aware of what Git can do for you?

Are you sure you know the power of the Git tool? Some time ago I wrote about [automation of writing a perfect commit message](https://driggl.com/blog/a/how-to-write-professional-commits-efficiently). Here I'll show you the next level of using Git.

### TLDR: What is this article about

> **TLDR: In this article I show you how to write a git hook preventing commit with unacceptable commit message from being pushed to the server**
>
> **I couldn't resist putting my frustrations on paper though, so this article became longer than expected. **
>
> **No time to read? Jump directly to the**[** Git Hooks section**](https://driggl.com/blog/a/git-hooks-commit-msg#commit-msg-hook-example)**.**

If you are familiar with _interactive rebase_, _squashing_ or _splitting_ commits, if you'are aware of _--force_ vs _--force-with-lean_ **then you're on a good way.**

But this is only a beginning.

### People are lazy. Are you?

What I constantly see in the world of development (and everything else) shows me that **most of the people do not like to constantly force themselves to be better of the current state**. The usual behavior I observe is when a specific person has something that bothers them, they find the most popular, _cool_ or easiest thing that solves the problem.

**And then they stop looking for better solutions.**

It happens everywhere and for me, as I am a perfectionist, it's just I don't know, annoying or disappointing.

I love to talk to people that do not stop on the default, easy to get solutions that everybody has. **I love to talk to people wanting to squeeze much more of their life.**

Are you such person? So keep reading! Or just [skip to the git hook example section](https://driggl.com/blog/a/git-hooks-commit-msg#commit-msg-hook-example) :)

### The lack of desire to be better

You probably wonder why I'm writing about such laziness in the article about Git feature. Well, **Git is a perfect example of how ignorant people are when it comes to productivity**.

> The problem is that Git improves one's productivity a lot immediately after one starts using it

Git is a tool that everybody uses in software development because there is no way to be safe without it. It's must-go, a requirement by every single company and team, so everybody uses it.

The problem is that Git improves one's productivity a lot immediately after one starts using it. Usually, when people learn Git, they are also learning to use their editor, terminal application, shell commands, and programming language.

At that point, of course, there is no need to master Git because** the greatest boost of productivity comes from learning the language**. However, most of the people never actually look back to what they've never learned. They stay focused on the language, programming practices, coding techniques and so on.

In the end, most of the very good developers know their main programming language very well, they follow SOLID principles, can discuss for hours about what is best for their projects, but they don't know, that _Ctrl+w_ will removes the whole word from the terminal while _Ctrl+u_ removes the whole line.

#### The same applies to Git 

People start using it and they never know that they can modify history. They don't know that you can run shell scripts automatically after applying a change or switching the branch. They never [read the documentation](https://git-scm.com/doc).

In this article,** I want to encourage you to dig deeper into familiarity with the tools you're using daily **because they can improve your skills, productivity and speed at least as much as knowing the programming language better.

In this article,** I'll show you git hooks **and what can be possible with them.

### Introducing Git Hooks

Git hooks is a not so well known feature in Git. In a few words, it allows you to fire off your custom scripts when certain actions occur.

Sounds cool? Yeah, it does!

> I really like to know **how you guys use Git hooks, **so please** let me know in the comments about your use cases.**

**With Git hooks you can do basically everything you want.** Git hooks are split into server-side and client-side. Hooks happening on the server most often are about sending a notification when a commit is applied and usually you don't have much control on it. You can hook for example a slack, notifications or your mailbox to get information when somebody pushes to your repository.

That's nice but much more useful for you are probably the client hooks. They can be triggered by several specific actions:

#### List of client-side Git Hooks

```bash
- pre-commit
- prepare-commit-msg
- commit-msg
- post-commit
- pre-rebase
- post-rewrite
- post-checkout
- post-merge
- pre-push
```

**Those are the only I ever used**. You can find a complete list in the [git hooks documentation](https://git-scm.com/book/uz/v2/Customizing-Git-Git-Hooks) if you're interested with edge cases.

**I won't describe all of them but I only want you to grasp this:**

> Before you commit,** ANY executable file** you choose can be run.

> When you push, **ANY executable file** you choose can be run!

The only thing restricting you is your imagination!

Now I will give you one crazy example and then will tell you something useful.

### Stupid example of using git hooks

Push to the master branch, that means you've done something important, you completed a task, so you deserved a short break, don't you?

You can set up a script that opens *League\*\* of Legend *Client each time you perform a PUSH action to the server. Isn't that Great? Or open the alert. Or stop the timer. Or shuts the computer down!

### A useful example of using git hooks

Ok, that was funny, but no of my clients would pay me for such things. Now let's assume, you have a standardized way of writing commit messages in your project. It can be tricky to remember about the correct format, right?

Git _commit-msg_ hook can be a solution for your problem here.

#### How to prevent incorrect commit messages using Git hooks

Let's write a hook that forces you to start your commit with one of 5 keywords describing the change:

- Remove
- Fix
- Refactor
- Change
- Add

All git hooks are placed in your project's _.git/hooks_ folder. You probably have there a list of sample scripts you can use as a starting point to write your own ones. To use them, you need to remove the "_.sample_" from their file names.

You're interested with _commit-msg.sample_ file so let's rename it:

```bash
    mv .git/hooks/commit-msg.sample .git/hooks/commit-msg
```

Now update the content of this file with the one below:

```ruby
    #!/usr/bin/env ruby
    message_file = ARGV[0]
    message = File.read(message_file)
    $regex = /^(Add)|(Remove)|(Refactor)|(Change)|(Fix):\s.+/
    if !$regex.match(message)
        puts <<~STRING 
          F**k! I forgot the format again!
          Commit msg need to start from either of:
          - Remove:
          - Fix:
          - Refactor:
          - Change:
          - Add:
          Remember about space char after the :!
        STRING
      exit 1
    end
```

**Yes, I wrote the script in ruby. I told you, nothing restricts you.**

Now let's try it out. Type:

```bash
    git commit -m 'Test'
```

This commit does not begin from our approved list of keywords, so you should receive this as a result.

```bash
    F**k! I forgot the format again!
    Commit msg need to start from either of:
    - Remove:
    - Fix:
    - Refactor:
    - Change:
    - Add:
    Remember about space char after the :!
```

While when you write a message required by a guard, everything passes correctly:

```bash
    git commit -m 'Fix: Test fix'
    [master ea8e02db6e] Fix: Test fix
     1 file changed, 0 insertions(+), 0 deletions(-)
     create mode 100644 lol.rb
```

### Summary

**I really like to know how you guys use Git hooks, so please let me know in the comments about your use cases.**

To be a really good developer it's not enough to be good at language. You need to try being better at everything you do. Constantly. Git is a tool that has endless possibilities but it's not the only tool with such potential.

Do you think you really know your editor? Terminal? Do you think there are no better solutions to how you use them?

Just take a moment and think about it. You'll be surprised how far you can get if you spend just a moment to make your workflow better.

### Special Thanks

1.  Hubert Olender for inspiring me about this article
2.  [Aziz Acharki](https://unsplash.com/@acharki95) for a great cover photo
3.  [Martin Gamsjaeger](https://github.com/snusnu) and [Wroclove](http://wrocloverb.com) for a great talk improving my axioms based development.
