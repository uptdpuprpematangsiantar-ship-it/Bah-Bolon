/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Mail, Sparkles, Code2, Settings, HelpCircle } from 'lucide-react';
import { AdmUmumItem } from '../types';

interface AdmUmumProps {
  items: AdmUmumItem[];
  onAddItem: (item: AdmUmumItem) => void;
  onUpdateItem: (item: AdmUmumItem) => void;
  onDeleteItem: (id: string) => void;
}

export default function AdmUmum({}: AdmUmumProps) {
  return (
    <div className="space-y-8 font-sans text-slate-800 p-2">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-150 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-700 flex items-center justify-center">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">
                Administrasi Umum & Persuratan
              </h1>
              <p className="text-slate-550 text-xs mt-0.5">
                Pencatatan korespondensi keluar, surat masuk dari instansi luar, surat keputusan (SK) kepala UPTD, dan nota dinas internal.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Blueprint Area */}
      <div className="relative overflow-hidden bg-slate-50 border border-dashed border-slate-300 rounded-3xl p-8 md:p-12 text-center shadow-xs">
        {/* Ambient grids backdrop */}
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]" />
        
        <div className="relative max-w-lg mx-auto space-y-6">
          {/* Visual Badge representing an empty block ready for custom development */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-200 text-violet-750 text-[10px] font-black uppercase tracking-widest animate-pulse mx-auto">
            <Sparkles className="h-3 w-3" />
            <span>Penyimpanan Bersih</span>
          </div>

          <div className="h-16 w-16 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-center mx-auto text-slate-400">
            <Code2 className="h-8 w-8 text-slate-400" />
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
              Seksi Administrasi Umum Kosong
            </h2>
            <p className="text-xs text-slate-550 leading-relaxed max-w-md mx-auto">
              Halaman ini telah dikosongkan secara permanen dari dummy data bawaan. Anda dapat meminta pembuatan modul sirkulasi surat masuk/keluar kustom, struktur disposisi seksi terkait, arsip digital PDF, atau kalender agenda surat penting.
            </p>
          </div>

          {/* Suggested ideas block */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 text-left shadow-2xs">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-3 flex items-center gap-1.5">
              <Settings className="h-3.5 w-3.5 text-slate-500" />
              <span>Gagasan Kustomisasi Administrasi & Surat:</span>
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-650">
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-violet-600 mt-1.5 shrink-0" />
                <span><strong>Buku Agenda Surat Masuk/Keluar</strong>: Alur tabel inputan surat, sub-kategori, nomor agenda otomatis, instansi asal, dan tujuan.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-sky-500 mt-1.5 shrink-0" />
                <span><strong>Delegasi Disposisi Kepala UPTD</strong>: Form penunjukan tindak lanjut surat perintah tugas bagi kepala seksi dan petugas.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <span><strong>Arsip SK & Nota Dinas</strong>: Khusus penataan arsip berbasis digital cloud dan pelacakan seberapa lama arsip tersimpan fisik.</span>
              </li>
            </ul>
          </div>

          {/* Friendly prompt tag */}
          <div className="text-[11px] text-slate-400 font-mono flex items-center justify-center gap-1.5 pt-2">
            <HelpCircle className="h-3.5 w-3.5" />
            <span>Ketikkan konsep yang Anda inginkan di ruang chat untuk mulai mendesain halaman ini</span>
          </div>
        </div>
      </div>
    </div>
  );
}
