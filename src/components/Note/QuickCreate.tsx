import React, { useState } from "react";
import { Button, Dropdown, Input } from "antd";
import { BgColorsOutlined } from "@ant-design/icons";
import { getColorMenuItems } from "@/components/Note/constants";
import { getNoteBg } from "@/utils/noteHelpers";
import "@/styles/note/quickCreate.css";

interface QuickCreateProps {
  onSubmit: (data: { title: string; content: string; color: string }) => void;
}

export const QuickCreate: React.FC<QuickCreateProps> = ({ onSubmit }) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [color, setColor] = useState("default");

  const handleSave = () => {
    if (!title.trim() && !content.trim()) {
      setOpen(false);
      return;
    }

    onSubmit({ title, content, color });

    setTitle("");
    setContent("");
    setColor("default");
    setOpen(false);
  };

  return (
    <div className="quick-create-wrapper">
      <div
        className={`quick-create ${open ? "open" : ""}`}
        style={{ background: getNoteBg(color) }}
        onClick={() => setOpen(true)}
      >
        {/* Title */}
        {open && (
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Tiêu đề"
            variant="borderless"
            className="quick-create-title"
          />
        )}

        {/* Content */}
        <Input.TextArea
          value={content}
          onFocus={() => setOpen(true)}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Ghi chú..."
          variant="borderless"
          autoSize={{ minRows: open ? 3 : 1, maxRows: 8 }}
          className="quick-create-textarea"
        />

        {/* Toolbar */}
        {open && (
          <div
            className="quick-create-toolbar"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="quick-create-actions">
              <Dropdown
                menu={{ items: getColorMenuItems(setColor) }}
                trigger={["click"]}
              >
                <Button
                  icon={<BgColorsOutlined />}
                  className="quick-create-btn"
                >
                  Màu
                </Button>
              </Dropdown>

              <Button
                type="primary"
                onClick={handleSave}
                className="quick-create-btn primary"
              >
                Lưu
              </Button>
            </div>

            <Button
              onClick={() => setOpen(false)}
              className="quick-create-btn quick-create-close"
            >
              Đóng
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
