/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { InstansiProfile } from '../types';
import { Landmark, Calendar, Phone, Mail, ChevronRight, Activity, Clock, Menu } from 'lucide-react';

interface HeaderProps {
  profile: InstansiProfile;
  activeMenu: string;
  onMenuToggle: () => void;
}

export default function Header({ profile, activeMenu, onMenuToggle }: HeaderProps) {
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    // Generate active clock string representation
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const getBreadcrumb = () => {
    switch (activeMenu) {
      case 'dashboard':
        return 'Dasbor Publik UPTD';
      case 'penatausahaan':
        return 'Penatausahaan / Persuratan & Arsip Digital';
      case 'adm_umum':
        return 'Penatausahaan / Administrasi Umum';
      case 'personalia':
        return 'Penatausahaan / Personalia & Kepegawaian';
      case 'aset_inventaris':
        return 'Penatausahaan / Aset & Inventaris';
      case 'keuangan':
        return 'Penatausahaan / Keuangan & Anggaran';
      case 'operasional':
        return 'Seksi Operasional & Pemeliharaan Aliran';
      case 'pembangunan':
        return 'Seksi Pembangunan Rehabilitasi Fisik';
      case 'settings':
        return 'Pengaturan & Manajemen Personil';
      default:
        return 'SIAT Terpadu';
    }
  };

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 md:px-6 py-4 flex items-center justify-between z-25 font-sans">
      
      {/* Left items: Hamburger + Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          id="btn-hamburger"
          type="button"
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-750 hover:text-slate-900 transition-all cursor-pointer active:scale-95 shrink-0"
          title="Buka Menu"
        >
          <Menu className="h-4.5 w-4.5" />
        </button>

        <div className="flex items-center gap-1.5 md:gap-2 text-[10px] md:text-xs truncate">
          <Landmark className="h-3.5 w-3.5 text-sky-650 shrink-0 hidden sm:block" />
          <span className="text-slate-550 font-bold uppercase tracking-wider hidden sm:block shrink-0">{profile.name}</span>
          <ChevronRight className="h-3 w-3 text-slate-450 hidden sm:block shrink-0" />
          <span className="text-slate-800 font-extrabold tracking-wide max-w-[150px] sm:max-w-none truncate">
            {getBreadcrumb()}
          </span>
        </div>
      </div>

      {/* Right details */}
      <div className="flex items-center gap-6 text-xs text-slate-550">
        
        {/* Office Contact widgets (Desktop only) */}
        <div className="hidden lg:flex items-center gap-4 border-r border-slate-200 pr-5">
          <div className="flex items-center gap-1.5 hover:text-slate-900 transition-colors">
            <Mail className="h-3.5 w-3.5 text-sky-600" />
            <span>{profile.email}</span>
          </div>
          <div className="flex items-center gap-1.5 hover:text-slate-900 transition-colors">
            <Phone className="h-3.5 w-3.5 text-emerald-600" />
            <span>{profile.phone}</span>
          </div>
        </div>

        {/* Dynamic Indonesia Clock */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl font-mono text-[11px] font-bold text-slate-800 shadow-xs">
            <Clock className="h-3.5 w-3.5 text-sky-600 shrink-0" />
            <span>{timeStr || '17:03:00'} WIB</span>
          </div>

          <div className="hidden md:flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-[11px] font-bold text-slate-750">
            <Calendar className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
            <span>07 Juni 2026</span>
          </div>
        </div>

      </div>

    </header>
  );
}
