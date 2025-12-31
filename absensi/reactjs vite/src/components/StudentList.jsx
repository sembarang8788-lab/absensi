import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const StudentList = ({ gelombang, onStudentClick }) => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchStudents = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('santri')
                .select('*')
                .eq('gelombang_id', gelombang)
                .eq('ikut_silat', true)
                .order('nama_lengkap', { ascending: true });

            if (!error) {
                setStudents(data);
            }
            setLoading(false);
        };

        fetchStudents();
    }, [gelombang]);

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Nama Lengkap</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">WhatsApp</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Ayah</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Alamat</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {loading ? (
                        <tr><td colSpan="4" className="p-10 text-center text-slate-400">Loading...</td></tr>
                    ) : students.length === 0 ? (
                        <tr><td colSpan="4" className="p-10 text-center text-slate-400">Belum ada data di gelombang ini.</td></tr>
                    ) : (
                        students.map((s) => (
                            <tr
                                key={s.id}
                                onClick={() => onStudentClick(s)}
                                className="cursor-pointer hover:bg-green-50/70 transition border-b border-slate-50"
                            >
                                <td className="px-6 py-4 font-bold text-slate-700">{s.nama_lengkap}</td>
                                <td className="px-6 py-4 text-sm text-slate-600">{s.no_hp}</td>
                                <td className="px-6 py-4 text-sm text-slate-600">{s.nama_ayah}</td>
                                <td className="px-6 py-4 text-sm text-slate-500">{s.alamat}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default StudentList;
