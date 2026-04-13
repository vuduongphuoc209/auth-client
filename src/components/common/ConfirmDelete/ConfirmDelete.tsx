import React from "react";
import { Button, Popconfirm } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

interface ConfirmDeleteProps {
  onConfirm: () => void;
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export const ConfirmDelete: React.FC<ConfirmDeleteProps> = ({
  onConfirm,
  children,
  title = "Xóa ghi chú?",
  description = "Hành động này không thể hoàn tác.",
}) => {
  return (
    <Popconfirm
      placement="top"
      title={<div className="confirm-delete-title">{title}</div>}
      description={<div className="confirm-delete-desc">{description}</div>}
      okText="Xóa"
      cancelText="Hủy"
      okButtonProps={{ danger: true }}
      overlayClassName="confirm-delete"
      onConfirm={onConfirm}
      icon={<DeleteOutlined className="confirm-delete-icon" />}
    >
      {children}
    </Popconfirm>
  );
};
