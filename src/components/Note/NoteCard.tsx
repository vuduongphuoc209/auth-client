import React, { useState } from "react";
import { Button, Dropdown, Popconfirm, Space, Tooltip } from "antd";
import {
  BgColorsOutlined,
  DeleteOutlined,
  PushpinFilled,
  PushpinOutlined,
} from "@ant-design/icons";
import type { INote } from "@/config/NoteRequest";
import { getColorMenuItems } from "@/components/Note/constants";
import { getNoteBg } from "@/utils/noteHelpers";
import "@/styles/note/noteCard.css";
import { ConfirmDelete } from "@/components/common/ConfirmDelete/ConfirmDelete";

interface NoteCardProps {
  note: INote;
  onClick: (note: INote) => void;
  onTogglePin: (note: INote) => void;
  onChangeColor: (note: INote, color: string) => void;
  onDelete: (id: string) => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({
  note,
  onClick,
  onTogglePin,
  onChangeColor,
  onDelete,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const hasContent = note.content && note.content.trim().length > 0;

  return (
    <div
      className={`note-card ${isHovered ? "hovered" : ""}`}
      style={{ background: getNoteBg(note.color) }}
      onClick={() => onClick(note)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      <div
        className={`note-card-header ${
          hasContent ? "has-content" : "no-content"
        }`}
      >
        {note.title ? (
          <div className="note-card-title">{note.title}</div>
        ) : hasContent ? null : (
          <div className="note-card-empty" />
        )}

        <Tooltip title={note.pinned ? "Bỏ ghim" : "Ghim"}>
          <Button
            type="text"
            size="small"
            icon={note.pinned ? <PushpinFilled /> : <PushpinOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              onTogglePin(note);
            }}
            className={`note-card-pin-btn ${
              note.pinned || isHovered
                ? "note-card-pin-visible"
                : "note-card-pin-hidden"
            } ${note.pinned ? "note-card-pin-active" : ""}`}
            style={{
              visibility:
                note.title || hasContent || note.pinned
                  ? "visible"
                  : isHovered
                    ? "visible"
                    : "hidden",
            }}
          />
        </Tooltip>
      </div>

      {/* Content */}
      {hasContent && <div className="note-card-content">{note.content}</div>}

      {/* Toolbar */}
      <div
        className={`note-card-toolbar ${
          hasContent ? "has-content" : "no-content"
        } ${isHovered ? "visible" : "hidden"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <Space size={4}>
          <Tooltip title="Thay đổi màu">
            <Dropdown
              menu={{ items: getColorMenuItems((c) => onChangeColor(note, c)) }}
              trigger={["click"]}
            >
              <Button
                type="text"
                size="small"
                icon={<BgColorsOutlined />}
                className="note-card-action-btn"
              />
            </Dropdown>
          </Tooltip>

          <Tooltip title="Xóa">
            <ConfirmDelete
              onConfirm={() => {
                if (note._id && onDelete) {
                  onDelete(note._id);
                }
              }}
            >
              <Button type="text" danger icon={<DeleteOutlined />} />
            </ConfirmDelete>
          </Tooltip>
        </Space>
      </div>
    </div>
  );
};
