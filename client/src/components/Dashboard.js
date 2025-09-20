import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import api from '../services/axiosConfig';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const CostForm = ({ refreshSummary }) => {
  const [productCost, setProductCost] = useState(0);
  const [utilityCost, setUtilityCost] = useState(0);
  const [familyExpenses, setFamilyExpenses] = useState(0);
  const [productNotes, setProductNotes] = useState('');
  const [utilityNotes, setUtilityNotes] = useState('');
  const [familyNotes, setFamilyNotes] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    const costsToAdd = [];
    if (productCost) costsToAdd.push({ category: 'product', title: 'Product Cost', amount: Number(productCost), notes: productNotes, date });
    if (utilityCost) costsToAdd.push({ category: 'utility', title: 'Utility Cost', amount: Number(utilityCost), notes: utilityNotes, date });
    if (familyExpenses) costsToAdd.push({ category: 'family', title: 'Family Expenses', amount: Number(familyExpenses), notes: familyNotes, date });

    if (!costsToAdd.length) return alert('Please enter at least one valid cost');

    try {
      await Promise.all(costsToAdd.map(cost => api.post('/costs', cost)));
      setProductCost(0); setUtilityCost(0); setFamilyExpenses(0);
      setProductNotes(''); setUtilityNotes(''); setFamilyNotes(''); setDate('');
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
        <label>Date:</label>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="border p-1 w-full" />
      </div>
      <div className="mb-2">
        <label>Product Cost:</label>
        <input type="number" value={productCost} onChange={e => setProductCost(e.target.value)} className="border p-1 w-full mb-1" />
        <input type="text" placeholder="Notes" value={productNotes} onChange={e => setProductNotes(e.target.value)} className="border p-1 w-full" />
      </div>
      <div className="mb-2">
        <label>Utility Cost:</label>
        <input type="number" value={utilityCost} onChange={e => setUtilityCost(e.target.value)} className="border p-1 w-full mb-1" />
        <input type="text" placeholder="Notes" value={utilityNotes} onChange={e => setUtilityNotes(e.target.value)} className="border p-1 w-full" />
      </div>
      <div className="mb-2">
        <label>Family Expenses:</label>
        <input type="number" value={familyExpenses} onChange={e => setFamilyExpenses(e.target.value)} className="border p-1 w-full mb-1" />
        <input type="text" placeholder="Notes" value={familyNotes} onChange={e => setFamilyNotes(e.target.value)} className="border p-1 w-full" />
      </div>
      <button type="submit" className="bg-green-500 text-white px-3 py-1 rounded mt-2">Add Costs</button>
    </form>
  );
};

const Dashboard = () => {
  const [fullSummary, setFullSummary] = useState({});
  const [summary, setSummary] = useState({});
  const [detailedCosts, setDetailedCosts] = useState([]);
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [dailyRevenue, setDailyRevenue] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const [dailyProfit, setDailyProfit] = useState(0);
  const [monthlyProfit, setMonthlyProfit] = useState(0);

  const showDaily = () => { setSummary(fullSummary.daily || {}); setDetailedCosts(fullSummary.dailyDetails || []); };
  const showMonthly = () => { setSummary(fullSummary.monthly || {}); setDetailedCosts(fullSummary.monthlyDetails || []); };
  const showOverall = () => { setSummary(fullSummary.overall || {}); setDetailedCosts(fullSummary.details || []); };

  const fetchSummary = async () => {
    try {
      const res = await api.get('/costs/summary');
      setFullSummary(res.data);
      setSummary(res.data.daily || {});
      setDetailedCosts(res.data.dailyDetails || []);
    } catch { setFullSummary({}); setSummary({}); setDetailedCosts([]); }
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
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-green-600 mb-4 text-center">Dashboard</h1>
      <CostForm refreshSummary={fetchSummary} />
      <div className="flex gap-3 mb-4">
        <button onClick={showDaily} className="bg-blue-500 text-white px-4 py-2 rounded">Daily</button>
        <button onClick={showMonthly} className="bg-green-500 text-white px-4 py-2 rounded">Monthly</button>
        <button onClick={showOverall} className="bg-gray-500 text-white px-4 py-2 rounded">Overall</button>
      </div>
      <div className="bg-white p-4 shadow rounded mb-6">
        <p><strong>Product Cost:</strong> ৳ {summary.productCost || 0}</p>
        <p><strong>Utility Cost:</strong> ৳ {summary.utilityCost || 0}</p>
        <p><strong>Family Expenses:</strong> ৳ {summary.familyExpenses || 0}</p>
        <hr className="my-2" />
        <p><strong>Remaining Amount:</strong> ৳ {summary.remainingAmount || 0}</p>
        <p><strong>Net Profit:</strong> ৳ {summary.netProfit || 0}</p>
      </div>
      <div className="bg-white p-4 shadow rounded mb-6">
        <h2 className="font-semibold mb-2">Revenue & Profit</h2>
        <p><strong>Daily Revenue:</strong> ৳ {dailyRevenue}</p>
        <p><strong>Daily Profit:</strong> ৳ {dailyProfit}</p>
        <p><strong>Monthly Revenue:</strong> ৳ {monthlyRevenue}</p>
        <p><strong>Monthly Profit:</strong> ৳ {monthlyProfit}</p>
      </div>
      <div className="bg-white p-4 shadow rounded mb-6">
        <h2 className="font-semibold mb-2">Monthly Sales Chart</h2>
        <Bar data={chartData} />
      </div>
      <div className="bg-white p-4 shadow rounded">
        <h2 className="font-semibold mb-4">Detailed Expenses</h2>
        <table className="w-full border text-left">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Date</th>
              <th className="border p-2">Category</th>
              <th className="border p-2">Amount</th>
              <th className="border p-2">Notes</th>
            </tr>
          </thead>
          <tbody>
            {detailedCosts.map(c => (
              <tr key={c._id}>
                <td className="border p-2">{new Date(c.date).toLocaleDateString()}</td>
                <td className="border p-2 capitalize">{c.category}</td>
                <td className="border p-2">৳ {c.amount}</td>
                <td className="border p-2">{c.notes || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;