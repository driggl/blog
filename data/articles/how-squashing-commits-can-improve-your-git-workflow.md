---
title: "How squashing commits can improve your git workflow!"
excerpt: "Get familiar with one of the nicest git-related things ever: squashing.  Not squashing bugs, but rather squashing commits."
slug: "how-squashing-commits-can-improve-your-git-workflow"

tags: []
thumbnail:
  big: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/8c20352c-daf3-42b3-92e3-6f8a4675c871/cover/blog.jpeg"
  full: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/8c20352c-daf3-42b3-92e3-6f8a4675c871/cover/full.jpeg"
  mini: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/8c20352c-daf3-42b3-92e3-6f8a4675c871/cover/mini.jpeg"
  small: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/8c20352c-daf3-42b3-92e3-6f8a4675c871/cover/small.jpeg"
  medium: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/8c20352c-daf3-42b3-92e3-6f8a4675c871/cover/medium.jpeg"
  sharing: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/8c20352c-daf3-42b3-92e3-6f8a4675c871/cover/sharing.jpeg"
  original: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/8c20352c-daf3-42b3-92e3-6f8a4675c871/cover/original.jpeg"
publishedAt: "2018-12-11"
author: "swilgosz"
---

Knowing Git at certain level can really improve the speed and quality of your work together with reducing your stress and chance of making mistakes. In this  article, I'll show you my git workflow and cover one of the nicest git-related things ever: **squashing**.

Not squashing bugs, but rather squashing the commits.

