import {
  AutoComplete,
  Avatar,
  Badge,
  Col,
  Dropdown,
  Input,
  Popover,
  Row,
  Space,
} from "antd";
import { SiNextdotjs } from "react-icons/si";
import { BsCart3 } from "react-icons/bs";
import { DownOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { doLogoutAction } from "../../redux/account/accountSlide";
import { callLogout } from "../../service/api";
import { useState } from "react";
import ModalInfo from "./ModalInfo";

const Header = () => {
  const [openModalInfo, setOpenModalInfo] = useState(false);
  const items = [
    {
      label: <a onClick={() => setOpenModalInfo(true)}>Infomation</a>,
      key: "0",
    },
    // {
    //   label: <a onClick={() => navigate("/history")}>History</a>,
    //   key: "1",
    // },
    {
      type: "divider",
    },
    {
      label: (
        <p style={{ margin: 0 }} onClick={() => handleLogout()}>
          Logout
        </p>
      ),
      key: "2",
    },
  ];
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogout = async () => {
    const res = await callLogout();
    if (res && res.data) {
      console.log("ok");
      dispatch(doLogoutAction());
      navigate("/");
    }
  };

  const isAuthenticated = useSelector((state) => state.account.isAuthenticated);
  const user = useSelector((state) => state.account.user);
  if (user?.role === "ADMIN") {
    items.unshift({
      label: <Link to="/admin">Admin Page</Link>,
      key: "admin",
    });
  }
  const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${
    user?.avatar
  }`;
  const contentPopover = () => {
    const books = useSelector((state) => state.order.carts);
    return (
      <div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {books &&
            books.map((book) => {
              const b = book.detail;
              return (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <img
                    style={{ width: "50px", height: "50px" }}
                    src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${
                      b.thumbnail
                    }`}
                  ></img>
                  <span style={{ padding: "0 6px" }}>{b.mainText}</span>
                  <span style={{ color: "#ff7777" }}>
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(`${b.price}`)}{" "}
                  </span>
                </div>
              );
            })}
          <div style={{ alignSelf: "flex-end", paddingTop: "8px" }}>
            <button
              style={{
                backgroundColor: "#ee4d2d",
                color: "#fff",
                border: "none",
                padding: "8px 10px",
              }}
              onClick={() => navigate("/order")}
            >
              View cart
            </button>
          </div>
        </div>
      </div>
    );
  };
  const totalQuality = useSelector((state) => state.order.carts);
  return (
    <>
      <Row justify="center" align="middle">
        <Col span={6} className="left">
          <p style={{ fontSize: 26, margin: 0 }} onClick={() => navigate("/")}>
            <SiNextdotjs />
          </p>
        </Col>
        <Col span={10} className="search">
          {/* <AutoComplete
            dropdownMatchSelectWidth={252}
            style={{ width: 300 }}
            //   options={options}
            //   onSelect={onSelect}
            //   onSearch={handleSearch}
          >
            <Input.Search size="large" placeholder="input here" enterButton />
          </AutoComplete> */}
        </Col>
        <Col span={6} className="right">
          <Row
            justify="center"
            align="space-evenly"
            style={{ alignItems: "center" }}
          >
            <Col span={10}>
              <Popover content={contentPopover} title="New product added">
                <Badge count={totalQuality?.length ?? 0} showZero size="small">
                  <p style={{ fontSize: 22, margin: 0 }}>
                    <BsCart3 />
                  </p>
                </Badge>
              </Popover>
            </Col>
            <Col span={10}>
              {!isAuthenticated ? (
                <Link to="/login">Login</Link>
              ) : (
                <Dropdown menu={{ items }} trigger={["click"]}>
                  <a onClick={(e) => e.preventDefault()}>
                    <Space size="small">
                      <Avatar src={urlAvatar} />
                      <p style={{ padding: 0, width: "66px" }}>
                        {user?.fullName}
                      </p>
                      <DownOutlined />
                    </Space>
                  </a>
                </Dropdown>
              )}
            </Col>
          </Row>
        </Col>
      </Row>
      {openModalInfo && (
        <ModalInfo
          openModalInfo={openModalInfo}
          setOpenModalInfo={setOpenModalInfo}
        ></ModalInfo>
      )}
    </>
  );
};

export default Header;
