import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useSiteConfig } from '../context/SiteConfigContext';
import { getConfiguredAdminCredentials } from '../utils/searchAndFilter';
import {
  Lock,
  Mail,
  KeyRound,
  ShieldCheck,
  ArrowLeft,
  AlertCircle,
  Heart,
} from 'lucide-react';

interface AdminLoginViewProps {
  onSuccess: () => void;
  onBackToSite: () => void;
}

export const AdminLoginView: React.FC<AdminLoginViewProps> = ({
  onSuccess,
  onBackToSite,
}) => {
  const { login } = useData();
  const { config } = useSiteConfig();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { validUser, validPass } = getConfiguredAdminCredentials();

    if (username.trim() === validUser && password === validPass) {
      const res = login(username.trim(), password);
      setIsLoading(false);
      if (res.success) {
        setError('');
        onSuccess();
        return;
      }
    }

    setIsLoading(false);
    setError('Username atau password yang Anda masukkan salah!');
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Soft Pastel Background Accents */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-[#A8E6CF]/30 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-[#FFD3B6]/30 blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#A8E6CF] to-[#8DE9D1] shadow-xs mb-2">
            <Heart className="w-7 h-7 text-slate-800 fill-white/60" />
          </div>
          <div className="flex items-center justify-center gap-1.5">
            <h1 className="text-2xl font-black tracking-tight flex items-baseline">
              <span className="text-[#FF9F68]">HI</span>
              <span className="text-[#4ECCA3]">HO</span>
            </h1>
            <span className="text-[11px] font-bold text-emerald-950 bg-[#A8E6CF] px-2.5 py-0.5 rounded-full border border-emerald-300">
              Admin Portal
            </span>
          </div>
          <p className="text-xs text-slate-500">
            {config.brand.tagline || 'Pusat Pengelolaan Konten Medis, Direktori Penyakit, & Artikel Gizi'}
          </p>
        </div>

        {/* Clean Login Card */}
        <div className="mt-8 bg-white py-8 px-6 sm:px-10 shadow-xl rounded-3xl border border-slate-200/80 relative">
          {/* Error Feedback Alert */}
          {error && (
            <div
              role="alert"
              className="mb-6 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2.5"
            >
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="admin-username" className="block text-xs font-bold text-slate-700 mb-1">
                Username / Email Admin
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="admin-username"
                  type="text"
                  required
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username atau email"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-[#FAF9F6] border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>
            </div>

            <div>
              <label htmlFor="admin-password" className="block text-xs font-bold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="admin-password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-[#FAF9F6] border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md cursor-pointer transition-all hover:scale-101 active:scale-99 focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                <Lock className="w-4 h-4 text-emerald-400" />
                <span>{isLoading ? 'Memverifikasi...' : 'Masuk ke Admin Portal'}</span>
              </button>
            </div>
          </form>

          {/* Back to public site */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <button
              onClick={onBackToSite}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-800 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Website Utama HIHO</span>
            </button>
          </div>
        </div>

        {/* Security watermark */}
        <div className="mt-6 text-center flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
          <span>Akses Khusus Tim Editorial & Tenaga Medis HIHO</span>
        </div>
      </div>
    </div>
  );
};
