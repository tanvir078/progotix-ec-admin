import { router } from '@/lib/inertiaCompat';
import { useState } from 'react';
import AdminLayout, { AdminCard, StatusBadge } from '@/components/AdminLayout';
import StatCard from '@/components/ui/StatCard';
import FormInput from '@/components/ui/FormInput';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { Edit, Shield, Trash2, UserPlus, Users, X } from 'lucide-react';

const emptyForm = {
  name: '',
  email: '',
  password: '',
  phone: '',
  address: '',
  staff_role: 'support',
  staff_status: 'active',
  staff_permissions: ['dashboard'],
};

export default function AdminStaffPage({
  staff = [],
  roles = [],
  permissions = [],
  metrics = [],
  status,
}) {
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [errors, setErrors] = useState({});

  const setField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const reset = () => {
    setEditing(null);
    setForm(emptyForm);
    setErrors({});
  };

  const submit = (event) => {
    event.preventDefault();
    const data = { ...form };
    if (editing) data._method = 'put';
    if (editing && !data.password) delete data.password;

    router.post(editing ? `/admin/staff/${editing.id}` : '/admin/staff', data, {
      preserveScroll: true,
      onError: setErrors,
      onSuccess: reset,
    });
  };

  const edit = (member) => {
    setEditing(member);
    setForm({
      name: member.name ?? '',
      email: member.email ?? '',
      password: '',
      phone: member.phone ?? '',
      address: member.address ?? '',
      staff_role: member.staff_role ?? 'support',
      staff_status: member.staff_status ?? 'active',
      staff_permissions: member.staff_permissions ?? ['dashboard'],
    });
    setErrors({});
  };

  const destroy = (member) => {
    if (window.confirm(`Delete staff member ${member.name}?`)) {
      router.delete(`/admin/staff/${member.id}`, { preserveScroll: true });
    }
  };

  const togglePermission = (permission) => {
    setForm((current) => {
      const currentPermissions = current.staff_permissions || [];
      const next = currentPermissions.includes(permission)
        ? currentPermissions.filter((item) => item !== permission)
        : [...currentPermissions, permission];

      return { ...current, staff_permissions: next };
    });
  };

  const activeCount = staff.filter((member) => member.staff_status === 'active').length;
  const suspendedCount = staff.filter((member) => member.staff_status === 'suspended').length;
  const roleCount = new Set(staff.map((member) => member.staff_role)).size;

  return (
    <AdminLayout title="Staff">
      {status && (
        <div className="mb-5 rounded-xl border border-success bg-success-light px-5 py-3 text-sm font-bold text-success-dark">
          {status}
        </div>
      )}

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Staff Users" value={metrics[0]?.value ?? staff.length} icon={Users} />
        <StatCard label="Active" value={metrics[1]?.value ?? activeCount} icon={Shield} />
        <StatCard label="Suspended" value={metrics[2]?.value ?? suspendedCount} icon={X} />
        <StatCard label="Roles" value={metrics[3]?.value ?? roleCount} icon={Shield} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[430px_1fr]">
        <AdminCard title={editing ? 'Edit Staff Member' : 'Create Staff Member'} icon={editing ? <Edit className="h-5 w-5 text-slate-400" /> : <UserPlus className="h-5 w-5 text-slate-400" />}>
          <form onSubmit={submit} className="space-y-4">
            <FormInput label="Name" value={form.name} onChange={(event) => setField('name', event.target.value)} error={errors.name} />
            <FormInput label="Email" type="email" value={form.email} onChange={(event) => setField('email', event.target.value)} error={errors.email} />
            <FormInput
              label={editing ? 'New Password' : 'Password'}
              type="password"
              value={form.password}
              onChange={(event) => setField('password', event.target.value)}
              error={errors.password}
              placeholder={editing ? 'Leave blank to keep current password' : 'Minimum 8 characters'}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <Select label="Role" value={form.staff_role} onChange={(event) => setField('staff_role', event.target.value)} error={errors.staff_role}>
                {roles.map((role) => <option key={role} value={role}>{role}</option>)}
              </Select>
              <Select label="Status" value={form.staff_status} onChange={(event) => setField('staff_status', event.target.value)} error={errors.staff_status}>
                <option value="active">Active</option>
                <option value="invited">Invited</option>
                <option value="suspended">Suspended</option>
              </Select>
            </div>

            <FormInput label="Phone" value={form.phone} onChange={(event) => setField('phone', event.target.value)} error={errors.phone} />
            <div>
              <label className="mb-1 block text-xs font-black text-slate-600">Address</label>
              <textarea
                value={form.address}
                onChange={(event) => setField('address', event.target.value)}
                className="min-h-20 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
              {errors.address && <p className="mt-1 text-xs font-bold text-danger">{errors.address}</p>}
            </div>

            <div>
              <p className="mb-2 text-xs font-black text-slate-600">Permissions</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {permissions.map((permission) => (
                  <label key={permission} className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 px-3 py-2">
                    <input
                      type="checkbox"
                      checked={(form.staff_permissions || []).includes(permission)}
                      onChange={() => togglePermission(permission)}
                      className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm font-semibold capitalize text-slate-700">{permission}</span>
                  </label>
                ))}
              </div>
              {errors.staff_permissions && <p className="mt-1 text-xs font-bold text-danger">{errors.staff_permissions}</p>}
            </div>

            <div className="flex gap-3">
              <Button type="submit">{editing ? 'Update' : 'Create'}</Button>
              <Button type="button" variant="secondary" onClick={reset}>{editing ? 'Cancel' : 'Reset'}</Button>
            </div>
          </form>
        </AdminCard>

        <AdminCard title={`Staff Members (${staff.length})`}>
          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs font-black uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-5 py-4">Staff</th>
                    <th className="px-5 py-4">Role</th>
                    <th className="px-5 py-4">Permissions</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {staff.length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-5 py-10 text-center text-sm font-bold text-slate-400">
                        No staff members found.
                      </td>
                    </tr>
                  )}
                  {staff.map((member) => (
                    <tr key={member.id} className="transition hover:bg-slate-50">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="grid h-10 w-10 place-items-center rounded-full bg-primary text-sm font-black text-white">
                            {member.name?.charAt(0) || 'S'}
                          </div>
                          <div>
                            <p className="font-black text-slate-900">{member.name}</p>
                            <p className="text-xs font-semibold text-slate-500">{member.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4"><StatusBadge value={member.staff_role || 'staff'} /></td>
                      <td className="px-5 py-4 text-xs font-semibold capitalize text-slate-500">
                        {(member.staff_permissions || []).join(', ') || '-'}
                      </td>
                      <td className="px-5 py-4"><StatusBadge value={member.staff_status || 'active'} /></td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => edit(member)}
                            className="rounded-xl bg-slate-50 p-2 text-slate-600 transition hover:bg-slate-100"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => destroy(member)}
                            className="rounded-xl bg-danger-light p-2 text-danger transition hover:bg-danger"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </AdminCard>
      </div>
    </AdminLayout>
  );
}
