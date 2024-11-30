import React from "react";
import ReactDOM from "react-dom/client";
import App from "~/App.jsx";
import CssBaseline from "@mui/material/CssBaseline";
import GlobalStyles from "@mui/material/GlobalStyles";

import { Experimental_CssVarsProvider as CssVarsProvider } from "@mui/material/styles";
import theme from "~/theme";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ConfirmProvider } from "material-ui-confirm";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { BrowserRouter } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import { injectStore } from "./utils/authorizeAxios";
const persistor = persistStore(store);

// kĩ thuật inject store vào file js thuần
injectStore(store);

ReactDOM.createRoot(document.getElementById("root")).render(
  <>
    {/*  base name là /abc => mọi url đều có cái /abc phía trước  */}
    <BrowserRouter basename="/">
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <CssVarsProvider theme={theme}>
            <ConfirmProvider>
              <GlobalStyles
                styles={{
                  a: {
                    textDecoration: "none",
                  },
                }}
              />
              <CssBaseline />
              <App />
              <ToastContainer />
            </ConfirmProvider>
          </CssVarsProvider>
        </PersistGate>
      </Provider>
    </BrowserRouter>
  </>
);
