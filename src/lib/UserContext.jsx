import React, { createContext, useContext, useState, useEffect } from 'react';
import { account } from './appwrite';
 
const UserContext = createContext();
 
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // Track loading state

 
    const refreshUser = async () => {
        setLoading(true);
        try {
            const userDetails = await account.get();
            setUser(userDetails);
        } catch (err) {
            console.error('No active session found:', err);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };
 

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userDetails = await account.get();
                setUser(userDetails); // Save user details in state
            } catch (err) {
                console.error('No active session found:', err);
                setUser(null);
            } finally {
                setLoading(false); // Set loading to false after fetching
            }
        };
 
        fetchUser();
        refreshUser();
    }, []);
 
    return (
        <UserContext.Provider value={{ user, setUser, loading, refreshUser }}>
            {children}
        </UserContext.Provider>
    );
};
 
export const useUser = () => useContext(UserContext);