// Storage Service - Handles localStorage for Safety Audit data
const STORAGE_KEY = 'kineticguard_audit';

export const storage = {
  // Save audit data
  saveAudit: (data) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Failed to save audit data:', error);
      return false;
    }
  },

  // Load audit data
  loadAudit: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to load audit data:', error);
      return null;
    }
  },

  // Clear audit data
  clearAudit: () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      return true;
    } catch (error) {
      console.error('Failed to clear audit data:', error);
      return false;
    }
  },

  // Check if audit exists
  hasAudit: () => {
    return localStorage.getItem(STORAGE_KEY) !== null;
  }
};

export default storage;
