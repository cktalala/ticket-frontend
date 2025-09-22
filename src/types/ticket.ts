export interface Ticket {
  id: number;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  createdAt: string;
  updatedAt: string | null;
}

export enum TicketStatus {
  OPEN = "OPEN",
  IN_PROGRESS = "IN_PROGRESS",
  RESOLVED = "RESOLVED",
}

export enum TicketPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

export interface TicketFilters {
  status?: TicketStatus;
  priority?: TicketPriority;
  search?: string;
}

export interface TicketSort {
  field: "createdAt" | "updatedAt" | "title" | "priority" | "status";
  order: "asc" | "desc";
}

export interface TicketListParams {
  page: number;
  pageSize: number;
  filters?: TicketFilters;
  sort?: TicketSort;
}

export interface TicketListResponse {
  tickets: Ticket[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

export interface ApiResponse<T> {
  status: number;
  data: T;
  message: string;
}

export enum SortBy {
  CREATED_AT = "createdAt",
  UPDATED_AT = "updatedAt",
  TITLE = "title",
  PRIORITY = "priority",
  STATUS = "status",
}

export enum SortOrder {
  ASC = "asc",
  DESC = "desc",
}

// Aliases for consistency with backend DTO
export const Status = TicketStatus;
export const Priority = TicketPriority;
export type Status = TicketStatus;
export type Priority = TicketPriority;

export interface QueryTicketsDto {
  status?: Status;
  priority?: Priority;
  search?: string;
  page?: number;
  pageSize?: number;
  sortBy?: SortBy;
  sortOrder?: SortOrder;
}

export interface CreateTicketDto {
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
}

export interface UpdateTicketDto {
  title?: string;
  description?: string;
  status?: TicketStatus;
  priority?: TicketPriority;
}
