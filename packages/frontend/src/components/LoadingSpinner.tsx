interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function LoadingSpinner({
  message = 'Loading...',
  size = 'lg',
}: LoadingSpinnerProps) {
  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <span className={`loading loading-spinner loading-${size}`}></span>
        <p className="mt-4">{message}</p>
      </div>
    </div>
  );
}
