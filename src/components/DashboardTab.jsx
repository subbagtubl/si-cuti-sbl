import React from "react";

export default function DashboardTab({ currentUser, leaves, setActiveTab }) {
  const isPNS = currentUser.status.includes("PNS");
  const totalAvailable =
    currentUser.kuotaN + (currentUser.kuotaN1 || 0) + (currentUser.kuotaN2 || 0);

  const myLeaves = leaves.filter((l) => l.nik === currentUser.nik);
  const myApproved = myLeaves.filter((l) => l.statusPejabat === "Disetujui");
  const myPending = myLeaves.filter(
    (l) =>
      l.statusAtasan === "Menunggu" ||
      (l.statusAtasan === "Disetujui" && l.statusPejabat === "Menunggu")
  );

  return (
    <section className="space-y-6">
      {/* Banner Regulasi */}
      {isPNS ? (
        <div className="p-4 rounded-2xl border bg-blue-50/90 border-blue-200 text-blue-950 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <i className="fa-solid fa-scale-balanced text-xl text-blue-700 mt-0.5"></i>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-200 text-blue-900">
                Regulasi Aktif: PNS Sentra
              </span>
              <h4 className="font-bold text-sm mt-1">
                Peraturan BKN Nomor 24 Tahun 2017 jo. Nomor 7 Tahun 2021 (Manajemen Cuti PNS)
              </h4>
              <p className="text-xs text-blue-800 mt-0.5">
                Hak cuti meliputi Cuti Tahunan (12 hari kerja + akumulasi sisa N-1), Cuti Sakit, Cuti Melahirkan, Cuti Karena Alasan Penting (CAP), serta{" "}
                {currentUser.masaKerjaTahun >= 5 ? (
                  <strong>Cuti Besar & CLTN (Masa Kerja ≥ 5 Tahun Terpenuhi)</strong>
                ) : (
                  `Cuti Besar/CLTN setelah masa kerja 5 tahun (Masa kerja saat ini: ${currentUser.masaKerja})`
                )}
                .
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-2xl border bg-emerald-50/90 border-emerald-200 text-emerald-950 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <i className="fa-solid fa-file-shield text-xl text-emerald-700 mt-0.5"></i>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-200 text-emerald-900">
                Regulasi Aktif: {currentUser.status}
              </span>
              <h4 className="font-bold text-sm mt-1">
                Peraturan BKN Nomor 7 Tahun 2022 (Tata Cara Pemberian Cuti PPPK)
              </h4>
              <p className="text-xs text-emerald-800 mt-0.5">
                Sesuai PP No. 49/2018 & Perka BKN No. 7/2022, hak cuti PPPK meliputi:{" "}
                <strong>Cuti Tahunan (12 hari kerja)</strong>,{" "}
                <strong>Cuti Sakit (maks 1 bulan / 1,5 bulan gugur kandungan)</strong>,{" "}
                <strong>Cuti Melahirkan (3 bulan anak ke-1 s.d. ke-3)</strong>, dan{" "}
                <strong>Cuti Bersama</strong>.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Kartu Statistik */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400">Hak Cuti Tahunan (N)</span>
            <span className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <i className="fa-solid fa-calendar-check"></i>
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-800">{currentUser.kuotaN}</span>
            <span className="text-xs text-slate-500 font-medium">Hari Kerja (2026)</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-100">
            Sisa N-1: {currentUser.kuotaN1 || 0} Hr | Total Tersedia: {totalAvailable} Hr
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400">Pengajuan Saya</span>
            <span className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <i className="fa-solid fa-file-signature"></i>
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-800">{myLeaves.length}</span>
            <span className="text-xs text-slate-500 font-medium">Permohonan</span>
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-2 pt-2 border-t border-slate-100">
            {myApproved.length} Disetujui Kepala Sentra
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400">Menunggu Verifikasi</span>
            <span className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <i className="fa-solid fa-hourglass-half"></i>
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-800">{myPending.length}</span>
            <span className="text-xs text-slate-500 font-medium">Permohonan Aktif</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-100">
            Proses Kasubbag TU / Kepala Sentra
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400">Unit Kerja</span>
            <span className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <i className="fa-solid fa-building-columns"></i>
            </span>
          </div>
          <div className="mt-3">
            <span className="text-base font-extrabold text-slate-800 block leading-snug">
              Sentra Budi Luhur
            </span>
            <span className="text-xs text-slate-500 font-medium">Kota Banjarbaru</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-100">
            Kementerian Sosial RI
          </p>
        </div>
      </div>

      {/* Identitas & Hierarki Pejabat */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <i className="fa-solid fa-id-badge text-kemensos-navy"></i> Identitas Kepegawaian ASN
            </h3>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                isPNS ? "bg-blue-100 text-blue-800" : "bg-emerald-100 text-emerald-800"
              }`}
            >
              {currentUser.status}
            </span>
          </div>
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-sm">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase">Nama Lengkap</p>
              <p className="font-bold text-slate-800 mt-0.5">{currentUser.nama}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase">NIP / NI PPPK</p>
              <p className="font-bold text-slate-800 font-mono mt-0.5">{currentUser.nip}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase">NIK (Username)</p>
              <p className="font-semibold text-slate-700 font-mono mt-0.5">{currentUser.nik}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase">
                Pangkat / Golongan Ruang
              </p>
              <p className="font-semibold text-slate-700 mt-0.5">{currentUser.pangkat}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-xs text-slate-400 font-semibold uppercase">Jabatan</p>
              <p className="font-bold text-kemensos-navy mt-0.5">{currentUser.jabatan}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase">Masa Kerja</p>
              <p className="font-semibold text-slate-700 mt-0.5">{currentUser.masaKerja}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase">Unit Kerja</p>
              <p className="font-semibold text-slate-700 mt-0.5">Sentra Budi Luhur di Banjarbaru</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase">Email Kedinasan</p>
              <p className="font-medium text-blue-700 mt-0.5 truncate">{currentUser.email}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase">
                No. Handphone / WhatsApp
              </p>
              <p className="font-medium text-slate-700 mt-0.5">{currentUser.hp}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <i className="fa-solid fa-sitemap text-kemensos-navy"></i> Hierarki Pejabat Cuti
              </h3>
            </div>
            <div className="p-5 space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700">
                  Tahap 1 • Pertimbangan Atasan Langsung
                </span>
                <p className="font-bold text-slate-800 text-sm mt-1">Oon Suprihadiono</p>
                <p className="text-slate-600">Kepala Sub Bagian Tata Usaha</p>
                <p className="font-mono text-[11px] text-slate-500 mt-0.5">
                  NIP. 197705092005021001
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800">
                  Tahap 2 • Pejabat Yang Berwenang (PYBMC)
                </span>
                <p className="font-bold text-slate-800 text-sm mt-1">Radna Dewi Sartika</p>
                <p className="text-slate-600">Kepala Sentra Budi Luhur di Banjarbaru</p>
                <p className="font-mono text-[11px] text-slate-500 mt-0.5">
                  NIP. 197502211999032005
                </p>
              </div>
            </div>
          </div>
          <div className="p-4 bg-slate-50 border-t border-slate-200">
            <button
              onClick={() => setActiveTab("ajukan")}
              className="w-full py-2.5 px-4 bg-kemensos-navy hover:bg-kemensos-dark text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-2"
            >
              <i className="fa-solid fa-paper-plane"></i> Buat Pengajuan Cuti Baru
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}