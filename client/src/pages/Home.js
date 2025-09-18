import React, { useEffect, useState } from 'react'
import api from '../services/axiosConfig';

const Home = () => {
    const [message, setMessage] = useState('');
    useEffect(()=>{
        api.get('product/').then(res=>setMessage(res.data.message)).catch(err=>console.error(err));
    },[])
    return (
        <div className='p-6'>
            <h1 className='text-xl font-bold'>Shop manager frontend.</h1>
            <p>Backend says: {message}</p>
        </div>
    )
}

export default Home