export interface BookInterface {
  readonly id: string;
  name: string;
  author: string;
  description: string;
  photo: string;
  is_change: boolean;
  is_read: boolean;
  readonly profile: {
    id: string;
    user_name: string;
  };
}
