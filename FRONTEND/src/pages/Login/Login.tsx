import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Card, Checkbox, Form, Input, message } from "antd";
import axios, { axiosPublic } from "../../api/axios";
import { useNavigate, useLocation } from "react-router-dom";
import useLoad from "../../hooks/useLoad";
import useAuth from "../../hooks/useAuth";
import { useEffect } from "react";
import Cookies from "js-cookie";

export default function Login() {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { showLoading, hideLoading } = useLoad();

  const onFinish = async (values: any) => {
    try {
      showLoading!();
      const response = await axios.post("/api/users/auth/login", values);
      hideLoading!();

      if (response.status === 200) {
        message.success("Đăng nhập thành công");
        const accessToken = response?.data?.data?.token;
        const roles = response?.data?.data?.role;
        const id = response?.data.data.userId;

        const userInfoRes = await axios.get(`/api/users/${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        setAuth!({
          username: values.username,
          roles: roles[0],
          id,
          userNumber: userInfoRes.data.userNumber,
          email: userInfoRes.data.email,
          fullname: userInfoRes.data.fullName,
        });

        Cookies.set("accessToken", accessToken, { expires: 1 });

        localStorage.setItem("roles", roles[0].toString());
        localStorage.setItem("userId", id);

        if (roles.includes("STUDENT")) {
          navigate("/", { replace: true });
        } else if (roles.includes("TEACHER")) {
          navigate("/teacher", { replace: true });
        }
      }
    } catch (error: any) {
      hideLoading!();
      console.log(error);
      if (error.response.status === 400) {
        message.error("Sai tên đăng nhập hoặc mật khẩu");
      } else {
        message.error("Có gì đó không ổn");
      }
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgb(240, 242, 245)",
      }}
    >
      <Card title="ĐĂNG NHẬP" style={{ width: "400px" }} bordered={true}>
        <Form
          onFinish={onFinish}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: "400px" }}
        >
          <Form.Item
            label="Tên đăng nhập"
            name="username"
            rules={[{ required: true, message: "Tên đăng nhập là bắt buộc!" }]}
          >
            <Input
              prefix={<UserOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
              placeholder="Username"
            />
          </Form.Item>
          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: "Mật khẩu là bắt buộc!" }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
              placeholder="Password"
              type="password"
            />
          </Form.Item>

          <Form.Item
            wrapperCol={{ offset: 8, span: 16 }}
            // style={{ paddingTop: "20px" }}
          >
            <Button type="primary" htmlType="submit">
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
