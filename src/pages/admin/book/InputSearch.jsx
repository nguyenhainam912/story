import { Button, Col, Form, Input, Row, Space } from "antd";
import { useState } from "react";
import { callGetListBook } from "../../../service/api";

const InputSearch = (props) => {
  const { handleSearch } = props;
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    const { mainText, author, category } = values;
    let query = "current=1";
    if (mainText) {
      query += `&mainText=/${mainText}/i`;
    } else if (author) {
      query += `&author=/${author}/i`;
    } else if (category) {
      query += `&category=/${category}/i`;
    }
    // else {
    //   query = "current=1&pageSize=2";
    // }
    const res = await callGetListBook(query);
    if (res && res.data) {
      handleSearch(res.data);
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
            <Form.Item name="mainText">
              <Input placeholder="Book" style={{ minWidth: "200px" }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="author">
              <Input placeholder="Author" style={{ minWidth: "200px" }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="category">
              <Input placeholder="category" style={{ minWidth: "200px" }} />
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
