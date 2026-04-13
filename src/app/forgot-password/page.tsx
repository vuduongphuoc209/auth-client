"use client";

import React, { useState } from "react";
import { Form, Input, Button, Typography, message } from "antd";
import type { FormProps } from "antd";
import { MailOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { requestForgotPassword } from "@/config/UserRequest";
import "@/styles/auth/forgot.css";
import { ForgotPasswordFormValues } from "@/types/forms";

const { Title, Paragraph, Text } = Typography;

const ForgotPassword: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const onFinish: FormProps<ForgotPasswordFormValues>["onFinish"] = async (
    values,
  ) => {
    setLoading(true);
    try {
      const res = await requestForgotPassword(values);

      message.success(res?.message || "Mã OTP đã được gửi đến email của bạn");

      // chuyển sang trang reset password
      setTimeout(() => {
        router.push("/reset-password");
      }, 800);
    } catch (error: any) {
      message.error(error?.response?.data?.message || "Gửi OTP thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <main className="login-main">
        <div className="login-container">
          <div className="login-card">
            <div className="login-header">
              <Title level={2}>Quên mật khẩu</Title>
              <Paragraph>
                Nhập email đã đăng ký, chúng tôi sẽ gửi mã OTP để đặt lại mật
                khẩu.
              </Paragraph>
            </div>

            <Form<ForgotPasswordFormValues>
              layout="vertical"
              size="large"
              onFinish={onFinish}
            >
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập email",
                  },
                  {
                    type: "email",
                    message: "Email không hợp lệ",
                  },
                ]}
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder="example@email.com"
                />
              </Form.Item>

              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="login-btn"
              >
                Gửi mã OTP
              </Button>
            </Form>

            <div className="login-footer" style={{ marginTop: 20 }}>
              <Text>Đã nhớ mật khẩu?</Text>{" "}
              <Link href="/sign-in">Quay lại đăng nhập</Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ForgotPassword;
