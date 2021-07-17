import { NextSeo } from 'next-seo';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import ArticlesGrid from '../../features/articles-grid/index';
import ArticleLayout from '../../layouts/article-layout';
import { setAuthors } from '../../redux/slices/authors';
import { setArticles } from '../../redux/slices/articles';
import { getAllFilesFrontMatter } from "../../utils";

export default function BlogIndex({ posts, authors }) {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setArticles(posts));
    dispatch(setAuthors(authors));
  }, [dispatch]);
  return (
    <>
      <NextSeo
        title="Recent articles"
        titleTemplate="%s | Driggl - Modern web development"
        description="Build modern websites like a professional with Driggl's Community!"
        openGraph={{
          title: 'Recent articles',
          description:
            'Newest content from web Professionals and the Modern web development Community!',
          images: ['/home-cover.jpg'],
          type: 'website',
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
