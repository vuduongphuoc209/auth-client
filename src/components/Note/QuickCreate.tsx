import React, { useState } from "react";
import { Button, Dropdown, Input, Space } from "antd";
import { getColorMenuItems } from "@/components/Note/constants";
import { getNoteBg } from "@/utils/noteHelpers";

interface QuickCreateProps {
  onSubmit: (data: { title: string; content: string; color: string }) => void;
}

export const QuickCreate: React.FC<QuickCreateProps> = ({ onSubmit }) => {
  const [quickOpen, setQuickOpen] = useState(false);
  const [quickTitle, setQuickTitle] = useState("");
  const [quickContent, setQuickContent] = useState("");
  const [quickColor, setQuickColor] = useState("default");

  const handleSave = () => {
    if (!quickTitle.trim() && !quickContent.trim()) {
      setQuickOpen(false);
      return;
    }
    onSubmit({ title: quickTitle, content: quickContent, color: quickColor });
    setQuickTitle("");
    setQuickContent("");
    setQuickColor("default");
    setQuickOpen(false);
  };

  return (
    <div
      style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}
    >
      <div
        style={{
          width: "min(680px, 100%)",
          borderRadius: 12,
          border: "1px solid rgba(0,0,0,0.12)",
          background: getNoteBg(quickColor),
          boxShadow: quickOpen ? "0 8px 24px rgba(0,0,0,0.12)" : "none",
          padding: 12,
        }}
      >
        {quickOpen && (
          <Input
            value={quickTitle}
            onChange={(e) => setQuickTitle(e.target.value)}
            placeholder="Tieu de"
            variant="borderless"
            style={{ fontSize: 16, fontWeight: 600 }}
          />
        )}
        <Input.TextArea
          value={quickContent}
          onFocus={() => setQuickOpen(true)}
          onChange={(e) => setQuickContent(e.target.value)}
          placeholder="Ghi chu..."
          variant="borderless"
          autoSize={{ minRows: quickOpen ? 3 : 1, maxRows: 8 }}
          style={{ resize: "none" }}
        />

        {quickOpen && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 8,
            }}
          >
            <Space>
              <Dropdown
                menu={{ items: getColorMenuItems((c) => setQuickColor(c)) }}
                trigger={["click"]}
              >
                <Button size="small">Mau</Button>
              </Dropdown>
              <Button size="small" type="primary" onClick={handleSave}>
                Luu
              </Button>
            </Space>
            <Button size="small" onClick={() => setQuickOpen(false)}>
              Dong
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
