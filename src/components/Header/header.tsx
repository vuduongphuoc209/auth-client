"use client";

import React from "react";
import "@/styles/header.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/hooks/useStore";
import { DownOutlined, SettingOutlined } from "@ant-design/icons";
import { Dropdown, message, Space } from "antd";
import type { MenuProps } from "antd";
import { requestLogout } from "@/config/UserRequest";
import { IUserHeader } from "@/types/user";

const Header: React.FC = () => {
  const { dataUser, isAdmin } = useStore() as {
    dataUser: IUserHeader;
    isAdmin: boolean;
  };

  const router = useRouter();

  const handleLogout = async () => {
    try {
      await requestLogout();

      setTimeout(() => {
        window.location.reload();
      }, 1000);

      router.push("/");
    } catch (error: any) {
      message.error(error?.response?.data?.message || "Đăng xuất thất bại");
    }
  };

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: dataUser?.email || "My Account",
      disabled: true,
    },
    {
      type: "divider",
    },
    {
      key: "2",
      label: "Profile",
      onClick: () => router.push("/profile"),
      className: "header-dropdown-profile",
    },
    ...(isAdmin
      ? [
          {
            key: "admin",
            label: "Account Users",
            onClick: () => router.push("/users"),
            className: "header-dropdown-admin",
          },
        ]
      : []),
    {
      key: "3",
      label: "Settings",
      icon: <SettingOutlined />,
      onClick: () => router.push("/settings"),
    },
    {
      key: "4",
      label: "Logout",
      onClick: handleLogout,
      className: "header-dropdown-logout",
    },
  ];

  return (
    <header className="app-header">
      {/* LEFT */}
      <div className="header-left">
        <Link href="/" className="logo-text">
          LOGO
        </Link>
      </div>

      {/* RIGHT */}
      <div className="header-right">
        {dataUser && dataUser._id ? (
          <>
            {isAdmin && (
              <Link href="/users" className="admin-link">
                Account Users
              </Link>
            )}

            <Link href="/note-app" className="note-app-link">
              Note
            </Link>

            <Dropdown menu={{ items }} placement="bottomRight">
              <div className="user-dropdown-trigger">
                <Space>
                  <span
                    style={{
                      maxWidth: 150,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {dataUser?.fullName || dataUser?.email || "Tài khoản"}
                  </span>
                  <DownOutlined style={{ fontSize: 12 }} />
                </Space>
              </div>
            </Dropdown>
          </>
        ) : (
          <Link href="/sign-in" className="login-button">
            Login
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
