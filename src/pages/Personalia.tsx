/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Plus,
  Trash2,
  Edit3,
  Sparkles,
  Calendar,
  MapPin,
  Briefcase,
  Heart,
  BookOpen,
  Info,
  SlidersHorizontal,
  ChevronDown,
  Printer,
  X,
  FileCheck,
  UserCheck,
  UserCheck2,
  ShieldAlert,
  Award
} from 'lucide-react';
import { PersonaliaItem } from '../types';

interface PersonaliaProps {
  items: PersonaliaItem[];
  onAddItem: (item: PersonaliaItem) => void;
  onUpdateItem: (item: PersonaliaItem) => void;
  onDeleteItem: (id: string) => void;
}

// Full Golongan Ruang List matching INDONESIAN ASN Structure
const GOLONGAN_OPTIONS = [
  { value: 'Honor', label: 'Honor (Non-ASN / Kontrak)' },
  { value: 'PPPK', label: 'PPPK (Pegawai Perjanjian Kerja)' },
  { value: 'I/a', label: 'Golongan I/a - Juru Muda' },
  { value: 'I/b', label: 'Golongan I/b - Juru Muda Tingkat I' },
  { value: 'I/c', label: 'Golongan I/c - Juru' },
  { value: 'I/d', label: 'Golongan I/d - Juru Tingkat I' },
  { value: 'II/a', label: 'Golongan II/a - Pengatur Muda' },
  { value: 'II/b', label: 'Golongan II/b - Pengatur Muda Tingkat I' },
  { value: 'II/c', label: 'Golongan II/c - Pengatur' },
  { value: 'II/d', label: 'Golongan II/d - Pengatur Tingkat I' },
  { value: 'III/a', label: 'Golongan III/a - Penata Muda' },
  { value: 'III/b', label: 'Golongan III/b - Penata Muda Tingkat I' },
  { value: 'III/c', label: 'Golongan III/c - Penata' },
  { value: 'III/d', label: 'Golongan III/d - Penata Tingkat I' },
  { value: 'IV/a', label: 'Golongan IV/a - Pembina' },
  { value: 'IV/b', label: 'Golongan IV/b - Pembina Tingkat I' },
  { value: 'IV/c', label: 'Golongan IV/c - Pembina Utama Muda' },
  { value: 'IV/d', label: 'Golongan IV/d - Pembina Utama Madya' },
  { value: 'IV/e', label: 'Golongan IV/e - Pembina Utama' }
];

// Helper to determine rank weight (higher is higher rank)
export const getPangkatRank = (pangkat: string): number => {
  const list = [
    'Honor', 
    'PPPK', 
    'I/a', 'I/b', 'I/c', 'I/d', 
    'II/a', 'II/b', 'II/c', 'II/d', 
    'III/a', 'III/b', 'III/c', 'III/d', 
    'IV/a', 'IV/b', 'IV/c', 'IV/d', 'IV/e'
  ];
  const index = list.indexOf(pangkat);
  return index !== -1 ? index : -1;
};

