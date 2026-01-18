'use client';

import Card from '@components/ui/Card';
import Input from '@components/ui/Input';
import Button from '@components/ui/Button';
import { Table } from '@components/ui/Table';
import { devices, loginActivity } from '@data/mockData';
import { useMemo, useState } from 'react';

export default function SecuritySettingsPage() {
  const [twoFA, setTwoFA] = useState(false);

  const recoveryCodes = useMemo(() => {
    return Array.from({ length: 6 }).map((_, i) => {
      const rnd = Math.floor(Math.random() * 9000) + 1000;
      return `RC-${1000 + i}-${rnd}`;
    });
  }, [twoFA]);

  return (
    <div className="space-y-6">
      <Card className="p-4 space-y-4">
        <h2 className="text-lg font-semibold">Change Password</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input label="Current password" type="password" />
          <Input label="New password" type="password" />
          <Input label="Confirm new password" type="password" />
        </div>
        <Button onClick={() => alert('Password updated (demo)')}>Update password</Button>
      </Card>

      <Card className="p-4 space-y-4">
        <h2 className="text-lg font-semibold">Two-Factor Authentication</h2>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={twoFA} onChange={e => setTwoFA(e.target.checked)} />
          <span>Enable 2FA (UI only)</span>
        </label>
        {twoFA && (
          <div className="rounded-md bg-border p-3 text-sm">
            Recovery codes:
            <ul className="mt-2 grid grid-cols-2 gap-2">
              {recoveryCodes.map(code => (
                <li key={code} className="rounded bg-surface px-2 py-1">{code}</li>
              ))}
            </ul>
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-3">Devices &amp; Sessions</h3>
          <Table headers={['Device', 'Location', 'Last Active']}>
            {devices.map(d => (
              <tr key={d.id}>
                <td className="px-4 py-2">{d.device}</td>
                <td className="px-4 py-2">{d.location}</td>
                <td className="px-4 py-2">{d.lastActive}</td>
              </tr>
            ))}
          </Table>
        </Card>

        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-3">Login Activity</h3>
          <Table headers={['Time', 'IP', 'Status']}>
            {loginActivity.map(l => (
              <tr key={l.id}>
                <td className="px-4 py-2">{l.time}</td>
                <td className="px-4 py-2">{l.ip}</td>
                <td className="px-4 py-2">{l.status}</td>
              </tr>
            ))}
          </Table>
        </Card>
      </div>
    </div>
  );
}
