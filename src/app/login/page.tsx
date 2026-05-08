'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { LogIn, UserPlus, Globe, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success('Logged in successfully!');
      } else {
        const { error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          }
        });
        if (error) throw error;
        toast.success('Check your email to confirm your account!');
      }
      router.push('/');
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-6 bg-background">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-card border border-border/40 rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] overflow-hidden p-8 md:p-10"
      >
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black tracking-tighter mb-2">Focus</h1>
          <p className="text-muted-foreground font-medium">Your minimalist productivity companion.</p>
        </div>

        <div className="space-y-6">
          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-[0.2em] text-muted-foreground mb-2 ml-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-5 py-4 rounded-2xl border border-border/20 bg-background focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-[0.2em] text-muted-foreground mb-2 ml-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-5 py-4 rounded-2xl border border-border/20 bg-background focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-bold"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground font-black py-5 rounded-2xl hover:opacity-95 transition-all shadow-xl shadow-primary/20 active:scale-[0.98] disabled:opacity-50 text-lg flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin ? <LogIn size={20} /> : <UserPlus size={20} />}
                  <span>{isLogin ? 'Sign In' : 'Sign Up'}</span>
                </>
              )}
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border/20"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-4 text-muted-foreground font-black tracking-widest">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 py-4 rounded-2xl border border-border/20 hover:bg-accent transition-all font-bold">
              <Globe size={20} />
              <span>GitHub</span>
            </button>
            <button className="flex items-center justify-center gap-2 py-4 rounded-2xl border border-border/20 hover:bg-accent transition-all font-bold">
              <Mail size={20} />
              <span>Google</span>
            </button>
          </div>

          <p className="text-center text-sm font-bold text-muted-foreground">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary hover:underline"
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
