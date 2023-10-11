import { Layout, Tabs, theme } from "antd";

export interface ITab {
  label: string;
  key: string;
  children: React.ReactNode;
}

interface NotifyRoomProps {
  tabList: ITab[];
}

export default function NotifyRoom({ tabList }: NotifyRoomProps) {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Tabs
      style={{
        margin: "0px 12px",
        background: colorBgContainer,
      }}
      // tabBarStyle={{ width: 0 }}
      defaultActiveKey="1"
      centered={true}
      items={tabList.map((tab) => {
        return {
          label: tab.label,
          key: tab.key,
          children: (
            <Layout
              style={{
                padding: "12px 10px",
                height: "calc(100vh - 174px)",
                backgroundColor: colorBgContainer,
              }}
            >
              {tab.children}
            </Layout>
          ),
        };
      })}
    />
  );
}
