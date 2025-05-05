import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import '../utils/axiosConfig'; // Import global config

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
const [user, setUser] = useState(null);
const [checking, setChecking] = useState(true);

const checkAuth = async () => {
try {
const res = await axios.get('/api/check-auth');
setUser(res.data.user);
} catch {
setUser(null);
} finally {
setChecking(false);
}
};

useEffect(() => {
checkAuth();
}, []);

const login = async (email, password) => {
await axios.post('/api/login', { email, password });
await checkAuth();
};

const logout = async () => {
await axios.post('/api/logout');
setUser(null);
};

return (
<AuthContext.Provider value={{ user, login, logout, checking }}>
{children}
</AuthContext.Provider>
);
};