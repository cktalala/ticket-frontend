import api from "./api";
import {
  TicketListResponse,
  ApiResponse,
  QueryTicketsDto,
  Ticket,
  CreateTicketDto,
} from "@/types/ticket";

export const TicketService = {
  getTickets: async (params?: QueryTicketsDto): Promise<TicketListResponse> => {
    const queryParams = new URLSearchParams();

    if (params) {
      if (params.status) {
        if (Array.isArray(params.status)) {
          params.status.forEach((status) =>
            queryParams.append("status", status)
          );
        } else {
          queryParams.append("status", params.status);
        }
      }

      if (params.priority) {
        if (Array.isArray(params.priority)) {
          params.priority.forEach((priority) =>
            queryParams.append("priority", priority)
          );
        } else {
          queryParams.append("priority", params.priority);
        }
      }

      if (params.search) queryParams.append("search", params.search);
      if (params.page) queryParams.append("page", params.page.toString());
      if (params.pageSize)
        queryParams.append("pageSize", params.pageSize.toString());
      if (params.sortBy) queryParams.append("sortBy", params.sortBy);
      if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);
    }

    const url = `/tickets${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    const response = await api.get<ApiResponse<TicketListResponse>>(url);
    return response.data.data;
  },

  createTicket: async (
    params: CreateTicketDto
  ): Promise<ApiResponse<Ticket>> => {
    const response = await api.post<ApiResponse<Ticket>>("/tickets", params);
    return response.data;
  },
};
