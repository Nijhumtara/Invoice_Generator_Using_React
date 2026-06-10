import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./App.css";
import App from "./App.jsx";
import NewInvoice from "./pages/NewInvoice.jsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { InvoiceProvider } from "./context/InvoiceContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <InvoiceProvider>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/new-invoice" element={<NewInvoice />} />
          <Route path="/invoice/:id" element={<NewInvoice />} />
        </Routes>
      </InvoiceProvider>
    </BrowserRouter>
  </StrictMode>,
);
