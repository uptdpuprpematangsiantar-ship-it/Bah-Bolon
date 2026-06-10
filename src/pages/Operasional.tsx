/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState } from 'react';
import { 
  Compass, 
  MapPin, 
  Plus, 
  Edit3, 
  Trash2, 
  Search, 
  X, 
  Sparkles
} from 'lucide-react';
import { OperasionalItem, DaerahIrigasi } from '../types';

interface OperasionalProps {
  items?: OperasionalItem[];
  onAddItem?: (item: OperasionalItem) => void;
  onUpdateItem?: (item: OperasionalItem) => void;
  onDeleteItem?: (id: string) => void;
  daerahIrigasiItems: DaerahIrigasi[];
  onUpdateDaerahIrigasi: (items: DaerahIrigasi[]) => void;
  defaultTab?: 'tma' | 'irigasi';
}

export default function Operasional({
  daerahIrigasiItems = [],
  onUpdateDaerahIrigasi
}: OperasionalProps) {
  // --- STATE FOR DAERAH IRIGASI ---
  const [diSearch, setDiSearch] = useState('');
  const [showDiModal, setShowDiModal] = useState(false);
  const [editingDi, setEditingDi] = useState<DaerahIrigasi | null>(null);
  const [diForm, setDiForm] = useState({
    namaDI: '',
    lokasi: '',
    luasAreal: 0,
    sumberAir: '',
    kondisi: 'Baik' as 'Baik' | 'Rusak Ringan' | 'Rusak Sedang' | 'Rusak Berat',
  });

  // --- HANDLERS FOR DAERAH IRIGASI ---
  const handleOpenAddDi = () => {
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

  const handleOpenEditDi = (di: DaerahIrigasi) => {
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
    if (!diForm.namaDI.trim() || !diForm.lokasi.trim()) {
      alert('Harap isi semua kolom wajib!');
      return;
    }

    const updatedList = [...daerahIrigasiItems];
    if (editingDi) {
      const idx = updatedList.findIndex(x => x.id === editingDi.id);
      if (idx !== -1) {
        updatedList[idx] = {
          ...editingDi,
          ...diForm,
        };
      }
    } else {
      updatedList.push({
        id: 'di-' + Date.now(),
        ...diForm,
        bangunanPendukung: []
      });
    }
    onUpdateDaerahIrigasi(updatedList);
    setShowDiModal(false);
  };

  const handleDeleteDi = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus data Daerah Irigasi ini?')) {
      const filtered = daerahIrigasiItems.filter(x => x.id !== id);
      onUpdateDaerahIrigasi(filtered);
    }
  };

  // Filter list based on search
  const filteredDi = daerahIrigasiItems.filter(x =>
    x.namaDI.toLowerCase().includes(diSearch.toLowerCase()) ||
    x.lokasi.toLowerCase().includes(diSearch.toLowerCase()) ||
    x.sumberAir.toLowerCase().includes(diSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-150 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-sky-500/10 border border-sky-400/20 text-sky-650 flex items-center justify-center">
              <Compass className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-900 tracking-tight">
                Seksi Operasional & Pemeliharaan (OP)
              </h1>
              <p className="text-slate-500 text-xs">
                Sistem pendataan dan inventarisasi Daerah Irigasi di bawah UPTD PUPR Pematangsiantar.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────────────────── */}
      {/* INVENTARIS DAERAH IRIGASI */}
      {/* ──────────────────────────────────────────────────────────────────────── */}
      <div className="space-y-5">
        {/* Action and Search Panel */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-50 border border-slate-150 p-3 rounded-2xl">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={diSearch}
              onChange={(e) => setDiSearch(e.target.value)}
              placeholder="Cari Daerah Irigasi, lokasi, atau sumber air..."
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <button
            onClick={handleOpenAddDi}
            className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 shadow-3xs cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Daftar Irigasi Baru</span>
          </button>
        </div>

        {/* Table / List */}
        {filteredDi.length === 0 ? (
          <div className="border border-dashed border-slate-250 rounded-2xl p-12 text-center bg-slate-25/50">
            <Compass className="h-10 w-10 text-slate-350 mx-auto mb-3" />
            <p className="text-xs font-extrabold text-slate-700">Belum Ada Data Daerah Irigasi</p>
            <p className="text-[11px] text-slate-450 mt-1 max-w-sm mx-auto">
              Silakan klik tombol <strong>'Daftar Irigasi Baru'</strong> untuk menambahkan data Daerah Irigasi pertama Anda.
            </p>
          </div>
        ) : (
          <div className="bg-white border border-slate-150 rounded-2xl overflow-hidden shadow-3xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-150 text-slate-500 font-extrabold uppercase tracking-wider text-[10px]">
                  <th className="px-4 py-3">Nama Daerah Irigasi</th>
                  <th className="px-4 py-3">Lokasi Administrasi</th>
                  <th className="px-4 py-3 text-right">Luas Areal (Ha)</th>
                  <th className="px-4 py-3">Sumber Air Baku</th>
                  <th className="px-4 py-3">Status Kondisi</th>
                  <th className="px-4 py-3 text-right">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredDi.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/40 transition-colors">
                    <td className="px-4 py-3 font-semibold text-slate-900 flex items-center gap-1.5">
                      <MapPin className="h-3 w-3 text-sky-500" />
                      <span>{item.namaDI}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-550">{item.lokasi}</td>
                    <td className="px-4 py-3 text-right font-mono text-slate-700 font-bold">{item.luasAreal.toLocaleString('id-ID')} Ha</td>
                    <td className="px-4 py-3 text-slate-550">{item.sumberAir || '-'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.kondisi === 'Baik' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                          : item.kondisi === 'Rusak Ringan'
                          ? 'bg-amber-50 text-amber-700 border border-amber-100'
                          : 'bg-rose-50 text-rose-700 border border-rose-100'
                      }`}>
                        {item.kondisi}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEditDi(item)}
                          className="h-7 w-7 rounded-lg border border-slate-200 hover:text-indigo-650 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteDi(item.id)}
                          className="h-7 w-7 rounded-lg border border-slate-200 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors cursor-pointer"
                          title="Hapus"
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
        )}
      </div>

      {/* ──────────────────────────────────────────────────────────────────────── */}
      {/* MODAL WORKFLOW: DAERAH IRIGASI FORM */}
      {/* ──────────────────────────────────────────────────────────────────────── */}
      {showDiModal && (
        <div className="fixed inset-0 bg-slate-900/65 backdrop-blur-subtle flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full shadow-lg overflow-hidden animate-slide-up">
            <div className="px-5 py-4 border-b border-slate-150 flex items-center justify-between bg-slate-50">
              <h3 className="font-extrabold text-slate-900 text-sm">
                {editingDi ? 'Ubah Inventaris Daerah Irigasi' : 'Daftarkan Daerah Irigasi Baru'}
              </h3>
              <button
                onClick={() => setShowDiModal(false)}
                className="h-6 w-6 rounded-lg hover:bg-slate-200 flex items-center justify-center text-slate-450 hover:text-slate-750 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveDi} className="p-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase tracking-wide text-slate-500">Nama Daerah Irigasi (DI)*</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: DI Sitalasari"
                  value={diForm.namaDI}
                  onChange={(e) => setDiForm({...diForm, namaDI: e.target.value})}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:ring-1 focus:ring-indigo-500 focus:outline-none rounded-xl text-xs font-semibold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase tracking-wide text-slate-500">Lokasi / Wilayah Kerja*</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Siantar Sitalasari, Kota Pematangsiantar"
                  value={diForm.lokasi}
                  onChange={(e) => setDiForm({...diForm, lokasi: e.target.value})}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:ring-1 focus:ring-indigo-500 focus:outline-none rounded-xl text-xs font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold uppercase tracking-wide text-slate-500">Luas Areal (Hektar)</label>
                  <input
                    type="number"
                    step="any"
                    placeholder="Contoh: 142.5"
                    value={diForm.luasAreal || ''}
                    onChange={(e) => setDiForm({...diForm, luasAreal: parseFloat(e.target.value) || 0})}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:ring-1 focus:ring-indigo-500 focus:outline-none rounded-xl text-xs font-semibold font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold uppercase tracking-wide text-slate-500">Sumber Air Baku</label>
                  <input
                    type="text"
                    placeholder="Contoh: Sungai Bah Bolon"
                    value={diForm.sumberAir}
                    onChange={(e) => setDiForm({...diForm, sumberAir: e.target.value})}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:ring-1 focus:ring-indigo-500 focus:outline-none rounded-xl text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase tracking-wide text-slate-500">Kondisi Bangunan & Saluran</label>
                <select
                  value={diForm.kondisi}
                  onChange={(e) => setDiForm({...diForm, kondisi: e.target.value as any})}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:ring-1 focus:ring-indigo-500 focus:outline-none rounded-xl text-xs font-bold text-slate-700 cursor-pointer"
                >
                  <option value="Baik">Kondisi Baik (Prima)</option>
                  <option value="Rusak Ringan">Rusak Ringan</option>
                  <option value="Rusak Sedang">Rusak Sedang</option>
                  <option value="Rusak Berat">Rusak Berat (Butuh Rehabilitasi)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowDiModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-550 hover:bg-slate-50 font-bold text-xs cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-650 hover:bg-indigo-700 text-white text-xs font-extrabold rounded-xl transition-colors shadow-3xs cursor-pointer"
                >
                  Simpan Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
