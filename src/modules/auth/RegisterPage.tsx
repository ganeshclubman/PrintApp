import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/src/lib/utils';

const registerSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm password must be at least 6 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export const RegisterPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    console.log("Register data:", data);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black tracking-tighter text-indigo-600 mb-2">CLUBMAN <span className="text-slate-400 font-light">ERP</span></h1>
          <p className="text-slate-500 font-medium">{t('auth.signUp')} for a new account</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl shadow-xl shadow-slate-200/50 p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">{t('auth.fullName')}</label>
              <div className="relative">
                <User className="absolute left-4 top-3 w-4 h-4 text-slate-400" />
                <input 
                  {...register("fullName")}
                  type="text"
                  placeholder="John Doe"
                  className={cn(
                    "w-full pl-12 pr-4 py-3 bg-slate-50 border rounded-2xl outline-none transition-all focus:ring-4 focus:ring-indigo-500/10",
                    errors.fullName ? "border-red-300" : "border-slate-100 focus:border-indigo-500"
                  )}
                />
              </div>
              {errors.fullName && <p className="text-xs text-red-500 font-medium ml-1">{errors.fullName.message}</p>}
            </div>

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
              <label className="text-sm font-bold text-slate-700 ml-1">{t('auth.password')}</label>
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

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">{t('auth.confirmPassword')}</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3 w-4 h-4 text-slate-400" />
                <input 
                  {...register("confirmPassword")}
                  type="password"
                  placeholder="••••••••"
                  className={cn(
                    "w-full pl-12 pr-4 py-3 bg-slate-50 border rounded-2xl outline-none transition-all focus:ring-4 focus:ring-indigo-500/10",
                    errors.confirmPassword ? "border-red-300" : "border-slate-100 focus:border-indigo-500"
                  )}
                />
              </div>
              {errors.confirmPassword && <p className="text-xs text-red-500 font-medium ml-1">{errors.confirmPassword.message}</p>}
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
            >
              <UserPlus className="w-5 h-5" />
              {isSubmitting ? "Signing up..." : t('auth.signUp')}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-slate-500">
              {t('auth.hasAccount')} <Link to="/login" className="font-bold text-indigo-600 hover:underline">{t('auth.signIn')}</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
