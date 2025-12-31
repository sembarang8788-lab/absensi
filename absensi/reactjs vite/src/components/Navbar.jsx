import React from 'react';
import { Download, UserCog } from 'lucide-react';

const Navbar = ({ currentPage, onNavigate, onBackup }) => {

    return (
        <nav className="fixed top-0 w-full z-50 glass border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <img src="/public/1.jpeg" alt="Logo Chaqqulloh" className="w-[60px] h-[60px] rounded-lg object-cover" />
                    <span className="font-bold text-xl uppercase text-green-800">Perguruan Chaqqulloh</span>
                </div>
                <div className="hidden md:flex gap-8 font-medium text-slate-600">
                    <button
                        onClick={() => onNavigate('home')}
                        className="px-4 py-2 hover:text-green-600 transition"
                    >
                        Beranda
                    </button>
                    <button
                        onClick={() => onNavigate('pendaftaran')}
                        className="bg-green-600 text-white px-4 py-2 rounded-full shadow-md hover:bg-green-700 transition"
                    >
                        Pendaftaran
                    </button>
                    <button
                        type="button"
                        onClick={() => window.open("https://drive.google.com/drive/folders/1H45R0pzeia00tCwlewrEMI9O6OC1raGt", "_blank", "noopener,noreferrer")}
                        className="bg-green-600 text-white px-4 py-2 rounded-full shadow-md hover:bg-green-700 transition"
                        aria-label="Buka dokumentasi di tab baru"
                        >
                        Dokumentasi
                    </button>
                    <button
                        onClick={onBackup}
                        className="bg-amber-500 text-white px-4 py-2 rounded-full shadow-md hover:bg-amber-600 transition flex items-center gap-2"
                    >
                        <Download className="w-4 h-4" />
                        Backup
                    </button>
                </div>
                <button
                    onClick={() => onNavigate('admin-dashboard')}
                    className="text-slate-500 hover:text-green-600 flex items-center gap-1"
                >
                    <UserCog className="w-4 h-4" />
                    <span className="text-xs">Admin Panel</span>
                </button>
            </div>
        </nav>
    );
};

export default Navbar;

