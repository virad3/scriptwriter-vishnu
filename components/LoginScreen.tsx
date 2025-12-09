import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Chrome, Mail, Loader2, User as UserIcon, AlertTriangle } from 'lucide-react';
import { Logo } from './Logo';

const LoginScreen: React.FC = () => {
  const { signInWithGoogle, signInAsGuest } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');
    try {
      await signInWithGoogle();
    } catch (err: any) {
      console.warn("Google Login Error:", err);
      setError("Google Login unavailable in demo mode (missing API keys). Switching to Guest...");
      setTimeout(() => {
        signInAsGuest();
      }, 1500);
    }
  };

  const handleGuestLogin = async () => {
    setIsLoading(true);
    await signInAsGuest();
  };

  return (
    <div className="min-h-screen w-full bg-[#0f172a] flex items-center justify-center relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
         <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-900 blur-[120px] rounded-full"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-900 blur-[120px] rounded-full"></div>
      </div>

      <div className="relative z-10 w-full max-w-md p-8">
        <div className="flex flex-col items-center mb-10">
            <div className="mb-6 drop-shadow-2xl">
               <Logo className="w-24 h-24" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">WriteRoom</h1>
            <p className="text-slate-400 text-center">Professional AI-augmented screenwriting suite for modern storytellers.</p>
        </div>

        <div className="bg-[#1e293b] border border-slate-700 rounded-xl p-8 shadow-2xl backdrop-blur-sm">
            <h2 className="text-xl font-semibold text-white mb-6 text-center">Sign in to your workspace</h2>
            
            {error && (
                <div className="mb-4 p-3 bg-orange-900/30 border border-orange-800 text-orange-200 text-sm rounded-lg text-center flex items-center gap-2 justify-center">
                    <AlertTriangle size={16} />
                    {error}
                </div>
            )}

            <div className="space-y-4">
                <button 
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                    className="w-full bg-white hover:bg-slate-100 text-slate-900 font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-3 transition-colors"
                >
                    {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Chrome size={20} />}
                    Continue with Google
                </button>
                
                <button 
                    onClick={handleGuestLogin}
                    disabled={isLoading}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-3 transition-colors border border-slate-600"
                >
                    <UserIcon size={20} />
                    Continue as Guest (Demo)
                </button>

                <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-slate-700"></div>
                    <span className="flex-shrink-0 mx-4 text-slate-500 text-xs uppercase">Or continue with email</span>
                    <div className="flex-grow border-t border-slate-700"></div>
                </div>

                <div className="space-y-3">
                    <input 
                        type="email" 
                        placeholder="Email address" 
                        className="w-full bg-[#0f172a] border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none transition-colors"
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        className="w-full bg-[#0f172a] border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none transition-colors"
                    />
                    <button className="w-full bg-[#334155] hover:bg-[#475569] text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors border border-slate-600">
                        <Mail size={18} />
                        Sign In
                    </button>
                </div>
            </div>

            <div className="mt-6 text-center">
                <a href="#" className="text-sm text-slate-500 hover:text-blue-400 transition-colors">Forgot your password?</a>
            </div>
        </div>
        
        <p className="mt-8 text-center text-slate-600 text-xs">
            By clicking continue, you agree to our <a href="#" className="underline hover:text-slate-400">Terms of Service</a> and <a href="#" className="underline hover:text-slate-400">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;