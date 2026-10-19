import React from "react";
import { formatDateIndo } from "../utils/dateHelper";

export default function BknPrintModal({ item, employees, onClose }) {
  if (!item) return null;

  // Cari data master pegawai berdasarkan NIK atau NIP
  const emp = employees.find(
    (e) => String(e.nik).trim() === String(item.nik).trim() || 
           String(e.nip).trim() === String(item.nip).trim()
  ) || {};

  // Prioritaskan data dari item, jika kosong ambil dari master data pegawai (emp)
  const pangkat = item.pangkat || emp.pangkat || "";
  const masaKerja = item.masaKerja || emp.masaKerja || "-";

  const isPNS = item.statusPegawai ? item.statusPegawai.includes("PNS") : true;
  const lampiranTitle = isPNS
    ? "ANAK LAMPIRAN 1.b PERATURAN BADAN KEPEGAWAIAN NEGARA REPUBLIK INDONESIA NOMOR 24 TAHUN 2017 JO. NOMOR 7 TAHUN 2021"
    : "LAMPIRAN PERATURAN BADAN KEPEGAWAIAN NEGARA REPUBLIK INDONESIA NOMOR 7 TAHUN 2022 (TATA CARA PEMBERIAN CUTI PPPK)";

  const check = (type) =>
    item.jenisCuti && item.jenisCuti.toLowerCase().includes(type.toLowerCase()) ? "✓" : "";
  const checkDec = (currentVal, targetVal) => (currentVal === targetVal ? "✓" : "");

  const renderFormDocument = () => (
    <div className="bkn-document-root" style={{ width: "100%", fontFamily: "Arial, sans-serif", fontSize: "8pt", color: "#000", lineHeight: "1.15" }}>
      {/* CSS Khusus Mode Cetak A4 1 Halaman */}
      <style>{`
        @page {
          size: A4 portrait;
          margin: 8mm 10mm;
        }
        @media print {
          body * {
            visibility: hidden !important;
          }
          #bkn-print-area, #bkn-print-area * {
            visibility: visible !important;
          }
          #bkn-print-area {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            background: #fff !important;
          }
          .bkn-table {
            border-collapse: collapse !important;
            width: 100% !important;
            margin-bottom: 4px !important;
            page-break-inside: avoid !important;
          }
          .bkn-table td, .bkn-table th {
            border: 1px solid #000 !important;
            padding: 2px 4px !important;
            font-size: 7.5pt !important;
          }
        }
        .bkn-table {
          border-collapse: collapse;
          width: 100%;
          margin-bottom: 5px;
        }
        .bkn-table td, .bkn-table th {
          border: 1px solid #000;
          padding: 2px 4px;
          font-size: 8pt;
        }
      `}</style>

      <div style={{ fontSize: "7pt", textAlign: "right", marginBottom: "4px", fontWeight: "bold" }}>
        {lampiranTitle}
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "6px" }}>
        <div style={{ width: "50%", fontSize: "8.5pt" }}>
          Banjarbaru, {formatDateIndo(item.tglPengajuan)}
          <br />
          Kepada
          <br />
          Yth. Kepala Sentra Budi Luhur di Banjarbaru
          <br />
          di -<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Banjarbaru
        </div>
      </div>

      <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "9.5pt", marginBottom: "1px", textDecoration: "underline" }}>
        FORMULIR PERMINTAAN DAN PEMBERIAN CUTI
      </div>
      <div style={{ textAlign: "center", fontSize: "8.5pt", fontWeight: "bold", marginBottom: "5px" }}>
        Nomor : {item.noSurat}
      </div>

      {/* BLOK I */}
      <table className="bkn-table">
        <tbody>
          <tr>
            <td colSpan={4} style={{ fontWeight: "bold", backgroundColor: "#f8fafc" }}>
              I. DATA PEGAWAI
            </td>
          </tr>
          <tr>
            <td style={{ width: "15%" }}>Nama</td>
            <td style={{ width: "40%", fontWeight: "bold" }}>{item.nama}</td>
            <td style={{ width: "15%" }}>{isPNS ? "NIP" : "NI PPPK"}</td>
            <td style={{ width: "30%" }}>{item.nip}</td>
          </tr>
          <tr>
            <td>Jabatan</td>
            <td>
              {item.jabatan || emp.jabatan}{pangkat ? ` (${pangkat})` : ""}
            </td>
            <td>Masa Kerja</td>
            <td>{masaKerja}</td>
          </tr>
          <tr>
            <td>Unit Kerja</td>
            <td colSpan={3}>
              Sentra Budi Luhur di Banjarbaru — Kementerian Sosial Republik Indonesia
            </td>
          </tr>
        </tbody>
      </table>

      {/* BLOK II */}
      <table className="bkn-table">
        <tbody>
          <tr>
            <td colSpan={4} style={{ fontWeight: "bold", backgroundColor: "#f8fafc" }}>
              II. JENIS CUTI YANG DIAMBIL **
            </td>
          </tr>
          <tr>
            <td style={{ width: "40%" }}>1. Cuti Tahunan</td>
            <td style={{ width: "10%", textAlign: "center", fontWeight: "bold" }}>
              {check("Cuti Tahunan")}
            </td>
            <td style={{ width: "40%" }}>2. Cuti Besar</td>
            <td style={{ width: "10%", textAlign: "center", fontWeight: "bold" }}>
              {check("Cuti Besar")}
            </td>
          </tr>
          <tr>
            <td>3. Cuti Sakit</td>
            <td style={{ textAlign: "center", fontWeight: "bold" }}>{check("Cuti Sakit")}</td>
            <td>4. Cuti Melahirkan</td>
            <td style={{ textAlign: "center", fontWeight: "bold" }}>
              {check("Cuti Melahirkan")}
            </td>
          </tr>
          <tr>
            <td>5. Cuti Karena Alasan Penting</td>
            <td style={{ textAlign: "center", fontWeight: "bold" }}>
              {check("Alasan Penting")}
            </td>
            <td>6. Cuti di Luar Tanggungan Negara</td>
            <td style={{ textAlign: "center", fontWeight: "bold" }}>
              {check("Luar Tanggungan")}
            </td>
          </tr>
        </tbody>
      </table>

      {/* BLOK III */}
      <table className="bkn-table">
        <tbody>
          <tr>
            <td style={{ fontWeight: "bold", backgroundColor: "#f8fafc" }}>III. ALASAN CUTI</td>
          </tr>
          <tr>
            <td>
              {item.alasan} (Pelimpahan Tugas: {item.pengganti})
            </td>
          </tr>
        </tbody>
      </table>

      {/* BLOK IV */}
      <table className="bkn-table">
        <tbody>
          <tr>
            <td colSpan={6} style={{ fontWeight: "bold", backgroundColor: "#f8fafc" }}>
              IV. LAMANYA CUTI
            </td>
          </tr>
          <tr>
            <td style={{ width: "12%" }}>Selama</td>
            <td style={{ width: "22%", fontWeight: "bold" }}>{item.lamaHari} (Hari Kerja)</td>
            <td style={{ width: "16%" }}>mulai tanggal</td>
            <td style={{ width: "20%", fontWeight: "bold" }}>
              {formatDateIndo(item.tglMulai)}
            </td>
            <td style={{ width: "6%", textAlign: "center" }}>s/d</td>
            <td style={{ width: "24%", fontWeight: "bold" }}>
              {formatDateIndo(item.tglSelesai)}
            </td>
          </tr>
        </tbody>
      </table>

      {/* BLOK V */}
      <table className="bkn-table">
        <tbody>
          <tr>
            <td colSpan={5} style={{ fontWeight: "bold", backgroundColor: "#f8fafc" }}>
              V. CATATAN CUTI ***
            </td>
          </tr>
          <tr>
            <td colSpan={3} style={{ width: "48%", fontWeight: "bold" }}>
              1. CUTI TAHUNAN
            </td>
            <td style={{ width: "37%" }}>2. CUTI BESAR</td>
            <td style={{ width: "15%", textAlign: "center" }}>{check("Cuti Besar")}</td>
          </tr>
          <tr>
            <td style={{ width: "12%", textAlign: "center", fontWeight: "bold" }}>Tahun</td>
            <td style={{ width: "12%", textAlign: "center", fontWeight: "bold" }}>Sisa</td>
            <td style={{ width: "24%", textAlign: "center", fontWeight: "bold" }}>
              Keterangan
            </td>
            <td>3. CUTI SAKIT</td>
            <td style={{ textAlign: "center" }}>{check("Cuti Sakit")}</td>
          </tr>
          <tr>
            <td style={{ textAlign: "center" }}>N-2 (2024)</td>
            <td style={{ textAlign: "center" }}>{emp.kuotaN2 || 0}</td>
            <td>Hari Kerja</td>
            <td>4. CUTI MELAHIRKAN</td>
            <td style={{ textAlign: "center" }}>{check("Cuti Melahirkan")}</td>
          </tr>
          <tr>
            <td style={{ textAlign: "center" }}>N-1 (2025)</td>
            <td style={{ textAlign: "center" }}>{emp.kuotaN1 || 0}</td>
            <td>Hari Kerja</td>
            <td>5. CUTI KARENA ALASAN PENTING</td>
            <td style={{ textAlign: "center" }}>{check("Alasan Penting")}</td>
          </tr>
          <tr>
            <td style={{ textAlign: "center" }}>N (2026)</td>
            <td style={{ textAlign: "center", fontWeight: "bold" }}>{emp.kuotaN ?? 12}</td>
            <td>Hari Kerja</td>
            <td>6. CUTI DI LUAR TANGGUNGAN NEGARA</td>
            <td style={{ textAlign: "center" }}>{check("Luar Tanggungan")}</td>
          </tr>
        </tbody>
      </table>

      {/* BLOK VI */}
      <table className="bkn-table">
        <tbody>
          <tr>
            <td colSpan={3} style={{ fontWeight: "bold", backgroundColor: "#f8fafc" }}>
              VI. ALAMAT SELAMA MENJALANKAN CUTI
            </td>
          </tr>
          <tr>
            <td style={{ width: "55%" }} rowSpan={2}>
              {item.alamat}
            </td>
            <td style={{ width: "12%" }}>TELP / WA</td>
            <td style={{ width: "33%", fontWeight: "bold" }}>{item.telp}</td>
          </tr>
          <tr>
            <td colSpan={2} style={{ textAlign: "center", paddingTop: "4px" }}>
              Hormat saya,
              <br />
              <br />
              <br />
              <span style={{ fontWeight: "bold", textDecoration: "underline" }}>
                {item.nama}
              </span>
              <br />
              {isPNS ? "NIP." : "NI PPPK."} {item.nip}
            </td>
          </tr>
        </tbody>
      </table>

      {/* BLOK VII */}
      <table className="bkn-table">
        <tbody>
          <tr>
            <td colSpan={4} style={{ fontWeight: "bold", backgroundColor: "#f8fafc" }}>
              VII. PERTIMBANGAN ATASAN LANGSUNG **
            </td>
          </tr>
          <tr style={{ textAlign: "center", fontWeight: "bold" }}>
            <td style={{ width: "22%" }}>DISETUJUI</td>
            <td style={{ width: "23%" }}>PERUBAHAN ****</td>
            <td style={{ width: "25%" }}>DITANGGUHKAN ****</td>
            <td style={{ width: "30%" }}>TIDAK DISETUJUI ****</td>
          </tr>
          <tr style={{ textAlign: "center", height: "18px", fontWeight: "bold" }}>
            <td>{checkDec(item.statusAtasan, "Disetujui")}</td>
            <td>{checkDec(item.statusAtasan, "Perubahan")}</td>
            <td>{checkDec(item.statusAtasan, "Ditangguhkan")}</td>
            <td>{checkDec(item.statusAtasan, "Tidak Disetujui")}</td>
          </tr>
          <tr>
            <td colSpan={3} style={{ fontSize: "7.5pt" }}>
              <strong>Catatan Pertimbangan:</strong>
              <br />
              {item.catatanAtasan || "-"}
            </td>
            <td style={{ textAlign: "center", paddingTop: "4px" }}>
              Kepala Sub Bagian Tata Usaha,
              <br />
              <br />
              <br />
              <span style={{ fontWeight: "bold", textDecoration: "underline" }}>
                Oon Suprihadiono
              </span>
              <br />
              NIP. 197705092005021001
            </td>
          </tr>
        </tbody>
      </table>

      {/* BLOK VIII */}
      <table className="bkn-table">
        <tbody>
          <tr>
            <td colSpan={4} style={{ fontWeight: "bold", backgroundColor: "#f8fafc" }}>
              VIII. KEPUTUSAN PEJABAT YANG BERWENANG MEMBERIKAN CUTI **
            </td>
          </tr>
          <tr style={{ textAlign: "center", fontWeight: "bold" }}>
            <td style={{ width: "22%" }}>DISETUJUI</td>
            <td style={{ width: "23%" }}>PERUBAHAN ****</td>
            <td style={{ width: "25%" }}>DITANGGUHKAN ****</td>
            <td style={{ width: "30%" }}>TIDAK DISETUJUI ****</td>
          </tr>
          <tr style={{ textAlign: "center", height: "18px", fontWeight: "bold" }}>
            <td>{checkDec(item.statusPejabat, "Disetujui")}</td>
            <td>{checkDec(item.statusPejabat, "Perubahan")}</td>
            <td>{checkDec(item.statusPejabat, "Ditangguhkan")}</td>
            <td>{checkDec(item.statusPejabat, "Tidak Disetujui")}</td>
          </tr>
          <tr>
            <td colSpan={3} style={{ fontSize: "7.5pt" }}>
              <strong>Catatan Keputusan Pejabat Berwenang:</strong>
              <br />
              {item.catatanPejabat || "-"}
            </td>
            <td style={{ textAlign: "center", paddingTop: "4px" }}>
              Kepala Sentra Budi Luhur di Banjarbaru,
              <br />
              <br />
              <br />
              <span style={{ fontWeight: "bold", textDecoration: "underline" }}>
                Radna Dewi Sartika
              </span>
              <br />
              NIP. 197502211999032005
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/75 z-50 overflow-y-auto p-4 sm:p-6 no-print">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden my-4">
          <div className="px-6 py-4 bg-kemensos-navy text-white flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm sm:text-base flex items-center gap-2">
                <i className="fa-solid fa-print text-kemensos-gold"></i> Pratinjau Formulir Permintaan dan Pemberian Cuti Resmi BKN
              </h3>
              <p className="text-[11px] text-blue-200">
                Sesuai Anak Lampiran 1.b Peraturan BKN No. 24 Tahun 2017 jo. Perka BKN No. 7 Tahun 2021 / No. 7 Tahun 2022
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-kemensos-gold hover:bg-amber-400 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 shadow"
              >
                <i className="fa-solid fa-print"></i> Cetak / Simpan PDF
              </button>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
          </div>

          <div className="p-6 sm:p-10 bg-slate-100 overflow-x-auto">
            <div className="bg-white mx-auto p-6 shadow border border-slate-300 max-w-[210mm] text-black">
              {renderFormDocument()}
            </div>
          </div>
        </div>
      </div>

      <div id="bkn-print-area" className="hidden print:block">
        {renderFormDocument()}
      </div>
    </>
  );
}