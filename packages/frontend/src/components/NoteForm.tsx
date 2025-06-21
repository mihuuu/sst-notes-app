import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadData } from 'aws-amplify/storage';
import { post, put } from 'aws-amplify/api';
import ReactMarkdown from 'react-markdown';
import { useFormFields, useLoadingState } from '../utils/hooks';
import AttachmentDisplay from './AttachmentDisplay';
import TagInput from './TagInput';
import type { Note } from '../types/note';

interface NoteFormProps {
  mode: 'create' | 'edit';
  noteId?: string;
  originalNote?: Note | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function NoteForm({
  mode,
  noteId,
  originalNote,
  onSuccess,
  onCancel,
}: NoteFormProps) {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data, errors, handleChange, setErrors } = useFormFields({
    title: originalNote?.title || '',
    content: originalNote?.content || '',
  });

  const [tags, setTags] = useState<string[]>(originalNote?.tags || []);

  const {
    loading: isSubmitting,
    error: submitError,
    setLoading: setIsSubmitting,
    setError: setSubmitError,
    clearError,
  } = useLoadingState();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [currentAttachment, setCurrentAttachment] = useState<string>(
    originalNote?.attachment || ''
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [uploadTask, setUploadTask] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const uploadFileToS3 = async (file: File): Promise<string> => {
    const fileName = `${Date.now()}-${file.name}`;

    const task = uploadData({
      path: ({ identityId }) => `private/${identityId}/${fileName}`,
      data: file,
      options: {
        onProgress: ({ transferredBytes, totalBytes }) => {
          if (totalBytes) {
            setUploadProgress(Math.round((transferredBytes / totalBytes) * 100));
          }
        },
      },
    });
    setUploadTask(task);
    await task.result;
    return fileName;
  };

  const handleCancelUpload = () => {
    if (uploadTask) {
      uploadTask.cancel();
      setUploadTask(null);
    }
    setSelectedFile(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveAttachment = () => {
    setCurrentAttachment('');
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    clearError();
    setErrors({});

    try {
      let attachmentUrl = currentAttachment;

      // Upload file to S3 if selected
      if (selectedFile) {
        attachmentUrl = await uploadFileToS3(selectedFile);
      }

      // Prepare note data
      const noteData = {
        title: data.title,
        content: data.content,
        attachment: attachmentUrl,
        tags: tags,
      };

      let response;
      if (mode === 'create') {
        // Create note via API
        response = await post({
          apiName: 'notes',
          path: '/notes',
          options: {
            body: noteData,
          },
        });
      } else {
        // Update note via API
        response = await put({
          apiName: 'notes',
          path: `/notes/${noteId}`,
          options: {
            body: noteData,
          },
        });
      }

      const responseData = await response.response;
      if (responseData.statusCode === 200) {
        if (onSuccess) {
          onSuccess();
        } else if (mode === 'create') {
          navigate('/list');
        }
      } else {
        throw new Error(`Failed to ${mode} note`);
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('Upload cancelled by user.');
      } else {
        console.error(`Error ${mode}ing note:`, error);
        setSubmitError(error instanceof Error ? error.message : 'An unexpected error occurred');
      }
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setUploadProgress(0);
    setErrors({});
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onCancel) {
      onCancel();
    } else {
      navigate('/list');
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body text-base-content">
        <h2 className="card-title text-2xl font-bold mb-6">
          {mode === 'create' ? 'Create New Note' : 'Edit Note'}
        </h2>

        {submitError && (
          <div className="alert alert-error mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{submitError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Input */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Title</span>
            </label>
            <input
              type="text"
              name="title"
              value={data.title}
              onChange={handleChange}
              placeholder="Enter note title..."
              className={`input input-bordered w-full ${errors.title ? 'input-error' : ''}`}
              required
            />
            {errors.title && (
              <label className="label">
                <span className="label-text-alt text-error">{errors.title}</span>
              </label>
            )}
          </div>

          {/* Tags Input */}
          <TagInput tags={tags} onChange={setTags} />

          {/* Content Input with Preview Toggle */}
          <div className="form-control">
            <div className="flex justify-between items-center mb-2">
              <label className="label">
                <span className="label-text font-semibold">Content (Markdown supported)</span>
              </label>
              <div className="btn-group">
                <label className="label">
                  <input
                    type="checkbox"
                    className="toggle"
                    checked={isPreviewMode}
                    onChange={() => setIsPreviewMode(!isPreviewMode)}
                  />
                  Preview
                </label>
              </div>
            </div>

            {!isPreviewMode ? (
              <textarea
                name="content"
                value={data.content}
                onChange={handleChange}
                placeholder="Write your note content here..."
                className={`textarea h-64 w-full ${errors.content ? 'textarea-error' : ''}`}
                required
              />
            ) : (
              <div className="p-4 overflow-auto bg-base-50">
                {data.content ? (
                  <div className="prose prose-sm max-w-none">
                    <ReactMarkdown>{data.content}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-base-content/60 italic">No content to preview</p>
                )}
              </div>
            )}

            {errors.content && (
              <label className="label">
                <span className="label-text-alt text-error">{errors.content}</span>
              </label>
            )}
          </div>

          {/* Current Attachment Display (Edit Mode) */}
          {mode === 'edit' && currentAttachment && !selectedFile && (
            <AttachmentDisplay
              fileName={currentAttachment}
              mode="edit"
              onRemove={handleRemoveAttachment}
            />
          )}

          {/* File Upload */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold mb-2">
                {mode === 'edit' && currentAttachment
                  ? 'Replace Attachment'
                  : 'Attachment (Optional)'}
              </span>
            </label>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              className="file-input file-input-bordered w-full"
              accept="image/*,.pdf,.doc,.docx,.txt"
            />
            {selectedFile && (
              <label className="label mt-2">
                <span className="label-text-alt text-info text-sm">
                  Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                </span>
                <button
                  type="button"
                  onClick={handleCancelUpload}
                  className="btn rounded-full btn-xs btn-ghost"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="size-5"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </label>
            )}
          </div>

          {/* Upload Progress */}
          {uploadProgress > 0 && uploadProgress <= 100 && (
            <div className="form-control">
              <div className="flex justify-between items-center">
                <label className="label py-0">
                  <span className="label-text">Uploading file...</span>
                </label>
              </div>
              <progress
                className="progress progress-primary"
                value={uploadProgress}
                max="100"
              ></progress>
            </div>
          )}

          {/* Action Buttons */}
          <div className="card-actions justify-end">
            <button
              type="button"
              onClick={handleCancel}
              className="btn btn-outline"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  {mode === 'create' ? 'Creating...' : 'Saving...'}
                </>
              ) : mode === 'create' ? (
                'Create Note'
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
