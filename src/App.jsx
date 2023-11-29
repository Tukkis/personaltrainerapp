import { useState } from 'react'
import { Routes, Route } from "react-router-dom";
import Layout from './pages/Layout';
import Home from './pages/Home';
import ListPage from './pages/ListPage';
import Calendar from './pages/Calendar';
import './App.css'

function App() {


  return (
    <div>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="list" element={<ListPage />} />
          <Route path="calendar" element={<Calendar />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
