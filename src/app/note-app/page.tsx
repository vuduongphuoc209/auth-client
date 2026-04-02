"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, message } from "antd";
import Header from "@/components/Header/header";
import { useStore } from "@/hooks/useStore";
import {
  requestCreateNote,
  requestDeleteNote,
  requestListNotes,
  requestUpdateNote,
  type INote,
} from "@/config/NoteRequest";

// Import các child components
import { NoteCard } from "@/components/Note/NoteCard";
import { QuickCreate } from "@/components/Note/QuickCreate";
import { NoteModal, type NoteFormValues } from "@/components/Note/NoteModal";

const NoteApp = () => {
  const { dataUser, loading: contextLoading } = useStore() as {
    dataUser: { _id?: string } | null;
    loading: boolean;
  };
  const router = useRouter();

  const [notes, setNotes] = useState<INote[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editing, setEditing] = useState<INote | null>(null);

  const isAuthed = useMemo(() => !!dataUser?._id, [dataUser?._id]);

  useEffect(() => {
    if (!contextLoading && !isAuthed) {
      router.push("/sign-in");
    }
  }, [contextLoading, isAuthed, router]);

  useEffect(() => {
    if (isAuthed) fetchNotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthed]);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const res = await requestListNotes();
      setNotes(res?.metadata || []);
    } catch (error: any) {
      message.error(error?.response?.data?.message || "Lay note that bai");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async (
    values: Partial<INote>,
    isEditingId: string | null = null,
  ) => {
    try {
      let updatedNote: INote | undefined;

      if (isEditingId) {
        const res = await requestUpdateNote(isEditingId, values);
        updatedNote = res?.metadata;
        if (updatedNote?._id) {
          setNotes((prev) =>
            prev.map((n) => (n._id === isEditingId ? updatedNote! : n)),
          );
        }
      } else {
        const res = await requestCreateNote({
          ...values,
          pinned: values.pinned || false,
        });
        updatedNote = res?.metadata;
        if (updatedNote?._id) {
          setNotes((prev) => [updatedNote!, ...prev]);
        }
      }

      if (!updatedNote?._id) await fetchNotes(); // Fallback re-fetch if no note returned

      return true;
    } catch (error: any) {
      message.error(error?.response?.data?.message || "Thao tac that bai");
      return false;
    }
  };

  const handleQuickCreateSubmit = async (data: {
    title: string;
    content: string;
    color: string;
  }) => {
    await handleCreateOrUpdate(data);
  };

  const handleModalSubmit = async (
    values: NoteFormValues,
    editingId: string | null,
  ) => {
    const success = await handleCreateOrUpdate(values, editingId);
    if (success) {
      message.success(
        editingId ? "Cap nhat note thanh cong" : "Tao note thanh cong",
      );
      setModalOpen(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await requestDeleteNote(id);
      setNotes((prev) => prev.filter((n) => n._id !== id));
      message.success("Xoa note thanh cong");
    } catch (error: any) {
      message.error(error?.response?.data?.message || "Xoa note that bai");
    }
  };

  // Derived state
  const filteredNotes = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return notes;
    return notes.filter(
      (n) =>
        (n.title || "").toLowerCase().includes(q) ||
        (n.content || "").toLowerCase().includes(q),
    );
  }, [notes, search]);

  const pinnedNotes = useMemo(
    () => filteredNotes.filter((n) => n.pinned),
    [filteredNotes],
  );
  const otherNotes = useMemo(
    () => filteredNotes.filter((n) => !n.pinned),
    [filteredNotes],
  );

  if (!contextLoading && !isAuthed) return null;

  return (
    <div style={{ minHeight: "100vh" }}>
      <header>
        <Header />
      </header>

      <main style={{ maxWidth: 1100, margin: "24px auto", padding: "0 16px" }}>
        <div
          style={{
            display: "flex",
            gap: 12,
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tim note..."
            allowClear
            style={{ maxWidth: 520 }}
          />
          <div style={{ flex: 1 }} />
          <Button
            onClick={() => {
              setEditing(null);
              setModalOpen(true);
            }}
          >
            Tao note
          </Button>
        </div>

        <QuickCreate onSubmit={handleQuickCreateSubmit} />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: 14,
            opacity: loading ? 0.7 : 1,
          }}
        >
          {pinnedNotes.length === 0 && otherNotes.length === 0 && !loading && (
            <div style={{ gridColumn: "1 / -1", color: "rgba(0,0,0,0.55)" }}>
              Chua co note nao
            </div>
          )}

          {pinnedNotes.length > 0 && (
            <div style={{ gridColumn: "1 / -1", color: "rgba(0,0,0,0.55)" }}>
              PINNED
            </div>
          )}
          {pinnedNotes.map((n) => (
            <NoteCard
              key={n._id}
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
          ))}

          {otherNotes.length > 0 && (
            <div
              style={{
                gridColumn: "1 / -1",
                color: "rgba(0,0,0,0.55)",
                marginTop: pinnedNotes.length > 0 ? 8 : 0,
              }}
            >
              OTHERS
            </div>
          )}
          {otherNotes.map((n) => (
            <NoteCard
              key={n._id}
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
          ))}
        </div>
      </main>

      <NoteModal
        open={modalOpen}
        editing={editing}
        onCancel={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
};

export default NoteApp;
