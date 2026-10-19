import React, { useState } from "react";
import { KODE_TETAP_CUTI } from "../data/constants";
import { getWorkingDaysCalculation } from "../utils/dateHelper";

export default function LeaveFormTab({
  currentUser,
  employees,
  leaves,
  onAddLeave,
  onCancel
}) {
  const isPNS = currentUser.status.includes("PNS");

  const [noUrutManual, setNoUrutManual] = useState("");
  const [tglPengajuan, setTglPengajuan] = useState("");
  const [jenisCuti, setJenisCuti] = useState("Cuti Tahunan");
  const [pengganti, setPengganti] = useState("");
  const [tglMulai, setTglMulai] = useState("");
  const [tglSelesai, setTglSelesai] = useState("");
  const [alasan, setAlasan] = useState("");
  const [alamat, setAlamat] = useState("");
  const [telp, setTelp] = useState(currentUser.hp || "");
  const [attachmentName, setAttachmentName] = useState("-");
  const [errorMsg, setErrorMsg] = useState("");

  // Hitung nomor surat otomatis
  let bulan = "...";
  let tahun = "....";
  if (tglPengajuan) {
    const parts = tglPengajuan.split("-");
    if (parts.length === 3) {
      tahun = parts[0];
      bulan = String(parseInt(parts[1], 10));
    }
  }
  const suffix = `/${KODE_TETAP_CUTI}/${bulan}/${tahun}`;
  const fullNomor = `${noUrutManual.trim() || "..."}${suffix}`;

  // Hitung hari kerja efektif
  const calc = getWorkingDaysCalculation(tglMulai, tglSelesai);
  const isDocRequired = !jenisCuti.includes("Cuti Tahunan") && jenisCuti !== "Cuti Besar";

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!noUrutManual.trim()) {
      setErrorMsg("Silakan isi Nomor Urut Surat yang didapat dari Ruang Tata Usaha (Contoh: 113).");
      return;
    }
    if (!tglPengajuan) {
      setErrorMsg("Silakan pilih Tanggal Pengajuan Surat terlebih dahulu.");
      return;
    }
    if (calc.workingDays <= 0) {
      setErrorMsg("Rentang tanggal mulai dan selesai cuti tidak valid atau jumlah hari kerja adalah 0.");
      return;
    }
    if (
      (jenisCuti === "Cuti Besar" || jenisCuti === "Cuti di Luar Tanggungan Negara") &&
      currentUser.masaKerjaTahun < 5
    ) {
      setErrorMsg(
        `Ditolak Sistem (PP No. 11/2017 & Perka BKN No. 24/2017): Syarat pengajuan ${jenisCuti} adalah masa kerja minimal 5 Tahun terus-menerus. Masa kerja Anda saat ini adalah ${currentUser.masaKerja}.`
      );
      return;
    }

    const totalAvailableQuota =
      currentUser.kuotaN + (currentUser.kuotaN1 || 0) + (currentUser.kuotaN2 || 0);
    if (jenisCuti === "Cuti Tahunan" && calc.workingDays > totalAvailableQuota) {
      setErrorMsg(
        `Ditolak Sistem: Jumlah hari kerja yang diajukan (${calc.workingDays} hari) melebihi sisa kuota Cuti Tahunan Anda (${totalAvailableQuota} hari).`
      );
      return;
    }
    if (
      jenisCuti.includes("Pengecualian Alasan Penting PPPK") &&
      calc.workingDays > 6
    ) {
      setErrorMsg(
        "Ditolak Sistem (Perka BKN No. 7 Tahun 2022): Cuti Tahunan kondisi darurat/alasan penting bagi PPPK diberikan paling lama 6 (enam) hari kerja."
      );
      return;
    }
    if (!isPNS && jenisCuti === "Cuti Sakit" && calc.workingDays > 30) {
      setErrorMsg(
        "Ditolak Sistem (Perka BKN No. 7 Tahun 2022): Cuti Sakit bagi PPPK diberikan paling lama 1 (satu) bulan atau 30 hari kerja."
      );
      return;
    }

    const isKasubbag =
      currentUser.role === "KASUBBAG_TU" || currentUser.role === "KEPALA_SENTRA";
    const nextId = String(leaves.length + 1).padStart(3, "0");

    const newLeave = {
      id: `CUTI-${tahun}-${nextId}`,
      noUrut: noUrutManual.trim(),
      noSurat: fullNomor,
      tglPengajuan,
      nik: currentUser.nik,
      nama: currentUser.nama,
      nip: currentUser.nip,
      pangkat: currentUser.pangkat,
      jabatan: currentUser.jabatan,
      statusPegawai: currentUser.status,
      masaKerja: currentUser.masaKerja,
      jenisCuti: jenisCuti.replace(" (Pengecualian Alasan Penting PPPK)", ""),
      alasan: alasan.trim(),
      tglMulai,
      tglSelesai,
      lamaHari: calc.workingDays,
      alamat: alamat.trim(),
      telp: telp.trim(),
      pengganti,
      lampiran: attachmentName,
      statusAtasan: isKasubbag ? "Disetujui" : "Menunggu",
      catatanAtasan: isKasubbag ? "Pengajuan langsung Pejabat Struktural" : "",
      statusPejabat: currentUser.role === "KEPALA_SENTRA" ? "Disetujui" : "Menunggu",
      catatanPejabat: ""
    };

    onAddLeave(newLeave);
  };

  return (
    <section className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 bg-kemensos-navy text-white flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="font-bold text-base flex items-center gap-2">
              <i className="fa-solid fa-file-pen text-kemensos-gold"></i> Formulir Pengajuan Cuti Pegawai
            </h3>
            <p className="text-xs text-blue-200">
              Validasi otomatis berdasarkan Status Kepegawaian & Masa Kerja
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-white/15 text-xs font-bold">
            {isPNS
              ? "Regulasi PNS — Perka BKN No. 24/2017 jo. 7/2021"
              : `Regulasi ${currentUser.status} — Perka BKN No. 7/2022`}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {errorMsg && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
              <i className="fa-solid fa-circle-exclamation mr-1.5"></i> {errorMsg}
            </div>
          )}

          {/* Penomoran & Tanggal Pengajuan */}
          <div className="p-5 rounded-2xl bg-amber-50/90 border-2 border-amber-300 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2 border-b border-amber-200 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center text-xs font-bold">
                  <i className="fa-solid fa-file-signature"></i>
                </span>
                <div>
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-950">
                    Penomoran & Tanggal Pengajuan Surat Cuti
                  </h4>
                  <p className="text-[11px] text-amber-800">
                    Nomor urut surat diminta secara manual ke Ruang Tata Usaha dan Tanggal Pengajuan diisi mandiri.
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-amber-900 bg-white px-3 py-1 rounded-lg border border-amber-300 font-mono">
                Kode Tetap Cuti: {KODE_TETAP_CUTI}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-2">
                  Nomor Urut Surat (Minta ke Ruang Tata Usaha) <span className="text-red-500">*</span>
                </label>
                <div className="flex items-stretch rounded-xl border border-slate-300 bg-white overflow-hidden focus-within:border-kemensos-navy focus-within:ring-2 focus-within:ring-kemensos-navy/20">
                  <input
                    type="text"
                    required
                    value={noUrutManual}
                    onChange={(e) => setNoUrutManual(e.target.value)}
                    placeholder="Contoh: 113"
                    className="w-32 sm:w-36 px-3.5 py-3 text-sm font-extrabold text-kemensos-navy outline-none border-r border-slate-300 text-center bg-white"
                  />
                  <div className="px-3.5 py-3 bg-slate-100 text-slate-700 font-mono text-xs sm:text-sm font-bold flex items-center select-all">
                    {suffix}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-2">
                  Tanggal Pengajuan Surat (Diisi Manual) <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={tglPengajuan}
                  onChange={(e) => setTglPengajuan(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 bg-white text-sm font-semibold text-slate-800 focus:border-kemensos-navy outline-none"
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white border border-amber-300 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="font-bold text-slate-600">
                <i className="fa-solid fa-eye text-amber-600 mr-1.5"></i>Hasil Nomor Surat Lengkap yang Akan Tercetak:
              </span>
              <span className="font-mono font-extrabold text-sm text-kemensos-navy bg-amber-50 px-3 py-1 rounded-lg border border-amber-200">
                Nomor : {fullNomor}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-2">
                1. Pilih Jenis Cuti <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={jenisCuti}
                onChange={(e) => setJenisCuti(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 bg-white text-sm font-semibold text-slate-800 focus:border-kemensos-navy outline-none"
              >
                {isPNS ? (
                  <>
                    <option value="Cuti Tahunan">
                      1. Cuti Tahunan (Sisa Kuota: {currentUser.kuotaN + currentUser.kuotaN1} Hari Kerja)
                    </option>
                    <option value="Cuti Besar">
                      2. Cuti Besar (Maks 3 Bulan — Syarat Masa Kerja ≥ 5 Tahun)
                    </option>
                    <option value="Cuti Sakit">
                      3. Cuti Sakit (Wajib Lampiran Surat Keterangan Dokter)
                    </option>
                    <option value="Cuti Melahirkan">
                      4. Cuti Melahirkan (3 Bulan — Anak ke-1 s.d. ke-3)
                    </option>
                    <option value="Cuti Karena Alasan Penting">
                      5. Cuti Karena Alasan Penting / CAP (Maks 1 Bulan)
                    </option>
                    <option value="Cuti di Luar Tanggungan Negara">
                      6. Cuti di Luar Tanggungan Negara / CLTN (Syarat MK ≥ 5 Tahun)
                    </option>
                  </>
                ) : (
                  <>
                    <option value="Cuti Tahunan">
                      1. Cuti Tahunan PPPK (Sisa Kuota: {currentUser.kuotaN} Hari Kerja)
                    </option>
                    <option value="Cuti Tahunan (Pengecualian Alasan Penting PPPK)">
                      2. Cuti Tahunan — Kondisi Darurat/Keluarga Inti (Maks 6 Hari - Perka BKN 7/2022)
                    </option>
                    <option value="Cuti Sakit">
                      3. Cuti Sakit PPPK (Maks 30 Hari Kerja / 1,5 Bln Gugur Kandungan)
                    </option>
                    <option value="Cuti Melahirkan">
                      4. Cuti Melahirkan PPPK (3 Bulan — Anak ke-1 s.d. ke-3)
                    </option>
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-2">
                2. Pelimpahan Tugas / Pegawai Pengganti <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={pengganti}
                onChange={(e) => setPengganti(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 bg-white text-sm font-medium text-slate-800 focus:border-kemensos-navy outline-none"
              >
                <option value="">-- Pilih Rekan Kerja Pengganti Sementara --</option>
                {employees
                  .filter((e) => e.nik !== currentUser.nik)
                  .map((e) => (
                    <option key={e.nik} value={`${e.nama} (${e.jabatan})`}>
                      {e.nama} — {e.jabatan}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-2">
                3. Tanggal Mulai Cuti <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                value={tglMulai}
                onChange={(e) => setTglMulai(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 text-sm font-medium focus:border-kemensos-navy outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-2">
                4. Tanggal Selesai Cuti <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                value={tglSelesai}
                onChange={(e) => setTglSelesai(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 text-sm font-medium focus:border-kemensos-navy outline-none"
              />
            </div>
          </div>

          {/* Kalkulator Hari Kerja */}
          <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-200 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                <i className="fa-solid fa-calculator"></i>
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-blue-900">
                  Kalkulasi Hari Kerja Efektif (Diluar Sabtu/Minggu & Libur Nasional)
                </p>
                <p className="text-xs text-blue-700">
                  {calc.workingDays < 0
                    ? "Tanggal selesai tidak boleh lebih awal dari tanggal mulai."
                    : calc.workingDays > 0
                    ? `Total: ${calc.workingDays} Hari Kerja Efektif (Dikecualikan ${calc.weekendDays} hari Sabtu/Minggu & ${calc.holidayDays} hari Libur Nasional).`
                    : "Pilih tanggal mulai dan selesai untuk menghitung otomatis."}
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-2xl font-extrabold text-blue-900">
                {Math.max(0, calc.workingDays)}
              </span>
              <span className="text-xs font-bold text-blue-800 block">Hari Kerja</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-2">
                5. Alasan Cuti Lengkap <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                required
                value={alasan}
                onChange={(e) => setAlasan(e.target.value)}
                placeholder="Tuliskan alasan pengajuan cuti secara jelas..."
                className="w-full p-3 rounded-xl border border-slate-300 text-sm focus:border-kemensos-navy outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-2">
                6. Alamat Lengkap Selama Menjalankan Cuti <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                required
                value={alamat}
                onChange={(e) => setAlamat(e.target.value)}
                placeholder="Jl. ..., Kelurahan, Kecamatan, Kota/Kabupaten..."
                className="w-full p-3 rounded-xl border border-slate-300 text-sm focus:border-kemensos-navy outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-2">
                7. Nomor Telepon / WhatsApp Aktif <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={telp}
                onChange={(e) => setTelp(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 text-sm font-medium focus:border-kemensos-navy outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-2">
                8. Lampiran Dokumen Pendukung (PDF/JPG){" "}
                {isDocRequired && <span className="text-red-500">* (Wajib)</span>}
              </label>
              <input
                type="file"
                required={isDocRequired}
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) =>
                  setAttachmentName(e.target.files?.[0]?.name || "-")
                }
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-slate-50 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-kemensos-navy file:text-white file:font-semibold"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-kemensos-navy hover:bg-kemensos-dark text-white text-xs font-bold shadow-md transition flex items-center gap-2"
            >
              <i className="fa-solid fa-paper-plane"></i> Kirim Permohonan Cuti
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}