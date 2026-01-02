import React, { useState, useEffect, useMemo } from 'react';
// 1. UPDATE: Import 'signOut' from firebase/auth
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, onSnapshot, collection, writeBatch } from 'firebase/firestore';


// --- Icons (Using inline SVG for compatibility) ---
const LogInIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" x2="3" y1="12" y2="12"/></svg>
);
const MapPinIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
);
const UsersIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
);
const HomeIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
);
const UtensilsIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2.3l-5.6 5.7c-.3.3-.7.5-1.1.5H11"/><path d="M15.5 15.5 21 21"/></svg>
);
const DropletIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l5.66 5.66c1.15 1.15 1.15 3.02 0 4.17L12 18.34l-5.66-5.66c-1.15-1.15-1.15-3.02 0-4.17L12 2.69z"/></svg>
);
const FirstAidIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M11 12h2"/><path d="M12 11v2"/></svg>
);
const SearchIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
);
const AlertTriangle = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
);

// --- Global Firebase State Management ---

let app;
let db;
let auth;

const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

/**
 * Initializes Firebase, authenticates the user, and seeds the database.
 * @param {function} setUserId - React setter for user ID state.
 * @param {function} setIsAuthReady - React setter for auth ready state.
 */
async function initializeFirebaseAndAuth(setUserId, setIsAuthReady) {
  try {
    const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
    const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

    if (Object.keys(firebaseConfig).length === 0) {
      console.error("FIREBASE ERROR: Firebase config is missing or empty.");
      setIsAuthReady(true);
      return;
    }

    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);

    // Set up Auth Listener
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        await seedDatabase(db);
      } else {
        setUserId(null);
      }
      setIsAuthReady(true);
    });

    // Sign in using custom token or anonymously
    if (initialAuthToken) {
      await signInWithCustomToken(auth, initialAuthToken)
        .catch(e => {
          console.error("Custom token sign-in failed. Falling back to anonymous.", e);
          signInAnonymously(auth);
        });
    } else {
      await signInAnonymously(auth);
    }

  } catch (error) {
    console.error("FIREBASE FATAL ERROR: Initialization or authentication failed.", error);
    setIsAuthReady(true);
  }
}

/**
 * Seeds the database with initial rescue data if the 'seed' marker is not found.
 * @param {object} db - Firestore instance.
 */
async function seedDatabase(db) {
  // Valid 6-segment path: /artifacts/{appId}/public/data/meta/seed_status
  const seedDocRef = doc(db, `/artifacts/${appId}/public/data/meta`, 'seed_status');
  const seedDoc = await getDoc(seedDocRef);

  if (seedDoc.exists() && seedDoc.data().seeded) {
    return; // Already seeded
  }

  const batch = writeBatch(db);

  // 1. Personnel Mock Data
  const personnelRef = collection(db, `/artifacts/${appId}/public/data/personnel`);
  const mockPersonnel = [
    { id: 'p1', name: 'Alex Johnson', role: 'Paramedic', status: 'Ready', site: 'Downtown Sector A', lastUpdate: Date.now() },
    { id: 'p2', name: 'Maria Lopez', role: 'Search & Rescue', status: 'Assigned', site: 'Suburban Area', lastUpdate: Date.now() },
    { id: 'p3', name: 'Chen Wei', role: 'Logistics', status: 'Ready', site: 'Industrial Zone', lastUpdate: Date.now() },
    { id: 'p4', name: 'Sam Miller', role: 'Engineer', status: 'Ready', site: 'Downtown Sector B', lastUpdate: Date.now() },
    { id: 'p5', name: 'Erica Smith', role: 'Medical', status: 'Ready', site: 'Downtown Sector A', lastUpdate: Date.now() },
    { id: 'p6', name: 'John Doe', role: 'Pilot', status: 'Assigned', site: 'Suburban Area', lastUpdate: Date.now() },
  ];
  mockPersonnel.forEach(p => batch.set(doc(personnelRef, p.id), p));

  // 2. Safe Places (Resource Centers) Mock Data - Added Water and Medical Supplies
  const safePlacesRef = collection(db, `/artifacts/${appId}/public/data/safe_places`);
  const mockSafePlaces = [
    { id: 's1', name: 'Community Hall East', site: 'Downtown Sector A', capacity: 150, occupancy: 85, foodMeals: 420, waterLitres: 500, medicalKits: 12, lastUpdate: Date.now() },
    { id: 's2', name: 'School Gym West', site: 'Suburban Area', capacity: 300, occupancy: 290, foodMeals: 50, waterLitres: 100, medicalKits: 3, lastUpdate: Date.now() },
    { id: 's3', name: 'The Old Church', site: 'Industrial Zone', capacity: 50, occupancy: 12, foodMeals: 150, waterLitres: 300, medicalKits: 8, lastUpdate: Date.now() },
    { id: 's4', name: 'Metro Depot Shelter', site: 'Downtown Sector B', capacity: 500, occupancy: 100, foodMeals: 1200, waterLitres: 1500, medicalKits: 35, lastUpdate: Date.now() },
  ];
  mockSafePlaces.forEach(s => batch.set(doc(safePlacesRef, s.id), s));

  // 3. Mark as seeded
  batch.set(seedDocRef, { seeded: true });

  await batch.commit();
  console.log("Database seeded with initial rescue data.");
}


