import './App.css'
import { BrowserRouter as Router,Routes,Route, Navigate } from 'react-router-dom'
import Login from './components/Login'
import Signup from './components/Signup'
import EventList from './components/EventList'
import EventForm from './components/EventForm'
import Navbar from './components/Navbar'

function isAuthenticated() {
  return localStorage.getItem('token') !== null;
}

function ProtectedRoute({ element }) {
  return isAuthenticated() ? element : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProtectedRoute element={<><Navbar /><EventForm /><EventList/></>} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  )
}

export default App
