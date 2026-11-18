
import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const [token, setToken] = useState(localStorage.getItem('token') || null);

    // Permisos del usuario autenticado
    const [permisos, setPermisos] = useState([]);

    // Control de carga de permisos
    const [permisosCargando, setPermisosCargando] = useState(
        !!localStorage.getItem('token')
    );

    // Consultar permisos del usuario en Laravel
    const cargarPermisos = useCallback(async () => {

        if (!localStorage.getItem('token')) {
            setPermisos([]);
            setPermisosCargando(false);
            return;
        }

        try {
            setPermisosCargando(true);

            const response = await api.get('/usuario/permisos');

            const permisosUsuario = response.data.data?.permisos || [];

            setPermisos(permisosUsuario);

        } catch (error) {
            console.error('Error al cargar los permisos:', error);

            setPermisos([]);

        } finally {
            setPermisosCargando(false);
        }

    }, []);

    // Comprobar si el usuario tiene un permiso específico
    const tienePermiso = (permiso) => {
        return permisos.includes(permiso);
    };

    // Cargar permisos cuando exista una sesión
    useEffect(() => {

        if (token) {
            cargarPermisos();
        } else {
            setPermisos([]);
            setPermisosCargando(false);
        }

    }, [token, cargarPermisos]);

    // INICIAR SESIÓN
    const login = async (credentials) => {
        try {
            const response = await api.post('/login', credentials);

            const { access_token, user: userData } = response.data;

            if (!access_token || !userData) {
                throw new Error('Respuesta de autenticación inválida.');
            }

            localStorage.setItem('token', access_token);
            localStorage.setItem('user', JSON.stringify(userData));

            setToken(access_token);
            setUser(userData);

            return { success: true };

        } catch (error) {
            throw error;
        }
    };

    // REGISTRAR USUARIO
    const register = async (userData) => {
        try {
            const response = await api.post('/register', userData);

            if (response.data.access_token) {

                const { access_token, user: newUser } = response.data;

                localStorage.setItem('token', access_token);
                localStorage.setItem('user', JSON.stringify(newUser));

                setToken(access_token);
                setUser(newUser);
            }

            return response.data;

        } catch (error) {
            throw error;
        }
    };

    // CERRAR SESIÓN
    const logout = async () => {
        try {
            await api.post('/logout');

        } catch (e) {
            console.error('Error al cerrar sesión', e);

        } finally {

            localStorage.removeItem('token');
            localStorage.removeItem('user');

            setToken(null);
            setUser(null);
            setPermisos([]);
            setPermisosCargando(false);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                login,
                register,
                logout,

                // Gestión de permisos
                permisos,
                permisosCargando,
                tienePermiso,
                cargarPermisos
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};












// import { createContext, useState, useContext } from 'react';
// import api from '../services/api';

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//     const [user, setUser] = useState(() => {
//         const savedUser = localStorage.getItem('user');
//         return savedUser ? JSON.parse(savedUser) : null;
//     });
//     const [token, setToken] = useState(localStorage.getItem('token') || null);

// const login = async (credentials) => {
//     try {
//         const response = await api.post('/login', credentials);

//         const { access_token, user: userData } = response.data;

//         if (!access_token || !userData) {
//             throw new Error('Respuesta de autenticación inválida.');
//         }

//         localStorage.setItem('token', access_token);
//         localStorage.setItem('user', JSON.stringify(userData));

//         setToken(access_token);
//         setUser(userData);

//         return { success: true };

//     } catch (error) {
//         throw error;
//     }
// };

//     // En src/context/AuthContext.jsx
//     const register = async (userData) => {
//         try {
//             const response = await api.post('/register', userData);

//             // Si Laravel retorna token o datos de usuario directamente
//             if (response.data.access_token) {
//                 const { access_token, user: newUser } = response.data;
//                 localStorage.setItem('token', access_token);
//                 localStorage.setItem('user', JSON.stringify(newUser));
//                 setToken(access_token);
//                 setUser(newUser);
//             }

//             return response.data;
//         } catch (error) {
//             // Relanzamos el error para que caiga en el catch del componente
//             throw error;
//         }
//     };

//     const logout = async () => {
//         try {
//             await api.post('/logout');
//         } catch (e) {
//             console.error("Error al cerrar sesión", e);
//         } finally {
//             localStorage.removeItem('token');
//             localStorage.removeItem('user'); // <-- Limpiar también el usuario
//             setToken(null);
//             setUser(null);
//         }
//     };

//     return (
//         <AuthContext.Provider value={{ user, token, login, register, logout }}>
//             {children}
//         </AuthContext.Provider>
//     );
// };

// export const useAuth = () => {
//     return useContext(AuthContext);
// };