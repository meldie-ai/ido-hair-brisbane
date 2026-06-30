"use client"

import { useEffect, useState } from 'react'
import type { Promotion } from '@/lib/types'

const EMPTY: Omit<Promotion, 'id'> = {
  label: '', discount_percent: null, description: null,
  time_window_start: '09:45', time_window_end: '11:00', is_active: true,
}

export default function PromotionsTab() {
  const [promos, setPromos] = useState<Promotion[]>([])
  const [editing, setEditing] = useState<Promotion | null>(null)
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => { load() }, [])

  async function load() {
    const res = await fetch('/api/promotions')
    setPromos(await res.json())
  }

  async function toggle(p: Promotion) {
    await fetch(`/api/promotions/${p.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: !p.is_active }),
    })
    await load()
  }

  function openEdit(p: Promotion) {
    setAdding(false)
    setForm({ label: p.label, discount_percent: p.discount_percent, description: p.description, time_window_start: p.time_window_start, time_window_end: p.time_window_end, is_active: p.is_active })
    setEditing(p)
  }

  function openAdd() {
    setEditing(null)
    setForm(EMPTY)
    setAdding(true)
  }

  async function save() {
    setSaving(true)
    setMsg(null)
    try {
      const res = editing
        ? await fetch(`/api/promotions/${editing.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
        : await fetch('/api/promotions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      if (!res.ok) throw new Error((await res.json()).error)
      setMsg({ type: 'success', text: editing ? 'Promotion updated.' : 'Promotion added.' })
      setEditing(null)
      setAdding(false)
      await load()
    } catch (e: unknown) {
      setMsg({ type: 'error', text: e instanceof Error ? e.message : 'Something went wrong.' })
    }
    setSaving(false)
  }

  async function remove(id: string) {
    if (!confirm('Delete this promotion?')) return
    await fetch(`/api/promotions/${id}`, { method: 'DELETE' })
    await load()
  }

  const showForm = adding || !!editing

  return (
    <div>
      <div className="admin-section-title">Promotions</div>
      <div className="admin-section-sub">Toggle promotions on or off — inactive ones are hidden from the public site.</div>

      {msg && <div className={msg.type === 'success' ? 'admin-success' : 'admin-error'}>{msg.text}</div>}

      {promos.map(p => (
        <div key={p.id}>
          <div className="admin-toggle-row">
            <div style={{ flex: 1 }}>
              <div className="admin-toggle-label">
                {p.label}{p.discount_percent != null ? ` — ${p.discount_percent}% off` : ''}
              </div>
              <div className="admin-toggle-sub">
                {p.time_window_start && p.time_window_end
                  ? `${p.time_window_start} – ${p.time_window_end}`
                  : 'No time window set'}
                {p.description ? ` · ${p.description}` : ''}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <label className="admin-toggle">
                <input type="checkbox" checked={p.is_active} onChange={() => toggle(p)} />
                <span className="admin-toggle-slider" />
              </label>
              <button className="admin-btn secondary sm" onClick={() => openEdit(p)}>Edit</button>
              <button className="admin-btn danger sm" onClick={() => remove(p.id)}>Delete</button>
            </div>
          </div>
        </div>
      ))}

      {!showForm && (
        <button className="admin-add-btn" onClick={openAdd}>+ Add promotion</button>
      )}

      {showForm && (
        <div className="admin-form">
          <div className="admin-form-title">{editing ? 'Edit promotion' : 'New promotion'}</div>
          <div className="admin-form-row-2">
            <div className="admin-form-row" style={{ marginBottom: 0 }}>
              <label>Label</label>
              <input className="admin-input" value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))} placeholder="e.g. Tue – Fri" />
            </div>
            <div className="admin-form-row" style={{ marginBottom: 0 }}>
              <label>Discount %</label>
              <input className="admin-input" type="number" value={form.discount_percent ?? ''} onChange={e => setForm(f => ({ ...f, discount_percent: e.target.value ? Number(e.target.value) : null }))} placeholder="e.g. 20" />
            </div>
          </div>
          <div className="admin-form-row" style={{ marginTop: 16 }}>
            <label>Description</label>
            <input className="admin-input" value={form.description ?? ''} onChange={e => setForm(f => ({ ...f, description: e.target.value || null }))} placeholder="Short description for the public site" />
          </div>
          <div className="admin-form-row-2" style={{ marginTop: 0 }}>
            <div className="admin-form-row" style={{ marginBottom: 0 }}>
              <label>Time window start</label>
              <input className="admin-input" type="time" value={form.time_window_start ?? ''} onChange={e => setForm(f => ({ ...f, time_window_start: e.target.value || null }))} />
            </div>
            <div className="admin-form-row" style={{ marginBottom: 0 }}>
              <label>Time window end</label>
              <input className="admin-input" type="time" value={form.time_window_end ?? ''} onChange={e => setForm(f => ({ ...f, time_window_end: e.target.value || null }))} />
            </div>
          </div>
          <div className="admin-form-actions">
            <button className="admin-btn sm" style={{ width: 'auto', marginTop: 0 }} onClick={save} disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </button>
            <button className="admin-btn secondary sm" onClick={() => { setAdding(false); setEditing(null) }}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  )
}
