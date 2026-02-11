import React from "react";
import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";

import App from "./components/App";
import { AppProvider } from "./AppContext";

import { ThemeProvider, CssBaseline, createTheme } from "@mui/material";
import "./index.css";

const theme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "#1976d2",
        },
    },
});



const container = document.getElementById("root");
const root = createRoot(container);
root.render(
    <BrowserRouter>
        <ThemeProvider theme={theme}>
        <CssBaseline />
            <AppProvider>
                <App />
            </AppProvider>
        </ThemeProvider>
    </BrowserRouter>
);
