import { useEffect, useState } from "react";
import axios from "axios";
import { 
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  BarChart, Bar, PieChart, Pie, Cell
} from "recharts";
import { 
  FaShoppingCart, FaUsers, FaBoxOpen, FaMoneyBillWave, 
  FaExclamationTriangle, FaFileInvoice, FaUserPlus, FaRedoAlt 
} from "react-icons/fa";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:8000/api/v1/dashboard", { withCredentials: true })
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching dashboard data:", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center text-white">Loading...</div>;
  if (!data) return <div className="text-center text-white">No data available</div>;

  return (
    <div className="p-6 grid gap-6 text-white">
      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <StatBox icon={<FaMoneyBillWave />} label="Total Revenue" value={`₹${data.totalSales}`} bgColor="bg-green-600" />
        <StatBox icon={<FaShoppingCart />} label="Total Purchases" value={data.totalOrders} bgColor="bg-blue-600" />
        <StatBox icon={<FaBoxOpen />} label="Total Products" value={data.totalProducts} bgColor="bg-yellow-600" />
        <StatBox icon={<FaUsers />} label="Total Customers" value={data.totalCustomers} bgColor="bg-purple-600" />
        <StatBox icon={<FaExclamationTriangle />} label="Low Stock" value={data.lowStockProducts} bgColor="bg-red-600" />
        <StatBox icon={<FaExclamationTriangle />} label="Out of Stock" value={data.outOfStockProducts} bgColor="bg-red-800" />
        <StatBox icon={<FaFileInvoice />} label="Paid Invoices" value={data.paidInvoicesCount} bgColor="bg-green-700" />
        <StatBox icon={<FaFileInvoice />} label="Pending Invoices" value={data.pendingInvoicesCount} bgColor="bg-orange-600" />
        
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Best Selling Products Chart */}
        <ChartBox title="Best Selling Products">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.bestSellingProducts}>
              <XAxis dataKey="productName" tick={{ fill: "white" }} />
              <YAxis tick={{ fill: "white" }} />
              <Tooltip />
              <Bar dataKey="totalSold" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </ChartBox>

        {/* Most Ordered Categories Pie Chart */}
        <ChartBox title="Most Ordered Categories">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={data.mostOrderedCategories} dataKey="totalSold" nameKey="category" outerRadius={100} label>
                {data.mostOrderedCategories.map((_, index) => (
                  <Cell key={index} fill={["#8884d8", "#82ca9d", "#ffc658"][index % 3]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartBox>
      </div>
      
      {/* Unsold Products Section */}
      <div className="bg-gray-900 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Unsold Products</h2>
        <table className="w-full text-white">
          <thead>
            <tr className="border-b border-gray-600">
              <th className="text-left p-2">Product</th>
              <th className="text-left p-2">Category</th>
              <th className="text-left p-2">Stock</th>
            </tr>
          </thead>
          <tbody>
            {data.unsoldProducts.map((product) => (
              <tr key={product._id} className="border-b border-gray-600">
                <td className="p-2">{product.productname}</td>
                <td className="p-2">{product.category}</td>
                <td className="p-2">{product.stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Most Frequent Customers Section */}
      <div className="bg-gray-900 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Most Frequent Customers</h2>
        <table className="w-full text-white">
          <thead>
            <tr className="border-b border-gray-600">
              <th className="text-left p-2">Customer Name</th>
              <th className="text-left p-2">Orders</th>
            </tr>
          </thead>
          <tbody>
            {data.mostFrequentCustomers.map((customer) => (
              <tr key={customer.customerName} className="border-b border-gray-600">
                <td className="p-2">{customer.customerName}</td>
                <td className="p-2">{customer.orderCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const StatBox = ({ icon, label, value, bgColor }) => (
  <div className={`${bgColor} p-4 rounded-lg flex items-center gap-4`}>
    <div className="text-3xl">{icon}</div>
    <div>
      <p className="text-lg font-semibold">{label}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  </div>
);

const ChartBox = ({ title, children }) => (
  <div className="p-4 bg-gray-900 rounded-lg">
    <h2 className="text-lg font-semibold mb-4">{title}</h2>
    {children}
  </div>
);

export default Dashboard;
