"use client";

import React, { useEffect, useState } from "react";
import Header from "@/components/header";
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  message,
  Tag,
  Popconfirm,
  Checkbox,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import type { FormInstance } from "antd/es/form";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useStore } from "@/hooks/useStore";
import {
  requestGetAllUsers,
  requestCreateUser,
  requestUpdateUser,
  requestDeleteUser,
} from "@/config/UserRequest";
import "@/styles/userAdmin.css";

// ===== TYPES =====
interface IUser {
  _id: string;
  fullName?: string;
  email: string;
  phone?: string;
  isAdmin?: boolean;
}

interface UserFormValues {
  fullName: string;
  email: string;
  phone?: string;
  password?: string;
  isAdmin?: boolean;
}

const AdminUsers: React.FC = () => {
  const {
    dataUser,
    loading: contextLoading,
    isAdmin,
  } = useStore() as {
    dataUser: IUser;
    loading: boolean;
    isAdmin: boolean;
  };

  const router = useRouter();

  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form] = Form.useForm<UserFormValues>() as [
    FormInstance<UserFormValues>,
  ];

  // ===== AUTH CHECK =====
  useEffect(() => {
    if (!contextLoading && !dataUser?._id) {
      router.push("/sign-in");
      return;
    }

    if (!contextLoading && dataUser?._id && !isAdmin) {
      message.error("Bạn không có quyền truy cập trang này");
      router.push("/");
      return;
    }
  }, [dataUser, contextLoading, isAdmin, router]);

  useEffect(() => {
    if (isAdmin && dataUser?._id) {
      fetchUsers();
    }
  }, [isAdmin, dataUser?._id]);

  // ===== API =====
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await requestGetAllUsers();
      setUsers(res?.metadata || []);
    } catch (error: any) {
      message.error(
        error?.response?.data?.message || "Lấy danh sách user thất bại",
      );
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditingId(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEdit = (record: IUser) => {
    setEditingId(record._id);

    form.setFieldsValue({
      fullName: record.fullName,
      email: record.email,
      phone: record.phone || "",
      password: "",
      isAdmin: record.isAdmin,
    });

    setModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (editingId) {
        const payload: Partial<UserFormValues> = {
          fullName: values.fullName,
          email: values.email,
          phone: values.phone,
          isAdmin: !!values.isAdmin,
        };

        if (values.password?.trim()) {
          payload.password = values.password;
        }

        await requestUpdateUser(editingId, payload);
        message.success("Cập nhật user thành công");
      } else {
        if (!values.password?.trim()) {
          message.error("Nhập mật khẩu khi tạo user mới");
          return;
        }

        await requestCreateUser({
          fullName: values.fullName,
          email: values.email,
          phone: values.phone,
          password: values.password,
          isAdmin: !!values.isAdmin,
        });

        message.success("Tạo user thành công");
      }

      setModalOpen(false);
      fetchUsers();
    } catch (error: any) {
      if (error?.errorFields) return;

      message.error(error?.response?.data?.message || "Thao tác thất bại");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await requestDeleteUser(id);
      message.success("Xóa user thành công");
      fetchUsers();
    } catch (error: any) {
      message.error(error?.response?.data?.message || "Xóa user thất bại");
    }
  };

  if (!contextLoading && (!dataUser?._id || !isAdmin)) {
    return null;
  }

  // ===== TABLE =====
  const columns: ColumnsType<IUser> = [
    {
      title: "Họ tên",
      dataIndex: "fullName",
      key: "fullName",
      render: (text: string) => text || "-",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "SĐT",
      dataIndex: "phone",
      key: "phone",
      render: (text: string) => text || "-",
    },
    {
      title: "Quyền",
      dataIndex: "isAdmin",
      key: "isAdmin",
      render: (isAdmin: boolean) =>
        isAdmin ? <Tag color="blue">Admin</Tag> : <Tag>User</Tag>,
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => openEdit(record)}
          >
            Sửa
          </Button>

          <Popconfirm
            title="Xóa user này?"
            onConfirm={() => handleDelete(record._id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="admin-users-page">
      <Header />

      <main className="admin-users-main">
        <div className="admin-users-wrapper">
          <div className="admin-users-header">
            <h1>Quản lý Users</h1>

            <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
              Thêm user
            </Button>
          </div>

          <Table<IUser>
            rowKey="_id"
            columns={columns}
            dataSource={users}
            loading={loading}
            pagination={{ pageSize: 10 }}
          />
        </div>
      </main>

      <Modal
        title={editingId ? "Sửa user" : "Thêm user"}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
        okText={editingId ? "Cập nhật" : "Tạo"}
        cancelText="Hủy"
        width={420}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="fullName"
            label="Họ và tên"
            rules={[{ required: true }]}
          >
            <Input prefix={<UserOutlined />} />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true }, { type: "email" }]}
          >
            <Input prefix={<MailOutlined />} disabled={!!editingId} />
          </Form.Item>

          <Form.Item name="phone" label="SĐT">
            <Input prefix={<PhoneOutlined />} />
          </Form.Item>

          <Form.Item
            name="password"
            label={editingId ? "Mật khẩu mới" : "Mật khẩu"}
            rules={editingId ? [] : [{ required: true }]}
          >
            <Input.Password prefix={<LockOutlined />} />
          </Form.Item>

          <Form.Item name="isAdmin" valuePropName="checked">
            <Checkbox>Admin</Checkbox>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminUsers;
