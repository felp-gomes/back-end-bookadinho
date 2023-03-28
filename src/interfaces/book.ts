export default interface Book {
  id: string;
  name: string;
  author: string;
  description: string;
  photo: string;
  isChange: boolean;
  profile: {
    id: string;
    userName: string;
  };
}
