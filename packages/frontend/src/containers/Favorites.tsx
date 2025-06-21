import AuthWrapper from '../components/AuthWrapper';
import NotesList from '../components/NotesList';

export default function Favorites() {
  return (
    <AuthWrapper>
      <NotesList
        title="Favorite Notes"
        filterStarred={true}
        emptyStateTitle="No favorites"
        emptyStateDescription="Star notes to see them here."
        countLabel="Starred notes"
        showCreateButton={false}
      />
    </AuthWrapper>
  );
}
