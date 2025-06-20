import AuthWrapper from '../components/AuthWrapper';
import NoteForm from '../components/NoteForm';

export default function CreateNote() {
  return (
    <AuthWrapper>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <NoteForm mode="create" />
      </div>
    </AuthWrapper>
  );
}
