import React from 'react'
import { BrowserRouter, Route,Routes } from 'react-router-dom';
import Home from './pages/Home';
import NotFound from './pages/NotFound'
import Product from './pages/Product';
import Sales from './pages/Sales';
import Dashboard from './components/Dashboard';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/products' element={<Product/>}/>
        <Route path='/sales' element={<Sales/>}/>
        <Route path='/dashboard' element={<Dashboard/>}/>
        <Route path='*' element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;