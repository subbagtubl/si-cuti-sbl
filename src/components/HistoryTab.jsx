import React from "react";
import * as XLSX from "xlsx";
import { formatDateIndo } from "../utils/dateHelper";

export function StatusBadge({ status }) {
  if (status === "Disetujui")
    return (
      <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">
        <i className="fa-solid fa-check mr-1"></i>Disetujui
      </span>
    );
  if (status === "Perubahan")
    return (
      <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 font-bold text-[11px]">
        <i className="fa-solid fa-pen mr-1"></i>Perubahan
      </span>
    );
  if (status === "Ditangguhkan")
    return (
      <span className="px-2.5 py-1 rounded-full bg-purple-100 text-purple-800 font-bold text-[11px]">
        <i className="fa-solid fa-pause mr-1"></i>Ditangguhkan
      </span>
    );
  if (status === "Tidak Disetujui")
    return (
      <span className="px-2.5 py-1 rounded-full bg-red-100 text-red-800 font-bold text-[11px]">
        <i className="fa-solid fa-xmark mr-1"></i>Tidak Disetujui
      </span>
    );
  return (
    <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-bold text-[11px]">
      <i className="fa-solid fa-clock mr-1"></i>Menunggu
    </span>
  );
}

export default function HistoryTab({ currentUser, leaves, onOpenPrintModal }) {
  const isPimpinan =
    currentUser.role === "KASUBBAG_TU" || currentUser.role === "KEPALA_SENTRA";
  const visibleLeaves = isPimpinan
    ? leaves
    : leaves.filter((l) => l.nik === currentUser.nik);

  const exportLeavesToExcel = () => {
    if (leaves.length === 0) {
      alert("Belum ada data pengajuan cuti untuk diekspor.");
      return;
    }
    const exportData = leaves.map((l, idx) => ({
      No: idx + 1,
      "Nomor Surat": l.noSurat,
      "Tanggal Pengajuan": l.tglPengajuan,
      "Nama Pegawai": l.nama,
      "NIP / NI PPPK": l.nip,
      NIK: l.nik,
      Jabatan: l.jabatan,
      "Status Kepegawaian": l.statusPegawai,
      "Jenis Cuti": l.jenisCuti,
      "Tanggal Mulai": l.tglMulai,
      "Tanggal Selesai": l.tglSelesai,
      "Lama (Hari Kerja)": l.lamaHari,
      Alasan: l.alasan,
      "Pegawai Pengganti": l.pengganti,
      "Pertimbangan Kasubbag TU": l.statusAtasan,
      "Keputusan Kepala Sentra": l.statusPejabat
    }));
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "RekapCutiSentraBudiLuhur");
    XLSX.writeFile(wb, "Rekap_Cuti_Sentra_Budi_Luhur_2026.xlsx");
  };

  return (
    <section className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
              <i className="fa-solid fa-clock-rotate-left text-kemensos-navy"></i> Riwayat Pengajuan Cuti & Cetak Formulir BKN
            </h3>
            <p className="text-xs text-slate-500">
              Klik tombol <strong>"Cetak Form BKN"</strong> pada permohonan yang telah diajukan untuk mengunduh/mencetak formulir resmi.
            </p>
          </div>
          {isPimpinan && (
            <button
              onClick={exportLeavesToExcel}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
            >
              <i className="fa-solid fa-file-excel"></i> Export Rekap Cuti (.xlsx)
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-600 uppercase font-bold border-b border-slate-200">
                <th className="py-3.5 px-4">No. Surat / Tgl Pengajuan</th>
                <th className="py-3.5 px-4">Pegawai Pemohon</th>
                <th className="py-3.5 px-4">Jenis Cuti</th>
                <th className="py-3.5 px-4">Tanggal & Durasi</th>
                <th className="py-3.5 px-4">Tahap I (Kasubbag TU)</th>
                <th className="py-3.5 px-4">Tahap II (Kepala Sentra)</th>
                <th className="py-3.5 px-4 text-center">Formulir Resmi BKN</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {visibleLeaves.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400 text-xs">
                    <i className="fa-solid fa-folder-open text-2xl mb-2 block text-slate-300"></i>
                    Belum ada riwayat pengajuan cuti.
                  </td>
                </tr>
              ) : (
                visibleLeaves.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition">
                    <td className="py-3.5 px-4 font-mono text-[11px]">
                      <div className="font-bold text-slate-800">{item.noSurat}</div>
                      <div className="text-slate-500">
                        Tgl Pengajuan: {formatDateIndo(item.tglPengajuan)}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-800">{item.nama}</div>
                      <div className="text-[11px] text-slate-500">
                        {item.jabatan} • <span className="font-semibold">{item.statusPegawai}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-kemensos-navy">{item.jenisCuti}</span>
                      <div className="text-[11px] text-slate-500 truncate max-w-[180px]">
                        {item.alasan}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-800">{item.lamaHari} Hari Kerja</div>
                      <div className="text-[11px] text-slate-500">
                        {formatDateIndo(item.tglMulai)} s.d. {formatDateIndo(item.tglSelesai)}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={item.statusAtasan} />
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={item.statusPejabat} />
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => onOpenPrintModal(item)}
                        className="px-3 py-1.5 rounded-lg bg-kemensos-navy hover:bg-kemensos-dark text-white font-bold text-[11px] inline-flex items-center gap-1.5 shadow-sm"
                      >
                        <i className="fa-solid fa-print text-kemensos-gold"></i> Cetak Form BKN
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}