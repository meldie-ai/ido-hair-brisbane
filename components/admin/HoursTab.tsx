"use client"

import { useEffect, useState } from 'react'
import type { BusinessHour } from '@/lib/types'

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export default function HoursTab() {
  const [hours, setHours] = useState<BusinessHour[]>([])
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => { load() }, [])

  async function load() {
    const res = await fetch('/api/hours')
    setHours(await res.json())
  }

  function update(index: number, field: keyof BusinessHour, value: string | boolean) {
    setHours(h => h.map((row, i) => i === index ? { ...row, [field]: value } : row))
  }

  async function save() {
    setSaving(true)
    setMsg(null)
    const res = await fetch('/api/hours', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hours }),
    })
    if (res.ok) {
      setMsg({ type: 'success', text: 'Hours saved.' })
    } else {
      setMsg({ type: 'error', text: 'Failed to save. Please try again.' })
    }
    setSaving(false)
  }

  return (
    <div>
      <div className="admin-section-title">Business Hours</div>
      <div className="admin-section-sub">Set opening and closing times for each day. Tick "Closed" for public holidays.</div>

      {msg && <div className={msg.type === 'success' ? 'admin-success' : 'admin-error'}>{msg.text}</div>}

      <table className="admin-hours-table">
        <thead>
          <tr>
            <th>Day</th>
            <th>Opens</th>
            <th>Closes</th>
            <th>Closed</th>
          </tr>
        </thead>
        <tbody>
          {hours.map((row, i) => (
            <tr key={row.day_of_week}>
              <td style={{ fontWeight: 500 }}>{DAY_NAMES[row.day_of_week]}</td>
              <td>
                <input
                  className="admin-hours-input"
                  type="time"
                  value={row.open_time ?? ''}
                  disabled={row.is_closed}
                  onChange={e => update(i, 'open_time', e.target.value)}
                />
              </td>
              <td>
                <input
                  className="admin-hours-input"
                  type="time"
                  value={row.close_time ?? ''}
                  disabled={row.is_closed}
                  onChange={e => update(i, 'close_time', e.target.value)}
                />
              </td>
              <td>
                <label className="admin-toggle" style={{ display: 'inline-flex' }}>
                  <input
                    type="checkbox"
                    checked={row.is_closed}
                    onChange={e => update(i, 'is_closed', e.target.checked)}
                  />
                  <span className="admin-toggle-slider" />
                </label>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: 20 }}>
        <button className="admin-btn" style={{ width: 'auto' }} onClick={save} disabled={saving}>
          {saving ? 'Saving…' : 'Save Hours'}
        </button>
      </div>
    </div>
  )
}
