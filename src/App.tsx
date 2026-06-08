/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  InstansiProfile,
  UserAccount,
  PenatausahaanItem,
  OperasionalItem,
  PembangunanItem,
  AdmUmumItem,
  PersonaliaItem,
  AsetInventarisItem,
  KeuanganItem
} from './types';
import {
  defaultProfile,
  defaultUsers,
  defaultPenatausahaan,
  defaultOperasional,
  defaultPembangunan,
  defaultAdmUmum,
  defaultPersonalia,
  defaultAsetInventaris,
  defaultKeuangan
} from './initialData';

// Subcomponents & Pages
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Penatausahaan from './pages/Penatausahaan';
import Operasional from './pages/Operasional';
import Pembangunan from './pages/Pembangunan';
import SettingsPage from './pages/Settings';
import AdmUmum from './pages/AdmUmum';
import Personalia from './pages/Personalia';
import AsetInventaris from './pages/AsetInventaris';
import Keuangan from './pages/Keuangan';

import { 
  Building2, 
  MapPin, 
  ShieldAlert, 
  Info, 
  HeartHandshake,
  LogOut
} from 'lucide-react';

export default function App() {
  // --- Persistent Storage State Initializers ---
  const [profile, setProfile] = useState<InstansiProfile>(() => {
    const saved = localStorage.getItem('siat_profile');
    if (saved && (saved.includes('Bah Bolon') || saved.includes('UPTD PSDA'))) {
      try {
        const parsed = JSON.parse(saved);
        parsed.name = 'UPTD PUPR Pematangsiantar';
        parsed.footerText = 'Sistem Informasi Administrasi Terpadu UPTD Pekerjaan Umum dan Penataan Ruang Pematangsiantar';
        parsed.copyrightText = '© 2026 UPTD PUPR Pematangsiantar. All Rights Reserved.';
        localStorage.setItem('siat_profile', JSON.stringify(parsed));
        return parsed;
      } catch (e) {
        return defaultProfile;
      }
    }
    return saved ? JSON.parse(saved) : defaultProfile;
  });

  const [users, setUsers] = useState<UserAccount[]>(() => {
    const saved = localStorage.getItem('siat_users');
    return saved ? JSON.parse(saved) : defaultUsers;
  });

  const [operasional, setOperasional] = useState<OperasionalItem[]>(() => {
    const saved = localStorage.getItem('siat_operasional');
    return saved ? JSON.parse(saved) : defaultOperasional;
  });

  const [pembangunan, setPembangunan] = useState<PembangunanItem[]>(() => {
    const saved = localStorage.getItem('siat_pembangunan');
    return saved ? JSON.parse(saved) : defaultPembangunan;
  });

  const [admUmum, setAdmUmum] = useState<AdmUmumItem[]>(() => {
    const saved = localStorage.getItem('siat_adm_umum');
    return saved ? JSON.parse(saved) : defaultAdmUmum;
  });

  const [penatausahaan, setPenatausahaan] = useState<PenatausahaanItem[]>(() => {
    const saved = localStorage.getItem('siat_penatausahaan');
    return saved ? JSON.parse(saved) : defaultPenatausahaan;
  });

  const [personalia, setPersonalia] = useState<PersonaliaItem[]>(() => {
    const saved = localStorage.getItem('siat_personalia');
    return saved ? JSON.parse(saved) : defaultPersonalia;
  });

  const [asetInventaris, setAsetInventaris] = useState<AsetInventarisItem[]>(() => {
    const saved = localStorage.getItem('siat_aset_inventaris');
    return saved ? JSON.parse(saved) : defaultAsetInventaris;
  });

  const [keuangan, setKeuangan] = useState<KeuanganItem[]>(() => {
    const saved = localStorage.getItem('siat_keuangan');
    return saved ? JSON.parse(saved) : defaultKeuangan;
  });

  // --- Storage Clean Hard Reset on Mount ---
  useEffect(() => {
    const isReset = localStorage.getItem('siat_storage_reset_v4');
    if (!isReset) {
      localStorage.removeItem('siat_penatausahaan');
      localStorage.removeItem('siat_operasional');
      localStorage.removeItem('siat_pembangunan');
      localStorage.removeItem('siat_adm_umum');
      localStorage.removeItem('siat_personalia');
      localStorage.removeItem('siat_aset_inventaris');
      localStorage.removeItem('siat_keuangan');
      localStorage.setItem('siat_storage_reset_v4', 'done');

      // Set state to empty lists immediately
      setPenatausahaan([]);
      setOperasional([]);
      setPembangunan([]);
      setAdmUmum([]);
      setPersonalia([]);
      setAsetInventaris([]);
      setKeuangan([]);
    }
  }, []);

  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    const saved = localStorage.getItem('siat_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [activeMenu, setActiveMenu] = useState<string>(() => {
    return localStorage.getItem('siat_active_menu') || 'dashboard';
  });

  const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  // --- Syncing States with LocalStorage ---
  useEffect(() => {
    localStorage.setItem('siat_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('siat_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('siat_penatausahaan', JSON.stringify(penatausahaan));
  }, [penatausahaan]);

  useEffect(() => {
    localStorage.setItem('siat_operasional', JSON.stringify(operasional));
  }, [operasional]);

  useEffect(() => {
    localStorage.setItem('siat_pembangunan', JSON.stringify(pembangunan));
  }, [pembangunan]);

  useEffect(() => {
    localStorage.setItem('siat_adm_umum', JSON.stringify(admUmum));
  }, [admUmum]);

  useEffect(() => {
    localStorage.setItem('siat_personalia', JSON.stringify(personalia));
  }, [personalia]);

  useEffect(() => {
    localStorage.setItem('siat_aset_inventaris', JSON.stringify(asetInventaris));
  }, [asetInventaris]);

  useEffect(() => {
    localStorage.setItem('siat_keuangan', JSON.stringify(keuangan));
  }, [keuangan]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('siat_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('siat_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('siat_active_menu', activeMenu);
  }, [activeMenu]);

  // --- Auth Handlers ---
  const handleLoginSuccess = (user: UserAccount) => {
    setCurrentUser(user);
    setActiveMenu('dashboard');
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  // --- CRUD Handlers ---

  // 1. Penatausahaan CRUD
  const handleAddPenatausahaan = (item: PenatausahaanItem) => {
    setPenatausahaan([item, ...penatausahaan]);
  };
  const handleUpdatePenatausahaan = (updated: PenatausahaanItem) => {
    setPenatausahaan(penatausahaan.map(i => i.id === updated.id ? updated : i));
  };
  const handleDeletePenatausahaan = (id: string) => {
    setPenatausahaan(penatausahaan.filter(i => i.id !== id));
  };

  // 2. Operasional CRUD
  const handleAddOperasional = (item: OperasionalItem) => {
    setOperasional([item, ...operasional]);
  };
  const handleUpdateOperasional = (updated: OperasionalItem) => {
    setOperasional(operasional.map(i => i.id === updated.id ? updated : i));
  };
  const handleDeleteOperasional = (id: string) => {
    setOperasional(operasional.filter(i => i.id !== id));
  };

  // 3. Pembangunan CRUD
  const handleAddPembangunan = (item: PembangunanItem) => {
    setPembangunan([item, ...pembangunan]);
  };
  const handleUpdatePembangunan = (updated: PembangunanItem) => {
    setPembangunan(pembangunan.map(i => i.id === updated.id ? updated : i));
  };
  const handleDeletePembangunan = (id: string) => {
    setPembangunan(pembangunan.filter(i => i.id !== id));
  };

  // 3b. Adm Umum CRUD
  const handleAddAdmUmum = (item: AdmUmumItem) => {
    setAdmUmum([item, ...admUmum]);
  };
  const handleUpdateAdmUmum = (updated: AdmUmumItem) => {
    setAdmUmum(admUmum.map(i => i.id === updated.id ? updated : i));
  };
  const handleDeleteAdmUmum = (id: string) => {
    setAdmUmum(admUmum.filter(i => i.id !== id));
  };

  // 3c. Personalia CRUD
  const handleAddPersonalia = (item: PersonaliaItem) => {
    setPersonalia([item, ...personalia]);
  };
  const handleUpdatePersonalia = (updated: PersonaliaItem) => {
    setPersonalia(personalia.map(i => i.id === updated.id ? updated : i));
  };
  const handleDeletePersonalia = (id: string) => {
    setPersonalia(personalia.filter(i => i.id !== id));
  };

  // 3d. Aset & Inventaris CRUD
  const handleAddAset = (item: AsetInventarisItem) => {
    setAsetInventaris([item, ...asetInventaris]);
  };
  const handleUpdateAset = (updated: AsetInventarisItem) => {
    setAsetInventaris(asetInventaris.map(i => i.id === updated.id ? updated : i));
  };
  const handleDeleteAset = (id: string) => {
    setAsetInventaris(asetInventaris.filter(i => i.id !== id));
  };

  // 3e. Keuangan CRUD
  const handleAddKeuangan = (item: KeuanganItem) => {
    setKeuangan([item, ...keuangan]);
  };
  const handleUpdateKeuangan = (updated: KeuanganItem) => {
    setKeuangan(keuangan.map(i => i.id === updated.id ? updated : i));
  };
  const handleDeleteKeuangan = (id: string) => {
    setKeuangan(keuangan.filter(i => i.id !== id));
  };

  // 4. User Accounts CRUD
  const handleAddUser = (user: UserAccount) => {
    setUsers([...users, user]);
  };
  const handleUpdateUser = (updated: UserAccount) => {
    setUsers(users.map(u => u.id === updated.id ? updated : u));
    // If updating currently logged in user role/name, sync immediately
    if (currentUser && currentUser.id === updated.id) {
      setCurrentUser(updated);
    }
  };
  const handleDeleteUser = (id: string) => {
    setUsers(users.filter(u => u.id !== id));
  };

  // --- Dynamic Page Switcher ---
  const renderActivePage = () => {
    switch (activeMenu) {
      case 'dashboard':
        return (
          <Dashboard
            penatausahaanList={penatausahaan}
            operasionalList={operasional}
            pembangunanList={pembangunan}
            activeUser={currentUser || { fullName: 'Tamu', role: 'user', department: 'Umum' }}
          />
        );
      case 'penatausahaan':
        return (
          <Penatausahaan
            items={penatausahaan}
            onAddItem={handleAddPenatausahaan}
            onUpdateItem={handleUpdatePenatausahaan}
            onDeleteItem={handleDeletePenatausahaan}
          />
        );
      case 'adm_umum':
        return (
          <AdmUmum
            items={admUmum}
            onAddItem={handleAddAdmUmum}
            onUpdateItem={handleUpdateAdmUmum}
            onDeleteItem={handleDeleteAdmUmum}
          />
        );
      case 'personalia':
        return (
          <Personalia
            items={personalia}
            onAddItem={handleAddPersonalia}
            onUpdateItem={handleUpdatePersonalia}
            onDeleteItem={handleDeletePersonalia}
          />
        );
      case 'aset_inventaris':
        return (
          <AsetInventaris
            items={asetInventaris}
            onAddItem={handleAddAset}
            onUpdateItem={handleUpdateAset}
            onDeleteItem={handleDeleteAset}
          />
        );
      case 'keuangan':
        return (
          <Keuangan
            items={keuangan}
            onAddItem={handleAddKeuangan}
            onUpdateItem={handleUpdateKeuangan}
            onDeleteItem={handleDeleteKeuangan}
          />
        );
      case 'operasional':
        return (
          <Operasional
            items={operasional}
            onAddItem={handleAddOperasional}
            onUpdateItem={handleUpdateOperasional}
            onDeleteItem={handleDeleteOperasional}
          />
        );
      case 'pembangunan':
        return (
          <Pembangunan
            items={pembangunan}
            onAddItem={handleAddPembangunan}
            onUpdateItem={handleUpdatePembangunan}
            onDeleteItem={handleDeletePembangunan}
          />
        );
      case 'settings':
        return (
          <SettingsPage
            profile={profile}
            onUpdateProfile={setProfile}
            users={users}
            onAddUser={handleAddUser}
            onUpdateUser={handleUpdateUser}
            onDeleteUser={handleDeleteUser}
          />
        );
      default:
        return <div className="text-white text-xs p-8 text-center bg-slate-950 rounded-2xl">Halaman Tidak Ditemukan.</div>;
    }
  };

  // Lockscreen Check
  if (!currentUser) {
    return (
      <Login
        onLoginSuccess={handleLoginSuccess}
        users={users}
        profileName={profile.name}
      />
    );
  }

  return (
    <div className="flex h-screen bg-white text-slate-800 overflow-hidden font-sans select-none antialiased relative">
      
      {/* Backdrop overlay for mobile screen sidebar drawer */}
      {isSidebarOpen && (
        <div
          id="sidebar-mobile-backdrop"
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-45 lg:hidden transition-all duration-300 pointer-events-auto"
        />
      )}

      {/* Sidebar Navigation */}
      <Sidebar
        profile={profile}
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        currentUser={currentUser}
        onLogout={handleLogout}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        
        {/* Header toolbar */}
        <Header 
          profile={profile} 
          activeMenu={activeMenu} 
          onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        {/* Dynamic Canvas Container (Renders active screens) */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 bg-slate-50 relative">
          
          <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-12">
            {renderActivePage()}
          </div>

          {/* Persistent Dynamic Footer */}
          <footer className="mt-auto pt-8 border-t border-slate-200 text-slate-500 text-[10px] md:text-xs leading-relaxed max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3">
            <div className="text-center md:text-left space-y-1">
              <p className="font-semibold text-slate-650">
                {profile.footerText}
              </p>
              <p className="font-medium">
                {profile.address}
              </p>
            </div>
            <div className="text-center md:text-right text-slate-600 font-bold shrink-0">
              {profile.copyrightText}
            </div>
          </footer>

        </main>

      </div>

      {/* Modern, Iframe-friendly Logout Confirmation Dialog */}
      {showLogoutModal && (
        <div id="logout-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div id="logout-modal-card" className="w-full max-w-md p-6 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl relative overflow-hidden">
            {/* Top color strap */}
            <div className="absolute top-0 left-0 w-full opacity-30 pointer-events-none select-none h-1.5 bg-gradient-to-r from-rose-500 via-indigo-500 to-sky-500" />
            
            <div className="flex flex-col items-center text-center mt-3">
              <div className="h-14 w-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-450 flex items-center justify-center mb-4">
                <LogOut className="h-7 w-7" />
              </div>
              
              <h3 className="text-base font-extrabold text-white mb-2 tracking-tight">Konfirmasi Keluar</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-6">
                Apakah Anda yakin ingin keluar dari portal SIAT Terpadu {profile.name}? Anda harus memasukkan kredensial kembali untuk mengakses data.
              </p>
              
              <div className="flex items-center gap-3 w-full">
                <button
                  id="logout-modal-cancel-btn"
                  type="button"
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 py-3 px-4 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-750 hover:text-white transition-all duration-200 cursor-pointer text-xs"
                >
                  Batal
                </button>
                <button
                  id="logout-modal-confirm-btn"
                  type="button"
                  onClick={() => {
                    setShowLogoutModal(false);
                    setCurrentUser(null);
                    localStorage.removeItem('siat_current_user');
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-500 hover:to-red-400 text-white font-extrabold transition-all duration-200 cursor-pointer shadow-lg shadow-rose-950/20 text-xs"
                >
                  Ya, Keluar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
