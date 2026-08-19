/**
 * High-fidelity client-side PDF invoice generator for Tanvo Tech.
 * Generates an official Tax Invoice document with letterhead, SAC codes,
 * GST breakdowns, bank details, and payment settlement instructions.
 */

export function downloadInvoicePDF(invoice, client, project, bankDetails, siteDetails) {
  const currencySymbol = invoice.currency === 'INR' ? 'Rs.' : invoice.currency === 'USD' ? '$' : invoice.currency === 'EUR' ? 'EUR' : 'AED';
  const clientName = client?.company || client?.name || 'Client';
  const clientEmail = client?.email || '';
  const clientPhone = client?.phone || '';
  const clientAccessCode = client?.accessCode || '';
  
  // Construct printable HTML document with modern print-CSS
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Tax Invoice ${invoice.invoiceNumber} - Tanvo Tech</title>
  <style>
    @page { size: A4; margin: 20mm; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #0f172a;
      line-height: 1.5;
      margin: 0;
      padding: 24px;
      background: #fff;
    }
    .header { display: flex; justify-content: space-between; border-bottom: 2px solid #0284c7; padding-bottom: 16px; margin-bottom: 24px; }
    .agency-title { font-size: 24px; font-weight: 800; color: #0284c7; letter-spacing: -0.5px; }
    .agency-sub { font-size: 11px; color: #64748b; margin-top: 4px; }
    .invoice-badge { text-align: right; }
    .invoice-title { font-size: 20px; font-weight: 800; color: #0f172a; text-transform: uppercase; }
    .invoice-number { font-family: monospace; font-size: 14px; font-weight: 700; color: #0284c7; }
    .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px; font-size: 12px; }
    .meta-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 16px; }
    .meta-card h4 { margin: 0 0 6px 0; font-size: 11px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }
    .meta-card p { margin: 2px 0; color: #1e293b; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 12px; }
    th { background: #0f172a; color: #fff; text-align: left; padding: 10px 12px; font-size: 11px; text-transform: uppercase; }
    td { padding: 10px 12px; border-bottom: 1px solid #e2e8f0; }
    .text-right { text-align: right; }
    .totals-wrap { display: flex; justify-content: flex-end; margin-bottom: 24px; }
    .totals-box { width: 280px; font-size: 12px; }
    .totals-row { display: flex; justify-content: space-between; padding: 4px 0; }
    .totals-row.grand { border-top: 2px solid #0f172a; padding-top: 8px; margin-top: 6px; font-size: 15px; font-weight: 800; color: #0284c7; }
    .bank-box { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 12px 16px; font-size: 11px; margin-bottom: 24px; }
    .bank-box h4 { margin: 0 0 6px 0; color: #166534; font-size: 12px; text-transform: uppercase; font-weight: bold; }
    .footer { text-align: center; font-size: 10px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 12px; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="agency-title">TANVO TECH</div>
      <div class="agency-sub">${siteDetails.legalName || 'Tanvo Tech Private Limited'}</div>
      <div class="agency-sub">GSTIN: ${siteDetails.gstin} | PAN: ${siteDetails.pan}</div>
      <div class="agency-sub">${siteDetails.location} | ${siteDetails.email}</div>
    </div>
    <div class="invoice-badge">
      <div class="invoice-title">TAX INVOICE</div>
      <div class="invoice-number">${invoice.invoiceNumber}</div>
      <div style="font-size: 11px; color: #64748b; margin-top: 4px;">Status: <strong>${invoice.status.toUpperCase()}</strong></div>
    </div>
  </div>

  <div class="meta-grid">
    <div class="meta-card">
      <h4>Billed To (Client Details)</h4>
      <p><strong>${clientName}</strong></p>
      <p>${clientEmail}</p>
      <p>${clientPhone}</p>
      <p>Client Access Code: <code>${clientAccessCode}</code></p>
    </div>
    <div class="meta-card">
      <h4>Invoice & Project Details</h4>
      <p><strong>Project:</strong> ${project?.title || invoice.title}</p>
      <p><strong>Issued Date:</strong> ${invoice.issuedDate || '—'}</p>
      <p><strong>Due Date:</strong> ${invoice.dueDate || 'Upon Receipt'}</p>
      <p><strong>Place of Supply:</strong> Karnataka (State Code 29)</p>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th style="width: 40px;">#</th>
        <th>Service Deliverable Scope</th>
        <th style="width: 80px;">SAC Code</th>
        <th style="width: 60px;" class="text-right">Qty</th>
        <th style="width: 100px;" class="text-right">Rate</th>
        <th style="width: 110px;" class="text-right">Amount (${invoice.currency})</th>
      </tr>
    </thead>
    <tbody>
      ${(invoice.items || []).map((item, idx) => `
        <tr>
          <td>${idx + 1}</td>
          <td><strong>${item.description}</strong></td>
          <td style="font-family: monospace;">${item.sacCode || invoice.sacCode || '998311'}</td>
          <td class="text-right">${item.qty || 1}</td>
          <td class="text-right">${Number(item.rate || item.amount).toLocaleString()}</td>
          <td class="text-right"><strong>${Number(item.amount).toLocaleString()}</strong></td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="totals-wrap">
    <div class="totals-box">
      <div class="totals-row">
        <span>Subtotal:</span>
        <strong>${currencySymbol} ${Number(invoice.subtotal || invoice.amount).toLocaleString()}</strong>
      </div>
      ${invoice.taxRatePct > 0 ? `
        <div class="totals-row">
          <span>GST (${invoice.taxRatePct}%):</span>
          <span>${currencySymbol} ${Number(invoice.taxAmount || 0).toLocaleString()}</span>
        </div>
      ` : `
        <div class="totals-row" style="color: #64748b;">
          <span>Tax (0% Export / SEZ):</span>
          <span>${currencySymbol} 0</span>
        </div>
      `}
      <div class="totals-row grand">
        <span>Total Amount:</span>
        <span>${currencySymbol} ${Number(invoice.amount).toLocaleString()} ${invoice.currency}</span>
      </div>
      ${invoice.paidAmount > 0 ? `
        <div class="totals-row" style="color: #16a34a; font-weight: bold; margin-top: 4px;">
          <span>Settled to Date:</span>
          <span>- ${currencySymbol} ${Number(invoice.paidAmount).toLocaleString()}</span>
        </div>
        <div class="totals-row" style="color: #ea580c; font-weight: bold;">
          <span>Balance Due:</span>
          <span>${currencySymbol} ${Number(invoice.balanceDue || 0).toLocaleString()}</span>
        </div>
      ` : ''}
    </div>
  </div>

  <div class="bank-box">
    <h4>Settlement & Bank Wire Details</h4>
    <p><strong>Bank:</strong> ${bankDetails.bankName} | <strong>Account Name:</strong> ${bankDetails.accountName}</p>
    <p><strong>Account Number:</strong> ${bankDetails.accountNumber} | <strong>IFSC Code:</strong> ${bankDetails.ifsc}</p>
    <p><strong>Branch:</strong> ${bankDetails.branch} | <strong>UPI ID:</strong> ${bankDetails.upiId}</p>
    <p style="margin-top: 6px; font-size: 10px; color: #15803d;">For instant settlement via Google Pay / PhonePe, scan the dynamic QR on your client portal at https://portal.tanvo.tech</p>
  </div>

  <div class="footer">
    <p>This is a computer-generated tax invoice issued by Tanvo Tech Private Limited. All intellectual property transfers upon full milestone settlement.</p>
    <p>Thank you for partnering with Tanvo Tech &bull; https://tanvo.tech</p>
  </div>
</body>
</html>
  `;

  // Create an iframe or blob to trigger a clean PDF download/print stream
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const blobUrl = URL.createObjectURL(blob);

  // Open dedicated download/print window that auto-prompts PDF save
  const printWindow = window.open(blobUrl, '_blank');
  if (printWindow) {
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
    };
  } else {
    // Fallback direct file download
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = `Invoice_${invoice.invoiceNumber.replace(/[^a-zA-Z0-9_-]/g, '_')}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
