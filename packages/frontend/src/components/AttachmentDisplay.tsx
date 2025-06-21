import { useState, useEffect } from 'react';
import { getUrl } from 'aws-amplify/storage';

interface AttachmentDisplayProps {
  fileName: string;
  mode?: 'view' | 'edit' | 'create';
  onRemove?: () => void;
  className?: string;
}

interface AttachmentData {
  url: string;
  type: string;
  name: string;
}

export default function AttachmentDisplay({ fileName, className = '' }: AttachmentDisplayProps) {
  const [attachmentData, setAttachmentData] = useState<AttachmentData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAttachment = async (fileName: string) => {
    if (!fileName) return;

    try {
      setIsLoading(true);
      setError(null);
      const { url } = await getUrl({
        path: ({ identityId }) => `private/${identityId}/${fileName}`,
        options: {
          validateObjectExistence: true,
        },
      });

      // Get the file extension to determine type
      const fileExtension = fileName.split('.').pop()?.toLowerCase();
      let fileType = 'application/octet-stream';

      // Determine MIME type based on file extension
      if (fileExtension) {
        const mimeTypes: Record<string, string> = {
          pdf: 'application/pdf',
          jpg: 'image/jpeg',
          jpeg: 'image/jpeg',
          png: 'image/png',
          gif: 'image/gif',
          webp: 'image/webp',
          txt: 'text/plain',
          doc: 'application/msword',
          docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          xls: 'application/vnd.ms-excel',
          xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          ppt: 'application/vnd.ms-powerpoint',
          pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        };
        fileType = mimeTypes[fileExtension] || 'application/octet-stream';
      }

      setAttachmentData({
        url: url.toString(),
        type: fileType,
        name: fileName,
      });
    } catch (error) {
      console.error('Error loading attachment:', error);
      setError('Failed to load attachment');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (fileName) {
      loadAttachment(fileName);
    }
  }, [fileName]);

  const handleDownload = () => {
    if (attachmentData) {
      const link = document.createElement('a');
      link.href = attachmentData.url;
      link.download = attachmentData.name;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const isImage = (mimeType: string) => mimeType.startsWith('image/');

  if (!fileName) {
    return null;
  }

  return (
    <div className={`form-control ${className}`}>
      <label className="label">
        <span className="label-text font-semibold">Attachment</span>
      </label>
      <div className="p-4 bg-base-50 border border-base-200 rounded-lg">
        {isLoading ? (
          <div className="flex items-center gap-2">
            <span className="loading loading-spinner loading-sm"></span>
            <span>Loading attachment...</span>
          </div>
        ) : error ? (
          <div className="flex items-center gap-2 text-error">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
              />
            </svg>
            <span>{error}</span>
          </div>
        ) : attachmentData ? (
          <div className="space-y-4">
            {/* File Info */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 text-info"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                  />
                </svg>
                <span className="font-medium">{attachmentData.name}</span>
              </div>
              <div className="flex gap-2">
                <button onClick={handleDownload} className="btn btn-sm btn-outline btn-primary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                    />
                  </svg>
                  Download
                </button>
              </div>
            </div>

            {/* File Preview */}
            {isImage(attachmentData.type) ? (
              <div className="mt-4">
                <img
                  src={attachmentData.url}
                  alt={attachmentData.name}
                  className="max-w-30 h-auto rounded-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </div>
            ) : (
              <div className="mt-4 p-4 bg-base-200 rounded-lg">
                <p className="text-sm text-base-content/60">
                  Preview not available for this file type. Click download to access the file.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2 text-error">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
              />
            </svg>
            <span>Failed to load attachment</span>
          </div>
        )}
      </div>
    </div>
  );
}
