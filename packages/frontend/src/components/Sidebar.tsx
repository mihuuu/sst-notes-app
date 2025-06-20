import { NavLink } from 'react-router-dom';

const SvgWrapper = ({
  children,
  ...props
}: { children: React.ReactNode } & React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      className="h-5 w-5"
      {...props}
    >
      {children}
    </svg>
  );
};

export default function Sidebar() {
  // Map menu items to their routes
  const menuItems = [
    {
      label: 'All Notes',
      path: '/list',
      icon: (
        <SvgWrapper>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </SvgWrapper>
      ),
    },
    {
      label: 'Favorites',
      path: '/favorites',
      icon: (
        <SvgWrapper>
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
          />
        </SvgWrapper>
      ),
    },
    {
      label: 'Trash',
      path: '/trash',
      icon: (
        <SvgWrapper>
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
          />
        </SvgWrapper>
      ),
    },
  ];

  return (
    <aside className="w-80 h-screen border-base-200 bg-base-100 border-r-2 hidden lg:flex flex-col">
      <ul className={`menu w-full px-4 py-6 gap-2`}>
        {/* Create Note Button */}
        <li className="mb-4">
          <NavLink to="/create" className="btn btn-primary w-full">
            <SvgWrapper>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              />
            </SvgWrapper>
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
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
}
