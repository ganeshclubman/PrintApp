import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, X } from 'lucide-react';
import { useFocusNavigation } from '@/src/core/FocusManager';

const invoiceSchema = z.object({
  memberId: z.string().min(1, "Member is required"),
  amount: z.number().min(1, "Amount must be greater than 0"),
  dueDate: z.string().min(1, "Due date is required"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  category: z.enum(["Subscription", "Facility", "Event", "Other"]),
});

type InvoiceFormValues = z.infer<typeof invoiceSchema>;

export const CreateInvoiceForm: React.FC = () => {
  const navigate = useNavigate();
  const { register: registerFocus } = useFocusNavigation();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      category: "Subscription",
      amount: 0,
    }
  });

  const onSubmit = async (data: InvoiceFormValues) => {
    console.log("Submitting invoice:", data);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    navigate('/billing');
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate('/billing')}
          className="p-2 hover:bg-slate-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <h1 className="text-2xl font-bold text-slate-900">Create New Invoice</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Member ID *</label>
              <input 
                {...register("memberId")}
                className={cn(
                  "w-full px-4 py-2 bg-slate-50 border rounded-lg outline-none transition-all focus:ring-2 focus:ring-indigo-500/20",
                  errors.memberId ? "border-red-300" : "border-slate-200 focus:border-indigo-500"
                )}
                placeholder="e.g. M001"
              />
              {errors.memberId && <p className="text-xs text-red-500 font-medium">{errors.memberId.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Category *</label>
              <select 
                {...register("category")}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="Subscription">Subscription</option>
                <option value="Facility">Facility</option>
                <option value="Event">Event</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Amount (₹) *</label>
              <input 
                type="number"
                {...register("amount", { valueAsNumber: true })}
                className={cn(
                  "w-full px-4 py-2 bg-slate-50 border rounded-lg outline-none transition-all focus:ring-2 focus:ring-indigo-500/20",
                  errors.amount ? "border-red-300" : "border-slate-200 focus:border-indigo-500"
                )}
              />
              {errors.amount && <p className="text-xs text-red-500 font-medium">{errors.amount.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Due Date *</label>
              <input 
                type="date"
                {...register("dueDate")}
                className={cn(
                  "w-full px-4 py-2 bg-slate-50 border rounded-lg outline-none transition-all focus:ring-2 focus:ring-indigo-500/20",
                  errors.dueDate ? "border-red-300" : "border-slate-200 focus:border-indigo-500"
                )}
              />
              {errors.dueDate && <p className="text-xs text-red-500 font-medium">{errors.dueDate.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Description *</label>
            <textarea 
              {...register("description")}
              rows={4}
              className={cn(
                "w-full px-4 py-2 bg-slate-50 border rounded-lg outline-none transition-all focus:ring-2 focus:ring-indigo-500/20",
                errors.description ? "border-red-300" : "border-slate-200 focus:border-indigo-500"
              )}
              placeholder="Enter invoice details..."
            />
            {errors.description && <p className="text-xs text-red-500 font-medium">{errors.description.message}</p>}
          </div>
        </div>

        <div className="px-8 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
          <button 
            type="button"
            onClick={() => navigate('/billing')}
            className="px-6 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-8 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isSubmitting ? "Saving..." : "Save Invoice"}
          </button>
        </div>
      </form>
    </div>
  );
};

// Helper for conditional classes
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
