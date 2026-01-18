'use client';

import Card from '@components/ui/Card';
import Select from '@components/ui/Select';
import Button from '@components/ui/Button';
import Modal from '@components/ui/Modal';
import { useState } from 'react';

export default function AccountSettingsPage() {
  const [currency, setCurrency] = useState('USD');
  const [language, setLanguage] = useState('English');
  const [timezone, setTimezone] = useState('GMT+01:00');
  const [confirmClose, setConfirmClose] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  return (
    <div className="space-y-6">
      <Card className="p-4 space-y-4">
        <h2 className="text-lg font-semibold">Preferences</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select label="Currency" value={currency} onChange={e => setCurrency(e.target.value)}>
            <option>USD</option>
            <option>EUR</option>
            <option>NGN</option>
          </Select>
          <Select label="Language" value={language} onChange={e => setLanguage(e.target.value)}>
            <option>English</option>
            <option>French</option>
          </Select>
          <Select label="Timezone" value={timezone} onChange={e => setTimezone(e.target.value)}>
            <option>GMT+01:00</option>
            <option>GMT+00:00</option>
            <option>GMT+02:00</option>
          </Select>
        </div>
      </Card>

      <Card className="p-4 space-y-4 border border-danger/40">
        <h3 className="text-lg font-semibold text-danger">Danger Zone</h3>
        <p className="text-sm text-muted">Closing your account is irreversible.</p>
        <Button variant="danger" onClick={() => setConfirmClose(true)}>Close account</Button>
      </Card>

      <Modal open={confirmClose} onClose={() => { setConfirmClose(false); setConfirmText(''); }} title="Confirm account closure">
        <p className="text-sm text-muted">Type <strong>CLOSE</strong> to confirm.</p>
        <input className="w-full rounded-md bg-surface border border-border px-3 py-2" placeholder="CLOSE" value={confirmText} onChange={e => setConfirmText(e.target.value)} />
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => { setConfirmClose(false); setConfirmText(''); }}>Cancel</Button>
          <Button variant="danger" disabled={confirmText !== 'CLOSE'} onClick={() => { setConfirmClose(false); setConfirmText(''); alert('Account closure requested (UI only)'); }}>Confirm</Button>
        </div>
      </Modal>
    </div>
  );
}
