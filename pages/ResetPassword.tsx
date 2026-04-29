import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

export const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { updatePassword } = useStore();
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setMessage('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setIsSubmitting(true);
      await updatePassword(password);
      setMessage('Password updated. Redirecting to sign in...');
      window.setTimeout(() => navigate('/login'), 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-black/50 px-4">
      <div className="absolute inset-0 z-[-1]">
        <img
          src="https://images.unsplash.com/photo-1574267432553-4b4628081c31?auto=format&fit=crop&w=1920&q=80"
          className="h-full w-full object-cover opacity-50"
          alt="Background"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="w-full max-w-md rounded-lg border border-zinc-800 bg-black/75 p-8 backdrop-blur-sm md:p-12">
        <h2 className="mb-3 text-3xl font-bold text-white">Reset Password</h2>
        <p className="mb-8 text-sm text-gray-400">Enter your new password from the reset link session.</p>

        {error && <div className="mb-4 rounded bg-[#e87c03] p-3 text-sm text-white">{error}</div>}
        {message && <div className="mb-4 rounded bg-emerald-700 p-3 text-sm text-white">{message}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="New password"
              className="w-full rounded bg-[#333] px-4 py-3.5 pr-12 text-white transition focus:bg-[#454545] focus:outline-none"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(prev => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-gray-400 transition hover:bg-white/10 hover:text-white"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Confirm new password"
            className="w-full rounded bg-[#333] px-4 py-3.5 text-white transition focus:bg-[#454545] focus:outline-none"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded bg-netflix-red py-3.5 font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? 'Updating...' : 'Update Password'}
          </button>
        </form>

        <Link to="/login" className="mt-6 inline-block text-sm font-semibold text-white hover:underline">
          Back to sign in
        </Link>
      </div>
    </div>
  );
};
