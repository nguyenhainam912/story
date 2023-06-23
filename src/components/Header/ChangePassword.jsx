import { Button, Form, Input, message, notification } from "antd";
import { callUpdatePassword } from "./../../service/api";
import { useSelector } from "react-redux";
const ChangePassword = () => {
  const [form] = Form.useForm();
  const user = useSelector((state) => state.account.user);
  const onFinish = async (values) => {
    const { email, oldpass, newpass } = values;
    const res = await callUpdatePassword(email, oldpass, newpass);
    if (res && res.data) {
      message.success("Update password success");
    } else {
      notification.error({
        message: "Error",
        description: res.message,
      });
    }
  };
  return (
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600 }}
      initialValues={{ remember: true }}
      layout="vertical"
      onFinish={onFinish}
      //   onFinishFailed={onFinishFailed}
      autoComplete="off"
      fields={[
        {
          name: ["email"],
          value: user.email,
        },
      ]}
      form={form}
    >
      <Form.Item label="Email" name="email">
        <Input disabled />
      </Form.Item>

      <Form.Item
        label="Password Current"
        name="oldpass"
        rules={[{ required: true, message: "Please input your password!" }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        label="Password New"
        name="newpass"
        rules={[
          {
            required: true,
            message: "Please input your new password!",
          },
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Update
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ChangePassword;
