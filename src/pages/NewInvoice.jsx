import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useInvoice } from "../context/InvoiceContext";
import InvoicePreview from "./InvoicePreview";

export default function NewInvoice() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { invoices, addInvoice, updateInvoice } = useInvoice(); // ✅ get invoices from context

  // Find existing invoice
  const existingInvoice = id ? invoices.find((inv) => inv.id === id) : null;
  const isViewing = !!existingInvoice;

  // All useState hooks
  const [yourInfo, setYourInfo] = useState({
    name: "",
    email: "",
    address: "",
  });
  const [clientInfo, setClientInfo] = useState({
    name: "",
    email: "",
    address: "",
  });
  const [invoiceDetails, setInvoiceDetails] = useState({
    invoiceNo: "INV-001",
    date: new Date().toISOString().split("T")[0],
    dueDate: "",
    status: "Unpaid",
  });
  const [items, setItems] = useState([
    { id: 1, description: "", quantity: 1, unitPrice: 0 },
  ]);
  const [tax, setTax] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [searchParams] = useSearchParams();

  // useEffect AFTER all useState
  useEffect(() => {
    if (existingInvoice) {
      setYourInfo(
        existingInvoice.yourInfo || { name: "", email: "", address: "" },
      );
      setClientInfo(
        existingInvoice.clientInfo || { name: "", email: "", address: "" },
      );
      setInvoiceDetails({
        invoiceNo: existingInvoice.id || "INV-001",
        date: existingInvoice.date || new Date().toISOString().split("T")[0],
        dueDate: existingInvoice.dueDate || "",
        status: existingInvoice.status || "Unpaid",
      });
      setItems(
        existingInvoice.items || [
          { id: 1, description: "", quantity: 1, unitPrice: 0 },
        ],
      );
      setTax(existingInvoice.tax || 0);
      setDiscount(existingInvoice.discount || 0);
      setNotes(existingInvoice.notes || "");
      setPaymentMethod(existingInvoice.paymentMethod || "");
    }
  }, [existingInvoice?.id]);

  useEffect(() => {
    if (searchParams.get("action") === "download" && existingInvoice) {
      setTimeout(() => {
        downloadPDF();
      }, 1000);
    }
  }, [searchParams, existingInvoice?.id]);

  // Add a new empty item row
  const addItem = () => {
    setItems([
      ...items,
      { id: Date.now(), description: "", quantity: 1, unitPrice: 0 },
    ]);
  };

  // Delete an item row by id
  const deleteItem = (id) => {
    if (items.length === 1) return; // keep at least one row
    setItems(items.filter((item) => item.id !== id));
  };

  // Update a specific field in a specific item row
  const updateItem = (id, field, value) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    );
  };

  const saveInvoice = () => {
    if (!clientInfo.name || !invoiceDetails.invoiceNo) {
      alert("Please fill in client name and invoice number!");
      return;
    }

    const invoiceData = {
      id: invoiceDetails.invoiceNo,
      client: clientInfo.name,
      date: invoiceDetails.date,
      dueDate: invoiceDetails.dueDate,
      amount: totalDue,
      status: invoiceDetails.status,
      // save full data
      yourInfo,
      clientInfo,
      items,
      tax,
      discount,
      notes,
      paymentMethod,
    };

    if (isViewing) {
      updateInvoice(invoiceData);
    } else {
      addInvoice(invoiceData);
    }

    navigate("/");
  };
  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0,
  );
  const taxAmount = (subtotal * tax) / 100;
  const discountAmount = (subtotal * discount) / 100;
  const totalDue = subtotal + taxAmount - discountAmount;

  const downloadPDF = async () => {
    const element = document.getElementById("invoicePreview");
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, width, height);
    pdf.save(`${invoiceDetails.invoiceNo}.pdf`);
  };
  return (
    <div id="newInvoicePage">
      {/* Back to Dashboard */}
      <header id="newInvoiceHeader">
        <button className="backButton" onClick={() => navigate("/")}>
          <i className="fa-solid fa-arrow-left"></i>
          <span>Back to Dashboard</span>
        </button>
      </header>

      {/* Form */}
      <div id="invoiceForm">
        {/* Your Information */}
        <section className="formSection">
          <h2 className="sectionTitle">Your Information</h2>
          <div className="formGroup">
            <label>Your Name</label>
            <input
              type="text"
              placeholder="John Deo/Your Company Name"
              value={yourInfo.name}
              onChange={(e) =>
                setYourInfo({ ...yourInfo, name: e.target.value })
              }
            />
          </div>
          <div className="formGroup">
            <label>Your Email</label>
            <input
              type="email"
              placeholder="hello@company.com"
              value={yourInfo.email}
              onChange={(e) =>
                setYourInfo({ ...yourInfo, email: e.target.value })
              }
            />
          </div>
          <div className="formGroup">
            <label>Your Address</label>
            <textarea
              placeholder="Your business address"
              value={yourInfo.address}
              onChange={(e) =>
                setYourInfo({ ...yourInfo, address: e.target.value })
              }
            />
          </div>
        </section>

        {/* Client Information */}
        <section className="formSection">
          <h2 className="sectionTitle">Client Information</h2>

          <div className="formGroup">
            <label>Client Name</label>
            <input
              type="text"
              placeholder="Client Company Name"
              value={clientInfo.name}
              onChange={(e) =>
                setClientInfo({ ...clientInfo, name: e.target.value })
              }
            />
          </div>

          <div className="formGroup">
            <label>Client Email</label>
            <input
              type="email"
              placeholder="client@email.com"
              value={clientInfo.email}
              onChange={(e) =>
                setClientInfo({ ...clientInfo, email: e.target.value })
              }
            />
          </div>

          <div className="formGroup">
            <label>Client Address</label>
            <textarea
              placeholder="Client billing address"
              value={clientInfo.address}
              onChange={(e) =>
                setClientInfo({ ...clientInfo, address: e.target.value })
              }
            />
          </div>
        </section>

        {/* Invoice Details */}
        <section className="formSection">
          <h2 className="sectionTitle">Invoice Details</h2>

          <div className="formRow">
            <div className="formGroup">
              <label>Invoice Number</label>
              <input
                type="text"
                placeholder="INV-001"
                value={invoiceDetails.invoiceNo}
                onChange={(e) =>
                  setInvoiceDetails({
                    ...invoiceDetails,
                    invoiceNo: e.target.value,
                  })
                }
              />
            </div>

            <div className="formGroup">
              <label>Date</label>
              <input
                className="date"
                type="date"
                value={invoiceDetails.date}
                onChange={(e) =>
                  setInvoiceDetails({ ...invoiceDetails, date: e.target.value })
                }
              />
            </div>
          </div>

          <div className="formRow">
            <div className="formGroup">
              <label>Due Date</label>
              <input
                className="date"
                type="date"
                value={invoiceDetails.dueDate}
                onChange={(e) =>
                  setInvoiceDetails({
                    ...invoiceDetails,
                    dueDate: e.target.value,
                  })
                }
              />
            </div>

            <div className="formGroup">
              <label>Status</label>
              <select
                value={invoiceDetails.status}
                onChange={(e) =>
                  setInvoiceDetails({
                    ...invoiceDetails,
                    status: e.target.value,
                  })
                }
              >
                <option value="Unpaid">Unpaid</option>
                <option value="Paid">Paid</option>
              </select>
            </div>
          </div>
        </section>

        {/* Items */}
        <section className="formSection">
          <div className="sectionHeader">
            <h2 className="sectionTitle">Items</h2>
            <button type="button" className="addItemBtn" onClick={addItem}>
              <i className="fa-solid fa-plus"></i> Add Item
            </button>
          </div>

          {items.map((item, index) => (
            <div className="itemCard" key={item.id}>
              <div className="itemCardHeader">
                <span>Item #{index + 1}</span>
                <i
                  className="fa-regular fa-trash-can itemDelete"
                  onClick={() => deleteItem(item.id)}
                ></i>
              </div>

              <div className="formGroup">
                <label>Description</label>
                <input
                  type="text"
                  placeholder="Item description"
                  value={item.description}
                  onChange={(e) =>
                    updateItem(item.id, "description", e.target.value)
                  }
                />
              </div>

              <div className="formRow">
                <div className="formGroup">
                  <label>Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      updateItem(item.id, "quantity", Number(e.target.value))
                    }
                  />
                </div>

                <div className="formGroup">
                  <label>Unit Price</label>
                  <input
                    type="number"
                    min="0"
                    value={item.unitPrice}
                    onChange={(e) =>
                      updateItem(item.id, "unitPrice", Number(e.target.value))
                    }
                  />
                </div>

                <div className="formGroup">
                  <label>Total</label>
                  <input
                    type="text"
                    readOnly
                    value={`$${(item.quantity * item.unitPrice).toFixed(2)}`}
                  />
                </div>
              </div>
            </div>
          ))}
        </section>
        {/* Tax & Discount */}
        <section className="formSection">
          <div className="formRow">
            <div className="formGroup">
              <label>Tax %</label>
              <input
                type="number"
                min="0"
                max="100"
                value={tax}
                onChange={(e) => setTax(Number(e.target.value))}
              />
            </div>
            <div className="formGroup">
              <label>Discount %</label>
              <input
                type="number"
                min="0"
                max="100"
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
              />
            </div>
          </div>

          {/* Totals */}
          <div className="totalsSection">
            <div className="totalRow">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            {tax > 0 && (
              <div className="totalRow">
                <span>Tax ({tax}%):</span>
                <span>${taxAmount.toFixed(2)}</span>
              </div>
            )}
            {discount > 0 && (
              <div className="totalRow">
                <span>Discount ({discount}%):</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="totalRow totalDue">
              <span>Total Due:</span>
              <span>${totalDue.toFixed(2)}</span>
            </div>
          </div>
        </section>

        {/* Notes & Payment Method */}
        <section className="formSection">
          <div className="formGroup">
            <label>Notes</label>
            <textarea
              placeholder="Additional notes or payment instructions"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          <div className="formGroup">
            <label>Payment Method</label>
            <input
              type="text"
              placeholder="e.g., Bank Transfer, Credit Card"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
          </div>
        </section>

        {/* Buttons */}
        <div className="formButtons">
          <button className="saveBtn" onClick={saveInvoice}>
            <i className="fa-regular fa-floppy-disk"></i>
            <span>Save Invoice</span>
          </button>
          <button className="downloadBtn" onClick={downloadPDF}>
            <i className="fa-solid fa-download"></i>
            <span>Download PDF</span>
          </button>
        </div>
      </div>
      <InvoicePreview
        yourInfo={yourInfo}
        clientInfo={clientInfo}
        invoiceDetails={invoiceDetails}
        items={items}
        subtotal={subtotal}
        taxAmount={taxAmount}
        discountAmount={discountAmount}
        totalDue={totalDue}
        tax={tax}
        discount={discount}
        notes={notes}
        paymentMethod={paymentMethod}
      />
    </div>
  );
}
