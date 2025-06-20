import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { get } from 'aws-amplify/api';
import AuthWrapper from '../components/AuthWrapper';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorDisplay from '../components/ErrorDisplay';
import { useLoadingState } from '../utils/hooks';
import { formatDate } from '../utils';
import type { Note } from '../types/note';
import {
  PlusIcon,
  StarIcon,
  PencilSquareIcon,
  TrashIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

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
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Notes</h1>
          <button className="btn btn-primary" onClick={() => navigate('/create')}>
            <PlusIcon className="size-5" />
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
          <ul className="list rounded-box">
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

  const truncateContent = (content: string, maxLength: number = 500) => {
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
      className="list-row cursor-pointer hover:bg-base-200/50 transition-colors py-5 flex-wrap gap-y-4"
      key={note.noteId}
      onClick={handleCardClick}
    >
      <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center">
        <DocumentTextIcon className="size-5 text-primary" />
      </div>
      <div className="flex-1 mx-2">
        <div className="font-semibold">{note.title || 'Untitled'}</div>
        <div className="list-col-wrap text-sm text-base-600 mt-2 line-clamp-2">
          {truncateContent(note.content)}
        </div>
        <div className="text-xs text-base-400 mt-2">{formatDate(note.createdAt)}</div>
      </div>

      <div className="flex-none flex justify-end space-x-2">
        <button className="btn btn-square btn-ghost" onClick={handleStar}>
          <StarIcon className="size-5" />
        </button>
        <button className="btn btn-square btn-ghost" onClick={handleEdit}>
          <PencilSquareIcon className="size-5" />
        </button>
        <button className="btn btn-square btn-ghost" onClick={handleDelete}>
          <TrashIcon className="size-5" />
        </button>
      </div>
    </li>
  );
};
