import { NextSeo } from "next-seo";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import ArticleLayout from "../../layouts/article-layout";
import ArticlesGrid from "../../features/articles-grid/index";
import { setAuthors } from "../../redux/slices/authors";
import { getAllFilesFrontMatter } from "../../utils";

export default function BlogIndex({ posts, authors }) {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setAuthors(authors));
  }, [authors]);
  return (
    <>
      <NextSeo
        title="Recent articles"
        titleTemplate="%s | Driggl - Modern Web development"
        description="Learn how to develop ruby web applications in a modern way!"
        openGraph={{
          title: "Recent articles",
          description:
            "Learn how to develop Ruby web applications in a modern way!",
          images: ["/home-cover.jpg"],
          type: "website",
        }}
      />
      <ArticleLayout article={<ArticlesGrid articles={posts} />} />
    </>
  );
}

export async function getStaticProps() {
  const posts = await getAllFilesFrontMatter("articles");
  const authors = await getAllFilesFrontMatter("team");

  return {
    props: { posts, authors }, // will be passed to the page component as props
  };
}
