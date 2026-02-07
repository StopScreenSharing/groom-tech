import React from "react";
import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import App from "./components/App";
import { AppProvider } from "./context/AppContext";
import "./index.css";



const container = document.getElementById("root");
const root = createRoot(container);
root.render(
    <BrowserRouter>
        <AppProvider>
        <App />
        </AppProvider>
    </BrowserRouter>
);
