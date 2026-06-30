"use client"

import { useEffect, useState, useRef } from 'react'
import type { StaffMember } from '@/lib/types'

const EMPTY: Omit<StaffMember, 'id' | 'display_order'> = { name: '', role: '', photo_url: null }

export default function StaffTab() {
  const [staff, setStaff] = useState<StaffMember[]>([])
  const [editing, setEditing] = useState<StaffMember | null>(null)
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => { load() }, [])

  async function load() {
    const res = await fetch('/api/staff')
    setStaff(await res.json())
  }

  function openAdd() {
    setEditing(null)
    setForm(EMPTY)
    setPhotoFile(null)
    setPhotoPreview(null)
    setAdding(true)
  }

  function openEdit(s: StaffMember) {
    setAdding(false)
    setForm({ name: s.name, role: s.role, photo_url: s.photo_url })
    setPhotoFile(null)
    setPhotoPreview(s.photo_url)
    setEditing(s)
  }

  function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setPhotoFile(file)
    setPhotoPreview(URL.createObjectURL(file))
  }

  async function uploadPhoto(): Promise<string | null> {
    if (!photoFile) return form.photo_url
    const fd = new FormData()
    fd.append('file', photoFile)
    const res = await fetch('/api/upload', { method: 'POST', body: fd })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error)
    return data.url
  }

  async function save() {
    setSaving(true)
    setMsg(null)
    try {
      const photo_url = await uploadPhoto()
      const payload = { ...form, photo_url }
      let res
      if (editing) {
        res = await fetch(`/api/staff/${editing.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      } else {
        res = await fetch('/api/staff', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      }
      if (!res.ok) throw new Error((await res.json()).error)
      setMsg({ type: 'success', text: editing ? 'Staff member updated.' : 'Staff member added.' })
      setEditing(null)
      setAdding(false)
      await load()
    } catch (e: unknown) {
      setMsg({ type: 'error', text: e instanceof Error ? e.message : 'Something went wrong.' })
    }
    setSaving(false)
  }

  async function remove(id: string) {
    if (!confirm('Delete this staff member?')) return
    await fetch(`/api/staff/${id}`, { method: 'DELETE' })
    await load()
  }

  async function move(index: number, dir: -1 | 1) {
    const next = [...staff]
    const target = next[index + dir]
    const current = next[index]
    // Swap display_order values
    await Promise.all([
      fetch(`/api/staff/${current.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ display_order: target.display_order }),
      }),
      fetch(`/api/staff/${target.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ display_order: current.display_order }),
      }),
    ])
    await load()
  }

  const showForm = adding || !!editing

  return (
    <div>
      <div className="admin-section-title">Staff</div>
      <div className="admin-section-sub">Manage the team shown on the public site. Use the arrows to control display order.</div>

      {msg && <div className={msg.type === 'success' ? 'admin-success' : 'admin-error'}>{msg.text}</div>}

      {staff.map((s, i) => (
        <div className="admin-card" key={s.id}>
          <div className="admin-order-btns">
            <button className="admin-order-btn" onClick={() => move(i, -1)} disabled={i === 0}>▲</button>
            <button className="admin-order-btn" onClick={() => move(i, 1)} disabled={i === staff.length - 1}>▼</button>
          </div>
          <div className="admin-card-avatar">
            {s.photo_url
              ? <img src={s.photo_url} alt={s.name} />
              : '✂️'
            }
          </div>
          <div className="admin-card-info">
            <div className="admin-card-name">{s.name}</div>
            <div className="admin-card-role">{s.role}</div>
          </div>
          <div className="admin-card-actions">
            <button className="admin-btn secondary sm" onClick={() => openEdit(s)}>Edit</button>
            <button className="admin-btn danger sm" onClick={() => remove(s.id)}>Delete</button>
          </div>
        </div>
      ))}

      {!showForm && (
        <button className="admin-add-btn" onClick={openAdd}>+ Add staff member</button>
      )}

      {showForm && (
        <div className="admin-form">
          <div className="admin-form-title">{editing ? 'Edit staff member' : 'New staff member'}</div>
          <div className="admin-form-row-2">
            <div className="admin-form-row" style={{ marginBottom: 0 }}>
              <label>Name</label>
              <input className="admin-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Andy" />
            </div>
            <div className="admin-form-row" style={{ marginBottom: 0 }}>
              <label>Role / Specialty</label>
              <input className="admin-input" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} placeholder="e.g. Nanoplasty Specialist" />
            </div>
          </div>
          <div className="admin-form-row" style={{ marginTop: 16 }}>
            <label>Photo</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              {photoPreview && <img src={photoPreview} alt="preview" className="admin-photo-preview" />}
              <div className="admin-upload-area" style={{ flex: 1 }} onClick={() => fileRef.current?.click()}>
                {photoFile ? photoFile.name : 'Click to upload photo (JPG, PNG)'}
              </div>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhoto} />
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
