import React, { useState, useContext, useEffect, useCallback } from 'react';
import coverImg from "./images/cover_not_found.jpg";
import AuthService from './Login/auth';

const AppContext = React.createContext();

const URL = "https://www.googleapis.com/books/v1/volumes?q=";

const getStoredUser = () => {
    try {
        return AuthService.getUser() || null;
    } catch (error) {
        console.error('Error reading user from storage:', error);
        return null;
    }
};

const getRecentlyViewed = () => {
    try {
        const stored = localStorage.getItem('recentlyViewed');
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error('Error reading recently viewed books:', error);
        return [];
    }
};

const AppProvider = ({ children }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [resultTitle, setResultTitle] = useState("");
    const [user, setUser] = useState(getStoredUser);
    const [recentlyViewed, setRecentlyViewed] = useState(getRecentlyViewed);
    const [isInitialized, setIsInitialized] = useState(false);
    const [authError, setAuthError] = useState(null);
    const [debugInfo, setDebugInfo] = useState({ lastApiCall: '', apiResponse: null });

    // ✅ Initialize auth state on load
    useEffect(() => {
        const initAuth = async () => {
            try {
                const result = await AuthService.getCurrentUser();
                if (result?.success) {
                    setUser(result.data.user);
                } else {
                    AuthService.clearStorage();
                    setUser(null);
                }
            } catch (error) {
                console.error('Error initializing auth:', error);
                AuthService.clearStorage();
                setUser(null);
            } finally {
                setIsInitialized(true);
            }
        };

        initAuth();
    }, []);

    // ✅ Store recently viewed books in localStorage
    useEffect(() => {
        localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
    }, [recentlyViewed]);

    // ✅ Add to recently viewed list
    const addToRecentlyViewed = useCallback((book) => {
        setRecentlyViewed((prev) => {
            const filtered = prev.filter((b) => b.id !== book.id);
            return [book, ...filtered].slice(0, 20);
        });
    }, []);

    // ✅ Login User
    const login = useCallback(async (username, password) => {
        setAuthError(null);
        try {
            const result = await AuthService.login(username, password);
            if (result?.success) {
                setUser(result.data.user);
                return { success: true };
            }
            const errorMsg = result.error || "Login failed";
            setAuthError(errorMsg);
            return { success: false, error: errorMsg };
        } catch (error) {
            console.error('Login error:', error);
            const errorMsg = 'Login failed. Try again.';
            setAuthError(errorMsg);
            return { success: false, error: errorMsg };
        }
    }, []);

    // ✅ Register User
    const register = useCallback(async (email, username, password) => {
        setAuthError(null);
        try {
            const result = await AuthService.register(email, username, password);
            if (result?.success) {
                setUser(result.data.user);
                return { success: true };
            }
            const errorMsg = result.error || "Registration failed";
            setAuthError(errorMsg);
            return { success: false, error: errorMsg };
        } catch (error) {
            console.error('Registration error:', error);
            const errorMsg = 'Registration failed. Try again.';
            setAuthError(errorMsg);
            return { success: false, error: errorMsg };
        }
    }, []);

    // ✅ Logout User
    const logout = useCallback(async () => {
        try {
            await AuthService.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setUser(null);
            setRecentlyViewed([]);
        }
    }, []);

    // ✅ Search Books - Modified with more debugging
    useEffect(() => {
        if (!searchTerm) {
            console.log("Search term is empty, skipping API call");
            return;
        }
        
        console.log("Starting search with term:", searchTerm);
        
        let isMounted = true;
        const fetchBooks = async () => {
            setLoading(true);
            try {
                // Handle either string or object format of searchTerm
                const query = typeof searchTerm === 'string' ? searchTerm : searchTerm.query;
                const filters = typeof searchTerm === 'object' ? searchTerm.filters : {};
                
                // Build URL with query parameters
                let apiUrl = `${URL}${encodeURIComponent(query)}&maxResults=40`;
                
                // Add filters as query parameters if they exist
                if (filters) {
                    if (filters.orderBy && filters.orderBy !== 'relevance') {
                        apiUrl += `&orderBy=${filters.orderBy}`;
                    }
                    if (filters.printType && filters.printType !== 'all') {
                        apiUrl += `&printType=${filters.printType}`;
                    }
                    if (filters.maxResults) {
                        apiUrl += `&maxResults=${filters.maxResults}`;
                    }
                }
                
                console.log("Fetching books from:", apiUrl);
                setDebugInfo(prev => ({ ...prev, lastApiCall: apiUrl }));
                
                const response = await fetch(apiUrl);
                const data = await response.json();
                
                console.log("API Response status:", response.status);
                console.log("API Response data:", data);
                setDebugInfo(prev => ({ ...prev, apiResponse: data }));
                
                if (data?.items) {
                    const newBooks = data.items.map((item) => {
                        const { volumeInfo } = item;
                        return {
                            id: item.id,
                            title: volumeInfo?.title || "Unknown Title",
                            author: volumeInfo?.authors ? volumeInfo.authors.join(", ") : "Unknown Author",
                            coverImage: volumeInfo?.imageLinks?.thumbnail?.replace('http://', 'https://') || "",
                            description: volumeInfo?.description || "No description available",
                            averageRating: volumeInfo?.averageRating || 0,
                            ratingsCount: volumeInfo?.ratingsCount || 0,
                            genre: volumeInfo?.categories || []
                        };
                    });
                    
                    console.log(`Processed ${newBooks.length} books`, newBooks);
                    
                    if (isMounted) {
                        setBooks(newBooks);
                        setResultTitle(`Search results for "${query}"`);
                        console.log("Updated books state with", newBooks.length, "items");
                    }
                } else {
                    if (isMounted) {
                        console.log("No books found in response");
                        setBooks([]);
                        setResultTitle("No Books Found!");
                    }
                }
            } catch (error) {
                console.error('Error fetching books:', error);
                if (isMounted) {
                    setBooks([]);
                    setResultTitle("Failed to fetch books. Please try again.");
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        const timeoutId = setTimeout(() => {
            fetchBooks();
        }, 500);

        return () => {
            isMounted = false;
            clearTimeout(timeoutId);
        };
    }, [searchTerm]);

    return (
        <AppContext.Provider value={{
            loading,
            books,
            setBooks,
            searchTerm,
            setSearchTerm,
            resultTitle,
            setResultTitle,
            user,
            setUser,
            login,
            register,
            logout,
            authError,
            setAuthError,
            recentlyViewed,
            addToRecentlyViewed,
            isInitialized,
            debugInfo
        }}>
            {children}
        </AppContext.Provider>
    );
};

const useGlobalContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useGlobalContext must be used within an AppProvider');
    }
    return context;
};

export { AppContext, AppProvider, useGlobalContext };