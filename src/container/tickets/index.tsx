"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Card, Input, Select, Button, Pagination, message } from "antd";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";
import styled from "styled-components";
import {
  Ticket,
  TicketStatus,
  TicketPriority,
  TicketFilters,
  TicketSort,
  TicketListParams,
  QueryTicketsDto,
  SortBy,
  SortOrder,
} from "@/types/ticket";
import {
  TicketList,
  TicketSkeleton,
  EmptyState,
  ErrorState,
} from "./components";
import { TicketService } from "@/services/ticket";
import { useDebounce } from "@/hooks/use-debounce";

const TicketsContainer: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<TicketFilters>({});
  const [sort, setSort] = useState<TicketSort>({
    field: "createdAt",
    order: "desc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchValue, setSearchValue] = useState("");
  const [totalTickets, setTotalTickets] = useState(0);

  const debouncedSearchValue = useDebounce(searchValue, 500);

  const mapSortToDto = (sort: TicketSort) => {
    const sortByMap: Record<string, SortBy> = {
      createdAt: SortBy.CREATED_AT,
      updatedAt: SortBy.UPDATED_AT,
      title: SortBy.TITLE,
      priority: SortBy.PRIORITY,
      status: SortBy.STATUS,
    };

    return {
      sortBy: sortByMap[sort.field],
      sortOrder: sort.order === "asc" ? SortOrder.ASC : SortOrder.DESC,
    };
  };

  const loadTickets = useCallback(async (params: TicketListParams) => {
    try {
      setLoading(true);
      setError(null);

      const queryParams: QueryTicketsDto = {
        page: params.page,
        pageSize: params.pageSize,
        search: params.filters?.search,
        status: params.filters?.status,
        priority: params.filters?.priority,
        ...mapSortToDto(params.sort!),
      };

      const response = await TicketService.getTickets(queryParams);

      setTickets(response.tickets);
      setTotalTickets(response.meta.total);
    } catch (err) {
      setError("Failed to load tickets. Please try again.");
      message.error("Failed to load tickets");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const params: TicketListParams = {
      page: currentPage,
      pageSize,
      filters: {
        ...filters,
        search: debouncedSearchValue || undefined,
      },
      sort,
    };
    loadTickets(params);
  }, [currentPage, pageSize, filters, sort, debouncedSearchValue, loadTickets]);

  const handleSearch = (value: string) => {
    setSearchValue(value);
    setCurrentPage(1);
  };

  const handleStatusFilter = (values: TicketStatus) => {
    setFilters((prev) => ({
      ...prev,
      status: values?.length ? values : undefined,
    }));
    setCurrentPage(1);
  };

  const handlePriorityFilter = (values: TicketPriority) => {
    setFilters((prev) => ({
      ...prev,
      priority: values?.length ? values : undefined,
    }));
    setCurrentPage(1);
  };

  const handleSortChange = (field: string, order: string) => {
    setSort({ field: field as any, order: order as "asc" | "desc" });
    setCurrentPage(1);
  };

  const handleRefresh = () => {
    const params: TicketListParams = {
      page: currentPage,
      pageSize,
      filters: {
        ...filters,
        search: debouncedSearchValue || undefined,
      },
      sort,
    };
    loadTickets(params);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (error) {
    return (
      <Container>
        <ErrorState message={error} onRetry={handleRefresh} />
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Tickets</Title>
      </Header>

      <FiltersContainer>
        <FilterRow>
          <SearchInput
            placeholder="Search tickets..."
            prefix={<SearchOutlined />}
            value={searchValue}
            onChange={(e) => handleSearch(e.target.value)}
            allowClear
          />

          <FilterSelect
            placeholder="Filter by status"
            value={filters.status}
            onChange={(values) => handleStatusFilter(values as TicketStatus)}
            options={[
              { label: "Open", value: TicketStatus.OPEN },
              { label: "In Progress", value: TicketStatus.IN_PROGRESS },
              { label: "Resolved", value: TicketStatus.RESOLVED },
            ]}
            allowClear
          />

          <FilterSelect
            placeholder="Filter by priority"
            value={filters.priority}
            onChange={(values) =>
              handlePriorityFilter(values as TicketPriority)
            }
            options={[
              { label: "Low", value: TicketPriority.LOW },
              { label: "Medium", value: TicketPriority.MEDIUM },
              { label: "High", value: TicketPriority.HIGH },
            ]}
            allowClear
          />

          <SortContainer>
            <Select
              value={sort.field}
              onChange={(value) => handleSortChange(value, sort.order)}
              options={[
                { label: "Created Date", value: "createdAt" },
                { label: "Updated Date", value: "updatedAt" },
                { label: "Title", value: "title" },
                { label: "Priority", value: "priority" },
                { label: "Status", value: "status" },
              ]}
            />
            <Select
              value={sort.order}
              onChange={(value) => handleSortChange(sort.field, value)}
              options={[
                { label: "Ascending", value: "asc" },
                { label: "Descending", value: "desc" },
              ]}
            />
          </SortContainer>

          <Button
            icon={<ReloadOutlined />}
            onClick={handleRefresh}
            loading={loading}
          >
            Refresh
          </Button>
        </FilterRow>
      </FiltersContainer>

      {loading ? (
        <TicketSkeleton />
      ) : tickets.length === 0 ? (
        <EmptyState
          hasFilters={
            !!(
              filters.search ||
              filters.status?.length ||
              filters.priority?.length
            )
          }
          onClearFilters={() => {
            setFilters({});
            setSearchValue("");
            setCurrentPage(1);
          }}
        />
      ) : (
        <>
          <TicketList tickets={tickets} />
          <PaginationContainer>
            <Pagination
              current={currentPage}
              total={totalTickets}
              pageSize={pageSize}
              onChange={handlePageChange}
              showSizeChanger={false}
              showQuickJumper
              showTotal={(total, range) =>
                `${range[0]}-${range[1]} of ${total} tickets`
              }
            />
          </PaginationContainer>
        </>
      )}
    </Container>
  );
};

export default TicketsContainer;

const Container = styled.div`
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 24px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 16px 0;
  color: #1f2937;
`;

const FiltersContainer = styled(Card)`
  margin-bottom: 24px;

  .ant-card-body {
    padding: 16px;
  }
`;

const FilterRow = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
`;

const SearchInput = styled(Input)`
  max-width: 300px;

  @media (max-width: 768px) {
    max-width: none;
  }
`;

const FilterSelect = styled(Select)`
  min-width: 150px;

  @media (max-width: 768px) {
    min-width: auto;
  }
`;

const SortContainer = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 24px;
`;
