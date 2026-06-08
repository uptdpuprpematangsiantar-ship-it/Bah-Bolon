/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'admin' | 'user';

export interface UserAccount {
  id: string;
  username: string;
  fullName: string;
  role: UserRole;
  department: string;
  isActive: boolean;
}

export interface InstansiProfile {
  name: string;
  address: string;
  email: string;
  phone: string;
  headOfficer: string;
  nip: string;
  logoUrl: string;
  footerText: string;
  copyrightText: string;
}

export interface PenatausahaanItem {
  id: string;
  nomorSurat: string;
  tanggal: string;
  perihal: string;
  asalTujuan: string;
  jenis: 'Masuk' | 'Keluar' | 'Internal';
  status: 'Proses' | 'Selesai' | 'Arsip';
  keterangan: string;
}

export interface OperasionalItem {
  id: string;
  namaLokasi: string;
  kondisiPintu: 'Sempurna' | 'Butuh Perbaikan' | 'Rusak';
  debitAir: number; // m3/detik
  statusKeamanan: 'Aman' | 'Waspada' | 'Siaga' | 'Banjir';
  petugasJaga: string;
  tanggalCheck: string;
}

export interface PembangunanItem {
  id: string;
  namaProyek: string;
  lokasi: string;
  kontraktor: string;
  anggaran: number;
  realisasi: number;
  progress: number; // 0 sampai 100
  tanggalMulai: string;
  status: 'Perencanaan' | 'Konstruksi' | 'Selesai' | 'Ditunda';
}

export interface AdmUmumItem {
  id: string;
  namaDokumen: string;
  nomorSurat: string;
  tanggalArsip: string;
  klasifikasi: 'SK Pimpinan' | 'Surat Edaran' | 'SPO' | 'Nota Dinas' | 'Lain-lain';
  status: 'Aktif' | 'Non-Aktif';
  lokasiFisik: string;
  keterangan: string;
  jenisSurat?: 'Surat Masuk' | 'Surat Keluar' | 'Dokumen Umum';
  asalSurat?: string; // Khusus Surat Masuk
  tujuanSurat?: string; // Khusus Surat Keluar
  nomorSuratDiterima?: string; // Nomor Surat Asli yang diterima
  tanggalSuratDiterima?: string; // Tanggal Surat Asli yang diterima
  pdfUrl?: string; // Base64 PDF data or local blob
  pdfName?: string; // Name of uploaded PDF file
}

export interface PersonaliaItem {
  id: string;
  nama: string;                // nama lengkap dan gelar akademik
  nip: string;                 // nip
  pangkatGolongan: string;     // pangkat dan golongan ruang (Honor, PPPK, I/a s.d IV/e)
  jabatan: string;             // Jabatan
  tempatLahir: string;         // Tempat lahir
  tanggalLahir: string;        // tanggal lahir (terbaca otomatis dari NIP)
  jenisKelamin: string;        // jenis kelamin
  agama: string;               // agama
  statusPerkawinan: string;    // status perkawinan
}

export interface AsetInventarisItem {
  id: string;
  kodeAset: string;
  namaAset: string;
  kategori: 'Peralatan Kantor' | 'Kendaraan Dinas' | 'Mesin Pompa / Alat Berat' | 'Aset Sipil (Bangunan)';
  jumlah: number;
  kondisi: 'Baik' | 'Rusak Ringan' | 'Rusak Berat';
  tanggalPerolehan: string;
  nilaiAset: number;
}

export interface KeuanganItem {
  id: string;
  kodeAnggaran: string;
  kategori: 'Belanja Pegawai' | 'Belanja Operasional' | 'Belanja Pemeliharaan' | 'Belanja Modal';
  deskripsi: string;
  pagu: number;
  realisasi: number;
  statusAnggaran: 'Sesuai Target' | 'Mendekati Limit' | 'Over-budget';
}

