import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Button, theme, Dropdown, Space, Avatar } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { useState } from "react";
import { RxDashboard } from "react-icons/rx";
import {
  AiOutlineUser,
  AiOutlineBook,
  AiOutlineDollarCircle,
  AiOutlineUsergroupDelete,
} from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { doLogoutAction } from "../../redux/account/accountSlide";
import { callLogout } from "../../service/api";

const AdminPage = ({ children }) => {
  const { Header, Sider, Content } = Layout;
  const [collapsed, setCollapsed] = useState(false);
  const isAuthenticated = useSelector((state) => state.account.isAuthenticated);
  const user = useSelector((state) => state.account.user);
  const navigate = useNavigate();
  const items = [
    {
      label: <a href="#">Infomation</a>,
      key: "0",
    },
    {
      type: "divider",
    },
    {
      label: <p onClick={() => handleLogout()}>Logout</p>,
      key: "1",
    },
  ];
  const dispatch = useDispatch();
  const handleLogout = async () => {
    const res = await callLogout();
    if (res && res.data) {
      console.log("ok");
      dispatch(doLogoutAction());
      navigate("/");
    }
  };
  if (user?.role === "ADMIN") {
    items.unshift({
      label: <Link to="/admin">Admin Page</Link>,
      key: "admin",
    });
  }
  const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${
    user?.avatar
  }`;
  return (
    <Layout style={{ minHeight: "96vh", color: "#fff" }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{ backgroundColor: "#fff" }}
      >
        <div className="logo" />
        <Menu
          theme="light"
          mode="inline"
          //   reverseArrow="true"
          defaultSelectedKeys={["1"]}
          items={[
            {
              key: "0",
              label: "Admin",
            },
            {
              key: "1",
              icon: <RxDashboard />,
              label: "Dashboard",
              onClick: () => navigate("/admin"),
            },
            {
              key: "2",
              icon: <AiOutlineUser />,
              label: "Manage Users",
              children: [
                {
                  key: "5",
                  icon: <AiOutlineUsergroupDelete />,
                  label: "CRUD",
                  onClick: () => navigate("/admin/user"),
                },
              ],
            },
            {
              key: "3",
              icon: <AiOutlineBook />,
              label: "Manage Book",
              onClick: () => navigate("/admin/book"),
            },
            {
              key: "4",
              icon: <AiOutlineDollarCircle />,
              label: "Manage Orders",
              onClick: () => navigate("/admin/order"),
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: "#fff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
          {!isAuthenticated ? (
            <span onClick={() => Navigate("/login")}>Login</span>
          ) : (
            <Dropdown menu={{ items }} trigger={["click"]}>
              <a onClick={(e) => e.preventDefault()}>
                <Space size="small">
                  <Avatar src={urlAvatar} />
                  <p style={{ padding: 0, width: "66px" }}>{user?.fullName}</p>
                  <DownOutlined />
                </Space>
              </a>
            </Dropdown>
          )}
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: "#fff",
            color: "#222",
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminPage;
