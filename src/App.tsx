import React from "react";
import { CssBaseline } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CookiesProvider } from "react-cookie";
import MainComponent from "./components/containers/main-container";

function App() {

  // define theme
  const theme = createTheme({
    palette: {
      primary: {
        light: "#63b8ff",
        main: "#1a3072",
        dark: "#1a3072",
        contrastText: "#fff",
      },
      secondary: {
        main: "#4db6ac",
        light: "#82e9de",
        dark: "#00867d",
        contrastText: "#fff",
      },
    },
  });  

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CookiesProvider>
        {/* <SnackbarProvider maxSnack={3}>
          <ErrorBoundary> */}
            <MainComponent />
          {/* </ErrorBoundary>
        </SnackbarProvider> */}
      </CookiesProvider>
    </ThemeProvider>
  );
}

export default App;
