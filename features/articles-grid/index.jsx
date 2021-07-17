import { Grid, makeStyles } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { getAllArticles } from '../../redux/slices/articles';
import ArticleTile from './tile';

const useStyles = makeStyles((theme) => ({
  list: {
    listStyle: 'none',
    padding: theme.spacing(0, 4),
  },
}));

const ArticlesDisplay = (props) => {
  const classes = useStyles();
  const articles = props.articles;
  return (
    <Grid container component="ul" className={classes.list} spacing={6}>
      {articles.map((article, index) => (
        <Grid item items xs={12} md={index === 0 ? 12 : 6} component="li">
          <ArticleTile article={article} />
        </Grid>
      ))}
    </Grid>
  );
};

export default ArticlesDisplay;
