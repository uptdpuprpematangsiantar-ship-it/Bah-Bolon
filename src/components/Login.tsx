/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserAccount } from '../types';
import { ShieldCheck, UserCheck, Lock, Landmark, Droplets, ArrowRight, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';

interface LoginProps {
  onLoginSuccess: (user: UserAccount) => void;
  users: UserAccount[];
  profileName: string;
}

export default function Login({ onLoginSuccess, users, profileName }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState(''); // Simulated password
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'admin' | 'user'>('admin');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Username tidak boleh kosong');
      return;
    }

    // Direct match check in user account list
    const foundUser = users.find(
      (u) => u.username.toLowerCase() === username.toLowerCase() && u.isActive
    );

    if (!foundUser) {
      setError('Akun tidak ditemukan atau berstatus tidak aktif');
      return;
    }

    // Role validation based on chosen tab
    if (foundUser.role !== activeTab) {
      setError(`Akun ini terdaftar sebagai ${foundUser.role.toUpperCase()}. Gunakan tab yang benar.`);
      return;
    }

    setError('');
    onLoginSuccess(foundUser);
  };

  const handleQuickLogin = (role: 'admin' | 'user') => {
    const defaultUserOfRole = users.find((u) => u.role === role && u.isActive);
    if (defaultUserOfRole) {
      setUsername(defaultUserOfRole.username);
      setPassword('admin123'); // Preset simulation
      onLoginSuccess(defaultUserOfRole);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-radial from-slate-900 via-slate-950 to-black p-4 relative overflow-hidden font-sans">
      
      {/* Decorative Wave/Water Background */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path fill="#0284c7" d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,218.7C672,203,768,149,864,138.7C960,128,1056,160,1152,176C1248,192,1344,192,1392,192L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          <path fill="#0ea5e9" d="M0,192L48,181.3C96,171,192,149,288,154.7C384,160,480,192,576,192C672,192,768,160,864,133.3C960,107,1056,85,1152,96C1248,107,1344,149,1392,170.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" opacity="0.3"></path>
        </svg>
      </div>

      <div className="absolute top-10 right-10 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative w-full max-w-5xl bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-850 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        
        {/* Left Column: Cover branding & context */}
        <div className="lg:col-span-5 bg-gradient-to-br from-sky-950 via-sky-900 to-indigo-950 p-8 lg:p-12 flex flex-col justify-between text-slate-100 relative overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-800">
          
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400/10 via-transparent to-transparent"></div>
          
          <div className="relative space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-cyan-400 to-sky-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
                <Droplets className="h-6 w-6 text-white animate-pulse" />
              </div>
              <span className="text-xl font-bold tracking-wider bg-gradient-to-r from-white via-cyan-100 to-sky-200 bg-clip-text text-transparent">
                SIAT
              </span>
            </div>

            <div className="space-y-2 pt-4">
              <p className="text-xs font-semibold text-sky-400 tracking-wider uppercase">Sistem Informasi</p>
              <h2 className="text-2xl font-extrabold tracking-tight text-white leading-tight">
                Administrasi Terpadu
              </h2>
            </div>
          </div>

          <div className="relative my-8 space-y-4">
            <p className="text-sm text-slate-300 leading-relaxed">
              Selamat datang di portal administrasi internal <strong>UPTD Pengelolaan Sumber Daya Air (PSDA) Bah Bolon</strong>.
            </p>
            <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-2">
              <div className="flex gap-2 items-start">
                <Landmark className="h-5 w-5 text-sky-400 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-300 leading-relaxed">
                  {profileName}
                </p>
              </div>
            </div>
          </div>

          <div className="relative text-xs text-slate-400 pt-6 border-t border-white/10">
            Bidang Pengelolaan Sumber Daya Air Wilayah Sungai Bah Bolon
          </div>
        </div>

        {/* Right Column: Multi login form */}
        <div className="lg:col-span-7 p-8 lg:p-12 flex flex-col justify-center bg-slate-900/40">
          
          <div className="mb-8 text-center lg:text-left">
            <h1 className="text-2xl font-bold text-white tracking-tight">Portal Masuk Sistem</h1>
            <p className="text-sm text-slate-400 mt-1">Silakan pilih hak akses anda untuk melanjutkan</p>
          </div>

          {/* Mode Tabs */}
          <div className="grid grid-cols-2 p-1.5 bg-slate-950 rounded-2xl border border-slate-800 mb-8 max-w-sm mx-auto lg:mx-0">
            <button
              id="login-tab-admin"
              type="button"
              onClick={() => { setActiveTab('admin'); setError(''); }}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                activeTab === 'admin'
                  ? 'bg-sky-600 text-white shadow-lg shadow-sky-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="h-4 w-4" />
              Administrator
            </button>
            <button
              id="login-tab-user"
              type="button"
              onClick={() => { setActiveTab('user'); setError(''); }}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                activeTab === 'user'
                  ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserCheck className="h-4 w-4" />
              Seksi / Staff
            </button>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex gap-3 text-rose-300 text-xs items-center"
            >
              <AlertTriangle className="h-5 w-5 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 uppercase tracking-wider">
                Username Akun
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  {activeTab === 'admin' ? <ShieldCheck className="h-5 w-5" /> : <UserCheck className="h-5 w-5" />}
                </span>
                <input
                  id="login-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={activeTab === 'admin' ? 'Contoh: admin' : 'Contoh: user atau pembangunan'}
                  className="w-full pl-11 pr-4 py-3 bg-slate-950/80 hover:bg-slate-950 focus:bg-slate-950 text-white placeholder-slate-500 rounded-xl border border-slate-800 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-all text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 uppercase tracking-wider">
                Kata Sandi
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Lock className="h-5 w-5" />
                </span>
                <input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 bg-slate-950/80 hover:bg-slate-950 focus:bg-slate-950 text-white placeholder-slate-500 rounded-xl border border-slate-800 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-all text-sm"
                />
              </div>
            </div>

            <button
              id="login-submit-btn"
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 active:scale-[0.98] text-white font-semibold rounded-xl tracking-wide shadow-lg shadow-sky-500/10 hover:shadow-sky-500/20 transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer"
            >
              <span>Masuk Sistem Terpadu</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Quick Demo Pre-fills */}
          <div className="mt-8 pt-8 border-t border-slate-800/80">
            <p className="text-xs text-slate-400 mb-3 text-center lg:text-left">
              💡 <strong>Akses Demo Cepat:</strong> Klik tombol peran di bawah untuk langsung menguji fungsi login.
            </p>
            <div className="flex flex-wrap gap-2.5 justify-center lg:justify-start">
              <button
                id="quick-login-admin"
                type="button"
                onClick={() => handleQuickLogin('admin')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-850 text-slate-200 border border-slate-800 hover:border-sky-500/50 text-xs font-medium transition-all group"
              >
                <ShieldCheck className="h-3.5 w-3.5 text-sky-400 group-hover:scale-110 transition-transform" />
                <span>Masuk Admin</span>
              </button>
              <button
                id="quick-login-user-operasional"
                type="button"
                onClick={() => {
                  // Fill with username 'user'
                  setUsername('user');
                  onLoginSuccess(users.find(u => u.username === 'user') || users[1]);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-850 text-slate-200 border border-slate-800 hover:border-cyan-500/50 text-xs font-medium transition-all group"
              >
                <UserCheck className="h-3.5 w-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
                <span>Masuk OP (user)</span>
              </button>
              <button
                id="quick-login-user-pembangunan"
                type="button"
                onClick={() => {
                  // Fill with username 'pembangunan'
                  setUsername('pembangunan');
                  onLoginSuccess(users.find(u => u.username === 'pembangunan') || users[2]);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-850 text-slate-200 border border-slate-800 hover:border-teal-500/50 text-xs font-medium transition-all group"
              >
                <UserCheck className="h-3.5 w-3.5 text-teal-400 group-hover:scale-110 transition-transform" />
                <span>Masuk Pembangunan</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
