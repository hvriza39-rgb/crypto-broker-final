'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Card from '@components/ui/Card';
import Input from '@components/ui/Input';
import Select from '@components/ui/Select';
import Button from '@components/ui/Button';
import InlineAlert from '@components/ui/InlineAlert';
import Modal from '@components/ui/Modal';

type UserForm = {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  country?: string;
  balance: number;
  kycStatus: string;
  accountStatus: string;
  createdAt: string;
};

export default function AdminUserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [form, setForm] = useState<UserForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Balance management
  const [balanceModalOpen, setBalanceModalOpen] = useState(false);
  const [balanceOperation, setBalanceOperation] = useState<'add' | 'subtract'>('add');
  const [balanceAmount, setBalanceAmount] = useState('');
  const [balanceLoading, setBalanceLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(`/api/admin/users/${id}`)
      .then(async (r) => {
        if (!r.ok) {
          const data = await r.json().catch(() => ({}));
          throw new Error(data?.error || 'Failed to load user');
        }
        return r.json();
      })
      .then((data) => {
        if (cancelled) return;
        setForm(data.user);
      })
      .catch((e: any) => {
        if (cancelled) return;
        setError(e?.message || 'Failed to load user');
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  function setField<K extends keyof UserForm>(key: K, value: UserForm[K]) {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  async function onSave() {
    if (!form) return;
    setSaving(true);
    setMessage(null);
    setError(null);

    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: form.fullName,
          email: form.email,
          phone: form.phone,
          country: form.country,
          accountStatus: form.accountStatus,
          kycStatus: form.kycStatus,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || 'Update failed');
      }

      const data = await res.json();
      setForm(data.user);
      setMessage('User updated');
    } catch (e: any) {
      setError(e?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  }

  async function onResetPassword() {
    setMessage(null);
    setError(null);

    try {
      const res = await fetch(`/api/admin/users/${id}/reset-password`, { method: 'POST' });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || 'Reset failed');
      }
      setMessage('Password reset initiated');
    } catch (e: any) {
      setError(e?.message || 'Reset failed');
    }
  }

  async function onUpdateBalance() {
    if (!form) return;
    const amount = parseFloat(balanceAmount);
    if (!Number.isFinite(amount) || amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setBalanceLoading(true);
    setMessage(null);
    setError(null);

    try {
      const res = await fetch(`/api/admin/users/${id}/balance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operation: balanceOperation, amount }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || 'Balance update failed');
      }

      const data = await res.json();
      setForm(data.user);
      setMessage(`Balance ${balanceOperation === 'add' ? 'added' : 'subtracted'} successfully`);
      setBalanceModalOpen(false);
      setBalanceAmount('');
    } catch (e: any) {
      setError(e?.message || 'Balance update failed');
    } finally {
      setBalanceLoading(false);
    }
  }

  if (loading) return <div className="text-muted">Loading...</div>;
  if (error) return <InlineAlert variant="error">{error}</InlineAlert>;
  if (!form) return <InlineAlert variant="error">User not found</InlineAlert>;

  return (
    <div className="space-y-4">
      {message && <InlineAlert variant="success">{message}</InlineAlert>}
      {error && <InlineAlert variant="error">{error}</InlineAlert>}

      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">User: {form.fullName}</h2>
          <Button variant="secondary" onClick={() => router.back()}>
            Back
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Full name" value={form.fullName} onChange={(e) => setField('fullName', e.target.value)} />
          <Input label="Email" value={form.email} onChange={(e) => setField('email', e.target.value)} />
          <Input label="Phone" value={form.phone || ''} onChange={(e) => setField('phone', e.target.value)} />
          <Input label="Country" value={form.country || ''} onChange={(e) => setField('country', e.target.value)} />

          <Select label="Account status" value={form.accountStatus} onChange={(e) => setField('accountStatus', e.target.value)}>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="closed">Closed</option>
          </Select>

          <Select label="KYC status" value={form.kycStatus} onChange={(e) => setField('kycStatus', e.target.value)}>
            <option value="pending">Pending</option>
            <option value="verified">Verified</option>
            <option value="rejected">Rejected</option>
          </Select>

          <div>
            <label className="block text-sm mb-1 text-muted">Balance</label>
            <div className="flex gap-2">
              <Input
                value={`$${form.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                readOnly
                className="flex-1"
              />
              <Button onClick={() => setBalanceModalOpen(true)}>Adjust</Button>
            </div>
          </div>
          <Input label="Created at" value={new Date(form.createdAt).toLocaleString()} readOnly />
        </div>

        <div className="flex flex-wrap gap-3">
          <Button onClick={onSave} loading={saving} disabled={saving}>
            {saving ? 'Saving...' : 'Save changes'}
          </Button>
          <Button variant="danger" onClick={onResetPassword}>
            Reset password
          </Button>
        </div>
      </Card>

      <Modal
        open={balanceModalOpen}
        title="Adjust User Balance"
        onClose={() => {
          setBalanceModalOpen(false);
          setBalanceAmount('');
        }}
      >
        <div className="space-y-4">
          <div className="text-sm text-muted">
            Current balance:{' '}
            <span className="font-semibold text-text">
              ${form.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          <Select
            label="Operation"
            value={balanceOperation}
            onChange={(e) => setBalanceOperation(e.target.value as 'add' | 'subtract')}
          >
            <option value="add">Add to balance</option>
            <option value="subtract">Subtract from balance</option>
          </Select>

          <Input
            label="Amount ($)"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={balanceAmount}
            onChange={(e) => setBalanceAmount(e.target.value)}
          />

          <div className="flex justify-end gap-2">
            <Button
              variant="secondary"
              onClick={() => {
                setBalanceModalOpen(false);
                setBalanceAmount('');
              }}
            >
              Cancel
            </Button>
            <Button onClick={onUpdateBalance} loading={balanceLoading} disabled={balanceLoading || !balanceAmount}>
              {balanceLoading ? 'Processing...' : 'Update Balance'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
