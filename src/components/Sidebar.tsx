/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { InstansiProfile, UserAccount } from '../types';
import {
  LayoutDashboard,
  Mail,
  Waves,
  HardHat,
  Settings,
  LogOut,
  Droplets,
  Landmark,
  ShieldCheck,
  UserCheck,
  FileText,
  Users,
  Boxes,
  Coins,
  Compass,
  X
} from 'lucide-react';

interface SidebarProps {
  profile: InstansiProfile;
  activeMenu: string;
  setActiveMenu: (menu: string) => void;
  currentUser: UserAccount | null;
  onLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({
  profile,
  activeMenu,
  setActiveMenu,
  currentUser,
  onLogout,
  isOpen,
  onClose
}: SidebarProps) {
  
  const menuItems = [
    { id: 'dashboard', label: 'Dasbor Utama', icon: LayoutDashboard, color: 'text-sky-700' },
    { 
      id: 'penatausahaan', 
      label: 'Penatausahaan & Arsip', 
      icon: Mail, 
      color: 'text-purple-700',
      subPages: [
        { id: 'adm_umum', label: 'Adm Umum', icon: FileText, color: 'text-purple-700' },
        { id: 'personalia', label: 'Personalia', icon: Users, color: 'text-teal-700' },
        { id: 'aset_inventaris', label: 'Aset & Inventaris', icon: Boxes, color: 'text-amber-700' },
        { id: 'keuangan', label: 'Keuangan', icon: Coins, color: 'text-indigo-700' },
      ]
    },
    { 
      id: 'operasional', 
      label: 'Seksi Operasional OP', 
      icon: Waves, 
      color: 'text-cyan-700',
      subPages: [
        { id: 'operasional_tma', label: 'Teleskop TMA & Bendung', icon: Droplets, color: 'text-cyan-700' },
        { id: 'inventaris_irigasi', label: 'Inventaris Daerah Irigasi', icon: Compass, color: 'text-indigo-700' },
      ]
    },
    { id: 'pembangunan', label: 'Seksi Pembangunan', icon: HardHat, color: 'text-amber-700' },
    { id: 'settings', label: 'Pengaturan Sistem', icon: Settings, color: 'text-indigo-700' },
  ];


  return (
    <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-sky-100 border-r border-sky-200 flex flex-col h-full shrink-0 font-sans transition-transform duration-300 ease-in-out lg:static lg:h-screen lg:translate-x-0 ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    }`}>
      
      {/* Wave pattern overlay */}
      <div className="absolute top-0 left-0 w-full opacity-10 pointer-events-none select-none overflow-hidden h-24">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
          <path fill="#0284c7" d="M0,50 Q25,30 50,50 T100,50 L100,100 L0,100 Z" />
        </svg>
      </div>

      {/* Top Brand Logo */}
      <div className="p-6 border-b border-sky-200 flex items-center justify-between gap-3 relative">
        <div className="flex items-center gap-3.5 min-w-0">
          {profile.logoUrl ? (
            <img
              id="sidebar-logo-image"
              src={profile.logoUrl}
              alt="Logo UPTD"
              className="h-11 w-11 rounded-xl object-contain bg-white border border-sky-200 p-1 shrink-0 shadow-xs"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="h-11 w-11 rounded-xl bg-gradient-to-tr from-cyan-550 to-sky-650 flex items-center justify-center shadow-md shadow-sky-500/10 shrink-0">
              <Droplets className="h-5.5 w-5.5 text-white" />
            </div>
          )}
          <div className="space-y-0.5 overflow-hidden">
            <h2 className="text-base font-black tracking-tight text-sky-950 flex items-center gap-1.5">
              SIAT TERPADU
            </h2>
            <p className="text-[10px] text-sky-850 truncate uppercase font-bold tracking-wider" title={profile.name}>
              {profile.name}
            </p>
          </div>
        </div>

        {/* Close button inside sidebar for mobile devices */}
        <button
          id="btn-close-sidebar-x"
          type="button"
          onClick={onClose}
          className="lg:hidden p-1.5 hover:bg-sky-200/60 rounded-xl text-sky-900 border border-transparent hover:border-sky-200 cursor-pointer transition-all active:scale-90"
          title="Tutup Menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Navigation List links */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        <p className="text-[9px] font-black text-sky-800 uppercase tracking-widest px-3.5 mb-2.5">
          Modul Administrasi
        </p>

        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeMenu === item.id;
          const isSubActive = item.subPages?.some(sub => activeMenu === sub.id) || false;

          return (
            <div key={item.id} className="space-y-1">
              <button
                id={`sidebar-menu-${item.id}`}
                type="button"
                onClick={() => {
                  setActiveMenu(item.id);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-2xl text-[13px] font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
                  isActive || isSubActive
                    ? 'bg-white text-sky-900 border-l-4 border-sky-600 shadow-xs'
                    : 'text-slate-650 hover:text-sky-950 hover:bg-sky-200/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <IconComponent className={`h-4.5 w-4.5 ${(isActive || isSubActive) ? item.color : 'text-sky-700/60'}`} />
                  <span>{item.label}</span>
                </div>
                
                {/* Special Tag indicators */}
                {item.id === 'settings' && currentUser?.role !== 'admin' && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-700 border border-amber-500/25 uppercase font-bold tracking-wider">
                    Batas
                  </span>
                )}
              </button>

              {/* Sub-pages nested list */}
              {item.subPages && (
                <div className="pl-4 pr-1 py-1 space-y-1 my-1 border-l border-sky-200 ml-6">
                  {item.subPages.map((sub) => {
                    const SubIcon = sub.icon;
                    const isChildActive = activeMenu === sub.id;
                    return (
                      <button
                        id={`sidebar-submenu-${sub.id}`}
                        key={sub.id}
                        type="button"
                        onClick={() => {
                          setActiveMenu(sub.id);
                          onClose();
                        }}
                        className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-150 cursor-pointer ${
                          isChildActive
                            ? 'bg-white/80 text-sky-900 font-bold border-r-2 border-sky-600'
                            : 'text-slate-600 hover:text-sky-900 hover:bg-sky-200/35'
                        }`}
                      >
                        <SubIcon className={`h-3.5 w-3.5 ${isChildActive ? sub.color : 'text-slate-450'}`} />
                        <span>{sub.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Logged in User Foot badge with logout */}
      <div className="p-4 border-t border-sky-200 bg-sky-100/60">
        <div className="p-3.5 bg-white/70 rounded-2xl border border-sky-200/40 flex items-center justify-between gap-2.5 shadow-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={`h-8 w-8 rounded-lg shrink-0 flex items-center justify-center ${
              currentUser?.role === 'admin' 
                ? 'bg-rose-500/10 border border-rose-500/20 text-rose-700' 
                : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-700'
            }`}>
              {currentUser?.role === 'admin' ? <ShieldCheck className="h-4.5 w-4.5" /> : <UserCheck className="h-4.5 w-4.5" />}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-sky-950 truncate leading-tight">
                {currentUser?.fullName}
              </p>
              <p className="text-[9px] text-slate-500 truncate mt-0.5 uppercase font-semibold">
                {currentUser?.role === 'admin' ? 'Super Admin' : 'Seksi Teknis'}
              </p>
            </div>
          </div>

          <button
            id="sidebar-logout-btn"
            type="button"
            onClick={onLogout}
            className="p-1.5 rounded-lg hover:bg-rose-500/10 text-slate-450 hover:text-rose-600 transition-all cursor-pointer shrink-0"
            title="Keluar dari Portal"
          >
            <LogOut className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>

    </aside>
  );
}
