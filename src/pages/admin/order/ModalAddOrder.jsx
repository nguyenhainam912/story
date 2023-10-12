import { Col, Form, Input, InputNumber, Modal, Row, Select, Table, message, notification } from "antd";
import { useEffect, useState } from "react";
import { callAddNewUser, callGetBook, callGetBookByName, callGetListStaff, callPlaceOrder } from "../../../service/api";

const ModalAddOrder = (props) => {
  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);
  const [listStaff, setListStaff] = useState([]);
  const [listBook, setListBook] = useState([]);
  const [listDetailBook, setListDetailBook] = useState([]);

  console.log("listDetailBook",listDetailBook)
  const onFinish = async (values) => {
    const { name, address, phone, staffName, quantity } = values;
    let total=0;
    const detailOrder = listDetailBook.map((item) => {
      total += item.price * quantity
      return {
        bookName: item.mainText,
        quantity: quantity,
        price: item.price,
      };
    });
    const data = {
      name: name,
      address: address,
      phone: phone,
      totalPrice: total,
      detail: detailOrder,
      staffName: staffName,
    };

    setIsSubmit(true);
    const res = await callPlaceOrder(data);
    if (res && res.data) {
      message.success("Create new order successfully");
      form.resetFields();
      props.handleOkModalAddOrder();
      props.getListOrder();
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

  const handleChange = async (value) => {
    let b = value.map(async(item) => {
      let a = (await callGetBookByName(item))
      return a.data
    })

    Promise.all(b).then((result) => {
      setListDetailBook(result)
      // all done here
      }).catch(err => {
          // error here
      });
  }
  const columns= [
    {
      title: 'Tên Sách',
      dataIndex: 'mainText',
      key: 'mainText',
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      render: () => <Form.Item name="quantity"><InputNumber defaultValue={0} /></Form.Item>,
    }]
  useEffect(() => {
    const fetchStaff = async () => {
      const res = await callGetListStaff();
      if (res && res.data) {
        const d = res.data.map((item) => {
          return { label: item.fullName, value: item.fullName };
        });
        setListStaff(d);
      }
    };
    const fetchBook = async () => {
      const res = await callGetBook();
      if (res && res.data) {
        const d = res.data.map((item) => {
          return { label: item.mainText, value: item.mainText };
        });
        setListBook(d);
      }
    };
    fetchBook()
    fetchStaff();
  }, []);
  return (
    <Modal
      title="Add New Order"
      open={props.showModalAddOrder}
      onOk={() => {
        form.submit();
      }}
      okText="Add"
      onCancel={props.handleCancelModalAddOrder}
      confirmLoading={isSubmit}
      width={"50vw"}

    >
      <Form
        name="basic"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 18 }}
        // style={{ maxWidth: 800}}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        form={form}
      >
        <Row gutter={15}>
            <Col span={12}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Tên Khách Hàng"
                name="name"
                rules={[{ required: true, message: "Please input your full name!" }]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={12}>
            <Form.Item
                labelCol={{ span: 24 }}

          label="Địa chỉ"
          name="address"
          rules={[{ required: true, message: "Please input your address!" }]}
        >
          <Input />
        </Form.Item>
            </Col>

            <Col span={12}>
            <Form.Item
                labelCol={{ span: 24 }}

          label="Số điện thoại"
          name="phone"
          rules={[{ required: true, message: "Please input your phone!" }]}
        >
          <Input />
        </Form.Item>
              </Col>

              <Col span={12}>
              <Form.Item
                labelCol={{ span: 24 }}

          label="Người phụ trách"
          name="staffName"
          rules={[{ required: true, message: "Please input your staffName!" }]}
        >
          <Select
                  defaultValue={null}
                  showSearch
                  allowClear
                  //  onChange={handleChange}
                  options={listStaff}
                />
        </Form.Item>
              </Col>

              <Col span={24}>
              <Form.Item
                labelCol={{ span: 24 }}

          label="Chọn Sách"
          name="bookName"
          rules={[{ required: true, message: "Please input your bookName!" }]}
        >
          <Select
                  // defaultValue={null}
                  mode="multiple"
                  showSearch
                  allowClear
                  onChange={handleChange}
                  options={listBook}
                />
        </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item>
                  <Table span={24} columns={columns} dataSource={listDetailBook} pagination={false}/>
                </Form.Item>
              </Col>

        </Row>
      </Form>
    </Modal>
  );
};

export default ModalAddOrder;
