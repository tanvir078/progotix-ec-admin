import { Link, router } from '@/lib/inertiaCompat';
import { useState } from 'react';
import AdminLayout, { AdminCard, StatusBadge } from '@/components/AdminLayout';
import StatCard from '@/components/ui/StatCard';
import FormInput from '@/components/ui/FormInput';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { Archive, Bell, CheckCheck, MailOpen, Plus, Trash2 } from 'lucide-react';

const emptyForm = {
  type: 'manual',
  title: '',
  message: '',
  severity: 'info',
  action_url: '',
};

export default function AdminNotificationsPage({ notifications = [], metrics = [], status }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [filter, setFilter] = useState('');

  const setField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const reset = () => {
    setForm(emptyForm);
    setErrors({});
  };

  const submit = (event) => {
    event.preventDefault();
    router.post('/admin/notifications', form, {
      preserveScroll: true,
      onError: setErrors,
      onSuccess: reset,
    });
  };

  const updateNotification = (notification, data) => {
    router.patch(`/admin/notifications/${notification.id}`, data, {
      preserveScroll: true,
      onError: setErrors,
    });
  };

  const destroy = (notification) => {
    if (window.confirm(`Delete "${notification.title}"?`)) {
      router.delete(`/admin/notifications/${notification.id}`, { preserveScroll: true });
    }
  };

  const markAllRead = () => {
    router.post('/admin/notifications/mark-all-read', {}, { preserveScroll: true });
  };

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === 'unread') return !notification.read_at;
    if (filter === 'read') return Boolean(notification.read_at);
    if (filter) return notification.severity === filter;
    return true;
  });

  const unreadCount = notifications.filter((notification) => !notification.read_at).length;
  const warningCount = notifications.filter((notification) => notification.severity === 'warning').length;
  const dangerCount = notifications.filter((notification) => notification.severity === 'danger').length;

  return (
    <AdminLayout title="Notifications">
      {status && (
        <div className="mb-5 rounded-xl border border-success bg-success-light px-5 py-3 text-sm font-bold text-success-dark">
          {status}
        </div>
      )}

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Notifications" value={metrics[0]?.value ?? notifications.length} icon={Bell} />
        <StatCard label="Unread" value={metrics[1]?.value ?? unreadCount} icon={MailOpen} />
        <StatCard label="Warnings" value={warningCount} icon={Bell} />
        <StatCard label="Danger" value={dangerCount} icon={Bell} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[400px_1fr]">
        <AdminCard title="Create Notification" icon={<Plus className="h-5 w-5 text-slate-400" />}>
          <form onSubmit={submit} className="space-y-4">
            <FormInput
              label="Type"
              value={form.type}
              onChange={(event) => setField('type', event.target.value)}
              error={errors.type}
              placeholder="manual, orders, inventory"
            />
            <FormInput
              label="Title"
              value={form.title}
              onChange={(event) => setField('title', event.target.value)}
              error={errors.title}
              placeholder="Notification title"
            />
            <Select
              label="Severity"
              value={form.severity}
              onChange={(event) => setField('severity', event.target.value)}
              error={errors.severity}
            >
              <option value="info">Info</option>
              <option value="success">Success</option>
              <option value="warning">Warning</option>
              <option value="danger">Danger</option>
            </Select>
            <FormInput
              label="Action URL"
              value={form.action_url}
              onChange={(event) => setField('action_url', event.target.value)}
              error={errors.action_url}
              placeholder="/orders"
            />
            <div>
              <label className="mb-1 block text-xs font-black text-slate-600">Message</label>
              <textarea
                value={form.message}
                onChange={(event) => setField('message', event.target.value)}
                className="min-h-28 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                placeholder="Notification message"
              />
              {errors.message && <p className="mt-1 text-xs font-bold text-danger">{errors.message}</p>}
            </div>
            <div className="flex gap-3">
              <Button type="submit">Create</Button>
              <Button type="button" variant="secondary" onClick={reset}>Reset</Button>
            </div>
          </form>
        </AdminCard>

        <AdminCard
          title={`Notification Center (${filteredNotifications.length})`}
          action={
            <div className="flex flex-wrap gap-2">
              <Select value={filter} onChange={(event) => setFilter(event.target.value)}>
                <option value="">All</option>
                <option value="unread">Unread</option>
                <option value="read">Read</option>
                <option value="warning">Warning</option>
                <option value="danger">Danger</option>
              </Select>
              <Button variant="secondary" onClick={markAllRead} className="flex items-center gap-2">
                <CheckCheck className="h-4 w-4" />
                Mark All Read
              </Button>
            </div>
          }
        >
          {Object.keys(errors).length > 0 && (
            <div className="mb-4 rounded-xl border border-danger bg-danger-light px-4 py-3 text-sm font-bold text-danger">
              {Object.values(errors).flat()[0]}
            </div>
          )}

          <div className="space-y-3">
            {filteredNotifications.length === 0 && (
              <div className="py-10 text-center text-sm font-bold text-slate-400">
                No notifications found.
              </div>
            )}

            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`rounded-2xl border p-4 ${
                  notification.read_at
                    ? 'border-slate-200 bg-white'
                    : 'border-primary/20 bg-primary/5'
                }`}
              >
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-black text-slate-950">{notification.title}</p>
                      <StatusBadge value={notification.severity} />
                      <StatusBadge value={notification.read_at ? 'read' : 'unread'} />
                    </div>
                    <p className="mt-1 text-xs font-black uppercase tracking-wide text-slate-400">{notification.type}</p>
                    <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">{notification.message}</p>
                    {notification.action_url && (
                      <Link href={`/admin${notification.action_url}`} className="mt-2 inline-block text-sm font-black text-primary hover:underline">
                        Open related page
                      </Link>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => updateNotification(notification, { read: !notification.read_at })}
                    >
                      {notification.read_at ? 'Unread' : 'Read'}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => updateNotification(notification, { archived: true })}
                    >
                      <Archive className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => destroy(notification)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </AdminCard>
      </div>
    </AdminLayout>
  );
}
