import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

const Coupons = () => {
    const [code, setCode] = useState('');
    const [discount, setDiscount] = useState('');
    const [expiry, setExpiry] = useState('');
    const [coupons, setCoupons] = useState([]);

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        const res = await axios.get('https://meeyaladminbackend-production.up.railway.app/api/coupons');
        setCoupons(res.data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('https://meeyaladminbackend-production.up.railway.app/api/coupons', {
                code,
                discountPercentage: discount,
                expiryDate: expiry,
            });
            setCode('');
            setDiscount('');
            setExpiry('');
            fetchCoupons();
            alert('Coupon created successfully!');
        } catch (err) {
            alert(err.response?.data?.message || 'Error creating coupon');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this coupon?')) {
            await axios.delete(`https://meeyaladminbackend-production.up.railway.app/api/coupons/${id}`);
            fetchCoupons();
        }
    };

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Manage Coupons</h1>

            <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow">
                <div>
                    <label className="block font-semibold">Coupon Code</label>
                    <input
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="border p-2 w-full rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block font-semibold">Discount Percentage (%)</label>
                    <input
                        type="number"
                        value={discount}
                        onChange={(e) => setDiscount(e.target.value)}
                        className="border p-2 w-full rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block font-semibold">Expiry Date</label>
                    <input
                        type="datetime-local"
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        className="border p-2 w-full rounded"
                        required
                    />
                </div>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                    Add Coupon
                </button>
            </form>

            <h2 className="text-xl font-semibold mt-8 mb-2">Existing Coupons</h2>
            <table className="w-full table-auto border-collapse">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border px-4 py-2">Code</th>
                        <th className="border px-4 py-2">Discount (%)</th>
                        <th className="border px-4 py-2">Expiry</th>
                        <th className="border px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {coupons.map((coupon) => (
                        <tr key={coupon._id} className="text-center">
                            <td className="border px-4 py-2">{coupon.code}</td>
                            <td className="border px-4 py-2">{coupon.discountPercentage}</td>
                            <td className="border px-4 py-2">
     {format(new Date(coupon.expiryDate), 'dd-MM-yyyy : HH:mm')}
</td>

                            <td className="border px-4 py-2">
                                <button
                                    onClick={() => handleDelete(coupon._id)}
                                    className="bg-red-500 text-white px-2 py-1 rounded"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Coupons;
