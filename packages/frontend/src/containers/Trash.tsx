import NotesList from '../components/NotesList';

export default function Trash() {
  return (
    <NotesList
      title="Trash"
      showStarred={false}
      showDeleted={true}
      emptyStateTitle="No deleted notes"
      emptyStateDescription="Deleted notes will appear here."
      countLabel="Deleted notes"
      showCreateButton={false}
    />
  );
}