// --- Component Helpers ---

/**
 * Calculates resource status based on quantity thresholds.
 */
const getResourceStatus = (quantity, lowThreshold, moderateThreshold) => {
    if (quantity < lowThreshold) return { status: 'Critical', className: 'bg-red-600' };
    if (quantity < moderateThreshold) return { status: 'Low', className: 'bg-yellow-600' };
    return { status: 'Sufficient', className: 'bg-green-600' };
};

/**
 * Single Resource Card for Safe Place display.
 */
const ResourceDisplay = ({ icon: Icon, label, quantity, unit, low, moderate }) => {
    const { status, className } = getResourceStatus(quantity, low, moderate);

    return (
        <div className="flex justify-between items-center text-sm">
            <span className="flex items-center text-gray-300">
                <Icon className="w-4 h-4 mr-2 text-red-300" /> {label}:
            </span>
            <span className={`px-2 py-0.5 rounded text-xs font-semibold ${className}`}>
                {quantity} {unit} ({status})
            </span>
        </div>
    );
};


// --- Login/Auth Component ---
const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (email !== 'rescue@ops.com' || password !== '********') {
      setError('Invalid credentials. Use demo: rescue@ops.com / ********');
      return;
    }

    // Since we are using an initial custom token for auto-login on load,
    // this form just verifies the credentials and then allows the user
    // to proceed, relying on the background Firebase Auth.
    setIsLoading(true);
    setTimeout(() => {
        setIsLoading(false);
        // The page will now refresh and the auth listener should pick up the user.
        // In a real app, this would be signInWithEmailAndPassword.
        setError('Login successful! Please wait for dashboard initialization...');
    }, 1500);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 p-4">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-xl shadow-2xl border border-red-700/50">
        <div className="flex justify-center mb-6">
          <AlertTriangle className="w-12 h-12 text-red-500"/>
        </div>
        <h2 className="text-3xl font-extrabold text-white text-center mb-6">
          Rescue OPS Login
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="email">
              Operational Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="rescue@ops.com"
              className="shadow appearance-none border border-gray-700 rounded-lg w-full py-3 px-4 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-700 transition duration-300"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="********"
              className="shadow appearance-none border border-gray-700 rounded-lg w-full py-3 px-4 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-700 transition duration-300"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && (
            <p className="text-red-400 text-sm italic mb-4 text-center p-2 bg-gray-700 rounded-lg">{error}</p>
          )}
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 ease-in-out disabled:opacity-50 flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              ) : (
                <>
                  <LogInIcon className="w-5 h-5 mr-2" />
                  Sign In to Command Center
                </>
              )}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-4 text-center">Form validation is for demo clarity. The system uses a secure Firebase Auth token for actual access.</p>
        </form>
      </div>
    </div>
  );
};

/**
 * Main Dashboard Component
 */
