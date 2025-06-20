# Reusable Components

This directory contains reusable components that eliminate repetitive code across the application.

## AuthWrapper

Handles authentication checks and loading states for any page that requires authentication.

### Usage

```tsx
import AuthWrapper from '../components/AuthWrapper';

// For pages that require authentication (default)
function MyProtectedPage() {
  return (
    <AuthWrapper>
      <div>Your protected content here</div>
    </AuthWrapper>
  );
}

// For pages that don't require authentication
function MyPublicPage() {
  return (
    <AuthWrapper requireAuth={false}>
      <div>Your public content here</div>
    </AuthWrapper>
  );
}

// Custom redirect path
function MyCustomPage() {
  return (
    <AuthWrapper redirectTo="/custom-login">
      <div>Your content here</div>
    </AuthWrapper>
  );
}
```

### Props

- `children`: ReactNode - The content to render
- `requireAuth`: boolean (default: true) - Whether authentication is required
- `redirectTo`: string (default: '/login') - Where to redirect if not authenticated

## LoadingSpinner

Displays a consistent loading spinner with customizable message and size.

### Usage

```tsx
import LoadingSpinner from '../components/LoadingSpinner';

function MyComponent() {
  if (loading) {
    return <LoadingSpinner message="Loading data..." size="lg" />;
  }

  return <div>Your content</div>;
}
```

### Props

- `message`: string (default: 'Loading...') - The message to display
- `size`: 'sm' | 'md' | 'lg' | 'xl' (default: 'lg') - The size of the spinner

## ErrorDisplay

Displays error messages with optional retry functionality.

### Usage

```tsx
import ErrorDisplay from '../components/ErrorDisplay';

function MyComponent() {
  if (error) {
    return <ErrorDisplay error={error} onRetry={fetchData} retryText="Try Again" />;
  }

  return <div>Your content</div>;
}
```

### Props

- `error`: string - The error message to display
- `onRetry`: () => void (optional) - Function to call when retry button is clicked
- `retryText`: string (default: 'Try Again') - Text for the retry button

## AttachmentDisplay

Displays file attachments with preview, download, and view functionality. Supports images, PDFs, and other file types.

### Usage

```tsx
import AttachmentDisplay from '../components/AttachmentDisplay';

// View mode (default)
function ViewNote() {
  return <AttachmentDisplay fileName="1703123456789-document.pdf" mode="view" />;
}

// Edit mode with remove functionality
function EditNote() {
  const handleRemove = () => {
    // Handle attachment removal
  };

  return (
    <AttachmentDisplay fileName="1703123456789-document.pdf" mode="edit" onRemove={handleRemove} />
  );
}

// With custom styling
function CustomNote() {
  return <AttachmentDisplay fileName="1703123456789-image.jpg" mode="view" className="mb-4" />;
}
```

### Props

- `fileName`: string - The filename of the attachment (required)
- `mode`: 'view' | 'edit' | 'create' (default: 'view') - Display mode
- `onRemove`: () => void (optional) - Function called when remove button is clicked (only in edit mode)
- `className`: string (optional) - Additional CSS classes

### Features

- **File Type Detection**: Automatically detects file type based on extension
- **Image Preview**: Displays images inline with proper sizing
- **PDF Preview**: Embeds PDFs in an iframe for viewing
- **Download**: Provides download functionality for all file types
- **View in New Tab**: Opens files in a new tab for viewing
- **Remove Option**: In edit mode, allows removing existing attachments
- **Loading States**: Shows loading spinner while fetching attachment
- **Error Handling**: Displays error messages if attachment fails to load
- **Responsive Design**: Works well on different screen sizes

### Supported File Types

- **Images**: jpg, jpeg, png, gif, webp
- **Documents**: pdf, txt, doc, docx, xls, xlsx, ppt, pptx
- **Others**: Any file type (shows generic preview message)

## Custom Hooks

### useLoadingState

Manages loading and error states for async operations.

### Usage

```tsx
import { useLoadingState } from '../utils/hooks';

function MyComponent() {
  const { loading, error, setLoading, setError, clearError } = useLoadingState();

  const fetchData = async () => {
    try {
      setLoading(true);
      clearError();
      // Your async operation here
      const data = await api.getData();
      setData(data);
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay error={error} onRetry={fetchData} />;

  return <div>Your content</div>;
}
```

### useFormFields

Manages form state with validation.

### Usage

```tsx
import { useFormFields } from '../utils/hooks';

function MyForm() {
  const { data, errors, handleChange, setErrors } = useFormFields({
    name: '',
    email: '',
  });

  return (
    <form>
      <input
        name="name"
        value={data.name}
        onChange={handleChange}
        className={errors.name ? 'input-error' : ''}
      />
      {errors.name && <span className="error">{errors.name}</span>}
    </form>
  );
}
```

## Benefits

1. **DRY Principle**: No more repetitive authentication and loading logic
2. **Consistency**: All pages have the same loading and error states
3. **Maintainability**: Changes to auth logic only need to be made in one place
4. **Type Safety**: Full TypeScript support with proper types
5. **Flexibility**: Components can be customized with props
