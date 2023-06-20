export default interface Book {
  id: string;
  name: string;
  author: string;
  description: string;
  photo: string;
  is_change: boolean;
  is_read: boolean;
  profile: {
    id: string;
    user_name: string;
  };
}
