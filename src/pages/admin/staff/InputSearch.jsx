import { Button, Col, Form, Input, Row, Space } from "antd";
import { callGetListUser } from "../../../service/api";

const InputSearch = (props) => {
  const { handleSearch } = props;
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    const { fullName, email, phone } = values;
    let query = "current=1&role=USER";
    if (fullName) {
      query += `&fullName=/${fullName}/i`;
    } else if (email) {
      query += `&email=/${email}/i`;
    } else if (phone) {
      query += `&phone=/${phone}/i`;
    } else {
      query = "current=1&pageSize=2";
    }
    const res = await callGetListUser(query);
    if (res && res.data) {
      console.log(res.data.result);
      handleSearch(res.data.result);
    }
  };
  return (
    <div style={{ marginBottom: "40px" }}>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        // style={{ maxWidth: 1000 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        // onFinishFailed={onFinishFailed}
        autoComplete="off"
        form={form}
      >
        <Row>
          <Col span={8}>
            <Form.Item name="fullName">
              <Input placeholder="Name" style={{ minWidth: "200px" }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="email">
              <Input placeholder="Email" style={{ minWidth: "200px" }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="phone">
              <Input placeholder="Phone" style={{ minWidth: "200px" }} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Row justify="end">
        <Space size="middle">
          <Button type="primary" onClick={() => form.submit()}>
            Search
          </Button>
          <Button type="dashed">Clear</Button>
        </Space>
      </Row>
    </div>
  );
};

export default InputSearch;
