---
title: "Should You start using VIM?"
excerpt: "VIM is one of the best editors for people who want to be really productive in their work. BUT - should you start learning it right now?"
slug: "should-you-start-using-vim"

tags: []
thumbnail:
  big: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/03ba8d16-f093-4099-a756-a285407fd6af/cover/blog.jpeg"
  full: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/03ba8d16-f093-4099-a756-a285407fd6af/cover/full.jpeg"
  mini: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/03ba8d16-f093-4099-a756-a285407fd6af/cover/mini.jpeg"
  small: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/03ba8d16-f093-4099-a756-a285407fd6af/cover/small.jpeg"
  medium: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/03ba8d16-f093-4099-a756-a285407fd6af/cover/medium.jpeg"
  sharing: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/03ba8d16-f093-4099-a756-a285407fd6af/cover/sharing.jpeg"
  original: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/03ba8d16-f093-4099-a756-a285407fd6af/cover/original.jpeg"
publishedAt: "2018-11-06"
author: "swilgosz"
---

If you know me you know that I'm a VIM enthusiast and I love everything that can improve my productivity. As in my [Rails API course](https://www.udemy.com/ruby-on-rails-api-the-complete-guide/?couponCode=DGLWEB), I used VIM as my coding editor, my students started to ask **if it's worthy of learning or if they should switch to VIM** as it looks crazy productivity-friendly.

In this article, I'd like to share my thoughts about learning VIM together with how I did it. So if you consider that, keep reading! ;)

### What is good about VIM 

Yes, VIM is great.

Vim as a coding editor allows you to completely get rid of your mouse. Everything can be controlled via your keyboard shortcuts and **if you master them, you can be much more productive than in any kind of "standard" editor**.

