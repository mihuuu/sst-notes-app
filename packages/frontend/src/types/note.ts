export interface Note {
  noteId: string;
  title: string;
  content: string;
  attachment: string;
  createdAt: number;
  starred?: boolean;
  deleted?: boolean;
  deletedAt?: number;
}
