import { EMP_STORAGE_KEY, LEAVE_STORAGE_KEY, GAS_WEB_APP_URL } from "../data/constants";
import { INITIAL_EMPLOYEES } from "../data/initialEmployees";

export function loadInitialData() {
  localStorage.removeItem("sbl_employees_2026");
  localStorage.removeItem("sbl_leaves_2026");

  const savedEmp = localStorage.getItem(EMP_STORAGE_KEY);
  const savedLeaves = localStorage.getItem(LEAVE_STORAGE_KEY);

  const employees = savedEmp ? JSON.parse(savedEmp) : [...INITIAL_EMPLOYEES];
  const leaves = savedLeaves ? JSON.parse(savedLeaves) : [];

  saveAppData(employees, leaves);
  return { employees, leaves };
}

export function saveAppData(employees, leaves) {
  localStorage.setItem(EMP_STORAGE_KEY, JSON.stringify(employees));
  localStorage.setItem(LEAVE_STORAGE_KEY, JSON.stringify(leaves));
}

export async function syncToGoogleAppsScript(action, payloadData) {
  if (!GAS_WEB_APP_URL) return;
  try {
    await fetch(GAS_WEB_APP_URL, {
      method: "POST",
      body: JSON.stringify({ action, data: payloadData })
    });
  } catch (err) {
    console.error("Sinkronisasi GAS Gagal:", err);
  }
}