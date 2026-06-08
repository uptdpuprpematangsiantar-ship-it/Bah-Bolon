/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { InstansiProfile, UserAccount } from '../types';
import { Settings, Landmark, ShieldCheck, Mail, Upload, Save, UserPlus, ToggleLeft, ToggleRight, Edit2, Trash2, X, Plus, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SettingsProps {
  profile: InstansiProfile;
  onUpdateProfile: (newProfile: InstansiProfile) => void;
  users: UserAccount[];
  onAddUser: (user: UserAccount) => void;
  onUpdateUser: (user: UserAccount) => void;
  onDeleteUser: (id: string) => void;
}

export default function SettingsPage({
  profile,
  onUpdateProfile,
  users,
  onAddUser,
  onUpdateUser,
  onDeleteUser
}: SettingsProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'users'>('profile');
  const [logoPreview, setLogoPreview] = useState<string>(profile.logoUrl);

  // Instansi Profile Form states
  const [name, setName] = useState(profile.name);
  const [address, setAddress] = useState(profile.address);
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone);
  const [headOfficer, setHeadOfficer] = useState(profile.headOfficer);
  const [nip, setNip] = useState(profile.nip);
  const [footerText, setFooterText] = useState(profile.footerText);
  const [copyrightText, setCopyrightText] = useState(profile.copyrightText);

  // User Accounts Form Modal states
  const [isUserFormOpen, setIsUserFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'admin' | 'user'>('user');
  const [department, setDepartment] = useState('');
  const [isActive, setIsActive] = useState(true);

  // Handle Logo Upload file reader (Base64)
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1025) {
        alert('File logo terlalu besar! Maksimal 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setLogoPreview(base64String);
        onUpdateProfile({
          ...profile,
          logoUrl: base64String
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      name,
      address,
      email,
      phone,
      headOfficer,
      nip,
      logoUrl: logoPreview,
      footerText,
      copyrightText
    });
    alert('Profil instansi, catatan kaki, & hak cipta telah berhasil diperbarui!');
  };

  const openAddUser = () => {
    setEditingUser(null);
    setUsername('');
    setFullName('');
    setRole('user');
    setDepartment('Seksi Operasional');
    setIsActive(true);
    setIsUserFormOpen(true);
  };

  const openEditUser = (u: UserAccount) => {
    setEditingUser(u);
    setUsername(u.username);
    setFullName(u.fullName);
    setRole(u.role);
    setDepartment(u.department);
    setIsActive(u.isActive);
    setIsUserFormOpen(true);
  };

  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !fullName.trim() || !department.trim()) {
      alert('Mohon isi semua field wajib!');
      return;
    }

    if (editingUser) {
      // Update
      onUpdateUser({
        id: editingUser.id,
        username: username.toLowerCase().replace(/\s+/g, ''),
        fullName,
        role,
        department,
        isActive
      });
    } else {
      // Create
      // Prevent duplicates
      if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
        alert('Username sudah terdaftar!');
        return;
      }
      const newId = String(users.length + 101);
      onAddUser({
        id: newId,
        username: username.toLowerCase().replace(/\s+/g, ''),
        fullName,
        role,
        department,
        isActive
      });
    }
    setIsUserFormOpen(false);
  };

  const handleDeleteUser = (id: string) => {
    if (id === '1') {
      alert('Gagal! Akun super administrator utama tidak boleh dihapus.');
      return;
    }
    if (confirm('Hapus akun pengguna ini secara permanen dari sistem?')) {
      onDeleteUser(id);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
          <Settings className="h-6 w-6 text-sky-400" />
          Pengaturan Sistem & Profil Instansi
        </h1>
        <p className="text-slate-400 text-xs mt-1">
          Kustomisasi informasi profil badan UPTD, upload logo dinas, konfigurasi hak cipta ekor halaman, serta manajemen akses personil.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-850 gap-1.5 pt-2">
        <button
          id="btn-settings-profile"
          type="button"
          onClick={() => setActiveTab('profile')}
          className={`px-5 py-3 text-xs font-bold tracking-wide uppercase border-b-2 transition-all cursor-pointer ${
            activeTab === 'profile'
              ? 'border-sky-500 text-white bg-sky-550/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <span className="flex items-center gap-2">
            <Landmark className="h-4 w-4 text-sky-400" />
            Profil Instansi & Branding
          </span>
        </button>
        <button
          id="btn-settings-users"
          type="button"
          onClick={() => setActiveTab('users')}
          className={`px-5 py-3 text-xs font-bold tracking-wide uppercase border-b-2 transition-all cursor-pointer ${
            activeTab === 'users'
              ? 'border-sky-500 text-white bg-sky-550/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <span className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            Manajemen Akun Pengguna
          </span>
        </button>
      </div>

      {/* Contents */}
      {activeTab === 'profile' ? (
        <form onSubmit={handleSaveProfile} className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-xs">
          
          {/* Logo uploader card & Preview */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900/30 rounded-2xl border border-slate-850 p-6 flex flex-col items-center justify-center text-center">
              <label className="block text-slate-400 uppercase font-black tracking-wider text-[10px] mb-4">
                Logo Instansi Aktif
              </label>

              {logoPreview ? (
                <div className="relative group mb-4">
                  <img
                    id="instansi-logo-preview"
                    src={logoPreview}
                    alt="Logo Instansi"
                    className="h-28 w-28 rounded-2xl object-contain bg-slate-950 p-3 border border-slate-800"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/85 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                    <label className="cursor-pointer text-sky-400 text-[10px] font-bold uppercase hover:underline">
                      Ganti Logo
                      <input
                        id="logo-file-input-overlay"
                        type="file"
                        accept="image/*"
                        onChange={handleLogoChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              ) : (
                <div className="h-28 w-28 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center text-slate-600 mb-4 p-2">
                  <Landmark className="h-10 w-10 text-slate-500 animate-pulse" />
                  <span className="text-[9px] text-slate-500 mt-2">Bawaan Sistem</span>
                </div>
              )}

              <p className="text-slate-500 text-[10px] mb-4 leading-normal max-w-[200px]">
                Gunakan file format PNG/JPG dengan proporsi persegi (1:1) agar optimal dipasang di kop surat dan sidebar.
              </p>

              <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-850 text-slate-300 border border-slate-800 hover:border-slate-700 font-semibold cursor-pointer transition-all">
                <Upload className="h-3.5 w-3.5" />
                <span>Pilih File Logo</span>
                <input
                  id="logo-file-input"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Note alert */}
            <div className="p-4 bg-sky-500/5 rounded-2xl border border-sky-500/10 text-slate-400 leading-relaxed text-[11px] space-y-2">
              <p className="font-bold text-sky-300 flex items-center gap-1">
                <Info className="h-4 w-4" />
                Penghubung Catatan Kaki
              </p>
              <p>Perubahan pada formulir di sebelah kanan juga akan langsung memperbarui teks hak cipta serta teks kaki (footer) administratif di bawah layar secara instan.</p>
            </div>
          </div>

          {/* Form Fields Column */}
          <div className="lg:col-span-8 bg-slate-900/10 rounded-2xl border border-slate-850 p-6 space-y-6">
            
            <h3 className="text-sm font-bold text-white border-b border-slate-850 pb-2">Detail Identitas Kantor</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-slate-300 font-semibold mb-1.5 uppercase">
                  Nama Resmi Instansi
                </label>
                <input
                  id="instansi-name-input"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 text-white rounded-lg border border-slate-800 focus:border-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1.5 uppercase">
                  Nomor Kontat / Telepon Kantor
                </label>
                <input
                  id="instansi-phone-input"
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 text-white rounded-lg border border-slate-800 focus:border-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1.5 uppercase">
                  Alamat Surat Elektronik (E-Mail)
                </label>
                <input
                  id="instansi-email-input"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 text-white rounded-lg border border-slate-800 focus:border-sky-500 focus:outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-slate-300 font-semibold mb-1.5 uppercase">
                  Alamat Lengkap Kantor
                </label>
                <input
                  id="instansi-address-input"
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 text-white rounded-lg border border-slate-800 focus:border-sky-500 focus:outline-none"
                />
              </div>
            </div>

            <h3 className="text-sm font-bold text-white border-b border-slate-850 pb-2">Atribut Penandatanganan Utama</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5 uppercase">
                  Kepala Unit (Kepala UPTD)
                </label>
                <input
                  id="instansi-head-input"
                  type="text"
                  required
                  value={headOfficer}
                  onChange={(e) => setHeadOfficer(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 text-white rounded-lg border border-slate-800 focus:border-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1.5 uppercase">
                  NIP Kepala Unit
                </label>
                <input
                  id="instansi-nip-input"
                  type="text"
                  required
                  value={nip}
                  onChange={(e) => setNip(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 text-white rounded-lg border border-slate-800 focus:border-sky-500 focus:outline-none font-mono"
                />
              </div>
            </div>

            <h3 className="text-sm font-bold text-white border-b border-slate-850 pb-2">Kaki Surat (Footer) & Hak Cipta</h3>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5 uppercase">
                  Teks Catatan Kaki (Footer Text)
                </label>
                <textarea
                  id="instansi-footer-input"
                  rows={2}
                  required
                  value={footerText}
                  onChange={(e) => setFooterText(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 text-white rounded-lg border border-slate-800 focus:border-sky-500 focus:outline-none"
                ></textarea>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1.5 uppercase">
                  Teks Keterangan Hak Cipta (Copyright Notice)
                </label>
                <input
                  id="instansi-copyright-input"
                  type="text"
                  required
                  value={copyrightText}
                  onChange={(e) => setCopyrightText(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 text-white rounded-lg border border-slate-800 focus:border-sky-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                id="btn-submit-instansi"
                type="submit"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-extrabold shadow-lg shadow-sky-500/10 cursor-pointer text-xs"
              >
                <Save className="h-4 w-4" />
                <span>Simpan Perubahan Atribut</span>
              </button>
            </div>

          </div>

        </form>
      ) : (
        <div className="space-y-6">
          
          {/* Headline user count & add */}
          <div className="flex justify-between items-center">
            <p className="text-slate-400 text-xs">
              Mendaftarkan dan memblokir sementara personil yang berhak mengunggah arsip, data operasional waduk, dan pelaporan pembangunan fisik.
            </p>
            <button
              id="btn-tambah-user"
              type="button"
              onClick={openAddUser}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs cursor-pointer"
            >
              <UserPlus className="h-4 w-4" />
              Tambah Akun Pengguna
            </button>
          </div>

          {/* Users Table */}
          <div className="bg-slate-900/20 rounded-2xl border border-slate-850 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/80 border-b border-slate-850 text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-wider">
                  <th className="py-4 px-4 w-16">No</th>
                  <th className="py-4 px-4">Nama Lengkap</th>
                  <th className="py-4 px-4">Nama Akun (Username)</th>
                  <th className="py-4 px-4">Seksi / Unit Kerja</th>
                  <th className="py-4 px-4">Hak Akses (Role)</th>
                  <th className="py-4 px-4">Status Akun</th>
                  <th className="py-4 px-4 text-right w-24">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850 text-xs md:text-sm text-slate-300">
                {users.map((user, index) => (
                  <tr key={user.id} className="hover:bg-slate-950/40 transition-colors">
                    <td className="py-4 px-4 font-mono text-slate-500">
                      {index + 1}
                    </td>
                    <td className="py-4 px-4 font-semibold text-white">
                      {user.fullName}
                    </td>
                    <td className="py-4 px-4 font-mono text-slate-400 text-xs">
                      {user.username}
                    </td>
                    <td className="py-4 px-4">
                      {user.department}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        user.role === 'admin' 
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' 
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}>
                        {user.role === 'admin' ? 'Super Admin' : 'Seksi / Staff'}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <button
                        id={`btn-toggle-status-${user.id}`}
                        type="button"
                        onClick={() => {
                          if (user.id === '1') {
                            alert('Konfig: Akun super administrator utama tidak boleh di-nonaktifkan.');
                            return;
                          }
                          onUpdateUser({ ...user, isActive: !user.isActive });
                        }}
                        className="inline-flex items-center gap-1.5 cursor-pointer text-xs font-semibold focus:outline-none"
                      >
                        {user.isActive ? (
                          <span className="text-emerald-400 flex items-center gap-1 bg-emerald-500/5 px-2 py-1 border border-emerald-500/10 rounded-md">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                            Aktif
                          </span>
                        ) : (
                          <span className="text-rose-400 flex items-center gap-1 bg-rose-500/5 px-2 py-1 border border-rose-500/10 rounded-md">
                            <span className="h-1.5 w-1.5 rounded-full bg-rose-400"></span>
                            Ditangguhkan
                          </span>
                        )}
                      </button>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="inline-flex gap-1">
                        <button
                          id={`btn-edit-user-${user.id}`}
                          type="button"
                          onClick={() => openEditUser(user)}
                          className="p-1 px-2 rounded hover:bg-slate-800 text-sky-400 hover:text-white transition-all text-xs cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          id={`btn-delete-user-${user.id}`}
                          type="button"
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-1 px-2 rounded hover:bg-rose-500/10 text-rose-400 hover:text-rose-350 transition-all text-xs cursor-pointer"
                          title="Hapus"
                          disabled={user.id === '1'}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* Slide Drawer User Form Modal */}
      <AnimatePresence>
        {isUserFormOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsUserFormOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            ></motion.div>

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md bg-slate-900 border-l border-slate-800 h-full shadow-2xl flex flex-col z-10"
            >
              {/* Header */}
              <div className="p-6 bg-slate-950 border-b border-slate-800 flex justify-between items-center">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-emerald-400" />
                    {editingUser ? 'Ubah Informasi Akun' : 'Daftarkan Akun Pengguna'}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Definisikan perizinan seksi teknis di UPTD Bah Bolon
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsUserFormOpen(false)}
                  className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleUserSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
                
                {/* Username */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1.5 uppercase">
                    Username / Kunci Unik <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="userform-username"
                    type="text"
                    required
                    disabled={!!editingUser}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Contoh: staff_op"
                    className="w-full px-3 py-2 bg-slate-950 text-white rounded-lg border border-slate-800 focus:border-sky-500 focus:outline-none font-mono disabled:opacity-50"
                  />
                  {!editingUser && <p className="text-[10px] text-slate-500 mt-1">Hanya huruf kecil tanpa spasi.</p>}
                </div>

                {/* Nama Lengkap */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1.5 uppercase">
                    Nama Lengkap <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="userform-fullname"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Contoh: Ir. Rendi Pratama"
                    className="w-full px-3 py-2 bg-slate-950 text-white rounded-lg border border-slate-800 focus:border-sky-500 focus:outline-none"
                  />
                </div>

                {/* Seksi / Unit Kerja */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1.5 uppercase">
                    Seksi / Sub Bagian Kerja <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="userform-department"
                    type="text"
                    required
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="Contoh: Seksi Operasional & Pemeliharaan"
                    className="w-full px-3 py-2 bg-slate-950 text-white rounded-lg border border-slate-800 focus:border-sky-500 focus:outline-none"
                  />
                </div>

                {/* Hak Akses Dropdown */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1.5 uppercase">
                    Peran Otorisasi (Role)
                  </label>
                  <select
                    id="userform-role"
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 text-white rounded-lg border border-slate-800 focus:border-sky-500 focus:outline-none cursor-pointer text-xs"
                  >
                    <option value="user">Seksi / Staff Biasa (Akses Terbatas Terhadap Profil Kantor)</option>
                    <option value="admin">Super Administrator (Akses Penuh Seluruh Menu & Setelan)</option>
                  </select>
                </div>

                {/* Status Aktif */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1.5 uppercase">
                    Keaktifan Akun
                  </label>
                  <div className="flex items-center gap-3 bg-slate-950 p-3 rounded-lg border border-slate-850">
                    <button
                      id="btn-userform-active-toggle"
                      type="button"
                      onClick={() => setIsActive(!isActive)}
                      className="text-slate-400 hover:text-white cursor-pointer"
                    >
                      {isActive ? (
                        <ToggleRight className="h-8 w-8 text-emerald-400" />
                      ) : (
                        <ToggleLeft className="h-8 w-8 text-slate-600" />
                      )}
                    </button>
                    <div>
                      <p className="text-slate-200 font-semibold">{isActive ? 'Izin Akun Aktif' : 'Izin Akun Ditangguhkan'}</p>
                      <p className="text-slate-500 text-[10px]">Tangguhkan akun untuk membatasi akses login instan.</p>
                    </div>
                  </div>
                </div>

                {/* Custom Password Alert */}
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-850 text-slate-500 text-[10px] leading-relaxed">
                  🔐 Keamanan Sandbox: Sandbox template ini mensimulasikan otentikasi login dengan memverifikasi kecocokan username kustom Anda. Kata sandi sandbox standar adalah bebas atau `admin123`.
                </div>

                {/* Bottom Submit Buttons */}
                <div className="pt-6 border-t border-slate-850 flex items-center justify-end gap-3 font-sans">
                  <button
                    id="userform-cancel"
                    type="button"
                    onClick={() => setIsUserFormOpen(false)}
                    className="px-4 py-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white font-semibold cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    id="userform-save"
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold shadow-lg shadow-emerald-500/10 cursor-pointer"
                  >
                    <Save className="h-3.5 w-3.5" />
                    <span>{editingUser ? 'Simpan Perubahan' : 'Buat Akun'}</span>
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
