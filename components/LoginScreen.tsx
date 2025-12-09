import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Chrome, Mail, Loader2, User as UserIcon, AlertTriangle, ArrowRight, UserPlus, LogIn } from 'lucide-react';
import { Logo } from './Logo';

const LoginScreen: React.FC = () => {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, signInAsGuest } = useAuth();
  
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setError("Google Login unavailable. Switching to Guest...");
      setTimeout(() => signInAsGuest(), 1500);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
      setIsLoading(true);

      try {
          if (isSignUp) {
              if(!name.trim()) throw new Error("Name is required");
              await signUpWithEmail(email, password, name);
          } else {
              await signInWithEmail(email, password);
          }
      } catch (err: any) {
          console.error(err);
          // Map firebase error codes to user friendly messages
          let msg = "Authentication failed.";
          if (err.code === 'auth/invalid-credential') msg = "Invalid email or password.";
          if (err.code === 'auth/user-not-found') msg = "No account found with this email.";
          if (err.code === 'auth/wrong-password') msg = "Incorrect password.";
          if (err.code === 'auth/email-already-in-use') msg = "Email already in use.";
          if (err.code === 'auth/weak-password') msg = "Password should be at least 6 characters.";
          if (err.message) msg = err.message;
          
          setError(msg);
          setIsLoading(false);
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
        <div className="flex flex-col items-center mb-8">
            <div className="mb-6 drop-shadow-2xl">
               <Logo className="w-20 h-20" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Writer Room</h1>
            <p className="text-slate-400 text-center text-sm">Professional AI-augmented screenwriting suite.</p>
        </div>

        <div className="bg-[#1e293b] border border-slate-700 rounded-xl p-8 shadow-2xl backdrop-blur-sm">
            <h2 className="text-xl font-bold text-white mb-6 text-center">
                {isSignUp ? 'Create your account' : 'Welcome back'}
            </h2>
            
            {error && (
                <div className="mb-4 p-3 bg-red-900/30 border border-red-800 text-red-200 text-xs rounded-lg flex items-start gap-2">
                    <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                    <span>{error}</span>
                </div>
            )}

            {/* Email Form */}
            <form onSubmit={handleEmailAuth} className="space-y-3 mb-6">
                {isSignUp && (
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Full Name</label>
                        <input 
                            type="text" 
                            required={isSignUp}
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="Screenwriter Name" 
                            className="w-full bg-[#0f172a] border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none transition-colors text-sm"
                        />
                    </div>
                )}
                
                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Email</label>
                    <input 
                        type="email" 
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="name@example.com" 
                        className="w-full bg-[#0f172a] border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none transition-colors text-sm"
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Password</label>
                    <input 
                        type="password" 
                        required
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="••••••••" 
                        className="w-full bg-[#0f172a] border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none transition-colors text-sm"
                    />
                </div>

                <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-lg shadow-blue-900/20 mt-2"
                >
                    {isLoading ? <Loader2 className="animate-spin" size={18} /> : (isSignUp ? <UserPlus size={18} /> : <LogIn size={18} />)}
                    {isSignUp ? 'Sign Up' : 'Sign In'}
                </button>
            </form>
            
            <div className="relative flex py-2 items-center mb-6">
                <div className="flex-grow border-t border-slate-700"></div>
                <span className="flex-shrink-0 mx-4 text-slate-500 text-xs uppercase">Or continue with</span>
                <div className="flex-grow border-t border-slate-700"></div>
            </div>

            <div className="space-y-3">
                <button 
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                    className="w-full bg-white hover:bg-slate-100 text-slate-900 font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm"
                >
                    <Chrome size={18} />
                    Google
                </button>
                
                <button 
                    onClick={handleGuestLogin}
                    disabled={isLoading}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors border border-slate-600 text-sm"
                >
                    <UserIcon size={18} />
                    Guest (Demo)
                </button>
            </div>

            <div className="mt-6 text-center pt-4 border-t border-slate-700/50">
                <p className="text-slate-400 text-sm">
                    {isSignUp ? "Already have an account?" : "Don't have an account?"}
                    <button 
                        onClick={() => {
                            setIsSignUp(!isSignUp);
                            setError('');
                        }}
                        className="ml-2 text-blue-400 hover:text-blue-300 font-medium underline-offset-4 hover:underline focus:outline-none"
                    >
                        {isSignUp ? "Sign In" : "Sign Up"}
                    </button>
                </p>
            </div>
        </div>
        
        <div className="mt-8 text-center text-slate-600 text-xs flex justify-center gap-4">
             <a href="#" className="hover:text-slate-400">Terms of Service</a>
             <span>•</span>
             <a href="#" className="hover:text-slate-400">Privacy Policy</a>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;