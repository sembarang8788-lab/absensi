import Carousel from './Carousel';
import Sponsors from './Sponsors';

const Home = ({ onNavigate }) => {

    return (
        <section id="page-home" className="py-20">
            <div className="max-w-7xl mx-auto px-4 text-center">
                <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-tight">
                    Sistem Informasi
                    <br /><span className="text-green-600">Pencak Silat Dan Kegiatan</span>
                </h1>
                <p className="mt-6 text-slate-600 max-w-xl mx-auto text-lg">
                    Manajemen data santri dan absensi latihan serta kegiatan terpadu Perguruan Chaqqulloh.
                </p>  
                <div className="mt-10 flex flex-wrap justify-center gap-4">
                    <button
                        onClick={() => onNavigate('pendaftaran')}
                        className="bg-green-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:bg-green-700 transition"
                    >
                        Daftar Santri Baru
                    </button>
                    <button
                        onClick={() => onNavigate('admin-dashboard')}
                        className="bg-white text-green-600 border border-green-200 px-8 py-4 rounded-2xl font-bold text-lg shadow-sm hover:bg-green-50 transition"
                    >
                        Kelola Absensi
                    </button>
                </div>

                <div className="mt-4 -mt-6">
                    <Sponsors logos={[ '/public/sponsor-1.jpeg', '/public/sponsor-2.jpeg', '/public/sponsor-3.jpeg', '/public/sponsor-4.jpeg', '/public/sponsor-5.jpeg', '/public/sponsor-6.jpeg', '/public/sponsor-7.jpeg' ]} />
                </div>
                <div className="mt-2 -mt-4">
                    <Sponsors direction="right" logos={[ '/public/sponsor-1.jpeg', '/public/sponsor-2.jpeg', '/public/sponsor-3.jpeg', '/public/sponsor-4.jpeg', '/public/sponsor-5.jpeg', '/public/sponsor-6.jpeg', '/public/sponsor-7.jpeg' ]} />
                </div>
            </div>
        </section>
    );
};

export default Home;
