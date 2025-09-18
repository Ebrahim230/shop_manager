import { useEffect, useState } from "react";
import api from "../services/axiosConfig";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const Sales = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState("");

  useEffect(() => {
    api.get("product/")
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  }, []);

  const addToCart = (product) => {
    const existing = cart.find(item => item.productId === product._id);
    if (existing) {
      if (existing.quantity + 1 > product.stock) {
        alert(`Only ${product.stock} items available in stock`);
        return;
      }
      setCart(cart.map(item => item.productId === product._id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      if (product.stock < 1) {
        alert(`Product "${product.name}" is out of stock`);
        return;
      }
      setCart([...cart, { productId: product._id, name: product.name, quantity: 1, sellingPrice: product.sellingPrice }]);
    }
  };

  const updateQuantity = (id, qty) => {
    const product = products.find(p => p._id === id);
    if (qty > product.stock) {
      alert(`Only ${product.stock} items available in stock`);
      qty = product.stock;
    }
    setCart(cart.map(item => item.productId === id ? { ...item, quantity: qty > 0 ? qty : 1 } : item));
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.productId !== id));
  };

  const total = cart.reduce((sum, item) => sum + (item.sellingPrice * item.quantity || 0), 0);

  const generateInvoice = (saleData) => {
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: [80, 200] });
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Fakir Store", 40, 10, { align: "center" });
    doc.setFontSize(10);
    doc.text("Md. Azahar Ali Fakir", 40, 16, { align: "center" });
    doc.text(`Date: ${new Date().toLocaleString()}`, 40, 22, { align: "center" });
    doc.text(`Customer: ${saleData.customerName || "Random"}`, 40, 28, { align: "center" });

    const tableColumn = ["Product", "Qty", "Price", "Total"];
    const tableRows = saleData.items.map(item => [
      item.name,
      item.quantity,
      `${item.sellingPrice}`,
      `${item.quantity * item.sellingPrice}`
    ]);

    tableRows.push(["Grand Total", "", "", `${saleData.total}`]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 35,
      styles: { fontSize: 9, cellPadding: 2 },
      theme: "grid",
      headStyles: { fillColor: [220, 220, 220] },
      columnStyles: {
        0: { cellWidth: 'auto' },
        1: { cellWidth: 'auto' },
        2: { cellWidth: 'auto' },
        3: { cellWidth: 'auto' },
      },
      didDrawCell: (data) => {
        if (data.row.index === tableRows.length - 1) {
          doc.setFont("helvetica", "bold");
        }
      }
    });

    doc.autoPrint();
    window.open(doc.output("bloburl"), "_blank");
  };

  const handleCheckout = () => {
    if (cart.length === 0) return alert("Cart is empty");
    api.post("sales/", { customerName, items: cart, total })
      .then(() => {
        generateInvoice({ customerName, items: cart, total });
        setCart([]);
      })
      .catch(err => console.error(err));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-green-600 mb-4 text-center">Sales / POS</h1>

      <div className="grid grid-cols-2 place-items-center md:grid-cols-4 gap-4 mb-6">
        {products.length > 0 ? (
          products.map(p => (
            <div key={p._id} className="border p-4 rounded-lg shadow hover:shadow-lg w-full">
              <h2 className="font-semibold">{p.name}</h2>
              <p className="text-sm text-gray-600">Stock: {p.stock}</p>
              <p className="text-blue-600 font-bold">৳ {p.sellingPrice}</p>
              <button
                onClick={() => addToCart(p)}
                className="mt-2 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
              >
                Add
              </button>
            </div>
          ))
        ) : (
          <p className="col-span-4 text-center text-gray-500">No products available. Please add products first.</p>
        )}
      </div>

      <div className="bg-white shadow-md rounded-lg p-4">
        <h2 className="text-xl font-bold mb-3">Invoice Preview</h2>
        <input
          type="text"
          placeholder="Customer Name"
          value={customerName}
          onChange={e => setCustomerName(e.target.value)}
          className="border p-2 rounded mb-3 w-full"
        />
        <table className="min-w-full border">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2">Product</th>
              <th className="p-2">Qty</th>
              <th className="p-2">Price</th>
              <th className="p-2">Total</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {cart.map(item => (
              <tr key={item.productId} className="text-center border-t">
                <td className="p-2">{item.name}</td>
                <td className="p-2">
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={e => updateQuantity(item.productId, parseInt(e.target.value) || 1)}
                    className="border p-1 w-16 text-center"
                  />
                </td>
                <td className="p-2">৳ {item.sellingPrice}</td>
                <td className="p-2">৳ {item.sellingPrice * item.quantity}</td>
                <td className="p-2">
                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                  >
                    X
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <h3 className="mt-4 text-right font-bold text-lg">Total: ৳ {total}</h3>
        <button
          onClick={handleCheckout}
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Checkout & Print Invoice
        </button>
      </div>
    </div>
  );
};

export default Sales;