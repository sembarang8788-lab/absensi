import React, { useState, useEffect } from 'react';

const DetailModal = ({ santri, onClose, supabaseClient }) => {
    const [fotoUrl, setFotoUrl] = useState('https://via.placeholder.com/150');

    useEffect(() => {
        if (santri && santri.foto_profil) {
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
    }, [santri, supabaseClient]);


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
                <div className="mt-6 space-y-2 text-sm">
                    <p><b>Ayah:</b> {santri.nama_ayah}</p>
                    <p><b>No HP:</b> {santri.no_hp}</p>
                    <p><b>Alamat:</b> {santri.alamat}</p>
                    <p><b>Ikut Silat:</b> {santri.ikut_silat ? 'Ya' : 'Tidak'}</p>
                </div>
            </div>
        </div>
    );
};

export default DetailModal;

