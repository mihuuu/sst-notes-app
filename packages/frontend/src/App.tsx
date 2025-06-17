import { Route, Routes } from 'react-router-dom';
import Home from './containers/Home';
import Navbar from './containers/Navbar';
import './App.css';

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
