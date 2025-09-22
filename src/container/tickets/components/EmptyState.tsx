import React from "react";
import { Empty, Button } from "antd";
import { FileTextOutlined, ClearOutlined } from "@ant-design/icons";
import styled from "styled-components";

interface EmptyStateProps {
  hasFilters: boolean;
  onClearFilters: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  hasFilters,
  onClearFilters,
}) => {
  return (
    <EmptyContainer>
      <StyledEmpty
        image={<FileTextOutlined style={{ fontSize: 64, color: "#d9d9d9" }} />}
        description={
          hasFilters
            ? "No tickets match your current filters"
            : "No tickets found"
        }
      >
        {hasFilters && (
          <Button
            type="primary"
            icon={<ClearOutlined />}
            onClick={onClearFilters}
          >
            Clear Filters
          </Button>
        )}
        {!hasFilters && (
          <p style={{ color: "#999", marginTop: 8 }}>
            Tickets will appear here when they are created
          </p>
        )}
      </StyledEmpty>
    </EmptyContainer>
  );
};

export default EmptyState;

const EmptyContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  padding: 40px 20px;
`;

const StyledEmpty = styled(Empty)`
  .ant-empty-description {
    color: #666;
    font-size: 16px;
    margin-bottom: 16px;
  }
`;
