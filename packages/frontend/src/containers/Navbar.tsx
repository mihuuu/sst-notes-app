import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <div className="navbar sticky top-0 z-50 bg-base-100 shadow-sm px-4">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl text-gray-800">
          <img src="/favicon-96x96.png" alt="QuickNotes" className="w-8 h-8" /> QuickNotes
        </Link>
      </div>
      <div className="flex-none gap-4">
        <input type="text" placeholder="Search" className="input input-bordered w-24 md:w-auto" />
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link to="/login">Login</Link>
          </li>
          <li>
            <Link to="/signup">Signup</Link>
          </li>
        </ul>
        {/* <div role="button" className="btn btn-ghost btn-circle avatar">
          <div className="w-10 rounded-full">
            <img
              alt="Avatar"
              src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
            />
          </div>
        </div> */}
      </div>
    </div>
  );
}
