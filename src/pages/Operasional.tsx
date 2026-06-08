/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { 
  Waves, 
  MapPin, 
  Plus, 
  Edit3, 
  Trash2, 
  Camera, 
  Upload, 
  ExternalLink, 
  Compass, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  Eye, 
  Printer, 
  Info,
  Droplets,
  Calendar,
  User,
  ArrowRight,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { OperasionalItem, DaerahIrigasi, BangunanIrigasi } from '../types';

interface OperasionalProps {
  items: OperasionalItem[];
  onAddItem: (item: OperasionalItem) => void;
  onUpdateItem: (item: OperasionalItem) => void;
  onDeleteItem: (id: string) => void;
  daerahIrigasiItems: DaerahIrigasi[];
  onUpdateDaerahIrigasi: (items: DaerahIrigasi[]) => void;
}

export default function Operasional({
  items,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  daerahIrigasiItems = [],
  onUpdateDaerahIrigasi
}: OperasionalProps) {
  // Navigation Tabs: 'tma' (Pemantauan Tinggi Muka Air) or 'irigasi' (Inventaris Daerah Irigasi)
  const [activeTab, setActiveTab] = useState<'tma' | 'irigasi'>('irigasi');

  // --- STATE FOR WATER FLOWS / TMA ---
  const [showTmaModal, setShowTmaModal] = useState(false);
  const [editingTma, setEditingTma] = useState<OperasionalItem | null>(null);
  const [tmaSearch, setTmaSearch] = useState('');
  const [tmaForm, setTmaForm] = useState<Omit<OperasionalItem, 'id'>>({
    namaLokasi: '',
    kondisiPintu: 'Sempurna',
    debitAir: 0,
    statusKeamanan: 'Aman',
    petugasJaga: '',
    tanggalCheck: new Date().toISOString().substring(0, 10),
  });

  // --- STATE FOR DAERAH IRIGASI ---
  const [diSearch, setDiSearch] = useState('');
  const [diFilterKondisi, setDiFilterKondisi] = useState<string>('ALL');
  const [showDiModal, setShowDiModal] = useState(false);
  const [editingDi, setEditingDi] = useState<DaerahIrigasi | null>(null);
  
  // Form State for Daerah Irigasi
  const [diForm, setDiForm] = useState({
    namaDI: '',
    lokasi: '',
    luasAreal: 0,
    sumberAir: '',
    kondisi: 'Baik' as 'Baik' | 'Rusak Ringan' | 'Rusak Sedang' | 'Rusak Berat',
  });

  // --- MODEL FOR MANAGING DYNAMIC SUPPORT STRUCTURES ---
  const [activeDiForBuildings, setActiveDiForBuildings] = useState<DaerahIrigasi | null>(null);
  const [showBuildingFormModal, setShowBuildingFormModal] = useState(false);
  const [editingBuilding, setEditingBuilding] = useState<BangunanIrigasi | null>(null);
  const [buildingForm, setBuildingForm] = useState({
    namaBangunan: '',
    kategori: 'Bendung',
    kondisi: 'Baik' as 'Baik' | 'Rusak Ringan' | 'Rusak Sedang' | 'Rusak Berat',
    keterangan: '',
    koordinat: '',
    foto: '',
  });

  // Photo viewer modal
  const [activePhoto, setActivePhoto] = useState<{ title: string; src: string } | null>(null);
  
  // Interactive Embedded Map coordinates state
  const [activeCoordinates, setActiveCoordinates] = useState<string | null>(null);

  // GPS state for automatic/manual device tracking
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  const fetchDeviceLocation = (onSuccess?: (coords: string) => void) => {
    if (!navigator.geolocation) {
      setGpsError('Pencarian lokasi menggunakan GPS tidak didukung oleh browser Anda.');
      return;
    }
    setGpsLoading(true);
    setGpsError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude.toFixed(6);
        const lng = position.coords.longitude.toFixed(6);
        const coordsStr = `${lat}, ${lng}`;
        if (onSuccess) {
          onSuccess(coordsStr);
        } else {
          setBuildingForm(prev => ({ ...prev, koordinat: coordsStr }));
        }
        setGpsLoading(false);
      },
      (err) => {
        console.warn('Geolocation error:', err);
        let msg = 'Gagal mengambil koordinat lokasi perangkat Anda.';
        if (err.code === 1) {
          msg = 'Izin lokasi ditolak perangkat. Aktifkan lokasi di pengaturan browser.';
        } else if (err.code === 2) {
          msg = 'Posisi tidak terdeteksi. Pastikan GPS/Sinyal aktif.';
        } else if (err.code === 3) {
          msg = 'Waktu permintaan lokasi habis (Timeout).';
        }
        setGpsError(msg);
        setGpsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
    );
  };

  // Hidden references for inputs
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Categories of support structures
  const kategoriBangunanOpt = [
    'Bendung',
    'Saluran Pembawa Primary',
    'Saluran Pembawa Sekunder',
    'Saluran Pembuang',
    'Bangunan Bagi/Bagi-Bagi',
    'Bangunan Sadap',
    'Bangunan Pengatur',
    'Pintu Air',
    'Sipon/Talang Air',
    'Bangunan Pelengkap',
    'Lainnya'
  ];

  // --- IMAGE UPLOAD HELPER ---
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('File foto terlalu besar. Maksimum ukuran adalah 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setBuildingForm(prev => ({ ...prev, foto: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // --- TRANSFORMATION & SEARCH (IRIGASI) ---
  const filteredDI = daerahIrigasiItems.filter(di => {
    const matchesSearch = 
      di.namaDI.toLowerCase().includes(diSearch.toLowerCase()) ||
      di.lokasi.toLowerCase().includes(diSearch.toLowerCase()) ||
      di.sumberAir.toLowerCase().includes(diSearch.toLowerCase());
    
    const matchesKondisi = diFilterKondisi === 'ALL' || di.kondisi === diFilterKondisi;
    return matchesSearch && matchesKondisi;
  });

  // --- DAERAH IRIGASI SAVE / DELETE ACTIONS ---
  const openAddDi = () => {
    setEditingDi(null);
    setDiForm({
      namaDI: '',
      lokasi: '',
      luasAreal: 0,
      sumberAir: '',
      kondisi: 'Baik',
    });
    setShowDiModal(true);
  };

  const openEditDi = (di: DaerahIrigasi) => {
    setEditingDi(di);
    setDiForm({
      namaDI: di.namaDI,
      lokasi: di.lokasi,
      luasAreal: di.luasAreal,
      sumberAir: di.sumberAir,
      kondisi: di.kondisi,
    });
    setShowDiModal(true);
  };

  const handleSaveDi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!diForm.namaDI || !diForm.lokasi || !diForm.sumberAir) {
      alert('Harap lengkapi semua field bertanda bintang (*).');
      return;
    }

    if (editingDi) {
      // Edit existing Daerah Irigasi
      const updatedList = daerahIrigasiItems.map(item => {
        if (item.id === editingDi.id) {
          return {
            ...item,
            ...diForm,
          };
        }
        return item;
      });
      onUpdateDaerahIrigasi(updatedList);
    } else {
      // Create new Daerah Irigasi
      const newDI: DaerahIrigasi = {
        id: `di-${Date.now()}`,
        namaDI: diForm.namaDI,
        lokasi: diForm.lokasi,
        luasAreal: diForm.luasAreal || 0,
        sumberAir: diForm.sumberAir,
        kondisi: diForm.kondisi,
        bangunanPendukung: []
      };
      onUpdateDaerahIrigasi([newDI, ...daerahIrigasiItems]);
    }
    setShowDiModal(false);
  };

  const handleDeleteDi = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus data Daerah Irigasi ini? Semua data bangunan pendukung di dalamnya juga akan terhapus.')) {
      onUpdateDaerahIrigasi(daerahIrigasiItems.filter(item => item.id !== id));
      if (activeDiForBuildings?.id === id) {
        setActiveDiForBuildings(null);
      }
    }
  };

  // --- BUILDING PENDUKUNG (SUPPORTING STRUCTURES) ACTIONS ---
  const handleOpenKelolaBangunan = (di: DaerahIrigasi) => {
    setActiveDiForBuildings(di);
  };

  const openAddBuilding = () => {
    setEditingBuilding(null);
    setBuildingForm({
      namaBangunan: '',
      kategori: 'Bendung',
      kondisi: 'Baik',
      keterangan: '',
      koordinat: '',
      foto: '',
    });
    setGpsError(null);
    setGpsLoading(false);
    setShowBuildingFormModal(true);

    // Otomatis update koordinat dengan lokasi perangkat
    fetchDeviceLocation((coords) => {
      setBuildingForm(prev => ({ ...prev, koordinat: coords }));
    });
  };

  const openEditBuilding = (bld: BangunanIrigasi) => {
    setEditingBuilding(bld);
    setBuildingForm({
      namaBangunan: bld.namaBangunan,
      kategori: bld.kategori,
      kondisi: bld.kondisi,
      keterangan: bld.keterangan || '',
      koordinat: bld.koordinat || '',
      foto: bld.foto || '',
    });
    setGpsError(null);
    setGpsLoading(false);
    setShowBuildingFormModal(true);
  };

  const handleSaveBuilding = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeDiForBuildings) return;
    if (!buildingForm.namaBangunan || !buildingForm.kategori) {
      alert('Nama Bangunan dan Kategori wajib diisi.');
      return;
    }

    let updatedBangunanList: BangunanIrigasi[] = [];

    if (editingBuilding) {
      // Edit existing building
      updatedBangunanList = activeDiForBuildings.bangunanPendukung.map(b => {
        if (b.id === editingBuilding.id) {
          return {
            ...b,
            ...buildingForm,
          };
        }
        return b;
      });
    } else {
      // New building
      const newBld: BangunanIrigasi = {
        id: `bld-${Date.now()}`,
        namaBangunan: buildingForm.namaBangunan,
        kategori: buildingForm.kategori,
        kondisi: buildingForm.kondisi,
        keterangan: buildingForm.keterangan,
        koordinat: buildingForm.koordinat,
        foto: buildingForm.foto
      };
      updatedBangunanList = [...activeDiForBuildings.bangunanPendukung, newBld];
    }

    // Map through parent Daerah Irigasi items to save updated buildings list
    const updatedDiList = daerahIrigasiItems.map(di => {
      if (di.id === activeDiForBuildings.id) {
        const updatedDi = { ...di, bangunanPendukung: updatedBangunanList };
        // Sync active DI modal reference as well
        setActiveDiForBuildings(updatedDi);
        return updatedDi;
      }
      return di;
    });

    onUpdateDaerahIrigasi(updatedDiList);
    setShowBuildingFormModal(false);
  };

  const handleDeleteBuilding = (bldId: string) => {
    if (!activeDiForBuildings) return;
    if (confirm('Hapus bangunan pendukung ini?')) {
      const updatedBangunanList = activeDiForBuildings.bangunanPendukung.filter(b => b.id !== bldId);
      const updatedDiList = daerahIrigasiItems.map(di => {
        if (di.id === activeDiForBuildings.id) {
          const updatedDi = { ...di, bangunanPendukung: updatedBangunanList };
          setActiveDiForBuildings(updatedDi);
          return updatedDi;
        }
        return di;
      });
      onUpdateDaerahIrigasi(updatedDiList);
    }
  };

  // --- TMA REPORT CRUD HANDLERS ---
  const openAddTma = () => {
    setEditingTma(null);
    setTmaForm({
      namaLokasi: '',
      kondisiPintu: 'Sempurna',
      debitAir: 0,
      statusKeamanan: 'Aman',
      petugasJaga: '',
      tanggalCheck: new Date().toISOString().substring(0, 10),
    });
    setShowTmaModal(true);
  };

  const openEditTma = (item: OperasionalItem) => {
    setEditingTma(item);
    setTmaForm({
      namaLokasi: item.namaLokasi,
      kondisiPintu: item.kondisiPintu,
      debitAir: item.debitAir,
      statusKeamanan: item.statusKeamanan,
      petugasJaga: item.petugasJaga,
      tanggalCheck: item.tanggalCheck,
    });
    setShowTmaModal(true);
  };

  const handleSaveTmaReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tmaForm.namaLokasi || !tmaForm.petugasJaga) {
      alert('Isi data lokasi pemantauan dan nama petugas jaga malam / pagi.');
      return;
    }

    if (editingTma) {
      onUpdateItem({
        id: editingTma.id,
        ...tmaForm,
      });
    } else {
      onAddItem({
        id: `tma-${Date.now()}`,
        ...tmaForm,
      });
    }
    setShowTmaModal(false);
  };

  // --- STATISTICS ACCUMULATION ---
  const statTotalDI = daerahIrigasiItems.length;
  const statLuasTotal = daerahIrigasiItems.reduce((acc, current) => acc + (current.luasAreal || 0), 0);
  const statTotalBuildings = daerahIrigasiItems.reduce((acc, current) => acc + (current.bangunanPendukung?.length || 0), 0);
  const statBaikCount = daerahIrigasiItems.filter(di => di.kondisi === 'Baik').length;

  return (
    <div className="space-y-6 font-sans text-slate-800 p-2">
      
      {/* HEADER BAR AND TITLE PANEL */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-150 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-700 flex items-center justify-center">
              <Waves className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-900 tracking-tight">
                Bagian Operasional & Pemeliharaan (OP)
              </h1>
              <p className="text-slate-500 text-xs">
                Sistem pendataan irigasi, status tinggi muka air (TMA), dan monitor sarana pendukung bangunan air UPTD PUPR.
              </p>
            </div>
          </div>
        </div>

        {/* Action Toggle Tabs with beautiful slate pill design */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl self-start lg:self-auto border border-slate-200 shadow-3xs shrink-0">
          <button
            onClick={() => setActiveTab('irigasi')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'irigasi'
                ? 'bg-white text-indigo-700 shadow-3xs border border-slate-200/35'
                : 'text-slate-550 hover:text-slate-850'
            }`}
          >
            <Compass className="h-3.5 w-3.5" />
            <span>Inventaris Daerah Irigasi</span>
          </button>
          
          <button
            onClick={() => setActiveTab('tma')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'tma'
                ? 'bg-white text-indigo-700 shadow-3xs border border-slate-200/35'
                : 'text-slate-550 hover:text-slate-850'
            }`}
          >
            <Droplets className="h-3.5 w-3.5" />
            <span>Teleskop TMA & Bendung</span>
          </button>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────────────────── */}
      {/* VIEW: INVENTARIS DAERAH IRIGASI (MAIN REQUEST) */}
      {/* ──────────────────────────────────────────────────────────────────────── */}
      {activeTab === 'irigasi' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Quick Metrics Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div className="bg-white border border-slate-150 p-4 rounded-2xl flex items-center gap-3.5 shadow-3xs">
              <div className="h-10 w-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                <Compass className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Total Daerah Irigasi</p>
                <p className="text-base font-black text-slate-950 font-sans">{statTotalDI} <span className="text-xs font-medium text-slate-450">DI Sektoral</span></p>
              </div>
            </div>

            <div className="bg-white border border-slate-150 p-4 rounded-2xl flex items-center gap-3.5 shadow-3xs">
              <div className="h-10 w-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                <Waves className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Luas Total Layanan</p>
                <p className="text-base font-black text-emerald-700 font-sans">{statLuasTotal.toLocaleString('id-ID')} <span className="text-xs font-medium text-slate-450">Ha Sawah</span></p>
              </div>
            </div>

            <div className="bg-white border border-slate-150 p-4 rounded-2xl flex items-center gap-3.5 shadow-3xs">
              <div className="h-10 w-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shrink-0">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Sarana Pendukung</p>
                <p className="text-base font-black text-purple-750 font-sans">{statTotalBuildings} <span className="text-xs font-medium text-slate-450">Bangunan</span></p>
              </div>
            </div>

            <div className="bg-white border border-slate-150 p-4 rounded-2xl flex items-center gap-3.5 shadow-3xs">
              <div className="h-10 w-10 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 shrink-0">
                <Sparkles className="h-5 w-5 font-bold" />
              </div>
              <div>
                <p className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">DI Kondisi Baik</p>
                <p className="text-base font-black text-slate-900 font-sans">{statBaikCount} <span className="text-xs font-medium text-slate-450">({statTotalDI > 0 ? Math.round((statBaikCount/statTotalDI)*100) : 0}%)</span></p>
              </div>
            </div>
          </div>

          {/* Filtering operations menu */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-50 border border-slate-200/60 p-3 rounded-2xl">
            <div className="flex flex-wrap items-center gap-2 flex-1 min-w-0">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  value={diSearch}
                  onChange={(e) => setDiSearch(e.target.value)}
                  placeholder="Cari nama Daerah Irigasi, lokasi, atau sumber air..."
                  className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Conditions toggle dropdown */}
              <select
                value={diFilterKondisi}
                onChange={(e) => setDiFilterKondisi(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="ALL">Semua Kondisi DI</option>
                <option value="Baik">Kondisi Baik</option>
                <option value="Rusak Ringan">Rusak Ringan (⚠️)</option>
                <option value="Rusak Sedang">Rusak Sedang (⚠️)</option>
                <option value="Rusak Berat">Rusak Berat (🚨)</option>
              </select>
            </div>

            <button
              onClick={openAddDi}
              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 shadow-3xs cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Daftar Irigasi Baru</span>
            </button>
          </div>

          {/* LATERAL VIEW: INTEGRATED GOOGLE SATELLITE MAP IFRAME FOR ACTIVE PIN */}
          {activeCoordinates && (
            <div className="bg-slate-900 text-slate-100 p-4 rounded-3xl border border-slate-800 shadow-md card-glow animate-fade-in space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-505 animate-pulse" />
                  <span className="text-xs font-black uppercase tracking-wider text-slate-300">Peta Satelit Google Maps Terintegrasi</span>
                </div>
                <button
                  onClick={() => setActiveCoordinates(null)}
                  className="h-6 w-6 rounded-lg bg-slate-850 hover:bg-slate-750 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>

              {/* Embedding free Google My Maps / Search Satellite Iframe centered on coordinate */}
              <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
                <iframe
                  title="Google Maps Coordinate Preview"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(activeCoordinates)}&t=k&z=17&output=embed`}
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
                <div className="flex items-center gap-1 text-xs">
                  <MapPin className="h-4 w-4 text-emerald-500" />
                  <span className="font-mono font-bold text-slate-300">Koordinat Dinas: {activeCoordinates}</span>
                </div>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activeCoordinates)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-white hover:bg-slate-100 text-slate-900 rounded-xl text-[10px] font-black tracking-tight flex items-center justify-center gap-1 shadow-2xs transition-all self-start sm:self-auto"
                >
                  <span>Buka di Google Maps Utama</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          )}

          {/* DUAL COHESIVE SYSTEM LIST & DETAIL BENTO LAYOUT */}
          {filteredDI.length === 0 ? (
            <div className="bg-white border border-slate-150 p-12 text-center rounded-3xl flex flex-col items-center justify-center">
              <Compass className="h-10 w-10 text-slate-350 mb-2 stroke-1" />
              <p className="text-slate-500 text-xs font-extrabold">Data Daerah Irigasi Tidak Ditemukan</p>
              <p className="text-slate-450 text-[11px] mt-1 max-w-sm">
                Belum ada data sub-sektoral Daerah Irigasi, atau kueri pencarian Anda tidak menghasilkan berkas kecocokan.
              </p>
              <button
                onClick={() => { setDiSearch(''); setDiFilterKondisi('ALL'); }}
                className="text-xs text-indigo-600 font-extrabold hover:underline mt-4 cursor-pointer"
              >
                Reset Filter Pencarian
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {filteredDI.map((di) => {
                let badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';
                if (di.kondisi === 'Rusak Berat') badgeColor = 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse';
                else if (di.kondisi === 'Rusak Sedang') badgeColor = 'bg-orange-50 text-orange-700 border-orange-200';
                else if (di.kondisi === 'Rusak Ringan') badgeColor = 'bg-amber-50 text-amber-700 border-amber-200';

                const isCurrentlySelected = activeDiForBuildings?.id === di.id;

                return (
                  <div 
                    key={di.id} 
                    className={`bg-white border rounded-3xl overflow-hidden shadow-3xs transition-all flex flex-col ${
                      isCurrentlySelected ? 'border-indigo-500 ring-1 ring-indigo-500/30' : 'border-slate-150 hover:border-slate-300'
                    }`}
                  >
                    
                    {/* PRIMARY BOX HEADER & SPECS */}
                    <div className="p-5 lg:p-6 bg-slate-50/50 border-b border-slate-150 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-base font-black text-slate-900 tracking-tight font-sans">
                            {di.namaDI}
                          </h3>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border uppercase tracking-wider ${badgeColor}`}>
                            {di.kondisi}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-1 gap-x-4 text-[11px] text-slate-550 font-medium">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                            <span className="truncate">Lokasi: <strong>{di.lokasi}</strong></span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Waves className="h-3.5 w-3.5 text-sky-400 shrink-0" />
                            <span>Sumber: <strong>{di.sumberAir}</strong></span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Compass className="h-3.5 w-3.5 text-purple-400 shrink-0" />
                            <span>Luas Areal: <strong className="text-indigo-700">{di.luasAreal.toLocaleString('id-ID')} Ha</strong></span>
                          </div>
                        </div>
                      </div>

                      {/* Control Operations Trigger buttons */}
                      <div className="flex flex-wrap items-center gap-2 self-start md:self-auto uppercase tracking-wider text-[10px] font-black">
                        
                        <button
                          onClick={() => handleOpenKelolaBangunan(di)}
                          className={`px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1 cursor-pointer ${
                            isCurrentlySelected 
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow-3xs' 
                              : 'bg-white text-indigo-700 border-indigo-200 hover:bg-indigo-50/50'
                          }`}
                        >
                          <span>Kelola Bangunan ({di.bangunanPendukung?.length || 0})</span>
                          <ChevronRight className="h-3 w-3" />
                        </button>
                        
                        <button
                          onClick={() => openEditDi(di)}
                          className="h-8 w-8 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 flex items-center justify-center transition-all cursor-pointer"
                          title="Edit Daerah Irigasi"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => handleDeleteDi(di.id)}
                          className="h-8 w-8 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-all cursor-pointer"
                          title="Hapus Daerah Irigasi"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* DYNAMIC LIST OF BUILDINGS */}
                    <div className="p-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-black text-slate-800 tracking-tight uppercase flex items-center gap-1.5">
                          <CheckCircle2 className="h-4 w-4 text-slate-400" />
                          <span>Daftar Bangunan Pendukung Teknis ({di.bangunanPendukung?.length || 0})</span>
                        </h4>

                        {isCurrentlySelected && (
                          <button
                            onClick={openAddBuilding}
                            className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 px-3 py-1 rounded-lg text-[10px] font-black flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Plus className="h-3 w-3" />
                            <span>Registrasi Bangunan Baru</span>
                          </button>
                        )}
                      </div>

                      {di.bangunanPendukung?.length === 0 ? (
                        <div className="bg-slate-50 border border-dashed border-slate-200 p-6 text-center rounded-2xl">
                          <p className="text-[11px] text-slate-500 italic">Belum ada data bangunan pendukung terinput di Daerah Irigasi ini.</p>
                          <button
                            onClick={() => handleOpenKelolaBangunan(di)}
                            className="text-[10px] text-indigo-600 hover:underline font-black mt-1.5 flex items-center gap-1 justify-center mx-auto cursor-pointer"
                          >
                            <span>Mulai kelola & tambah banguan pendukung pertama</span>
                            <ChevronRight className="h-3 w-3" />
                          </button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {di.bangunanPendukung.map((bld) => {
                            let bldBadge = 'bg-emerald-50 text-emerald-700 border border-emerald-100';
                            if (bld.kondisi === 'Rusak Berat') bldBadge = 'bg-rose-50 text-rose-700 border border-rose-100';
                            else if (bld.kondisi === 'Rusak Sedang') bldBadge = 'bg-orange-50 text-orange-700 border border-orange-100';
                            else if (bld.kondisi === 'Rusak Ringan') bldBadge = 'bg-amber-50 text-amber-700 border border-amber-100';

                            return (
                              <div 
                                key={bld.id} 
                                className="bg-slate-50/75 border border-slate-200/80 p-3.5 rounded-2xl flex flex-col justify-between gap-3 shadow-3xs hover:shadow-2xs transition-all text-xs"
                              >
                                <div className="space-y-2">
                                  {/* Top Row: Category tag and Condition */}
                                  <div className="flex items-center justify-between gap-2">
                                    <span className="px-2 py-0.5 bg-slate-200/60 rounded text-[9px] font-bold text-slate-650 tracking-wide uppercase truncate max-w-[120px]">
                                      {bld.kategori}
                                    </span>
                                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-black ${bldBadge}`}>
                                      {bld.kondisi}
                                    </span>
                                  </div>

                                  {/* Title and Notes */}
                                  <div>
                                    <h5 className="font-extrabold text-slate-900 text-[12px]">{bld.namaBangunan}</h5>
                                    {bld.keterangan && (
                                      <p className="text-[10.5px] text-slate-500 mt-1 Arial italic capitalize line-clamp-2">
                                        &ldquo;{bld.keterangan}&rdquo;
                                      </p>
                                    )}
                                  </div>

                                  {/* Rendering the upload photo or dummy placeholder */}
                                  <div className="relative h-24 w-full bg-slate-100 border border-slate-205 rounded-xl overflow-hidden flex items-center justify-center">
                                    {bld.foto ? (
                                      <>
                                        <img 
                                          src={bld.foto} 
                                          alt={bld.namaBangunan} 
                                          referrerPolicy="no-referrer"
                                          className="h-full w-full object-cover" 
                                        />
                                        <button 
                                          onClick={() => setActivePhoto({ title: bld.namaBangunan, src: bld.foto! })}
                                          className="absolute bottom-1 right-1 h-6 w-6 rounded bg-slate-900/60 hover:bg-slate-900 text-white flex items-center justify-center transition-all cursor-pointer"
                                          title="Zoom Foto"
                                        >
                                          <Eye className="h-3 w-3" />
                                        </button>
                                      </>
                                    ) : (
                                      <div className="flex flex-col items-center justify-center p-4 text-slate-400 gap-1 select-none">
                                        <Camera className="h-6 w-6 stroke-1.5" />
                                        <span className="text-[9px]">Belum Ada Foto</span>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Bottom coordinates and action triggers */}
                                <div className="border-t border-slate-200/60 pt-2.5 flex items-center justify-between text-[11px] font-medium">
                                  {bld.koordinat ? (
                                    <button
                                      onClick={() => setActiveCoordinates(bld.koordinat)}
                                      className="text-indigo-650 hover:text-indigo-800 font-bold flex items-center gap-0.5 transition-colors cursor-pointer"
                                      title="Plot di Google Maps Satelit"
                                    >
                                      <MapPin className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                                      <span className="font-mono text-[10px] underline tracking-tight truncate max-w-[110px]">{bld.koordinat}</span>
                                    </button>
                                  ) : (
                                    <span className="text-slate-400 italic">No Koordinat</span>
                                  )}

                                  {isCurrentlySelected && (
                                    <div className="flex items-center gap-1.5">
                                      <button
                                        onClick={() => openEditBuilding(bld)}
                                        className="h-6 w-6 bg-white border border-slate-200 rounded-lg flex items-center justify-center hover:bg-indigo-50 hover:text-indigo-700 transition-all cursor-pointer"
                                      >
                                        <Edit3 className="h-3 w-3" />
                                      </button>
                                      <button
                                        onClick={() => handleDeleteBuilding(bld.id)}
                                        className="h-6 w-6 bg-white border border-slate-200 rounded-lg flex items-center justify-center hover:bg-rose-50 hover:text-rose-700 transition-all cursor-pointer"
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          )}

          {/* PRINT BUTTON REPORT ON THE ENTIRE IRRIGATION WORK SKELETON */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Info className="h-4.5 w-4.5 text-indigo-500 shrink-0" />
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Anda dapat mencetak buku saku kompilasi untuk seluruh Daerah Irigasi (DI) yang berada di wilayah kerja UPTD PUPR Pematangsiantar untuk pelaporan berkala Dinas.
              </p>
            </div>
            <button
              onClick={() => {
                const win = window.open('', '_blank');
                if (win) {
                  const html = `
                    <html>
                      <head>
                        <title>Buku Saku Daerah Irigasi - UPTD PUPR</title>
                        <style>
                          body { font-family: sans-serif; padding: 40px; color: #1e293b; line-height: 1.5; font-size: 11px; }
                          h1 { font-size: 16px; font-weight: 900; text-align: center; border-bottom: 2px solid #000; padding-bottom: 15px; margin-bottom: 30px; text-transform: uppercase; }
                          h2 { font-size: 13px; font-weight: 800; border-bottom: 1px solid #cbd5e1; padding-bottom: 5px; margin-top: 25px; color: #4338ca; }
                          table { width: 100%; border-collapse: collapse; margin-block: 15px; }
                          th, td { border: 1px solid #cbd5e1; padding: 10px; text-align: left; }
                          th { background-color: #f8fafc; font-weight: bold; width: 180px; }
                          .bld-table th { width: auto; font-size: 10px; }
                          .bld-table td { font-size: 10px; }
                          .badge { display: inline-block; padding: 2px 6px; font-weight: bold; border-radius: 4px; font-size: 9px; border: 1px solid #ccc; text-transform: uppercase; }
                        </style>
                      </head>
                      <body>
                        <h1>BUKU INVENTARIS DAERAH IRIGASI & BANGUNAN AIR<br/>UPTD PUPR PEMATANGSIANTAR</h1>
                        <p style="text-align: center; font-size: 10px; margin-top: -20px; color: #64748b;">Tanggal Laporan: ${new Date().toLocaleDateString('id-ID')}</p>
                        
                        ${daerahIrigasiItems.map(di => `
                          <div>
                            <h2>${di.namaDI} (${di.lokasi})</h2>
                            <table>
                              <tr><th>Sumber Daya Air</th><td>${di.sumberAir}</td></tr>
                              <tr><th>Luas Areal Pertanian</th><td>${di.luasAreal} Hektar</td></tr>
                              <tr><th>Klasifikasi Kondisi</th><td><span class="badge">${di.kondisi}</span></td></tr>
                            </table>
                            
                            <h3>Bangunan Infrastruktur Pendukung:</h3>
                            ${di.bangunanPendukung?.length === 0 ? '<p>Belum ada data bangunan pendukung.</p>' : `
                              <table class="bld-table">
                                <thead>
                                  <tr>
                                    <th>Nama Bangunan</th>
                                    <th>Kategori Struktural</th>
                                    <th>Kondisi Fisik</th>
                                    <th>Koordinat Lapangan</th>
                                    <th>Kegunaan / Keterangan</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  ${di.bangunanPendukung.map(b => `
                                    <tr>
                                      <td><strong>${b.namaBangunan}</strong></td>
                                      <td>${b.kategori}</td>
                                      <td>${b.kondisi}</td>
                                      <td>${b.koordinat || '-'}</td>
                                      <td>${b.keterangan || '-'}</td>
                                    </tr>
                                  `).join('')}
                                </tbody>
                              </table>
                            `}
                          </div>
                          <hr style="border: 0; border-top: 1px dashed #cbd5e1; margin-block: 30px; page-break-after: always;" />
                        `).join('')}
                        <script>window.print();</script>
                      </body>
                    </html>
                  `;
                  win.document.write(html);
                  win.document.close();
                }
              }}
              className="px-3.5 py-2 bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 rounded-xl text-xs font-black tracking-tight shrink-0 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Printer className="h-4 w-4" />
              <span>Cetak Hasil Inventaris</span>
            </button>
          </div>

        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────────── */}
      {/* TAB SCREEN: WATER FLOWS & WATER LEVEL STATUS (TMA) */}
      {/* ──────────────────────────────────────────────────────────────────────── */}
      {activeTab === 'tma' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Detailed river summary cards */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white border border-slate-150 p-4 rounded-2xl flex items-center gap-3 shadow-3xs">
              <div className="h-9 w-9 rounded-xl bg-cyan-100 border border-cyan-200 flex items-center justify-center text-cyan-700 shrink-0">
                <Droplets className="h-4.5 w-4.5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Debit Aliran Rata-Rata</p>
                <p className="text-sm font-black text-slate-900">
                  {items.length > 0 ? (items.reduce((sum, item) => sum + item.debitAir, 0) / items.length).toFixed(1) : 0} m³/detik
                </p>
              </div>
            </div>

            <div className="bg-white border border-slate-150 p-4 rounded-2xl flex items-center gap-3 shadow-3xs">
              <div className="h-9 w-9 rounded-xl bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-700 shrink-0">
                <AlertTriangle className="h-4.5 w-4.5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Butuh Perbaikan Pintu</p>
                <p className="text-sm font-black text-slate-900">
                  {items.filter(item => item.kondisiPintu !== 'Sempurna').length} Lokasi Gerbang
                </p>
              </div>
            </div>

            <div className="bg-white border border-slate-150 p-4 rounded-2xl flex items-center gap-3 shadow-3xs col-span-2 lg:col-span-1">
              <div className="h-9 w-9 rounded-xl bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-700 shrink-0">
                <User className="h-4.5 w-4.5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Petugas Monitor Aktif</p>
                <p className="text-sm font-black text-slate-950">
                  {items.length > 0 ? Array.from(new Set(items.map(i => i.petugasJaga))).length : 0} Personil Sektoral
                </p>
              </div>
            </div>
          </div>

          {/* TMA Controls and add button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-50 border border-slate-200/60 p-3 rounded-2xl">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={tmaSearch}
                onChange={(e) => setTmaSearch(e.target.value)}
                placeholder="Cari lokasi TMA atau personil piket jaga..."
                className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <button
              onClick={openAddTma}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 shadow-3xs cursor-pointer"
            >
              <Plus className="h-3 w-3" />
              <span>Input Log Tinggi Air</span>
            </button>
          </div>

          {/* TMA LISTS TABLE */}
          <div className="bg-white border border-slate-150 rounded-2xl overflow-hidden shadow-3xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-150 text-slate-500 font-extrabold uppercase tracking-wider text-[10px]">
                    <th className="p-3 w-36">Tanggal Check</th>
                    <th className="p-3">Lokasi / Pintu Air</th>
                    <th className="p-3 text-center">Keadaan Pintu Gerbang</th>
                    <th className="p-3 text-right">Debit Air Terukur</th>
                    <th className="p-3 text-center">Status Siaga</th>
                    <th className="p-3">Pengamat Air Jaga</th>
                    <th className="p-3 text-center w-28">Operasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150">
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-10 text-center text-slate-400 italic">
                        Belum ada laporan TMA & operasional air yang diinput. Ketuk tombol &lsquo;Input Log Tinggi Air&rsquo; untuk memulai.
                      </td>
                    </tr>
                  ) : (
                    items
                      .filter(item => 
                        item.namaLokasi.toLowerCase().includes(tmaSearch.toLowerCase()) ||
                        item.petugasJaga.toLowerCase().includes(tmaSearch.toLowerCase())
                      )
                      .map((item) => {
                        let statusColor = 'bg-emerald-50 text-emerald-700 border-emerald-100';
                        if (item.statusKeamanan === 'Banjir') statusColor = 'bg-rose-50 text-rose-700 border-rose-100 animate-pulse';
                        else if (item.statusKeamanan === 'Siaga') statusColor = 'bg-orange-50 text-orange-700 border-orange-100';
                        else if (item.statusKeamanan === 'Waspada') statusColor = 'bg-amber-50 text-amber-700 border-amber-100';

                        let pintuColor = 'bg-emerald-100/60 text-emerald-800';
                        if (item.kondisiPintu === 'Rusak') pintuColor = 'bg-rose-100/60 text-rose-800';
                        else if (item.kondisiPintu === 'Butuh Perbaikan') pintuColor = 'bg-amber-100/60 text-amber-800';

                        return (
                          <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="p-3 font-medium text-slate-500 flex items-center gap-1.5">
                              <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                              <span>{item.tanggalCheck}</span>
                            </td>
                            <td className="p-3 font-extrabold text-slate-900">{item.namaLokasi}</td>
                            <td className="p-3 text-center">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${pintuColor}`}>
                                {item.kondisiPintu}
                              </span>
                            </td>
                            <td className="p-3 text-right font-black text-slate-800 font-sans">
                              {item.debitAir} m³/detik
                            </td>
                            <td className="p-3 text-center">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border ${statusColor}`}>
                                {item.statusKeamanan}
                              </span>
                            </td>
                            <td className="p-3 font-bold text-slate-650">{item.petugasJaga}</td>
                            <td className="p-3">
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  onClick={() => openEditTma(item)}
                                  className="h-7 w-7 rounded-lg border border-slate-200 hover:text-indigo-650 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
                                >
                                  <Edit3 className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  onClick={() => onDeleteItem(item.id)}
                                  className="h-7 w-7 rounded-lg border border-slate-201 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors cursor-pointer"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────────── */}
      {/* MODALS SKELETON LAYER */}
      {/* ──────────────────────────────────────────────────────────────────────── */}

      {/* 1. MODEL DAERAH IRIGASI FORM MODAL (ADD / EDIT) */}
      {showDiModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-subtle flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-sm w-full shadow-lg overflow-hidden animate-slide-up">
            <div className="px-5 py-4 border-b border-slate-150 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-1.5">
                <Compass className="h-4.5 w-4.5 text-indigo-600" />
                <h3 className="font-extrabold text-[13px] text-slate-900 font-sans uppercase tracking-tight">
                  {editingDi ? 'Edit Berkas Daerah Irigasi' : 'Registrasi Daerah Irigasi Baru'}
                </h3>
              </div>
              <button 
                type="button"
                onClick={() => setShowDiModal(false)}
                className="h-6 w-6 rounded-lg hover:bg-slate-200/50 flex items-center justify-center text-slate-450 hover:text-slate-700 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveDi} className="p-5 space-y-4 text-xs font-sans">
              
              <div className="space-y-1">
                <label className="font-bold text-slate-550 block">Nama Daerah Irigasi (DI) *</label>
                <input
                  type="text"
                  required
                  value={diForm.namaDI}
                  onChange={(e) => setDiForm({ ...diForm, namaDI: e.target.value })}
                  placeholder="Contoh: DI Bah Bolon, DI Marimbun, dll"
                  className="w-full p-2 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded-xl font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-550 block">Lokasi Sektoral Administrasi *</label>
                <input
                  type="text"
                  required
                  value={diForm.lokasi}
                  onChange={(e) => setDiForm({ ...diForm, lokasi: e.target.value })}
                  placeholder="Contoh: Kec. Siantar Barat, Kota Pematangsiantar"
                  className="w-full p-2 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-505 rounded-xl font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-550 block">Luas Areal Aliran * (Ha)</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={diForm.luasAreal || ''}
                    onChange={(e) => setDiForm({ ...diForm, luasAreal: Number(e.target.value) })}
                    placeholder="Contoh: 1800"
                    className="w-full p-2 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded-xl font-bold font-sans"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-550 block">Sumber Air Utama *</label>
                  <input
                    type="text"
                    required
                    value={diForm.sumberAir}
                    onChange={(e) => setDiForm({ ...diForm, sumberAir: e.target.value })}
                    placeholder="Contoh: Sungai Bah Bolon"
                    className="w-full p-2 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-550 block">Klasifikasi Kondisi Jaringan Irigasi *</label>
                <select
                  value={diForm.kondisi}
                  onChange={(e) => setDiForm({ ...diForm, kondisi: e.target.value as any })}
                  className="w-full p-2 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded-xl font-bold text-slate-700 cursor-pointer"
                >
                  <option value="Baik">Konisi Baik (Prasarana Prima)</option>
                  <option value="Rusak Ringan">Rusak Ringan</option>
                  <option value="Rusak Sedang">Rusak Sedang</option>
                  <option value="Rusak Berat">Rusak Berat (Butuh Rehabilitasi)</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-150 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowDiModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-550 hover:bg-slate-50 font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-650 hover:bg-indigo-700 text-white font-extrabold rounded-xl transition-colors shadow-3xs cursor-pointer"
                >
                  Simpan Berkas
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* 2. INLINE ADD / EDIT BUILDING PENDUKUNG DIALOG MODAL */}
      {showBuildingFormModal && activeDiForBuildings && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-subtle flex items-center justify-center p-4 z-[60] animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full shadow-lg overflow-hidden animate-slide-up">
            <div className="px-5 py-4 border-b border-slate-150 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4.5 w-4.5 text-indigo-605" />
                <h3 className="font-extrabold text-[12.5px] text-slate-900 font-sans uppercase tracking-tight">
                  {editingBuilding ? `Edit Bangunan: ${editingBuilding.namaBangunan}` : `Tambah Bangunan Pendukung (${activeDiForBuildings.namaDI})`}
                </h3>
              </div>
              <button 
                type="button"
                onClick={() => setShowBuildingFormModal(false)}
                className="h-6 w-6 rounded-lg hover:bg-slate-200/50 flex items-center justify-center text-slate-450 hover:text-slate-700 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveBuilding} className="p-5 space-y-4 text-xs font-sans">
              
              <div className="space-y-1">
                <label className="font-bold text-slate-550 block">Nama Bangunan Pendukung Teknis *</label>
                <input
                  type="text"
                  required
                  value={buildingForm.namaBangunan}
                  onChange={(e) => setBuildingForm({ ...buildingForm, namaBangunan: e.target.value })}
                  placeholder="Contoh: Bendung Karet Primer, Pintu Intake Sekunder, dll"
                  className="w-full p-2 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded-xl font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-550 block">Kategori Struktural *</label>
                  <select
                    value={buildingForm.kategori}
                    onChange={(e) => setBuildingForm({ ...buildingForm, kategori: e.target.value })}
                    className="w-full p-2 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded-xl font-medium text-slate-700 cursor-pointer"
                  >
                    {kategoriBangunanOpt.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-550 block">Kondisi Bangunan Air *</label>
                  <select
                    value={buildingForm.kondisi}
                    onChange={(e) => setBuildingForm({ ...buildingForm, kondisi: e.target.value as any })}
                    className="w-full p-2 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded-xl font-bold text-slate-700 cursor-pointer"
                  >
                    <option value="Baik">Kondisi Baik</option>
                    <option value="Rusak Ringan">Rusak Ringan</option>
                    <option value="Rusak Sedang">Rusak Sedang</option>
                    <option value="Rusak Berat">Rusak Berat</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-1">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-550 block">Koordinat Lokasi yang Terintegrasi dengan Google Map</label>
                  <button
                    type="button"
                    onClick={() => fetchDeviceLocation()}
                    disabled={gpsLoading}
                    className="text-[10px] text-indigo-650 hover:text-indigo-850 font-black flex items-center gap-1 cursor-pointer transition-all disabled:opacity-50"
                  >
                    <span>{gpsLoading ? 'Mencari...' : '🔄 Sinkron GPS Perangkat'}</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={buildingForm.koordinat}
                  onChange={(e) => setBuildingForm({ ...buildingForm, koordinat: e.target.value })}
                  placeholder="Contoh: 2.9463, 99.0438  (Latitude, Longitude)"
                  className="w-full p-2 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded-xl font-mono"
                />
                {gpsError && (
                  <p className="text-[10px] text-rose-600 font-medium pb-0.5">
                    ⚠️ {gpsError}
                  </p>
                )}
                {gpsLoading && (
                  <p className="text-[10px] text-indigo-600 animate-pulse font-medium pb-0.5">
                    ⏳ Sedang membaca posisi GPS terbaik dari perangkat Anda...
                  </p>
                )}
                {!gpsError && !gpsLoading && buildingForm.koordinat && (
                  <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5 pb-0.5">
                    ✅ GPS Berhasil Terdeteksi &amp; Sinkron!
                  </p>
                )}
                <p className="text-[9.5px] text-slate-400">
                  Koordinat ini terhubung otomatis untuk menampilkan peta satelit Google Map di aplikasi.
                </p>
              </div>

              {/* INPUT FOTO DENGAN KAMERA PERANGKAT ATAU DOKUMEN FOTO */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-550 block flex items-center gap-1">
                  <Camera className="h-3.5 w-3.5 text-indigo-550" />
                  <span>Ambil Foto Bangunan (Kamera Perangkat atau Unggah File)</span>
                </label>

                <div className="flex items-center gap-3">
                  <div className="h-20 w-20 bg-slate-100 border border-slate-205 rounded-xl flex items-center justify-center text-slate-400 overflow-hidden shrink-0">
                    {buildingForm.foto ? (
                      <img 
                        src={buildingForm.foto} 
                        alt="Preview" 
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover" 
                      />
                    ) : (
                      <Camera className="h-6 w-6 stroke-1" />
                    )}
                  </div>

                  <div className="flex-1 space-y-1.5">
                    {/* File Input Supporting 'capture' attribute for camera on phone */}
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      className="hidden"
                      id="building-camera-photo"
                    />
                    
                    <div className="flex flex-wrap gap-2 text-[10.5px]">
                      {/* Button to click capture or upload */}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-250 text-slate-700 rounded-lg font-bold flex items-center gap-1 cursor-pointer transition-all"
                      >
                        <Upload className="h-3 w-3" />
                        <span>Pilih File / Ambil Foto</span>
                      </button>

                      {buildingForm.foto && (
                        <button
                          type="button"
                          onClick={() => setBuildingForm(prev => ({ ...prev, foto: '' }))}
                          className="px-2 py-1.5 bg-rose-50 text-rose-600 border border-rose-100 rounded-lg font-bold hover:bg-rose-100 cursor-pointer"
                        >
                          Hapus Foto
                        </button>
                      )}
                    </div>
                    <p className="text-[9.5px] text-slate-400 leading-normal">
                      Mendukung penangkapan kamera langsung pada handphone, atau upload berkas format JPEG/PNG (Maks 2MB).
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-550 block">Keterangan / Catatan Teknis</label>
                <textarea
                  rows={2}
                  value={buildingForm.keterangan}
                  onChange={(e) => setBuildingForm({ ...buildingForm, keterangan: e.target.value })}
                  placeholder="Ketik rincian spesifikasi, tahun rehabilitasi, kondisi mekanikal, dll..."
                  className="w-full p-2 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded-xl"
                />
              </div>

              <div className="pt-3 border-t border-slate-150 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowBuildingFormModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-550 hover:bg-slate-50 font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-650 hover:bg-indigo-700 text-white font-extrabold rounded-xl transition-colors shadow-3xs cursor-pointer"
                >
                  Sematkan Bangunan
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* 3. LIGHTBOX LARGE PHOTO VIEWER MODAL */}
      {activePhoto && (
        <div 
          onClick={() => setActivePhoto(null)} 
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-[70] cursor-zoom-out animate-fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="bg-white rounded-3xl overflow-hidden max-w-2xl w-full shadow-2xl relative border border-slate-800 animate-scale-up"
          >
            <div className="px-5 py-4 border-b border-slate-150 flex items-center justify-between bg-slate-50">
              <h4 className="font-black text-xs text-slate-900 tracking-tight block uppercase">{activePhoto.title}</h4>
              <button 
                onClick={() => setActivePhoto(null)}
                className="h-7 w-7 rounded-lg bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-700 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="bg-slate-900/95 flex items-center justify-center p-2 max-h-[80vh]">
              <img 
                src={activePhoto.src} 
                alt={activePhoto.title} 
                referrerPolicy="no-referrer"
                className="max-h-[75vh] max-w-full object-contain" 
              />
            </div>
          </div>
        </div>
      )}

      {/* 4. WATER LEVEL LOGS MODAL (ADD / EDIT) */}
      {showTmaModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-subtle flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-sm w-full shadow-lg overflow-hidden animate-slide-up">
            <div className="px-5 py-4 border-b border-slate-150 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-1.5">
                <Droplets className="h-4.5 w-4.5 text-indigo-605" />
                <h3 className="font-extrabold text-[13px] text-slate-800 font-sans uppercase tracking-tight">
                  {editingTma ? 'Edit Log TMA' : 'Input Log Tinggi Air & Gerbang'}
                </h3>
              </div>
              <button 
                type="button"
                onClick={() => setShowTmaModal(false)}
                className="h-6 w-6 rounded-lg hover:bg-slate-250 flex items-center justify-center text-slate-450 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTmaReport} className="p-5 space-y-4 text-xs font-sans">
              
              <div className="space-y-1">
                <label className="font-bold text-slate-550 block">Nama Lokasi Pemantauan / Pintu Air *</label>
                <input
                  type="text"
                  required
                  value={tmaForm.namaLokasi}
                  onChange={(e) => setTmaForm({ ...tmaForm, namaLokasi: e.target.value })}
                  placeholder="Contoh: Intake Kanan Bendung Bah Bolon"
                  className="w-full p-2 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded-xl font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-550 block">Status Keamanan Air *</label>
                  <select
                    value={tmaForm.statusKeamanan}
                    onChange={(e) => setTmaForm({ ...tmaForm, statusKeamanan: e.target.value as any })}
                    className="w-full p-2 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-505 rounded-xl cursor-pointer font-bold"
                  >
                    <option value="Aman">Normal / Aman</option>
                    <option value="Waspada">Waspada (Sedikit Meluap)</option>
                    <option value="Siaga">Siaga (Meluap Tinggi)</option>
                    <option value="Banjir">Banjir (Gawat Darurat)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-550 block">Kondisi Fisik Gerbang *</label>
                  <select
                    value={tmaForm.kondisiPintu}
                    onChange={(e) => setTmaForm({ ...tmaForm, kondisiPintu: e.target.value as any })}
                    className="w-full p-2 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-505 rounded-xl cursor-pointer font-bold"
                  >
                    <option value="Sempurna">Sempurna</option>
                    <option value="Butuh Perbaikan">Butuh Perbaikan</option>
                    <option value="Rusak">Rusak Total / Macet</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-550 block">Debit Air * (m³/detik)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    required
                    value={tmaForm.debitAir || ''}
                    onChange={(e) => setTmaForm({ ...tmaForm, debitAir: Number(e.target.value) })}
                    placeholder="Contoh: 12.5"
                    className="w-full p-2 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded-xl font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-550 block">Tanggal Pemantauan *</label>
                  <input
                    type="date"
                    required
                    value={tmaForm.tanggalCheck}
                    onChange={(e) => setTmaForm({ ...tmaForm, tanggalCheck: e.target.value })}
                    className="w-full p-2 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-505 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-550 block">Personil Juru Pengamat Air Jaga *</label>
                <input
                  type="text"
                  required
                  value={tmaForm.petugasJaga}
                  onChange={(e) => setTmaForm({ ...tmaForm, petugasJaga: e.target.value })}
                  placeholder="Ketikkan nama lengkap pengawas pintu air..."
                  className="w-full p-2 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-505 rounded-xl font-semibold"
                />
              </div>

              <div className="pt-3 border-t border-slate-150 flex items-center justify-end gap-2 text-xs font-sans font-bold">
                <button
                  type="button"
                  onClick={() => setShowTmaModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-550 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-650 hover:bg-indigo-700 text-white rounded-xl transition-colors shadow-3xs cursor-pointer"
                >
                  Simpan Laporan
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
