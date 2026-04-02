import { useState } from "react";
import {
  requestListNotes,
  requestCreateNote,
  requestUpdateNote,
  requestDeleteNote,
} from "@/config/NoteRequest";
import { message } from "antd";

export const useNotes = () => {
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const res = await requestListNotes();
      setNotes(res?.metadata || []);
    } catch {
      message.error("Lay note that bai");
    } finally {
      setLoading(false);
    }
  };

  const createNote = async (data: any) => {
    const res = await requestCreateNote(data);
    setNotes((prev) => [res.metadata, ...prev]);
  };

  const updateNote = async (id: string, data: any) => {
    const res = await requestUpdateNote(id, data);
    setNotes((prev) => prev.map((n) => (n._id === id ? res.metadata : n)));
  };

  const deleteNote = async (id: string) => {
    await requestDeleteNote(id);
    setNotes((prev) => prev.filter((n) => n._id !== id));
  };

  return { notes, loading, fetchNotes, createNote, updateNote, deleteNote };
};
