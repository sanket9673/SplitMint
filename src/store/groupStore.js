import { create } from 'zustand';
import useAuthStore from './authStore';

const COLOR_PALETTE = ["#6366F1","#F59E0B","#10B981","#EF4444","#8B5CF6","#06B6D4"];

const useGroupStore = create((set, get) => ({
  groups: JSON.parse(localStorage.getItem('splitmint_groups') || '[]'),

  saveGroups: (groups) => {
    set({ groups });
    localStorage.setItem('splitmint_groups', JSON.stringify(groups));
  },

  createGroup: (name, participantNames) => {
    const { currentUser } = useAuthStore.getState();
    const { groups, saveGroups } = get();

    const userGroups = groups.filter(g => g.ownerId === currentUser.id);
    if (userGroups.length >= 3) {
      throw new Error('Maximum of 3 groups allowed per user.');
    }

    const availableColors = [...COLOR_PALETTE].sort(() => 0.5 - Math.random());
    
    const participants = [
      {
        id: crypto.randomUUID(),
        name: currentUser.name,
        color: availableColors[0] || COLOR_PALETTE[0],
        userId: currentUser.id
      },
      ...participantNames.map((pName, index) => ({
        id: crypto.randomUUID(),
        name: pName,
        color: availableColors[index + 1] || COLOR_PALETTE[(index + 1) % COLOR_PALETTE.length],
        userId: null
      }))
    ];

    const newGroup = {
      id: crypto.randomUUID(),
      name,
      ownerId: currentUser.id,
      participants,
      createdAt: new Date().toISOString()
    };

    saveGroups([...groups, newGroup]);
    return newGroup;
  },

  updateGroup: (groupId, name, updatedParticipants) => {
    const { groups, saveGroups } = get();
    const updatedGroups = groups.map(g => g.id === groupId ? { ...g, name, participants: updatedParticipants } : g);
    saveGroups(updatedGroups);
  },

  deleteGroup: (groupId) => {
    const { groups, saveGroups } = get();
    saveGroups(groups.filter(g => g.id !== groupId));
  }
}));

export default useGroupStore;
