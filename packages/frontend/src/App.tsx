import { Route, Routes } from 'react-router-dom';
import Home from './containers/Home';
import Login from './containers/Login';
import Navbar from './components/Navbar';
import NotFound from './containers/NotFound';
import Signup from './containers/Signup';
import { useAuth } from './contexts/AuthContext';
import Sidebar from './components/Sidebar';
import './App.css';

function App() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-w-screen min-h-screen flex items-center justify-center">
        <span className="loading loading-infinity loading-xl text-primary"></span>
      </div>
    );
  }

  return (
    <main className="flex flex-col min-h-screen min-w-screen">
      <Navbar />
      <div className="flex flex-grow flex-row">
        {isAuthenticated && <Sidebar />}
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </main>
  );
}

export default App;
