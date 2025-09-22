import React from "react";
import { Card, Tag, Typography, Space, Button, Flex } from "antd";
import { CalendarOutlined, ClockCircleOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { Ticket, TicketStatus, TicketPriority } from "@/types/ticket";
import { useRouter } from "next/navigation";

const { Text, Title } = Typography;

interface TicketListProps {
  tickets: Ticket[];
}

const getStatusColor = (status: TicketStatus): string => {
  switch (status) {
    case TicketStatus.OPEN:
      return "blue";
    case TicketStatus.IN_PROGRESS:
      return "orange";
    case TicketStatus.RESOLVED:
      return "green";
    default:
      return "default";
  }
};

const getPriorityColor = (priority: TicketPriority): string => {
  switch (priority) {
    case TicketPriority.LOW:
      return "green";
    case TicketPriority.MEDIUM:
      return "blue";
    case TicketPriority.HIGH:
      return "orange";
    default:
      return "default";
  }
};

const formatDate = (dateString: string | null): string => {
  if (!dateString) return "Never";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStatusLabel = (status: TicketStatus): string => {
  switch (status) {
    case TicketStatus.OPEN:
      return "Open";
    case TicketStatus.IN_PROGRESS:
      return "In Progress";
    case TicketStatus.RESOLVED:
      return "Resolved";
    default:
      return status;
  }
};

const getPriorityLabel = (priority: TicketPriority): string => {
  switch (priority) {
    case TicketPriority.LOW:
      return "Low";
    case TicketPriority.MEDIUM:
      return "Medium";
    case TicketPriority.HIGH:
      return "High";
    default:
      return priority;
  }
};

const TicketList: React.FC<TicketListProps> = ({ tickets }) => {
  const router = useRouter();
  return (
    <div>
      {tickets.map((ticket) => (
        <TicketCard key={ticket.id}>
          <TicketHeader>
            <div style={{ flex: 1 }}>
              <TicketTitle level={4}>{ticket.title}</TicketTitle>
              <Text type="secondary" style={{ fontSize: "14px" }}>
                {ticket.description}
              </Text>
            </div>
            <Space>
              <Tag color={getStatusColor(ticket.status)}>
                {getStatusLabel(ticket.status)}
              </Tag>
              <Tag color={getPriorityColor(ticket.priority)}>
                {getPriorityLabel(ticket.priority)}
              </Tag>
            </Space>
          </TicketHeader>

          <TicketMeta>
            <Flex wrap="wrap" gap={16}>
              <MetaItem>
                <CalendarOutlined />
                <Text>Created: {formatDate(ticket.createdAt)}</Text>
              </MetaItem>
              <MetaItem>
                <ClockCircleOutlined />
                <Text>Updated: {formatDate(ticket.updatedAt)}</Text>
              </MetaItem>
            </Flex>

            <Button
              type="primary"
              onClick={() => {
                router.push(`/tickets/${ticket.id}`);
              }}
            >
              View or Edit Ticket
            </Button>
          </TicketMeta>
        </TicketCard>
      ))}
    </div>
  );
};

export default TicketList;

const TicketCard = styled(Card)`
  margin-bottom: 16px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

const TicketHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
`;

const TicketTitle = styled(Title)`
  margin: 0 !important;
  font-size: 16px !important;
  font-weight: 600 !important;
`;

const TicketMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
  justify-content: space-between;
  align-items: center;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: #666;
  font-size: 12px;
`;
