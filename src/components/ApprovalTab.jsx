import React from "react";
import { formatDateIndo } from "../utils/dateHelper";
import { StatusBadge } from "./HistoryTab";

export default function ApprovalTab({ currentUser, leaves, onProcessApproval }) {
  const isKasubbag = currentUser.role === "KASUBBAG_TU";
  const isKepala = currentUser.role === "KEPALA_SENTRA";

  const handleDecision = (leaveId, stage, decision) => {
    const note = prompt(
      `Masukkan catatan pertimbangan/keputusan (${decision}):`,
      decision === "Disetujui" ? "Disetujui sesuai ketentuan yang berlaku." : ""
    );
    if (note === null) return;
    onProcessApproval(leaveId, stage, decision, note);
  };

  return (
    <section className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 bg-amber-50 border-b border-amber-200">
          <h3 className="font-bold text-amber-950 text-base flex items-center gap-2">
            <i className="fa-solid fa-file-signature text-amber-600"></i> Panel Verifikasi & Keputusan Pejabat Berwenang
          </h3>
          <p className="text-xs text-amber-800 mt-0.5">
            {isKasubbag
              ? `Anda masuk sebagai ${currentUser.nama} (Kepala Sub Bagian Tata Usaha) — Pejabat Verifikator / Atasan Langsung (Blok VII Form BKN).`
              : `Anda masuk sebagai ${currentUser.nama} (Kepala Sentra Budi Luhur) — Pejabat Yang Berwenang Memberikan Cuti / PYBMC (Blok VIII Form BKN).`}
          </p>
        </div>

        <div className="p-6 space-y-4">
          {leaves.length === 0 ? (
            <div className="py-10 text-center text-slate-400 text-xs">
              <i className="fa-solid fa-inbox text-2xl mb-2 block text-slate-300"></i>
              Belum ada permohonan cuti pegawai yang masuk.
            </div>
          ) : (
            leaves.map((item) => {
              const canApproveTahap1 = isKasubbag && item.statusAtasan === "Menunggu";
              const canApproveTahap2 =
                isKepala &&
                item.statusAtasan === "Disetujui" &&
                item.statusPejabat === "Menunggu";

              return (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
                >
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-kemensos-navy">
                        Nomor : {item.noSurat}
                      </span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-500">
                        Tgl Pengajuan: {formatDateIndo(item.tglPengajuan)}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-bold text-[10px]">
                        {item.statusPegawai}
                      </span>
                    </div>
                    <h4 className="text-sm font-extrabold text-slate-800">
                      {item.nama}{" "}
                      <span className="font-normal text-slate-500">({item.jabatan})</span>
                    </h4>
                    <p className="text-slate-600">
                      <strong>{item.jenisCuti}</strong> selama{" "}
                      <strong>{item.lamaHari} Hari Kerja</strong> (
                      {formatDateIndo(item.tglMulai)} s.d. {formatDateIndo(item.tglSelesai)})
                    </p>
                    <p className="text-slate-500">
                      Alasan: "{item.alasan}" • Pengganti: <strong>{item.pengganti}</strong>
                    </p>
                  </div>

                  <div>
                    {canApproveTahap1 ? (
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          onClick={() => handleDecision(item.id, 1, "Disetujui")}
                          className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
                        >
                          <i className="fa-solid fa-check mr-1"></i>Setujui (Teruskan ke Kepala)
                        </button>
                        <button
                          onClick={() => handleDecision(item.id, 1, "Perubahan")}
                          className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold"
                        >
                          Perubahan
                        </button>
                        <button
                          onClick={() => handleDecision(item.id, 1, "Ditangguhkan")}
                          className="px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold"
                        >
                          Tangguhkan
                        </button>
                        <button
                          onClick={() => handleDecision(item.id, 1, "Tidak Disetujui")}
                          className="px-3 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold"
                        >
                          Tolak
                        </button>
                      </div>
                    ) : canApproveTahap2 ? (
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          onClick={() => handleDecision(item.id, 2, "Disetujui")}
                          className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
                        >
                          <i className="fa-solid fa-stamp mr-1"></i>Setujui & Potong Kuota
                        </button>
                        <button
                          onClick={() => handleDecision(item.id, 2, "Perubahan")}
                          className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold"
                        >
                          Perubahan
                        </button>
                        <button
                          onClick={() => handleDecision(item.id, 2, "Ditangguhkan")}
                          className="px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold"
                        >
                          Tangguhkan
                        </button>
                        <button
                          onClick={() => handleDecision(item.id, 2, "Tidak Disetujui")}
                          className="px-3 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold"
                        >
                          Tolak
                        </button>
                      </div>
                    ) : (
                      <div className="text-right text-xs">
                        <div>
                          Tahap I (Kasubbag TU): <StatusBadge status={item.statusAtasan} />
                        </div>
                        <div className="mt-1.5">
                          Tahap II (Kepala Sentra): <StatusBadge status={item.statusPejabat} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}