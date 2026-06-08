/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { InstansiProfile, UserAccount, PenatausahaanItem, OperasionalItem, PembangunanItem, AdmUmumItem, PersonaliaItem, AsetInventarisItem, KeuanganItem } from './types';

export const defaultProfile: InstansiProfile = {
  name: 'UPTD PUPR Pematangsiantar',
  address: 'Jl. Lapangan Bola No. 12, Pematangsiantar, Sumatera Utara, 21111',
  email: 'uptdpuprpematangsiantar@gmail.com',
  phone: '(0622) 21453',
  headOfficer: 'Ir. Muhammad Sofyan, M.T.',
  nip: '19740822 200212 1 004',
  logoUrl: '', // Will render an elegant SVG fallback if empty, can be customized with upload
  footerText: 'Sistem Informasi Administrasi Terpadu UPTD Pekerjaan Umum dan Penataan Ruang Pematangsiantar',
  copyrightText: '© 2026 UPTD PUPR Pematangsiantar. All Rights Reserved.'
};

export const defaultUsers: UserAccount[] = [
  {
    id: '1',
    username: 'admin',
    fullName: 'Administrator UPTD',
    role: 'admin',
    department: 'Bagian Tata Usaha',
    isActive: true
  },
  {
    id: '2',
    username: 'user',
    fullName: 'Rian Hidayat, S.T.',
    role: 'user',
    department: 'Seksi Operasional & Pemeliharaan',
    isActive: true
  },
  {
    id: '3',
    username: 'pembangunan',
    fullName: 'Siti Rahma, M.Eng',
    role: 'user',
    department: 'Seksi Pembangunan & Rehabilitasi',
    isActive: true
  }
];

export const defaultPenatausahaan: PenatausahaanItem[] = [];
export const defaultOperasional: OperasionalItem[] = [];
export const defaultPembangunan: PembangunanItem[] = [];
export const defaultAdmUmum: AdmUmumItem[] = [];
export const defaultPersonalia: PersonaliaItem[] = [];
export const defaultAsetInventaris: AsetInventarisItem[] = [];
export const defaultKeuangan: KeuanganItem[] = [];
