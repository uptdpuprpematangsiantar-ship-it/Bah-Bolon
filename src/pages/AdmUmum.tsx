/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Inbox, 
  Send, 
  Plus, 
  Search, 
  Filter, 
  FileText, 
  Calendar, 
  MapPin, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  X, 
  Download, 
  HelpCircle,
  FileCheck,
  Building,
  ArrowUpDown,
  Sparkles
} from 'lucide-react';
import { AdmUmumItem } from '../types';

interface AdmUmumProps {
  items: AdmUmumItem[];
  onAddItem: (item: AdmUmumItem) => void;
  onUpdateItem: (item: AdmUmumItem) => void;
  onDeleteItem: (id: string) => void;
}

type TabType = 'surat_masuk' | 'surat_keluar';

export default function AdmUmum({ items, onAddItem, onUpdateItem, onDeleteItem }: AdmUmumProps) {
  // Current sub-page tab
  const [activeTab, setActiveTab] = useState<TabType>('surat_masuk');
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'tanggal' | 'nomor'>('tanggal');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Modal open & edit states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AdmUmumItem | null>(null);

  // Form states
  const [nomorSurat, setNomorSurat] = useState('');
  const [namaDokumen, setNamaDokumen] = useState(''); // Perihal
  const [tanggalArsip, setTanggalArsip] = useState(new Date().toISOString().split('T')[0]);
  const [klasifikasi, setKlasifikasi] = useState<AdmUmumItem['klasifikasi']>('SK Pimpinan');
  const [status, setStatus] = useState<AdmUmumItem['status']>('Aktif');
  const [lokasiFisik, setLokasiFisik] = useState('Lemari Arsip Utama');
  const [keterangan, setKeterangan] = useState('');
  const [asalSurat, setAsalSurat] = useState(''); // Only for Surat Masuk
  const [tujuanSurat, setTujuanSurat] = useState(''); // Only for Surat Keluar

  // Pre-populate mock samples button helper
  const handleLoadSamples = () => {
    const samples: AdmUmumItem[] = [
      {
        id: 'sample-m-1',
        nomorSurat: '005/120/PSDA/2026',
        namaDokumen: 'Undangan Rapat Koordinasi Penanggulangan Banjir DAS Bah Bolon',
        tanggalArsip: '2026-06-02',
        klasifikasi: 'Surat Edaran',
        status: 'Aktif',
        lokasiFisik: 'Boks Masuk A1',
        keterangan: 'Tindak lanjut oleh Seksi OP untuk hadir pada 12 Juni 2026',
        jenisSurat: 'Surat Masuk',
        asalSurat: 'Dinas PUPR Provinsi Sumatera Utara'
      },
      {
        id: 'sample-m-2',
        nomorSurat: '800/215/UPTD/2026',
        namaDokumen: 'Penyampaian Berkas Mutasi Pegawai Golongan III',
        tanggalArsip: '2026-06-05',
        klasifikasi: 'SPO',
        status: 'Non-Aktif',
        lokasiFisik: 'Kabinet Umum B3',
        keterangan: 'Sudah diproses ke bagian Kepegawaian',
        jenisSurat: 'Surat Masuk',
        asalSurat: 'Badan Kepegawaian Daerah (BKD)'
      },
      {
        id: 'sample-k-1',
        nomorSurat: '511/045/PSDA-BB/2026',
        namaDokumen: 'Pemberitahuan Jadwal Pengeringan Saluran Irigasi Daerah Irigasi Bah Bolon',
        tanggalArsip: '2026-06-03',
        klasifikasi: 'Surat Edaran',
        status: 'Non-Aktif',
        lokasiFisik: 'Boks Keluar K1',
        keterangan: 'Tembusan kepada seluruh Kepala Desa dan Gabungan Perkumpulan Petani Pemakai Air (GP3A)',
        jenisSurat: 'Surat Keluar',
        tujuanSurat: 'Camat Kecamatan Siantar Marimbun'
      },
      {
        id: 'sample-k-2',
        nomorSurat: '188/022/KPTS/UPTD/2026',
        namaDokumen: 'Surat Keputusan Penunjukan Petugas Jaga Bendung Musim Kemau 2026',
        tanggalArsip: '2026-06-06',
        klasifikasi: 'SK Pimpinan',
        status: 'Aktif',
        lokasiFisik: 'Rak SK Pimpinan',
        keterangan: 'SK Berlaku mulai Juni s.d September 2026',
        jenisSurat: 'Surat Keluar',
        tujuanSurat: 'Seluruh Petugas Pintu Air (PPA) UPTD'
      }
    ];

    samples.forEach(s => onAddItem(s));
  };

  // Open modal for adding
  const openAddModal = () => {
    setEditingItem(null);
    setNomorSurat('');
    setNamaDokumen('');
    setTanggalArsip(new Date().toISOString().split('T')[0]);
    setKlasifikasi('SK Pimpinan');
    setStatus('Aktif');
    setLokasiFisik('Lemari Arsip Utama');
    setKeterangan('');
    setAsalSurat('');
    setTujuanSurat('');
    setIsModalOpen(true);
  };

  // Open modal for editing
  const openEditModal = (item: AdmUmumItem) => {
    setEditingItem(item);
    setNomorSurat(item.nomorSurat);
    setNamaDokumen(item.namaDokumen);
    setTanggalArsip(item.tanggalArsip);
    setKlasifikasi(item.klasifikasi);
    setStatus(item.status);
    setLokasiFisik(item.lokasiFisik);
    setKeterangan(item.keterangan);
    setAsalSurat(item.asalSurat || '');
    setTujuanSurat(item.tujuanSurat || '');
    setIsModalOpen(true);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nomorSurat || !namaDokumen) return;

    const data: AdmUmumItem = {
      id: editingItem ? editingItem.id : `surat-${Date.now()}`,
      nomorSurat,
      namaDokumen,
      tanggalArsip,
      klasifikasi,
      status,
      lokasiFisik,
      keterangan,
      jenisSurat: activeTab === 'surat_masuk' ? 'Surat Masuk' : 'Surat Keluar',
      ...(activeTab === 'surat_masuk' ? { asalSurat } : { tujuanSurat })
    };

    if (editingItem) {
      onUpdateItem(data);
    } else {
      onAddItem(data);
    }
    setIsModalOpen(false);
  };

  // Toggle sort parameters
  const toggleSort = (field: 'tanggal' | 'nomor') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  // Filter items matching active tab & search Query
  const filteredItems = items
    .filter(item => {
      // Check correct letter type
      const targetType = activeTab === 'surat_masuk' ? 'Surat Masuk' : 'Surat Keluar';
      if (item.jenisSurat !== targetType) return false;

      // Filter by classification
      if (selectedClass !== 'all' && item.klasifikasi !== selectedClass) return false;

      // Filter by status
      if (selectedStatus !== 'all' && item.status !== selectedStatus) return false;

      // Check search match
      const query = searchQuery.toLowerCase();
      const matchNomor = item.nomorSurat.toLowerCase().includes(query);
      const matchSubject = item.namaDokumen.toLowerCase().includes(query);
      const matchKeterangan = item.keterangan.toLowerCase().includes(query);
      const matchAsalOrTujuan = activeTab === 'surat_masuk' 
        ? (item.asalSurat || '').toLowerCase().includes(query)
        : (item.tujuanSurat || '').toLowerCase().includes(query);

      return matchNomor || matchSubject || matchKeterangan || matchAsalOrTujuan;
    })
    .sort((a, b) => {
      if (sortBy === 'tanggal') {
        const valA = new Date(a.tanggalArsip).getTime();
        const valB = new Date(b.tanggalArsip).getTime();
        return sortOrder === 'asc' ? valA - valB : valB - valA;
      } else {
        return sortOrder === 'asc' 
          ? a.nomorSurat.localeCompare(b.nomorSurat)
          : b.nomorSurat.localeCompare(a.nomorSurat);
      }
    });

  // Calculate statistics for Active tab
  const totalInTab = items.filter(i => i.jenisSurat === (activeTab === 'surat_masuk' ? 'Surat Masuk' : 'Surat Keluar')).length;
  const activeCount = items.filter(i => i.jenisSurat === (activeTab === 'surat_masuk' ? 'Surat Masuk' : 'Surat Keluar') && i.status === 'Aktif').length;
  const finishedCount = items.filter(i => i.jenisSurat === (activeTab === 'surat_masuk' ? 'Surat Masuk' : 'Surat Keluar') && i.status === 'Non-Aktif').length;

  const handlePrintAgenda = () => {
    const printContent = `
      <html>
        <head>
          <title>Buku Agenda ${activeTab === 'surat_masuk' ? 'Surat Masuk' : 'Surat Keluar'} - UPTD PSDA Bah Bolon</title>
          <style>
            body { font-family: sans-serif; padding: 25px; font-size: 11px; color: #333; }
            h1 { text-align: center; text-transform: uppercase; font-size: 16px; margin-bottom: 5px; }
            h2 { text-align: center; font-size: 12px; margin-top: 0; margin-bottom: 25px; font-weight: normal; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; }
            th, td { border: 1px solid #aaa; padding: 8px; text-align: left; }
            th { bg-color: #f2f2f2; font-weight: bold; }
          </style>
        </head>
        <body onload="window.print()">
          <h1>Buku Agenda ${activeTab === 'surat_masuk' ? 'Surat Masuk' : 'Surat Keluar'}</h1>
          <h2>UPTD PSDA Bah Bolon - Dinas Pekerjaan Umum Dan Penataan Ruang</h2>
          <p>Total Arsip Agenda: ${filteredItems.length} berkas</p>
          <table>
            <thead>
              <tr>
                <th style="width: 5%">No</th>
                <th style="width: 15%">Tanggal</th>
                <th style="width: 20%">Nomor Surat</th>
                <th style="width: 20%">${activeTab === 'surat_masuk' ? 'Asal Surat' : 'Tujuan Surat'}</th>
                <th style="width: 25%">Perihal / Hal</th>
                <th style="width: 15%">Klasifikasi</th>
              </tr>
            </thead>
            <tbody>
              ${filteredItems.map((item, idx) => `
                <tr>
                  <td>${idx + 1}</td>
                  <td>${item.tanggalArsip}</td>
                  <td><strong>${item.nomorSurat}</strong></td>
                  <td>${activeTab === 'surat_masuk' ? (item.asalSurat || '-') : (item.tujuanSurat || '-')}</td>
                  <td>${item.namaDokumen}</td>
                  <td>${item.klasifikasi}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
    }
  };

  return (
    <div className="space-y-6 font-sans text-slate-800 p-1 md:p-2">
      {/* Title Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-xl bg-violet-600/10 border border-violet-600/20 text-violet-700 flex items-center justify-center shadow-2xs">
              {activeTab === 'surat_masuk' ? <Inbox className="h-5 w-5" /> : <Send className="h-5 w-5" />}
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-935 tracking-tight">
                Administrasi Umum & Korespondensi
              </h1>
              <p className="text-slate-500 text-xs mt-0.5">
                Portal Manajemen Surat Masuk, Surat Keluar, dan Buku Agenda Resmi UPTD PSDA Bah Bolon.
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          {totalInTab === 0 && (
            <button
              id="adm-load-samples-btn"
              onClick={handleLoadSamples}
              className="px-3.5 py-2 text-xs rounded-xl border border-violet-200 bg-violet-50 text-violet-700 font-bold hover:bg-violet-100 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Muat Data Contoh</span>
            </button>
          )}

          <button
            id="adm-print-agenda-btn"
            disabled={filteredItems.length === 0}
            onClick={handlePrintAgenda}
            className="px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-700 font-bold hover:bg-slate-50 hover:text-slate-900 transition-all flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Cetak Agenda</span>
          </button>

          <button
            id="adm-add-new-btn"
            onClick={openAddModal}
            className="px-4 py-2 text-xs rounded-xl bg-violet-600 hover:bg-violet-750 text-white font-heavy transition-all flex items-center gap-1.5 cursor-pointer shadow-sm shadow-violet-950/20"
          >
            <Plus className="h-4 w-4" />
            <span>Tambah {activeTab === 'surat_masuk' ? 'Surat Masuk' : 'Surat Keluar'}</span>
          </button>
        </div>
      </div>

      {/* Primary Sub-Page Tabs Switching */}
      <div className="bg-slate-100 self-start p-1 rounded-2xl inline-flex items-center gap-1 border border-slate-200">
        <button
          id="tab-surat-masuk"
          onClick={() => {
            setActiveTab('surat_masuk');
            setSearchQuery('');
            setSelectedClass('all');
            setSelectedStatus('all');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all ${
            activeTab === 'surat_masuk'
              ? 'bg-white text-violet-750 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
          }`}
        >
          <Inbox className="h-4 w-4" />
          <span>Surat Masuk</span>
          <span className={`ml-1 text-[10px] px-1.5 py-0.5 rounded-full ${
            activeTab === 'surat_masuk' ? 'bg-violet-100 text-violet-700' : 'bg-slate-200 text-slate-650'
          }`}>
            {items.filter(i => i.jenisSurat === 'Surat Masuk').length}
          </span>
        </button>

        <button
          id="tab-surat-keluar"
          onClick={() => {
            setActiveTab('surat_keluar');
            setSearchQuery('');
            setSelectedClass('all');
            setSelectedStatus('all');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all ${
            activeTab === 'surat_keluar'
              ? 'bg-white text-violet-750 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
          }`}
        >
          <Send className="h-4 w-4" />
          <span>Surat Keluar</span>
          <span className={`ml-1 text-[10px] px-1.5 py-0.5 rounded-full ${
            activeTab === 'surat_keluar' ? 'bg-violet-100 text-violet-700' : 'bg-slate-200 text-slate-650'
          }`}>
            {items.filter(i => i.jenisSurat === 'Surat Keluar').length}
          </span>
        </button>
      </div>

      {/* Tab Counters Stats Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div id="stat-card-total" className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3.5 shadow-3xs">
          <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Total Surat Tercatat</div>
            <div className="text-xl font-bold text-slate-900">{totalInTab}</div>
          </div>
        </div>

        <div id="stat-card-active" className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3.5 shadow-3xs">
          <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Tindak Lanjut / Aktif</div>
            <div className="text-xl font-bold text-slate-900">{activeCount}</div>
          </div>
        </div>

        <div id="stat-card-finished" className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3.5 shadow-3xs">
          <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <FileCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Selesai / Diarsipkan</div>
            <div className="text-xl font-bold text-slate-900">{finishedCount}</div>
          </div>
        </div>
      </div>

      {/* Advanced Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col lg:flex-row gap-3 items-center justify-between shadow-3xs">
        {/* Search input */}
        <div className="relative w-full lg:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            id="search-input"
            type="text"
            placeholder={activeTab === 'surat_masuk' ? "Cari nomor, perihal, asal pengirim..." : "Cari nomor, perihal, nama penerima..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-violet-500 text-slate-800 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          {/* Classification Dropdown */}
          <div className="flex items-center gap-1.5">
            <Filter className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <select
              id="filter-class"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:border-violet-500"
            >
              <option value="all">Semua Klasifikasi</option>
              <option value="SK Pimpinan">SK Pimpinan</option>
              <option value="Surat Edaran">Surat Edaran</option>
              <option value="SPO">SPO (Prosedur)</option>
              <option value="Nota Dinas">Nota Dinas</option>
              <option value="Lain-lain">Lain-lain</option>
            </select>
          </div>

          {/* Status Dropdown */}
          <select
            id="filter-status"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:border-violet-500"
          >
            <option value="all">Semua Status</option>
            <option value="Aktif">Tindak Lanjut / Aktif</option>
            <option value="Non-Aktif">Selesai / Diarsipkan</option>
          </select>

          {/* Sorting controls */}
          <div className="ml-auto lg:ml-0 flex items-center border border-slate-200 rounded-lg overflow-hidden shrink-0">
            <button
              type="button"
              onClick={() => toggleSort('tanggal')}
              className={`text-xs px-3 py-1.5 h-full font-medium flex items-center gap-1 transition-colors ${
                sortBy === 'tanggal' ? 'bg-violet-50 text-violet-700 font-bold' : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span>Urut Tanggal</span>
              {sortBy === 'tanggal' && (
                <span className="text-[9px]">{sortOrder === 'asc' ? '▲' : '▼'}</span>
              )}
            </button>
            <button
              type="button"
              onClick={() => toggleSort('nomor')}
              className={`text-xs px-3 py-1.5 h-full font-medium flex items-center gap-1 border-l border-slate-150 transition-colors ${
                sortBy === 'nomor' ? 'bg-violet-50 text-violet-700 font-bold' : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span>Nomor Surat</span>
              {sortBy === 'nomor' && (
                <span className="text-[9px]">{sortOrder === 'asc' ? '▲' : '▼'}</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Letters Grid Layout / Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
        {filteredItems.length === 0 ? (
          /* Empty state */
          <div className="text-center py-16 px-4 space-y-4">
            <div className="h-14 w-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
              <FileText className="h-6 w-6 text-slate-400" />
            </div>
            <div className="max-w-xs mx-auto space-y-1.5">
              <h3 className="text-sm font-bold text-slate-800">
                Belum Ada Surat Terdaftar
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {searchQuery || selectedClass !== 'all' || selectedStatus !== 'all'
                  ? "Tidak ada surat yang cocok dengan filter pencarian dan opsi penyaringan Anda."
                  : activeTab === 'surat_masuk'
                  ? "Buku agenda surat masuk masih kosong. Input surat masuk pertama Anda untuk mendata sirkulasi surat."
                  : "Buku agenda surat keluar masih kosong. Daftarkan surat keluar baru untuk menata arsip korespondensi."}
              </p>
            </div>
            {searchQuery || selectedClass !== 'all' || selectedStatus !== 'all' ? (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedClass('all');
                  setSelectedStatus('all');
                }}
                className="text-xs font-bold text-violet-700 hover:underline inline-block"
              >
                Reset Semua Filter
              </button>
            ) : (
              <button
                id="empty-state-add-btn"
                onClick={openAddModal}
                className="px-4 py-2 text-xs rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 font-bold transition-all cursor-pointer inline-flex items-center gap-1.5"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Buat Baru Sekarang</span>
              </button>
            )}
          </div>
        ) : (
          /* Desk & Responsive Card List */
          <div className="divide-y divide-slate-150">
            {/* Table Header for medium screens and above */}
            <div className="hidden md:grid md:grid-cols-12 gap-4 px-6 py-3.5 bg-slate-50 border-b border-slate-150 text-[10px] uppercase font-black text-slate-450 tracking-wider">
              <div className="col-span-3">Nomor Surat / Agenda</div>
              <div className="col-span-4">Perihal (Hal) & Klasifikasi</div>
              <div className="col-span-2">{activeTab === 'surat_masuk' ? 'Pengirim (Asal)' : 'Tujuan (Ke)'}</div>
              <div className="col-span-1 text-center">Status</div>
              <div className="col-span-2 text-right">Aksi</div>
            </div>

            {/* List items */}
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="p-5 md:px-6 md:py-4.5 hover:bg-slate-50 transition-colors grid grid-cols-1 md:grid-cols-12 gap-3.5 md:gap-4 items-center"
              >
                {/* 1. File description/numbers */}
                <div className="col-span-1 md:col-span-3 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-mono font-black text-slate-900 bg-slate-100 border border-slate-200 px-1 py-0.5 rounded-sm">
                      {item.nomorSurat}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-450">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 shrink-0" />
                      <span>{item.tanggalArsip}</span>
                    </span>
                    <span className="inline-block h-1 w-1 rounded-full bg-slate-300" />
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 shrink-0" />
                      <span className="truncate max-w-[120px]" title={item.lokasiFisik}>{item.lokasiFisik}</span>
                    </span>
                  </div>
                </div>

                {/* 2. Topic/Perihal & Category badge */}
                <div className="col-span-1 md:col-span-4 space-y-2">
                  <h4 className="text-xs font-bold text-slate-800 leading-normal">
                    {item.namaDokumen}
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-violet-50 text-violet-700 border border-violet-100">
                      {item.klasifikasi}
                    </span>
                    {item.keterangan && (
                      <span className="text-[10px] text-slate-450 truncate max-w-[200px]" title={item.keterangan}>
                        {item.keterangan}
                      </span>
                    )}
                  </div>
                </div>

                {/* 3. Sender / Receiver profile */}
                <div className="col-span-1 md:col-span-2">
                  {activeTab === 'surat_masuk' ? (
                    <div className="flex items-center gap-1.5">
                      <div className="h-6 w-6 rounded-md bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 shrink-0 text-[10px] font-black uppercase">
                        IN
                      </div>
                      <div className="text-xs font-bold text-slate-700 leading-tight">
                        {item.asalSurat || <span className="text-slate-400 font-normal italic">Belum dispesifikasi</span>}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <div className="h-6 w-6 rounded-md bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 shrink-0 text-[10px] font-black uppercase">
                        OUT
                      </div>
                      <div className="text-xs font-bold text-slate-700 leading-tight">
                        {item.tujuanSurat || <span className="text-slate-400 font-normal italic">Belum dispesifikasi</span>}
                      </div>
                    </div>
                  )}
                </div>

                {/* 4. Action required statuses */}
                <div className="col-span-1 md:col-span-1 text-left md:text-center">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                    item.status === 'Aktif'
                      ? 'bg-amber-50 text-amber-700 border border-amber-100'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                  }`}>
                    {item.status === 'Aktif' ? (
                      <>
                        <Clock className="h-3 w-3 text-amber-500 animate-pulse shrink-0" />
                        <span>Dalam Proses</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
                        <span>Selesai (Arsip)</span>
                      </>
                    )}
                  </span>
                </div>

                {/* 5. Trigger update actions */}
                <div className="col-span-1 md:col-span-2 flex items-center justify-start md:justify-end gap-1.5 pt-2.5 md:pt-0 border-t border-slate-100 md:border-t-0">
                  <button
                    onClick={() => openEditModal(item)}
                    title="Ubah data"
                    className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:border-slate-300 transition-colors cursor-pointer"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('Apakah Anda yakin ingin menghapus surat agenda ini? Semua data korespondensi ini akan hilang.')) {
                        onDeleteItem(item.id);
                      }
                    }}
                    title="Hapus data"
                    className="p-1.5 rounded-lg border border-red-200 bg-white text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Adding & Editing Modal Form Element */}
      {isModalOpen && (
        <div id="adm-form-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-fade-in">
          <div id="adm-form-modal-card" className="w-full max-w-xl bg-white rounded-3xl shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
            {/* Top decorative visual strap */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-600 to-indigo-500" />
            
            {/* Modal header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-slate-900 tracking-tight">
                  {editingItem ? 'Edit Agenda Korespondensi' : `Daftarkan ${activeTab === 'surat_masuk' ? 'Surat Masuk' : 'Surat Keluar'} Baru`}
                </h3>
                <p className="text-slate-450 text-[11px] mt-0.5">
                  Lengkapi seluruh informasi pembendaharaan fisik dan agenda di bawah ini.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form layout wrapper */}
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Nomor Surat */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1.5">Nomor Surat / Agenda Resmi <span className="text-rose-500">*</span></label>
                  <input
                    id="input-nomor-surat"
                    type="text"
                    required
                    placeholder="Contoh: 100/320/PSDA/2026"
                    value={nomorSurat}
                    onChange={(e) => setNomorSurat(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-violet-500 text-slate-800 font-mono"
                  />
                </div>

                {/* 2. Tanggal Surat */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1.5">Tanggal Surat / Terima <span className="text-rose-500">*</span></label>
                  <input
                    id="input-tanggal-arsip"
                    type="date"
                    required
                    value={tanggalArsip}
                    onChange={(e) => setTanggalArsip(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-violet-500 text-slate-800"
                  />
                </div>
              </div>

              {/* 3. Sender/Receiver Profile based on active tab state */}
              {activeTab === 'surat_masuk' ? (
                <div>
                  <label className="block text-slate-700 font-bold mb-1.5">Instansi Pengirim (Asal Surat) <span className="text-rose-500">*</span></label>
                  <input
                    id="input-asal-surat"
                    type="text"
                    required
                    placeholder="Contoh: Dinas PUPR Provinsi Sumatera Utara"
                    value={asalSurat}
                    onChange={(e) => setAsalSurat(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-violet-500 text-slate-800 font-semibold"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-slate-700 font-bold mb-1.5">Instansi Tujuan (Penerima Surat) <span className="text-rose-500">*</span></label>
                  <input
                    id="input-tujuan-surat"
                    type="text"
                    required
                    placeholder="Contoh: Camat Siantar Barat"
                    value={tujuanSurat}
                    onChange={(e) => setTujuanSurat(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-violet-500 text-slate-800 font-semibold"
                  />
                </div>
              )}

              {/* 4. Perihal Surat */}
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">Perihal / Hal Surat <span className="text-rose-500">*</span></label>
                <textarea
                  id="input-nama-dokumen"
                  required
                  rows={2}
                  placeholder="Deskripsikan inti pesan korespondensi secara singkat dan padat..."
                  value={namaDokumen}
                  onChange={(e) => setNamaDokumen(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-violet-500 text-slate-800 text-xs resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 5. Klasifikasi dokumen */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1.5">Klasifikasi Naskah Dinas</label>
                  <select
                    id="input-klasifikasi"
                    value={klasifikasi}
                    onChange={(e) => setKlasifikasi(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-violet-500 text-slate-800 font-medium"
                  >
                    <option value="SK Pimpinan">SK Pimpinan</option>
                    <option value="Surat Edaran">Surat Edaran</option>
                    <option value="SPO">SPO (Standard Operating Procedures)</option>
                    <option value="Nota Dinas">Nota Dinas</option>
                    <option value="Lain-lain">Lain-lain</option>
                  </select>
                </div>

                {/* 6. Status tracking */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1.5">Status Penyelesaian Tindak Lanjut</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setStatus('Aktif')}
                      className={`flex-1 p-2 rounded-xl border text-center font-bold tracking-tight transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        status === 'Aktif'
                          ? 'bg-amber-50 text-amber-700 border-amber-300 shadow-3xs'
                          : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                      }`}
                    >
                      <Clock className="h-3 w-3 text-amber-500 shrink-0" />
                      <span>Belum Selesai (Aktif)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setStatus('Non-Aktif')}
                      className={`flex-1 p-2 rounded-xl border text-center font-bold tracking-tight transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        status === 'Non-Aktif'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-300 shadow-3xs'
                          : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                      }`}
                    >
                      <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
                      <span>Selesai (Diarsipkan)</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 7. Physical storage place */}
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">Lokasi Penyimpanan Fisik (Arsip Buku)</label>
                <input
                  id="input-lokasi-fisik"
                  type="text"
                  placeholder="Contoh: Lemari Arsip 2, Rak Pertahanan Sipil"
                  value={lokasiFisik}
                  onChange={(e) => setLokasiFisik(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-violet-500 text-slate-800"
                />
              </div>

              {/* 8. Extra notes */}
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">Catatan Tambahan / Keterangan (Opsional)</label>
                <input
                  id="input-keterangan"
                  type="text"
                  placeholder="Contoh: Lampiran proposal dimasukkan terpisah di Rak C"
                  value={keterangan}
                  onChange={(e) => setKeterangan(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-violet-500 text-slate-800"
                />
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2.5 pt-4 border-t border-slate-100">
                <button
                  id="form-cancel-btn"
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  id="form-submit-btn"
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-750 text-white font-heavy transition-all cursor-pointer shadow-md shadow-violet-950/10"
                >
                  {editingItem ? 'Simpan Perubahan' : 'Daftarkan Agenda'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
