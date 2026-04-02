import React, { useEffect } from "react";
import { Button, Dropdown, Form, Input, Modal } from "antd";
import type { INote } from "@/config/NoteRequest";
import { getColorMenuItems } from "@/components/Note/constants";
import { NOTE_COLORS } from "@/constants/noteColors";

export interface NoteFormValues {
  title: string;
  content: string;
  color?: string;
  pinned?: boolean;
}

interface NoteModalProps {
  open: boolean;
  editing: INote | null;
  onCancel: () => void;
  onSubmit: (values: NoteFormValues, editingId: string | null) => void;
}

export const NoteModal: React.FC<NoteModalProps> = ({
  open,
  editing,
  onCancel,
  onSubmit,
}) => {
  const [form] = Form.useForm<NoteFormValues>();
  const color = Form.useWatch("color", form);

  useEffect(() => {
    if (open) {
      if (editing) {
        form.setFieldsValue({
          title: editing.title || "",
          content: editing.content || "",
          color: editing.color || "default",
          pinned: !!editing.pinned,
        });
      } else {
        form.resetFields();
        form.setFieldsValue({ color: "default", pinned: false });
      }
    }
  }, [open, editing, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values, editing?._id || null);
    } catch (error) {
      // Form validation failed
    }
  };

  return (
    <Modal
      title={editing ? "Sua note" : "Tao note"}
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      okText={editing ? "Cap nhat" : "Tao"}
      cancelText="Huy"
      width={640}
      destroyOnHidden
    >
      <Form form={form} layout="vertical">
        <Form.Item name="title" label="Tieu de">
          <Input placeholder="Nhap tieu de" />
        </Form.Item>
        <Form.Item name="content" label="Noi dung" rules={[{ required: true }]}>
          <Input.TextArea rows={6} placeholder="Nhap noi dung" />
        </Form.Item>
        <Form.Item name="color" label="Mau">
          <Dropdown
            menu={{
              items: getColorMenuItems((c) => form.setFieldValue("color", c)),
            }}
          >
            <Button>
              {NOTE_COLORS.find((x) => x.value === color)?.label || "Mac dinh"}
            </Button>
          </Dropdown>
        </Form.Item>
      </Form>
    </Modal>
  );
};
