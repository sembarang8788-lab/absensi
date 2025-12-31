import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { BarChart2, Activity, ClipboardList, Users } from 'lucide-react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const AnalyticsDashboard = () => {
    const [absensiData, setAbsensiData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [filterHari, setFilterHari] = useState('semua');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [counts, setCounts] = useState({ Hadir: 0, Izin: 0, Alfa: 0 });

    useEffect(() => {
        const fetchData = async () => {
            const { data } = await supabase
                .from('absensi')
                .select('*, santri:santri_id (id, nama_lengkap)')
                .eq('tipe_kegiatan', 'Silat')
                .order('tanggal', { ascending: false });
            if (data) {
                setAbsensiData(data);
                setFilteredData(data);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        let data = [...absensiData];

        if (filterHari !== 'semua') {
            data = data.filter(item => {
                const day = new Date(item.tanggal).getDay();
                return filterHari === 'kamis' ? day === 4 : day === 6;
            });
        }

        if (startDate) data = data.filter(item => item.tanggal >= startDate);
        if (endDate) data = data.filter(item => item.tanggal <= endDate);

        setFilteredData(data);

        const newCounts = { Hadir: 0, Izin: 0, Alfa: 0 };
        data.forEach(d => { if (newCounts[d.status] !== undefined) newCounts[d.status]++; });
        setCounts(newCounts);
    }, [filterHari, startDate, endDate, absensiData]);

    const chartData = {
        labels: ['Hadir', 'Izin', 'Alfa'],
        datasets: [{
            data: [counts.Hadir, counts.Izin, counts.Alfa],
            backgroundColor: ['#22c55e', '#3b82f6', '#ef4444'],
            hoverOffset: 4,
            borderWidth: 0
        }]
    };

    const total = filteredData.length || 1;
    const presenceRate = Math.round((counts.Hadir / total) * 100);

    // Grouping for rekap
    const santriStats = {};
    filteredData.forEach(item => {
        const id = item.santri_id;
        const name = item.santri?.nama_lengkap || 'Tidak Diketahui';
        const day = new Date(item.tanggal).getDay();

        if (!santriStats[id]) {
            santriStats[id] = { name, kamis: { H: 0, I: 0, A: 0 }, sabtu: { H: 0, I: 0, A: 0 } };
        }

        const key = day === 4 ? 'kamis' : 'sabtu';
        const statusKey = item.status === 'Hadir' ? 'H' : (item.status === 'Izin' ? 'I' : 'A');
        santriStats[id][key][statusKey]++;
    });

    const statsArray = Object.values(santriStats).sort((a, b) => a.name.localeCompare(b.name));

    return (
        <div id="tab-analitik">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Laporan & Grafik</h2>
                    <p className="text-sm text-slate-500">Data absensi kegiatan Pencak Silat</p>
                </div>
                <div className="flex items-center gap-3">
                    <label className="text-sm font-semibold text-slate-600">Filter Hari:</label>
                    <select
                        value={filterHari}
                        onChange={(e) => setFilterHari(e.target.value)}
                        className="px-4 py-2 rounded-xl border bg-white focus:ring-2 focus:ring-green-500 outline-none shadow-sm font-medium"
                    >
                        <option value="semua">Semua Hari</option>
                        <option value="kamis">Kamis</option>
                        <option value="sabtu">Sabtu</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
                    <h3 className="font-bold mb-6 text-slate-800 flex items-center gap-2">
                        <BarChart2 className="text-green-600" /> Persentase Kehadiran
                    </h3>
                    <div className="flex justify-center h-64">
                        <Doughnut data={chartData} options={{ maintainAspectRatio: false, cutout: '70%', plugins: { legend: { position: 'bottom' } } }} />
                    </div>
                </div>
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
                    <h3 className="font-bold mb-6 text-slate-800 flex items-center gap-2">
                        <Activity className="text-blue-600" /> Ringkasan Performa
                    </h3>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                <p className="text-xs font-bold text-slate-400 uppercase">Total Log Absen</p>
                                <p className="text-3xl font-black text-slate-800">{filteredData.length}</p>
                                <p className="text-xs text-slate-400 mt-1">({filterHari === 'semua' ? 'Semua Hari' : (filterHari === 'kamis' ? 'Kamis' : 'Sabtu')})</p>
                            </div>
                            <div className="p-6 bg-green-50 rounded-2xl border border-green-100">
                                <p className="text-xs font-bold text-green-600 uppercase">Persentase Masuk</p>
                                <p className="text-3xl font-black text-green-700">{presenceRate}%</p>
                            </div>
                        </div>
                        <div className="mt-4 p-6 bg-white border border-slate-100 rounded-2xl shadow-sm">
                            <p className="text-sm text-slate-500 mb-2">Status paling sering: <span className="font-bold text-slate-800">{counts.Hadir >= counts.Alfa ? 'Hadir (Bagus)' : 'Kurang Disiplin'}</span></p>
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                <div className="bg-green-500 h-full" style={{ width: `${presenceRate}%` }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Attendance Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden mb-8">
                <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                            <ClipboardList className="text-purple-600" /> Daftar Absensi
                        </h3>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="px-3 py-2 text-sm rounded-lg border" />
                        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="px-3 py-2 text-sm rounded-lg border" />
                        <button onClick={() => { setStartDate(''); setEndDate(''); }} className="px-3 py-2 text-xs bg-slate-100 rounded-lg">Reset</button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">No</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Nama Santri</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Tanggal</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredData.map((item, index) => (
                                <tr key={item.id}>
                                    <td className="px-6 py-4 text-sm text-slate-500">{index + 1}</td>
                                    <td className="px-6 py-4 font-semibold text-slate-800">{item.santri?.nama_lengkap || 'Unknown'}</td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{new Date(item.tanggal).toLocaleDateString('id-ID')}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${item.status === 'Hadir' ? 'bg-green-100 text-green-700' : (item.status === 'Izin' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700')}`}>
                                            {item.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Recap Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <Users className="text-green-600" /> Rekap Total Absen Per Santri
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200 text-center">
                            <tr>
                                <th rowSpan="2" className="px-4 py-3 border-r">No</th>
                                <th rowSpan="2" className="px-4 py-3 border-r">Nama Santri</th>
                                <th colSpan="3" className="bg-amber-50 text-amber-600 border-r">KAMIS</th>
                                <th colSpan="3" className="bg-purple-50 text-purple-600 border-r">SABTU</th>
                                <th rowSpan="2">Total</th>
                            </tr>
                            <tr className="bg-slate-100 text-xs">
                                <th>H</th><th>I</th><th className="border-r">A</th>
                                <th>H</th><th>I</th><th className="border-r">A</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {statsArray.map((s, idx) => (
                                <tr key={idx} className="hover:bg-slate-50/50 transition">
                                    <td className="px-4 py-3 text-sm text-slate-500 border-r border-slate-100">{idx + 1}</td>
                                    <td className="px-4 py-3 font-semibold text-slate-800 border-r border-slate-100 text-left">{s.name}</td>
                                    {/* KAMIS */}
                                    <td className="px-3 py-3 text-center">
                                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-green-100 text-green-700 font-bold text-xs">{s.kamis.H}</span>
                                    </td>
                                    <td className="px-3 py-3 text-center">
                                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold text-xs">{s.kamis.I}</span>
                                    </td>
                                    <td className="px-3 py-3 text-center border-r border-slate-100">
                                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-red-100 text-red-700 font-bold text-xs">{s.kamis.A}</span>
                                    </td>
                                    {/* SABTU */}
                                    <td className="px-3 py-3 text-center">
                                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-green-100 text-green-700 font-bold text-xs">{s.sabtu.H}</span>
                                    </td>
                                    <td className="px-3 py-3 text-center">
                                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold text-xs">{s.sabtu.I}</span>
                                    </td>
                                    <td className="px-3 py-3 text-center border-r border-slate-100">
                                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-red-100 text-red-700 font-bold text-xs">{s.sabtu.A}</span>
                                    </td>
                                    {/* TOTAL */}
                                    <td className="px-4 py-3 text-center font-bold text-slate-700">{s.kamis.H + s.kamis.I + s.kamis.A + s.sabtu.H + s.sabtu.I + s.sabtu.A}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
