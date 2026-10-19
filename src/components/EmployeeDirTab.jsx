import React, { useState } from "react";
import * as XLSX from "xlsx";

export default function EmployeeDirTab({ employees, onUpdateEmployees }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const handleEditQuota = (emp) => {
    const newN = prompt(`Masukkan jumlah kuota Cuti Tahunan (N) untuk ${emp.nama}:`, emp.kuotaN);
    if (newN === null) return;
    const newN1 = prompt(`Masukkan sisa kuota N-1 untuk ${emp.nama}:`, emp.kuotaN1 || 0);
    if (newN1 === null) return;
    const newN2 = prompt(`Masukkan sisa kuota N-2 untuk ${emp.nama}:`, emp.kuotaN2 || 0);
    if (newN2 === null) return;

    const updated = employees.map((item) => 
      item.nik === emp.nik 
        ? { 
            ...item, 
            kuotaN: parseInt(newN, 10) || 0, 
            kuotaN1: parseInt(newN1, 10) || 0,
            kuotaN2: parseInt(newN2, 10) || 0
          } 
        : item
    );
    onUpdateEmployees(updated);
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
          const mkStr = String(r["MASA KERJA"] || "1 Tahun 0 Bulan");
          const matchYr = mkStr.match(/(\d+)\s*Tahun/i);
          const yrs = matchYr ? parseInt(matchYr[1], 10) : 1;
          const jabatan = String(r["JABATAN"] || "").trim();
          let role = "PEGAWAI";
          if (jabatan === "Kepala") role = "KEPALA_SENTRA";
          else if (jabatan === "Kepala Sub Bagian Tata Usaha") role = "KASUBBAG_TU";

          return {
            no: r["NO"] || i + 1,
            nama: String(r["NAMA"] || "").trim(),
            nip: String(r["NIP"] || "").trim(),
            nik: String(r["NIK/USERNAME"] || "").trim(),
            pangkat: String(r["PANGKAT/ GOLONGAN"] || "").trim(),
            jabatan,
            hp: String(r["NO. HANDPHONE"] || "").trim(),
            email: String(r["EMAIL"] || "").trim(),
            status: String(r["STATUS KEPEGAWAIAN"] || "PNS SENTRA").trim(),
            masaKerja: mkStr,
            masaKerjaTahun: yrs,
            password: String(r["PASSWORD"] || "").trim(),
            role,
            kuotaN: parseInt(r["CUTI N"] || r["N"] || 12, 10),
            kuotaN1: parseInt(r["CUTI N-1"] || r["N-1"] || (String(r["STATUS KEPEGAWAIAN"]).includes("PNS") && yrs >= 2 ? 6 : 0), 10),
            kuotaN2: parseInt(r["CUTI N-2"] || r["N-2"] || 0, 10)
          };
        });

        onUpdateEmployees(parsed);
        alert(`Berhasil memperbarui ${parsed.length} data pegawai dari file Excel.`);
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
            </h3>
            <p className="text-xs text-slate-500">
              Daftar pegawai aktif beserta sisa kuota cuti tahunan berjalan.
            </p>
          </div>

          <label className="cursor-pointer px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm">
            <i className="fa-solid fa-file-import"></i> Import / Perbarui Data Pegawai (.xlsx)
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={importExcelFile}
              className="hidden"
            />
          </label>
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
                        onClick={() => handleEditQuota(emp)}
                        className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-[11px] inline-flex items-center gap-1 shadow-sm"
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
    </section>
  );
}