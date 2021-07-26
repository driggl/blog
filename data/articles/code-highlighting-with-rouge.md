---
title: "Code Highglighting with Rouge"
excerpt: "Code highlighting is one of the more important things on technical blogs, and it's nice to choose the best solution available. The rouge Gem works just great for ruby applications so here is how to use it."
slug: "code-highlighting-with-rouge"

tags: []
thumbnail:
  big: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/96ea95db-4329-4cc0-af83-5b4b8461b7ba/cover/blog.jpeg"
  full: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/96ea95db-4329-4cc0-af83-5b4b8461b7ba/cover/full.jpeg"
  mini: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/96ea95db-4329-4cc0-af83-5b4b8461b7ba/cover/mini.jpeg"
  small: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/96ea95db-4329-4cc0-af83-5b4b8461b7ba/cover/small.jpeg"
  medium: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/96ea95db-4329-4cc0-af83-5b4b8461b7ba/cover/medium.jpeg"
  sharing: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/96ea95db-4329-4cc0-af83-5b4b8461b7ba/cover/sharing.jpeg"
  original: "https://driggl-prod.s3.eu-central-1.amazonaws.com/sourcer/blogs/99a95609-d8fd-4a84-994c-2386fd1c15de/articles/96ea95db-4329-4cc0-af83-5b4b8461b7ba/cover/original.jpeg"
publishedAt: "2018-10-30"
author: "swilgosz"
---

Code highlighting is one of the more important things on technical blogs, and** it's nice to choose the best solution available**. Honestly, I struggled with that. There are a couple of solutions published out on the Internet, listing: [CodeRay](https://github.com/rubychan/coderay), Rouge, and [Pygments](http://pygments.org) to mention only few of them. In Driggl we decided to implement code syntax highlighting using [Rouge](https://github.com/jneen/rouge), and in this short tutorial, we'll cover our approach how to do it well.

### Why Rouge for syntax highlighting in Ruby?

In the early application state, it's quite an important thing to keep the number of dependencies and different technologies used by the application as small as possible. It helps you configure the environment, simplifies the complexity of the deploys and It's easier to add changes as the application growths.

For small web applications, it doesn't really matter if the code highlighting is written in C++ or Ruby, and when the speed of that little feature will start to matter, it should not be a problem to switch into another tool.

As **Driggl's engine is written in Ruby**, we looked for a solution that will be easy to adjust if needed without learning new technology. This is why we considered CodeRay or Rouge - two most popular plugins for code highlighting written in Ruby.

I used the CodeRay in the past, but the problem with that is:

- It supports little more than 20 languages out of the box
- When I write this article, the latest commit was on December 2017, which is around a year ago.

In comparison to Rouge:

- Rouge supports 196 languages right now
- The last commit was 19 days ago

As we don't really know how many languages we'll need to touch while writing articles on our blog, it comes obvious that having a way to highlight as many languages as possible is a pretty good thing.

After summarizing those points, the obvious choice for code highlighting Library was Rouge **even though it's still a bit buggy** and the documentation for it is not very friendly.

We thought: why something would stop us from improving that? So in this article, I'll show you our approach to implement that in Rails application.

### Our approach for the code highlighting.

We need to highlight code snippets in our articles. Not every article will have code examples, but every article at some point will have some kind of dynamically generated content, SUCH AS code snippets, shortcodes, newsletter forms, or call to actions widgets.

We need to have then a way to easily edit those parts of the article's body together with delivering final, transformed content fast and in the readable form and this is why an extra column in the database for the processed version of the article body seems to be a reasonable thing to have.

We started from a simple migration then:

```ruby
    # db/migrate/20181005174043_add_processed_content_to_articles.rb
    class AddHighlightedContentToArticles < ActiveRecord::Migration[5.1]
      def change
        add_column :articles, :processed_content, :text
      end
    end
```

In this extra column, we store the final, processed content for the article keeping the natural, editable form untouched, which is friendly for any kind of WYSYWIG  or markdown editor.

We can consider leveraging the rendering cache instead of extra database\* \*column, but for now, this solution is just perfect.

Having that we needed to integrate the Rouge.

### The Code Highlighting Service

The first step to integrating the rouge was, as usual, adding it to the _Gemfile_.

```ruby
    # Gemfile
    gem 'rouge'
```

Next, after running _bundle_ we needed to write the actual service:

```ruby
    # app/lib/driggl/code_highlighter.rb

    module Driggl
      class CodeHighlighter
        def self.call(text)
          text.gsub(/(<pre>(.*?)<\/pre>)/m) do
            content = CGI.unescapeHTML($2)
            content = formatter.format(lexer.lex(content))
            content.gsub('"err"', '"nf"')
          end
        end

        private

        def self.formatter
          @formatter = Rouge::Formatters::HTMLLegacy.new(
            css_class: "highlight"
          )
        end

        def self.lexer
          @lexer = Rouge::Lexers::Ruby.new
        end
      end
    end
```

