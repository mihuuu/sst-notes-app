import AuthWrapper from '../components/AuthWrapper';
import NoteForm from '../components/NoteForm';

export default function CreateNote() {
  return (
    <AuthWrapper>
      <div className="container mx-auto max-w-5xl">
        <NoteForm mode="create" />
      </div>
    </AuthWrapper>
  );
}
