import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Chrome, Mail, Loader2, User as UserIcon } from 'lucide-react';
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
    } catch (err) {
      // AuthContext handles the fallback, but if something else throws:
      setError('Connection failed. Trying demo mode...');
      console.error(err);
      setIsLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setIsLoading(true);
    await signInAsGuest();
  };

  return (
    <div className="min-h-screen w-full bg-[#121212] flex items-center justify-center relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
         <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900 blur-[120px] rounded-full"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-900 blur-[120px] rounded-full"></div>
      </div>

      <div className="relative z-10 w-full max-w-md p-8">
        <div className="flex flex-col items-center mb-10">
            <div className="mb-6 drop-shadow-2xl">
               <Logo className="w-24 h-24" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">WriteRoom</h1>
            <p className="text-gray-400 text-center">Professional AI-augmented screenwriting suite for modern storytellers.</p>
        </div>

        <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-8 shadow-2xl backdrop-blur-sm">
            <h2 className="text-xl font-semibold text-white mb-6 text-center">Sign in to your workspace</h2>
            
            {error && (
                <div className="mb-4 p-3 bg-red-900/30 border border-red-800 text-red-200 text-sm rounded-lg text-center">
                    {error}
                </div>
            )}

            <div className="space-y-4">
                <button 
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                    className="w-full bg-white hover:bg-gray-100 text-gray-900 font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-3 transition-colors"
                >
                    {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Chrome size={20} />}
                    Continue with Google
                </button>
                
                <button 
                    onClick={handleGuestLogin}
                    disabled={isLoading}
                    className="w-full bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-3 transition-colors border border-gray-700"
                >
                    <UserIcon size={20} />
                    Continue as Guest (Demo)
                </button>

                <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-gray-700"></div>
                    <span className="flex-shrink-0 mx-4 text-gray-500 text-xs uppercase">Or continue with email</span>
                    <div className="flex-grow border-t border-gray-700"></div>
                </div>

                <div className="space-y-3">
                    <input 
                        type="email" 
                        placeholder="Email address" 
                        className="w-full bg-[#121212] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition-colors"
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        className="w-full bg-[#121212] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition-colors"
                    />
                    <button className="w-full bg-[#262626] hover:bg-[#333] text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors border border-gray-700">
                        <Mail size={18} />
                        Sign In
                    </button>
                </div>
            </div>

            <div className="mt-6 text-center">
                <a href="#" className="text-sm text-gray-500 hover:text-purple-400 transition-colors">Forgot your password?</a>
            </div>
        </div>
        
        <p className="mt-8 text-center text-gray-600 text-xs">
            By clicking continue, you agree to our <a href="#" className="underline hover:text-gray-400">Terms of Service</a> and <a href="#" className="underline hover:text-gray-400">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;