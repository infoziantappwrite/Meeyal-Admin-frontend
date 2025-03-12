import React, { useState, useEffect } from 'react';
import Select from "react-select";
import axios from 'axios';
import { UserPlus, Users, Trash2 } from "lucide-react";
import { jsPDF } from 'jspdf';
import { useNavigate } from 'react-router-dom';

const Billing = () => {
    const navigate = useNavigate();
    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [searchCustomer, setSearchCustomer] = useState('');
    const [showCustomerPopup, setShowCustomerPopup] = useState(false);

    useEffect(() => {
        axios.get("http://localhost:8000/api/v1/customers/all", { withCredentials: true })
            .then((res) => setCustomers(res.data));
        axios.get("http://localhost:8000/api/v1/products/all", { withCredentials: true })
            .then((res) => setProducts(res.data));
    }, []);

    const handleCustomerSelect = (customer) => {
        setSelectedCustomer(customer);
        setShowCustomerPopup(false);
    };

    // Handle Product Selection
    const handleProductSelect = (selectedOption) => {
        if (!selectedOption) return;
        const product = products.find(p => p._id === selectedOption.value);
        if (product && !selectedProducts.some(p => p._id === product._id)) {
            setSelectedProducts(prevProducts => [...prevProducts, { ...product, quantity: 1 }]);
        }
    };

    // Handle Product Removal
    const handleRemoveProduct = (productID) => {
        setSelectedProducts(prevProducts => prevProducts.filter((p) => p._id !== productID));
    };

    // Handle Quantity Change
    const handleQuantityChange = (productID, quantity) => {
        setSelectedProducts(prevProducts =>
            prevProducts.map((p) =>
                p._id === productID ? { ...p, quantity: Math.max(1, quantity) } : p
            )
        );
    };

    // Calculate Total Amount
    const calculateTotal = () => {
        return selectedProducts.reduce((sum, p) => sum + p.price * p.quantity, 0).toFixed(2);
    };


    // Generate PDF Invoice
    const generatePDF = () => {
        const doc = new jsPDF();

        // Title
        doc.setFontSize(18);
        doc.text("Invoice", 85, 20);

        // Customer Details (Underlined Style)
        doc.setFontSize(12);
        doc.text(`Customer: ${selectedCustomer.name}`, 15, 30);
        doc.text(`Phone: ${selectedCustomer.phone}`, 140, 30);
        doc.line(10, 32, 200, 32);  // Bottom border

        // Table Header
        let startY = 45;
        doc.setFontSize(12);
        doc.text("No", 15, startY);
        doc.text("Product Name", 40, startY);
        doc.text("Quantity", 110, startY);
        doc.text("Price (₹)", 140, startY);
        doc.text("Total (₹)", 170, startY);
        doc.line(10, startY + 2, 200, startY + 2);  // Bottom border

        // Table Rows
        let rowY = startY + 10;
        selectedProducts.forEach((p, index) => {
            doc.text(`${index + 1}`, 15, rowY);
            doc.text(p.productname, 40, rowY);
            doc.text(`${p.quantity}`, 115, rowY);
            doc.text(`₹${p.price.toFixed(2)}`, 140, rowY);
            doc.text(`₹${(p.price * p.quantity).toFixed(2)}`, 170, rowY);
            doc.line(10, rowY + 2, 200, rowY + 2); // Bottom border
            rowY += 10;
        });

        // Grand Total (Underlined)
        doc.setFontSize(14);
        doc.text(`Grand Total: ₹${calculateTotal()}`, 135, rowY + 10);
        doc.line(130, rowY + 12, 200, rowY + 12);  // Bottom border for total

        // Save PDF
        doc.save(`Invoice_${selectedCustomer.name}.pdf`);
    };



    // Submit Invoice
    const handleSubmit = async () => {
        if (!selectedCustomer?._id || selectedProducts.length === 0) {
            alert("Please select a customer and at least one product.");
            return;
        }
    
        const invoiceData = {
            customerId: selectedCustomer._id,
            products: selectedProducts.map(({ _id, price, quantity }) => ({ productID: _id, price, quantity })),
            totalAmount: calculateTotal(),
        };
    
        try {
            await axios.post("http://localhost:8000/api/v1/invoices/create", invoiceData, { withCredentials: true });
    
            //console.log("Invoice created:", response.data);
            alert("Invoice created successfully!"); // ✅ Show success message
    
            generatePDF(); // ✅ Generate PDF if required
    
            setTimeout(() => {
                window.location.reload(); // ✅ Refresh the page after 1 second
            }, 1000);
            
        } catch (error) {
            console.error("Error creating invoice:", error);
            alert("Failed to create invoice. Please try again.");
        }
    };
    
    

    return (
        <div className="p-4 text-white">
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-700">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <Users size={24} /> Billing
                </h1>
                {selectedCustomer && (
                    <span>
                        Customer Name: {selectedCustomer.name} | Phone: {selectedCustomer.phone}
                    </span>
                )}
                <div className="flex gap-4">
                    <button
                        onClick={() => setShowCustomerPopup(true)}
                        className="flex items-center gap-2 bg-gradient-primary hover:bg-hover-gradient-primary px-4 py-2 rounded-md"
                    >
                        <Users size={18} /> Select Customer
                    </button>


                </div>
            </div>
            {showCustomerPopup && (
                <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex  Z-1000 justify-center items-center">
                    <div className="bg-gray-800 p-4 rounded-md w-96 border border-gray-700">
                        <input
                            type="text"
                            placeholder="Search by Phone"
                            className="w-full p-2 mb-2 bg-gray-700 border text-white rounded-md border-gray-900"
                            value={searchCustomer}
                            onChange={(e) => setSearchCustomer(e.target.value)}
                        />
                        <div className="max-h-50 overflow-y-auto bg-gray-900">
                            {customers.filter((c) => c.phone.includes(searchCustomer)).map((c) => (
                                <div key={c._id} className="p-2 cursor-pointer hover:bg-gray-700 border-b border-gray-600" onClick={() => handleCustomerSelect(c)}>
                                    {c.name} ({c.phone})
                                </div>
                            ))}
                        </div>
                        <button onClick={() => navigate('/customers')} className="flex w-full mt-2 justify-center gap-2 bg-gradient-primary hover:bg-hover-gradient-primary px-4 py-2 rounded-md"><UserPlus />New Customer</button>
                        <button onClick={() => setShowCustomerPopup(false)} className="mt-2 p-2 bg-red-600 hover:bg-red-700 rounded-md w-full">Close</button>
                    </div>
                </div>
            )}

            <div className="overflow-x-auto text-center max-h-[28rem] overflow-y-auto">
                <table className="min-w-full bg-gray-700 rounded-md border border-gray-900 border-collapse overflow-hidden">
                    <thead className="bg-gray-900 text-white rounded-t-md">
                        <tr>
                            <th className="px-4 py-3 border-t border-gray-800">NO</th>
                            <th className="px-4 py-2 border-t border-gray-800">Product Name</th>
                            <th className="px-4 py-2 border-t border-gray-800">Price</th>
                            <th className="px-4 py-2 border-t border-gray-800">Brand</th>
                            <th className="px-4 py-2 border-t border-gray-800">Qty</th>
                            <th className="px-4 py-2 border-t border-gray-800">Total</th>
                            <th className="px-4 py-2 border-t border-gray-800">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {selectedProducts.map((p, index) => (
                            <tr key={p._id} className="hover:bg-gray-800">
                                <td className="px-4 py-2 border-t border-gray-800">{index + 1}</td>
                                <td className="px-4 py-2 border-t border-gray-800">{p.productname}</td>
                                <td className="px-4 py-2 border-t border-gray-800">₹{p.price}</td>
                                <td className="px-4 py-2 border-t border-gray-800">{p.brand}</td>
                                <td className="px-4 py-2 border-t border-gray-800">
                                    <input
                                        type="number"
                                        min="0"
                                        value={p.quantity}
                                        onChange={(e) => {
                                            const enteredQty = Number(e.target.value);
                                            if (enteredQty >= 1 && enteredQty <= p.stock) {
                                                handleQuantityChange(p._id, enteredQty);
                                            }
                                        }}
                                        className="w-16 p-1 bg-gray-600 text-white border rounded-md"
                                    />
                                </td>

                                <td className="px-4 py-2 border-t border-gray-800">₹{(p.price * p.quantity).toFixed(2)}</td>
                                <td className="px-4 py-2 border-t border-gray-800">
                                    <button className="text-red-500 hover:text-red-600" onClick={() => handleRemoveProduct(p._id)}>
                                        <Trash2 />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="mt-4 flex justify-between items-center">
                {/* Product Selection Dropdown */}
                <div className="w-1/2">
                    <label className="block text-white mb-1">Select a Product</label>
                    <Select
                        options={products
                            .filter((product) =>
                                product.stock > 0 && !selectedProducts.some((p) => p._id === product._id)
                            )
                            .map((product) => ({
                                value: product._id,
                                label: `${product.productname} (${product.productid}) - Stock: ${product.stock}`
                            }))}
                        onChange={handleProductSelect}
                        placeholder="Search and select product..."
                        className="text-black"
                        menuPlacement="auto"
                    />

                </div>

                {/* Grand Total */}
                <div className="text-xl font-semibold">Grand Total: ₹{calculateTotal()}</div>

                {/* Confirm Button */}
                <button onClick={handleSubmit} className="flex items-center gap-2 bg-gradient-primary hover:bg-hover-gradient-primary px-4 py-2 rounded-md">
                    Confirm
                </button>
            </div>

        </div>
    );
};

export default Billing;
