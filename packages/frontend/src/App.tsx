import { Route, Routes } from 'react-router-dom';
import Home from './containers/Home';
import Login from './containers/Login';
import Navbar from './components/Navbar';
import NotFound from './containers/NotFound';
import Signup from './containers/Signup';
import CreateNote from './containers/CreateNote';
import ViewNote from './containers/ViewNote';
import { useAuth } from './contexts/AuthContext';
import Sidebar from './components/Sidebar';
import Favorites from './containers/Favorites';
import List from './containers/List';
import Trash from './containers/Trash';
import Search from './containers/Search';
import Tags from './containers/Tags';
import LoadingSpinner from './components/LoadingSpinner';
import AllTags from './containers/AllTags';
import './App.css';

function App() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <main className="flex flex-col h-screen w-screen">
      <Navbar />
      <div className="flex flex-grow flex-row h-[calc(100vh-4rem)]">
        {isAuthenticated && <Sidebar />}
        <div className="flex-grow box-border h-full overflow-auto p-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/list" element={<List />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/trash" element={<Trash />} />
            <Route path="/search" element={<Search />} />
            <Route path="/all_tags" element={<AllTags />} />
            <Route path="/tags/:tag" element={<Tags />} />
            <Route path="/create" element={<CreateNote />} />
            <Route path="/note/:noteId" element={<ViewNote />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </main>
  );
}

export default App;
