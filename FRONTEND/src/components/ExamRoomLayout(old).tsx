import { Button, Layout, MenuTheme, Switch, Tabs, theme } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const { Header, Content, Sider } = Layout;

export interface ITab {
  label: string;
  key: string;
  children: React.ReactNode;
}

interface IExamRoom {
  tabList: ITab[];
  activeKey: string;
  onChangeTab: ((activeKey: string) => void) | undefined;
}

export default function ExamRoomLayout({
  tabList,
  activeKey,
  onChangeTab,
}: IExamRoom) {
  const [pageTheme, setPageTheme] = useState<MenuTheme>("light");
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();

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

  return (
    <Layout>
      <Header
        style={{
          padding: 0,
          background: colorBgContainer,
        }}
      >
        <div
          style={{
            marginRight: "24px",
            position: "relative",
            float: "right",
          }}
        >
          <Switch
            checked={pageTheme === "light"}
            onChange={changeTheme}
            checkedChildren="Sáng"
            unCheckedChildren="Tối"
            style={{ marginRight: 50 }}
          />
          <span>
            <Button onClick={logout} type="link">
              Đăng xuất
            </Button>
          </span>
        </div>
      </Header>
      <Content style={{ padding: "10px 50px" }}>
        {/* <Layout
          style={{
            padding: "24px 20px",
            background: colorBgContainer,
            minHeight: "calc(100vh - 84px)",
          }}
        > */}
        <Tabs
          type="card"
          // defaultActiveKey="2"
          style={
            {
              // backgroundColor: colorBgContainer,
            }
          }
          tabBarStyle={{
            // backgroundColor: "rgba(0, 0, 0, 0.001)",
            marginBottom: 0,
            // background: "none",
          }}
          activeKey={activeKey}
          onChange={onChangeTab}
          items={tabList.map((tab) => {
            return {
              label: tab.label,
              key: tab.key,
              children: (
                <Layout
                  style={{
                    padding: "12px 10px",
                    minHeight: "calc(100vh - 124px)",
                    backgroundColor: colorBgContainer,
                  }}
                >
                  {tab.children}
                </Layout>
              ),
            };
          })}
        />
        {/* </Layout> */}
      </Content>
    </Layout>
  );
}
