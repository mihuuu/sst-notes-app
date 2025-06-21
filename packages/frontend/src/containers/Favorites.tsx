import AuthWrapper from '../components/AuthWrapper';
import NotesList from '../components/NotesList';

export default function Favorites() {
  return (
    <AuthWrapper>
      <NotesList
        title="Favorite Notes"
        showStarred={true}
        emptyStateTitle="No favorites"
        emptyStateDescription="Star notes to see them here."
        countLabel="Starred notes"
        showCreateButton={false}
      />
    </AuthWrapper>
  );
}
