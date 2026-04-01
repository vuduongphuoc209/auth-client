"use client";

import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import type { FormProps } from "antd";
import type { FormInstance } from "antd/es/form";
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "@/styles/register.css";
import { requestRegister } from "@/config/UserRequest";

// Type form
interface RegisterFormValues {
  fullName: string;
  email: string;
  phone?: string;
  password: string;
  confirmPassword: string;
}

const RegisterUser: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm<RegisterFormValues>() as [
    FormInstance<RegisterFormValues>,
  ];

  const onFinish: FormProps<RegisterFormValues>["onFinish"] = async (
    values,
  ) => {
    setLoading(true);
    try {
      const { confirmPassword, ...registerData } = values;

      const res = await requestRegister(registerData);

      message.success(res?.message || "Đăng ký thành công");

      // ❌ không nên reload
      // window.location.reload();

      // ✅ Next.js chuẩn
      router.push("/sign-in");
    } catch (error: any) {
      message.error(error?.response?.data?.message || "Đăng ký thất bại!");
      console.error("Register error:", error);
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed: FormProps<RegisterFormValues>["onFinishFailed"] = (
    errorInfo,
  ) => {
    message.error("Vui lòng kiểm tra lại thông tin!");
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="register-page">
      <main className="register-main">
        <div className="register-wrapper">
          <div className="register-card">
            <div className="register-header">
              <h1>Đăng ký tài khoản</h1>
              <p>Tạo tài khoản mới để bắt đầu!</p>
            </div>

            <Form<RegisterFormValues>
              form={form}
              name="register"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              layout="vertical"
              size="large"
            >
              <Form.Item
                label="Họ và tên"
                name="fullName"
                rules={[
                  {
                    required: true,
                    message: "Nhập họ tên",
                  },
                ]}
              >
                <Input placeholder="Nguyen Van A" prefix={<UserOutlined />} />
              </Form.Item>

              <Form.Item
                label="Email"
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Nhập email",
                  },
                  {
                    type: "email",
                    message: "Email không hợp lệ",
                  },
                ]}
              >
                <Input
                  placeholder="email@gmail.com"
                  prefix={<MailOutlined />}
                />
              </Form.Item>

              <Form.Item label="Số điện thoại" name="phone">
                <Input placeholder="0987654321" prefix={<PhoneOutlined />} />
              </Form.Item>

              <Form.Item
                label="Mật khẩu"
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Nhập mật khẩu",
                  },
                  {
                    min: 6,
                    message: "Ít nhất 6 ký tự",
                  },
                ]}
                hasFeedback
              >
                <Input.Password
                  placeholder="••••••••"
                  prefix={<LockOutlined />}
                />
              </Form.Item>

              <Form.Item
                label="Xác nhận mật khẩu"
                name="confirmPassword"
                dependencies={["password"]}
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "Xác nhận mật khẩu",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error("Mật khẩu không khớp!"));
                    },
                  }),
                ]}
              >
                <Input.Password
                  placeholder="••••••••"
                  prefix={<LockOutlined />}
                />
              </Form.Item>

              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="register-btn"
              >
                Đăng ký
              </Button>
            </Form>

            <div className="register-login">
              <span>Đã có tài khoản? </span>
              <Link href="/sign-in">Đăng nhập ngay</Link>
            </div>
          </div>
        </div>

        <p className="register-footer">
          Bằng việc đăng ký, bạn đồng ý với{" "}
          <Link href="/terms">Điều khoản dịch vụ</Link> và{" "}
          <Link href="/privacy">Chính sách bảo mật</Link>
        </p>
      </main>
    </div>
  );
};

export default RegisterUser;
