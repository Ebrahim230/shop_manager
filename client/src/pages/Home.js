import React, { useEffect, useState } from 'react'
import api from '../services/axiosConfig';

const Home = () => {
    const [message, setMessage] = useState('');
    useEffect(()=>{
        api.get('product/').then(res=>setMessage(res.data.message)).catch(err=>console.error(err));
    },[])
    return (
        <div className='p-6'>
            <h1 className='text-xl font-bold text-center'>Welcome to Fakir Store</h1>
            <p className='text-center'>Please move products, sales, and dashboard page.</p>
        </div>
    )
}

export default Home