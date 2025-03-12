import React, { useEffect, useState } from "react";
import axios from "axios";

const Report = () => {
  const [salesForecast, setSalesForecast] = useState([]);
  const [predictDemand, setPredictDemand] = useState({});

  useEffect(() => {
    axios.get("http://127.0.0.1:5000/api/sales_forecast")
      .then((response) => setSalesForecast(response.data))
      .catch((error) => console.error("Error fetching sales forecast:", error));

    
    axios.get("http://127.0.0.1:5000/api/predict_demand")
      .then((response) => setPredictDemand(response.data))
      .catch((error) => console.error("Error fetching predict demand:", error));
  }, []);

  return (
    <div className="p-6 space-y-6 bg-gray-800 text-white min-h-screen flex flex-col items-center" style={{ height: "80vh", overflowY: "auto" }}>
      <h1 className="text-3xl font-bold text-center mb-6">Inventory Reports</h1>
      
      {/* Sales Forecast Report */}
      <div className="bg-gray-700 p-6 rounded-lg shadow-lg w-full max-w-3xl">
        <h2 className="text-2xl font-bold mb-4">Sales Forecast</h2>
        <ul className="divide-y divide-gray-600">
          {salesForecast.map((item) => (
            <li key={item.productId} className="p-4 hover:bg-gray-800 ">
              <h3 className="text-lg font-semibold">{item.productName}</h3>
              <p className="text-sm text-gray-400">Category: {item.category}</p>
              <p className="text-sm">Total Revenue: ${item.total_revenue}</p>
              <p className="text-sm">Units Sold: {item.total_units_sold}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Sales Reports */}
      {/* <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-3xl">
        <h2 className="text-2xl font-bold mb-4">Sales Reports</h2>
        <div className="space-y-4">
          {salesReports.map((report, index) => (
            <div key={index} className="p-4 bg-gray-700 rounded-lg hover:bg-gray-600">
              <h3 className="text-lg font-semibold">{report.productName}</h3>
              <p className="text-sm text-gray-400">Customer: {report.customerName}</p>
              <p className="text-sm">Revenue: ${report.totalRevenue}</p>
              <p className="text-sm">Quantity Sold: {report.quantitySold}</p>
              <p className="text-sm">Profit: ${report.profit}</p>
            </div>
          ))}
        </div>
      </div> */}

      {/* Predicted Demand */}
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-3xl">
        <h2 className="text-2xl font-bold mb-4">Predicted Demand</h2>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(predictDemand).map(([product, demand], index) => (
            <div key={index} className="p-4 bg-gray-700 rounded-lg text-center">
              <h3 className="text-lg font-semibold">{product}</h3>
              <span className="text-sm bg-gray-600 px-3 py-1 rounded-full">Demand: {demand}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Report;