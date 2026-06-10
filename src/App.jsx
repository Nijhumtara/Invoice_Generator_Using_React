import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useInvoice } from "./context/InvoiceContext";

function App() {
  const { invoices, deleteInvoice } = useInvoice();

  const totalEarned = invoices
    .filter((inv) => inv.status == "Paid")
    .reduce((sum, inv) => sum + inv.amount, 0);
  const totalPending = invoices
    .filter((inv) => inv.status == "Unpaid")
    .reduce((sum, inv) => sum + inv.amount, 0);
  const totalCount = invoices.length;

  const navigate = useNavigate();
  return (
    <>
      <header id="navBar">
        <div id="logo">
          <i className="fa-solid fa-file-lines"></i>
          <p>InvoiceFlow</p>
        </div>
        <button id="addButton" onClick={() => navigate("/new-invoice")}>
          <i className="fa-solid fa-plus"></i>
          <span>New Invoice</span>
        </button>
      </header>
      <section id="totalInvoice">
        <div className="totalInvoiceContainer" id="box1">
          <p className="title">Total Earned</p>
          <p className="amount">${totalEarned.toLocaleString()}</p>
          <p className="fromStatus">From paid invoices</p>
        </div>
        <div className="totalInvoiceContainer" id="box2">
          <p className="title">Total Pending</p>
          <p className="amount">${totalPending.toLocaleString()}</p>
          <p className="fromStatus">From unpaid invoices</p>
        </div>
        <div className="totalInvoiceContainer" id="box3">
          <p className="title">Total Invoices</p>
          <p className="amount">{totalCount}</p>
          <p className="fromStatus">All time</p>
        </div>
      </section>
      <section id="invoiceList">
        <div className="table-wrap">
          <table id="invoiceTable">
            <thead id="invoiceHead">
              <tr id="invoiceRow">
                <th className="headColumn">Invoice No</th>
                <th className="headColumn">Client Name</th>
                <th className="headColumn">Date</th>
                <th className="headColumn">Due Date</th>
                <th className="headColumn">Amount</th>
                <th className="headColumn">Status</th>
                <th className="headColumn">Actions</th>
              </tr>
            </thead>
            <tbody id="invoiceBody">
              {invoices.map((inv, index) => (
                <tr key={inv.id}>
                  <td className="invNo">{inv.id}</td>
                  <td>{inv.client}</td>
                  <td>{inv.date}</td>
                  <td>{inv.dueDate}</td>
                  <td id="invoiceAmount">
                    <strong>${inv.amount.toLocaleString()}.00</strong>
                  </td>
                  <td>
                    <span
                      className={
                        inv.status === "Paid" ? "badge paid" : "badge unpaid"
                      }
                    >
                      {inv.status}
                    </span>
                  </td>
                  <td className="actions">
                    <i
                      className="fa-regular fa-eye"
                      onClick={() => navigate(`/invoice/${inv.id}`)}
                    ></i>
                    <i
                      className="fa-solid fa-download"
                      onClick={() =>
                        navigate(`/invoice/${inv.id}?action=download`)
                      }
                    ></i>
                    <i
                      className="fa-regular fa-trash-can"
                      onClick={() => deleteInvoice(index)}
                    ></i>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {invoices.length === 0 && (
            <div id="emptyState" className="empty">
              No invoices yet. Click "New Invoice" to create one.
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default App;
