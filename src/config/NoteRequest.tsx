import { apiClient } from "./axiosClient";

const apiNote = "/api/note";

export interface INote {
  _id: string;
  userId: string;
  pinned: boolean;
  color: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export const requestListNotes = async () => {
  const res = await apiClient.get(apiNote);
  return res.data;
};

export const requestCreateNote = async (data: {
  title?: string;
  content?: string;
  color?: string;
  pinned?: boolean;
}) => {
  const res = await apiClient.post(apiNote, data);
  return res.data;
};

export const requestUpdateNote = async (
  id: string,
  data: { title?: string; content?: string; color?: string; pinned?: boolean },
) => {
  const res = await apiClient.put(`${apiNote}/${id}`, data);
  return res.data;
};

export const requestDeleteNote = async (id: string) => {
  const res = await apiClient.delete(`${apiNote}/${id}`);
  return res.data;
};
