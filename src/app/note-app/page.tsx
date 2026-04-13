"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, message } from "antd";
import { PushpinOutlined } from "@ant-design/icons";
import Header from "@/components/Header/header";
import { useStore } from "@/hooks/useStore";
import {
  requestCreateNote,
  requestDeleteNote,
  requestListNotes,
  requestUpdateNote,
  type INote,
} from "@/config/NoteRequest";

import { NoteCard } from "@/components/Note/NoteCard";
import { QuickCreate } from "@/components/Note/QuickCreate";
import { NoteModal, type NoteFormValues } from "@/components/Note/NoteModal";

import "@/styles/app/note.css";

const NoteApp = () => {
  const { dataUser, loading: contextLoading } = useStore() as {
    dataUser: { _id?: string } | null;
    loading: boolean;
  };

  const router = useRouter();

  const [notes, setNotes] = useState<INote[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<INote | null>(null);

  const isAuthed = useMemo(() => !!dataUser?._id, [dataUser?._id]);

  useEffect(() => {
    if (!contextLoading && !isAuthed) {
      router.push("/sign-in");
    }
  }, [contextLoading, isAuthed, router]);

  useEffect(() => {
    if (isAuthed) fetchNotes();
  }, [isAuthed]);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const res = await requestListNotes();
      setNotes(res?.metadata || []);
    } catch (error: any) {
      message.error(error?.response?.data?.message || "Lấy note thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async (
    values: Partial<INote>,
    id: string | null = null,
  ) => {
    try {
      let updated: INote | undefined;

      if (id) {
        const res = await requestUpdateNote(id, values);
        updated = res?.metadata;

        if (updated?._id) {
          setNotes((prev) => prev.map((n) => (n._id === id ? updated! : n)));
        }
      } else {
        const res = await requestCreateNote({
          ...values,
          pinned: values.pinned || false,
        });

        updated = res?.metadata;

        if (updated?._id) {
          setNotes((prev) => [updated!, ...prev]);
        }
      }

      if (!updated?._id) await fetchNotes();

      return true;
    } catch (error: any) {
      message.error(error?.response?.data?.message || "Thao tác thất bại");
      return false;
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await requestDeleteNote(id);
      setNotes((prev) => prev.filter((n) => n._id !== id));
      message.success("Xóa thành công");
    } catch (error: any) {
      message.error(error?.response?.data?.message || "Xóa thất bại");
    }
  };

  const handleModalSubmit = async (
    values: NoteFormValues,
    id: string | null,
  ) => {
    const ok = await handleCreateOrUpdate(values, id);
    if (ok) {
      message.success(id ? "Cập nhật thành công" : "Tạo mới thành công");
      setModalOpen(false);
    }
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return notes;

    return notes.filter(
      (n) =>
        (n.title || "").toLowerCase().includes(q) ||
        (n.content || "").toLowerCase().includes(q),
    );
  }, [notes, search]);

  const pinned = filtered.filter((n) => n.pinned);
  const others = filtered.filter((n) => !n.pinned);

  if (!contextLoading && !isAuthed) return null;

  return (
    <div className="note-app">
      <Header />

      <main className="note-app-main">
        {/* Toolbar */}
        <div className="note-app-toolbar">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm ghi chú..."
            allowClear
            className="note-app-search"
          />

          <Button
            className="note-app-create-btn"
            onClick={() => {
              setEditing(null);
              setModalOpen(true);
            }}
          >
            Tạo note
          </Button>
        </div>

        {/* Quick create */}
        <QuickCreate onSubmit={(data) => handleCreateOrUpdate(data)} />

        {/* Grid */}
        <div className={`note-app-grid ${loading ? "loading" : ""}`}>
          {!loading && pinned.length === 0 && others.length === 0 && (
            <div className="note-app-empty">Chưa có ghi chú nào</div>
          )}

          {pinned.length > 0 && (
            <div className="note-app-section">
              Ghim <PushpinOutlined />
            </div>
          )}

          {pinned.map((n) => (
            <div key={n._id} className="note-fade-in">
              <NoteCard
                note={n}
                onClick={(note) => {
                  setEditing(note);
                  setModalOpen(true);
                }}
                onTogglePin={(note) =>
                  handleCreateOrUpdate({ pinned: !note.pinned }, note._id)
                }
                onChangeColor={(note, color) =>
                  handleCreateOrUpdate({ color }, note._id)
                }
                onDelete={handleDelete}
              />
            </div>
          ))}

          {others.length > 0 && <div className="note-app-section">Khác</div>}

          {others.map((n) => (
            <div key={n._id} className="note-fade-in">
              <NoteCard
                note={n}
                onClick={(note) => {
                  setEditing(note);
                  setModalOpen(true);
                }}
                onTogglePin={(note) =>
                  handleCreateOrUpdate({ pinned: !note.pinned }, note._id)
                }
                onChangeColor={(note, color) =>
                  handleCreateOrUpdate({ color }, note._id)
                }
                onDelete={handleDelete}
              />
            </div>
          ))}
        </div>
      </main>

      {/* Modal */}
      <NoteModal
        open={modalOpen}
        editing={editing}
        onCancel={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default NoteApp;
