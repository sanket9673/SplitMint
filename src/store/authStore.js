import { create } from 'zustand';

const hashPassword = async (password) => {
  return btoa(password);
};

const useAuthStore = create((set, get) => ({
  currentUser: null,
  users: JSON.parse(localStorage.getItem('splitmint_users') || '[]'),
  
  initializeAuth: () => {
    const session = localStorage.getItem('splitmint_session');
    if (session) {
      set({ currentUser: JSON.parse(session) });
    }
  },

  register: async (name, email, password) => {
    const { users } = get();
    if (users.find(u => u.email === email)) {
      throw new Error('Email already registered');
    }

    const newUser = {
      id: crypto.randomUUID(),
      name,
      email,
      passwordHash: await hashPassword(password),
      createdAt: new Date().toISOString()
    };

    const updatedUsers = [...users, newUser];
    localStorage.setItem('splitmint_users', JSON.stringify(updatedUsers));
    
    set({ users: updatedUsers, currentUser: newUser });
    localStorage.setItem('splitmint_session', JSON.stringify(newUser));
  },

  login: async (email, password) => {
    const { users } = get();
    const hash = await hashPassword(password);
    const user = users.find(u => u.email === email && u.passwordHash === hash);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }

    set({ currentUser: user });
    localStorage.setItem('splitmint_session', JSON.stringify(user));
  },

  logout: () => {
    set({ currentUser: null });
    localStorage.removeItem('splitmint_session');
  }
}));

export default useAuthStore;