export default function Personalia({
  items,
  onAddItem,
  onUpdateItem,
  onDeleteItem
}: PersonaliaProps) {
  // Load dynamic profile name from localStorage
  const profileName = React.useMemo(() => {
    try {
      const saved = localStorage.getItem('siat_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.name) return parsed.name;
      }
    } catch (e) {}
    return 'UPTD PUPR Pematangsiantar';
  }, []);

  // Navigation Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGolongan, setFilterGolongan] = useState('ALL');
  const [filterGender, setFilterGender] = useState('ALL');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PersonaliaItem | null>(null);

  // Form Fields State
  const [nama, setNama] = useState('');
  const [nip, setNip] = useState('');
  const [pangkatGolongan, setPangkatGolongan] = useState('Honor');
  const [jabatan, setJabatan] = useState('');
  const [tempatLahir, setTempatLahir] = useState('');
  const [tanggalLahir, setTanggalLahir] = useState('');
  const [jenisKelamin, setJenisKelamin] = useState('Laki-laki');
  const [agama, setAgama] = useState('Islam');
  const [statusPerkawinan, setStatusPerkawinan] = useState('Kawin');

  // Helper: auto-extract birthdate YYYY-MM-DD from clean NIP (digits only)
  const extractBirthdateFromNip = (nipStr: string): string => {
    const cleanNip = nipStr.replace(/[^0-9]/g, '');
    if (cleanNip.length >= 8) {
      const year = cleanNip.substring(0, 4);
      const month = cleanNip.substring(4, 6);
      const day = cleanNip.substring(6, 8);
      
      const yearNum = parseInt(year, 10);
      const monthNum = parseInt(month, 10);
      const dayNum = parseInt(day, 10);
      
      if (
        yearNum >= 1940 && yearNum <= 2040 &&
        monthNum >= 1 && monthNum <= 12 &&
        dayNum >= 1 && dayNum <= 31
      ) {
        return `${year}-${month}-${day}`;
      }
    }
    return '';
  };

  // Listen to NIP value change for real-time birthdate extraction
  const handleNipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setNip(val);
    
    const birthdate = extractBirthdateFromNip(val);
    if (birthdate) {
      setTanggalLahir(birthdate);
    }
  };

  // Triggered when opening modal to add a new employee
  const openAddModal = () => {
    setEditingItem(null);
    setNama('');
    setNip('');
    setPangkatGolongan('Honor');
    setJabatan('');
    setTempatLahir('');
    setTanggalLahir('');
    setJenisKelamin('Laki-laki');
    setAgama('Islam');
    setStatusPerkawinan('Kawin');
    setIsModalOpen(true);
  };

  // Triggered when opening modal to edit an existing employee
  const openEditModal = (item: PersonaliaItem) => {
    setEditingItem(item);
    setNama(item.nama);
    setNip(item.nip);
    setPangkatGolongan(item.pangkatGolongan);
    setJabatan(item.jabatan);
    setTempatLahir(item.tempatLahir);
    setTanggalLahir(item.tanggalLahir);
    setJenisKelamin(item.jenisKelamin);
    setAgama(item.agama);
    setStatusPerkawinan(item.statusPerkawinan);
    setIsModalOpen(true);
  };

  // Form Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nama.trim() || !jabatan.trim() || !tempatLahir.trim() || !tanggalLahir.trim()) {
      alert('Mohon lengkapi semua kolom wajib (*) yang ditandai.');
      return;
    }

    const newItem: PersonaliaItem = {
      id: editingItem ? editingItem.id : 'st-' + Date.now(),
      nama,
      nip: nip.trim() || '-',
      pangkatGolongan,
      jabatan,
      tempatLahir,
      tanggalLahir,
      jenisKelamin,
      agama,
      statusPerkawinan
    };

    if (editingItem) {
      onUpdateItem(newItem);
    } else {
      onAddItem(newItem);
    }

    setIsModalOpen(false);
  };

  // Helper: Format tanggal ke teks bahasa Indonesia (contoh: 25 Oktober 1985)
  const formatTanggalIndo = (tanggalStr: string): string => {
    if (!tanggalStr || tanggalStr === '-') return '-';
    const parts = tanggalStr.split('-');
    if (parts.length !== 3) return tanggalStr;
    
    const [year, month, day] = parts;
    const namaBulan = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    const idx = parseInt(month, 10) - 1;
    if (idx >= 0 && idx < 12) {
      return `${parseInt(day, 10)} ${namaBulan[idx]} ${year}`;
    }
    return tanggalStr;
  };

  // Load realistic samples in case local storage or items are initially empty
  const handleLoadSamples = () => {
    const samples: PersonaliaItem[] = [
      {
        id: 'st-sample-1',
        nama: 'Ir. Muhammad Sofyan, M.T.',
        nip: '197408222002121004',
        pangkatGolongan: 'IV/b',
        jabatan: 'Kepala ' + profileName,
        tempatLahir: 'Medan',
        tanggalLahir: '1974-08-22',
        jenisKelamin: 'Laki-laki',
        agama: 'Islam',
        statusPerkawinan: 'Kawin'
      },
      {
        id: 'st-sample-2',
        nama: 'Rian Hidayat, S.T.',
        nip: '198510252011011002',
        pangkatGolongan: 'III/c',
        jabatan: 'Kasi Operasional & Pemeliharaan',
        tempatLahir: 'Pematangsiantar',
        tanggalLahir: '1985-10-25',
        jenisKelamin: 'Laki-laki',
        agama: 'Islam',
        statusPerkawinan: 'Kawin'
      },
      {
        id: 'st-sample-3',
        nama: 'Siti Rahma, M.Eng',
        nip: '199104122019032014',
        pangkatGolongan: 'III/b',
        jabatan: 'Kasi Pembangunan & Rehabilitasi',
        tempatLahir: 'Binjai',
        tanggalLahir: '1991-04-12',
        jenisKelamin: 'Perempuan',
        agama: 'Islam',
        statusPerkawinan: 'Kawin'
      },
      {
        id: 'st-sample-4',
        nama: 'Dewi Sartika, S.AP',
        nip: '199308152021212005',
        pangkatGolongan: 'PPPK',
        jabatan: 'Analis Kepegawaian & Tata Usaha',
        tempatLahir: 'Tebing Tinggi',
        tanggalLahir: '1993-08-15',
        jenisKelamin: 'Perempuan',
        agama: 'Islam',
        statusPerkawinan: 'Kawin'
      },
      {
        id: 'st-sample-5',
        nama: 'Heri Setiawan',
        nip: '-',
        pangkatGolongan: 'Honor',
        jabatan: 'Mekanik & Penjaga Pintu Water Intake',
        tempatLahir: 'Pematangsiantar',
        tanggalLahir: '1996-12-18',
        jenisKelamin: 'Laki-laki',
        agama: 'Kristen Protestan',
        statusPerkawinan: 'Belum Kawin'
      }
    ];

    // Load each one by calling prop action
    samples.forEach(s => onAddItem(s));
  };

  // Statistics calculation helpers
  const totalCount = items.length;
  const pnsCount = items.filter(x => x.pangkatGolongan !== 'Honor' && x.pangkatGolongan !== 'PPPK').length;
  const pppkCount = items.filter(x => x.pangkatGolongan === 'PPPK').length;
  const honorerCount = items.filter(x => x.pangkatGolongan === 'Honor').length;

  // Print friendly view creator
  const handlePrintStaffList = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const htmlContent = `
      <html>
        <head>
          <title>Daftar Aparatur & Pegawai - ${profileName}</title>
          <style>
            body { font-family: 'Inter', sans-serif; padding: 30px; color: #1e293b; }
            h2 { text-align: center; margin-bottom: 5px; text-transform: uppercase; }
            h3 { text-align: center; font-weight: normal; margin-top: 0; font-size: 14px; margin-bottom: 25px; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 11px; }
            th, td { border: 1px solid #cbd5e1; padding: 8px 10px; text-align: left; }
            th { bg-color: #f1f5f9; font-weight: bold; }
            tr:nth-child(even) { background-color: #f8fafc; }
            .badge { display: inline-block; padding: 2px 5px; font-weight: bold; border-radius: 4px; font-size: 9px; }
            .badge-pns { background-color: #f5f3ff; color: #5b21b6; border: 1px solid #ddd6fe; }
            .badge-pppk { background-color: #f0fdf4; color: #166534; border: 1px solid #bbf7d0; }
            .badge-honor { background-color: #eff6ff; color: #1e40af; border: 1px solid #bfdbfe; }
          </style>
        </head>
        <body onload="window.print()">
          <h2>\${profileName.toUpperCase()}</h2>
          <h3>Daftar Administrasi Personalia & Kepegawaian (Daftar Urut Kepangkatan)</h3>
          <table>
            <thead>
              <tr>
                <th style="width: 5%">No</th>
                <th style="width: 20%">Nama Lengkap & NIP</th>
                <th style="width: 15%">Pangkat / Golongan</th>
                <th style="width: 20%">Jabatan Tertera</th>
                <th style="width: 15%">Tempat / Tgl Lahir</th>
                <th style="width: 8%">Gender</th>
                <th style="width: 8%">Agama</th>
                <th style="width: 9%">Pernikahan</th>
              </tr>
            </thead>
            <tbody>
              ${[...items]
                .sort((a, b) => {
                  const diff = getPangkatRank(b.pangkatGolongan) - getPangkatRank(a.pangkatGolongan);
                  if (diff !== 0) return diff;
                  return a.nama.localeCompare(b.nama);
                })
                .map((item, idx) => `
                <tr>
                  <td>${idx + 1}</td>
                  <td>
                    <strong>${item.nama}</strong><br/>
                    <span style="font-family: monospace; color: #64748b;">NIP: ${item.nip}</span>
                  </td>
                  <td>
                    <span class="badge ${item.pangkatGolongan === 'Honor' ? 'badge-honor' : item.pangkatGolongan === 'PPPK' ? 'badge-pppk' : 'badge-pns'}">
                      ${item.pangkatGolongan}
                    </span>
                  </td>
                  <td>${item.jabatan}</td>
                  <td>${item.tempatLahir}, ${formatTanggalIndo(item.tanggalLahir)}</td>
                  <td>${item.jenisKelamin}</td>
                  <td>${item.agama}</td>
                  <td>${item.statusPerkawinan}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  // Filter and Search logic
  const filteredItems = items.filter(item => {
    // 1. Searched properties
    const matchesSearch = 
      item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.nip.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.jabatan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tempatLahir.toLowerCase().includes(searchTerm.toLowerCase());

    // 2. Filter Golongan
    const matchesGolongan = 
      filterGolongan === 'ALL' ||
      (filterGolongan === 'PNS' && item.pangkatGolongan !== 'Honor' && item.pangkatGolongan !== 'PPPK') ||
      (filterGolongan === 'PPPK' && item.pangkatGolongan === 'PPPK') ||
      (filterGolongan === 'Honor' && item.pangkatGolongan === 'Honor') ||
      (item.pangkatGolongan === filterGolongan);

    // 3. Filter Gender
    const matchesGender = filterGender === 'ALL' || item.jenisKelamin === filterGender;

    return matchesSearch && matchesGolongan && matchesGender;
  });

  // Sort from highest rank/golongan to lowest
  const sortedFilteredItems = React.useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      const diff = getPangkatRank(b.pangkatGolongan) - getPangkatRank(a.pangkatGolongan);
      if (diff !== 0) return diff;
      // Secondary sort: by name alphabetically if same rank
      return a.nama.localeCompare(b.nama);
    });
  }, [filteredItems]);

  return (
    <div className="space-y-6 font-sans text-slate-800 p-1">
      {/* 1. Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-150 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-700 flex items-center justify-center shrink-0">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">
                Kepegawaian & Personalia
              </h1>
              <p className="text-slate-550 text-xs mt-0.5 leading-relaxed">
                Manajemen administrasi pegawai ASN, PPPK, dan tenaga Honorer {profileName} secara teratur.
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handlePrintStaffList}
            className="px-3.5 py-1.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-all flex items-center gap-1.5 cursor-pointer text-xs"
          >
            <Printer className="h-4 w-4 text-slate-500" />
            <span>Cetak PDF / Daftar</span>
          </button>
          <button
            type="button"
            onClick={openAddModal}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-750 text-white font-heavy rounded-xl transition-all flex items-center gap-1.5 cursor-pointer text-xs shadow-xs"
          >
            <Plus className="h-4 w-4" />
            <span>Tambah Pegawai Baru</span>
          </button>
        </div>
      </div>

      {/* 2. Statistical Highlights */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Total Workers */}
        <div className="bg-white border border-slate-150 p-4 rounded-2xl flex items-center gap-3 shadow-3xs">
          <div className="h-9 w-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 shrink-0">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Staf</p>
            <p className="text-lg font-black text-slate-900">{totalCount} <span className="text-xs text-slate-400 font-medium">Jiwa</span></p>
          </div>
        </div>

        {/* PNS Highlight */}
        <div className="bg-white border border-slate-150 p-4 rounded-2xl flex items-center gap-3 shadow-3xs">
          <div className="h-9 w-9 rounded-xl bg-violet-50 border border-violet-150 flex items-center justify-center text-violet-600 shrink-0">
            <Award className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">ASN (PNS)</p>
            <p className="text-lg font-black text-slate-900">{pnsCount} <span className="text-xs text-slate-400 font-medium">Orang</span></p>
          </div>
        </div>

        {/* PPPK Highlight */}
        <div className="bg-white border border-slate-150 p-4 rounded-2xl flex items-center gap-3 shadow-3xs">
          <div className="h-9 w-9 rounded-xl bg-emerald-50 border border-emerald-150 flex items-center justify-center text-emerald-600 shrink-0">
            <UserCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">PPPK</p>
            <p className="text-lg font-black text-slate-900">{pppkCount} <span className="text-xs text-slate-400 font-medium">Orang</span></p>
          </div>
        </div>

        {/* Honorer Highlight */}
        <div className="bg-white border border-slate-150 p-4 rounded-2xl flex items-center gap-3 shadow-3xs">
          <div className="h-9 w-9 rounded-xl bg-sky-50 border border-sky-150 flex items-center justify-center text-sky-600 shrink-0">
            <UserCheck2 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Tenaga Honor</p>
            <p className="text-lg font-black text-slate-900">{honorerCount} <span className="text-xs text-slate-400 font-medium">Orang</span></p>
          </div>
        </div>
      </div>

      {/* 3. Search and Action Filters Panel */}
      <div className="bg-white border border-slate-200 rounded-3xl p-4.5 space-y-3.5 shadow-2xs">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Main Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari pegawai berdasarkan nama, NIP, jabatan, atau tempat lahir..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 hover:border-slate-300 focus:bg-white rounded-xl focus:outline-none focus:border-teal-500 font-semibold text-slate-800 text-xs transition-all"
            />
          </div>

          {/* Golongan dropdown filter */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-slate-450 shrink-0" />
            <select
              value={filterGolongan}
              onChange={(e) => setFilterGolongan(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-xs font-semibold rounded-xl px-3 py-2.5 focus:outline-none focus:border-teal-500 text-slate-700"
            >
              <option value="ALL">Semua Tingkat / Golongan</option>
              <option value="PNS">Khusus ASN (Filter PNS Saja)</option>
              <option value="PPPK">Khusus PPPK</option>
              <option value="Honor">Khusus Honorer / Non-ASN</option>
              <option disabled>──────────</option>
              {GOLONGAN_OPTIONS.filter(o => o.value !== 'Honor' && o.value !== 'PPPK').map((gen) => (
                <option key={gen.value} value={gen.value}>{gen.label}</option>
              ))}
            </select>
          </div>

          {/* Gender dropdown filter */}
          <div>
            <select
              value={filterGender}
              onChange={(e) => setFilterGender(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-xs font-semibold rounded-xl px-3 py-2.5 focus:outline-none focus:border-teal-500 text-slate-700 w-full md:w-auto"
            >
              <option value="ALL">Semua Gender</option>
              <option value="Laki-laki">Laki-Laki</option>
              <option value="Perempuan">Perempuan</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. Personnel List or Table */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        {items.length === 0 ? (
          <div className="p-12 text-center space-y-6">
            <div className="h-14 w-14 rounded-2xl bg-teal-50 border border-teal-100 text-teal-600 flex items-center justify-center mx-auto shadow-3xs">
              <Users className="h-7 w-7" />
            </div>
            <div className="space-y-1.5 max-w-sm mx-auto">
              <h3 className="text-sm font-black text-slate-900">Database Personalia UPTD Masih Kosong</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Belum ada data pekerja yang tercatat di penyimpanan lokal. Silakan tambahkan personalia baru secara manual atau muat berkas percontohan yang disediakan.
              </p>
            </div>
            <div className="flex justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={handleLoadSamples}
                className="px-4 py-2 bg-teal-50 hover:bg-teal-100 border border-teal-200 text-teal-700 font-extrabold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-3xs transition-all"
              >
                <Sparkles className="h-4 w-4 text-teal-600" />
                <span>Simulasikan Data Percontohan</span>
              </button>
              <button
                type="button"
                onClick={openAddModal}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-heavy rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-3xs transition-all"
              >
                <Plus className="h-4 w-4" />
                <span>Daftarkan Pegawai</span>
              </button>
            </div>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="p-10 text-center space-y-2">
            <div className="text-amber-500 text-xl font-bold">Tidak Menemukan Kecocokan</div>
            <p className="text-xs text-slate-450 max-w-xs mx-auto">
              Kata kunci pencarian atau filter yang Anda terapkan tidak menghasilkan data pegawai manapun. Coba periksa kembali filter Anda.
            </p>
          </div>
        ) : (
          /* Bookkeeping Staff Data Table */
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse min-w-[1100px] text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-150 text-[10px] uppercase font-black text-slate-450 tracking-wider">
                  <th className="px-6 py-3.5 font-bold">Nama Lengkap & NIP</th>
                  <th className="px-6 py-3.5 font-bold">Pangkat / Golongan</th>
                  <th className="px-6 py-3.5 font-bold">Jabatan Organisasi</th>
                  <th className="px-6 py-3.5 font-bold">Tempat & Tanggal Lahir</th>
                  <th className="px-4 py-3.5 font-bold text-center">Jenis Kelamin</th>
                  <th className="px-4 py-3.5 font-bold text-center">Agama</th>
                  <th className="px-4 py-3.5 font-bold text-center">Status Pernikahan</th>
                  <th className="px-6 py-3.5 font-bold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {sortedFilteredItems.map((item) => {
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition-colors align-middle">
                      {/* 1. Nama Lengkap & NIP */}
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <p className="font-extrabold text-slate-850 text-xs leading-snug">{item.nama}</p>
                          <p className="text-[10px] font-mono text-slate-450" title="Nomor Induk Pegawai">
                            NIP: <span className="font-black text-slate-650">{item.nip}</span>
                          </p>
                        </div>
                      </td>

                      {/* 2. Pangkat / Golongan */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-black border uppercase tracking-tight ${
                            item.pangkatGolongan === 'Honor'
                              ? 'bg-blue-50 text-blue-700 border-blue-150'
                              : item.pangkatGolongan === 'PPPK'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-150'
                              : 'bg-violet-50 text-violet-700 border-violet-150'
                          }`}>
                            {item.pangkatGolongan}
                          </span>
                          <p className="text-[9px] text-slate-400 font-medium">
                            {item.pangkatGolongan === 'Honor' 
                              ? 'Jasa Kontrak Daerah' 
                              : item.pangkatGolongan === 'PPPK' 
                              ? 'Pegawai Kontrak Nasional' 
                              : `Pangkat Gol. ${item.pangkatGolongan}`
                            }
                          </p>
                        </div>
                      </td>

                      {/* 3. Jabatan */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-xs text-slate-700">
                          <Briefcase className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          <span className="font-semibold leading-normal break-words max-w-[200px]" title={item.jabatan}>
                            {item.jabatan}
                          </span>
                        </div>
                      </td>

                      {/* 4. Tempat & Tanggal Lahir (auto-filled) */}
                      <td className="px-6 py-4">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1 text-[11px] font-bold text-slate-700">
                            <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                            <span>{item.tempatLahir}</span>
                          </div>
                          <div className="flex items-center gap-1 text-[10px] text-slate-450 font-medium">
                            <Calendar className="h-3 w-3 shrink-0 text-teal-600" />
                            <span>{formatTanggalIndo(item.tanggalLahir)}</span>
                          </div>
                        </div>
                      </td>

                      {/* 5. Jenis Kelamin */}
                      <td className="px-4 py-4 text-center whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.jenisKelamin === 'Laki-laki'
                            ? 'bg-amber-50 text-amber-700 border border-amber-100'
                            : 'bg-rose-50 text-rose-700 border border-rose-100'
                        }`}>
                          {item.jenisKelamin}
                        </span>
                      </td>

                      {/* 6. Agama */}
                      <td className="px-4 py-4 text-center whitespace-nowrap font-semibold text-slate-700">
                        {item.agama}
                      </td>

                      {/* 7. Status Perkawinan */}
                      <td className="px-4 py-4 text-center whitespace-nowrap font-medium text-slate-650">
                        {item.statusPerkawinan}
                      </td>

                      {/* 8. Aksi */}
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEditModal(item)}
                            title="Edit data pegawai"
                            className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:border-slate-300 transition-colors cursor-pointer"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Apakah Anda yakin ingin menghapus data kepegawaian untuk "${item.nama}"? Data yang sudah dihapus tidak dapat dipulihkan.`)) {
                                onDeleteItem(item.id);
                              }
                            }}
                            title="Hapus data"
                            className="p-1.5 rounded-lg border border-red-200 bg-white text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 5. Employee Form Modal (Add & Edit) */}
      {isModalOpen && (
        <div id="staff-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs text-xs overflow-y-auto">
          <div id="staff-modal-card" className="w-full max-w-2xl bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col my-8">
            {/* Modal header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-600 flex items-center justify-center font-black shrink-0">
                  <Users className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm leading-tight">
                    {editingItem ? 'Perbarui Data Kepegawaian' : 'Daftarkan Pegawai Baru'}
                  </h3>
                  <p className="text-[10px] text-slate-450 mt-0.5">
                    {editingItem ? 'Modifikasi profil staf untuk memperbarui status administrasi.' : 'Tambahkan biodata lengkap pegawai baru ke sistem.'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-450 hover:text-slate-700 transition-all cursor-pointer"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
              
              {/* Double Column Row 1: Name and NIP */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1.5">
                    Nama Lengkap & Gelar Akademik <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Rian Hidayat, S.T."
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-teal-500 text-slate-800 font-semibold"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-slate-700 font-bold block">
                      NIP (Nomor Induk Pegawai)
                    </label>
                    <span className="text-[9px] text-violet-600 font-bold bg-violet-50 px-1.5 rounded">Auto-isi tgl lahir</span>
                  </div>
                  <input
                    type="text"
                    placeholder="Contoh: 198510252011011002 (Ketik '-' dsb jika tidak ada)"
                    value={nip}
                    onChange={handleNipChange}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-teal-500 text-slate-850 font-mono font-medium"
                  />
                </div>
              </div>

              {/* Double Column Row 2: Pangkat & Jabatan */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1.5">
                    Pangkat & Golongan Ruang <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={pangkatGolongan}
                    onChange={(e) => setPangkatGolongan(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-teal-500 text-slate-800 font-semibold cursor-pointer"
                  >
                    {GOLONGAN_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1.5">
                    Jabatan Organisasi <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Pengamat Operasional & Juru Air"
                    value={jabatan}
                    onChange={(e) => setJabatan(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-teal-500 text-slate-800 font-semibold"
                  />
                </div>
              </div>

              {/* Birth Details Field Group (Auto calculated via NIP) */}
              <div className="border-l-3 border-teal-500 pl-3 bg-teal-50/40 p-3.5 rounded-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="col-span-1 md:col-span-2 space-y-0.5">
                    <p className="font-bold text-xs text-teal-850">Tempat & Tanggal Lahir</p>
                    <p className="text-[9px] text-slate-400">
                      Jika NIP terdeteksi memiliki format 8 angka lahir yang valid, tanggal lahir akan terisi otomatis.
                    </p>
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      Tempat Lahir <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Pematangsiantar"
                      value={tempatLahir}
                      onChange={(e) => setTempatLahir(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500 text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      Tanggal Lahir <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={tanggalLahir}
                      onChange={(e) => setTanggalLahir(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500 text-slate-800 font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Triple Column Row: gender, agama, status perkawinan */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1.5">
                    Jenis Kelamin <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={jenisKelamin}
                    onChange={(e) => setJenisKelamin(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-teal-500 text-slate-800 font-semibold cursor-pointer"
                  >
                    <option value="Laki-laki">Laki-Laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1.5">
                    Agama <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={agama}
                    onChange={(e) => setAgama(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-teal-500 text-slate-800 font-semibold cursor-pointer"
                  >
                    <option value="Islam">Islam</option>
                    <option value="Kristen Protestan">Kristen Protestan</option>
                    <option value="Katolik">Katolik</option>
                    <option value="Hindu">Hindu</option>
                    <option value="Buddha">Buddha</option>
                    <option value="Konghucu">Konghucu</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1.5">
                    Status Perkawinan <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={statusPerkawinan}
                    onChange={(e) => setStatusPerkawinan(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-teal-500 text-slate-800 font-semibold cursor-pointer"
                  >
                    <option value="Kawin">Kawin</option>
                    <option value="Belum Kawin">Belum Kawin</option>
                    <option value="Cerai Hidup">Cerai Hidup</option>
                    <option value="Cerai Mati">Cerai Mati</option>
                  </select>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-500 hover:bg-slate-50 font-bold rounded-xl transition-all cursor-pointer mr-auto"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-teal-600 hover:bg-teal-750 text-white font-heavy rounded-xl shadow-xs transition-shadow flex items-center gap-1 cursor-pointer"
                >
                  <FileCheck className="h-4 w-4" />
                  <span>{editingItem ? 'Simpan Pembaruan' : 'Daftarkan Staf'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
