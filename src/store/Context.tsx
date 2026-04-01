import { createContext, type Dispatch, type SetStateAction } from "react";

export interface IUser {
  _id?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  isAdmin?: boolean;
}

export interface StoreContextValue {
  dataUser: IUser | null;
  setDataUser: Dispatch<SetStateAction<IUser | null>>;
  loading: boolean;
  isAdmin: boolean;
}

const Context = createContext<StoreContextValue | null>(null);

export default Context;
