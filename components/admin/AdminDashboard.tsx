"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import StaffTab from './StaffTab'
import PromotionsTab from './PromotionsTab'
import HoursTab from './HoursTab'
import AnnouncementTab from './AnnouncementTab'

const TABS = ['Staff', 'Promotions', 'Hours', 'Announcement'] as const
type Tab = typeof TABS[number]

export default function AdminDashboard() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('Staff')

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  return (
    <>
      <div className="admin-header">
        <div className="admin-header-logo">Ido<span>·</span>Hair <span style={{ fontSize: '0.7rem', letterSpacing: '0.15em', color: 'rgba(248,245,240,0.4)', textTransform: 'uppercase', marginLeft: 8 }}>Admin</span></div>
        <div className="admin-header-right">
          <a href="/" target="_blank" style={{ color: 'rgba(248,245,240,0.5)', textDecoration: 'none', fontSize: '0.78rem' }}>View site ↗</a>
          <button className="admin-header-logout" onClick={logout}>Sign out</button>
        </div>
      </div>

      <div className="admin-tabs">
        {TABS.map(t => (
          <button key={t} className={`admin-tab${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>

      <div className="admin-content">
        {tab === 'Staff'        && <StaffTab />}
        {tab === 'Promotions'   && <PromotionsTab />}
        {tab === 'Hours'        && <HoursTab />}
        {tab === 'Announcement' && <AnnouncementTab />}
      </div>
    </>
  )
}
