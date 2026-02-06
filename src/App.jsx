import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './Layout'
import Home from './pages/Home'
import Admin from './pages/Admin'
import Ouvidoria from "./pages/Ouvidoria";


function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/ouvidoria/*" element={<Ouvidoria />} />
      </Routes>
    </Layout>
  )
}


export default App