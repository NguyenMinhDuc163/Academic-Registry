import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { store } from "./app/store";
import { Provider } from "react-redux";
import { ToastContainer, Zoom} from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
      <ToastContainer
  position="top-right"
    autoClose={5000}
    hideProgressBar
newestOnTop={false}
closeOnClick
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
theme="colored"
transition={Zoom}

    />

        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
