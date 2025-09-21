import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import NotFound from './pages/NotFound'
import Product from './pages/Product';
import Sales from './pages/Sales';
import Dashboard from './components/Dashboard';
import Mohajons from './pages/MohajonPage';
import Navbar from './components/NavBar'

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/products' element={<Product />} />
        <Route path='/sales' element={<Sales />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/mohajons' element={<Mohajons />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;