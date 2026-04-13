import type { MenuProps } from "antd";
import { NOTE_COLORS } from "@/constants/noteColors";

// Helper tạo dropdown menu màu
export const getColorMenuItems = (
  onPick: (color: string) => void,
): MenuProps["items"] =>
  NOTE_COLORS.map((c) => ({
    key: c.key,
    label: (
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span
          style={{
            width: 14,
            height: 14,
            borderRadius: 999,
            background: c.bg,
            border: "1px solid rgba(0,0,0,0.12)",
          }}
        />
        <span>{c.label}</span>
      </div>
    ),
    onClick: () => onPick(c.value),
  }));
