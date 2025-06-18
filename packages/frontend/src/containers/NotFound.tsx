import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center max-w-md mx-auto px-4">
        {/* 404 Icon */}
        <div className="mb-8">
          <div className="text-8xl font-bold text-gray-300 mb-4">404</div>
        </div>

        {/* Error Message */}
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Page Not Found</h1>
        <p className="text-lg text-gray-600 mb-8">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link to="/" className="btn btn-primary btn-wide">
            Go Home
          </Link>

          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <button onClick={() => window.history.back()} className="btn btn-outline btn-sm">
              Go Back
            </button>
            <button onClick={() => window.location.reload()} className="btn btn-outline btn-sm">
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
