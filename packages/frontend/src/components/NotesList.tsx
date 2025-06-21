import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { get } from 'aws-amplify/api';
import Highlighter from 'react-highlight-words';
import LoadingSpinner from './LoadingSpinner';
import ErrorDisplay from './ErrorDisplay';
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
import {
  StarIcon as StarIconSolid,
  ArrowUturnLeftIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/solid';

interface NotesListProps {
  title: string;
  showStarred?: boolean;
  showDeleted?: boolean;
  emptyStateTitle?: string;
  emptyStateDescription?: string;
  countLabel?: string;
  showCreateButton?: boolean;
  searchQuery?: string;
}

export default function NotesList({
  title,
  showStarred = false,
  showDeleted = false,
  emptyStateTitle = 'No notes',
  emptyStateDescription = 'Get started by creating a new note.',
  countLabel = 'Total notes',
  showCreateButton = true,
  searchQuery,
}: NotesListProps) {
  const navigate = useNavigate();
  const [notes, setNotes] = useState<Note[]>([]);
  const { loading, error, setLoading, setError, clearError } = useLoadingState(true);

  const fetchNotes = async () => {
    try {
      clearError();
      // Build query parameters
      const queryParams = new URLSearchParams();
      if (showStarred) {
        queryParams.append('starred', 'true');
      }
      if (showDeleted) {
        queryParams.append('deleted', 'true');
      }
      if (searchQuery && searchQuery.trim()) {
        queryParams.append('keyword', searchQuery.trim());
      }

      const response = await get({
        apiName: 'notes',
        path: `/notes?${queryParams}`,
      });

      const responseData = await response.response;
      if (responseData.statusCode === 200) {
        const notesData = await responseData.body.json();
        // No need to filter on frontend anymore - backend handles it
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
  }, [showStarred, showDeleted, searchQuery]);

  const handleRemoveItem = (noteId: string) => {
    setNotes((prev) => prev.filter((n) => n.noteId !== noteId));
  };

  // Show loading while fetching notes
  if (loading) {
    return <LoadingSpinner message={`Loading notes...`} />;
  }

  // Show error if failed to load notes
  if (error) {
    return <ErrorDisplay error={error} onRetry={fetchNotes} />;
  }

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">{title}</h1>
        {showCreateButton && (
          <button className="btn btn-primary" onClick={() => navigate('/create')}>
            <PlusIcon className="size-5" />
            Create Note
          </button>
        )}
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

            <h3 className="mt-2 text-sm font-medium text-base-900">{emptyStateTitle}</h3>
            <p className="mt-1 text-sm text-base-500">{emptyStateDescription}</p>
          </div>
        </div>
      ) : (
        <ul className="list rounded-box">
          <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">
            {countLabel}: {notes.length}
          </li>
          {notes.map((note) => (
            <NoteItem
              key={note.noteId}
              note={note}
              showStarred={showStarred}
              showDeleted={showDeleted}
              onRemoveFromList={handleRemoveItem}
              disableClick={showDeleted}
              searchQuery={searchQuery}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

// Note content display component
const NoteContent = ({
  note,
  showDeleted,
  searchQuery,
}: {
  note: Note;
  showDeleted?: boolean;
  searchQuery?: string;
}) => {
  const truncateContent = (content: string, maxLength: number = 500) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  const truncatedContent = truncateContent(note.content);
  const searchWords = searchQuery ? searchQuery.split(' ').filter((word) => word.length > 0) : [];

  return (
    <>
      <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center">
        <DocumentTextIcon className="size-5 text-primary" />
      </div>
      <div className="flex-1 mx-2">
        <div className="font-semibold">
          {searchQuery ? (
            <Highlighter
              highlightClassName="bg-primary-200 dark:bg-primary-800 font-semibold"
              searchWords={searchWords}
              autoEscape={true}
              textToHighlight={note.title || 'Untitled'}
            />
          ) : (
            note.title || 'Untitled'
          )}
        </div>
        <div className="list-col-wrap text-sm text-base-600 mt-2 line-clamp-2">
          {searchQuery ? (
            <Highlighter
              highlightClassName="bg-primary-200 dark:bg-primary-800 font-semibold"
              searchWords={searchWords}
              autoEscape={true}
              textToHighlight={truncatedContent}
            />
          ) : (
            truncatedContent
          )}
        </div>
        <div className="text-xs text-base-400 mt-2">
          {showDeleted && note.deletedAt
            ? `Deleted ${formatDate(note.deletedAt)}`
            : formatDate(note.createdAt)}
        </div>
      </div>
    </>
  );
};

// Refactored NoteItem component
const NoteItem = ({
  note,
  showStarred,
  showDeleted,
  onRemoveFromList,
  disableClick,
  searchQuery,
}: {
  note: Note;
  showStarred?: boolean;
  showDeleted?: boolean;
  onRemoveFromList?: (noteId: string) => void;
  disableClick?: boolean;
  searchQuery?: string;
}) => {
  const [starred, setStarred] = useState(!!note.starred);
  const [isStarring, setIsStarring] = useState(false);
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/note/${note.noteId}`);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    navigate(`/note/${note.noteId}?edit=true`);
  };

  /** Permanently delete from trash */
  const handlePermanentDelete = async () => {
    try {
      const { del } = await import('aws-amplify/api');
      await del({
        apiName: 'notes',
        path: `/notes/${note.noteId}/permanent`,
      });

      // Remove from list
      if (onRemoveFromList) {
        onRemoveFromList(note.noteId);
      }
    } catch (error) {
      console.error('Error permanently deleting note:', error);
      alert('Failed to permanently delete note');
    }
  };

  /** Soft delete, can be restored in the trash */
  const handleSoftDelete = async () => {
    try {
      const { del } = await import('aws-amplify/api');
      await del({
        apiName: 'notes',
        path: `/notes/${note.noteId}`,
      });

      // Remove from list
      if (onRemoveFromList) {
        onRemoveFromList(note.noteId);
      }
    } catch (error) {
      console.error('Error deleting note:', error);
      alert('Failed to delete note');
    }
  };

  const handleDelete = async () => {
    if (showDeleted) {
      // Permanently delete from trash
      await handlePermanentDelete();
    } else {
      // Move to trash (soft delete)
      await handleSoftDelete();
    }
  };

  const handleRestore = async () => {
    try {
      const { put } = await import('aws-amplify/api');
      await put({
        apiName: 'notes',
        path: `/notes/${note.noteId}/restore`,
      });

      if (onRemoveFromList) {
        onRemoveFromList(note.noteId);
      }
    } catch (error) {
      console.error('Error restoring note:', error);
      alert('Failed to restore note');
    }
  };

  const handleStar = async () => {
    if (isStarring) return; // Prevent double-clicks
    setIsStarring(true);

    // Store original state for potential rollback
    const originalStarred = starred;

    try {
      // Optimistic update - update UI immediately
      setStarred((prev) => !prev);

      // If we're in favorites view and the note is being unstarred, remove it from the list
      if (showStarred && starred && onRemoveFromList) {
        onRemoveFromList(note.noteId);
      }

      const { put } = await import('aws-amplify/api');
      await put({
        apiName: 'notes',
        path: `/notes/${note.noteId}/star`,
        options: {
          body: { starred: !note.starred },
        },
      });
    } catch (error) {
      console.error('Error toggling star:', error);
      // Rollback optimistic update on error
      setStarred(originalStarred);
      // If we removed the note from favorites list, we need to add it back
      // This is a bit complex, so we'll just refetch the list on error
      if (showStarred && originalStarred) {
        // Trigger a refetch to restore the correct state
        window.location.reload();
      }
    } finally {
      setIsStarring(false);
    }
  };

  return (
    <li
      className="list-row cursor-pointer hover:bg-base-200/50 transition-colors py-5 flex-wrap gap-y-4"
      key={note.noteId}
      onClick={disableClick ? undefined : handleCardClick}
    >
      <NoteContent note={note} showDeleted={showDeleted} searchQuery={searchQuery} />

      <div className="flex-none flex justify-end space-x-2" onClick={(e) => e.stopPropagation()}>
        {showDeleted ? (
          <>
            <RestoreBtn onRestore={handleRestore} />
            <DeleteBtn confirmDelete={handleDelete} isPermanent={true} />
          </>
        ) : (
          <NormalListActions
            starred={starred}
            isStarring={isStarring}
            onStar={handleStar}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>
    </li>
  );
};

// Normal list action buttons
const NormalListActions = ({
  starred,
  isStarring,
  onStar,
  onEdit,
  onDelete,
}: {
  starred: boolean;
  isStarring: boolean;
  onStar: (e: React.MouseEvent) => void;
  onEdit: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
}) => {
  return (
    <>
      <button className={`btn btn-square btn-ghost`} onClick={onStar} disabled={isStarring}>
        {starred ? (
          <StarIconSolid className="size-5 text-yellow-500" />
        ) : (
          <StarIcon className="size-5" />
        )}
      </button>
      <button className="btn btn-square btn-ghost" onClick={onEdit}>
        <PencilSquareIcon className="size-5" />
      </button>
      <DeleteBtn confirmDelete={onDelete} isPermanent={false} />
    </>
  );
};

const RestoreBtn = ({ onRestore }: { onRestore: (e: React.MouseEvent) => void }) => {
  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-square btn-ghost">
        <ArrowUturnLeftIcon className="size-5" />
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content menu bg-base-100 rounded-box shadow-lg z-10 w-80 p-4 flex flex-col gap-2"
      >
        <div className="text-sm">Do you want to restore this note?</div>
        <button
          className="btn btn-sm btn-primary btn-outline mt-2"
          onClick={(e) => {
            e.stopPropagation();
            onRestore(e);
          }}
        >
          Confirm
        </button>
      </ul>
    </div>
  );
};

const DeleteBtn = ({
  confirmDelete,
  isPermanent,
}: {
  confirmDelete: (e: React.MouseEvent) => void;
  isPermanent: boolean;
}) => {
  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-square btn-ghost">
        <TrashIcon className="size-5" />
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content menu bg-base-100 rounded-box shadow-lg z-10 w-80 p-4 flex flex-col gap-2"
      >
        <div className="text-sm text-error flex items-center gap-2">
          <ExclamationTriangleIcon className="size-5 flex-none" />
          {isPermanent
            ? 'Do you want to permanently delete this note? This action CANNOT be undone.'
            : 'Do you want to delete this note? It will be moved to trash.'}
        </div>

        <button
          className="btn btn-sm btn-error btn-outline mt-2"
          onClick={(e) => {
            e.stopPropagation();
            confirmDelete(e);
          }}
        >
          Confirm
        </button>
      </ul>
    </div>
  );
};
