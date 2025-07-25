import React, { useRef } from 'react';
import { FileText, MapPin, Calendar, Hash, Package, File } from 'lucide-react';
import Link from 'next/link';

const PDFDownload = ({ data, invoice }) => {
  const invoiceRef = useRef(null);

  const downloadPDF = async () => {
    if (typeof window === "undefined" || !invoiceRef.current) return;

    const html2canvas = (await import("html2canvas")).default;
    const jsPDF = (await import("jspdf")).jsPDF;

    // Capture screenshot with reduced scale
    const canvas = await html2canvas(invoiceRef.current, {
      scale: 1.25, // Lower than 2 to reduce size
      useCORS: true // Helps load external images if any
    });

    // Convert to JPEG (smaller than PNG)
    const imgData = canvas.toDataURL("image/jpeg", 0.8); // 0.8 = 80% quality

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const margin = 10;
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgProps = pdf.getImageProperties(imgData);
    const maxWidth = pageWidth - margin * 2;
    const maxHeight = pageHeight - margin * 2;

    let imgWidth = maxWidth;
    let imgHeight = (imgProps.height * imgWidth) / imgProps.width;

    if (imgHeight > maxHeight) {
      imgHeight = maxHeight;
      imgWidth = (imgProps.width * imgHeight) / imgProps.height;
    }

    const xOffset = margin + (maxWidth - imgWidth) / 2;
    const yOffset = margin + (maxHeight - imgHeight) / 2;

    pdf.addImage(imgData, "JPEG", xOffset, yOffset, imgWidth, imgHeight);
    pdf.save(`Amazon Tax Invoice - ${invoice}`);
  };
 
  return (
    <div style={{ padding: "20px" }}>
      <div
        ref={invoiceRef}
        style={{
          maxWidth: "900px",
          margin: "20px auto",
          background: "#fff",
          // boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          borderRadius: "0px",
          border: "1px solid #e5e7eb",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div style={{ background: "#2563eb", color: "#fff", padding: "10px 16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <Link href="https://www.fazahome.ae" target="_blank">
                <img style={{ width: "120px" }} src="/Faza-Home-Logo.png" alt="logo" />
              </Link>
              <p style={{ color: "#dbeafe", marginTop: "8px" }}>FAZA SANITARY WARE TR. LLC</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <h2 style={{ fontSize: "2rem", fontWeight: "600", margin: 0 }}>Amazon Tax Invoice</h2>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-between" }}>
                <p style={{ color: "#fff", marginRight: "18px" }}>Invoice No: <b>{invoice}</b></p>
                <p style={{ color: "#fff" }}>Order Confirmation</p>
              </div>

            </div>
          </div>
        </div>

        {/* Invoice Details */}
        <div style={{ padding: "28px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px", marginBottom: "32px" }}>
            {/* Customer Information */}
            <div style={{ background: "#f9fafb", borderRadius: "12px", padding: "15px", border: "1px solid #e5e7eb" }}>
              <div style={{ fontSize: "1.125rem", fontWeight: "600", color: "#1e293b", marginBottom: "16px", display: "flex", alignItems: "center" }}>
                {/* <FileText style={{ width: "20px", height: "20px", marginRight: "8px", color: "#2563eb" }} /> */}
                <h3>Customer Details</h3>

              </div>
              <div>

                <div style={{ display: "flex", alignItems: "center", marginBottom: "8px", justifyContent: "space-between" }}>
                  <span style={{ fontWeight: "500", color: "#64748b" }}>Buyer Name:</span>
                  <span style={{ color: "#1e293b", fontWeight: "bold" }}>{data.customerName}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", marginBottom: "8px", justifyContent: "space-between" }}>
                  {/* <Hash style={{ width: "16px", height: "16px", marginRight: "8px", color: "#64748b" }} /> */}
                  <span style={{ fontWeight: "500", color: "#64748b" }}>Order ID:</span>
                  <span style={{ color: "#1e293b", fontFamily: "monospace", fontSize: "0.95rem", fontWeight: "bold" }}>{data.orderNumber}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  {/* <Calendar style={{ width: "16px", height: "16px", marginRight: "8px", color: "#64748b" }} /> */}
                  <span style={{ fontWeight: "500", color: "#64748b" }}>Date:</span>
                  <span style={{ color: "#1e293b", fontWeight: "bold" }}>{data.orderDate}</span>
                </div>




              </div>
            </div>

            {/* Billing Address */}
            <div style={{ background: "#f9fafb", borderRadius: "12px", padding: "15px", border: "1px solid #e5e7eb" }}>


              <div style={{ fontSize: "1.125rem", fontWeight: "600", color: "#1e293b", marginBottom: "16px", display: "flex", alignItems: "center" }}>
                <h3>Seller Details</h3>
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ fontWeight: "500", color: "#64748b", width: "" }}>Seller Name:</span>
                <span style={{ color: "#1e293b", fontWeight: "bold" }}>FAZA SANITARY WARE TR LLC</span>
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ fontWeight: "500", color: "#64748b", width: "" }}>VAT Number:</span>
                <span style={{ color: "#1e293b", fontWeight: "bold" }}>100014232100003</span>
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ fontWeight: "500", color: "#64748b", width: "" }}>Document Number:</span>
                <span style={{ color: "#1e293b", fontWeight: "bold" }}>{invoice}</span>
              </div>

            </div>
          </div>

          {/* Product Details Table */}
          <div style={{ marginBottom: "10px" }}>
            <h3 style={{ fontSize: "1.125rem", fontWeight: "600", color: "#1e293b", marginBottom: "16px", display: "flex", alignItems: "center" }}>
              <Package style={{ width: "20px", height: "20px", marginRight: "8px", color: "#2563eb" }} />
              Product Details
            </h3>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #e5e7eb", borderRadius: "8px" }}>
                <thead>
                  <tr style={{ background: "#f3f4f6" }}>
                    <th style={{ border: "1px solid #e5e7eb", padding: "12px", textAlign: "left", fontWeight: "600", color: "#374151" }}>Product Details</th>
                    <th style={{ border: "1px solid #e5e7eb", padding: "12px", textAlign: "center", fontWeight: "600", color: "#374151", width: "96px" }}>Unit Price</th>
                    <th style={{ border: "1px solid #e5e7eb", padding: "12px", textAlign: "center", fontWeight: "600", color: "#374151", width: "96px" }}>Quantity</th>
                    <th style={{ border: "1px solid #e5e7eb", padding: "12px", textAlign: "right", fontWeight: "600", color: "#374151", width: "128px" }}>Sub Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ background: "#fff" }}>
                    <td style={{ border: "1px solid #e5e7eb", padding: "16px", color: "#374151" }}>
                      <div style={{ fontWeight: "500", color: "#1e293b", marginBottom: "4px" }}>{data.productName}</div>
                    </td>
                    <td style={{ border: "1px solid #e5e7eb", padding: "16px", textAlign: "right", color: "#1e293b", fontWeight: "700" }}>
                       {data.unitPrice}
                    </td>
                    <td style={{ border: "1px solid #e5e7eb", padding: "16px", textAlign: "center", color: "#374151", fontWeight: "500" }}>
                      {data.quantity}
                    </td>

                    <td style={{ border: "1px solid #e5e7eb", padding: "16px", textAlign: "right", color: "#1e293b", fontWeight: "700" }}>
                       {data.subTotal}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>


          {/* Total Summary */}
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}>
            <div style={{ width: "100%", maxWidth: "320px" }}>
              <div style={{ background: "#eff6ff", borderRadius: "12px", padding: "10px", border: "1px solid #bfdbfe" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <span style={{ color: "#64748b" }}>Tax: (5% Vat)</span>
                  <span style={{ color: "#1e293b", fontWeight: "500" }}>{data.vatValue}</span>
                </div>
                <div style={{ borderTop: "1px solid #bfdbfe", paddingTop: "8px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "1.125rem", fontWeight: "600", color: "#1e293b", display: "flex", alignItems: "center" }}>
                      Grand Total:
                    </span>
                    <span style={{ fontSize: "1.25rem", fontWeight: "700", color: "#2563eb" }}>{data.price}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Information */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px", marginBottom: "32px" }}>
            <div style={{ background: "#f9fafb", borderRadius: "12px", padding: "20px" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "600", color: "#1e293b", marginBottom: "16px", display: "flex", alignItems: "center" }}>
                <MapPin style={{ width: "20px", height: "20px", marginRight: "8px", color: "#2563eb" }} />
                Ship To
              </h3>
              <p style={{ color: "#334155", lineHeight: "1.6", marginBottom: "24px" }}>{data.address}</p>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "600", color: "#1e293b", marginBottom: "8px", display: "flex", alignItems: "center" }}>
                Terms and Conditions:
              </h3>
              <Link href='https://www.fazahome.ae/terms-and-conditions/' target='_blank' style={{ textDecoration: "underline", color: "#2563eb" }}>
                https://www.fazahome.ae/terms-and-conditions/
              </Link>
            </div>
            <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "20px" }}>
              <p style={{ color: "#374151", marginBottom: "5px", fontWeight: "600", zIndex: "1", position: "relative" }}>For FAZA SANITARY WARE TR. LLC</p>
              <p style={{ fontSize: "0.95rem", color: "#64748b", zIndex: "1", position: "relative" }}>Authorized Signatory</p>
              <div style={{ marginTop: "-10px", display: "flex", alignItems: "center", justifyContent: "center", zIndex: "0", position: "relative" }}>
                <img style={{ width: "200px", height: "auto" }} src="signature.jpg" alt="signature" />
              </div>
            </div>
          </div>

          {/* Brand Partners */}
          <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: "20px" }}>
            <h3 style={{ fontSize: "1.125rem", fontWeight: "600", color: "#1e293b", marginBottom: "8px", textAlign: "center" }}>
              Our Brand Partners
            </h3>
            <img src="Footer-Logos.jpg" alt="all_brands_logo" style={{ width: "100%", margin: "auto", display: "block" }} />
          </div>
        </div>

        {/* Footer */}
        <div style={{ background: "#1e293b", color: "#fff", padding: "24px", textAlign: "center" }}>
          <p style={{ fontSize: "1rem" }}>Thank you for buying from Faza Home on Amazon Marketplace.</p>
          <p style={{ fontSize: "0.85rem", color: "#94a3b8", marginTop: "4px" }}>FAZA SANITARY WARE TR. LLC • Al Quoz Industrial Area 3 - Shop #11 – Dubai - UAE</p>
        </div>


      </div>

      <div style={{ display: "flex", justifyContent: "center", marginTop: "-20px" }}>
        <button
          onClick={downloadPDF}
          style={{
            background: "#2563eb",
            color: "#fff",
            marginTop: "40px",
            fontWeight: "600",
            padding: "12px 32px",
            borderRadius: "12px",
            boxShadow: "0 4px 16px rgba(37,99,235,0.15)",
            transition: "all 0.2s",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            cursor: "pointer",
          }}
        >
          <Package style={{ width: "20px", height: "20px" }} />
          Download PDF
        </button>
      </div>




    </div>
  );


};

export default PDFDownload;