import React, { useState, useEffect } from "react";
import { loadInitialData, saveAppData, syncToGoogleAppsScript } from "./utils/storage";
import LoginScreen from "./components/LoginScreen";
import Navbar from "./components/Navbar";
import DashboardTab from "./components/DashboardTab";
import LeaveFormTab from "./components/LeaveFormTab";
import HistoryTab from "./components/HistoryTab";
import ApprovalTab from "./components/ApprovalTab";
import EmployeeDirTab from "./components/EmployeeDirTab";
import BknPrintModal from "./components/BknPrintModal";

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw5wOKDuV7tz6-zpUSAukQ6PPcON7q4ivZpSHcZoRb-MKFAAowsm9k0sTQRb6ToTCdf/exec";

export default function App() {
  const [employees, setEmployees] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [printItem, setPrintItem] = useState(null);

  useEffect(() => {
    // 1. Muat data awal dari LocalStorage sebagai penampung sementara
    const { employees: initEmp, leaves: initLeaves } = loadInitialData();
    setEmployees(initEmp);
    setLeaves(initLeaves);

    // 2. Tarik Data dari Google Spreadsheet (Google Spreadsheet adalah Master Data Utama)
    const fetchDataFromDrive = async () => {
      try {
        // Ambil Data Pegawai
        const empRes = await fetch(APPS_SCRIPT_URL, {
          method: "POST",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify({ action: "getEmployees" }),
        });
        const empResult = await empRes.json();

        // Ambil Data Riwayat Cuti dari Drive
        const leaveRes = await fetch(APPS_SCRIPT_URL, {
          method: "POST",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify({ action: "getLeaves" }),
        });
        const leaveResult = await leaveRes.json();

        let finalEmp = initEmp;
        let finalLeaves = initLeaves;

        // Jika Google Spreadsheet berhasil diakses, gunakan data dari Spreadsheet secara mutlak
        if (empResult.status === "success" && Array.isArray(empResult.data)) {
          finalEmp = empResult.data;
          setEmployees(finalEmp);
        }

        if (leaveResult.status === "success" && Array.isArray(leaveResult.data)) {
          finalLeaves = leaveResult.data;
          setLeaves(finalLeaves);
        }

        // Sinkronkan LocalStorage browser agar sama persis dengan Google Spreadsheet
        saveAppData(finalEmp, finalLeaves);
        console.log("Data berhasil disinkronkan dari Google Spreadsheet!");
      } catch (error) {
        console.error("Gagal melakukan sinkronisasi dengan Google Drive, menggunakan LocalStorage:", error);
      }
    };

    fetchDataFromDrive();
  }, []);

  const handleAddLeave = async (newLeave) => {
    const updatedLeaves = [newLeave, ...leaves];
    setLeaves(updatedLeaves);
    saveAppData(employees, updatedLeaves);

    await syncToGoogleAppsScript("submitLeave", newLeave);
    await syncToGoogleAppsScript("saveLeaves", updatedLeaves);
    setActiveTab("riwayat");
  };

  const handleProcessApproval = async (leaveId, stage, decision, note) => {
    const updatedLeaves = [...leaves];
    const updatedEmployees = [...employees];
    const idx = updatedLeaves.findIndex((l) => l.id === leaveId);
    if (idx === -1) return;

    if (stage === 1) {
      updatedLeaves[idx].statusAtasan = decision;
      updatedLeaves[idx].catatanAtasan = note;
      if (decision === "Tidak Disetujui") {
        updatedLeaves[idx].statusPejabat = "Tidak Disetujui";
      }
    } else if (stage === 2) {
      updatedLeaves[idx].statusPejabat = decision;
      updatedLeaves[idx].catatanPejabat = note;
      if (decision === "Disetujui" && updatedLeaves[idx].jenisCuti.includes("Cuti Tahunan")) {
        const empIdx = updatedEmployees.findIndex((e) => e.nik === updatedLeaves[idx].nik);
        if (empIdx !== -1) {
          let remainingToDeduct = updatedLeaves[idx].lamaHari;
          if (updatedEmployees[empIdx].kuotaN1 >= remainingToDeduct) {
            updatedEmployees[empIdx].kuotaN1 -= remainingToDeduct;
          } else {
            remainingToDeduct -= updatedEmployees[empIdx].kuotaN1;
            updatedEmployees[empIdx].kuotaN1 = 0;
            updatedEmployees[empIdx].kuotaN = Math.max(
              0,
              updatedEmployees[empIdx].kuotaN - remainingToDeduct
            );
          }
        }
      }
    }

    setLeaves(updatedLeaves);
    setEmployees(updatedEmployees);
    saveAppData(updatedEmployees, updatedLeaves);

    await syncToGoogleAppsScript("saveEmployees", updatedEmployees);
    await syncToGoogleAppsScript("saveLeaves", updatedLeaves);
  };

  const handleUpdateEmployees = (newEmpList) => {
    setEmployees(newEmpList);
    saveAppData(newEmpList, leaves);
    syncToGoogleAppsScript("saveEmployees", newEmpList);
  };

  if (!currentUser) {
    return (
      <LoginScreen
        employees={employees}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          setActiveTab("dashboard");
        }}
      />
    );
  }

  const syncedCurrentUser =
    employees.find((e) => e.nik === currentUser.nik) || currentUser;

  const pendingCount = leaves.filter(
    (l) =>
      (syncedCurrentUser.role === "KASUBBAG_TU" && l.statusAtasan === "Menunggu") ||
      (syncedCurrentUser.role === "KEPALA_SENTRA" &&
        l.statusAtasan === "Disetujui" &&
        l.statusPejabat === "Menunggu")
  ).length;

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <Navbar
        currentUser={syncedCurrentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingCount={pendingCount}
        onLogout={() => setCurrentUser(null)}
      />

      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 space-y-6 no-print">
        {activeTab === "dashboard" && (
          <DashboardTab
            currentUser={syncedCurrentUser}
            leaves={leaves}
            setActiveTab={setActiveTab}
          />
        )}
        {activeTab === "ajukan" && (
          <LeaveFormTab
            currentUser={syncedCurrentUser}
            employees={employees}
            leaves={leaves}
            onAddLeave={handleAddLeave}
            onCancel={() => setActiveTab("dashboard")}
          />
        )}
        {activeTab === "riwayat" && (
          <HistoryTab
            currentUser={syncedCurrentUser}
            leaves={leaves}
            onOpenPrintModal={(item) => setPrintItem(item)}
          />
        )}
        {activeTab === "verifikasi" && (
          <ApprovalTab
            currentUser={syncedCurrentUser}
            leaves={leaves}
            onProcessApproval={handleProcessApproval}
          />
        )}
        {activeTab === "pegawai" && (
          <EmployeeDirTab
            employees={employees}
            onUpdateEmployees={handleUpdateEmployees}
          />
        )}
      </main>

      <BknPrintModal
        item={printItem}
        employees={employees}
        onClose={() => setPrintItem(null)}
      />
    </div>
  );
}