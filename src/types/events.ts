export interface Event {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  location: string;
  category: EventCategory;
  status: EventStatus;
  max_attendees: number | null;
  current_attendees: number;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  // Computed fields
  creator_email?: string;
  is_registered?: boolean;
}

export type EventCategory = 'social' | 'academico' | 'cultural' | 'comercial' | 'taller' | 'otro';

export type EventStatus = 'proximo' | 'en_curso' | 'finalizado' | 'cancelado';

export interface EventAttendee {
  id: string;
  event_id: string;
  user_id: string;
  registered_at: string;
  status: 'confirmado' | 'pendiente' | 'cancelado';
  // Computed fields
  user_email?: string;
}

export interface EventFilters {
  startDate?: string;
  endDate?: string;
  category?: EventCategory | 'all';
  status?: EventStatus | 'all';
  search?: string;
}

export interface CalendarView {
  type: 'month' | 'week' | 'day';
  date: Date;
}