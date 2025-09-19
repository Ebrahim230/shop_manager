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

const CostForm = ({ refreshSummary }) => {
  const [productCost, setProductCost] = useState(0);
  const [utilityCost, setUtilityCost] = useState(0);
  const [familyExpenses, setFamilyExpenses] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const costsToAdd = [];
    if (productCost && !isNaN(productCost)) costsToAdd.push({ category: 'product', title: 'Product Cost', amount: Number(productCost) });
    if (utilityCost && !isNaN(utilityCost)) costsToAdd.push({ category: 'utility', title: 'Utility Cost', amount: Number(utilityCost) });
    if (familyExpenses && !isNaN(familyExpenses)) costsToAdd.push({ category: 'family', title: 'Family Expenses', amount: Number(familyExpenses) });

    if (costsToAdd.length === 0) {
      alert('Please enter at least one valid cost');
      return;
    }

    try {
      await Promise.all(costsToAdd.map(cost => api.post('/costs', cost)));
      setProductCost(0);
      setUtilityCost(0);
      setFamilyExpenses(0);
      refreshSummary();
      alert('Costs added successfully');
    } catch (err) {
      console.error(err.response?.data || err);
      alert('Error saving costs');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 shadow rounded mb-6">
      <h2 className="text-lg font-semibold mb-4">Add Costs</h2>
      <div className="mb-2">
        <label>Product Cost:</label>
        <input type="number" value={productCost} onChange={e => setProductCost(e.target.value)} className="border p-1 w-full" />
      </div>
      <div className="mb-2">
        <label>Utility Cost:</label>
        <input type="number" value={utilityCost} onChange={e => setUtilityCost(e.target.value)} className="border p-1 w-full" />
      </div>
      <div className="mb-2">
        <label>Family Expenses:</label>
        <input type="number" value={familyExpenses} onChange={e => setFamilyExpenses(e.target.value)} className="border p-1 w-full" />
      </div>
      <button type="submit" className="bg-green-500 text-white px-3 py-1 rounded mt-2">Add Costs</button>
    </form>
  );
};

const Dashboard = () => {
  const [fullSummary, setFullSummary] = useState({});
  const [summary, setSummary] = useState({});
  const [dailyRevenue, setDailyRevenue] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const [dailyProfit, setDailyProfit] = useState(0);
  const [monthlyProfit, setMonthlyProfit] = useState(0);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [expiryProducts, setExpiryProducts] = useState([]);
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  const showDaily = () => setSummary(fullSummary.daily || {});
  const showMonthly = () => setSummary(fullSummary.monthly || {});
  const showOverall = () => setSummary(fullSummary.overall || {});

  const fetchSummary = async () => {
    try {
      const res = await api.get('/costs/summary');
      setFullSummary(res.data);
      setSummary(res.data.daily || {});
    } catch {
      setFullSummary({});
      setSummary({});
    }
  };

  const fetchSales = async () => {
    try {
      const resDaily = await api.get('/report/daily');
      setDailyRevenue(resDaily.data.totalRevenue || 0);
      setDailyProfit(resDaily.data.totalProfit || 0);

      const resMonthly = await api.get('/report/monthly');
      const sales = resMonthly.data.sales || [];
      const labels = sales.map(s => new Date(s.createdAt).toLocaleDateString());
      const totals = sales.map(s => s.total || 0);
      const profits = sales.map(s => s.profit || 0);
      setMonthlyRevenue(resMonthly.data.totalRevenue || 0);
      setMonthlyProfit(resMonthly.data.totalProfit || 0);
      setChartData({
        labels,
        datasets: [
          { label: 'Revenue', data: totals, backgroundColor: 'rgba(34,197,94,0.6)' },
          { label: 'Profit', data: profits, backgroundColor: 'rgba(59,130,246,0.6)' }
        ]
      });
    } catch {}
  };

  useEffect(() => {
    fetchSummary();
    fetchSales();

    const socket = io(base_url);
    socket.on('alerts', ({ lowStock, expiry }) => {
      setLowStockProducts(lowStock || []);
      setExpiryProducts(expiry || []);
    });

    return () => socket.disconnect();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-green-600 mb-4 text-center">Dashboard</h1>

      <CostForm refreshSummary={fetchSummary} />

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 shadow rounded">
          <h2 className="font-semibold mb-2">Low Stock Products</h2>
          <ul className="list-disc pl-5">
            {lowStockProducts.map(p => <li key={p._id}>{p.name} - {p.stock}</li>)}
          </ul>
        </div>
        <div className="bg-white p-4 shadow rounded">
          <h2 className="font-semibold mb-2">Products Near Expiry</h2>
          <ul className="list-disc pl-5">
            {expiryProducts.map(p => <li key={p._id}>{p.name} - {p.expiryDate ? new Date(p.expiryDate).toLocaleDateString() : 'N/A'}</li>)}
          </ul>
        </div>
      </div>

      <div className="bg-white p-4 shadow rounded">
        <h2 className="font-semibold mb-4">Cost & Net Summary</h2>
        <div className="flex gap-2 mb-4">
          <button onClick={showDaily} className="bg-blue-500 text-white px-3 py-1 rounded">Daily</button>
          <button onClick={showMonthly} className="bg-green-500 text-white px-3 py-1 rounded">Monthly</button>
          <button onClick={showOverall} className="bg-gray-500 text-white px-3 py-1 rounded">Overall</button>
        </div>
        <p><strong>Product Cost:</strong> ৳ {summary.productCost || 0}</p>
        <p><strong>Utility Cost:</strong> ৳ {summary.utilityCost || 0}</p>
        <p><strong>Family Expenses:</strong> ৳ {summary.familyExpenses || 0}</p>
        <hr className="my-2" />
        <p><strong>Remaining Amount (Revenue - Profit - Product & Utility):</strong> ৳ {summary.remainingAmount || 0}</p>
        <p><strong>Final Net Profit (Profit - Family Expenses):</strong> ৳ {summary.netProfit || 0}</p>
      </div>
    </div>
  );
};

export default Dashboard;