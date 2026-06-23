import { useState } from 'react';
import AdminLayout, { AdminCard, StatusBadge } from '@/components/AdminLayout';
import StatCard from '@/components/ui/StatCard';
import FormInput from '@/components/ui/FormInput';
import Button from '@/components/ui/Button';
import { Mail, Send, Calendar, Users, Eye, MousePointer, Plus, Edit, Trash2, Clock } from 'lucide-react';

export default function EmailCampaignsPage({ campaigns = [], stats = {}, status }) {
    const [editing, setEditing] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({
        name: '',
        subject: '',
        content: '',
        template: 'default',
        recipient_segments: [],
        scheduled_at: '',
    });
    const [errors, setErrors] = useState({});

    const resetForm = () => {
        setForm({
            name: '',
            subject: '',
            content: '',
            template: 'default',
            recipient_segments: [],
            scheduled_at: '',
        });
        setErrors({});
        setEditing(null);
        setShowForm(false);
    };

    const edit = (campaign) => {
        setEditing(campaign);
        setForm({
            name: campaign.name || '',
            subject: campaign.subject || '',
            content: campaign.content || '',
            template: campaign.template || 'default',
            recipient_segments: campaign.recipient_segments || [],
            scheduled_at: campaign.scheduled_at || '',
        });
        setErrors({});
        setShowForm(true);
    };

    const submit = async (event) => {
        event.preventDefault();
        const data = { ...form };
        if (editing) data._method = 'put';

        try {
            const response = await fetch(
                editing ? `/api/admin/email-campaigns/${editing.id}` : '/api/admin/email-campaigns',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                }
            );

            if (response.ok) {
                resetForm();
                window.location.reload();
            } else {
                const errorData = await response.json();
                setErrors(errorData.errors || {});
            }
        } catch (error) {
            console.error('Failed to save campaign:', error);
        }
    };

    const sendCampaign = async (campaign) => {
        if (!window.confirm(`Send campaign "${campaign.name}" to ${campaign.total_recipients} recipients?`)) {
            return;
        }

        try {
            await fetch(`/api/admin/email-campaigns/${campaign.id}/send`, {
                method: 'POST',
            });
            window.location.reload();
        } catch (error) {
            console.error('Failed to send campaign:', error);
        }
    };

    const destroy = async (campaign) => {
        if (window.confirm(`Delete campaign "${campaign.name}"?`)) {
            try {
                await fetch(`/api/admin/email-campaigns/${campaign.id}`, {
                    method: 'DELETE',
                });
                window.location.reload();
            } catch (error) {
                console.error('Failed to delete campaign:', error);
            }
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'sent': return 'green';
            case 'sending': return 'blue';
            case 'scheduled': return 'orange';
            case 'failed': return 'red';
            default: return 'gray';
        }
    };

    return (
        <AdminLayout title="Email Campaigns">
            {status && (
                <div className="mb-5 rounded-xl border border-success bg-success-light px-5 py-3 text-sm font-bold text-success-dark">
                    {status}
                </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
                <StatCard
                    title="Total Campaigns"
                    value={stats.total_campaigns || 0}
                    icon={<Mail className="h-5 w-5" />}
                    color="blue"
                />
                <StatCard
                    title="Sent"
                    value={stats.sent_campaigns || 0}
                    icon={<Send className="h-5 w-5" />}
                    color="green"
                />
                <StatCard
                    title="Scheduled"
                    value={stats.scheduled_campaigns || 0}
                    icon={<Calendar className="h-5 w-5" />}
                    color="orange"
                />
                <StatCard
                    title="Avg Open Rate"
                    value={`${stats.average_open_rate || 0}%`}
                    icon={<Eye className="h-5 w-5" />}
                    color="purple"
                />
            </div>

            <div className="mb-6 flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-900">Email Campaigns</h2>
                <Button onClick={() => setShowForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Campaign
                </Button>
            </div>

            {showForm && (
                <AdminCard title={editing ? 'Edit Campaign' : 'Create Campaign'} className="mb-6">
                    <form onSubmit={submit}>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <FormInput
                                label="Campaign Name"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                error={errors.name}
                                required
                            />
                            <FormInput
                                label="Subject"
                                value={form.subject}
                                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                                error={errors.subject}
                                required
                            />
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Content</label>
                                <textarea
                                    value={form.content}
                                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                    rows={6}
                                    required
                                />
                                {errors.content && (
                                    <p className="text-xs text-red-600 mt-1">{errors.content}</p>
                                )}
                            </div>
                            <FormInput
                                label="Template"
                                value={form.template}
                                onChange={(e) => setForm({ ...form, template: e.target.value })}
                                error={errors.template}
                            />
                            <FormInput
                                label="Schedule For (Optional)"
                                type="datetime-local"
                                value={form.scheduled_at}
                                onChange={(e) => setForm({ ...form, scheduled_at: e.target.value })}
                                error={errors.scheduled_at}
                            />
                        </div>

                        <div className="mt-6 flex gap-2">
                            <Button type="submit">{editing ? 'Update' : 'Create'} Campaign</Button>
                            <Button
                                type="button"
                                onClick={resetForm}
                                variant="secondary"
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </AdminCard>
            )}

            <AdminCard>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="px-4 py-3 text-left text-xs font-bold text-gray-600">Campaign</th>
                                <th className="px-4 py-3 text-left text-xs font-bold text-gray-600">Subject</th>
                                <th className="px-4 py-3 text-left text-xs font-bold text-gray-600">Status</th>
                                <th className="px-4 py-3 text-left text-xs font-bold text-gray-600">Recipients</th>
                                <th className="px-4 py-3 text-left text-xs font-bold text-gray-600">Sent</th>
                                <th className="px-4 py-3 text-left text-xs font-bold text-gray-600">Open Rate</th>
                                <th className="px-4 py-3 text-left text-xs font-bold text-gray-600">Click Rate</th>
                                <th className="px-4 py-3 text-left text-xs font-bold text-gray-600">Scheduled</th>
                                <th className="px-4 py-3 text-right text-xs font-bold text-gray-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {campaigns.length > 0 ? (
                                campaigns.map((campaign) => (
                                    <tr key={campaign.id} className="border-b border-gray-100">
                                        <td className="px-4 py-3">
                                            <span className="text-sm font-semibold text-gray-900">{campaign.name}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-sm text-gray-700">{campaign.subject}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <StatusBadge
                                                active={campaign.status === 'sent'}
                                                label={campaign.status}
                                                color={getStatusColor(campaign.status)}
                                            />
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-sm text-gray-700">{campaign.total_recipients}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-sm text-gray-700">{campaign.sent_count}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-sm text-gray-700">{campaign.open_rate}%</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-sm text-gray-700">{campaign.click_rate}%</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-sm text-gray-600">
                                                {campaign.scheduled_at
                                                    ? new Date(campaign.scheduled_at).toLocaleString()
                                                    : '-'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex justify-end gap-2">
                                                {campaign.status === 'draft' && (
                                                    <button
                                                        onClick={() => sendCampaign(campaign)}
                                                        className="text-green-600 hover:text-green-700"
                                                        title="Send Campaign"
                                                    >
                                                        <Send className="h-4 w-4" />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => edit(campaign)}
                                                    className="text-blue-600 hover:text-blue-700"
                                                    title="Edit"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => destroy(campaign)}
                                                    className="text-red-600 hover:text-red-700"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="9" className="px-4 py-8 text-center text-gray-500">
                                        No email campaigns found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </AdminCard>
        </AdminLayout>
    );
}
