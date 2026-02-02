export default interface Movie {
  _id: string;
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_count: number;

  original_language?: string;
  tagline?: string;

  genres: { id: number; name: string }[];
  casts: {
    id: number;
    name: string;
    profile_path: string;
    character: string;
    credit_id: string;
  }[];

  vote_average: number;
  runtime: number;

  createdAt?: string;
  updatedAt?: string;
}
