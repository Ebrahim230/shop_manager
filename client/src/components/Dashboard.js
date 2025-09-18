import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import api from '../services/axiosConfig';
import base_url from '../services/baseUrl';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [dailyRevenue, setDailyRevenue] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const [dailyProfit, setDailyProfit] = useState(0);
  const [monthlyProfit, setMonthlyProfit] = useState(0);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [expiryProducts, setExpiryProducts] = useState([]);
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    const socket = io(base_url);

    api.get("report/daily").then(res => {
      setDailyRevenue(res.data.totalRevenue || 0);
      setDailyProfit(res.data.totalProfit|| 0);
    }).catch(() => {
      setDailyRevenue(0);
      setDailyProfit(0);
    });

    api.get("report/monthly").then(res => {
      const sales = res.data.sales || [];
      const labels = sales.map(s => new Date(s.createdAt).toLocaleDateString());
      const totals = sales.map(s => s.total || 0);
      const profits = sales.map(s => (s.profit || 0));
      setMonthlyRevenue(res.data.totalRevenue || 0);
      setMonthlyProfit(res.data.totalProfit || 0);
      setChartData({
        labels,
        datasets: [
          { label: "Revenue", data: totals, backgroundColor: "rgba(34,197,94,0.6)" },
          { label: "Profit", data: profits, backgroundColor: "rgba(59,130,246,0.6)" }
        ]
      });
    }).catch(() => {
      setMonthlyRevenue(0);
      setMonthlyProfit(0);
      setChartData({ labels: [], datasets: [] });
    });

    socket.on("alerts", ({ lowStock, expiry }) => {
      setLowStockProducts(lowStock || []);
      setExpiryProducts(expiry || []);
    });

    return () => socket.disconnect();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-green-600 mb-4 text-center">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 shadow rounded">
          <h2 className="font-semibold mb-2">Daily Revenue</h2>
          <p className="text-xl font-bold">৳ {dailyRevenue}</p>
          <h2 className="font-semibold mb-2 mt-2">Daily Profit</h2>
          <p className="text-xl font-bold">৳ {dailyProfit}</p>
        </div>
        <div className="bg-white p-4 shadow rounded">
          <h2 className="font-semibold mb-2">Monthly Revenue</h2>
          <p className="text-xl font-bold">৳ {monthlyRevenue}</p>
          <h2 className="font-semibold mb-2 mt-2">Monthly Profit</h2>
          <p className="text-xl font-bold">৳ {monthlyProfit}</p>
        </div>
      </div>
      <div className="bg-white p-4 shadow rounded mb-6">
        <h2 className="font-semibold mb-2">Monthly Sales Chart</h2>
        <Bar data={chartData} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 shadow rounded">
          <h2 className="font-semibold mb-2">Low Stock Products</h2>
          <ul className="list-disc pl-5">
            {lowStockProducts.map(p => <li key={p._id}>{p.name} - {p.stock}</li>)}
          </ul>
        </div>
        <div className="bg-white p-4 shadow rounded">
          <h2 className="font-semibold mb-2">Products Near Expiry</h2>
          <ul className="list-disc pl-5">
            {expiryProducts.map(p => <li key={p._id}>{p.name} - {p.expiryDate ? new Date(p.expiryDate).toLocaleDateString() : "N/A"}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;