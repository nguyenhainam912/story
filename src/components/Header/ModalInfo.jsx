import {
  Avatar,
  Button,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Tabs,
  Upload,
  message,
} from "antd";
import { useState } from "react";
import ManageAccount from "./ManageAccount";
import ChangePassword from "./ChangePassword";

const ModalInfo = (props) => {
  const { openModalInfo, setOpenModalInfo } = props;

  const closeModal = () => {
    setOpenModalInfo(false);
  };

  const items = [
    {
      key: "1",
      label: `Update information`,
      children: <ManageAccount closeModal={closeModal} />,
    },
    {
      key: "2",
      label: `Change password`,
      children: <ChangePassword />,
    },
  ];
  return (
    <Modal
      title="Manage Information"
      open={() => setOpenModalInfo(true)}
      onOk={() => setOpenModalInfo(false)}
      onCancel={() => setOpenModalInfo(false)}
      footer={null}
    >
      <Tabs defaultActiveKey="1" items={items} />
    </Modal>
  );
};

export default ModalInfo;