const RescueDashboard = ({ userId }) => {
  const [personnel, setPersonnel] = useState([]);
  const [safePlaces, setSafePlaces] = useState([]);
  const [problemSite, setProblemSite] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoadingData, setIsLoadingData] = useState(true);

  // 1. Data Fetching Effect (Real-time listeners)
  useEffect(() => {
    if (!db || !userId) return;

    const pathPrefix = `/artifacts/${appId}/public/data`;

    // Personnel Listener
    const personnelRef = collection(db, `${pathPrefix}/personnel`);
    const unsubscribePersonnel = onSnapshot(personnelRef, (snapshot) => {
      const pData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Sort by status (Ready first) and then name
      pData.sort((a, b) => a.status === 'Ready' ? -1 : (b.status === 'Ready' ? 1 : a.name.localeCompare(b.name)));
      setPersonnel(pData);
      setIsLoadingData(false);
    }, (error) => {
      console.error("Error fetching personnel:", error);
    });

    // Safe Places Listener
    const safePlacesRef = collection(db, `${pathPrefix}/safe_places`);
    const unsubscribeSafePlaces = onSnapshot(safePlacesRef, (snapshot) => {
      const sData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSafePlaces(sData);
      setIsLoadingData(false);
    }, (error) => {
      console.error("Error fetching safe places:", error);
    });

    // Cleanup listeners on component unmount
    return () => {
      unsubscribePersonnel();
      unsubscribeSafePlaces();
    };
  }, [userId]);

  // 2. Search/Filtering Logic
  const filteredPersonnel = useMemo(() => {
    if (!problemSite) return personnel;
    const lowerSearchTerm = problemSite.toLowerCase();
    // Filter personnel whose assigned site contains the search term
    return personnel.filter(p => p.site.toLowerCase().includes(lowerSearchTerm));
  }, [personnel, problemSite]);

  const filteredSafePlaces = useMemo(() => {
    if (!problemSite) return safePlaces;
    const lowerSearchTerm = problemSite.toLowerCase();
    // Filter safe places whose site contains the search term
    return safePlaces.filter(s => s.site.toLowerCase().includes(lowerSearchTerm));
  }, [safePlaces, problemSite]);

  const handleSearch = (e) => {
    e.preventDefault();
    setProblemSite(searchTerm.trim());
  };

  // 3. Update Status Function (Actionable data)
  const handleUpdateStatus = async (id, newStatus) => {
    if (!db || !userId) return;
    try {
        await setDoc(doc(db, `/artifacts/${appId}/public/data/personnel`, id), 
            { status: newStatus, lastUpdate: Date.now() }, 
            { merge: true }
        );
    } catch (error) {
        console.error("Error updating personnel status:", error);
    }
  };
  
  // 4. NEW: Logout Function
  const handleLogout = async () => {
    if (!auth) {
        console.error("Firebase Auth not initialized.");
        return;
    }
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Error signing out:", error);
    }
  };


  if (isLoadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-red-500 mb-3"></div>
          <p className="text-lg text-gray-400">Loading operational data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans p-4 sm:p-8">
      {/* 2. UPDATE: Modify header to include the logout button */}
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-extrabold text-red-500 mb-2">Rescue Department Command Site</h1>
          <p className="text-gray-400">Real-time Resource Allocation. Agent ID: <span className="text-xs bg-gray-700 px-2 py-0.5 rounded-md">{userId}</span></p>
        </div>
        
        {/* LOGOUT BUTTON */}
        <button 
            onClick={handleLogout} 
            className="flex items-center text-red-400 hover:text-red-300 font-semibold transition duration-200 p-2 border border-red-400 rounded-lg"
        >
            {/* LogInIcon is used and rotated 180 degrees to look like an exit icon */}
            <LogInIcon className="rotate-180 w-5 h-5 mr-2" /> 
            Log Out
        </button>

      </header>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex bg-gray-800 rounded-xl shadow-lg border border-red-600/50 overflow-hidden">
          <input
            type="text"
            placeholder="Enter Site Location to Filter (e.g., 'Downtown Sector A' or 'Suburban')"
            className="flex-grow p-4 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-red-500/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            // Make sure search term only filters when the button is pressed
            // onBlur={(e) => setProblemSite(e.target.value.trim())}
          />
          <button
            type="submit"
            className="bg-red-600 hover:bg-red-700 p-4 transition duration-300 flex items-center text-lg font-semibold"
          >
            <SearchIcon className="w-6 h-6 mr-2" /> Filter
          </button>
        </div>
      </form>

      <main className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        
        {/* 1. Summary/Problem Site Card */}
        <div className="lg:col-span-1 bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700 h-fit">
          <h2 className="text-2xl font-bold mb-4 flex items-center text-red-400 border-b border-gray-700 pb-2">
            <MapPinIcon className="w-6 h-6 mr-2" /> Current Operational Focus
          </h2>
          <div className="bg-gray-700 p-4 rounded-lg">
            <p className="text-xl font-semibold mb-1 text-white">{problemSite || 'Global Overview'}</p>
            <p className="text-sm text-gray-400">
              {problemSite ? "Resources filtered by location." : "Showing all resources across all sites."}
            </p>
          </div>
          <div className="mt-4 text-xs text-gray-500">
            <p>Available Personnel: <span className="text-white font-bold">{personnel.filter(p => p.status === 'Ready').length}</span></p>
            <p>Total Safe Places: <span className="text-white font-bold">{safePlaces.length}</span></p>
          </div>
        </div>

        {/* 2. Available Rescue Personnel (Large Panel) */}
        <div className="lg:col-span-2 xl:col-span-2 bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700">
          <h2 className="text-2xl font-bold mb-4 flex items-center border-b border-gray-700 pb-2">
            <UsersIcon className="w-6 h-6 mr-2 text-red-400" /> Personnel Deployment ({filteredPersonnel.length} Agents)
          </h2>
          
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
            {filteredPersonnel.length > 0 ? (
              filteredPersonnel.map((p) => (
                <div key={p.id} className={`p-4 rounded-lg flex justify-between items-center transition duration-300 ${p.status === 'Ready' ? 'bg-gray-700/70 hover:bg-gray-700' : 'bg-gray-700/30'}`}>
                  <div>
                    <p className="text-lg font-semibold">{p.name} - <span className="text-red-400">{p.role}</span></p>
                    <p className="text-sm text-gray-400">Current Site: {p.site}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full min-w-[70px] text-center ${
                      p.status === 'Ready' ? 'bg-green-600' : 'bg-yellow-600'
                    }`}>
                      {p.status}
                    </span>
                    <select
                        value={p.status}
                        onChange={(e) => handleUpdateStatus(p.id, e.target.value)}
                        className="bg-gray-600 text-white rounded-md p-2 text-sm focus:ring-red-500 focus:border-red-500"
                    >
                        <option value="Ready">Ready</option>
                        <option value="Assigned">Assigned</option>
                        <option value="Standby">Standby</option>
                    </select>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 p-4 bg-gray-700/50 rounded-lg">No personnel match the filter "{problemSite}".</p>
            )}
          </div>
        </div>

        {/* 3. Safe Places & Resource Availability (Large Panel) */}
        <div className="lg:col-span-3 xl:col-span-4 bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700">
          <h2 className="text-2xl font-bold mb-4 flex items-center border-b border-gray-700 pb-2">
            <HomeIcon className="w-6 h-6 mr-2 text-red-400" /> Resource Centers (Safe Places)
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {filteredSafePlaces.length > 0 ? (
              filteredSafePlaces.map((s) => {
                const capacityPercent = Math.round((s.occupancy / s.capacity) * 100);
                const isFull = capacityPercent >= 90;
                
                return (
                  <div key={s.id} className={`p-4 rounded-lg shadow-lg border-l-4 ${isFull ? 'bg-red-900/40 border-red-500' : 'bg-gray-700/70 border-green-500'}`}>
                    <p className="text-xl font-bold mb-1">{s.name}</p>
                    <p className="text-sm text-gray-400 mb-4">{s.site}</p>
                    
                    {/* Capacity */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center text-sm font-medium mb-1">
                        <span className="flex items-center"><UsersIcon className="w-4 h-4 mr-1 text-blue-300"/> Occupancy:</span>
                        <span className={`${isFull ? 'text-red-300 font-bold' : 'text-green-300'}`}>{s.occupancy} / {s.capacity}</span>
                      </div>
                      <div className="w-full bg-gray-600 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${isFull ? 'bg-red-500' : 'bg-blue-500'}`} 
                          style={{ width: `${capacityPercent}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Resources Grid */}
                    <div className="space-y-2 pt-2 border-t border-gray-600">
                        <ResourceDisplay 
                          icon={UtensilsIcon} 
                          label="Food Stock" 
                          quantity={s.foodMeals} 
                          unit="Meals" 
                          low={100} 
                          moderate={500} 
                        />
                        <ResourceDisplay 
                          icon={DropletIcon} 
                          label="Water Reserve" 
                          quantity={s.waterLitres} 
                          unit="Litres" 
                          low={150} 
                          moderate={750} 
                        />
                        <ResourceDisplay 
                          icon={FirstAidIcon} 
                          label="Medical Kits" 
                          quantity={s.medicalKits} 
                          unit="Kits" 
                          low={5} 
                          moderate={20} 
                        />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500 p-4 bg-gray-700/50 rounded-lg col-span-full">No resource centers match the filter "{problemSite}".</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};


/**
 * Main Application Component (Wrapper)
 */
const App = () => {
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [userId, setUserId] = useState(null);

  // Initialize Firebase and Auth on component mount
  useEffect(() => {
    initializeFirebaseAndAuth(setUserId, setIsAuthReady);
  }, []);

  // Show loading state while waiting for Firebase Auth to initialize
  if (!isAuthReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-red-500 mb-3"></div>
          <div className="animate-pulse text-2xl font-semibold text-gray-400">Initializing Command Systems...</div>
        </div>
      </div>
    );
  }

  // If user is authenticated, show the dashboard
  if (userId) {
    return <RescueDashboard userId={userId} />;
  }

  // If user is NOT authenticated (after check), show the login form
  return <LoginApp />;
};

export default App;