import React from "react";

export default function Navbar({
  currentUser,
  activeTab,
  setActiveTab,
  pendingCount,
  onOpenPasswordModal,
  onLogout
}) {
  const isPimpinan =
    currentUser.role === "KASUBBAG_TU" || currentUser.role === "KEPALA_SENTRA";

  const getTabClass = (tabId) => {
    const base =
      "px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition flex items-center gap-2";
    return activeTab === tabId
      ? `${base} bg-kemensos-gold text-slate-950 shadow`
      : `${base} text-blue-100 hover:bg-white/10`;
  };

  return (
    <header className="bg-kemensos-navy text-white shadow-md sticky top-0 z-30 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-kemensos-gold/20 border border-kemensos-gold flex items-center justify-center">
            <i className="fa-solid fa-landmark text-kemensos-gold"></i>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-tight text-base">SI-CUTI</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-kemensos-gold text-kemensos-dark font-extrabold uppercase">
                Sentra Budi Luhur
              </span>
            </div>
            <p className="text-[11px] text-blue-200 hidden sm:block">
              Kementerian Sosial RI — Kota Banjarbaru
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden md:block">
            <div className="text-sm font-bold leading-none">{currentUser.nama}</div>
            <div className="text-[11px] text-kemensos-goldlight mt-1">
              {currentUser.jabatan} • {currentUser.status}
            </div>
          </div>
          <button
            onClick={onOpenPasswordModal}
            className="p-2 px-3 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition flex items-center gap-1.5"
          >
            <i className="fa-solid fa-key"></i>
            <span className="hidden sm:inline">Ubah Password</span>
          </button>
          <button
            onClick={onLogout}
            className="p-2 px-3 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition flex items-center gap-1.5"
          >
            <i className="fa-solid fa-power-off"></i>
            <span>Keluar</span>
          </button>
        </div>
      </div>

      <div className="bg-kemensos-dark/80 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex overflow-x-auto gap-1 py-1.5">
          <button onClick={() => setActiveTab("dashboard")} className={getTabClass("dashboard")}>
            <i className="fa-solid fa-chart-pie"></i> Dashboard & Profil
          </button>
          <button onClick={() => setActiveTab("ajukan")} className={getTabClass("ajukan")}>
            <i className="fa-solid fa-file-circle-plus"></i> Ajukan Cuti Baru
          </button>
          <button onClick={() => setActiveTab("riwayat")} className={getTabClass("riwayat")}>
            <i className="fa-solid fa-clock-rotate-left"></i> Riwayat & Cetak Formulir BKN
          </button>

          {isPimpinan && (
            <>
              <button
                onClick={() => setActiveTab("verifikasi")}
                className={getTabClass("verifikasi")}
              >
                <i className="fa-solid fa-user-check"></i> Verifikasi & Persetujuan Cuti
                <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-950 text-[10px] font-extrabold">
                  {pendingCount}
                </span>
              </button>
              <button onClick={() => setActiveTab("pegawai")} className={getTabClass("pegawai")}>
                <i className="fa-solid fa-users-gear"></i> Data Pegawai & Admin
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}