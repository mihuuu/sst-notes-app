import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { get } from 'aws-amplify/api';
import { useLoadingState } from '../utils/hooks';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorDisplay from '../components/ErrorDisplay';
import { TagIcon } from '@heroicons/react/24/outline';

export default function AllTags() {
  const navigate = useNavigate();
  const [tags, setTags] = useState<string[]>([]);
  const { loading, error, setLoading, setError, clearError } = useLoadingState(true);

  const fetchTags = async () => {
    try {
      setLoading(true);
      clearError();

      const response = await get({
        apiName: 'notes',
        path: '/tags',
      });

      const responseData = await response.response;
      if (responseData.statusCode === 200) {
        const tagsData = await responseData.body.json();
        setTags(tagsData as string[]);
      } else {
        throw new Error('Failed to fetch tags');
      }
    } catch (err) {
      console.error('Error fetching tags:', err);
      setError('Failed to load tags');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const handleTagClick = (selectedTag: string) => {
    navigate(`/tags/${encodeURIComponent(selectedTag)}`);
  };

  // Show error if failed to load tags
  if (error) {
    return <ErrorDisplay error={error} onRetry={fetchTags} />;
  }

  return (
    <div className="container">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Tags</h1>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading tags..." />
      ) : tags.length === 0 ? (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <TagIcon className="mx-auto h-12 w-12 text-base-400" />
            <h3 className="mt-2 text-sm font-medium text-base-900">No tags yet</h3>
            <p className="mt-1 text-sm text-base-500">
              Start creating notes with tags to see them here.
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {tags.map((tagName) => (
              <div
                key={tagName}
                className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleTagClick(tagName)}
              >
                <div className="card-body p-4">
                  <div className="flex items-center gap-2">
                    <TagIcon className="size-5 text-primary" />
                    <h3 className="card-title font-semibold">{tagName}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
