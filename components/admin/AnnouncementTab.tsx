"use client"

import { useEffect, useState } from 'react'
import type { Announcement } from '@/lib/types'

export default function AnnouncementTab() {
  const [data, setData] = useState<Announcement | null>(null)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => { load() }, [])

  async function load() {
    const res = await fetch('/api/announcement')
    const json = await res.json()
    setData(json)
  }

  async function save() {
    if (!data) return
    setSaving(true)
    setMsg(null)
    const res = await fetch('/api/announcement', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message_text: data.message_text, is_active: data.is_active }),
    })
    if (res.ok) {
      setMsg({ type: 'success', text: 'Announcement saved.' })
    } else {
      setMsg({ type: 'error', text: 'Failed to save. Please try again.' })
    }
    setSaving(false)
  }

  if (!data) return <div style={{ color: 'var(--soft)', fontSize: '0.9rem' }}>Loading…</div>

  return (
    <div>
      <div className="admin-section-title">Announcement Strip</div>
      <div className="admin-section-sub">The scrolling bar at the top of the site. Toggle it off to hide it entirely.</div>

      {msg && <div className={msg.type === 'success' ? 'admin-success' : 'admin-error'}>{msg.text}</div>}

      <div style={{ background: 'white', border: '1px solid var(--mist)', borderRadius: 4, padding: '20px 24px', marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--charcoal)' }}>
            Show announcement
          </div>
          <label className="admin-toggle">
            <input type="checkbox" checked={data.is_active} onChange={e => setData(d => d ? { ...d, is_active: e.target.checked } : d)} />
            <span className="admin-toggle-slider" />
          </label>
        </div>
        <div className="admin-form-row" style={{ marginBottom: 0 }}>
          <label>Message text</label>
          <textarea
            className="admin-announcement-textarea"
            value={data.message_text}
            onChange={e => setData(d => d ? { ...d, message_text: e.target.value } : d)}
            placeholder="e.g. Morning Special 9:45–11:00 am · Tue–Fri 20% off · Pre-book 1 day ahead"
          />
        </div>
      </div>

      <div className="admin-form-row" style={{ marginBottom: 0 }}>
        <label style={{ fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--soft)', display: 'block', marginBottom: 8 }}>Preview</label>
        {data.is_active
          ? <div className="admin-preview-strip">{data.message_text}</div>
          : <div style={{ background: 'var(--mist)', borderRadius: 4, padding: '12px 16px', fontSize: '0.82rem', color: 'var(--soft)', textAlign: 'center' }}>Strip is hidden</div>
        }
      </div>

      <div style={{ marginTop: 20 }}>
        <button className="admin-btn" style={{ width: 'auto' }} onClick={save} disabled={saving}>
          {saving ? 'Saving…' : 'Save Announcement'}
        </button>
      </div>
    </div>
  )
}
