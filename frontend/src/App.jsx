import React, { Component } from "react";
import Routes from "./Routes";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import "./App.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

const theme = createTheme();

export class App extends Component {
  state = {
    error: null,
    errorInfo: null,
  };

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
  }

  render() {
    const { error } = this.state;
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <React.Fragment>
          {!error && <Routes />}
          {error && (
            <div className="Web_Title text-center mt-5">
              <h3>Something went wrong. Please reload the page.</h3>
            </div>
          )}
        </React.Fragment>
      </ThemeProvider>
    );
  }
}

export default App;
