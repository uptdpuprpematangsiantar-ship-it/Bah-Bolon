/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  Filter, 
  AlertTriangle, 
  Printer, 
  ArrowRightLeft, 
  User, 
  FileText, 
  Layers, 
  Calendar, 
  Check, 
  RotateCcw, 
  Info, 
  X,
  PlusCircle,
  TrendingUp,
  MapPin,
  ClipboardList
} from 'lucide-react';
import { AsetInventarisItem, DistribusiAset, PersonaliaItem } from '../types';

interface AsetInventarisProps {
  items: AsetInventarisItem[];
  onAddItem: (item: AsetInventarisItem) => void;
  onUpdateItem: (item: AsetInventarisItem) => void;
  onDeleteItem: (id: string) => void;
  personaliaItems?: PersonaliaItem[];
}

export default function AsetInventaris({
  items,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  personaliaItems = []
}: AsetInventarisProps) {
  // Tabs Navigation
  // 'inventaris' = Inventaris Aset
  // 'distribusi' = Distribusi Aset
  const [activeTab, setActiveTab] = useState<'inventaris' | 'distribusi'>('inventaris');

  // Load local profile for print titles
  const profileName = useMemo(() => {
    try {
      const saved = localStorage.getItem('siat_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.name) return parsed.name;
      }
    } catch (e) {}
    return 'UPTD PUPR Pematangsiantar';
  }, []);

  // --- LOCAL PERSISTENCE FOR DISTRIBUSI ASET ---
  const [distribusiList, setDistribusiList] = useState<DistribusiAset[]>(() => {
    const saved = localStorage.getItem('siat_distribusi_aset');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    // Default initial distribution records
    return [
      {
        id: 'dist-1',
        idAset: 'ast-sample-1',
        namaAset: 'Excavator Kobelco SK200',
        penerima: 'Rian Hidayat, S.T.',
        seksiBagian: 'Seksi Operasional & Pemeliharaan',
        jumlah: 1,
        tanggalDistribusi: '2026-05-10',
        statusDistribusi: 'Digunakan',
        keterangan: 'Pekerjaan pengerukan sedimen DI Bah Bolon kanan'
      },
      {
        id: 'dist-2',
        idAset: 'ast-sample-3',
        namaAset: 'Genset Portabel Honda 5 KVA',
        penerima: 'Heri Setiawan',
        seksiBagian: 'Operator Bendung',
        jumlah: 1,
        tanggalDistribusi: '2026-05-28',
        statusDistribusi: 'Dipinjam',
        keterangan: 'Operasional cadangan listrik pintu intake jika mati listrik'
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('siat_distribusi_aset', JSON.stringify(distribusiList));
  }, [distribusiList]);

  // Seeding simulation assets if empty
  const handleSeedDummyAssets = () => {
    const dummyAssets: AsetInventarisItem[] = [
      {
        id: 'ast-sample-kib-a-1',
        kodeAset: 'KIB-A.01.0001',
        namaAset: 'Tanah Lahan Bendung DI Bah Bolon',
        kategori: 'KIB A: Tanah',
        jumlah: 1,
        kondisi: 'Baik',
        tanggalPerolehan: '2015-05-10',
        nilaiAset: 1850000000
      },
      {
        id: 'ast-sample-kib-a-2',
        kodeAset: 'KIB-A.01.0002',
        namaAset: 'Tanah Lahan Bangunan Kantor Jaga',
        kategori: 'KIB A: Tanah',
        jumlah: 1,
        kondisi: 'Baik',
        tanggalPerolehan: '2018-08-22',
        nilaiAset: 320000000
      },
      {
        id: 'ast-sample-kib-b-1',
        kodeAset: 'KIB-B.01.0001',
        namaAset: 'Excavator Kobelco SK200-10',
        kategori: 'KIB B: Peralatan & Mesin',
        jumlah: 2,
        kondisi: 'Baik',
        tanggalPerolehan: '2023-04-12',
        nilaiAset: 1450000000
      },
      {
        id: 'ast-sample-kib-b-2',
        kodeAset: 'KIB-B.02.0012',
        namaAset: 'Mobil Operasional Toyota Hilux D-Cab',
        kategori: 'KIB B: Peralatan & Mesin',
        jumlah: 1,
        kondisi: 'Baik',
        tanggalPerolehan: '2024-08-15',
        nilaiAset: 485000000
      },
      {
        id: 'ast-sample-kib-b-3',
        kodeAset: 'KIB-B.01.0005',
        namaAset: 'Genset Portabel Honda 5 KVA',
        kategori: 'KIB B: Peralatan & Mesin',
        jumlah: 3,
        kondisi: 'Baik',
        tanggalPerolehan: '2022-11-20',
        nilaiAset: 24000000
      },
      {
        id: 'ast-sample-kib-b-4',
        kodeAset: 'KIB-B.03.0045',
        namaAset: 'Komputer Server TU & GIS Intel i9',
        kategori: 'KIB B: Peralatan & Mesin',
        jumlah: 1,
        kondisi: 'Rusak Ringan',
        tanggalPerolehan: '2021-06-05',
        nilaiAset: 18500000
      },
      {
        id: 'ast-sample-kib-c-1',
        kodeAset: 'KIB-C.10.0001',
        namaAset: 'Gedung Kantor Jaga Air Bah Bolon Utama',
        kategori: 'KIB C: Gedung & Bangunan',
        jumlah: 1,
        kondisi: 'Baik',
        tanggalPerolehan: '2019-10-10',
        nilaiAset: 450000000
      },
      {
        id: 'ast-sample-kib-c-2',
        kodeAset: 'KIB-C.10.0002',
        namaAset: 'Rumah Dinas Penjaga Pintu Bendung',
        kategori: 'KIB C: Gedung & Bangunan',
        jumlah: 2,
        kondisi: 'Rusak Ringan',
        tanggalPerolehan: '2016-03-14',
        nilaiAset: 185000000
      },
      {
        id: 'ast-sample-kib-d-1',
        kodeAset: 'KIB-D.20.0051',
        namaAset: 'Jaringan Irigasi Saluran Sekunder Bah Bolon',
        kategori: 'KIB D: Jalan, Irigasi & Jaringan',
        jumlah: 1,
        kondisi: 'Baik',
        tanggalPerolehan: '2020-07-21',
        nilaiAset: 2570000000
      },
      {
        id: 'ast-sample-kib-d-2',
        kodeAset: 'KIB-D.20.0052',
        namaAset: 'Pintu Air Intake Utama (Besi Cor)',
        kategori: 'KIB D: Jalan, Irigasi & Jaringan',
        jumlah: 4,
        kondisi: 'Baik',
        tanggalPerolehan: '2021-11-18',
        nilaiAset: 85000000
      },
      {
        id: 'ast-sample-kib-e-1',
        kodeAset: 'KIB-E.30.0001',
        namaAset: 'Buku Rencana Umum Tata Ruang Wilayah',
        kategori: 'KIB E: Aset Tetap Lainnya',
        jumlah: 1,
        kondisi: 'Baik',
        tanggalPerolehan: '2022-02-10',
        nilaiAset: 65000000
      },
      {
        id: 'ast-sample-kib-f-1',
        kodeAset: 'KIB-F.40.0001',
        namaAset: 'Rehabilitasi Pintu Air Penguras DI Bah Bolon',
        kategori: 'KIB F: Konstruksi dalam Pengerjaan',
        jumlah: 1,
        kondisi: 'Baik',
        tanggalPerolehan: '2026-03-01',
        nilaiAset: 980000000
      }
    ];

    dummyAssets.forEach(ast => {
      onAddItem(ast);
    });
  };

  // --- 1. INVENTARIS ASET: SEARCH, FILTER, AND STATS ---
  const [invSearch, setInvSearch] = useState('');
  const [invKategori, setInvKategori] = useState('ALL');
  const [invKondisi, setInvKondisi] = useState('ALL');

  const kibCategories = useMemo(() => {
    return [
      { key: 'ALL', label: 'Semua KIB', count: items.length },
      { key: 'KIB A: Tanah', label: 'KIB A: Tanah', count: items.filter(i => i.kategori === 'KIB A: Tanah').length },
      { key: 'KIB B: Peralatan & Mesin', label: 'KIB B: Peralatan & Mesin', count: items.filter(i => i.kategori === 'KIB B: Peralatan & Mesin').length },
      { key: 'KIB C: Gedung & Bangunan', label: 'KIB C: Gedung & Bangunan', count: items.filter(i => i.kategori === 'KIB C: Gedung & Bangunan').length },
      { key: 'KIB D: Jalan, Irigasi & Jaringan', label: 'KIB D: Jalan, Irigasi & Jaringan', count: items.filter(i => i.kategori === 'KIB D: Jalan, Irigasi & Jaringan').length },
      { key: 'KIB E: Aset Tetap Lainnya', label: 'KIB E: Aset Tetap Lainnya', count: items.filter(i => i.kategori === 'KIB E: Aset Tetap Lainnya').length },
      { key: 'KIB F: Konstruksi dalam Pengerjaan', label: 'KIB F: Konstruksi dalam Pengerjaan', count: items.filter(i => i.kategori === 'KIB F: Konstruksi dalam Pengerjaan').length }
    ];
  }, [items]);

  const filteredAssets = useMemo(() => {
    return items.filter(ast => {
      const matchSearch = 
        ast.namaAset.toLowerCase().includes(invSearch.toLowerCase()) ||
        ast.kodeAset.toLowerCase().includes(invSearch.toLowerCase());
      
      const matchKategori = invKategori === 'ALL' || ast.kategori === invKategori;
      const matchKondisi = invKondisi === 'ALL' || ast.kondisi === invKondisi;

      return matchSearch && matchKategori && matchKondisi;
    });
  }, [items, invSearch, invKategori, invKondisi]);

  const assetStats = useMemo(() => {
    const totalUnique = items.length;
    const totalUnit = items.reduce((sum, item) => sum + Number(item.jumlah || 0), 0);
    const totalVal = items.reduce((sum, item) => sum + (Number(item.nilaiAset || 0) * Number(item.jumlah || 1)), 0);
    
    let baik = 0;
    let rusakRingan = 0;
    let rusakBerat = 0;

    items.forEach(ast => {
      if (ast.kondisi === 'Baik') baik += Number(ast.jumlah || 0);
      else if (ast.kondisi === 'Rusak Ringan') rusakRingan += Number(ast.jumlah || 0);
      else if (ast.kondisi === 'Rusak Berat') rusakBerat += Number(ast.jumlah || 0);
    });

    return { totalUnique, totalUnit, totalVal, baik, rusakRingan, rusakBerat };
  }, [items]);

  // --- 2. DISTRIBUSI ASET: SEARCH, FILTER, AND STATS ---
  const [distSearch, setDistSearch] = useState('');
  const [distStatus, setDistStatus] = useState('ALL');

  const filteredDistribusi = useMemo(() => {
    return distribusiList.filter(dist => {
      const matchSearch = 
        dist.namaAset.toLowerCase().includes(distSearch.toLowerCase()) ||
        dist.penerima.toLowerCase().includes(distSearch.toLowerCase()) ||
        dist.seksiBagian.toLowerCase().includes(distSearch.toLowerCase());
      
      const matchStatus = distStatus === 'ALL' || dist.statusDistribusi === distStatus;

      return matchSearch && matchStatus;
    });
  }, [distribusiList, distSearch, distStatus]);

  const distStats = useMemo(() => {
    const totalDistUnit = distribusiList.reduce((sum, i) => sum + Number(i.jumlah || 0), 0);
    const dipinjam = distribusiList.filter(i => i.statusDistribusi === 'Dipinjam').reduce((sum, i) => sum + Number(i.jumlah || 0), 0);
    const digunakan = distribusiList.filter(i => i.statusDistribusi === 'Digunakan').reduce((sum, i) => sum + Number(i.jumlah || 0), 0);
    const dikembalikan = distribusiList.filter(i => i.statusDistribusi === 'Dikembalikan').reduce((sum, i) => sum + Number(i.jumlah || 0), 0);
    const rusakHilang = distribusiList.filter(i => i.statusDistribusi === 'Rusak/Hilang').reduce((sum, i) => sum + Number(i.jumlah || 0), 0);

    return { totalDistUnit, dipinjam, digunakan, dikembalikan, rusakHilang };
  }, [distribusiList]);


  // --- MODALS / FORMS STATES ---
  const [showAssetModal, setShowAssetModal] = useState(false);
  const [editingAsset, setEditingAsset] = useState<AsetInventarisItem | null>(null);

  const [assetForm, setAssetForm] = useState({
    kodeAset: '',
    namaAset: '',
    kategori: 'KIB B: Peralatan & Mesin' as AsetInventarisItem['kategori'],
    jumlah: 1,
    kondisi: 'Baik' as AsetInventarisItem['kondisi'],
    tanggalPerolehan: new Date().toISOString().split('T')[0],
    nilaiAset: 0
  });

  const openAddAsset = () => {
    setEditingAsset(null);
    setAssetForm({
      kodeAset: 'KIB-B.03.' + String(items.length + 1).padStart(3, '0'),
      namaAset: '',
      kategori: 'KIB B: Peralatan & Mesin',
      jumlah: 1,
      kondisi: 'Baik',
      tanggalPerolehan: new Date().toISOString().split('T')[0],
      nilaiAset: 0
    });
    setShowAssetModal(true);
  };

  const openEditAsset = (ast: AsetInventarisItem) => {
    setEditingAsset(ast);
    setAssetForm({
      kodeAset: ast.kodeAset,
      namaAset: ast.namaAset,
      kategori: ast.kategori,
      jumlah: ast.jumlah,
      kondisi: ast.kondisi,
      tanggalPerolehan: ast.tanggalPerolehan,
      nilaiAset: ast.nilaiAset
    });
    setShowAssetModal(true);
  };

  const saveAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assetForm.namaAset.trim() || !assetForm.kodeAset.trim()) return;

    if (editingAsset) {
      onUpdateItem({
        ...editingAsset,
        kodeAset: assetForm.kodeAset,
        namaAset: assetForm.namaAset,
        kategori: assetForm.kategori,
        jumlah: Number(assetForm.jumlah),
        kondisi: assetForm.kondisi,
        tanggalPerolehan: assetForm.tanggalPerolehan,
        nilaiAset: Number(assetForm.nilaiAset)
      });
    } else {
      onAddItem({
        id: 'ast-' + Date.now(),
        kodeAset: assetForm.kodeAset,
        namaAset: assetForm.namaAset,
        kategori: assetForm.kategori,
        jumlah: Number(assetForm.jumlah),
        kondisi: assetForm.kondisi,
        tanggalPerolehan: assetForm.tanggalPerolehan,
        nilaiAset: Number(assetForm.nilaiAset)
      });
    }
    setShowAssetModal(false);
  };

  // --- DISTRIBUSI MODAL / FORM ---
  const [showDistModal, setShowDistModal] = useState(false);
  const [editingDist, setEditingDist] = useState<DistribusiAset | null>(null);

  const [distForm, setDistForm] = useState({
    idAset: '',
    penerima: '',
    seksiBagian: '',
    jumlah: 1,
    tanggalDistribusi: new Date().toISOString().split('T')[0],
    statusDistribusi: 'Digunakan' as DistribusiAset['statusDistribusi'],
    keterangan: ''
  });

  const openAddDist = () => {
    setEditingDist(null);
    setDistForm({
      idAset: items[0]?.id || '',
      penerima: personaliaItems[0]?.nama || '',
      seksiBagian: personaliaItems[0] ? (personaliaItems[0].jabatan || 'Seksi Administrasi') : '',
      jumlah: 1,
      tanggalDistribusi: new Date().toISOString().split('T')[0],
      statusDistribusi: 'Digunakan',
      keterangan: ''
    });
    setShowDistModal(true);
  };

  const openEditDist = (dist: DistribusiAset) => {
    setEditingDist(dist);
    setDistForm({
      idAset: dist.idAset,
      penerima: dist.penerima,
      seksiBagian: dist.seksiBagian,
      jumlah: dist.jumlah,
      tanggalDistribusi: dist.tanggalDistribusi,
      statusDistribusi: dist.statusDistribusi,
      keterangan: dist.keterangan
    });
    setShowDistModal(true);
  };

  const handlePenerimaChange = (name: string) => {
    const p = personaliaItems.find(item => item.nama === name);
    setDistForm(prev => ({
      ...prev,
      penerima: name,
      seksiBagian: p ? (p.jabatan || 'Administrasi / Staf') : prev.seksiBagian
    }));
  };

  const saveDist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!distForm.idAset || !distForm.penerima.trim()) return;

    const selectedAsset = items.find(a => a.id === distForm.idAset);
    const labelAset = selectedAsset ? selectedAsset.namaAset : 'Aset Tak Dikenali';

    if (editingDist) {
      setDistribusiList(
        distribusiList.map(item => 
          item.id === editingDist.id 
            ? {
                ...item,
                idAset: distForm.idAset,
                namaAset: labelAset,
                penerima: distForm.penerima,
                seksiBagian: distForm.seksiBagian,
                jumlah: Number(distForm.jumlah),
                tanggalDistribusi: distForm.tanggalDistribusi,
                statusDistribusi: distForm.statusDistribusi,
                keterangan: distForm.keterangan
              }
            : item
        )
      );
    } else {
      setDistribusiList([
        {
          id: 'dist-' + Date.now(),
          idAset: distForm.idAset,
          namaAset: labelAset,
          penerima: distForm.penerima,
          seksiBagian: distForm.seksiBagian,
          jumlah: Number(distForm.jumlah),
          tanggalDistribusi: distForm.tanggalDistribusi,
          statusDistribusi: distForm.statusDistribusi,
          keterangan: distForm.keterangan
        },
        ...distribusiList
      ]);
    }
    setShowDistModal(false);
  };

  const handleDeleteDist = (id: string) => {
    if (confirm('Yakin ingin menghapus catatan distribusi aset ini?')) {
      setDistribusiList(distribusiList.filter(i => i.id !== id));
    }
  };

  const handleQuickReturn = (dist: DistribusiAset) => {
    setDistribusiList(
      distribusiList.map(item => 
        item.id === dist.id 
          ? { ...item, statusDistribusi: 'Dikembalikan' as const, keterangan: (item.keterangan ? item.keterangan + ' - ' : '') + 'Dikembalikan cepat via sistem' }
          : item
      )
    );
  };

  // --- REPORT PRINT FORMATS ---
  const handlePrintReport = () => {
    const printableItems = filteredAssets;
    const printContent = `
      <html>
        <head>
          <title>Buku Inventarisasi Barang Daerah - ${profileName}</title>
          <style>
            body { font-family: sans-serif; padding: 30px; font-size: 11px; color: #333; }
            h1 { text-align: center; text-transform: uppercase; font-size: 16px; margin-bottom: 5px; }
            h2 { text-align: center; font-size: 13px; font-weight: normal; margin-top: 0; margin-bottom: 25px; color: #555; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; }
            th, td { border: 1px solid #aaa; padding: 8px 10px; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; }
            .right { text-align: right; }
            .center { text-align: center; }
            .footer-sign { float: right; width: 250px; text-align: center; margin-top: 40px; }
            .clear { clear: both; }
          </style>
        </head>
        <body onload="window.print()">
          <h1>Buku Registrasi Inventaris Barang Milik Daerah</h1>
          <h2>${profileName}</h2>
          <p>Tanggal Cetak: ${new Date().toLocaleDateString('id-ID')}</p>
          <p>Total Item Aset Terdaftar: ${printableItems.length} objek</p>
          <table>
            <thead>
              <tr>
                <th style="width: 5%">No</th>
                <th style="width: 15%">Kode Aset</th>
                <th>Nama Barang / Aset</th>
                <th>Kategori</th>
                <th style="width: 8%" class="center">Jumlah</th>
                <th style="width: 10%" class="center">Kondisi</th>
                <th style="width: 12%">Tgl Perolehan</th>
                <th class="right">Nilai Satuan</th>
                <th class="right">Total Nilai</th>
              </tr>
            </thead>
            <tbody>
              ${printableItems.map((ast, idx) => `
                <tr>
                  <td class="center">${idx + 1}</td>
                  <td><b>${ast.kodeAset}</b></td>
                  <td>${ast.namaAset}</td>
                  <td>${ast.kategori}</td>
                  <td class="center">${ast.jumlah} unit</td>
                  <td class="center">${ast.kondisi}</td>
                  <td>${ast.tanggalPerolehan}</td>
                  <td class="right">Rp ${Number(ast.nilaiAset || 0).toLocaleString('id-ID')}</td>
                  <td class="right">Rp ${Number((ast.nilaiAset || 0) * (ast.jumlah || 1)).toLocaleString('id-ID')}</td>
                </tr>
              `).join('')}
              <tr style="font-weight: bold; background-color: #fafafa;">
                <td colspan="4" class="right">Grand Total:</td>
                <td class="center">${printableItems.reduce((acc, c) => acc + Number(c.jumlah || 0), 0)} unit</td>
                <td colspan="3"></td>
                <td class="right">Rp ${printableItems.reduce((acc, c) => acc + (Number(c.nilaiAset || 0) * Number(c.jumlah || 1)), 0).toLocaleString('id-ID')}</td>
              </tr>
            </tbody>
          </table>

          <div class="footer-sign">
            <p>Pematangsiantar, ${new Date().toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'})}</p>
            <p style="margin-bottom: 60px;">Petugas Pengurus Barang,</p>
            <p><b>___________________________</b></p>
            <p>NIP. / Kontrak Pendukung</p>
          </div>
          <div class="clear"></div>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
    }
  };

  const handlePrintDistribusi = () => {
    const printableDists = filteredDistribusi;
    const printContent = `
      <html>
        <head>
          <title>Laporan Distribusi & Peminjaman Aset - ${profileName}</title>
          <style>
            body { font-family: sans-serif; padding: 30px; font-size: 11px; color: #333; }
            h1 { text-align: center; text-transform: uppercase; font-size: 16px; margin-bottom: 5px; }
            h2 { text-align: center; font-size: 13px; font-weight: normal; margin-top: 0; margin-bottom: 25px; color: #555; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; }
            th, td { border: 1px solid #aaa; padding: 8px 10px; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; }
            .center { text-align: center; }
            .footer-sign { float: right; width: 250px; text-align: center; margin-top: 40px; }
            .clear { clear: both; }
          </style>
        </head>
        <body onload="window.print()">
          <h1>Buku Log Distribusi & Penggunaan Aset Dinas</h1>
          <h2>${profileName}</h2>
          <p>Tanggal Cetak: ${new Date().toLocaleDateString('id-ID')}</p>
          <p>Total Distribusi Terdaftar: ${printableDists.length} rekaman</p>
          <table>
            <thead>
              <tr>
                <th style="width: 5%">No</th>
                <th>Nama Barang / Aset</th>
                <th>Pegawai Penerima</th>
                <th>Seksi / Jabatan</th>
                <th style="width: 8%" class="center">Jumlah</th>
                <th style="width: 10%">Tgl Distribusi</th>
                <th style="width: 12%" class="center">Status</th>
                <th>Keterangan / Keperluan</th>
              </tr>
            </thead>
            <tbody>
              ${printableDists.map((d, idx) => `
                <tr>
                  <td class="center">${idx + 1}</td>
                  <td><b>${d.namaAset}</b></td>
                  <td>${d.penerima}</td>
                  <td>${d.seksiBagian}</td>
                  <td class="center">${d.jumlah} unit</td>
                  <td>${d.tanggalDistribusi}</td>
                  <td class="center"><b>${d.statusDistribusi}</b></td>
                  <td>${d.keterangan || '-'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="footer-sign">
            <p>Pematangsiantar, ${new Date().toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'})}</p>
            <p style="margin-bottom: 60px;">Kepala UPTD PUPR,</p>
            <p><b>___________________________</b></p>
            <p>NIP. / Pangkat Golongan</p>
          </div>
          <div class="clear"></div>
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
    <div className="space-y-6 font-sans text-slate-800 p-1">
      
      {/* 1. Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-150 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-700 flex items-center justify-center shrink-0">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">
                Aset & Inventaris BMD
              </h1>
              <p className="text-slate-550 text-xs mt-0.5 leading-relaxed">
                Manajemen data KIB (Kartu Inventaris Barang) dan pengisian log distribusi aset UPTD dinas secara komprehensif.
              </p>
            </div>
          </div>
        </div>

        {/* Action tabs to toggle */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl self-start md:self-auto shrink-0 border border-slate-200/50">
          <button
            onClick={() => setActiveTab('inventaris')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'inventaris' 
                ? 'bg-white text-indigo-700 shadow-3xs border border-slate-200/30' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Package className="h-3.5 w-3.5" />
            <span>Inventaris Aset</span>
          </button>
          
          <button
            onClick={() => setActiveTab('distribusi')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'distribusi' 
                ? 'bg-white text-indigo-700 shadow-3xs border border-slate-200/30' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <ArrowRightLeft className="h-3.5 w-3.5" />
            <span>Distribusi Aset</span>
          </button>
        </div>
      </div>

      {/* 2. TAB VIEW: INVENTARIS ASET */}
      {activeTab === 'inventaris' && (
        <div className="space-y-6">
          
          {/* Section Quick Stats row for Inventaris */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-white border border-slate-150 p-4 rounded-2xl flex items-center gap-3 shadow-3xs">
              <div className="h-9 w-9 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center text-violet-600 shrink-0">
                <Package className="h-4.5 w-4.5" />
              </div>
              <div>
                <p className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Total Jenis Aset</p>
                <p className="text-base font-black text-slate-900">{assetStats.totalUnique} <span className="text-xs text-slate-400 font-medium">Model</span></p>
              </div>
            </div>

            <div className="bg-white border border-slate-150 p-4 rounded-2xl flex items-center gap-3 shadow-3xs">
              <div className="h-9 w-9 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 shrink-0">
                <Layers className="h-4.5 w-4.5" />
              </div>
              <div>
                <p className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Total Kuantitas Fisik</p>
                <p className="text-base font-black text-slate-900">{assetStats.totalUnit} <span className="text-xs text-slate-400 font-medium font-sans">Unit</span></p>
              </div>
            </div>

            <div className="bg-white border border-slate-150 p-4 rounded-2xl flex items-center gap-3 shadow-3xs">
              <div className="h-9 w-9 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 shrink-0">
                <TrendingUp className="h-4.5 w-4.5" />
              </div>
              <div>
                <p className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Status Baik (Fisik)</p>
                <p className="text-base font-black text-slate-900">{assetStats.baik} <span className="text-xs text-slate-400 font-medium">Unit</span></p>
              </div>
            </div>

            <div className="bg-white border border-slate-150 p-4 rounded-2xl flex items-center gap-3 shadow-3xs col-span-2 lg:col-span-1">
              <div className="h-9 w-9 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                <AlertTriangle className="h-4.5 w-4.5" />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Total Nilai KIB</p>
                <p className="text-base font-black text-slate-900 truncate" title={`Rp ${assetStats.totalVal.toLocaleString('id-ID')}`}>
                  Rp {assetStats.totalVal >= 1000000000 
                    ? `${(assetStats.totalVal / 1000000000).toFixed(2)} M` 
                    : assetStats.totalVal.toLocaleString('id-ID')
                  }
                </p>
              </div>
            </div>
          </div>

          {/* KIB Quick Filter Pills */}
          <div className="space-y-2 bg-gradient-to-r from-slate-50 to-slate-100 p-4 border border-slate-200/70 rounded-2xl">
            <label className="text-[10px] uppercase font-black text-slate-500 tracking-wider flex items-center gap-1.5 select-none">
              <Filter className="h-3 w-3 text-indigo-500" />
              <span>Pilah Berdasarkan Kartu Inventaris Barang (KIB A s/d F)</span>
            </label>
            <div className="flex flex-wrap gap-2 items-center overflow-x-auto min-w-0 pb-1">
              {kibCategories.map((kib) => {
                const isActive = invKategori === kib.key;
                return (
                  <button
                    key={kib.key}
                    type="button"
                    onClick={() => setInvKategori(kib.key)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? 'bg-indigo-650 text-white shadow-3xs hover:bg-indigo-700'
                        : 'text-slate-650 hover:bg-white border border-slate-200 bg-white/70 hover:shadow-2xs'
                    }`}
                  >
                    <span>{kib.label}</span>
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                      isActive ? 'bg-indigo-805 text-indigo-100' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {kib.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Table Operations: Search, Category Filters, Conditional Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-50 border border-slate-200/60 p-3 rounded-2xl">
            <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-0">
              
              {/* Search Field */}
              <div className="relative min-w-[200px] flex-1 max-w-xs">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-420 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Cari nama atau kode aset..."
                  value={invSearch}
                  onChange={(e) => setInvSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium text-slate-700 placeholder-slate-400"
                />
              </div>

              {/* Category Filter */}
              <select
                value={invKategori}
                onChange={(e) => setInvKategori(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="ALL">Semua Kategori (KIB A-F)</option>
                <option value="KIB A: Tanah">KIB A: Tanah</option>
                <option value="KIB B: Peralatan & Mesin">KIB B: Peralatan & Mesin</option>
                <option value="KIB C: Gedung & Bangunan">KIB C: Gedung & Bangunan</option>
                <option value="KIB D: Jalan, Irigasi & Jaringan">KIB D: Jalan, Irigasi & Jaringan</option>
                <option value="KIB E: Aset Tetap Lainnya">KIB E: Aset Tetap Lainnya</option>
                <option value="KIB F: Konstruksi dalam Pengerjaan">KIB F: Konstruksi dalam Pengerjaan</option>
              </select>

              {/* Condition Filter */}
              <select
                value={invKondisi}
                onChange={(e) => setInvKondisi(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="ALL">Semua Kondisi</option>
                <option value="Baik">Kondisi Baik</option>
                <option value="Rusak Ringan">Rusak Ringan</option>
                <option value="Rusak Berat">Rusak Berat</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrintReport}
                disabled={filteredAssets.length === 0}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-100 flex items-center justify-center gap-1.5 transition-colors disabled:opacity-40 disabled:pointer-events-none"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Cetak KIB</span>
              </button>

              <button
                onClick={openAddAsset}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-black hover:bg-indigo-700 flex items-center justify-center gap-1.5 transition-all shadow-3xs"
              >
                <Plus className="h-4 w-4" />
                <span>Tambah Aset</span>
              </button>
            </div>
          </div>

          {/* Assets Grid Table or Seeding callout */}
          {items.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center space-y-6">
              <div className="h-14 w-14 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mx-auto shadow-3xs">
                <Package className="h-7 w-7" />
              </div>
              <div className="space-y-1.5 max-w-sm mx-auto">
                <h3 className="text-sm font-black text-slate-900">Belum Ada Aset Terdaftar</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Tidak ada aset atau inventaris kartu BMD yang tercatat di dalam basis data UPTD Anda saat ini.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleSeedDummyAssets}
                  className="px-4 py-2 rounded-xl bg-indigo-500/10 border border-indigo-200 text-indigo-700 text-xs font-extrabold hover:bg-indigo-500/20 flex items-center gap-1.5 transition-all leading-none focus:outline-none"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>Muat Format Simulasi KIB</span>
                </button>
                <button
                  onClick={openAddAsset}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-black hover:bg-slate-850 flex items-center gap-1.5 transition-all leading-none shadow-3xs"
                >
                  <Plus className="h-4 w-4" />
                  <span>Input Manual</span>
                </button>
              </div>
            </div>
          ) : filteredAssets.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center text-slate-400 text-xs">
              <Info className="h-5 w-5 mx-auto text-slate-350 mb-2" />
              Tidak ditemukan aset yang cocok dengan kriteria pencarian dan saringan Anda.
            </div>
          ) : (
            /* Responsive Main Table */
            <div className="bg-white border border-slate-200 rounded-2xl shadow-3xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs align-middle">
                  <thead className="bg-slate-50 border-b border-slate-150 text-slate-550 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="px-5 py-3 w-[15%]">Kode Register</th>
                      <th className="px-5 py-3">Nama Sediaan / Barang</th>
                      <th className="px-5 py-3">Kategori KIB</th>
                      <th className="px-5 py-3 text-center w-[10%]">Jumlah</th>
                      <th className="px-5 py-3 text-center w-[12%]">Kondisi</th>
                      <th className="px-5 py-3 text-right w-[18%]">Nilai Perolehan</th>
                      <th className="px-5 py-3 text-right w-[12%]">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150">
                    {filteredAssets.map((ast) => {
                      let condBadge = 'bg-stone-550';
                      let condText = 'text-slate-800 bg-slate-50 border-slate-200';
                      if (ast.kondisi === 'Baik') {
                        condBadge = 'bg-emerald-500';
                        condText = 'text-emerald-700 bg-emerald-50 border-emerald-100';
                      } else if (ast.kondisi === 'Rusak Ringan') {
                        condBadge = 'bg-amber-500';
                        condText = 'text-amber-700 bg-amber-50 border-amber-100';
                      } else if (ast.kondisi === 'Rusak Berat') {
                        condBadge = 'bg-rose-500';
                        condText = 'text-rose-700 bg-rose-50 border-rose-100';
                      }

                      return (
                        <tr key={ast.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-5 py-3.5 whitespace-nowrap">
                            <span className="font-mono text-[11px] font-black tracking-tight text-slate-800">
                              {ast.kodeAset}
                            </span>
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="min-w-[150px]">
                              <p className="font-extrabold text-slate-850 text-xs">{ast.namaAset}</p>
                              <p className="text-[10px] text-slate-400 mt-0.5">Tgl Beli: {ast.tanggalPerolehan}</p>
                            </div>
                          </td>
                          <td className="px-5 py-3.5">
                            <span className="text-[11px] text-slate-600 font-medium">
                              {ast.kategori}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-center font-sans">
                            <span className="text-xs font-black text-slate-800">{ast.jumlah}</span>
                            <span className="text-[10px] text-slate-400 font-medium ml-1">Unit</span>
                          </td>
                          <td className="px-5 py-3.5 text-center">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${condText}`}>
                              <span className={`h-1.5 w-1.5 rounded-full ${condBadge}`} />
                              <span>{ast.kondisi}</span>
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-right whitespace-nowrap">
                            <div>
                              <p className="font-black text-xs text-slate-800">Rp {Number(ast.nilaiAset || 0).toLocaleString('id-ID')}</p>
                              <p className="text-[9px] text-slate-400 font-bold mt-0.5">
                                Tot: Rp {Number((ast.nilaiAset || 0) * (ast.jumlah || 1)).toLocaleString('id-ID')}
                              </p>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => openEditAsset(ast)}
                                className="h-7 w-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:bg-slate-100 transition-all"
                                title="Edit Aset"
                              >
                                <Edit3 className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Yakin ingin menghapus sediaan barang "${ast.namaAset}"?`)) {
                                    onDeleteItem(ast.id);
                                  }
                                }}
                                className="h-7 w-7 rounded-lg border border-slate-250 flex items-center justify-center text-slate-450 hover:text-rose-600 hover:bg-rose-50/50 transition-all"
                                title="Hapus Aset"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. TAB VIEW: DISTRIBUSI ASET */}
      {activeTab === 'distribusi' && (
        <div className="space-y-6">
          
          {/* Section Quick Stats row for Distribusi */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-white border border-slate-150 p-4 rounded-2xl flex items-center gap-3 shadow-3xs">
              <div className="h-9 w-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                <ArrowRightLeft className="h-4.5 w-4.5" />
              </div>
              <div>
                <p className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Total Terdistribusi</p>
                <p className="text-base font-black text-slate-900">{distStats.totalDistUnit} <span className="text-xs text-slate-400 font-medium">Unit</span></p>
              </div>
            </div>

            <div className="bg-white border border-slate-150 p-4 rounded-2xl flex items-center gap-3 shadow-3xs">
              <div className="h-9 w-9 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                <User className="h-4.5 w-4.5" />
              </div>
              <div>
                <p className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Aktif Dipinjam</p>
                <p className="text-base font-black text-slate-900">{distStats.dipinjam} <span className="text-xs text-slate-400 font-medium font-sans">Unit</span></p>
              </div>
            </div>

            <div className="bg-white border border-slate-150 p-4 rounded-2xl flex items-center gap-3 shadow-3xs">
              <div className="h-9 w-9 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 shrink-0">
                <ClipboardList className="h-4.5 w-4.5" />
              </div>
              <div>
                <p className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Sedang Digunakan</p>
                <p className="text-base font-black text-slate-900">{distStats.digunakan} <span className="text-xs text-slate-400 font-medium font-sans">Unit</span></p>
              </div>
            </div>

            <div className="bg-white border border-slate-150 p-4 rounded-2xl flex items-center gap-3 shadow-3xs">
              <div className="h-9 w-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                <Check className="h-4.5 w-4.5" />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Telah Dikembalikan</p>
                <p className="text-base font-black text-slate-900 truncate">
                  {distStats.dikembalikan} <span className="text-xs text-slate-400 font-medium">Unit</span>
                </p>
              </div>
            </div>
          </div>

          {/* Table Operations: Search, Status Filters, Add Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-50 border border-slate-200/60 p-3 rounded-2xl">
            <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-0">
              
              {/* Search Field */}
              <div className="relative min-w-[200px] flex-1 max-w-xs font-sans">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-420 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Cari penerima, seksi, atau nama aset..."
                  value={distSearch}
                  onChange={(e) => setDistSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium text-slate-700 placeholder-slate-400"
                />
              </div>

              {/* Status Filter */}
              <select
                value={distStatus}
                onChange={(e) => setDistStatus(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="ALL">Semua Status Log</option>
                <option value="Dipinjam">Dipinjam (Kembali)</option>
                <option value="Digunakan">Dalam Penggunaan</option>
                <option value="Dikembalikan">Telah Dikembalikan</option>
                <option value="Rusak/Hilang">Rusak / Hilang</option>
              </select>
            </div>

            <div className="flex items-center gap-2 whitespace-nowrap">
              <button
                onClick={handlePrintDistribusi}
                disabled={filteredDistribusi.length === 0}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-100 flex items-center justify-center gap-1.5 transition-colors disabled:opacity-40 disabled:pointer-events-none"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Cetak Log</span>
              </button>

              <button
                disabled={items.length === 0}
                onClick={openAddDist}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-black hover:bg-indigo-700 flex items-center justify-center gap-1.5 transition-all shadow-3xs disabled:opacity-45 disabled:pointer-events-none"
                title={items.length === 0 ? "Silakan daftarkan inventaris aset bmd terlebih dahulu" : "Distribusikan aset baru"}
              >
                <User className="h-3.5 w-3.5" />
                <span>Distribusikan Aset</span>
              </button>
            </div>
          </div>

          {/* Distribution list rendering */}
          {distribusiList.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center space-y-4">
              <div className="h-14 w-14 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-700 flex items-center justify-center mx-auto shadow-3xs">
                <ArrowRightLeft className="h-7 w-7" />
              </div>
              <div className="space-y-1 max-w-sm mx-auto">
                <h3 className="text-sm font-black text-slate-900">Belum Ada Distribusi Tercatat</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Belum ada inventaris aset yang tercatat sedang diposisikan, dipinjamkan, atau dialihkan ke pegawai seksi UPTD.
                </p>
              </div>
              <button
                disabled={items.length === 0}
                onClick={openAddDist}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-black hover:bg-indigo-700 transition-all leading-none focus:outline-none select-none inline-flex items-center gap-2 shadow-2xs"
              >
                <Plus className="h-4 w-4" />
                <span>Distribusikan Aset Pertama</span>
              </button>
            </div>
          ) : filteredDistribusi.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center text-slate-400 text-xs">
              <Info className="h-5 w-5 mx-auto text-slate-350 mb-2" />
              Tidak ditemukan data distribusi yang cocok dengan saringan sanksi Anda.
            </div>
          ) : (
            /* Responsive Log List */
            <div className="bg-white border border-slate-200 rounded-2xl shadow-3xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs align-middle font-sans">
                  <thead className="bg-slate-50 border-b border-slate-150 text-slate-550 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="px-5 py-3">Nama Barang Aset</th>
                      <th className="px-5 py-3">Pegawai Penerima</th>
                      <th className="px-5 py-3 text-center">Qty / Vol</th>
                      <th className="px-5 py-3 text-center">Tanggal Kirim</th>
                      <th className="px-5 py-3 text-center">Status</th>
                      <th className="px-5 py-3">Detail Keterangan Keperluan</th>
                      <th className="px-5 py-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150 text-slate-705">
                    {filteredDistribusi.map((dist) => {
                      let statusBadgeColor = 'text-slate-700 bg-slate-50 border-slate-200';
                      let statusBgCircle = 'bg-slate-400';
                      if (dist.statusDistribusi === 'Dipinjam') {
                        statusBadgeColor = 'text-amber-700 bg-amber-55/40 border-amber-200';
                        statusBgCircle = 'bg-amber-500';
                      } else if (dist.statusDistribusi === 'Digunakan') {
                        statusBadgeColor = 'text-orange-700 bg-orange-55/40 border-orange-200';
                        statusBgCircle = 'bg-orange-500';
                      } else if (dist.statusDistribusi === 'Dikembalikan') {
                        statusBadgeColor = 'text-emerald-700 bg-emerald-55/40 border-emerald-200';
                        statusBgCircle = 'bg-emerald-500';
                      } else if (dist.statusDistribusi === 'Rusak/Hilang') {
                        statusBadgeColor = 'text-rose-700 bg-rose-55/40 border-rose-200';
                        statusBgCircle = 'bg-rose-500';
                      }

                      return (
                        <tr key={dist.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-5 py-3.5">
                            <div>
                              <p className="font-extrabold text-slate-850 text-xs">{dist.namaAset}</p>
                            </div>
                          </td>
                          <td className="px-5 py-3.5">
                            <div>
                              <p className="font-extrabold text-slate-850 text-xs">{dist.penerima}</p>
                              <p className="text-[10px] text-slate-400 mt-0.5">{dist.seksiBagian}</p>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 text-center font-sans">
                            <span className="font-extrabold text-slate-850">{dist.jumlah} unit</span>
                          </td>
                          <td className="px-5 py-3.5 text-center whitespace-nowrap">
                            <span className="text-slate-550 font-bold">{dist.tanggalDistribusi}</span>
                          </td>
                          <td className="px-5 py-3.5 text-center whitespace-nowrap">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${statusBadgeColor}`}>
                              <span className={`h-1.5 w-1.5 rounded-full ${statusBgCircle}`} />
                              <span>{dist.statusDistribusi}</span>
                            </span>
                          </td>
                          <td className="px-5 py-3.5">
                            <p className="text-slate-550 max-w-xs truncate" title={dist.keterangan}>
                              {dist.keterangan || '-'}
                            </p>
                          </td>
                          <td className="px-5 py-3.5 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              {dist.statusDistribusi !== 'Dikembalikan' && (
                                <button
                                  onClick={() => handleQuickReturn(dist)}
                                  className="px-2 py-1 rounded-lg border border-emerald-100 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 flex items-center gap-1 transition-all text-[10px] font-black uppercase"
                                  title="Telah dikembalikan"
                                >
                                  <Check className="h-3 w-3" />
                                  <span>Kembali</span>
                                </button>
                              )}
                              <button
                                onClick={() => openEditDist(dist)}
                                className="h-7 w-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:bg-slate-100 transition-all font-bold"
                                title="Edit Distribusi"
                              >
                                <Edit3 className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteDist(dist.id)}
                                className="h-7 w-7 rounded-lg border border-slate-250 flex items-center justify-center text-slate-450 hover:text-rose-600 hover:bg-rose-50/50 transition-all font-bold"
                                title="Hapus Log"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* --- INVENTARIS ASET DIALOG MODAL --- */}
      {showAssetModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-subtle flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full shadow-lg overflow-hidden animate-slide-up">
            <div className="px-5 py-4 border-b border-slate-150 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Package className="h-4.5 w-4.5 text-indigo-600" />
                <h3 className="font-extrabold text-slate-900 text-sm">
                  {editingAsset ? 'Sunting Data KIB Aset' : 'Registrasi Aset BMD Baru'}
                </h3>
              </div>
              <button 
                onClick={() => setShowAssetModal(false)}
                className="h-7 w-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all focus:outline-none"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={saveAsset} className="p-5 space-y-4 text-xs font-sans">
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-550 block">Kode Register Aset *</label>
                  <input
                    type="text"
                    required
                    value={assetForm.kodeAset}
                    onChange={(e) => setAssetForm({...assetForm, kodeAset: e.target.value})}
                    placeholder="Contoh: KIB-B.01.002"
                    className="w-full p-2 border border-slate-200 bg-slate-50/20 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-550 block">Tanggal Perolehan *</label>
                  <input
                    type="date"
                    required
                    value={assetForm.tanggalPerolehan}
                    onChange={(e) => setAssetForm({...assetForm, tanggalPerolehan: e.target.value})}
                    className="w-full p-2 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-550 block">Nama Barang / Aset BMD *</label>
                <input
                  type="text"
                  required
                  value={assetForm.namaAset}
                  onChange={(e) => setAssetForm({...assetForm, namaAset: e.target.value})}
                  placeholder="Misal: Excavator Komatsu, Pompa Diesel"
                  className="w-full p-2 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded-xl font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-550 block">Kategori Inventaris BMD *</label>
                <select
                  value={assetForm.kategori}
                  onChange={(e) => setAssetForm({...assetForm, kategori: e.target.value as any})}
                  className="w-full p-2 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded-xl font-medium"
                >
                  <option value="KIB A: Tanah">KIB A: Tanah</option>
                  <option value="KIB B: Peralatan & Mesin">KIB B: Peralatan & Mesin</option>
                  <option value="KIB C: Gedung & Bangunan">KIB C: Gedung & Bangunan</option>
                  <option value="KIB D: Jalan, Irigasi & Jaringan">KIB D: Jalan, Irigasi & Jaringan</option>
                  <option value="KIB E: Aset Tetap Lainnya">KIB E: Aset Tetap Lainnya</option>
                  <option value="KIB F: Konstruksi dalam Pengerjaan">KIB F: Konstruksi dalam Pengerjaan</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-550 block">Jumlah Kuantitas (Unit) *</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={assetForm.jumlah}
                    onChange={(e) => setAssetForm({...assetForm, jumlah: Number(e.target.value)})}
                    className="w-full p-2 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-550 block">Kondisi Fisik Saat Ini *</label>
                  <select
                    value={assetForm.kondisi}
                    onChange={(e) => setAssetForm({...assetForm, kondisi: e.target.value as any})}
                    className="w-full p-2 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded-xl font-medium"
                  >
                    <option value="Baik">Baik (Berfungsi Sempurna)</option>
                    <option value="Rusak Ringan">Rusak Ringan (Alat Penunjang)</option>
                    <option value="Rusak Berat">Rusak Berat (Mati Total)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-550 block">Nilai Perolehan Satuan (Rp) *</label>
                <input
                  type="number"
                  min={0}
                  required
                  value={assetForm.nilaiAset}
                  onChange={(e) => setAssetForm({...assetForm, nilaiAset: Number(e.target.value)})}
                  className="w-full p-2 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded-xl font-bold font-mono text-xs"
                />
                <span className="text-[10px] text-slate-400 block pt-0.5">
                  Estimasi Nilai Total: <b>Rp {Number(assetForm.nilaiAset * assetForm.jumlah).toLocaleString('id-ID')}</b>
                </span>
              </div>

              <div className="pt-3 border-t border-slate-150 flex items-center justify-end gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setShowAssetModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-550 hover:bg-slate-50 transition-colors font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl transition-colors shadow-3xs"
                >
                  Simpan Aset KIB
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* --- DISTRIBUSI ASET DIALOG MODAL --- */}
      {showDistModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-subtle flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full shadow-lg overflow-hidden animate-slide-up">
            <div className="px-5 py-4 border-b border-slate-150 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <ArrowRightLeft className="h-4.5 w-4.5 text-indigo-600" />
                <h3 className="font-extrabold text-slate-900 text-sm">
                  {editingDist ? 'Sunting Formulir Log Distribusi' : 'Form Alir / Distribusi Aset Baru'}
                </h3>
              </div>
              <button 
                onClick={() => setShowDistModal(false)}
                className="h-7 w-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all focus:outline-none"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={saveDist} className="p-5 space-y-4 text-xs font-sans">
              
              <div className="space-y-1">
                <label className="font-bold text-slate-550 block">Pilih Aset KIB Terinventarisasi *</label>
                <select
                  required
                  value={distForm.idAset}
                  onChange={(e) => setDistForm({...distForm, idAset: e.target.value})}
                  className="w-full p-2 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded-xl font-bold"
                >
                  {items.map(a => (
                    <option key={a.id} value={a.id}>
                      [{a.kodeAset}] - {a.namaAset} ({a.jumlah} Unit Tersedia)
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-550 block">Karyawan / Pegawai Penerima Aliran *</label>
                {personaliaItems.length > 0 ? (
                  <select
                    value={distForm.penerima}
                    onChange={(e) => handlePenerimaChange(e.target.value)}
                    className="w-full p-2 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded-xl font-bold"
                  >
                    {personaliaItems.map(p => (
                      <option key={p.id} value={p.nama}>
                        {p.nama} ({p.jabatan || 'Aparatur'})
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    required
                    value={distForm.penerima}
                    onChange={(e) => setDistForm({...distForm, penerima: e.target.value})}
                    placeholder="Ketikkan nama staf penerima tanggung jawab..."
                    className="w-full p-2 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded-xl font-bold"
                  />
                )}
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-550 block">Seksi / Jabatan / Lokasi Unit Kerja</label>
                <input
                  type="text"
                  value={distForm.seksiBagian}
                  onChange={(e) => setDistForm({...distForm, seksiBagian: e.target.value})}
                  placeholder="Misal: Bendahara, Operator Intake, dll"
                  className="w-full p-2 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 col-span-2">
                <div className="space-y-1">
                  <label className="font-bold text-slate-550 block">Jumlah Kuantitas (Unit) *</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={distForm.jumlah}
                    onChange={(e) => setDistForm({...distForm, jumlah: Number(e.target.value)})}
                    className="w-full p-2 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded-xl font-black"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-550 block">Tanggal Distribusi *</label>
                  <input
                    type="date"
                    required
                    value={distForm.tanggalDistribusi}
                    onChange={(e) => setDistForm({...distForm, tanggalDistribusi: e.target.value})}
                    className="w-full p-2 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-550 block">Status Penggunaan Aset *</label>
                <select
                  value={distForm.statusDistribusi}
                  onChange={(e) => setDistForm({...distForm, statusDistribusi: e.target.value as any})}
                  className="w-full p-2 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded-xl font-medium"
                >
                  <option value="Digunakan">Digunakan secara Eksklusif</option>
                  <option value="Dipinjam">Dipinjam (Kembali Terjadwal)</option>
                  <option value="Dikembalikan">Telah Dikembalikan (Closed)</option>
                  <option value="Rusak/Hilang">Rusak Tempur / Hilang Fisik</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-550 block">Keterangan Keperluan / Catatan Dinas</label>
                <textarea
                  rows={2}
                  value={distForm.keterangan}
                  onChange={(e) => setDistForm({...distForm, keterangan: e.target.value})}
                  placeholder="Misal: Dukungan pengerukan banjir, atau dipinjam unit darurat..."
                  className="w-full p-2 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded-xl"
                />
              </div>

              <div className="pt-3 border-t border-slate-150 flex items-center justify-end gap-2 text-xs font-sans">
                <button
                  type="button"
                  onClick={() => setShowDistModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-550 hover:bg-slate-50 transition-colors font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl transition-colors shadow-3xs"
                >
                  Simpan Catatan
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
