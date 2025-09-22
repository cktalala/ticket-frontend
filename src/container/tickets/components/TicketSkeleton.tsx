import React from "react";
import { Card, Skeleton, Space } from "antd";
import styled from "styled-components";

const TicketSkeleton: React.FC = () => {
  return (
    <div>
      {Array.from({ length: 5 }).map((_, index) => (
        <SkeletonCard key={index}>
          <SkeletonHeader>
            <div style={{ flex: 1 }}>
              <Skeleton.Input
                active
                size="small"
                style={{ width: "60%", marginBottom: 8 }}
              />
              <Skeleton.Input active size="small" style={{ width: "90%" }} />
            </div>
            <Space>
              <Skeleton.Button active size="small" />
              <Skeleton.Button active size="small" />
            </Space>
          </SkeletonHeader>

          <Space style={{ marginTop: 8 }}>
            <Skeleton.Button active size="small" />
            <Skeleton.Button active size="small" />
            <Skeleton.Button active size="small" />
          </Space>

          <SkeletonMeta>
            <Skeleton.Input active size="small" style={{ width: 120 }} />
            <Skeleton.Input active size="small" style={{ width: 100 }} />
            <Skeleton.Input active size="small" style={{ width: 140 }} />
            <Skeleton.Input active size="small" style={{ width: 140 }} />
          </SkeletonMeta>
        </SkeletonCard>
      ))}
    </div>
  );
};

export default TicketSkeleton;

const SkeletonCard = styled(Card)`
  margin-bottom: 16px;
`;

const SkeletonHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
`;

const SkeletonMeta = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
`;
