import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App";
import "./styles.css";

if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/Personal_Rehabilitation_Companion/sw.js");
  });
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter basename="/Personal_Rehabilitation_Companion">
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
