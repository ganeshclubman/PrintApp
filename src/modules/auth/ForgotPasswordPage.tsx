import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { Send, Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/src/lib/utils';

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const ForgotPasswordPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    console.log("Forgot password data:", data);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-md text-center">
          <div className="bg-white border border-slate-200 rounded-3xl shadow-xl shadow-slate-200/50 p-10">
            <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-4">Check your email</h2>
            <p className="text-slate-500 mb-8">We've sent a password reset link to your email address.</p>
            <Link 
              to="/login" 
              className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              {t('auth.backToLogin')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black tracking-tighter text-indigo-600 mb-2">CLUBMAN <span className="text-slate-400 font-light">ERP</span></h1>
          <p className="text-slate-500 font-medium">{t('auth.forgotPassword')}</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl shadow-xl shadow-slate-200/50 p-8">
          <p className="text-sm text-slate-500 mb-8 text-center">
            Enter your email address and we'll send you a link to reset your password.
          </p>

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

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
            >
              <Send className="w-5 h-5" />
              {isSubmitting ? "Sending..." : t('auth.sendResetLink')}
            </button>
          </form>

          <div className="mt-8 text-center">
            <Link 
              to="/login" 
              className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              {t('auth.backToLogin')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
