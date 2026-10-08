import { useState } from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import Gallery from './pages/Gallery'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import './App.css'

function App() {
  return(
    <BrowserRouter>
    <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/gallery' element={<Gallery />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}
export default App
