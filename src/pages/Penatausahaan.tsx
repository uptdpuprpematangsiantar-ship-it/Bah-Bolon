/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import {
  Users,
  Award,
  BookOpen,
  PieChart,
  BarChart3,
  Calendar,
  Sparkles,
  Info,
  Layers,
  ArrowRight,
  TrendingUp,
  Heart
} from 'lucide-react';
import { PersonaliaItem } from '../types';

interface PenatausahaanProps {
  items?: any[];
  onAddItem?: (item: any) => void;
  onUpdateItem?: (item: any) => void;
  onDeleteItem?: (id: string) => void;
  personaliaItems?: PersonaliaItem[];
}

export default function Penatausahaan({ personaliaItems = [] }: PenatausahaanProps) {
  const staff = personaliaItems || [];
  const totalCount = staff.length;

  // --- 1. STATISTICS GOLONGAN & PANGKAT ---
  const pangkatSummary = useMemo(() => {
    let iv = 0;
    let iii = 0;
    let ii = 0;
    let i = 0;
    let pppk = 0;
    let honor = 0;

    const details: Record<string, number> = {};

    staff.forEach((item) => {
      const g = item.pangkatGolongan;
      if (!g) return;

      // Group counts
      if (g.startsWith('IV/')) iv++;
      else if (g.startsWith('III/')) iii++;
      else if (g.startsWith('II/')) ii++;
      else if (g.startsWith('I/')) i++;
      else if (g === 'PPPK') pppk++;
      else if (g === 'Honor') honor++;

      // Detailed breakdown counts
      details[g] = (details[g] || 0) + 1;
    });

    const groups = [
      { id: 'IV', label: 'PNS Golongan IV (Pembina)', count: iv, color: 'bg-teal-600', text: 'text-teal-700', bg: 'bg-teal-50' },
      { id: 'III', label: 'PNS Golongan III (Penata)', count: iii, color: 'bg-sky-600', text: 'text-sky-700', bg: 'bg-sky-50' },
      { id: 'II', label: 'PNS Golongan II (Pengatur)', count: ii, color: 'bg-violet-600', text: 'text-violet-700', bg: 'bg-violet-50' },
      { id: 'I', label: 'PNS Golongan I (Juru)', count: i, color: 'bg-pink-600', text: 'text-pink-700', bg: 'bg-pink-50' },
      { id: 'PPPK', label: 'Pegawai PPPK', count: pppk, color: 'bg-emerald-600', text: 'text-emerald-700', bg: 'bg-emerald-50' },
      { id: 'Honor', label: 'Pegawai Honor Kontrak', count: honor, color: 'bg-amber-600', text: 'text-amber-700', bg: 'bg-amber-50' }
    ].filter(g => g.count > 0 || totalCount === 0); // Keep nonzero, or show all if empty

    return { groups, details };
  }, [staff, totalCount]);

  // --- 2. STATISTICS GENDER ---
  const genderSummary = useMemo(() => {
    let male = 0;
    let female = 0;

    staff.forEach((item) => {
      const gk = item.jenisKelamin?.toLowerCase() || '';
      if (gk.includes('perempuan') || gk === 'p' || gk.includes('wanita')) {
        female++;
      } else if (gk.includes('laki') || gk === 'l' || gk.includes('pria')) {
        male++;
      }
    });

    const total = male + female || 1;
    return {
      male,
      female,
      malePercent: totalCount > 0 ? Math.round((male / total) * 100) : 0,
      femalePercent: totalCount > 0 ? Math.round((female / total) * 100) : 0
    };
  }, [staff, totalCount]);

  // --- 3. STATISTICS AGAMA ---
  const religionSummary = useMemo(() => {
    const predefined: Record<string, number> = {
      'Islam': 0,
      'Kristen Protestan': 0,
      'Katolik': 0,
      'Hindu': 0,
      'Buddha': 0,
      'Konghucu': 0,
      'Lainnya': 0
    };

    staff.forEach((item) => {
      const r = item.agama;
      if (!r) {
        predefined['Lainnya']++;
        return;
      }
      
      const key = r.toLowerCase();
      if (key === 'islam') predefined['Islam']++;
      else if (key.includes('protestan') || key === 'kristen') predefined['Kristen Protestan']++;
      else if (key.includes('katolik')) predefined['Katolik']++;
      else if (key.includes('hindu')) predefined['Hindu']++;
      else if (key.includes('buda') || key.includes('buddha')) predefined['Buddha']++;
      else if (key.includes('hucu') || key.includes('konghucu')) predefined['Konghucu']++;
      else predefined['Lainnya']++;
    });

    // Transform into a sorted colored progress breakdown list
    const items = Object.keys(predefined)
      .map(name => {
        let color = 'bg-stone-500';
        let badgeColor = 'text-stone-700 bg-stone-100';
        if (name === 'Islam') { color = 'bg-teal-500'; badgeColor = 'text-teal-700 bg-teal-50'; }
        else if (name === 'Kristen Protestan') { color = 'bg-sky-500'; badgeColor = 'text-sky-700 bg-sky-50'; }
        else if (name === 'Katolik') { color = 'bg-violet-500'; badgeColor = 'text-violet-700 bg-violet-50'; }
        else if (name === 'Hindu') { color = 'bg-amber-500'; badgeColor = 'text-amber-700 bg-amber-50'; }
        else if (name === 'Buddha') { color = 'bg-orange-500'; badgeColor = 'text-orange-700 bg-orange-50'; }
        else if (name === 'Konghucu') { color = 'bg-red-500'; badgeColor = 'text-red-700 bg-red-50'; }

        return {
          name,
          count: predefined[name],
          percent: totalCount > 0 ? Math.round((predefined[name] / totalCount) * 100) : 0,
          color,
          badgeColor
        };
      })
      .filter(item => item.count > 0 || totalCount === 0) // only active, or all if empty
      .sort((a, b) => b.count - a.count);

    return items;
  }, [staff, totalCount]);

  // Doughnut Math for Gender Chart
  // Radius: 35, stroke: 8. Circumference = 2 * PI * 35 = ~219.91
  const r = 35;
  const strokeWidth = 8;
  const circ = 2 * Math.PI * r;
  const mStroke = totalCount > 0 ? (genderSummary.malePercent / 100) * circ : 0;
  const fStroke = totalCount > 0 ? (genderSummary.femalePercent / 100) * circ : 1; // 1 for visual when empty

  return (
    <div className="space-y-6 font-sans text-slate-800 animate-fade-in p-1">
      
      {/* 1. Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-150 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-700 flex items-center justify-center shrink-0">
              <PieChart className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">
                Penatausahaan: Demografi & Statistik Pegawai
              </h1>
              <p className="text-slate-550 text-xs mt-0.5 leading-relaxed">
                Visualisasi dinamika data kepangkatan, gender, dan keragaman beragama pegawai bersumber langsung dari modul Personalia.
              </p>
            </div>
          </div>
        </div>
        <div className="inline-flex items-center gap-1 bg-violet-50 border border-violet-100 text-violet-700 px-3.5 py-1.5 rounded-xl text-xs font-bold leading-none select-none shrink-0">
          <TrendingUp className="h-4 w-4" />
          <span>Real-time Sync Terhubung</span>
        </div>
      </div>

      {/* Check if no personalia data is present */}
      {totalCount === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center space-y-6 shadow-2xs">
          <div className="h-14 w-14 rounded-2xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-3xs">
            <Info className="h-7 w-7 animate-bounce" />
          </div>
          <div className="space-y-2 max-w-md mx-auto">
            <h3 className="text-sm font-black text-slate-900">Database Personalia Belum Memiliki Data</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Modul visualisasi rekapitulasi chart membutuhkan sekurang-kurangnya satu data pegawai aktif di halaman Personalia.
            </p>
          </div>
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl max-w-sm mx-auto flex items-start gap-2.5 text-left text-xs">
            <Sparkles className="h-4 w-4 text-violet-600 mt-0.5 shrink-0" />
            <p className="text-slate-600 leading-normal">
              Silakan navigasi kembali ke tab menu <strong>Personalia</strong> untuk menginput profil staf baru atau memuat simulasi data percontohan.
            </p>
          </div>
        </div>
      ) : (
        /* Dynamic Dashboard Grid */
        <div className="space-y-6">
          
          {/* Top Quick Stats Bento Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-white border border-slate-150 p-4 rounded-2xl flex items-center gap-3 shadow-3xs">
              <div className="h-9 w-9 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center text-violet-600 shrink-0">
                <Users className="h-4.5 w-4.5" />
              </div>
              <div>
                <p className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Total Responden</p>
                <p className="text-base font-black text-slate-900">{totalCount} <span className="text-xs text-slate-400 font-medium">Pegawai</span></p>
              </div>
            </div>

            <div className="bg-white border border-slate-150 p-4 rounded-2xl flex items-center gap-3 shadow-3xs">
              <div className="h-9 w-9 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 shrink-0">
                <Award className="h-4.5 w-4.5" />
              </div>
              <div>
                <p className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Golongan III & IV</p>
                <p className="text-base font-black text-slate-900">
                  {pangkatSummary.groups.filter(g => g.id === 'IV' || g.id === 'III').reduce((acc, current) => acc + current.count, 0)} <span className="text-xs text-slate-400 font-medium">Jiwa</span>
                </p>
              </div>
            </div>

            <div className="bg-white border border-slate-150 p-4 rounded-2xl flex items-center gap-3 shadow-3xs">
              <div className="h-9 w-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                <Layers className="h-4.5 w-4.5" />
              </div>
              <div>
                <p className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Persentase PPPK</p>
                <p className="text-base font-black text-slate-900">
                  {Math.round(((pangkatSummary.groups.find(g => g.id === 'PPPK')?.count || 2) / (totalCount || 1)) * 100)}%
                </p>
              </div>
            </div>

            <div className="bg-white border border-slate-150 p-4 rounded-2xl flex items-center gap-3 shadow-3xs">
              <div className="h-9 w-9 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                <Heart className="h-4.5 w-4.5" />
              </div>
              <div>
                <p className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Agama Terbanyak</p>
                <p className="text-base font-black text-slate-900 truncate max-w-[120px]" title={religionSummary[0]?.name}>
                  {religionSummary[0]?.name || '-'}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* COLUMN 1 & 2: Pangkatan and Broad Group Statistics */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Box 1: Pangkat Broad Categories */}
              <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4.5 w-4.5 text-violet-600" />
                    <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm">Bagan Distribusi Tingkat, Pangkat & Golongan</h3>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-lg uppercase tracking-wider">Persentase (%)</span>
                </div>

                <div className="space-y-4 pt-1">
                  {pangkatSummary.groups.map((group) => {
                    const widthPercent = Math.max(2, Math.round((group.count / totalCount) * 100));
                    return (
                      <div key={group.id} className="space-y-1.5 group">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-705">
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex px-1.5 py-0.5 rounded text-[9px] font-black tracking-tighter ${group.text} ${group.bg}`}>
                              {group.id}
                            </span>
                            <span className="text-slate-800 text-[11px] font-extrabold">{group.label}</span>
                          </div>
                          <div className="flex items-center gap-1 text-slate-905">
                            <span className="text-xs font-black">{group.count}</span>
                            <span className="text-slate-400 text-[10px] font-semibold">({widthPercent}%)</span>
                          </div>
                        </div>
                        {/* Progressive Fill Bar */}
                        <div className="h-2 rounded-full bg-slate-100 overflow-hidden relative">
                          <div
                            style={{ width: `${widthPercent}%` }}
                            className={`h-full ${group.color} transition-all duration-700 ease-out`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Box 2: Detail breakdowns (PNS Detailed lists) */}
              <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Award className="h-4.5 w-4.5 text-teal-600" />
                  <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm">Rincian Detail Golongan Ruang Internal</h3>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                  {Object.keys(pangkatSummary.details).length === 0 ? (
                    <div className="col-span-full py-6 text-center text-slate-400 text-xs">
                      Tidak ada rincian golongan khusus.
                    </div>
                  ) : (
                    Object.keys(pangkatSummary.details).map((key) => {
                      const value = pangkatSummary.details[key];
                      const pct = Math.round((value / totalCount) * 100);
                      
                      let accentClass = "border-slate-100 text-slate-705 bg-slate-50/50";
                      if (key === 'Honor') accentClass = "border-blue-100 text-blue-750 bg-blue-50/30";
                      else if (key === 'PPPK') accentClass = "border-emerald-100 text-emerald-750 bg-emerald-50/30";
                      else if (key.startsWith('IV/')) accentClass = "border-teal-100 text-teal-750 bg-teal-50/30";
                      else if (key.startsWith('III/')) accentClass = "border-sky-100 text-sky-750 bg-sky-50/30";
                      else if (key.startsWith('II/')) accentClass = "border-violet-100 text-violet-750 bg-violet-50/30";

                      return (
                        <div key={key} className={`border p-3.5 rounded-2xl text-center space-y-1 shadow-3xs ${accentClass}`}>
                          <p className="font-black text-sm tracking-tight">{key}</p>
                          <p className="text-[10px] text-slate-400 font-medium">Terdaftar</p>
                          <div className="pt-1.5 flex items-baseline justify-center gap-1.5">
                            <span className="text-base font-black leading-none">{value}</span>
                            <span className="text-[10px] font-bold text-slate-400">({pct}%)</span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

            </div>

            {/* COLUMN 3: Gender proportions & Religion Diversity */}
            <div className="space-y-6">
              
              {/* Box 3: Gender proportions with Circular Ring */}
              <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <PieChart className="h-4.5 w-4.5 text-sky-600" />
                    <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm">Proporsi Jenis Kelamin</h3>
                  </div>
                </div>

                {/* SVG Doughnut ring chart */}
                <div className="flex flex-col items-center py-3.5 space-y-4">
                  <div className="relative h-28 w-28 flex items-center justify-center">
                    <svg className="h-full w-full -rotate-90" viewBox="0 0 80 80">
                      {/* Empty state or Female track */}
                      <circle
                        cx="40"
                        cy="40"
                        r={r}
                        fill="transparent"
                        stroke="#f43f5e" /* rose-500 */
                        strokeWidth={strokeWidth}
                        className="transition-all duration-500"
                      />
                      {/* Male portion */}
                      {totalCount > 0 && (
                        <circle
                          cx="40"
                          cy="40"
                          r={r}
                          fill="transparent"
                          stroke="#0284c7" /* sky-600 */
                          strokeWidth={strokeWidth}
                          strokeDasharray={`${mStroke} ${circ}`}
                          className="transition-all duration-500"
                        />
                      )}
                    </svg>

                    {/* Center stats summary text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center space-y-0.5 pointer-events-none select-none">
                      <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Rasio Pria</span>
                      <p className="text-lg font-black text-slate-800 leading-none">{genderSummary.malePercent}%</p>
                    </div>
                  </div>

                  {/* Interactive Legends Map */}
                  <div className="w-full grid grid-cols-2 gap-3 pt-2 text-xs">
                    {/* Male legend */}
                    <div className="bg-sky-50/50 border border-sky-100 p-2.5 rounded-2xl flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-sky-600 shrink-0" />
                      <div>
                        <p className="text-[10px] font-bold text-slate-450 leading-none">Laki-laki</p>
                        <p className="font-extrabold text-slate-800 mt-1 leading-none">{genderSummary.male} <span className="text-[9px] font-bold text-slate-450">Staf</span></p>
                        <p className="text-[9px] font-black text-sky-700 mt-1">({genderSummary.malePercent}%)</p>
                      </div>
                    </div>

                    {/* Female legend */}
                    <div className="bg-rose-50/50 border border-rose-100 p-2.5 rounded-2xl flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-rose-500 shrink-0" />
                      <div>
                        <p className="text-[10px] font-bold text-slate-450 leading-none">Perempuan</p>
                        <p className="font-extrabold text-slate-800 mt-1 leading-none">{genderSummary.female} <span className="text-[9px] font-bold text-slate-450">Staf</span></p>
                        <p className="text-[9px] font-black text-rose-700 mt-1">({genderSummary.femalePercent}%)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Box 4: Religions Share */}
              <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4.5 w-4.5 text-emerald-600" />
                    <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm">Keragaman Keyakinan & Agama</h3>
                  </div>
                </div>

                <div className="space-y-3 pt-1">
                  {religionSummary.map((item) => {
                    const barWidth = Math.max(3, item.percent);
                    return (
                      <div key={item.name} className="space-y-1">
                        <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                          <span className="truncate max-w-[150px]">{item.name}</span>
                          <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-black ${item.badgeColor}`}>
                            {item.count} <span className="text-[9px] font-medium ml-1">({item.percent}%)</span>
                          </span>
                        </div>
                        {/* Progress meter */}
                        <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            style={{ width: `${barWidth}%` }}
                            className={`h-full ${item.color} transition-all duration-750 ease-out`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>

          {/* Footer Guide block */}
          <div className="bg-slate-50 border border-slate-150 rounded-2xl p-4.5 flex gap-3 text-xs leading-normal">
            <Info className="h-4.5 w-4.5 text-violet-600 shrink-0 mt-0.5" />
            <div className="text-slate-600 space-y-1">
              <p className="font-extrabold text-slate-800">Bagaimana statistik ini diperbarui?</p>
              <p className="text-[11px] text-slate-500">
                Sistem Penatausahaan ini secara dinamis dan real-time membaca array data kepegawaian yang tersimpan di dalam memori penyimpanan browser lokal. Setiap kali Anda menambahkan, menyunting, atau menghapus personalia di tab menu Kepegawaian, seluruh grafik bar dan persentase di halaman rekap ini akan langsung mengalami penyesuaian otomatis.
              </p>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
