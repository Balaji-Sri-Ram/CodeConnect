import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { ThemeProvider } from "./components/ThemeProvider";

createRoot(document.getElementById("root")).render(
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <App />
    </ThemeProvider>
);
