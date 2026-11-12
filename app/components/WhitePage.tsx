import React from "react";

export default function WhitePage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* Header / Nav */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-10 shadow-xs">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-lg">
              Z
            </span>
            <span className="font-semibold text-lg tracking-tight text-slate-900">
              Zenith Life & Wellness
            </span>
          </div>
          <nav className="hidden sm:flex items-center gap-6 text-sm font-medium text-slate-600">
            <a href="#" className="hover:text-teal-600 transition-colors">Beranda</a>
            <a href="#" className="text-teal-600 font-semibold">Kesehatan</a>
            <a href="#" className="hover:text-teal-600 transition-colors">Produktivitas</a>
            <a href="#" className="hover:text-teal-600 transition-colors">Tentang Kami</a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        {/* Breadcrumb & Category */}
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-700 mb-3">
          <span className="bg-teal-100 px-2.5 py-1 rounded-full">Gaya Hidup Sehat</span>
          <span>•</span>
          <span className="text-slate-500">5 Menit Membaca</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight tracking-tight mb-4">
          5 Kunci Menjaga Kebugaran dan Keseimbangan Hidup di Era Digital
        </h1>

        {/* Author / Date info */}
        <div className="flex items-center gap-3 pb-8 border-b border-slate-200 text-sm text-slate-500 mb-8">
          <div className="w-10 h-10 rounded-full bg-slate-300 flex items-center justify-center font-semibold text-slate-700">
            DR
          </div>
          <div>
            <p className="font-medium text-slate-900">Dra. Rina Suryani, M.Psi</p>
            <p className="text-xs text-slate-500">Diperbarui: 12 Maret 2026</p>
          </div>
        </div>

        {/* Article Body */}
        <article className="prose prose-slate max-w-none text-slate-700 space-y-6 leading-relaxed">
          <p className="text-lg text-slate-700 font-normal leading-relaxed">
            Kehidupan modern menuntut kita untuk selalu terhubung dengan layar ponsel dan laptop. 
            Tanpa disadari, pola kerja statis serta paparan notifikasi tanpa henti dapat meningkatkan 
            kelelahan mental dan menurunkan kebugaran fisik. Menemukan ritme hidup yang seimbang adalah 
            investasi jangka panjang bagi kesehatan Anda.
          </p>

          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 pt-2">
            1. Terapkan Aturan 20-20-20 untuk Kesehatan Mata
          </h2>
          <p>
            Menatap layar dalam durasi lama menyebabkan mata tegang dan sakit kepala. Terapkan prinsip 
            sederhana: setiap 20 menit bekerja di depan monitor, alihkan pandangan sejauh 20 kaki (sekitar 6 meter) 
            selama 20 detik. Ini membantu otot mata berelaksasi dan mencegah sindrom kelelahan visual.
          </p>

          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 pt-2">
            2. Prioritaskan Gerak Aktif Ringan Setiap 1 Jam
          </h2>
          <p>
            Duduk lebih dari 6 jam sehari berhubungan erat dengan perlambatan metabolisme. Buat alarm berkala 
            untuk berdiri, meregangkan bahu dan leher, atau berjalan kaki mengambil segelas air putih. 
            Peregangan singkat selama 2 menit sudah cukup untuk memperlancar kembali sirkulasi darah.
          </p>

          <div className="bg-teal-50 border-l-4 border-teal-500 p-4 rounded-r-lg my-6">
            <p className="italic text-teal-900 text-sm m-0">
              "Kesehatan bukan tentang perubahan drastis dalam semalam, melainkan kebiasaan kecil 
              berkelanjutan yang Anda jaga setiap hari."
            </p>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 pt-2">
            3. Hidrasi Cukup dan Batasi Kafein Berlebihan
          </h2>
          <p>
            Seringkali rasa lelah di siang hari disebabkan oleh dehidrasi ringan, bukan kurang tidur. 
            Pastikan asupan air putih minimal 2 liter per hari. Batasi konsumsi minuman berkafein atau manis, 
            terutama di atas jam 3 sore, agar siklus tidur malam tetap optimal.
          </p>

          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 pt-2">
            4. Detoksifikasi Digital Menjelang Tidur
          </h2>
          <p>
            Cahaya biru dari gawai menekan produksi hormon melatonin yang dibutuhkan tubuh untuk tertidur lelap. 
            Biasakan mematikan atau menjauhkan layar dari tempat tidur setidaknya 45 menit sebelum beristirahat. 
            Gantikan aktivitas scrolling media sosial dengan membaca buku fisik atau latihan pernapasan santai.
          </p>

          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 pt-2">
            5. Kelola Stres dengan Mindfulness Sederhana
          </h2>
          <p>
            Luangkan waktu 5 hingga 10 menit setiap pagi untuk duduk tenang tanpa memeriksa surel atau kabar berita. 
            Fokus pada ritme napas dalam. Latihan kesadaran penuh (mindfulness) ini terbukti secara klinis 
            menurunkan hormon kortisol sehingga Anda dapat memulai hari dengan pikiran yang jernih dan fokus.
          </p>

          <div className="border-t border-slate-200 pt-6 mt-8">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Kesimpulan</h3>
            <p className="text-slate-600">
              Menjaga kebugaran tidak harus rumit atau memakan banyak biaya. Dengan konsistensi melakukan 
              kebiasaan baik di atas, tubuh tetap bugar dan produktivitas harian Anda tetap terjaga dengan maksimal.
            </p>
          </div>
        </article>
      </main>

      {/* Footer Legal */}
      <footer className="border-t border-slate-200 bg-white py-10 text-xs text-slate-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Zenith Life & Wellness Portal. Seluruh hak cipta dilindungi.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-slate-800 transition-colors">Kebijakan Privasi</a>
            <span>•</span>
            <a href="#" className="hover:text-slate-800 transition-colors">Syarat & Ketentuan</a>
            <span>•</span>
            <a href="#" className="hover:text-slate-800 transition-colors">Hubungi Kami</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
