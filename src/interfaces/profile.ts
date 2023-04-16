export default interface Profile {
  readonly id: string;
  user_name: string;
  name: string;
  description: string;
  likes: string[];
  change_books: {
    id: string;
    name: string;
    photo: string;
  }[];
  latest_readings: string[];
  photo: string;
  password: string;
  email: string;
  authorizations: string[];
}
