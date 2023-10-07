import { Form, Input, Modal, message, notification } from "antd";
import { useState } from "react";
import { callAddNewUser } from "../../../service/api";

const ModalAddUser = (props) => {
  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);

  const onFinish = async (values) => {
    const { fullName, password, email, phone, address } = values;
    const role ="SUPPLIER"
    setIsSubmit(true);
    const res = await callAddNewUser(fullName, password, email, phone, address, role);
    if (res && res.data) {
      message.success("Create new user successfully");
      form.resetFields();
      props.handleOkModalAddUser();
      props.callGetUser();
    } else {
      notification.error({
        message: "Error",
        description: res.message,
      });
    }
    setIsSubmit(false);
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <Modal
      title="Add New Staff"
      open={props.openModalAddUser}
      onOk={() => {
        form.submit();
      }}
      okText="Add"
      onCancel={props.handleCancelModalAddUser}
      confirmLoading={isSubmit}
    >
      <Form
        name="basic"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 18 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        form={form}
      >
        <Form.Item
          label="Full name"
          name="fullName"
          rules={[{ required: true, message: "Please input your full name!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Please input your email!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="Phone"
          name="phone"
          rules={[{ required: true, message: "Please input your phone!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Địa chỉ"
          name="address"
          rules={[{ required: true, message: "Please input your address!" }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalAddUser;
