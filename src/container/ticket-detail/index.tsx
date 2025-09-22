"use client";
import { TicketService } from "@/services/ticket";
import { CreateTicketDto } from "@/types/ticket";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  notification,
  Row,
  Select,
  Alert,
  Space,
} from "antd";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";

type TicketDetailContainerProps = {
  params: { id: string };
};

const TicketDetailContainer: React.FC<TicketDetailContainerProps> = ({
  params,
}) => {
  const [form] = Form.useForm();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(
    null
  );

  const [api, contextHolder] = notification.useNotification();

  const { data: ticket, refetch } = useQuery({
    queryKey: ["ticket", params.id],
    queryFn: () => TicketService.getTicket(params.id),
  });

  useEffect(() => {
    refetch();
    if (ticket) {
      form.setFieldsValue(ticket.data);
    }
  }, [ticket, form, refetch]);

  const validateTitle = (_: unknown, value: string) => {
    if (!value || value.trim().length === 0) {
      return Promise.reject(new Error("Title is required"));
    }
    if (value.trim().length < 5) {
      return Promise.reject(new Error("Title must be at least 5 characters"));
    }

    return Promise.resolve();
  };

  const validateDescription = (_: unknown, value: string) => {
    if (!value || value.trim().length === 0) {
      return Promise.reject(new Error("Description is required"));
    }
    if (value.trim().length > 5000) {
      return Promise.reject(
        new Error("Description must be at most 5000 characters")
      );
    }

    return Promise.resolve();
  };

  const onSubmit = async (values: CreateTicketDto) => {
    try {
      setLoading(true);

      await TicketService.updateTicket(params.id, values);

      setSubmitStatus("success");
      api.success({
        message: "สำเร็จ!",
        description: "อัพเดตข้อมูลตั๋วเรียบร้อยแล้ว",
        duration: 3,
      });

      refetch();
    } catch (error) {
      setSubmitStatus("error");
      let errorMsg = "เกิดข้อผิดพลาดในการอัพเดตข้อมูลตั๋ว";

      if (error instanceof AxiosError) {
        errorMsg = error.response?.data?.message || errorMsg;
      }

      api.error({
        message: "ล้มเหลว!",
        description: errorMsg,
        duration: 5,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      {contextHolder}
      <Header>
        <Button onClick={() => router.push("/tickets")}>กลับ</Button>
        <Title>Ticket Detail</Title>
      </Header>

      <Card title={ticket?.data.title}>
        <Form layout="vertical" form={form} onFinish={onSubmit}>
          <Form.Item
            label="หัวข้อ / Title"
            name="title"
            rules={[{ validator: validateTitle }]}
            hasFeedback
            initialValue={ticket?.data.title}
          >
            <Input placeholder="กรอกหัวข้อตั๋ว (5 ตัวอักษร)" />
          </Form.Item>

          <Form.Item
            label="รายละเอียด / Description"
            name="description"
            rules={[{ validator: validateDescription }]}
            hasFeedback
            initialValue={ticket?.data.description}
          >
            <Input.TextArea
              rows={4}
              placeholder="กรอกรายละเอียดตั๋ว (สูงสุด 5000 ตัวอักษร)"
              showCount
              maxLength={1000}
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="สถานะ / Status"
                name="status"
                rules={[{ required: true, message: "กรุณาเลือกสถานะ" }]}
                hasFeedback
                initialValue={ticket?.data.status}
              >
                <Select
                  placeholder="เลือกสถานะ / Select status"
                  options={[
                    { label: "Open", value: "OPEN" },
                    { label: "In Progress", value: "IN_PROGRESS" },
                    { label: "Resolved", value: "RESOLVED" },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="ความสำคัญ / Priority"
                name="priority"
                rules={[{ required: true, message: "กรุณาเลือกความสำคัญ" }]}
                hasFeedback
                initialValue={ticket?.data.priority}
              >
                <Select
                  placeholder="เลือกความสำคัญ / Select priority"
                  options={[
                    { label: "Low", value: "LOW" },
                    { label: "Medium", value: "MEDIUM" },
                    { label: "High", value: "HIGH" },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                disabled={submitStatus === "success"}
              >
                {loading ? "Updating..." : "Update Ticket"}
              </Button>
              <Button
                onClick={() => {
                  form.resetFields();
                }}
                disabled={loading}
              >
                Clear Data
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </Container>
  );
};

export default TicketDetailContainer;

const Container = styled.div`
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
`;
