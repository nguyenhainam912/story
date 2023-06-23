import { UploadOutlined } from "@ant-design/icons";
import { callUpdateUserInfo, callUploadAvatar } from "./../../service/api";
import { useState } from "react";
import {
  Avatar,
  Button,
  Col,
  Form,
  Input,
  Row,
  Upload,
  message,
  notification,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { doUpdateUserInfoAction } from "../../redux/account/accountSlide";
const ManageAccount = (props) => {
  const { closeModal } = props;
  const [dataAvatar, setDataAvatar] = useState([]);

  const user = useSelector((state) => state.account.user);
  const dispatch = useDispatch();
  const handleChangeAvatar = ({ file, fileList }) => {
    if (file.status !== "uploading") {
      console.log(file, fileList);
    }
    if (file.status === "done") {
      message.success(`${file.name} file uploaded successfully`);
    } else if (file.status === "error") {
      message.error(`${file.name} file upload failed.`);
    }
  };

  const handleUploadAvatar = async ({ file, onSuccess, onError }) => {
    const res = await callUploadAvatar(file);
    if (res && res.data) {
      setDataAvatar([
        {
          name: res.data.fileUploaded,
          uid: file.uid,
        },
      ]);
      onSuccess("Ok");
    } else {
      onError("Error");
    }
  };
  const onFinish = async (values) => {
    console.log(values);
    const { fullName, phone } = values;
    const userAvatar = dataAvatar[0]?.name ? dataAvatar[0]?.name : user.avatar;
    const res = await callUpdateUserInfo({
      _id: user.id,
      fullName: fullName,
      phone: phone,
      avatar: userAvatar,
    });
    if (res && res.data) {
      await dispatch(
        doUpdateUserInfoAction({ avatar: userAvatar, phone, fullName })
      );

      message.success("Update success");

      localStorage.removeItem("access_token");
      closeModal();
    } else {
      notification.error({
        message: "Error",
        description: res.message,
      });
    }
  };
  return (
    <Row>
      <Col span={12}>
        <Row>
          <Col span={24}>
            <Avatar
              size={100}
              src={
                dataAvatar[0]?.name
                  ? `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${
                      dataAvatar[0]?.name
                    }`
                  : `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${
                      user.avatar
                    }`
              }
            />
          </Col>
          <Col span={24}>
            <Upload
              name="file"
              multiple={false}
              onChange={handleChangeAvatar}
              customRequest={handleUploadAvatar}
            >
              <Button
                icon={<UploadOutlined />}
                style={{ width: "100px", marginTop: "16px" }}
              >
                Upload
              </Button>
            </Upload>
          </Col>
        </Row>
      </Col>
      <Col span={12}>
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
            {
              name: ["fullName"],
              value: user.fullName,
            },
            {
              name: ["phone"],
              value: user.phone,
            },
          ]}
        >
          <Form.Item label="Email" name="email">
            <Input disabled />
          </Form.Item>

          <Form.Item
            label="name"
            name="fullName"
            rules={[{ required: true, message: "Please input your fullName!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Phone"
            name="phone"
            rules={[
              {
                required: true,
                message: "Please input your new phone!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button htmlType="submit">Update</Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};

export default ManageAccount;
