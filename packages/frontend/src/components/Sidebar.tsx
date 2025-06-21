import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { get } from 'aws-amplify/api';
import { HomeIcon, StarIcon, TrashIcon, TagIcon } from '@heroicons/react/24/outline';

export default function Sidebar() {
  const [tags, setTags] = useState<string[]>([]);

  const fetchTags = async () => {
    try {
      const responseData = await get({
        apiName: 'notes',
        path: '/tags',
      }).response;

      if (responseData.statusCode === 200) {
        const tagsData = await responseData.body.json();
        setTags(tagsData as string[]);
      }
    } catch (err) {
      console.error('Error fetching tags:', err);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

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
      label: 'Tags',
      path: '/all_tags',
      icon: <TagIcon className="size-5" />,
    },
    {
      label: 'Trash',
      path: '/trash',
      icon: <TrashIcon className="size-5" />,
    },
  ];

  return (
    <aside className="w-80 flex-none h-screen border-base-200 bg-base-100 border-r-2 hidden lg:flex flex-col">
      <ul className={`menu w-full px-4 py-6 gap-2`}>
        {/* Create Note Button */}
        {/* <li className="mb-4">
          <NavLink to="/create" className="btn btn-primary w-full">
            <PlusIcon className="size-5" />
            Create Note
          </NavLink>
        </li> */}

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

        {/* Tags Section */}
        {tags.length > 0 && (
          <>
            <li className="menu-title mt-6">
              <span className="text-xs font-semibold text-base-content/60">TAGS</span>
            </li>
            {tags.slice(0, 10).map((tag) => (
              <li key={tag}>
                <NavLink
                  to={`/tags/${encodeURIComponent(tag)}`}
                  className={({ isActive }) => (isActive ? 'menu-active' : '')}
                  end
                >
                  <TagIcon className="size-4" />
                  <span className="truncate">{tag}</span>
                </NavLink>
              </li>
            ))}
            {tags.length > 10 && (
              <li>
                <NavLink
                  to="/all_tags"
                  className="text-xs text-base-content/60 hover:text-base-content"
                >
                  +{tags.length - 10} more tags
                </NavLink>
              </li>
            )}
          </>
        )}
      </ul>
    </aside>
  );
}
