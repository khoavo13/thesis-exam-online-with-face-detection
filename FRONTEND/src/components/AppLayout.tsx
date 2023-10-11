import React, { ReactNode, useState } from "react";
import {
  Button,
  Layout,
  Menu,
  Breadcrumb,
  theme,
  MenuTheme,
  Switch,
  Tooltip,
} from "antd";
import type { MenuProps } from "antd";

import bklogo from "/hcmut.png";
import Link from "antd/es/typography/Link";
import useAuth from "../hooks/useAuth";
import { useLocation, useNavigate } from "react-router-dom";
import {
  HomeOutlined,
  LogoutOutlined,
  UnorderedListOutlined,
  UserOutlined,
} from "@ant-design/icons";

const { Header, Content, Sider, Footer } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

export type IPathItem = {
  title: string;
  path: string;
};

interface IAppLayout {
  children: React.ReactNode;
  pathItems: IPathItem[];
}

interface IMenu {
  name: string;
  path: string;
  icon: ReactNode;
}

export default function AppLayout({ pathItems, children }: IAppLayout) {
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [pageTheme, setPageTheme] = useState<MenuTheme>("light");

  const studentMenu: IMenu[] = [
    {
      name: "Danh sách phòng thi",
      path: "/",
      icon: <UnorderedListOutlined />,
    },
    {
      name: "Đăng ký khuôn mặt",
      path: `/register-face/${auth?.id}`,
      icon: <UserOutlined />,
    },
  ];

  const teacherMenu: IMenu[] = [
    {
      name: "Danh sách phòng thi",
      path: "/teacher",
      icon: <UnorderedListOutlined />,
    },
    {
      name: "Đăng ký khuôn mặt",
      path: `/register-face/${auth?.id}`,
      icon: <UserOutlined />,
    },
  ];

  const renderedMenu =
    localStorage.getItem("roles") === "STUDENT" ? studentMenu : teacherMenu;

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const changeTheme = (value: boolean) => {
    setPageTheme(value ? "light" : "dark");
  };

  const logout = async () => {
    setAuth!(undefined);
    localStorage.clear();
    navigate("/login");
  };
  const goToHomePage = () => {
    const path = auth?.roles === "STUDENT" ? "/" : "/teacher";
    navigate(path);
  };

  return (
    <Layout>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        width={250}
        style={{
          overflow: "auto",
          position: "sticky",
          height: "100vh",
          top: 0,
          left: 0,
        }}
        theme={pageTheme}
      >
        <div
          style={{
            height: 100,
            margin: 16,
          }}
        >
          {!collapsed ? (
            <img
              style={{
                width: 100,
                height: 100,
                display: "block",
                marginLeft: "auto",
                marginRight: "auto",
              }}
              src={bklogo}
              alt="logo"
            />
          ) : (
            ""
          )}
        </div>
        <Menu
          theme={pageTheme}
          mode="inline"
          selectedKeys={[
            renderedMenu.find((menu) => menu.path === location.pathname)
              ?.path ?? "",
          ]}
        >
          {renderedMenu.map((menu, index) => {
            return (
              <Menu.Item
                key={menu.name}
                icon={menu.icon}
                onClick={() => navigate(menu.path)}
              >
                {menu.name}
              </Menu.Item>
            );
          })}
        </Menu>
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            display: "flex", // Sử dụng flexbox để căn chỉnh các phần tử trong header
            justifyContent: "space-between", // Các phần tử trong header sẽ nằm ở hai bên cùng của header
            alignItems: "center", // Căn chỉnh các phần tử dọc theo trục chính của header
          }}
        >
          <div
            style={{
              marginLeft: "24px",
            }}
          >
            <Button type="text" onClick={goToHomePage} icon={<HomeOutlined />}>
              Trang chủ
            </Button>
          </div>
          <div
            style={{
              marginRight: "24px",
            }}
          >
            <Button
              type="text"
              icon={<UserOutlined />}
              style={{
                marginRight: "12px",
                backgroundColor: "rgb(240, 242, 245)",
              }}
            >
              {auth?.fullname}
            </Button>

            <Tooltip placement="bottom" title="Đăng xuất">
              <Button onClick={logout} type="text" icon={<LogoutOutlined />} />
            </Tooltip>
          </div>
        </Header>
        <Layout style={{ padding: "0 24px 24px", overflow: "initial" }}>
          <Breadcrumb
            items={pathItems.map((item) => {
              return {
                title: item.title,
              };
            })}
            style={{ margin: "16px 0" }}
          />
          <Content
            style={{
              padding: 24,
              margin: 0,
              background: colorBgContainer,
            }}
          >
            {children}
          </Content>
        </Layout>
        <Footer style={{ textAlign: "center" }}>
          Online examination system ©2023 Created by nkdat
        </Footer>
      </Layout>
    </Layout>
  );
}
