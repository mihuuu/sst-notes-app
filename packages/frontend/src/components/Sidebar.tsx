import { NavLink } from 'react-router-dom';
import { PlusIcon, HomeIcon, StarIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function Sidebar() {
  // Map menu items to their routes
  const menuItems = [
    {
      label: 'All Notes',
      path: '/list',
      icon: <HomeIcon className="size-5" />,
    },
    {
      label: 'Favorites',
      path: '/favorites',
      icon: <StarIcon className="size-5" />,
    },
    {
      label: 'Trash',
      path: '/trash',
      icon: <TrashIcon className="size-5" />,
    },
  ];

  return (
    <aside className="w-80 h-screen border-base-200 bg-base-100 border-r-2 hidden lg:flex flex-col">
      <ul className={`menu w-full px-4 py-6 gap-2`}>
        {/* Create Note Button */}
        <li className="mb-4">
          <NavLink to="/create" className="btn btn-primary w-full">
            <PlusIcon className="size-5" />
            Create Note
          </NavLink>
        </li>

        {/* Menu Items */}
        {menuItems.map((item) => (
          <li key={item.label}>
            <NavLink
              to={item.path}
              className={({ isActive }) => (isActive ? 'menu-active' : '')}
              end={item.path === '/'}
            >
              {!!item.icon && item.icon}
              <span>{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
}
