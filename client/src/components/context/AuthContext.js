import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [groomer, setGroomer] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/check_session", {
            credentials: "include",
        })
        .then((res) => {
            if (res.ok) {
                return res.json();
            }
            throw new Error("No active session");
        })
        .then((groomerData) => {
            setGroomer(groomerData);
        })
        .catch(() => {
            setGroomer(null);
        })
        .finally(() => {
            setLoading(false);
        });
    }, []);

    function login(groomerData) {
        setGroomer(groomerData);
    }

    function logout() {
        fetch("/logout", {
            method: "DELETE",
            credentials: "include",
        }).then(() => {
            setGroomer(null);
        });
    }

    const value = {
        groomer,
        setGroomer,
        login,
        logout,
        loading,
        isAuthenticated: !!groomer,
    };

    return (
        <AuthContext.Provider value={value}>
            { !loading && children }
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used in AuthProvider")
    }
    return context;
}
