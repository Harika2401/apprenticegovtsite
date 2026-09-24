// Candidate storage and verification in JavaScript

const STORAGE_KEY = 'candidate_portal_users';

// Pre-seeded candidates so valid logins work right out of the box for Playwright and Typebot
const INITIAL_CANDIDATES = [
  {
    id: 'cand-001',
    email: 'candidate@example.com',
    mobile: '9876543210',
    isItiStudent: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'cand-002',
    email: 'user@apprenticeship.gov.in',
    mobile: '9123456780',
    isItiStudent: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'cand-003',
    email: 'test@gmail.com',
    mobile: '9988776655',
    isItiStudent: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'cand-004',
    email: 'harikavv2401@gmail.com',
    mobile: '9848022338',
    isItiStudent: false,
    createdAt: new Date().toISOString()
  }
];

export function getRegisteredUsers() {
  if (typeof window === 'undefined') return INITIAL_CANDIDATES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_CANDIDATES));
      return INITIAL_CANDIDATES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_CANDIDATES;
  } catch (e) {
    console.error('Error reading registered users:', e);
    return INITIAL_CANDIDATES;
  }
}

export function findUserByEmail(email) {
  if (!email) return null;
  const users = getRegisteredUsers();
  const normalized = email.trim().toLowerCase();
  return users.find(u => u.email.trim().toLowerCase() === normalized) || null;
}

export function registerCandidate({ email, mobile, isItiStudent }) {
  const users = getRegisteredUsers();
  const normalizedEmail = email.trim().toLowerCase();

  // Check if candidate already registered
  const existing = users.find(u => u.email.trim().toLowerCase() === normalizedEmail);
  if (existing) {
    throw new Error(`Candidate with email ${email} is already registered. Please login directly.`);
  }

  const newUser = {
    id: `cand-${Date.now()}`,
    email: email.trim(),
    mobile: mobile ? mobile.trim() : '',
    isItiStudent: Boolean(isItiStudent),
    createdAt: new Date().toISOString()
  };

  const updated = [...users, newUser];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed saving candidate to localStorage:', e);
  }

  return newUser;
}

export function resetUsersToDefault() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_CANDIDATES));
  return INITIAL_CANDIDATES;
}

// Pre-seeded ITI student records for candidate lookup
export const ITI_RECORDS = {
  'R190823000123': {
    rollNumber: 'R190823000123',
    candidateName: 'Harika V',
    fatherName: 'Venkata Rao',
    tradeName: 'Electrician (NCVT)',
    mobile: '9848022338',
    email: 'harikavv2401@gmail.com'
  },
  '1234567890': {
    rollNumber: '1234567890',
    candidateName: 'Ramesh Kumar',
    fatherName: 'Suresh Kumar',
    tradeName: 'Fitter (NCVT)',
    mobile: '9876543210',
    email: 'candidate@example.com'
  },
  'ITI20240987': {
    rollNumber: 'ITI20240987',
    candidateName: 'Priya Sharma',
    fatherName: 'Rajesh Sharma',
    tradeName: 'COPA (Computer Operator & Programming Assistant)',
    mobile: '9123456780',
    email: 'priya.sharma@example.com'
  }
};

export function lookupItiStudent(rollNumber) {
  if (!rollNumber) return null;
  const clean = rollNumber.trim().toUpperCase();
  if (ITI_RECORDS[clean]) {
    return ITI_RECORDS[clean];
  }
  // If it's alphanumeric with at least 4 characters, mock generate candidate details
  if (clean.length >= 4) {
    return {
      rollNumber: clean,
      candidateName: `ITI Candidate (${clean})`,
      fatherName: 'ITI Registered Guardian',
      tradeName: 'NCVT Certified Technical Trade',
      mobile: '98' + Math.floor(10000000 + Math.random() * 90000000),
      email: `${clean.toLowerCase()}@iti-candidate.edu.in`
    };
  }
  return null;
}
