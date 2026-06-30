export type StaffMember = {
  id: string
  name: string
  role: string
  photo_url: string | null
  display_order: number
}

export type Promotion = {
  id: string
  label: string
  discount_percent: number | null
  description: string | null
  time_window_start: string | null
  time_window_end: string | null
  is_active: boolean
}

export type BusinessHour = {
  id: string
  day_of_week: number
  open_time: string | null
  close_time: string | null
  is_closed: boolean
}

export type Announcement = {
  id: string
  message_text: string
  is_active: boolean
}
