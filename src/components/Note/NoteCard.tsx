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

  return (
    <div
      style={{
        background: getNoteBg(note.color),
        borderRadius: 14,
        border: "1px solid rgba(0,0,0,0.12)",
        padding: 12,
        minHeight: 110,
        position: "relative",
        cursor: "pointer",
        transition: "transform 120ms ease, box-shadow 120ms ease",
        boxShadow: isHovered ? "0 10px 28px rgba(0,0,0,0.12)" : "none",
        transform: isHovered ? "translateY(-1px)" : "translateY(0px)",
      }}
      onClick={() => onClick(note)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
        <div style={{ fontWeight: 700, fontSize: 14, lineHeight: 1.3 }}>
          {note.title || "(Khong tieu de)"}
        </div>
        <Tooltip title={note.pinned ? "Bo ghim" : "Ghim"}>
          <Button
            size="small"
            type={note.pinned ? "primary" : "default"}
            onClick={(e) => {
              e.stopPropagation();
              onTogglePin(note);
            }}
          >
            {note.pinned ? <PushpinFilled /> : <PushpinOutlined />}
          </Button>
        </Tooltip>
      </div>

      <div
        style={{
          marginTop: 8,
          whiteSpace: "pre-wrap",
          color: "rgba(0,0,0,0.78)",
          fontSize: 13,
          lineHeight: 1.45,
        }}
      >
        {note.content}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 12,
          opacity: isHovered ? 1 : 0,
          transition: "opacity 120ms ease",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <Space size={6}>
          <Dropdown
            menu={{ items: getColorMenuItems((c) => onChangeColor(note, c)) }}
            trigger={["click"]}
          >
            <Button size="small" icon={<BgColorsOutlined />} />
          </Dropdown>
          <Popconfirm
            title="Xoa note nay?"
            okText="Xoa"
            cancelText="Huy"
            onConfirm={() => onDelete(note._id)}
          >
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
        <div style={{ fontSize: 11, color: "rgba(0,0,0,0.45)" }}>
          {new Date(note.updatedAt).toLocaleString()}
        </div>
      </div>
    </div>
  );
};
