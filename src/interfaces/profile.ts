export interface ProfileInterfaceFull {
  readonly id: string;
  user_name: string;
  name: string;
  description: string;
  likes: string[];
  latest_readings: string[];
  photo: string;
  password: string;
  email: string;
  isActive: boolean;
  authorizations: string[];
}

export interface ProfileInterfacePublic {
  readonly id: string;
  user_name: string;
  name: string;
  description: string;
  likes: string[];
  latest_readings: string[];
  photo: string;
  email: string;
  isActive: boolean;
}
