import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './components/Home';
import RegistrationForm from './components/RegistrationForm';
import AdminDashboard from './components/AdminDashboard';
import DetailModal from './components/DetailModal';
import { supabase } from './lib/supabase';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedSantri, setSelectedSantri] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUpdate = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleBackup = async () => {
    try {
      const { data: santriData, error: santriError } = await supabase
        .from('santri')
        .select('*')
        .order('nama_lengkap', { ascending: true });

      if (santriError) throw santriError;

      const { data: absensiData, error: absensiError } = await supabase
        .from('absensi')
        .select('*, santri:santri_id (nama_lengkap)')
        .order('tanggal', { ascending: false });

      if (absensiError) throw absensiError;

      let csvContent = "data:text/csv;charset=utf-8,";
      csvContent += "=== DATA SANTRI ===\n";
      csvContent += "No,Nama Lengkap,Tanggal Lahir,No HP,Nama Ayah,Alamat,Gelombang,Ikut Silat\n";
      santriData.forEach((s, i) => {
        let tglLahirFormatted = '';
        if (s.tanggal_lahir) {
          const tgl = new Date(s.tanggal_lahir);
          tglLahirFormatted = tgl.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' });
        }
        const noHpStr = s.no_hp ? "'" + s.no_hp : '';
        csvContent += `${i + 1},"${s.nama_lengkap || ''}","${tglLahirFormatted}","${noHpStr}","${s.nama_ayah || ''}","${(s.alamat || '').replace(/"/g, '""')}",${s.gelombang_id || ''},${s.ikut_silat ? 'Ya' : 'Tidak'}\n`;
      });

      csvContent += "\n\n=== DATA ABSENSI ===\n";
      csvContent += "No,Nama Santri,Tanggal,Status,Tipe Kegiatan\n";
      absensiData.forEach((a, i) => {
        const nama = a.santri ? a.santri.nama_lengkap : 'Tidak Diketahui';
        csvContent += `${i + 1},"${nama}",${a.tanggal},${a.status},${a.tipe_kegiatan || 'Silat'}\n`;
      });

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      const today = new Date().toISOString().split('T')[0];
      link.setAttribute("download", `backup_chaqqulloh_${today}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      alert(`Backup berhasil!\n\nTotal Santri: ${santriData.length}\nTotal Absensi: ${absensiData.length}\n\nFile akan terdownload otomatis.`);
    } catch (error) {
      alert("Gagal backup: " + error.message);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar
        currentPage={currentPage}
        onNavigate={(page) => { setCurrentPage(page); window.scrollTo(0, 0); }}
        onBackup={handleBackup}
      />

      <main className="pt-16 min-h-screen">
        {currentPage === 'home' && <Home onNavigate={setCurrentPage} />}
        {currentPage === 'pendaftaran' && <RegistrationForm onNavigate={setCurrentPage} />}
        {currentPage === 'admin-dashboard' && <AdminDashboard onStudentClick={setSelectedSantri} refreshKey={refreshKey} />}
      </main>

      {selectedSantri && (
        <DetailModal
          santri={selectedSantri}
          onClose={() => setSelectedSantri(null)}
          supabaseClient={supabase}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
}

export default App;
