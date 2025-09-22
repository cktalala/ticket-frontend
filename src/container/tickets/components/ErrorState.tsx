import React from "react";
import { Result, Button } from "antd";
import { ReloadOutlined } from "@ant-design/icons";

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => {
  return (
    <Result
      status="error"
      title="Failed to Load Tickets"
      subTitle={message}
      extra={
        <Button type="primary" icon={<ReloadOutlined />} onClick={onRetry}>
          Try Again
        </Button>
      }
    />
  );
};

export default ErrorState;
