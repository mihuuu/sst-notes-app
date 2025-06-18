import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const { name: userName } = user?.attributes || {};
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="navbar sticky top-0 z-50 bg-base-100 shadow-sm px-4">
      <div className="flex-none text-primary">
        <Link to="/" className="text-xl flex items-center">
          <img src="/favicon-96x96.png" alt="SnapNote" className="w-8 h-8" />
          <span className="hidden sm:inline ml-2 font-semibold">SnapNote</span>
        </Link>
      </div>
      <div className="flex grow justify-end px-2 items-center gap-6">
        <ThemeToggle />
        {isLoading ? null : isAuthenticated ? (
          <>
            <label className="input">
              <svg
                className="h-[1em] opacity-50 hidden sm:block"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <g
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2.5"
                  fill="none"
                  stroke="currentColor"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.3-4.3"></path>
                </g>
              </svg>
              <input type="search" className="grow" placeholder="Search" />
            </label>

            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar avatar-placeholder"
              >
                <div className="bg-primary text-primary-content w-8 rounded-full">
                  <span>{userName ? userName.charAt(0).toUpperCase() : ''}</span>
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
              >
                <div className="text-base-600 p-4">Welcome, {userName || 'User'}!</div>
                <li>
                  <button
                    onClick={handleLogout}
                    className="btn btn-ghost justify-start w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Logging out...' : 'Logout'}
                  </button>
                </li>
              </ul>
            </div>
          </>
        ) : (
          <ul className="menu menu-horizontal gap-4">
            <li>
              <Link to="/login" className="btn btn-primary">
                Login
              </Link>
            </li>
            <li>
              <Link to="/signup" className="btn btn-ghost">
                Signup
              </Link>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
}