In the most basic form, it has only the one public method named _call_, and it accepts the input text to be highlighted. Then, using a _gsub_ method on that text and simple regexp match, we replace the whole text inside of the *\<pre>\</pre> *HTML tags by processing it using objects that come from the gem.

Rouge has two basic types of objects we use to transform our input. The _formatters_ and _lexers_.

#### Lexers 

A lexer is an object specific to the code language we want to process. Every Language the library supports has its own lexer. Therefore we can use them like this:

    def self.lexer
      @lexer = Rouge::Lexers::Ruby.new
    end

For this basic version of the service we just implemented the Ruby as the only supported lexer for now. We'll change that soon so we'll be able to dynamically recognize which language the snippet represents and apply proper parsing for it. But that's for later, now let's move to the next thing.

#### Formatters

Formatters are classes, recognizing which kind of the output we want to get from it. In our example, we want the HTML and after testing a few formatters we found that HTMLLegacy formatter works the best. It just takes as an argument the text with language-specific markups applied, and wrap it in the appropriate tags.

```ruby
    def self.formatter
      @formatter = Rouge::Formatters::HTMLLegacy.new(
        css_class: "highlight"
      )
    end

    ...
    content = formatter.format(lexer.lex(content))
```

The formatter accepts several options to adjust our output. We used _css_class_ option which addes the _.highlight_ css class for the prepared snippet.

### Calling the service.

This approach allows us to have the result completely independent of the input source and we can easily change highlighting solutions in the future, or add processing services when needed.

We can now just call the service however we want. In the _callback_, article updating service, or the event listener for _article_updated_ event. As we do make heavy use of [Trailblazer artchitecture](http://trailblazer.to/), we have an separate service for every controller's action named operations. This way, instead of active*record's callbacks, we call the highlighter from the \_Article:\*\*:Update* operation.

```ruby
    module Article::Operation
      class Update < Admin::ApplicationOperation
        step Model(Article, :find)
        step .... #persistance and validation steps logic
        step :highlight!

        private

        def highlight!(_options, **)
          _options['model'].highlighted_content = Driggl::CodeHighlighter.(_options['model'].content)
          _options['model'].save
        end
      end
    end
```

This way we can easily move it to asynchronous processing or events listeners later on. Also our controllers become really clean now.

```ruby
    class ArticlesController
      def update
        process_operation!(Admin::Article::Operation::Update)
      end
    end
```

### Styling it up

So far we managed to apply tags and CSS classes to every keyword in our snippet based on the programming language we present. The result is an HTML code, that looks like this:

```html
<div class="highlight">
   
  <pre class="highlight">
        <code>
          <span class="c1"># ActiveModelSerializers approach</span>

          <span class="k">class</span> <span class="nc">ArticleSerializer</span> <span class="o">&lt;</span> <span class="no">ActiveModel</span><span class="o">::</span><span class="no">Serializer</span>

          <span class="nf">&nbsp;</span> <span class="n">attributes</span> <span class="ss">:id</span>
          <span class="p">,</span> <span class="ss">:title</span>
          <span class="p">,</span> <span class="ss">:content</span>
          <span class="p">,</span> <span class="ss">:slug</span>
          <span class="k">end</span>
        </code>
      </pre>
</div>
```

Now the only thing left is to add some CSS rules to our stylesheets, so that classess inside of the* .hightlight* div will be colored properly. Fortunately **Rouge comes with several CSS themes** which we can choose from.

```text
- base16.rb
- colorful.rb
- github.rb
- gruvbox.rb
- igor_pro.rb
- molokai.rb
- monokai.rb
- monokai_sublime.rb
- pastie.rb
- thankful_eyes.rb
- tulip.rb
```

In Driggl we decided to choose the _Base16_ theme with the _dark_ mode, and to apply it, we needed to insert just one method in the proper view partial.

```ruby
    # app/views/layouts/stylesheets.html.erb

    <style\><%= ::Rouge::Themes::Base16.mode(:dark).render(scope: '.highlight') %></style\>
```

And the result you can see on this article.

### Summary

**I can't say that Rouge is the best solution available on the Internet just yet.** It's evolving, and become better all the time, but for now, there are several bugs and very poor documentation which can be a pain for developers who just start their journey in Ruby.

I'm sure it'll be a much better tool very soon, and I'll probably collaborate with this project a little bit to help with that.

#### Special Thanks

- [Erwan Hensry](https://unsplash.com/@erwanhesry), for the great cover image
