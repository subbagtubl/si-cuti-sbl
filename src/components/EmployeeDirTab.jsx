import React, { useState } from "react";
import * as XLSX from "xlsx";

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxsmZ-ae-86K3F2GseO1Rc4Ti9pN89WsaXUV-7tXMJ845ziZtVvj9ckMxatw5MEgVY/exec";

export default function EmployeeDirTab({ employees, onUpdateEmployees }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isSaving, setIsSaving] = useState(false);

  // State untuk Modal Edit Kuota
  const [editingEmp, setEditingEmp] = useState(null);
  const [quotaForm, setQuotaForm] = useState({
    kuotaN: 0,
    kuotaN1: 0,
    kuotaN2: 0,
  });

  // Fungsi Sinkronisasi Data ke Google Spreadsheet via Drive
  const saveToGoogleDrive = async (updatedEmployees) => {
    setIsSaving(true);
    try {
      await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          action: "saveEmployees",
          data: updatedEmployees,
        }),
      });
      console.log("Data pegawai berhasil tersimpan ke Google Spreadsheet!");
    } catch (error) {
      console.error("Gagal menyimpan ke Google Drive:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenEditQuota = (emp) => {
    setEditingEmp(emp);
    setQuotaForm({
      kuotaN: emp.kuotaN || 0,
      kuotaN1: emp.kuotaN1 || 0,
      kuotaN2: emp.kuotaN2 || 0,
    });
  };

  const handleSaveQuota = (e) => {
    e.preventDefault();
    if (!editingEmp) return;

    const updated = employees.map((item) =>
      item.nik === editingEmp.nik
        ? {
            ...item,
            kuotaN: parseInt(quotaForm.kuotaN, 10) || 0,
            kuotaN1: parseInt(quotaForm.kuotaN1, 10) || 0,
            kuotaN2: parseInt(quotaForm.kuotaN2, 10) || 0,
          }
        : item
    );

    onUpdateEmployees(updated);
    saveToGoogleDrive(updated);
    setEditingEmp(null);
  };

  const downloadTemplate = () => {
    const exportData =
      employees && employees.length > 0
        ? employees.map((emp) => ({
            "NO": emp.no,
            "NAMA": emp.nama,
            "NIP": emp.nip,
            "NIK/USERNAME": emp.nik,
            "PANGKAT/ GOLONGAN": emp.pangkat,
            "JABATAN": emp.jabatan,
            "NO. HANDPHONE": emp.hp || "",
            "EMAIL": emp.email,
            "STATUS KEPEGAWAIAN": emp.status,
            "MASA KERJA": emp.masaKerja,
            "CUTI N": emp.kuotaN,
            "CUTI N-1": emp.kuotaN1 ?? 0,
            "CUTI N-2": emp.kuotaN2 ?? 0,
          }))
        : [
            {
              "NO": 1,
              "NAMA": "Contoh Nama Pegawai",
              "NIP": "199001012020011001",
              "NIK/USERNAME": "6371050101900001",
              "PANGKAT/ GOLONGAN": "Penata Muda / III/a",
              "JABATAN": "Pengolah Data",
              "NO. HANDPHONE": "081234567890",
              "EMAIL": "contoh@kemensos.go.id",
              "STATUS KEPEGAWAIAN": "PNS SENTRA",
              "MASA KERJA": "5 Tahun 0 Bulan",
              "CUTI N": 12,
              "CUTI N-1": 6,
              "CUTI N-2": 0,
            },
          ];

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data Pegawai");
    XLSX.writeFile(workbook, "Data_Pegawai_Sentra_Budi_Luhur.xlsx");
  };

  const importExcelFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

      if (rows.length > 0) {
        const parsed = rows.map((r, i) => {
          const nik = String(r["NIK/USERNAME"] || "").trim();
          const mkStr = String(r["MASA KERJA"] || "1 Tahun 0 Bulan");
          const matchYr = mkStr.match(/(\d+)\s*Tahun/i);
          const yrs = matchYr ? parseInt(matchYr[1], 10) : 1;
          const jabatan = String(r["JABATAN"] || "").trim();
          let role = "PEGAWAI";
          if (jabatan === "Kepala") role = "KEPALA_SENTRA";
          else if (jabatan === "Kepala Sub Bagian Tata Usaha") role = "KASUBBAG_TU";

          const existingEmp = employees.find((emp) => emp.nik === nik);
          const excelPassword = r["PASSWORD"] !== undefined ? String(r["PASSWORD"]).trim() : "";
          const finalPassword = excelPassword || existingEmp?.password || "";

          const statusKep = String(r["STATUS KEPEGAWAIAN"] || "");
          const defaultN1 = statusKep.includes("PNS") && yrs >= 2 ? 6 : 0;

          const rawN = r["CUTI N"] ?? r["N"] ?? 12;
          const rawN1 = r["CUTI N-1"] ?? r["N-1"] ?? defaultN1;
          const rawN2 = r["CUTI N-2"] ?? r["N-2"] ?? 0;

          return {
            no: r["NO"] || i + 1,
            nama: String(r["NAMA"] || "").trim(),
            nip: String(r["NIP"] || "").trim(),
            nik: nik,
            pangkat: String(r["PANGKAT/ GOLONGAN"] || "").trim(),
            jabatan,
            hp: String(r["NO. HANDPHONE"] || "").trim(),
            email: String(r["EMAIL"] || "").trim(),
            status: String(r["STATUS KEPEGAWAIAN"] || "PNS SENTRA").trim(),
            masaKerja: mkStr,
            masaKerjaTahun: yrs,
            password: finalPassword,
            role,
            kuotaN: isNaN(parseInt(rawN, 10)) ? 12 : parseInt(rawN, 10),
            kuotaN1: isNaN(parseInt(rawN1, 10)) ? 0 : parseInt(rawN1, 10),
            kuotaN2: isNaN(parseInt(rawN2, 10)) ? 0 : parseInt(rawN2, 10),
          };
        });

        onUpdateEmployees(parsed);
        saveToGoogleDrive(parsed);
        alert(`Berhasil memperbarui ${parsed.length} data pegawai dan menyimpannya ke Google Drive.`);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const filtered = employees.filter((e) => {
    const matchStatus = statusFilter === "ALL" || e.status === statusFilter;
    const q = search.toLowerCase();
    const matchText =
      e.nama.toLowerCase().includes(q) ||
      e.nip.toLowerCase().includes(q) ||
      e.nik.toLowerCase().includes(q) ||
      e.jabatan.toLowerCase().includes(q);
    return matchStatus && matchText;
  });

  return (
    <section className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
              <i className="fa-solid fa-users text-kemensos-navy"></i> Data Pegawai Sentra Budi Luhur di Banjarbaru
              {isSaving && (
                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-normal animate-pulse">
                  <i className="fa-solid fa-cloud-arrow-up mr-1"></i> Menyimpan ke Drive...
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-500">
              Daftar pegawai aktif beserta sisa kuota cuti tahunan berjalan.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={downloadTemplate}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <i className="fa-solid fa-file-excel"></i> Unduh Template / Export (.xlsx)
            </button>

            <label className="cursor-pointer px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors">
              <i className="fa-solid fa-file-import"></i> Import / Perbarui Data Pegawai (.xlsx)
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={importExcelFile}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <div className="p-4 bg-white border-b border-slate-200 flex flex-wrap gap-3 items-center justify-between">
          <div className="relative flex-1 min-w-[240px]">
            <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-3 text-slate-400 text-xs"></i>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari Nama, NIP, NIK, atau Jabatan..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 text-xs outline-none focus:border-kemensos-navy"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 outline-none"
          >
            <option value="ALL">Semua Status Kepegawaian</option>
            <option value="PNS SENTRA">PNS SENTRA</option>
            <option value="PPPK SENTRA">PPPK SENTRA</option>
            <option value="PPPK OPTIMALISASI">PPPK OPTIMALISASI</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-600 uppercase font-bold border-b border-slate-200">
                <th className="py-3 px-3">No</th>
                <th className="py-3 px-3">Nama & Email</th>
                <th className="py-3 px-3">NIP / NI PPPK</th>
                <th className="py-3 px-3">NIK</th>
                <th className="py-3 px-3">Pangkat / Gol</th>
                <th className="py-3 px-3">Jabatan</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Masa Kerja</th>
                <th className="py-3 px-3 text-center">Sisa Cuti (N, N-1, N-2)</th>
                <th className="py-3 px-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.map((emp) => {
                const isPns = emp.status.includes("PNS");
                return (
                  <tr key={emp.nik} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-bold text-slate-500">{emp.no}</td>
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-slate-800">{emp.nama}</div>
                      <div className="text-[11px] text-blue-600">{emp.email}</div>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[11px]">{emp.nip}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-700">{emp.nik}</td>
                    <td className="py-2.5 px-3">{emp.pangkat}</td>
                    <td className="py-2.5 px-3 max-w-[220px]">{emp.jabatan}</td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isPns ? "bg-blue-100 text-blue-800" : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {emp.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">{emp.masaKerja}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="font-bold text-slate-800">N: {emp.kuotaN} Hr</span>
                      <br />
                      <span className="text-[11px] text-slate-500">N-1: {emp.kuotaN1 || 0} Hr</span>
                      {emp.kuotaN2 > 0 && (
                        <>
                          <br />
                          <span className="text-[11px] text-slate-400">N-2: {emp.kuotaN2} Hr</span>
                        </>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <button
                        onClick={() => handleOpenEditQuota(emp)}
                        className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-[11px] inline-flex items-center gap-1 shadow-sm transition-colors"
                        title="Edit Kuota Cuti N, N-1 & N-2"
                      >
                        <i className="fa-solid fa-pen-to-square"></i> Edit Kuota
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Edit Kuota */}
      {editingEmp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden transform transition-all">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
                  <i className="fa-solid fa-pen-to-square text-base"></i>
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Edit Kuota Cuti</h4>
                  <p className="text-xs text-slate-500 font-medium">{editingEmp.nama}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingEmp(null)}
                className="text-slate-400 hover:text-slate-600 w-8 h-8 rounded-lg hover:bg-slate-200/60 flex items-center justify-center transition-colors"
              >
                <i className="fa-solid fa-xmark text-sm"></i>
              </button>
            </div>

            <form onSubmit={handleSaveQuota}>
              <div className="p-6 space-y-4">
                <div className="bg-amber-50 border border-amber-200/70 rounded-xl p-3 text-xs text-amber-900 flex items-start gap-2.5">
                  <i className="fa-solid fa-circle-info text-amber-600 text-sm mt-0.5"></i>
                  <div>
                    Sesuaikan sisa alokasi kuota cuti tahun berjalan (<strong>N</strong>) serta sisa tahun sebelumnya (<strong>N-1</strong> & <strong>N-2</strong>).
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                      Cuti N (Hari)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={quotaForm.kuotaN}
                      onChange={(e) =>
                        setQuotaForm({ ...quotaForm, kuotaN: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                      Cuti N-1 (Hari)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={quotaForm.kuotaN1}
                      onChange={(e) =>
                        setQuotaForm({ ...quotaForm, kuotaN1: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                      Cuti N-2 (Hari)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={quotaForm.kuotaN2}
                      onChange={(e) =>
                        setQuotaForm({ ...quotaForm, kuotaN2: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditingEmp(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200/70 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-colors"
                >
                  <i className="fa-solid fa-check"></i> Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}