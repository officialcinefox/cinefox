import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { signup, authError } = useStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !confirmPassword) {
      setError('All fields are required');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    try {
      setIsSubmitting(true);
      await signup(name, email, password);
      navigate('/profile');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create your account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black/50 flex items-center justify-center relative">
       {/* Background Image with Overlay */}
       <div className="absolute inset-0 z-[-1]">
          <img 
             src="https://images.unsplash.com/photo-1574267432553-4b4628081c31?auto=format&fit=crop&w=1920&q=80" 
             className="w-full h-full object-cover opacity-50"
             alt="Background"
          />
          <div className="absolute inset-0 bg-black/60"></div>
       </div>

       <div className="bg-black/75 p-12 rounded-lg w-full max-w-md backdrop-blur-sm border border-zinc-800">
          <h2 className="text-3xl font-bold mb-8 text-white">Sign Up</h2>
          
          {(error || authError) && <div className="bg-[#e87c03] p-3 rounded text-white text-sm mb-4">{error || authError}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
             <input 
               type="text" 
               placeholder="Full Name" 
               className="w-full bg-[#333] text-white px-4 py-3.5 rounded focus:outline-none focus:bg-[#454545] transition"
               value={name}
               onChange={(e) => setName(e.target.value)}
             />
             <input 
               type="email" 
               placeholder="Email Address" 
               className="w-full bg-[#333] text-white px-4 py-3.5 rounded focus:outline-none focus:bg-[#454545] transition"
               value={email}
               onChange={(e) => setEmail(e.target.value)}
             />
             <div className="relative">
               <input 
                 type={showPassword ? 'text' : 'password'} 
                 placeholder="Password" 
                 className="w-full bg-[#333] text-white px-4 py-3.5 pr-12 rounded focus:outline-none focus:bg-[#454545] transition"
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
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
             <div className="relative">
               <input 
                 type={showConfirmPassword ? 'text' : 'password'} 
                 placeholder="Confirm Password" 
                 className="w-full bg-[#333] text-white px-4 py-3.5 pr-12 rounded focus:outline-none focus:bg-[#454545] transition"
                 value={confirmPassword}
                 onChange={(e) => setConfirmPassword(e.target.value)}
               />
               <button
                 type="button"
                 onClick={() => setShowConfirmPassword(prev => !prev)}
                 className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-gray-400 transition hover:bg-white/10 hover:text-white"
                 aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
               >
                 {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
               </button>
             </div>
             
             <button
               type="submit"
               disabled={isSubmitting}
               className="w-full bg-netflix-red text-white font-bold py-3.5 rounded hover:bg-red-700 transition mt-6 disabled:cursor-not-allowed disabled:opacity-70"
             >
                {isSubmitting ? 'Creating Account...' : 'Create Account'}
             </button>
          </form>

          <div className="mt-8 text-gray-400 text-base">
             <p>Already have an account? <Link to="/login" className="text-white hover:underline">Sign in.</Link></p>
          </div>
       </div>
    </div>
  );
};