Before we'll jump deep into the tutorial, I'd like to point one really important thing: The whole approach here bases on the **well-written commit messages for every single change you apply** and I already wrote an article about [writing good commit messages efficiently](https://driggl.com/blog/a/how-to-write-professional-commits-efficiently) so I strongly suggest to check it out first.

**In this article we will cover:**

1.  What is squashing commits?
2.  When squashing commits can be useful?
3.  My usual git workflow

### What is squashing the commits?

Git is a revision tracking tool, which allows you to track every single change you made and then, apply it to the list of change. This list is called a log or a history. The difference between git history and the real one is that in real life when something happens, it happened.

In Git, however, you can modify whatever you want. Really.

> What you commit on your local does not need to be reflected in the final version of the git history.

When you interact with git's history, it's called _interactive rebase_ and it allows you to do a wide range of different things, like:

- re-ordering commits
- editing,
- renaming,
- splitting apart
- merging together
- removing

**Squashing commits** is a term to merge two (or more commits together) and together with an edition of the commit, it's the most often feature I use when it comes to interactive rebase.

### When Squashing commits can be useful

You need to realize** the one important thing:**

**What you commit on your local \*\***branch** or even the remote feature branch, **does not need to be the same as what you merge to master\*\* and leave in the history for future generations to see.

Have you ever found yourself with not-committing a change because you were not sure if you'll keep the code as it is, or change more than once?

Have you ever ended up with dozens of unstaged changes and adding them one after one to see what was changed in which?

**There is a solution for that!**

Commit often, push often, and update the history whenever it's needed.

#### An example of updating the git's history

Let's assume we added a change and we are going to write the test for that. Then the test detects a bug in our code, so we go back to the implementation and add a fix.

We end up with three commits:

![](https://driggl-prod.s3.amazonaws.com/media/project/e4bd6bca-6540-45d5-a89f-43f2dfd43f81/media_upload/a11e50c9-fd1d-48a9-b80e-cb05962e427c/media_file/blog_commit-list-dirty.png)

But that is far from looking professional. First of all, you probably don't want to share with other devs all bugs and troubles you met while developing the feature, and nobody cares about that as long as your feature is working at the end and you delivered it in the expected timeframe.

Maybe also you'd like to add more information to the feature you worked on, link the task or related article so it'll be easier for others to do the review?

Finally, maybe you'd like to have tests written before the actual feature? (Cheaty :D ).

If so, here is a solution how to do it.

    git rebase -i head~3

This simple command will open the editor configured as default for git (in my case it's, of course, VIM) and show you the list of last three commits on your branch:

![](https://driggl-prod.s3.amazonaws.com/media/project/e4bd6bca-6540-45d5-a89f-43f2dfd43f81/media_upload/e37f7681-2b2b-4898-b198-fa96b2c7df2c/media_file/blog_interactive-rebase-editor.png)

From here according to the default instructions in the commented text, you can do whatever you want with those commits and after saving and closing this file, you'll end up with completely overwritten history. for your branch.

In my case, I decided to move the commit including test coverage to the top as I'm an author of Test Driven Development Course for Rails API so it'd be a shame to not have tests written first :D.

Then I squashed two other commits together, with a way of updating the message so I could add more details for code reviewers.

![](https://driggl-prod.s3.amazonaws.com/media/project/e4bd6bca-6540-45d5-a89f-43f2dfd43f81/media_upload/ce48b3bf-68d0-4972-ab7b-f91603ef8153/media_file/blog_updated-history-editor.png)

After saving and closing the file we have the clean and ordered history and whoever will ever look on _git blame_, or changes history - definitely will be glad. Including **future you**!

### My usual git workflow

#### Feature branches

In Driggl we work with feature branches, which we merge to master for release. For each new task, we create a new branch from master one and we merge it to master when the task is done. The ideal flow works like this:

![](https://driggl-prod.s3.amazonaws.com/media/project/e4bd6bca-6540-45d5-a89f-43f2dfd43f81/media_upload/f6142686-691d-45ff-a94e-10155a7f5747/media_file/blog_ideal-git-flow.png)

The problem is that in the meantime there are other developers working on features, and update the master branch which can result in conflicts to be solved. So the real flow looks rather like this:

![](https://driggl-prod.s3.amazonaws.com/media/project/e4bd6bca-6540-45d5-a89f-43f2dfd43f81/media_upload/74624866-4eef-439b-8c22-a98c092f0527/media_file/blog_1544566003497.png)

To prevent a situation, when we introduce bugs by badly solved conflicts when merging to master, we often use git rebase master to update our feature branches with current master stuff.

![](https://driggl-prod.s3.amazonaws.com/media/project/e4bd6bca-6540-45d5-a89f-43f2dfd43f81/media_upload/d6a85e0c-c4d6-4cd0-82db-7eb7a9d8ea13/media_file/blog_1544565955534.png)

#### Pull requests and squashing commits.

I commit often and I don't care too much about properly formatted commit messages neither about changing the same thing twice. Nobody cares about what is on my feature branch until the other person:

1.  is involved for contribution on my feature
2.  is looking for a commit introducing the bug
3.  wants to collaborate on my code.

So there are certain situations when it becomes nice to have small, logically structured and[ well-described commits ](https://driggl.com/blog/a/how-to-write-professional-commits-efficiently)in your git history.

1.  When you finish the task to have a clean history
2.  When you ask something for help
3.  When you report your feature for a review.

I used to create a lot of commits which are dirty and far from final form, and also push them to the remote repository every time I want the CI to handle my tests runs. But then, when the feature is done, I often go through my changes using **interactive rebase**, squash all commits and split them into encapsulated portions, and prepare appropriate commit messages.

Only then I create pull requests so other developers are notified to add the code reviews.

And here there is an important thing to mention. When I want the review to happen, I have very few, well-structured and well-described commits, so it's easy for others to review, easy for me to update my branch on top of master, and easy to get the context about my changes in the future.

#### The condensed flow:

```bash
git checkout -b 1-create-articles
git commit; git commit; git commit ....
git push;
...
git rebase -i head~3 #do the magic by changing the git's history
git rebase master
git push -f
create pull request
git merge 1-create-articles
```

### Summary

Git is a powerful tool and mastering it can make our lives much easier.

Unfortunately, most of the people just stay with _pull, push_ and commit commands without discovering all possibilities git offers. There are several approaches for efficient and flexible development using git and feature branches with rebasing them and then merging to master is only one of them.

**I'm keen to hear about your workflows **if you work with something interesting.

**What do you think with this one?**

**Please share your thoughts in the comments!**

#### Special Thanks

1.  Hubert Olender for inspiring me to write this article
2.  [Rawpixel](https://unsplash.com/@rawpixel) for the great cover photo
