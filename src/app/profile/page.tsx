"use client";

import React, { useEffect, useState } from "react";
import Header from "@/components/header";
import { Form, Input, Button, Card, message } from "antd";
import type { FormProps } from "antd";
import type { FormInstance } from "antd/es/form";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useStore } from "../../hooks/useStore";
import { requestUpdateUser } from "@/config/UserRequest";
import "@/styles/profile.css";

// Type user (bạn nên sync với backend)
interface IUser {
  _id?: string;
  fullName?: string;
  email?: string;
  phone?: string;
}

// Type form
interface ProfileFormValues {
  fullName: string;
  email: string;
  phone?: string;
  password?: string;
}

const ProfileUser: React.FC = () => {
  const {
    dataUser,
    setDataUser,
    loading: contextLoading,
  } = useStore() as {
    dataUser: IUser;
    setDataUser: (user: IUser) => void;
    loading: boolean;
  };

  const router = useRouter();
  const [form] = Form.useForm<ProfileFormValues>() as [
    FormInstance<ProfileFormValues>,
  ];
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!contextLoading && !dataUser?._id) {
      router.push("/sign-in");
      return;
    }

    if (dataUser) {
      form.setFieldsValue({
        fullName: dataUser.fullName,
        email: dataUser.email,
        phone: dataUser.phone || "",
      });
    }
  }, [dataUser, contextLoading, form, router]);

  const onFinish: FormProps<ProfileFormValues>["onFinish"] = async (values) => {
    if (!dataUser?._id) return;

    setLoading(true);
    try {
      const payload: Partial<ProfileFormValues> = {};

      if (values.fullName !== undefined) payload.fullName = values.fullName;
      if (values.email !== undefined) payload.email = values.email;
      if (values.phone !== undefined) payload.phone = values.phone;
      if (values.password && values.password.trim() !== "")
        payload.password = values.password;

      const res = await requestUpdateUser(dataUser._id, payload);

      if (res?.metadata) setDataUser(res.metadata);

      message.success("Cập nhật thông tin thành công");
    } catch (error: any) {
      message.error(error?.response?.data?.message || "Cập nhật thất bại");
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (contextLoading || !dataUser?._id) {
    return (
      <div className="profile-page">
        <Header />
        <main className="profile-main">
          <div className="profile-loading">Đang tải...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <Header />

      <main className="profile-main">
        <div className="profile-wrapper">
          <Card className="profile-card" title="Thông tin cá nhân">
            <Form<ProfileFormValues>
              form={form}
              layout="vertical"
              size="large"
              onFinish={onFinish}
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
                <Input prefix={<UserOutlined />} placeholder="Nguyen Van A" />
              </Form.Item>

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
                  placeholder="email@gmail.com"
                />
              </Form.Item>

              <Form.Item label="Số điện thoại" name="phone">
                <Input prefix={<PhoneOutlined />} placeholder="0987654321" />
              </Form.Item>

              <Form.Item
                label="Mật khẩu mới (để trống nếu không đổi)"
                name="password"
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="••••••••"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  className="profile-btn"
                >
                  Lưu thay đổi
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ProfileUser;
