/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { DollarSign, Sparkles, Code2, Settings, HelpCircle } from 'lucide-react';
import { KeuanganItem } from '../types';

interface KeuanganProps {
  items: KeuanganItem[];
  onAddItem: (item: KeuanganItem) => void;
  onUpdateItem: (item: KeuanganItem) => void;
  onDeleteItem: (id: string) => void;
}

export default function Keuangan({}: KeuanganProps) {
  return (
    <div className="space-y-8 font-sans text-slate-800 p-2">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-150 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 flex items-center justify-center">
              <DollarSign className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">
                Keuangan & Pagu Anggaran
              </h1>
              <p className="text-slate-550 text-xs mt-0.5">
                Pemantauan realisasi anggaran SKPD, belanja jasa pegawai honorer/petugas pintu air, belanja modal operasional rutin, serta laporan keuangan triwulanan UPTD.
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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-200 text-emerald-750 text-[10px] font-black uppercase tracking-widest animate-pulse mx-auto">
            <Sparkles className="h-3 w-3" />
            <span>Penyimpanan Bersih</span>
          </div>

          <div className="h-16 w-16 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-center mx-auto text-slate-400">
            <Code2 className="h-8 w-8 text-slate-400" />
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
              Seksi Keuangan & Anggaran Kosong
            </h2>
            <p className="text-xs text-slate-550 leading-relaxed max-w-md mx-auto">
              Halaman ini telah dikosongkan secara permanen dari dummy data bawaan. Anda dapat meminta penambahan form penyerapan anggaran, bagan grafik lingkaran (Pie Chart) pengalokasian porsi dana, atau modul input nota kwitansi pertanggungjawaban dinas.
            </p>
          </div>

          {/* Suggested ideas block */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 text-left shadow-2xs">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-3 flex items-center gap-1.5">
              <Settings className="h-3.5 w-3.5 text-slate-500" />
              <span>Gagasan Kustomisasi Keuangan:</span>
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-650">
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <span><strong>Pagu Belanja Daerah (DPA)</strong>: Pemonitoran kode rekening anggaran belanja pegawai, belanja jasa, belanja pemeliharaan mesin, dan persentase penyerapannya.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                <span><strong>Bagan Realisasi Keuangan</strong>: Grafik perbandingan visual (progress chart) antara sisa pagu aman dengan realisasi SP2D yang cair.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-violet-600 mt-1.5 shrink-0" />
                <span><strong>Sistem Kwitansi Digital</strong>: Pencatatan pengeluaran SPJ (Surat Pertanggungjawaban) kecil/operasional harian bagi bendahara pembantu seksi UPTD PUPR Pematangsiantar.</span>
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
