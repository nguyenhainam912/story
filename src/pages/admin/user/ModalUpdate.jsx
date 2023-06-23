import { Form, Input, Modal, message, notification } from "antd";
import { useEffect, useState } from "react";
import { updateUser } from "../../../service/api";

const ModalUpdateUser = ({ ...props }) => {
  const [form] = Form.useForm();
  const { openModalUpdate, handleCancelModalUpdate, dataUpdate, callGetUser } =
    props;
  const [isSubmit, setIsSubmit] = useState(false);
  const onFinish = async (values) => {
    const { _id, fullName, phone } = values;
    setIsSubmit(true);
    const res = await updateUser(_id, fullName, phone);
    if (res && res.data) {
      message.success("Update User Success");
      handleCancelModalUpdate();
      setIsSubmit(false);
      await callGetUser();
    } else {
      notification.error({
        message: "Error",
        description: res.message,
      });
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  useEffect(() => {
    form.setFieldsValue(dataUpdate);
  }, [dataUpdate]);
  return (
    <Modal
      title="Basic Modal"
      open={openModalUpdate}
      onOk={() => {
        form.submit();
      }}
      okText="Add"
      onCancel={() => handleCancelModalUpdate()}
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
          hidden
          label="Id"
          name="_id"
          rules={[{ required: true, message: "Please input your id!" }]}
        >
          <Input disabled />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Please input your email!" }]}
        >
          <Input disabled />
        </Form.Item>
        <Form.Item
          label="Full name"
          name="fullName"
          rules={[{ required: true, message: "Please input your full name!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Phone"
          name="phone"
          rules={[{ required: true, message: "Please input your phone!" }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalUpdateUser;
