export interface IUser {
  _id: string;
  fullName?: string;
  email: string;
  phone?: string;
  isAdmin?: boolean;
}

export interface IUserProfile {
  _id?: string;
  fullName?: string;
  email?: string;
  phone?: string;
}

export interface IUserHeader {
  _id?: string;
  fullName?: string;
  email?: string;
}
