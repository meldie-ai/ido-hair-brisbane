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
