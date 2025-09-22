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
import React, { useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";

const CreateTicketContainer = () => {
  const [form] = Form.useForm();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(
    null
  );
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [api, contextHolder] = notification.useNotification();

  const validateTitle = (_: any, value: string) => {
    if (!value || value.trim().length === 0) {
      return Promise.reject(new Error("Title is required"));
    }
    if (value.trim().length < 5) {
      return Promise.reject(new Error("Title must be at least 5 characters"));
    }

    return Promise.resolve();
  };

  const validateDescription = (_: any, value: string) => {
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
      setSubmitStatus(null);
      setErrorMessage("");

      await TicketService.createTicket(values);

      setSubmitStatus("success");
      api.success({
        message: "สำเร็จ!",
        description: "สร้างตั๋วเรียบร้อยแล้ว",
        duration: 3,
      });

      form.resetFields();
      setTimeout(() => {
        router.push("/tickets");
      }, 2000);
    } catch (error) {
      setSubmitStatus("error");
      let errorMsg = "เกิดข้อผิดพลาดในการสร้างตั๋ว";

      if (error instanceof AxiosError) {
        errorMsg = error.response?.data?.message || errorMsg;
      }

      setErrorMessage(errorMsg);
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
        <Title>Create Ticket</Title>
      </Header>

      {submitStatus === "success" && (
        <Alert
          message="สำเร็จ!"
          description="สร้างตั๋วเรียบร้อยแล้ว กำลังเปลี่ยนหน้า..."
          type="success"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      {submitStatus === "error" && (
        <Alert
          message="เกิดข้อผิดพลาด"
          description={errorMessage}
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      <Card>
        <Form layout="vertical" form={form} onFinish={onSubmit}>
          <Form.Item
            label="หัวข้อ / Title"
            name="title"
            rules={[{ validator: validateTitle }]}
            hasFeedback
          >
            <Input placeholder="กรอกหัวข้อตั๋ว (5 ตัวอักษร)" />
          </Form.Item>

          <Form.Item
            label="รายละเอียด / Description"
            name="description"
            rules={[{ validator: validateDescription }]}
            hasFeedback
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
                {loading ? "Creating..." : "Create Ticket"}
              </Button>
              <Button
                onClick={() => {
                  form.resetFields();
                  setSubmitStatus(null);
                  setErrorMessage("");
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

export default CreateTicketContainer;

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
`;
