import { NATIONAL_HOLIDAYS_2026 } from "../data/constants";

export function formatDateIndo(isoStr) {
  if (!isoStr) return "-";
  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  const parts = isoStr.split("-");
  if (parts.length !== 3) return isoStr;
  return `${parseInt(parts[2], 10)} ${months[parseInt(parts[1], 10) - 1]} ${parts[0]}`;
}

export function getWorkingDaysCalculation(startStr, endStr) {
  if (!startStr || !endStr) {
    return { workingDays: 0, weekendDays: 0, holidayDays: 0, isValid: false };
  }

  const start = new Date(startStr);
  const end = new Date(endStr);

  if (end < start) {
    return { workingDays: -1, weekendDays: 0, holidayDays: 0, isValid: false };
  }

  let workingDays = 0;
  let weekendDays = 0;
  let holidayDays = 0;
  let cur = new Date(start);

  while (cur <= end) {
    const dayOfWeek = cur.getDay();
    const isoDate = cur.toISOString().split("T")[0];
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      weekendDays++;
    } else if (NATIONAL_HOLIDAYS_2026.includes(isoDate)) {
      holidayDays++;
    } else {
      workingDays++;
    }
    cur.setDate(cur.getDate() + 1);
  }

  return { workingDays, weekendDays, holidayDays, isValid: workingDays > 0 };
}