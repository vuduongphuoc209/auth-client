import { useState, useEffect } from "react";
import Context, { type IUser } from "./Context";
import { requestAuth } from "@/config/UserRequest";
import cookie from "js-cookie";

export function Provider({ children }: { children: React.ReactNode }) {
  const [dataUser, setDataUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);

  const token = cookie.get("logged");

  useEffect(() => {
    const fetchAuth = async () => {
      try {
        const res = await requestAuth();
        setDataUser(res.metadata);
      } catch (error) {
        console.error("Auth error:", error);
        setDataUser(null);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchAuth();
    } else {
      setDataUser(null);
      setLoading(false);
    }
  }, [token]);

  const isAdmin = !!dataUser?.isAdmin;

  return (
    <Context.Provider value={{ dataUser, setDataUser, loading, isAdmin }}>
      {children}
    </Context.Provider>
  );
}
