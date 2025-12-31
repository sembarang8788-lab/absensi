import React, { useState } from 'react';
import Sidebar from './Sidebar';
import StudentList from './StudentList';
import AttendanceInput from './AttendanceInput';
import AnalyticsDashboard from './AnalyticsDashboard';

const AdminDashboard = ({ onStudentClick }) => {
    const [activeTab, setActiveTab] = useState('data-silat');
    const [gelombang, setGelombang] = useState('43');

    return (
        <section id="page-admin-dashboard" className="bg-slate-100">
            <div className="flex flex-col md:flex-row min-h-[calc(100vh-64px)]">
                <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
                <main className="flex-1 p-6 md:p-10">
                    {activeTab === 'data-silat' && (
                        <div id="tab-data-silat">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-800">Daftar Siswa Pencak Silat</h2>
                                    <p className="text-slate-500 text-sm">Data real-time Absensi Gelombang</p>
                                </div>
                                <select
                                    value={gelombang}
                                    onChange={(e) => setGelombang(e.target.value)}
                                    className="px-4 py-2 rounded-xl border bg-white focus:ring-2 focus:ring-green-500 outline-none shadow-sm"
                                >
                                    <option value="43">Gelombang 43</option>
                                    <option value="44">Gelombang 44</option>
                                </select>
                            </div>
                            <StudentList gelombang={gelombang} onStudentClick={onStudentClick} />
                        </div>
                    )}
                    {activeTab === 'absensi-silat' && <AttendanceInput />}
                    {activeTab === 'analitik' && <AnalyticsDashboard />}
                </main>
            </div>
        </section>
    );
};

export default AdminDashboard;
