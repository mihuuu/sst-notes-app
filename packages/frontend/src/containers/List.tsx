import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { get } from 'aws-amplify/api';
import AuthWrapper from '../components/AuthWrapper';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorDisplay from '../components/ErrorDisplay';
import { useLoadingState } from '../utils/hooks';
import { formatDate } from '../utils';
import type { Note } from '../types/note';

const StarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke-width="1.5"
    stroke="currentColor"
    className="size-5"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
    />
  </svg>
);

const EditIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="size-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
    />
  </svg>
);

const DeleteIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="size-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
    />
  </svg>
);

const NoteIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6 text-primary"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
    />
  </svg>
);

export default function List() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState<Note[]>([]);
  const { loading, error, setLoading, setError, clearError } = useLoadingState(true);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      clearError();
      const response = await get({
        apiName: 'notes',
        path: '/notes',
      });

      const responseData = await response.response;
      if (responseData.statusCode === 200) {
        const notesData = await responseData.body.json();
        // Type assertion for API response
        setNotes(notesData as unknown as Note[]);
      } else {
        throw new Error('Failed to fetch notes');
      }
    } catch (err) {
      console.error('Error fetching notes:', err);
      setError('Failed to load notes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // Show loading while fetching notes
  if (loading) {
    return <LoadingSpinner message="Loading notes..." />;
  }

  // Show error if failed to load notes
  if (error) {
    return <ErrorDisplay error={error} onRetry={fetchNotes} />;
  }

  return (
    <AuthWrapper>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Notes</h1>
          <button className="btn btn-primary" onClick={() => navigate('/create')}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Create Note
          </button>
        </div>

        {notes.length === 0 ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <svg
                className="mx-auto h-12 w-12 text-base-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-base-900">No notes</h3>
              <p className="mt-1 text-sm text-base-500">Get started by creating a new note.</p>
            </div>
          </div>
        ) : (
          <ul className="list bg-base-100">
            <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">
              Total notes: {notes.length}
            </li>
            {notes.map((note) => (
              <NoteItem key={note.noteId} note={note} />
            ))}
          </ul>
        )}
      </div>
    </AuthWrapper>
  );
}

const NoteItem = ({ note }: { note: Note }) => {
  const navigate = useNavigate();

  const truncateContent = (content: string, maxLength: number = 100) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  const handleCardClick = () => {
    navigate(`/note/${note.noteId}`);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    navigate(`/note/${note.noteId}?edit=true`);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    // TODO: Implement delete functionality
    console.log('Delete note:', note.noteId);
  };

  const handleStar = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    // TODO: Implement star functionality
    console.log('Star note:', note.noteId);
  };

  return (
    <li
      className="list-row cursor-pointer hover:bg-base-200 transition-colors"
      key={note.noteId}
      onClick={handleCardClick}
    >
      <div>
        <div className="size-10 rounded-box bg-primary/10 flex items-center justify-center">
          <NoteIcon />
        </div>
      </div>
      <div className="flex-1">
        <div className="font-semibold">{note.title || 'Untitled'}</div>
        <div className="text-sm text-base-600">{truncateContent(note.content)}</div>
        <div className="text-xs text-base-400 mt-1">{formatDate(note.createdAt)}</div>
      </div>
      <button className="btn btn-square btn-ghost" onClick={handleStar} title="Star note">
        <StarIcon />
      </button>
      <button className="btn btn-square btn-ghost" onClick={handleEdit} title="Edit note">
        <EditIcon />
      </button>
      <button className="btn btn-square btn-ghost" onClick={handleDelete} title="Delete note">
        <DeleteIcon />
      </button>
    </li>
  );
};
