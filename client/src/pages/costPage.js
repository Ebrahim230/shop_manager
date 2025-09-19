import { useState, useEffect } from 'react';
import api from '../services/axiosConfig';

const CostForm = ({ refreshSummary }) => {
  const [productCost, setProductCost] = useState(0);
  const [utilityCost, setUtilityCost] = useState(0);
  const [familyExpenses, setFamilyExpenses] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (productCost) await api.post('costs/', { category: 'product', title: 'Product Cost', amount: Number(productCost) });
      if (utilityCost) await api.post('costs/', { category: 'utility', title: 'Utility Cost', amount: Number(utilityCost) });
      if (familyExpenses) await api.post('costs/', { category: 'family', title: 'Family Expenses', amount: Number(familyExpenses) });
      setProductCost(0);
      setUtilityCost(0);
      setFamilyExpenses(0);
      refreshSummary();
      alert('Costs added successfully');
    } catch (err) {
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

export default CostForm;