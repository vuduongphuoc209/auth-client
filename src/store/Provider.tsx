import { useState, useEffect } from "react";
import Context, { type IUser } from "./Context";
import { requestAuth } from "@/config/UserRequest";
import cookie from "js-cookie";

export function Provider({ children }: { children: React.ReactNode }) {
    const [dataUser, setDataUser] = useState<IUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState<string | undefined>(() =>
        cookie.get("logged"),
    );

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

    useEffect(() => {
        const handleAuthChange = () => {
            setToken(cookie.get("logged"));
        };

        window.addEventListener("authChanged", handleAuthChange);
        return () => {
            window.removeEventListener("authChanged", handleAuthChange);
        };
    }, []);

    const isAdmin = !!dataUser?.isAdmin;

    return (
        <Context.Provider value={{ dataUser, setDataUser, loading, isAdmin }}>
            {children}
        </Context.Provider>
    );
}
