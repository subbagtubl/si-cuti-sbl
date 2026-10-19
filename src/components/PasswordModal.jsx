import React, { useState } from "react";

export default function PasswordModal({ isOpen, currentUser, onClose, onSavePassword }) {
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (oldPass.trim() !== currentUser.password) {
      alert("Password saat ini yang Anda masukkan salah.");
      return;
    }
    onSavePassword(newPass.trim());
    setOldPass("");
    setNewPass("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 no-print">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
          <h3 className="font-bold text-slate-800 text-base">
            <i className="fa-solid fa-key text-kemensos-navy mr-1.5"></i> Ubah Password Akun
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-600 block mb-1">Password Saat Ini</label>
            <input
              type="password"
              required
              value={oldPass}
              onChange={(e) => setOldPass(e.target.value)}
              placeholder="Masukkan password saat ini"
              className="w-full p-2.5 rounded-xl border border-slate-300 outline-none focus:border-kemensos-navy"
            />
          </div>
          <div>
            <label className="font-bold text-slate-600 block mb-1">Password Baru</label>
            <input
              type="password"
              required
              minLength={6}
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              placeholder="Minimal 6 karakter"
              className="w-full p-2.5 rounded-xl border border-slate-300 outline-none focus:border-kemensos-navy"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 font-bold"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-kemensos-navy text-white font-bold"
            >
              Simpan Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}