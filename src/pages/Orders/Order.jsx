import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PendingOrders = () => {
  const [orders, setOrders] = useState([]);
  console.log('orders', orders);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null); // for modal
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchPendingOrders();
  }, []);

  const fetchPendingOrders = async () => {
    try {
      const response = await axios.get('https://meeyaladminbackend-production.up.railway.app/api/orders/pending');
      const data = response.data;
      if (data && Array.isArray(data.orders)) {
        setOrders(data.orders);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error('Error fetching pending orders:', err);
      setError('Failed to load pending orders.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) =>
    typeof value === 'number' ? `₹${value.toFixed(2)}` : '₹0.00';

  const statusBadge = (status, type = 'payment') => {
    const base = 'px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide';
    if (!status) return <span className={`${base} bg-gray-300 text-gray-800`}>N/A</span>;

    if (type === 'payment') {
      if (status === 'pending') return <span className={`${base} bg-yellow-100 text-yellow-700`}>Pending</span>;
      if (status === 'paid') return <span className={`${base} bg-green-100 text-green-700`}>Paid</span>;
      if (status === 'failed') return <span className={`${base} bg-red-100 text-red-700`}>Failed</span>;
    }

    return <span className={`${base} bg-blue-100 text-blue-700`}>{status}</span>;
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await axios.patch(`https://meeyaladminbackend-production.up.railway.app/api/orders/${orderId}/status`, {
        orderStatus: newStatus,
      });
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, orderStatus: newStatus } : order
        )
      );
    } catch (err) {
      console.error('❌ Failed to update status:', err);
      alert('Failed to update order status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleView = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleDelete = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    try {
      await axios.delete(`https://meeyaladminbackend-production.up.railway.app/api/orders/${orderId}`);
      setOrders((prev) => prev.filter((o) => o._id !== orderId));
    } catch (err) {
      console.error('Error deleting order:', err);
      alert('Failed to delete order.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500 font-semibold">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-extrabold mb-6 text-center text-gray-800 drop-shadow-sm">
        🛒 Pending Orders
      </h1>
      {orders.length === 0 ? (
        <p className="text-center text-gray-500">No pending orders found.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl shadow-lg ring-1 ring-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase">Order ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase">User ID</th>
                <th className="px-4 py-3 text-center text-xs font-medium uppercase">Items</th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase">Total</th>
                <th className="px-4 py-3 text-center text-xs font-medium uppercase">Pay Status</th>
                <th className="px-4 py-3 text-center text-xs font-medium uppercase">Order Status</th>
                <th className="px-4 py-3 text-center text-xs font-medium uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3">{order.orderId || 'N/A'}</td>
                  <td className="px-4 py-3">
                    {order.userId ? `${order.userId.username} (${order.userId.name})` : 'N/A'}
                  </td>
                  <td className="px-4 py-3 text-center">{order.items?.length || 0}</td>
                  <td className="px-4 py-3 text-right font-semibold text-green-700">
                    {formatCurrency(order.total)}
                  </td>
                  <td className="px-4 py-3 text-center">{statusBadge(order.paymentStatus, 'payment')}</td>
                  <td className="px-4 py-3 text-center">
                    <select
                      value={order.orderStatus}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      disabled={updatingId === order._id}
                      className="border border-gray-300 rounded-md px-2 py-1 text-sm bg-white"
                    >
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-center space-x-2">
                    <button
                      onClick={() => handleView(order)}
                      className="bg-blue-500 text-white px-3 py-1 text-xs rounded hover:bg-blue-600"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDelete(order._id)}
                      className="bg-red-500 text-white px-3 py-1 text-xs rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* View Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white rounded-xl shadow-lg max-w-3xl w-full p-6 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-black text-xl"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
              Order Details - {selectedOrder.orderId}
            </h2>
            <p><strong>User:</strong> {selectedOrder.userId?.name} ({selectedOrder.userId?.username})</p>
            <p><strong>Payment:</strong> {selectedOrder.paymentMethod}</p>
            <p><strong>Total:</strong> {formatCurrency(selectedOrder.total)}</p>
            <p><strong>Status:</strong> {selectedOrder.orderStatus}</p>
            <p><strong>Date:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>

            <div className="mt-4">
              <h3 className="font-semibold mb-2">Items:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {selectedOrder.items?.map((item, index) => (
                  <div
                    key={index}
                    className="border p-3 rounded shadow-sm flex gap-4 items-center"
                  >
                    <img
                      src={
                        item.productId?.productImages?.[0]?.imageUrl ||
                        'https://via.placeholder.com/100'
                      }

                      alt="Product"
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div>
                      <p><strong>ID:</strong> {item.productId?._id}</p>
                      <p><strong>Qty:</strong> {item.quantity}</p>
                      <p><strong>Price:</strong> {formatCurrency(item.priceAtCheckout)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingOrders;