There are few main advantages that VIM offers that none of the other editors available there can beat (maybe except [Emacs](https://www.gnu.org/software/emacs/)).

#### Available everywhere

If you are using the Unix-Family OS system, you probably already have VIM installed. This is the main reason why every developer should know at least the BASICS of VIM. If you'll ever want to edit anything on the remote server, or in other developer's computer, you can always try \`vim\` command in your terminal to do the work - even if in an inefficient way.

![](https://driggl-prod.s3.amazonaws.com/media/project/e4bd6bca-6540-45d5-a89f-43f2dfd43f81/media_upload/861a5e74-6995-4f3d-a3d4-482a02f6cc7f/media_file/blog_1541543103498.png)

When I started as a developer, I also had my own server and that was a useful knowledge, but nowadays in the Docker's era and slim system images, there are more and more situations when you'll find VIM not being installed anymore.

#### Different modes

If you are a writer - you mainly do the writing. This is reasonable then to open the code editor and just add some letters, using arrows only if you occasionally need to move to another place in your text.

The life of the developer looks quite different, however. We switch between files, scroll a lot, jump to different indentations and keywords, look for bugs, try out something, then edit, save, run and change again.

For us, the thing we do the most is the movement and bulk editing. And this is exactly what VIM allows you to do by default.

There are several modes in VIM. The "_edit_" mode is responsible for writing text, but it's not a default mode. The default is called "_normal_" mode and is responsible exactly for what developers need the most.

**You have incredible possibilities for movement** between code snippets, files, lines, folders, tabs and whatever else you need.

Thanks to different modes Vim provides, the same shortcuts mean different things in different modes **so you can triple the possibilities that you keyword normally gives you**.

#### Can be run inside of the terminal

I like to be focused on one thing when I'm working and too many windows being opened is not exactly what I would like to have. Thanks to the fact that VIM can be opened inside of the terminal, you don't need to switch between terminal and code editor all the time.

Also, there is no visual difference between them, so your eyes are less tired with flashes and screen changes. It also can be integrated with [TMUX](https://github.com/tmux/tmux) and your whole workflow can be put into yet another level.

#### It's fast.

Opening the Vim comparing to launching other applications is crazy fast and the same applies for changing the files. I had some problems with performance in very large projects though.

### What is bad about VIM

What I'll say now is not something you would expect. Usually if one is a VIM enthusiast, one talks about pros but remains silent when it comes to talking about the disadvantages of VIM as the main editor.

I'm quite different. I really like this tool because of how it changed my life and my daily flow, but I had a hard time with that and I'd want to be honest with you. VIM is not for everyone and one needs to mature to be able to use it well.

#### High learning Curve

If you ever accidentally opened the VIM in Unix systems (git merge ?), you probably wondered what happened and how to exit. This is actually one of the most often asked questions people type in the Google in association to the VIM keyword!

![](https://driggl-prod.s3.amazonaws.com/media/project/e4bd6bca-6540-45d5-a89f-43f2dfd43f81/media_upload/8c411902-3e0a-4d88-84f0-1525a3f49dfb/media_file/blog_1541534004415.png)

Basically EVERYTHING you learned your whole life about code editors and editing a text you need to learn from scratch in a different way. You can't just open VIM and write text, as the default mode is the Normal mode - responsible for moving around and applying changes on chunks of text, like words, paragraphs, indents of files!

If you type "_D_", everything from the cursor position to the end of the line will be removed! Do you want to type: "_google_" somewhere? You'll end up with "_ogle_" placed in the last opened file!

So everything in VIM seems to be awkward at the first glance and you need to spend a lot of time to start being productive at least at the point you were in normal editors. The learning curve in VIM is really high and that is a reason why a lot of people gives up shortly after the start.

As I was really efficient using Sublime Text, after started learning VIM, it took me half a year to learn it at the level that allowed me to switch commercial coding and give up on Sublime. And I'm still learning.

#### Problematic customization

Vim allows you to customize basically everything. The amount of things you can adjust is endless, you can even interact with source code, write extensions and rewrite every single command/shortcut you wish.

That power, however, comes with proportional difficulties in usage. Honestly, in 95% of cases, you don't need all of that and each of modern code editors, like Atom, Sublime or Visual Code offer much easier and more intuitive configuration interface and plugin package managers.

Modern editors work with popular languages "out of the box" or almost like that. VIM in the RAW form just sucks so better prepare yourself for that.

### So should I start learning VIM?

Summarizing all of above, answer yourself: why do you consider switching?

#### Do you want to be more productive?

That's reasonable. VIM offers you a way to be productive as hell. But is it the code editor that stops you from improving your productivity skills? Do you mastered the tech stack you work with on the level you can say: "now the thing that slows me down the most is the editor"?

Often beginners start to learn a programming language and their most concern is: "Which editor to use?". Then they find VIM, they read that it allows to do a real magic on the screen and they start learning it in parallel to the programming language.

The problem is that nobody pays you for using the editor, but for what you can do for their projects. If you start with any technology or programming in general, there usually is so much to read that there is no time to learn about the editor!

My opinion on that is clear: If you don't know your tech stack, focus on mastering it first.

#### The best developers use VIM or Emacs

I don't agree. A lot of best developers use VIM or Emacs, but also a lot use any other popular code editor. I know many great developers that don't bother with VIM or Emacs at all. They say that an editor is only a tool and like any other tool, it should be easy to use and easy to replace when better will appear in the market.

And I kind of agree with that.

#### It's cool to do the Vim's magic

Yeah, it's cool, but much more cool is getting things done and getting well paid for it ;). If you can afford to lose your productivity to a while and you know you have enough determination to learn Vim, go for it. Otherwise do what all the successful people do all the time: define what's most important for your growth at the current time and focus on that.

### What are MY reasons to use VIM?

By reading this article you probably think: Ok... what is wrong with this guy? He is a VIM user, he loves it and at the same time, he says basically: Think three times before you make VIM your basic editor.

That's all true. I love VIM and I doubt I ever will change it to something else. BUT the most important thing for me is **the success of my students**. If I would considered employing you, I'd not care about the editor you use at all. The effectiveness of your work would be what I would care about and this is what I share those thoughts about this topic.

#### In my case things look like this:

I am a senior developer that knows Ruby, Javascript, HTML, and CSS pretty well. **I'm not the best developer in the world, but at these technologies, I'm pretty good**. I don't spend too much time anymore to read all available docs, try out best practices, libraries and language structure **but I can ensure you that this was what I did first**.

Also even as I'm a developer, **my even greater passion is productivity in general**. I automate and improve every single thing I do and I am never bored with that. Before I even started with VIM, I mastered Sublime Text, implemented a really advanced shell configuration and terminal adjustments, got familiar with TMUX and only when I felt that the editor actually is the bottleneck for my skills and productivity to grow, I started learning VIM.

I don't feel bad if I spend my free time to lean thing that can save a few minutes on my daily workflow because I really like it. This is why I was not frustrated too much after hours and hours of VIM's configuration and learnings.

**So should YOU start learning VIM?**

If that summary didn't scare you - probably you should ;).

**What do you think about it? Do you have any strong opinon?\*\***  \*\*Please share it with the comments!

Or maybe you already use VIM? **What were your reasons to learn it?**

#### Special thanks

- [Camylla Battani](https://unsplash.com/@camylla93) for the great cover image
- Draw Neil for the Great Book without which I wouldn't be where I am: [Practical Vim: Edit Text at the Speed of Thought](https://www.goodreads.com/book/show/13607232-practical-vim)
- Every single VIM's contributor.
- [Neovim](https://neovim.io/) contributors for making VIM so much better.
