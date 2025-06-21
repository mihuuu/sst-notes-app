import { useSearchParams } from 'react-router-dom';
import AuthWrapper from '../components/AuthWrapper';
import NotesList from '../components/NotesList';

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  return (
    <AuthWrapper>
      <NotesList
        title={`Search Results${query ? ` for "${query}"` : ''}`}
        showStarred={false}
        emptyStateTitle="No search results"
        emptyStateDescription={`No notes found matching "${query}". Try a different search term.`}
        countLabel="Search results"
        showCreateButton={false}
        searchQuery={query}
      />
    </AuthWrapper>
  );
}
