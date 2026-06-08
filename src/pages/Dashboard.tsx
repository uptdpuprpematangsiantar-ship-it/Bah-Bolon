/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { LayoutDashboard, Sparkles, Code2, Activity, User, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

interface DashboardProps {
  penatausahaanList?: any[];
  operasionalList?: any[];
  pembangunanList?: any[];
  activeUser: { fullName: string; role: string; department: string };
}

export default function Dashboard({ activeUser }: DashboardProps) {
  return (
    <div className="space-y-8 font-sans">
      {/* Premium Welcome Header with Motion */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative bg-gradient-to-r from-sky-900 via-indigo-950 to-slate-950 p-6 lg:p-8 rounded-3xl border border-slate-800 shadow-xl overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_right,_var(--tw-gradient-stops))] from-sky-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-xs font-semibold text-sky-400">
              <Activity className="h-3 w-3 animate-pulse" />
              Sistem Port Aktif & Bersih
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Selamat Datang, {activeUser.fullName}
            </h1>
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              Anda masuk sebagai <strong className="text-sky-400 uppercase tracking-wide text-xs">{activeUser.role}</strong> pada <strong className="text-sky-300">{activeUser.department}</strong>. Seluruh basis data transaksi telah berhasil dikosongkan dan siap untuk dikonstruksi ulang sesuai keinginan Anda.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0 bg-slate-900/60 backdrop-blur border border-slate-800 p-4 rounded-2xl">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Status Akun</p>
              <p className="text-sm font-semibold text-white">{activeUser.role === 'admin' ? 'Super Administrator' : 'Staff Teknis'}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Empty Customizable Canvas Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Empty workspace card */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <LayoutDashboard className="h-5 w-5 text-sky-600" />
                  Ruang Kerja Desain Kustom Dashboard
                </h3>
                <p className="text-slate-500 text-xs">Kanvas kosong ini siap diisi dengan visualisasi grafik, ringkasan data, atau rekapitulasi pintas.</p>
              </div>
              <span className="self-start sm:self-auto text-[10px] px-2.5 py-1 bg-sky-500/10 text-sky-700 font-bold border border-sky-100 rounded-lg uppercase tracking-wider">
                Siap Didesain
              </span>
            </div>

            <div className="border border-dashed border-slate-300 rounded-2xl p-8 md:p-12 flex flex-col items-center justify-center text-center space-y-4">
              <div className="h-14 w-14 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 shadow-2xs">
                <Code2 className="h-7 w-7 text-slate-400" />
              </div>
              <div className="space-y-1.5 max-w-sm">
                <p className="text-sm font-extrabold text-slate-800">Menunggu Permintaan Desain Anda</p>
                <p className="text-xs text-slate-500 leading-relaxed text-center">
                  Halaman ringkasan ini dapat diisi dengan widget analisis interaktif, charts perbandingan bulanan, atau pintasan pelaporan aktivitas seputar UPTD PUPR Pematangsiantar.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Information guidelines */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6 shadow-sm">
            <div>
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-sky-600" />
                Daftar Gagasan Desain:
              </h4>
              <p className="text-slate-500 text-[11px] mt-0.5">Mintalah salah satu ide di bawah ini di chat:</p>
            </div>

            <div className="space-y-4 divide-y divide-slate-100 text-xs text-slate-650">
              <div className="space-y-1 pt-1">
                <p className="font-bold text-slate-800">1. Grafik Tren Data Utama</p>
                <p className="text-slate-550 leading-relaxed">Diagram garis/batang yang merekam fluktuasi debit air bulanan atau grafik progres pembangunan kontraktor.</p>
              </div>
              <div className="space-y-1 pt-4">
                <p className="font-bold text-slate-800">2. Quick Action Shortcut Grid</p>
                <p className="text-slate-550 leading-relaxed">Tombol aksi cepat untuk menambah arsip surat masuk, mengecek status pintu air, atau menambah aset baru.</p>
              </div>
              <div className="space-y-1 pt-4">
                <p className="font-bold text-slate-800">3. Real-Time Status Feed</p>
                <p className="text-slate-550 leading-relaxed">Log atau riwayat aktivitas terkini yang mencatat setiap kali user menginputkan data ke sistem.</p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] text-slate-600 space-y-1.5">
              <p className="font-bold text-slate-800 flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                Catatan Penyimpanan
              </p>
              <p className="leading-relaxed">Sistem engine client-side terdeteksi bersih dan siap menerima sekumpulan skema data baru Anda.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
