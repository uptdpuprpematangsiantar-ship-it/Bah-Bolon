/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Mail, Edit3, Settings, Sparkles, Code2 } from 'lucide-react';

interface PenatausahaanProps {
  items?: any[];
  onAddItem?: (item: any) => void;
  onUpdateItem?: (item: any) => void;
  onDeleteItem?: (id: string) => void;
}

export default function Penatausahaan({}: PenatausahaanProps) {
  return (
    <div className="space-y-8 font-sans text-slate-800 animate-fade-in p-2">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6 pointer-events-none select-none">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-700 flex items-center justify-center">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">
                Penatausahaan & Arsip Khusus
              </h1>
              <p className="text-slate-500 text-xs mt-0.5">
                Halaman ini telah dikosongkan. Data persuratan sebelumnya telah sukses dipindahkan ke Sub-Halaman Surat Masuk & Surat Keluar di menu Administrasi Umum.
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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-200 text-sky-700 text-[10px] font-black uppercase tracking-widest animate-pulse mx-auto">
            <Sparkles className="h-3 w-3" />
            <span>Ruang Kerja Kustom Mandiri</span>
          </div>

          <div className="h-16 w-16 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-center mx-auto text-slate-400">
            <Code2 className="h-8 w-8 text-slate-400" />
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
              Siap Dikustomisasi Sesuai Kebutuhan Anda
            </h2>
            <p className="text-xs text-slate-550 leading-relaxed max-w-md mx-auto">
              Halaman ini sekarang sepenuhnya kosong dari data alur surat bawaan. Anda dapat meminta penambahan grafik rekapitulasi, form kalkulator, pengingat disposisi, atau alur kerja baru lainnya yang Anda butuhkan di sini.
            </p>
          </div>

          {/* Suggested ideas block */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 text-left shadow-2xs">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-3 flex items-center gap-1.5">
              <Settings className="h-3.5 w-3.5 text-slate-500" />
              <span>Gagasan Kustomisasi yang Tersedia:</span>
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-sky-500 mt-1.5 shrink-0" />
                <span><strong>Analisis & Bagan Grafik</strong>: Tampilkan tren volume surat bulanan, klasifikasi terbanyak, atau sisa waktu penyelesaian disposisi.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0" />
                <span><strong>Alat Pengingat Tenggat</strong>: Kalender terstruktur penanganan tindak lanjut surat penting atau agenda rapat kepala UPTD.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <span><strong>Pengelolaan Memorandum / Nota Internal</strong>: Alur sirkulasi dokumen digital internal antar staf seksi khusus.</span>
              </li>
            </ul>
          </div>

          {/* Friendly prompt tag */}
          <div className="text-[11px] text-slate-400 font-mono flex items-center justify-center gap-1.5 pt-2">
            <Edit3 className="h-3.5 w-3.5" />
            <span>Ketik permintaan Anda di ruang chat untuk mulai membangun halaman ini</span>
          </div>
        </div>
      </div>
    </div>
  );
}
