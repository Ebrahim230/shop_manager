import React, { useEffect, useState } from 'react'
import api from '../services/axiosConfig';

const Product = () => {
    const [products, setProducts] = useState([]);
    const [form, setForm] = useState({
        name: '',
        buyingPrice: '',
        sellingPrice: '',
        stock: '',
        expiryDate: ''
    });
    const [editById, setEditById] = useState(null);

    const fetchProducts = () => {
        api.get('product/')
            .then(res => setProducts(res.data))
            .catch(err => console.error(err));
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleChange = e => setForm({
        ...form,
        [e.target.name]: e.target.value
    });

    const handleAdd = e => {
        e.preventDefault();
        if (editById) {
            api.put(`product/${editById}`, form)
                .then(() => {
                    setEditById(null);
                    setForm({
                        name: '',
                        buyingPrice: '',
                        sellingPrice: '',
                        stock: '',
                        expiryDate: ''
                    });
                    fetchProducts();
                })
                .catch(err => console.error(err));
        } else {
            api.post('product', form)
                .then(() => {
                    setForm({
                        name: '',
                        buyingPrice: '',
                        sellingPrice: '',
                        stock: '',
                        expiryDate: ''
                    });
                    fetchProducts();
                })
                .catch(err => console.error(err));
        }
    };

    const handleEdit = (product) => {
        setEditById(product._id);
        setForm({
            name: product.name,
            buyingPrice: product.buyingPrice,
            sellingPrice: product.sellingPrice,
            stock: product.stock,
            expiryDate: product.expiryDate ? product.expiryDate.slice(0, 10) : ''
        });
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            api.delete(`product/${id}`)
                .then(() => fetchProducts())
                .catch(err => console.error(err));
        }
    };

    return (
        <div className='p-6'>
            <h1 className='text-2xl font-bold mb-4 text-blue-600 text-center'>Products</h1>
            <form className='bg-white shadow-md rounded-large p-4 mb-6' onSubmit={handleAdd}>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Product Name" className="border p-2 rounded" />
                    <input type="number" name="buyingPrice" value={form.buyingPrice} onChange={handleChange} placeholder="Buying Price" className="border p-2 rounded" />
                    <input type="number" name="sellingPrice" value={form.sellingPrice} onChange={handleChange} placeholder="Selling Price" className="border p-2 rounded" />
                    <input type="number" name="stock" value={form.stock} onChange={handleChange} placeholder="Stock Quantity" className="border p-2 rounded" />
                    <input type="date" name="expiryDate" value={form.expiryDate} onChange={handleChange} className="border p-2 rounded" />
                </div>
                <button type='submit' className='mt-4 bg-blue-600 text-white p-2 rounded hover:bg-blue-700'>
                    {editById ? 'Update Product' : 'Add Product'}
                </button>
                {editById && (
                    <button
                        type='button'
                        onClick={() => {
                            setEditById(null);
                            setForm({
                                name: '',
                                buyingPrice: '',
                                sellingPrice: '',
                                stock: '',
                                expiryDate: ''
                            });
                        }}
                        className='ml-2 bg-gray-500 text-white p-2 rounded hover:bg-gray-600'
                    >
                        Cancel
                    </button>
                )}
            </form>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white shadow-md rounded-lg">
                    <thead className="bg-blue-600 text-white">
                        <tr>
                            <th className="py-2 px-4">Name</th>
                            <th className="py-2 px-4">Buying Price</th>
                            <th className="py-2 px-4">Selling Price</th>
                            <th className="py-2 px-4">Stock</th>
                            <th className="py-2 px-4">Expiry Date</th>
                            <th className="py-2 px-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(p => (
                            <tr key={p._id} className="text-center border-b">
                                <td className="py-2 px-4">{p.name}</td>
                                <td className="py-2 px-4">{p.buyingPrice}</td>
                                <td className="py-2 px-4">{p.sellingPrice}</td>
                                <td className="py-2 px-4">{p.stock}</td>
                                <td className="py-2 px-4">{p.expiryDate ? new Date(p.expiryDate).toLocaleDateString() : "-"}</td>
                                <td className="py-2 px-4 flex justify-center gap-2">
                                    <button onClick={() => handleEdit(p)} className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">Edit</button>
                                    <button onClick={() => handleDelete(p._id)} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Product;