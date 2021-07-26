---

title: "How to write professional messages EFFICIENTLY?"
excerpt: "Writing good commit message is the best business card for you as developer. But how to do it efficiently? Do you know?"
slug: "how-to-write-professional-commits-efficiently"

tags: []
thumbnail:
  big: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/18f3a1fb-2c8a-4083-a824-96e51b99520a/cover/blog.jpeg"
  full: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/18f3a1fb-2c8a-4083-a824-96e51b99520a/cover/full.jpeg"
  mini: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/18f3a1fb-2c8a-4083-a824-96e51b99520a/cover/mini.jpeg"
  small: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/18f3a1fb-2c8a-4083-a824-96e51b99520a/cover/small.jpeg"
  medium: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/18f3a1fb-2c8a-4083-a824-96e51b99520a/cover/medium.jpeg"
  sharing: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/18f3a1fb-2c8a-4083-a824-96e51b99520a/cover/sharing.jpeg"
  original: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/18f3a1fb-2c8a-4083-a824-96e51b99520a/cover/original.jpeg"
publishedAt: "2018-11-17"
author: "swilgosz"
---

When I worked on the different projects, there is one thing that is a constant problem shared between most of them: communication in commit messages. Usually, the commit messages is a big mess. That is acceptable if you start with programming or work in small projects on your own, but in applications which are bigger, or there are multiple collaborators (any open source project in an example), having clean and easy git history just makes developer's life so much easier.

There is a[ great post ](https://chris.beams.io/posts/git-commit/)by Chris Beams about making a git commit messages looking professional, clean and easy to work with. It inspired me to share my thoughts about the topic and extend some facts that were not covered there. I strongly suggest to read it, as it focuses on the Commit's message itself.

In this article, I'll go one step further. I'll tell you what I can do to make my commits REALLY useful and how to optimize your environment to speed up your work rather slowing down while making code messages pretty.

I also covered the way of [**improving your flow using squashing commits**](https://driggl.com/blog/a/how-squashing-commits-can-improve-your-git-workflow), so feel free to checkout that article.

### Why does it matter

When several people work on the project, it's crucial to communicate efficiently between the whole team (and future you). When the chat applications are fine to communicate at the specific time, and task manager are perfect to describe what should be done, there is no better way than commit messages for telling others what had been done when, why, and which task it features.

The diff in the commit can tell you what had been done and how it had been done, but the context related to the reason that specific change needed to be applied can only be passed inside of the well-defined message.

As Chris Beams points out, if you need an example, you can see how that is handled for example in any repository managed by [Tim Pope](https://github.com/tpope).

If you did not think too much about the quality of commits, you probably don't do too much of the code reviews and don't use _git log_, _diff_, _blame_, _revert_, _rebase_, _squash_ and _filter_ too much. It's often an endless circle - **those commands become much more useful and easier to use when the repository has well-described commit messages**.

Those basics were well covered already in several places, so I won't replicate them here, but rather focus on other parts that can be useful to you.

### My commit message template

Chris Beams in his article presented quite nice **7 rules** for his commit messages. This itself already can make your commits shiny comparing to 75% of other developers. However, I like to add few more elements to all my commit messages.

#### 1. Type of the commit

The first line of every single commit I'm adding looks like this:

```bash
    {{TYPE}}: {{Title}} (Maks 50 characters)
```

where _{{type}}_ is a short tag that allows developers to easily identify what is the commit about. The list of available types I use it as this:

- **Feat** - feature, new functionality
- **Fix** - bug fix, not adding anything new, but rather removing "unwanted feature".
- **Refactor** - refactoring of production code. This type of commit should not have an impact on end-user experience at any point. The application's behavior should remain the same, and only the refactoring is applied.
- **Style** - code style improvements, like changing: \`:a => :b\` to \`a: b\`, or double quotes to single ones, Without any changes in the app's behavior
- **Doc - **documentation changes. That include README updates and any other documentation-specific things.
- **Test** - test coverage improvements
- **Chore** - changes which do not affect the application behavior, like .gitignore, grunt files, etc, configuration, performance improvements and so on.

This little addition allows my commits to be **easily searchable** in the git history, but also they really improve the experience of people doing code reviews on my changes.

![](https://driggl-prod.s3.amazonaws.com/media/project/e4bd6bca-6540-45d5-a89f-43f2dfd43f81/media_upload/db6ae16c-fd16-4e41-8d3f-90865795a090/media_file/blog_nice-commit-titles.png)\`An example of a list of tagged commits on [gitlab.com](//gitlab.com).

#### 2. References and issue links

There is one more thing I like to add in each commit I'm pushing and that is **links and references**.

Whenever I'm working on tasks that solve specific Github issue, or an error tracked by an external monitoring tool, I reference that via url at the end of the commit message so other developers (including future me) can easily reference what the commit was about and know the whole context no matter how long ago it was added.

Other than that I completely agree with golden rules about good commit messages:

- Start the title from a capital letter
- Use imperative in the commit title.
- Don't end title with "." or other interpunction characters.
- Add an empty line as a separator between the title and commit description
- Describe what and why was changed - how (diff itself describes that)

All that is well explained by Chris Beams, so I strongly recommend taking a look at that article.

BUT keeping those messages at a certain level of consistency can be time-consuming and most of the client won't pay you for that as they count each hour of your work based on effects they can see. So how to be a professional developer and keep being productive?

The answer is:** git commit templates.**

### Custom default commit's message.

When you'll want to specify a commit message using _git commit_ command without the _-m_ flat, you'll see some default text in the editor. Not everybody knows, that this can be changed to whatever you want!

You can prepare **your own commit message template**, and set it up in your git config so every time you'll add new commit, it'll appear as a default text!

![](https://driggl-prod.s3.amazonaws.com/media/project/e4bd6bca-6540-45d5-a89f-43f2dfd43f81/media_upload/b28edf0b-4d7f-4144-8f0d-fcd83dbf8985/media_file/blog_default-custom-commit-template.png)Custom default git commit message.

1

This is how it looks in my terminal each time I type _git commit_. I don't need to remember about all golden rules to writing nice commit, I don't need to remember about tags I use or the structure I want to keep. Everything is there, I can just uncomment specific lines and replace them with what I want. This gives me a huge boost to productivity while allowing me to ensure every change I'm adding is well described to help in any future work on the project.

#### How to set up custom default commit message?

Installing it is super easy, and it just requires from you a text file with default message you'd like to have.

1.  Create a file with your template (or download mine).
2.  In your shell type: _git config --global commit.template \<path/to/your/git-commit-template.txt>_

Example:

```bash
git config --global commit.template ~/Downloads/git-commit-template.txt_
```

I really like this solution and it's one of the best things I ever discovered in Git so I really encourage you to try it out.

### Summary

Do you want to know more tips like this?

#### Special thanks

- [Chris Beams](https://chris.beams.io/)- for the great article about describing the proper commit messages on his blog.
- [Brooke Cagle](https://unsplash.com/@brookecagle) for the great Cover image
- My Friend - for inspiring me to write this Article.
