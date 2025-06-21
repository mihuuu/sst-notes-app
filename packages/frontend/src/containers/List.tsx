import AuthWrapper from '../components/AuthWrapper';
import NotesList from '../components/NotesList';

export default function List() {
  return (
    <AuthWrapper>
      <NotesList title="My Notes" showStarred={false} />
    </AuthWrapper>
  );
}
