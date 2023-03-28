export interface Book {
  id: number;
  name: string;
  author: string;
  description: string;
  photo: string;
  isChange: boolean;
  profile: {
    id: number;
    userName: string;
  };
}
