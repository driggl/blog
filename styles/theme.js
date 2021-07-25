import { createMuiTheme } from "@material-ui/core";
import { orange } from '@material-ui/core/colors';

export default createMuiTheme({
  palette: { primary: { main: "#E89B4B" } },
  overrides: {
    MuiButton: {
      containedPrimary: { color: "#fff" },
    },
    MuiCssBaseline: {
      "@global": {
        html: {
          WebkitFontSmoothing: "auto",
        },
      },
    },
  },
});
