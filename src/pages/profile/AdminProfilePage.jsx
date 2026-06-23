import { useState } from 'react';
import { usePage } from '@/lib/inertiaCompat';
import AdminLayout, { AdminCard } from '@/components/AdminLayout';
import FormInput from '@/components/ui/FormInput';
import Button from '@/components/ui/Button';
import { Mail, ShieldCheck, UserCircle } from 'lucide-react';

export default function AdminProfilePage({ status }) {
  const { props } = usePage();
  const user = props.auth?.user || {};
  const [form, setForm] = useState({
    name: user.name || 'Kids Mela Admin',
    email: user.email || 'admin@kidsmela.local',
    current_password: '',
    password: '',
    password_confirmation: '',
  });
  const [saved, setSaved] = useState(false);

  const setField = (field, value) => {
    setSaved(false);
    setForm((current) => ({ ...current, [field]: value }));
  };

  const submit = (event) => {
    event.preventDefault();
    setSaved(true);
  };

  return (
    <AdminLayout title="Profile">
      {(status || saved) && (
        <div className="mb-5 rounded-xl border border-success bg-success-light px-5 py-3 text-sm font-bold text-success-dark">
          {status || 'Profile changes are ready. Connect this form to the backend to persist updates.'}
        </div>
      )}

      <div className="mb-6 grid gap-4 lg:grid-cols-3">
        <AdminCard className="lg:col-span-2">
          <div className="flex items-center gap-4">
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-primary text-2xl font-black text-white">
              {form.name.charAt(0) || 'A'}
            </div>
            <div>
              <p className="text-lg font-black text-slate-950">{form.name}</p>
              <p className="mt-1 text-sm font-semibold text-slate-500">{form.email}</p>
            </div>
          </div>
        </AdminCard>

        <AdminCard>
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-success-light text-success-dark">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-wide text-slate-400">Role</p>
              <p className="text-sm font-black text-slate-900">Super Admin</p>
            </div>
          </div>
        </AdminCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <AdminCard title="Profile Information">
          <form onSubmit={submit} className="space-y-4">
            <FormInput
              label="Name"
              value={form.name}
              onChange={(event) => setField('name', event.target.value)}
            />
            <FormInput
              label="Email"
              type="email"
              value={form.email}
              onChange={(event) => setField('email', event.target.value)}
            />
            <div className="flex justify-end">
              <Button type="submit" className="inline-flex items-center gap-2">
                <UserCircle className="h-4 w-4" />
                Save Profile
              </Button>
            </div>
          </form>
        </AdminCard>

        <AdminCard title="Security">
          <form onSubmit={submit} className="space-y-4">
            <FormInput
              label="Current Password"
              type="password"
              value={form.current_password}
              onChange={(event) => setField('current_password', event.target.value)}
            />
            <FormInput
              label="New Password"
              type="password"
              value={form.password}
              onChange={(event) => setField('password', event.target.value)}
            />
            <FormInput
              label="Confirm Password"
              type="password"
              value={form.password_confirmation}
              onChange={(event) => setField('password_confirmation', event.target.value)}
            />
            <Button type="submit" variant="secondary" className="inline-flex w-full items-center justify-center gap-2">
              <Mail className="h-4 w-4" />
              Update Security
            </Button>
          </form>
        </AdminCard>
      </div>
    </AdminLayout>
  );
}
