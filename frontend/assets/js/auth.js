/**
 * BALSONS HR & PAYROLL MANAGER
 * Authentication & Role-Based Access Control (RBAC)
 */

const BalsonsHrAuth = {
  // Pre-configured test accounts for immediate verification
  ACCOUNTS: [
    { username: 'super.admin', role: 'Super Admin', fullName: 'BALSONS Executive Administrator', pass: 'Admin@2026!' },
    { username: 'hr.head', role: 'HR Head', fullName: 'Priyanka Senapati (HR Lead)', pass: 'Hr@2026!' },
    { username: 'pm.jtrwf', role: 'Project Manager', fullName: 'Satish Chandra (PM - JTRWF)', pass: 'Pm@2026!' },
    { username: 'sup.bay3', role: 'Area Supervisor', fullName: 'Dilip Rout (Supervisor Bay-3)', pass: 'Sup@2026!' },
    { username: 'emp.ramesh', role: 'Employee', fullName: 'Ramesh Kumar (Rigger Lead)', pass: 'Emp@2026!' }
  ],

  login: async function(username, password) {
    const matched = this.ACCOUNTS.find(a => a.username.toLowerCase() === username.toLowerCase() && a.pass === password);
    if (matched) {
      const session = {
        token: 'HR-TOKEN-' + Date.now(),
        username: matched.username,
        fullName: matched.fullName,
        role: matched.role,
        loginAt: new Date().toISOString()
      };
      localStorage.setItem(BALSONS_HR_CONFIG.STORAGE_SESSION_KEY, JSON.stringify(session));
      return { success: true, user: session };
    }
    return { success: false, message: 'Invalid credentials. Please verify username and password.' };
  },

  getSession: function() {
    try {
      const raw = localStorage.getItem(BALSONS_HR_CONFIG.STORAGE_SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  },

  isLoggedIn: function() {
    return Boolean(this.getSession());
  },

  getUser: function() {
    const s = this.getSession();
    return s || { username: 'guest', fullName: 'Guest User', role: 'Guest' };
  },

  logout: function() {
    localStorage.removeItem(BALSONS_HR_CONFIG.STORAGE_SESSION_KEY);
    window.location.reload();
  }
};
