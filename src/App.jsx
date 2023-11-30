import { Routes, Route } from "react-router-dom";
import Layout from './pages/Layout';
import Home from './pages/Home';
import CustomerList from './pages/CustomerList';
import TrainingList from './pages/TrainingsList';
import Calendar from './pages/Calendar';
import './App.css'

function App() {


  return (
    <div>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="customers" element={<CustomerList />} />
          <Route path="trainings" element={<TrainingList />} />
          <Route path="calendar" element={<Calendar />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
