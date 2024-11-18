import React from "react";
import ReactDOM from "react-dom/client";
import App from "~/App.jsx";
import CssBaseline from "@mui/material/CssBaseline";
import { Experimental_CssVarsProvider as CssVarsProvider } from "@mui/material/styles";
import theme from "~/theme";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ConfirmProvider } from "material-ui-confirm";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { BrowserRouter } from "react-router-dom";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/*  base name là /abc => mọi url đều có cái /abc phía trước  */}
    <BrowserRouter basename="/">
      <Provider store={store}>
        <CssVarsProvider theme={theme}>
          <ConfirmProvider>
            <CssBaseline />
            <App />
            <ToastContainer />
          </ConfirmProvider>
        </CssVarsProvider>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);
