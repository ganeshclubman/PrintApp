import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/src/lib/utils';

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    console.log("Login data:", data);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black tracking-tighter text-indigo-600 mb-2">CLUBMAN <span className="text-slate-400 font-light">ERP</span></h1>
          <p className="text-slate-500 font-medium">{t('auth.signIn')} to your account</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl shadow-xl shadow-slate-200/50 p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">{t('auth.email')}</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3 w-4 h-4 text-slate-400" />
                <input 
                  {...register("email")}
                  type="email"
                  placeholder="name@example.com"
                  className={cn(
                    "w-full pl-12 pr-4 py-3 bg-slate-50 border rounded-2xl outline-none transition-all focus:ring-4 focus:ring-indigo-500/10",
                    errors.email ? "border-red-300" : "border-slate-100 focus:border-indigo-500"
                  )}
                />
              </div>
              {errors.email && <p className="text-xs text-red-500 font-medium ml-1">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-sm font-bold text-slate-700">{t('auth.password')}</label>
                <Link to="/forgot-password" title={t('auth.forgotPassword')} className="text-xs font-bold text-indigo-600 hover:underline">
                  {t('auth.forgotPassword')}?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-3 w-4 h-4 text-slate-400" />
                <input 
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={cn(
                    "w-full pl-12 pr-12 py-3 bg-slate-50 border rounded-2xl outline-none transition-all focus:ring-4 focus:ring-indigo-500/10",
                    errors.password ? "border-red-300" : "border-slate-100 focus:border-indigo-500"
                  )}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 font-medium ml-1">{errors.password.message}</p>}
            </div>

            <div className="flex items-center ml-1">
              <input 
                {...register("rememberMe")}
                type="checkbox" 
                id="rememberMe"
                className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="rememberMe" className="ml-2 text-sm font-medium text-slate-600 cursor-pointer">
                {t('auth.rememberMe')}
              </label>
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
            >
              <LogIn className="w-5 h-5" />
              {isSubmitting ? "Signing in..." : t('auth.signIn')}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-slate-500">
              {t('auth.noAccount')} <Link to="/register" className="font-bold text-indigo-600 hover:underline">{t('auth.signUp')}</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
