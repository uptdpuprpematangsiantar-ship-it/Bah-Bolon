/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { InstansiProfile, UserAccount, PenatausahaanItem, OperasionalItem, PembangunanItem, AdmUmumItem, PersonaliaItem, AsetInventarisItem, KeuanganItem, DaerahIrigasi, BangunanIrigasi } from './types';

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
export const defaultPersonalia: PersonaliaItem[] = [
  {
    id: 'st-sample-1',
    nama: 'Ir. Muhammad Sofyan, M.T.',
    nip: '197408222002121004',
    pangkatGolongan: 'IV/b',
    jabatan: 'Kepala UPTD PUPR Pematangsiantar',
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
  },
  {
    id: 'st-sample-6',
    nama: 'Budi Darmawan, A.Md.',
    nip: '198805032015041001',
    pangkatGolongan: 'II/c',
    jabatan: 'Juru Gambar & Operator GIS',
    tempatLahir: 'Medan',
    tanggalLahir: '1988-05-03',
    jenisKelamin: 'Laki-laki',
    agama: 'Kristen Protestan',
    statusPerkawinan: 'Kawin'
  },
  {
    id: 'st-sample-7',
    nama: 'Christina Wijaya, S.E.',
    nip: '199011112018022003',
    pangkatGolongan: 'PPPK',
    jabatan: 'Bendahara Pengeluaran Pembantu',
    tempatLahir: 'Pematangsiantar',
    tanggalLahir: '1990-11-11',
    jenisKelamin: 'Perempuan',
    agama: 'Katolik',
    statusPerkawinan: 'Kawin'
  }
];
export const defaultAsetInventaris: AsetInventarisItem[] = [];
export const defaultKeuangan: KeuanganItem[] = [];

export const defaultDaerahIrigasi: DaerahIrigasi[] = [
  {
    id: 'di-1',
    namaDI: 'DI Bah Bolon',
    lokasi: 'Siantar Marimbun, Kota Pematangsiantar',
    luasAreal: 2750,
    sumberAir: 'Sungai Bah Bolon',
    kondisi: 'Baik',
    bangunanPendukung: [
      {
        id: 'bg-1-1',
        namaBangunan: 'Bendung Utama Bah Bolon',
        kategori: 'Bendung',
        kondisi: 'Baik',
        keterangan: 'Mercu bendung kokoh, debit air lancar, tidak ada retakan struktural.',
        koordinat: '2.9463, 99.0438',
        foto: ''
      },
      {
        id: 'bg-1-2',
        namaBangunan: 'Pintu Intake Utama',
        kategori: 'Pintu Air',
        kondisi: 'Baik',
        keterangan: 'Pintu besi manual dan dinamo elektrik pelumas gasing bekerja 100% lancar.',
        koordinat: '2.9465, 99.0441',
        foto: ''
      },
      {
        id: 'bg-1-3',
        namaBangunan: 'Saluran Primer Marimbun',
        kategori: 'Saluran Pembawa',
        kondisi: 'Baik',
        keterangan: 'Dinding penahan beton precast bebas sedimentasi parah, aliran lancar.',
        koordinat: '2.9472, 99.0451',
        foto: ''
      }
    ]
  },
  {
    id: 'di-2',
    namaDI: 'DI Simarimbun',
    lokasi: 'Siantar Selatan, Kota Pematangsiantar',
    luasAreal: 450,
    sumberAir: 'Mata Air Simarimbun',
    kondisi: 'Rusak Ringan',
    bangunanPendukung: [
      {
        id: 'bg-2-1',
        namaBangunan: 'Sipon Simarimbun',
        kategori: 'Bangunan Pelengkap',
        kondisi: 'Rusak Ringan',
        keterangan: 'Terjadi rembesan air pada sambungan pipa baja bawah selokan.',
        koordinat: '2.9321, 99.0315',
        foto: ''
      },
      {
        id: 'bg-2-2',
        namaBangunan: 'Pintu Sadap Tersier Simarimbun',
        kategori: 'Bangunan Sadap',
        kondisi: 'Baik',
        keterangan: 'Pintu sadap tersier aman, air mengairi sawah masyarakat.',
        koordinat: '2.9335, 99.0328',
        foto: ''
      }
    ]
  }
];

