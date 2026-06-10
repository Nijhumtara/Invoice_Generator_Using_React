import { createContext, useContext, useState } from "react";

const InvoiceContext = createContext();

export function InvoiceProvider({ children }) {
  const [invoices, setInvoices] = useState([]);

  const addInvoice = (invoice) => {
    setInvoices([...invoices, invoice]);
  };
  const updateInvoice = (updatedInvoice) => {
    setInvoices(
      invoices.map((inv) =>
        inv.id === updatedInvoice.id ? updatedInvoice : inv,
      ),
    );
  };
  const deleteInvoice = (index) => {
    setInvoices(invoices.filter((_, i) => i !== index));
  };

  return (
    <InvoiceContext.Provider value={{ invoices, addInvoice, updateInvoice, deleteInvoice }}>
      {children}
    </InvoiceContext.Provider>
  );
}

export const useInvoice = () => useContext(InvoiceContext);
