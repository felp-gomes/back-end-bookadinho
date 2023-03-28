export default interface Profile {
  id: number;
  name: string;
  userName: string;
  description: string;
  likes: string[];
  changeBooks: [
    {
      id: number;
      name: string;
      photo: string;
    }
  ];
  latestReadings: string[];
  photo: string;
  password: string;
}
