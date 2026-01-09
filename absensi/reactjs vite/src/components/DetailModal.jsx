import React, { useState, useEffect } from 'react';

const DetailModal = ({ santri, onClose, supabaseClient, onUpdate }) => {
    const [fotoUrl, setFotoUrl] = useState('https://via.placeholder.com/150');
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        nama_lengkap: '',
        nama_ayah: '',
        tanggal_lahir: '',
        no_hp: '',
        alamat: '',
        ikut_silat: false,
        deskripsi: ''
    });

    useEffect(() => {
        if (santri) {
            setFormData({
                nama_lengkap: santri.nama_lengkap || '',
                nama_ayah: santri.nama_ayah || '',
                tanggal_lahir: santri.tanggal_lahir || '',
                no_hp: santri.no_hp || '',
                alamat: santri.alamat || '',
                ikut_silat: !!santri.ikut_silat,
                deskripsi: santri.deskripsi || ''
            });

            if (santri.foto_profil) {
                const result = supabaseClient
                    .storage
                    .from('foto-santri')
                    .getPublicUrl(santri.foto_profil);

                if (result.data) {
                    setFotoUrl(result.data.publicUrl);
                }
            } else {
                setFotoUrl('https://via.placeholder.com/150');
            }
        }
    }, [santri, supabaseClient]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const { error } = await supabaseClient
                .from('santri')
                .update(formData)
                .eq('id', santri.id);

            if (error) throw error;

            alert('Data berhasil diperbarui!');
            setIsEditing(false);
            if (onUpdate) onUpdate();
        } catch (error) {
            console.error('Error updating santri:', error);
            alert('Gagal memperbarui data: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm(`Apakah Anda yakin ingin menghapus data "${santri.nama_lengkap}"? Tindakan ini tidak dapat dibatalkan.`)) {
            return;
        }

        setLoading(true);
        try {
            const { error } = await supabaseClient
                .from('santri')
                .delete()
                .eq('id', santri.id);

            if (error) throw error;

            alert('Data berhasil dihapus!');
            if (onUpdate) onUpdate();
            onClose();
        } catch (error) {
            console.error('Error deleting santri:', error);
            alert('Gagal menghapus data: ' + error.message);
        } finally {
            setLoading(false);
        }
    };


    if (!santri) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-red-500"
                >
                    ✕
                </button>
                <div className="text-center">
                    <img
                        src={fotoUrl}
                        className="w-32 h-32 mx-auto rounded-full object-cover border mb-4"
                        alt={santri.nama_lengkap}
                    />
                    <h3 className="text-xl font-bold">{santri.nama_lengkap}</h3>
                    <p className="text-slate-500 text-sm">Gelombang {santri.gelombang_id}</p>
                </div>
                <div className="mt-6 space-y-3 text-sm">
                    {isEditing ? (
                        <>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Nama Lengkap</label>
                                <input
                                    name="nama_lengkap"
                                    value={formData.nama_lengkap}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Nama Ayah</label>
                                <input
                                    name="nama_ayah"
                                    value={formData.nama_ayah}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Tanggal Lahir</label>
                                    <input
                                        type="date"
                                        name="tanggal_lahir"
                                        value={formData.tanggal_lahir}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">No HP</label>
                                    <input
                                        name="no_hp"
                                        value={formData.no_hp}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Alamat</label>
                                <textarea
                                    name="alamat"
                                    value={formData.alamat}
                                    onChange={handleInputChange}
                                    rows="2"
                                    className="w-full px-3 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-green-500"
                                ></textarea>
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="edit-ikut-silat"
                                    name="ikut_silat"
                                    checked={formData.ikut_silat}
                                    onChange={handleInputChange}
                                    className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                />
                                <label htmlFor="edit-ikut-silat" className="font-bold text-slate-700">Ikut Silat</label>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Deskripsi</label>
                                <textarea
                                    name="deskripsi"
                                    value={formData.deskripsi}
                                    onChange={handleInputChange}
                                    rows="2"
                                    className="w-full px-3 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-green-500"
                                ></textarea>
                            </div>
                            <div className="flex gap-2 pt-2">
                                <button
                                    onClick={handleSave}
                                    disabled={loading}
                                    className="flex-1 bg-green-600 text-white font-bold py-2 rounded-xl hover:bg-green-700 disabled:bg-slate-300"
                                >
                                    {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
                                </button>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    disabled={loading}
                                    className="px-4 py-2 border border-slate-200 text-slate-500 font-bold rounded-xl hover:bg-slate-50"
                                >
                                    Batal
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <p><b>Ayah:</b> {santri.nama_ayah}</p>
                            <p><b>Tanggal Lahir:</b> {santri.tanggal_lahir}</p>
                            <p><b>No HP:</b> {santri.no_hp}</p>
                            <p><b>Alamat:</b> {santri.alamat}</p>
                            <p><b>Ikut Silat:</b> {santri.ikut_silat ? 'Ya' : 'Tidak'}</p>
                            <p><b>Deskripsi:</b> {santri.deskripsi}</p>
                            <button
                                onClick={() => setIsEditing(true)}
                                className="w-full mt-4 bg-slate-100 text-slate-600 font-bold py-2 rounded-xl hover:bg-green-50 hover:text-green-600 transition"
                            >
                                Edit Data
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={loading}
                                className="w-full mt-2 bg-white text-red-500 border border-red-100 font-bold py-2 rounded-xl hover:bg-red-50 transition disabled:opacity-50"
                            >
                                {loading ? 'Menghapus...' : 'Hapus Data'}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DetailModal;

