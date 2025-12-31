import React from 'react';
import { Users, CheckSquare, PieChart } from 'lucide-react';

const Sidebar = ({ activeTab, onTabChange }) => {
    const tabs = [
        { id: 'data-silat', label: 'Data Siswa', icon: Users },
        { id: 'absensi-silat', label: 'Input Absen', icon: CheckSquare },
        { id: 'analitik', label: 'Laporan/Grafik', icon: PieChart }
    ];

    return (
        <aside className="w-full md:w-64 bg-white border-r border-slate-200">
            <div className="p-6">
                <h3 className="text-xs font-bold text-slate-400 uppercase mb-6 tracking-wider">
                    Navigasi Admin
                </h3>
                <nav className="space-y-1">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => onTabChange(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === tab.id
                                        ? 'sidebar-active'
                                        : 'text-slate-600 hover:bg-slate-50'
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                <span>{tab.label}</span>
                            </button>
                        );
                    })}
                </nav>
            </div>
        </aside>
    );
};

export default Sidebar;
