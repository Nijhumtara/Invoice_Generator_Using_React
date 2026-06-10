export default function InvoicePreview({ yourInfo, clientInfo, invoiceDetails, items, subtotal, taxAmount, discountAmount, totalDue, tax, discount, notes, paymentMethod }) {
  return (
    <div id="invoicePreview">

      {/* Header */}
      <div className="previewHeader">
        <div>
          <h1 className="previewTitle">INVOICE</h1>
          <p className="previewInvNo">{invoiceDetails.invoiceNo}</p>
        </div>
        <div className="previewCompany">
          <p className="previewCompanyName">{yourInfo.name || "Your Company"}</p>
          <p>{yourInfo.email}</p>
          <p>{yourInfo.address}</p>
        </div>
      </div>

      <hr className="previewDivider" />

      {/* Bill To + Dates */}
      <div className="previewBillRow">
        <div>
          <p className="previewBillLabel">BILL TO:</p>
          <p className="previewClientName">{clientInfo.name || "Client Name"}</p>
          <p className="previewClientEmail">{clientInfo.email}</p>
          <p className="previewClientAddress">{clientInfo.address}</p>
        </div>
        <div className="previewDates">
          <p><span>Date:</span> {invoiceDetails.date}</p>
          <p><span>Due Date:</span> {invoiceDetails.dueDate || "N/A"}</p>
        </div>
      </div>

      {/* Items Table */}
      <table className="previewTable">
        <thead>
          <tr>
            <th>Description</th>
            <th>Qty</th>
            <th>Unit Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.description || "Item"}</td>
              <td>{item.quantity}</td>
              <td>${item.unitPrice.toFixed(2)}</td>
              <td>${(item.quantity * item.unitPrice).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="previewTotals">
        <div className="previewTotalRow">
          <span>Subtotal:</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        {tax > 0 && (
          <div className="previewTotalRow">
            <span>Tax ({tax}%):</span>
            <span>${taxAmount.toFixed(2)}</span>
          </div>
        )}
        {discount > 0 && (
          <div className="previewTotalRow">
            <span>Discount ({discount}%):</span>
            <span>-${discountAmount.toFixed(2)}</span>
          </div>
        )}
        <div className="previewTotalRow previewTotalDue">
          <span>Total Due:</span>
          <span>${totalDue.toFixed(2)}</span>
        </div>
      </div>

      <hr className="previewDivider" />

      {/* Footer */}
      {notes && <p className="previewNotes">{notes}</p>}
      {paymentMethod && <p className="previewPayment">Payment Method: {paymentMethod}</p>}
      <p className="previewThankYou">Thank you for your business!</p>
    </div>
  );
}