import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { get } from 'aws-amplify/api';
import ReactMarkdown from 'react-markdown';
import AuthWrapper from '../components/AuthWrapper';
import NoteForm from '../components/NoteForm';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorDisplay from '../components/ErrorDisplay';
import AttachmentDisplay from '../components/AttachmentDisplay';
import { useLoadingState } from '../utils/hooks';
import { formatDate } from '../utils';
import type { Note } from '../types/note';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { TagIcon } from '@heroicons/react/24/outline';

export default function ViewNote() {
  const { noteId } = useParams<{ noteId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const {
    loading: isLoading,
    error: loadError,
    setLoading: setIsLoading,
    setError: setLoadError,
    clearError: clearLoadError,
  } = useLoadingState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [noteData, setNoteData] = useState<Note | null>(null);
  const { tags } = noteData || {};

  // Check if we should start in edit mode
  useEffect(() => {
    const editParam = searchParams.get('edit');
    if (editParam === 'true') {
      setIsEditing(true);
    }
  }, [searchParams]);

  const fetchNote = async () => {
    if (!noteId) return;

    try {
      setIsLoading(true);
      clearLoadError();
      const response = await get({
        apiName: 'notes',
        path: `/notes/${noteId}`,
      });

      const responseData = await response.response;
      if (responseData.statusCode === 200) {
        const noteData = await responseData.body.json();
        const note = noteData as unknown as Note;
        setNoteData(note);
      } else {
        throw new Error('Failed to fetch note');
      }
    } catch (err) {
      console.error('Error fetching note:', err);
      setLoadError('Failed to load note');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNote();
  }, [noteId]);

  const handleEditSuccess = () => {
    setIsEditing(false);
    fetchNote(); // Refresh the note data
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    navigate(-1);
  };

  // Show loading while fetching note
  if (isLoading) {
    return <LoadingSpinner message="Loading note..." />;
  }

  // Show error if failed to load note
  if (loadError) {
    return <ErrorDisplay error={loadError} onRetry={fetchNote} />;
  }

  if (!noteData) {
    return <ErrorDisplay error="Note not found" onRetry={() => navigate('/list')} />;
  }

  // If in edit mode, show the form
  if (isEditing) {
    return (
      <AuthWrapper>
        <div className="container mx-auto p-10 max-w-5xl overflow-auto">
          <NoteForm
            mode="edit"
            noteId={noteId}
            originalNote={noteData}
            onSuccess={handleEditSuccess}
            onCancel={handleEditCancel}
          />
        </div>
      </AuthWrapper>
    );
  }

  // Show note content in view mode
  return (
    <AuthWrapper>
      <div className="container mx-auto max-w-5xl">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex justify-between items-center mb-6">
              <h1 className="card-title text-2xl font-bold">{noteData.title || 'Untitled'}</h1>
              <div className="flex gap-2">
                <button
                  className={`btn btn-square btn-ghost`}
                  title={noteData.starred ? 'Unstar note' : 'Star note'}
                  disabled
                >
                  {noteData.starred && <StarIconSolid className="size-5 text-yellow-500" />}
                </button>
                <button
                  onClick={() => {
                    setIsEditing(true);
                  }}
                  className="btn btn-outline btn-primary"
                >
                  Edit
                </button>
                <button onClick={() => navigate(-1)} className="btn btn-outline">
                  Go Back
                </button>
              </div>
            </div>

            {/* Note Metadata */}
            <div className="text-sm text-base-content/60 mb-4">
              Created: {formatDate(noteData.createdAt)}
              {noteData.updatedAt && noteData.updatedAt !== noteData.createdAt && (
                <span className="ml-4">Updated: {formatDate(noteData.updatedAt)}</span>
              )}
            </div>

            {/* Tags */}
            {tags && tags.length > 0 && (
              <div className="form-control mb-6">
                <label className="label">
                  <span className="label-text font-semibold mb-2">Tags</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <button
                      key={index}
                      className="badge badge-primary badge-outline gap-1 px-3 py-2"
                    >
                      <TagIcon className="size-3" />
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Content */}
            <div className="form-control mb-6">
              <label className="label">
                <span className="label-text font-semibold mb-2">Content</span>
              </label>
              <div className="p-4 bg-base-50 border border-base-200 rounded-lg min-h-64">
                {noteData.content ? (
                  <div className="prose prose-sm max-w-none">
                    <ReactMarkdown>{noteData.content}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-base-content/60 italic">No content</p>
                )}
              </div>
            </div>

            {/* Attachment Display */}
            {noteData.attachment && (
              <AttachmentDisplay fileName={noteData.attachment} mode="view" className="mb-6" />
            )}
          </div>
        </div>
      </div>
    </AuthWrapper>
  );
}
