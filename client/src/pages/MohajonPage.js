import { useState, useEffect } from 'react';
import api from '../services/axiosConfig';

const MohajonPage = () => {
  const [mohajons, setMohajons] = useState([]);
  const [selectedMohajon, setSelectedMohajon] = useState(null);
  const [newMohajonName, setNewMohajonName] = useState('');
  const [newMohajonContact, setNewMohajonContact] = useState('');
  const [transactionType, setTransactionType] = useState('credit');
  const [transactionAmount, setTransactionAmount] = useState(0);
  const [transactionNotes, setTransactionNotes] = useState('');
  const [transactionDate, setTransactionDate] = useState('');

  const fetchMohajons = async () => {
    try {
      const res = await api.get('/mohajons');
      setMohajons(res.data);
    } catch {}
  };

  const fetchMohajonDetail = async (id) => {
    try {
      const res = await api.get(`/mohajons/${id}`);
      setSelectedMohajon(res.data);
    } catch {}
  };

  const handleAddMohajon = async (e) => {
    e.preventDefault();
    if (!newMohajonName) return alert('Enter mohajon name');
    try {
      await api.post('/mohajons', { name: newMohajonName, contact: newMohajonContact });
      setNewMohajonName(''); setNewMohajonContact('');
      fetchMohajons();
    } catch {}
  };

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    if (!selectedMohajon) return alert('Select a mohajon first');
    try {
      await api.post(`/mohajons/${selectedMohajon._id}/transaction`, {
        type: transactionType,
        amount: Number(transactionAmount),
        notes: transactionNotes,
        date: transactionDate || new Date()
      });
      setTransactionAmount(0);
      setTransactionNotes('');
      setTransactionDate('');
      fetchMohajonDetail(selectedMohajon._id);
    } catch {}
  };

  useEffect(() => { fetchMohajons(); }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-green-600 mb-6 text-center">Mohajon Hisab</h1>

      <div className="bg-white p-4 shadow rounded mb-6">
        <h2 className="font-semibold mb-2">Add New Mohajon</h2>
        <form onSubmit={handleAddMohajon} className="flex flex-col gap-2">
          <input type="text" placeholder="Name" value={newMohajonName} onChange={e => setNewMohajonName(e.target.value)} className="border p-1 w-full" />
          <input type="text" placeholder="Contact" value={newMohajonContact} onChange={e => setNewMohajonContact(e.target.value)} className="border p-1 w-full" />
          <button type="submit" className="bg-green-500 text-white px-3 py-1 rounded mt-2">Add Mohajon</button>
        </form>
      </div>

      <div className="bg-white p-4 shadow rounded mb-6">
        <h2 className="font-semibold mb-2">Mohajons List</h2>
        <ul>
          {mohajons.map(m => (
            <li key={m._id} className={`cursor-pointer p-2 border-b ${selectedMohajon?._id === m._id ? 'bg-green-100' : ''}`} onClick={() => fetchMohajonDetail(m._id)}>
              {m.name} ({m.contact || '-'})
            </li>
          ))}
        </ul>
      </div>

      {selectedMohajon && (
        <div className="bg-white p-4 shadow rounded mb-6">
          <h2 className="font-semibold mb-2">Details of {selectedMohajon.name}</h2>
          <p><strong>Total Credit:</strong> ৳ {selectedMohajon.credit || 0}</p>
          <p><strong>Total Debit:</strong> ৳ {selectedMohajon.debit || 0}</p>
          <p><strong>Remaining Amount:</strong> ৳ {selectedMohajon.balance || 0}</p>

          <h3 className="mt-4 font-semibold">Add Transaction</h3>
          <form onSubmit={handleAddTransaction} className="flex flex-col gap-2 mb-4">
            <select value={transactionType} onChange={e => setTransactionType(e.target.value)} className="border p-1 w-full">
              <option value="credit">Credit</option>
              <option value="debit">Debit</option>
            </select>
            <input type="number" placeholder="Amount" value={transactionAmount} onChange={e => setTransactionAmount(e.target.value)} className="border p-1 w-full" />
            <input type="text" placeholder="Notes" value={transactionNotes} onChange={e => setTransactionNotes(e.target.value)} className="border p-1 w-full" />
            <input type="date" value={transactionDate} onChange={e => setTransactionDate(e.target.value)} className="border p-1 w-full" />
            <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded mt-2">Add Transaction</button>
          </form>

          <h3 className="font-semibold mb-2">Transactions</h3>
          <table className="w-full border text-left">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Date</th>
                <th className="border p-2">Type</th>
                <th className="border p-2">Amount</th>
                <th className="border p-2">Notes</th>
              </tr>
            </thead>
            <tbody>
              {selectedMohajon.transactions.map((t, i) => (
                <tr key={i}>
                  <td className="border p-2">{new Date(t.date).toLocaleDateString()}</td>
                  <td className="border p-2 capitalize">{t.type}</td>
                  <td className={`border p-2 ${t.type === 'debit' ? 'text-red-600' : 'text-green-600'}`}>৳ {t.amount}</td>
                  <td className="border p-2">{t.notes || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MohajonPage;