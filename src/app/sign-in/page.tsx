"use client";

import React, { useState } from "react";
import { Form, Input, Button, Checkbox, Divider, message } from "antd";
import type { FormProps } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { requestLogin, requestLoginGoogle } from "@/config/UserRequest";
import "@/styles/auth/login.css";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { GoogleLogin } from "@react-oauth/google";

// Type form
interface LoginFormValues {
  email: string;
  password: string;
  remember?: boolean;
}

const LoginUser: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const onFinish: FormProps<LoginFormValues>["onFinish"] = async (values) => {
    setLoading(true);
    try {
      const res = await requestLogin(values);
      console.log(res);

      message.success("Đăng nhập thành công!");

      // không nên reload
      // window.location.reload();

      // Next.js way
      router.push("/");
      router.refresh(); // cập nhật UI nếu dùng cookie auth
    } catch (error: any) {
      message.error(error?.response?.data?.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = async (response: any) => {
    try {
      const { credential } = response;

      const res = await requestLoginGoogle(credential);

      message.success(res.message);

      router.push("/");
      router.refresh();
    } catch (error) {
      message.error("Dang nhap Google that bai");
      console.log(error);
    }
  };

  return (
    <div className="login-page">
      <main className="login-main">
        <div className="login-container">
          <div className="login-card">
            <div className="login-header">
              <h1>Đăng nhập</h1>
              <p>Chào mừng bạn quay trở lại!</p>
            </div>

            <Form<LoginFormValues>
              layout="vertical"
              size="large"
              onFinish={onFinish}
            >
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Nhập email" },
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

              <Form.Item
                label="Mật khẩu"
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Nhập mật khẩu",
                  },
                  { min: 6, message: "Ít nhất 6 ký tự" },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="••••••••"
                />
              </Form.Item>

              <div className="login-options">
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>Ghi nhớ đăng nhập</Checkbox>
                </Form.Item>

                <Link href="/forgot-password">Quên mật khẩu?</Link>
              </div>

              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="login-btn"
              >
                Đăng nhập
              </Button>
            </Form>

            <Divider>Hoặc</Divider>

            <GoogleOAuthProvider clientId="263079252814-6ch8s83bh1md870i465g8cik64ul7edg.apps.googleusercontent.com">
              <GoogleLogin
                onSuccess={handleSuccess}
                onError={() => {
                  console.log("Login Failed");
                }}
              />
            </GoogleOAuthProvider>

            <div className="login-footer">
              <span>Chưa có tài khoản?</span>
              <Link href="/sign-up">Đăng ký ngay</Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoginUser;
