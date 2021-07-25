/* eslint-disable jsx-a11y/anchor-is-valid */
import { Grid, Container, makeStyles } from "@material-ui/core";
import EmailSubscriptionForm from "../features/email-subscription-form";
import GHSponsor from "../features/gh-sponsor";
import BuyMeACoffee from "../features/buy-me-a-coffee-button";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(4),
  },
  card: {
  },
}));

const ArticleLayout = ({ article }) => {
  const classes = useStyles();
  return (
    <Container maxWidth="lg" component="main">
      <Grid container className={classes.root} spacing={2}>
        <Grid item xs={12} md={8} component="article">
          {article}
        </Grid>
        <Grid
          item
          xs={12}
          md={4}
          component={(props) => (
            <Container maxWidth="lg" component="aside" {...props} />
          )}
        >
          <GHSponsor className={classes.card} />
          <BuyMeACoffee className={classes.card} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default ArticleLayout;
