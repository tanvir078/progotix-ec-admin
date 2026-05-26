import { router } from '@/lib/inertiaCompat';
import { useState } from 'react';
import AdminLayout, { AdminCard, StatusBadge } from '@/components/AdminLayout';
import StatCard from '@/components/ui/StatCard';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import { CheckCircle, MessageSquare, Star, Trash2, XCircle } from 'lucide-react';

function stars(value) {
  return '★'.repeat(Number(value || 0)).padEnd(5, '☆');
}

export default function AdminReviewsPage({ reviews = [], metrics = [], status }) {
  const [statusFilter, setStatusFilter] = useState('');
  const [replyDrafts, setReplyDrafts] = useState({});
  const [errors, setErrors] = useState({});

  const filteredReviews = statusFilter
    ? reviews.filter((review) => review.status === statusFilter)
    : reviews;

  const updateReview = (review, data) => {
    router.patch(`/admin/reviews/${review.id}`, data, {
      preserveScroll: true,
      onError: setErrors,
    });
  };

  const saveReply = (review) => {
    updateReview(review, {
      admin_reply: replyDrafts[review.id] ?? review.admin_reply ?? '',
    });
  };

  const destroy = (review) => {
    if (window.confirm(`Delete review from ${review.customer_name}?`)) {
      router.delete(`/admin/reviews/${review.id}`, { preserveScroll: true });
    }
  };

  const totalReviews = metrics[0]?.value ?? reviews.length;
  const pendingReviews = metrics[1]?.value ?? reviews.filter((review) => review.status === 'pending').length;
  const approvedReviews = metrics[2]?.value ?? reviews.filter((review) => review.status === 'approved').length;
  const averageRating = metrics[3]?.value ?? '0.00';

  return (
    <AdminLayout title="Reviews">
      {status && (
        <div className="mb-5 rounded-xl border border-success bg-success-light px-5 py-3 text-sm font-bold text-success-dark">
          {status}
        </div>
      )}

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Reviews" value={totalReviews} icon={MessageSquare} />
        <StatCard label="Pending" value={pendingReviews} icon={MessageSquare} />
        <StatCard label="Approved" value={approvedReviews} icon={CheckCircle} />
        <StatCard label="Average Rating" value={averageRating} icon={Star} />
      </div>

      <AdminCard
        title={`Review Queue (${filteredReviews.length})`}
        action={
          <Select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option value="">All statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </Select>
        }
      >
        {Object.keys(errors).length > 0 && (
          <div className="mb-4 rounded-xl border border-danger bg-danger-light px-4 py-3 text-sm font-bold text-danger">
            {Object.values(errors).flat()[0]}
          </div>
        )}

        <div className="space-y-4">
          {filteredReviews.length === 0 && (
            <div className="py-10 text-center text-sm font-bold text-slate-400">
              No reviews found.
            </div>
          )}

          {filteredReviews.map((review) => (
            <div key={review.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-black text-slate-950">{review.product?.name || 'Deleted product'}</p>
                    <StatusBadge value={review.status} />
                    {review.verified_purchase && <StatusBadge value="verified" />}
                  </div>
                  <p className="mt-1 text-sm font-semibold text-slate-500">
                    {review.customer_name} {review.customer_email ? `- ${review.customer_email}` : ''}
                  </p>
                  <p className="mt-3 text-lg font-black text-amber-500">{stars(review.rating)}</p>
                  {review.title && <p className="mt-2 font-black text-slate-900">{review.title}</p>}
                  <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">{review.comment}</p>
                  {review.admin_reply && (
                    <div className="mt-4 rounded-xl bg-slate-50 p-4">
                      <p className="text-xs font-black uppercase tracking-wide text-slate-400">Admin Reply</p>
                      <p className="mt-1 text-sm font-semibold text-slate-700">{review.admin_reply}</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 lg:justify-end">
                  <Button size="sm" variant="success" onClick={() => updateReview(review, { status: 'approved' })}>
                    <CheckCircle className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => updateReview(review, { status: 'pending' })}>
                    Pending
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => updateReview(review, { status: 'rejected' })}>
                    <XCircle className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => destroy(review)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto]">
                <textarea
                  value={replyDrafts[review.id] ?? review.admin_reply ?? ''}
                  onChange={(event) => setReplyDrafts((current) => ({ ...current, [review.id]: event.target.value }))}
                  className="min-h-20 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="Write or update admin reply"
                />
                <Button onClick={() => saveReply(review)} className="self-start">
                  Save Reply
                </Button>
              </div>
            </div>
          ))}
        </div>
      </AdminCard>
    </AdminLayout>
  );
}
