"use client";

import React, { useEffect, useState } from "react";
import { Button, Dropdown, Input, Tooltip, Space, Popconfirm } from "antd";
import {
  PushpinOutlined,
  PushpinFilled,
  BgColorsOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import type { INote } from "@/config/NoteRequest";
import { getColorMenuItems } from "@/components/Note/constants";
import { getNoteBg } from "@/utils/noteHelpers";
import "@/styles/note/noteModal.css";
import { ConfirmDelete } from "@/components/common/ConfirmDelete/ConfirmDelete";

export interface NoteFormValues {
  title: string;
  content: string;
  color?: string;
  pinned?: boolean;
}

interface NoteModalProps {
  open: boolean;
  editing: INote | null;
  onCancel: () => void;
  onSubmit: (values: NoteFormValues, editingId: string | null) => void;
  onDelete?: (id: string) => void;
}

export const NoteModal: React.FC<NoteModalProps> = ({
  open,
  editing,
  onCancel,
  onSubmit,
  onDelete,
}) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [color, setColor] = useState("default");
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    if (open) {
      if (editing) {
        setTitle(editing.title || "");
        setContent(editing.content || "");
        setColor(editing.color || "default");
        setPinned(!!editing.pinned);
      } else {
        setTitle("");
        setContent("");
        setColor("default");
        setPinned(false);
      }
    }
  }, [open, editing]);

  const handleClose = () => {
    if (title.trim() || content.trim()) {
      onSubmit({ title, content, color, pinned }, editing?._id || null);
    }
    onCancel();
  };

  const handlePinToggle = () => {
    setPinned(!pinned);
  };

  if (!open) return null;

  return (
    <div className="note-modal-overlay" onClick={handleClose}>
      <div
        className="note-modal"
        style={{ background: getNoteBg(color) }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="note-modal-header">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Tiêu đề"
            variant="borderless"
            className="note-modal-title"
          />

          <Tooltip title={pinned ? "Bỏ ghim" : "Ghim"}>
            <Button
              type="text"
              icon={pinned ? <PushpinFilled /> : <PushpinOutlined />}
              onClick={handlePinToggle}
              className={`note-modal-pin-btn ${
                pinned ? "note-modal-pin-active" : ""
              }`}
            />
          </Tooltip>
        </div>

        {/* Content */}
        <div className="note-modal-content">
          <Input.TextArea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Ghi chú..."
            variant="borderless"
            autoSize={{ minRows: 4, maxRows: 20 }}
            className="note-modal-textarea"
          />
        </div>

        {/* Toolbar */}
        <div className="note-modal-toolbar">
          <Space size={8} className="note-modal-actions">
            <Tooltip title="Thay đổi màu">
              <Dropdown
                menu={{ items: getColorMenuItems(setColor) }}
                trigger={["click"]}
                placement="topCenter"
              >
                <Button
                  type="text"
                  icon={<BgColorsOutlined />}
                  className="note-modal-action-btn"
                />
              </Dropdown>
            </Tooltip>

            <Tooltip title="Xóa">
              <ConfirmDelete
                onConfirm={() => {
                  if (editing?._id && onDelete) {
                    onDelete(editing._id);
                    onCancel();
                  }
                }}
              >
                <Button type="text" danger icon={<DeleteOutlined />} />
              </ConfirmDelete>
            </Tooltip>
          </Space>

          <Button
            type="text"
            onClick={handleClose}
            className="note-modal-close-btn"
          >
            Đóng
          </Button>
        </div>
      </div>
    </div>
  );
};
