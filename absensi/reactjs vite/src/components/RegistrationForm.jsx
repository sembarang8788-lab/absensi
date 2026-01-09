import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Save } from 'lucide-react';

const RegistrationForm = ({ onNavigate }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        nama_lengkap: '',
        tanggal_lahir: '',
        no_hp: '',
        nama_ayah: '',
        gelombang_id: '43',
        ikut_silat: true,
        alamat: '',
        deskripsi: '',

    });
    const [file, setFile] = useState(null);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Insert data santri
            const { data, error } = await supabase
                .from('santri')
                .insert([formData])
                .select()
                .single();

            if (error) throw error;

            // 2. Upload file if exists
            if (file && data) {
                const filePath = `santri/${data.id}/profil.jpg`;
                const { error: uploadError } = await supabase.storage
                    .from('foto-santri')
                    .upload(filePath, file, { upsert: true });

                if (!uploadError) {
                    await supabase
                        .from('santri')
                        .update({ foto_profil: filePath })
                        .eq('id', data.id);
                }
            }

            alert("Pendaftaran berhasil!");
            onNavigate('admin-dashboard');
        } catch (error) {
            alert("Gagal simpan data: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="page-pendaftaran" className="py-12 px-4">
            <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
                <div className="bg-green-600 p-8 text-white">
                    <h2 className="text-2xl font-bold text-center">Formulir Input Santri Pencak Silat</h2>
                    <p className="opacity-80 text-center">Data akan langsung tersimpan ke database pusat</p>
                </div>
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="mb-6">
                        <label className="block text-sm font-semibold mb-2">Foto Profil</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-green-500"
                        />
                        <p className="text-xs text-slate-500 mt-1">Format JPG/PNG, max ±2MB</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold mb-2">Nama Lengkap</label>
                            <input
                                type="text"
                                name="nama_lengkap"
                                required
                                value={formData.nama_lengkap}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2">Deskripsi</label>
                            <textarea
                                type="text"
                                name="deskripsi"
                                required
                                value={formData.deskripsi}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2">Tanggal Lahir</label>
                            <input
                                type="date"
                                name="tanggal_lahir"
                                required
                                value={formData.tanggal_lahir}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2">No. HP / WhatsApp</label>
                            <input
                                type="tel"
                                name="no_hp"
                                placeholder="08..."
                                required
                                value={formData.no_hp}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2">Nama Ayah Kandung</label>
                            <input
                                type="text"
                                name="nama_ayah"
                                required
                                value={formData.nama_ayah}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2">Gelombang</label>
                            <select
                                name="gelombang_id"
                                value={formData.gelombang_id}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-green-500"
                            >
                                <option value="43">Gelombang 43 (Sekarang)</option>
                                <option value="44">Gelombang 44</option>
                            </select>
                        </div>
                        <div className="flex items-center pt-8">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="ikut_silat"
                                    checked={formData.ikut_silat}
                                    onChange={handleChange}
                                    className="w-5 h-5 text-green-600 border-slate-300 rounded focus:ring-green-500"
                                />
                                <span className="font-medium text-slate-700">Aktif Pencak Silat</span>
                            </label>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-2">Alamat Lengkap</label>
                        <textarea
                            name="alamat"
                            rows="3"
                            placeholder="Jl. Contoh No. 123..."
                            required
                            value={formData.alamat}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-green-500"
                        ></textarea>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-green-600 text-white font-bold rounded-2xl shadow-lg hover:bg-green-700 transition flex items-center justify-center gap-2"
                    >
                        <Save className="w-5 h-5" />
                        {loading ? 'Sedang Menyimpan...' : 'SIMPAN DATA KE SUPABASE'}
                    </button>
                </form>
            </div>
        </section>
    );
};

export default RegistrationForm;
