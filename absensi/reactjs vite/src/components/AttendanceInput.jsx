import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { CheckSquare, Info } from 'lucide-react';

const AttendanceInput = () => {
    const [students, setStudents] = useState([]);
    const [dates, setDates] = useState([]);
    const [formData, setFormData] = useState({
        santri_id: '',
        tanggal: '',
        status: 'Hadir'
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Generate Thursday and Saturday dates
        const options = [];
        let date = new Date();
        const limit = new Date("2026-12-31");
        while (date <= limit) {
            const day = date.getDay();
            if (day === 4 || day === 6) {
                const iso = date.toISOString().split('T')[0];
                const label = (day === 4 ? 'Kamis, ' : 'Sabtu, ') + date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
                options.push({ value: iso, label });
            }
            date.setDate(date.getDate() + 1);
        }
        setDates(options);
        if (options.length > 0) {
            setFormData(prev => ({ ...prev, tanggal: options[0].value }));
        }

        // Fetch all students for dropdown
        const fetchAllStudents = async () => {
            const { data } = await supabase
                .from('santri')
                .select('id, nama_lengkap')
                .eq('ikut_silat', true)
                .order('nama_lengkap', { ascending: true });
            if (data) {
                setStudents(data);
                if (data.length > 0) {
                    setFormData(prev => ({ ...prev, santri_id: data[0].id }));
                }
            }
        };
        fetchAllStudents();
    }, []);

    const handleSubmit = async () => {
        if (!formData.santri_id) return alert("Pilih siswa terlebih dahulu!");
        setLoading(true);
        const { error } = await supabase.from('absensi').insert([
            { ...formData, tipe_kegiatan: 'Silat' }
        ]);

        if (error) {
            alert("Gagal mencatat absen: " + error.message);
        } else {
            alert("Absensi berhasil dicatat untuk " + formData.tanggal);
        }
        setLoading(false);
    };

    return (
        <div id="tab-absensi-silat">
            <h2 className="text-2xl font-bold mb-6">Absensi Kegiatan (Kamis & Sabtu)</h2>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 mb-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-bold mb-2">Tanggal (Kamis/Sabtu)</label>
                        <select
                            value={formData.tanggal}
                            onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none bg-slate-50"
                        >
                            {dates.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-2">Pilih Nama Siswa</label>
                        <select
                            value={formData.santri_id}
                            onChange={(e) => setFormData({ ...formData, santri_id: e.target.value })}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none bg-slate-50"
                        >
                            {students.map(s => <option key={s.id} value={s.id}>{s.nama_lengkap}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-2">Status Kehadiran</label>
                        <select
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none bg-slate-50"
                        >
                            <option value="Hadir">Hadir</option>
                            <option value="Izin">Izin</option>
                            <option value="Alfa">Alfa</option>
                        </select>
                    </div>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full bg-green-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-green-700 transition flex items-center justify-center gap-2 shadow-lg"
                >
                    <CheckSquare className="w-5 h-5" />
                    {loading ? 'Submitting...' : 'SUBMIT ABSENSI'}
                </button>
            </div>
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 text-amber-800 text-sm flex gap-3 items-center">
                <Info className="w-5 h-5" />
                <span>Pilih tanggal yang sesuai. Daftar mencakup jadwal kegiatan hingga akhir 2026.</span>
            </div>
        </div>
    );
};

export default AttendanceInput;
