import React, { useState } from "react";

export default function LoginScreen({ employees, onLoginSuccess }) {
  const [nik, setNik] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const found = employees.find(
      (emp) => emp.nik === nik.trim() && emp.password === password.trim()
    );
    if (!found) {
      setError(true);
      return;
    }
    setError(false);
    onLoginSuccess(found);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-kemensos-dark via-kemensos-navy to-blue-900">
      {/* Panel Kiri: Informasi Instansi & Landasan Hukum */}
      <div className="lg:w-7/12 p-8 lg:p-14 flex flex-col justify-between text-white relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-kemensos-gold/20 border-2 border-kemensos-gold flex items-center justify-center shadow-lg">
              <i className="fa-solid fa-landmark text-2xl text-kemensos-gold"></i>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-kemensos-gold font-bold">
                Kementerian Sosial Republik Indonesia
              </p>
              <h1 className="text-xl lg:text-2xl font-extrabold tracking-tight">
                SENTRA BUDI LUHUR DI BANJARBARU
              </h1>
            </div>
          </div>

          <div className="max-w-2xl mt-6">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-kemensos-gold/20 border border-kemensos-gold/40 text-kemensos-goldlight text-xs font-semibold mb-4">
              <i className="fa-solid fa-scale-balanced"></i> Terintegrasi Regulasi ASN Nasional
            </span>
            <h2 className="text-3xl lg:text-4xl font-extrabold leading-tight mb-4">
              Sistem Informasi Pengajuan & Administrasi Cuti Pegawai (SI-CUTI)
            </h2>
            <p className="text-blue-100/90 text-sm lg:text-base leading-relaxed mb-8">
              Platform digital layanan kepegawaian terpadu untuk pengajuan, verifikasi berjenjang, monitoring kuota, dan pencetakan Formulir Permintaan serta Pemberian Cuti ASN (PNS & PPPK) di lingkungan Sentra Budi Luhur di Banjarbaru.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl p-3.5">
                <div className="font-bold text-kemensos-gold mb-1">
                  <i className="fa-solid fa-gavel mr-1.5"></i> UU No. 20 Tahun 2023 & PP Manajemen ASN
                </div>
                <p className="text-blue-100/80">
                  PP No. 11/2017 jo. PP No. 17/2020 (PNS) serta PP No. 49/2018 (Manajemen PPPK).
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl p-3.5">
                <div className="font-bold text-kemensos-gold mb-1">
                  <i className="fa-solid fa-file-shield mr-1.5"></i> Peraturan BKN RI (PNS & PPPK)
                </div>
                <p className="text-blue-100/80">
                  Perka BKN No. 24/2017 jo. No. 7/2021 (Cuti PNS) & Perka BKN No. 7/2022 (Cuti PPPK).
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl p-3.5 md:col-span-2">
                <div className="font-bold text-kemensos-gold mb-1">
                  <i className="fa-solid fa-sitemap mr-1.5"></i> Permensos RI Nomor 4 Tahun 2022
                </div>
                <p className="text-blue-100/80">
                  Alur persetujuan berjenjang UPT Kemensos: Pemohon{" "}
                  <i className="fa-solid fa-arrow-right mx-1"></i> Kepala Sub Bagian Tata Usaha{" "}
                  <i className="fa-solid fa-arrow-right mx-1"></i> Kepala Sentra Budi Luhur.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-10 pt-6 border-t border-white/15 flex flex-wrap justify-between items-center text-xs text-blue-200 gap-4">
          <span>
            <i className="fa-solid fa-location-dot text-kemensos-gold mr-1.5"></i> Jl. A. Yani Km. 29,6 Landasan Ulin, Kota Banjarbaru, Kalimantan Selatan
          </span>
          <span>Zona Waktu: WITA (UTC+8)</span>
        </div>
      </div>

      {/* Panel Kanan: Form Login Resmi */}
      <div className="lg:w-5/12 bg-white flex flex-col justify-center p-8 lg:p-12 shadow-2xl">
        <div className="max-w-md w-full mx-auto">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-100 text-kemensos-navy text-xs font-bold mb-3">
              <i className="fa-solid fa-shield-halved"></i> Portal Resmi Kepegawaian
            </div>
            <h3 className="text-2xl font-extrabold text-kemensos-navy">Masuk ke Akun SI-CUTI</h3>
            <p className="text-sm text-slate-500 mt-1">
              Masukkan 16 digit <strong>NIK</strong> sebagai Username dan <strong>Password</strong> Anda.
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
              <i className="fa-solid fa-circle-exclamation text-base"></i>
              <span>NIK atau Password yang Anda masukkan tidak sesuai.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Username (NIK 16 Digit)
              </label>
              <div className="relative">
                <i className="fa-solid fa-id-card absolute left-3.5 top-3.5 text-slate-400"></i>
                <input
                  type="text"
                  required
                  maxLength={16}
                  pattern="\d{16}"
                  value={nik}
                  onChange={(e) => setNik(e.target.value)}
                  placeholder="Masukkan 16 digit NIK"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:border-kemensos-navy focus:ring-2 focus:ring-kemensos-navy/20 outline-none text-sm font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Password
              </label>
              <div className="relative">
                <i className="fa-solid fa-lock absolute left-3.5 top-3.5 text-slate-400"></i>
                <input
                  type={showPass ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan Password"
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-300 focus:border-kemensos-navy focus:ring-2 focus:ring-kemensos-navy/20 outline-none text-sm font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
                >
                  <i className={`fa-solid ${showPass ? "fa-eye-slash" : "fa-eye"}`}></i>
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 bg-kemensos-navy hover:bg-kemensos-dark text-white font-bold rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 text-sm"
            >
              <i className="fa-solid fa-right-to-bracket"></i> Masuk Aplikasi
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-200 text-xs text-slate-500 space-y-1.5">
            <p className="font-semibold text-slate-700">
              <i className="fa-solid fa-circle-info text-kemensos-navy mr-1"></i> Informasi Layanan Kepegawaian:
            </p>
            <p>
              Apabila Anda mengalami kendala akses atau lupa kata sandi, silakan menghubungi Sub Bagian Tata Usaha Sentra Budi Luhur di Banjarbaru.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}