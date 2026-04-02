import { NOTE_COLORS } from "@/constants/noteColors";

export const getNoteBg = (color?: string) => {
  const c = NOTE_COLORS.find((x) => x.value === color);
  return c?.bg || "#fff";
};
