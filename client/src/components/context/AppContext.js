import React, { createContext, useState, useEffect } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [groomer, setGroomer] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkSession = async () => {
        try {
            const res = await fetch("/check_session", {
                credentials: "include",
            });
            if (res.ok) {
                const data = await res.json();
                setGroomer(data);
            } else {
                setGroomer(null);
            }
        } catch (error) {
            console.error("Error checking session:", error);
            setGroomer(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (employee_number, password) => {
        const res = await fetch("/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ employee_number, password }),
        });

        if (res.ok) {
            const data = await res.json();
            setGroomer(data);
            return true;
        } else {
            const error = await res.json();
            return error;
        }
    };

    const signup = async (name, employee_number, phone_number, password) => {
        const res = await fetch("/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ name, employee_number, phone_number, password }),
        });
        
        if (res.ok) {
            const data = await res.json();
            setGroomer(data);
            return true;
        } else {
            const error = await res.json();
            return error;
        }
    };

    const logout = async () => {
        await fetch("/logout", {
            method: "DELETE",
            credentials: "include",
        });
        setGroomer(null);
    };

    useEffect(() => {
        checkSession();
    }, []);

    return (
        <AppContext.Provider
        value={{ groomer, loading, login, signup, logout }}
        >
            {children}
        </AppContext.Provider>
    );
};
