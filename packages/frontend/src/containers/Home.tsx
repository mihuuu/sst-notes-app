import { useAuth } from '../contexts/AuthContext';

export default function Home() {
  const { isAuthenticated, user } = useAuth();
  const { name } = user?.attributes || {};

  return (
    <div className="flex flex-col items-center justify-center pt-60">
      <div className="text-center">
        {isAuthenticated && name ? (
          <>
            <h2 className="text-2xl font-bold text-base-500">Welcome back, {name}!</h2>
            <p className="mt-4 text-base-500">Ready to take some notes?</p>
          </>
        ) : (
          <>
            <h1 className="text-4xl font-bold text-base-500">SnapNote</h1>
            <p className="text-lg mt-4 font-light text-base-500">A simple note taking app</p>
          </>
        )}
      </div>
    </div>
  );
}
