import {
  Button,
  Col,
  Divider,
  Empty,
  Form,
  Input,
  InputNumber,
  Radio,
  Result,
  Row,
  Steps,
  message,
  notification,
} from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  doDeleteCartItemAction,
  doPlaceOrderAction,
  doUpdateCartAction,
} from "../../redux/order/orderSlice";
import TextArea from "antd/es/input/TextArea";
import { SmileOutlined } from "@ant-design/icons";
import { callPlaceOrder } from "../../service/api";
import { useNavigate } from "react-router-dom";

const OrderPage = () => {
  const dispatch = useDispatch();
  const [totalPrice, setTotalPrice] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const books = useSelector((state) => state.order.carts);
  const user = useSelector((state) => state.account.user);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  useEffect(() => {
    if (books && books.length > 0) {
      let sum = 0;
      books.map((item) => {
        sum += item.quantity * item.detail.price;
      });
      setTotalPrice(sum);
    } else {
      setTotalPrice(0);
    }
  }, [books]);
  const handleOnChangeInput = (value, book) => {
    if (!value || value < 1) return;
    if (!isNaN(value)) {
      dispatch(
        doUpdateCartAction({ quantity: value, detail: book, _id: book._id })
      );
    }
  };
  const handleDeleteCart = (id) => {
    dispatch(doDeleteCartItemAction(id));
  };
  const handleOrder = () => {
    form.submit();
  };
  const onFinish = async (values) => {
    const detailOrder = books.map((item) => {
      return {
        bookName: item.detail.mainText,
        quantity: item.quantity,
        price: item.detail.price,
      };
    });
    const data = {
      name: values.name,
      address: values.address,
      phone: values.phone,
      totalPrice: totalPrice,
      detail: detailOrder,
      staffName: 'abc',
    };
    
    if (data) {
      const res = await callPlaceOrder(data);
      if (res && res.data) {
        message.success("Order success !");
        dispatch(doPlaceOrderAction());
        setCurrentStep(2);
      } else {
        notification.error({
          message: "Error",
          description: res.message,
        });
      }
    }
  };

  return (
    <>
      <Row style={{ margin: "16px 0" }}>
        <Steps
          size="small"
          current={currentStep}
          items={[
            {
              title: "The order",
            },
            {
              title: "Order",
            },
            {
              title: "Pay",
            },
          ]}
        />
      </Row>
      {currentStep === 0 && (
        <Row>
          {books.length > 0 ? (
            <Col span={14}>
              {books &&
                books.map((book) => {
                  const b = book.detail;
                  const total = book.quantity * b.price;
                  return (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        backgroundColor: "#fde4e4",
                        padding: "8px",
                        margin: "8px",
                      }}
                    >
                      <img
                        style={{ width: "50px", height: "50px" }}
                        src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${
                          b.thumbnail
                        }`}
                      />
                      <span>{b.mainText}</span>
                      <span>
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(`${b.price}`)}{" "}
                      </span>
                      <InputNumber
                        value={book.quantity}
                        onChange={(value) => handleOnChangeInput(value, b)}
                      ></InputNumber>
                      <span>
                        Total:{" "}
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(`${total}`)}{" "}
                      </span>
                      <button
                        style={{
                          border: "none",
                          padding: "8px 10px",
                          backgroundColor: "#fc9a72",
                          borderRadius: "10px",
                        }}
                        onClick={() => handleDeleteCart({ id: b._id })}
                      >
                        Delete
                      </button>
                    </div>
                  );
                })}
            </Col>
          ) : (
            <Col span={14}>
              <Empty></Empty>
            </Col>
          )}
          <Col span={10}>
            <Row
              style={{
                backgroundColor: "#fde4e4",
                width: "100%",
              }}
            >
              <Col
                span={24}
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "center",
                }}
              >
                <p>Provisional</p>
                <span>
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(`${totalPrice}`)}
                </span>
              </Col>
              <Divider />
              <Col
                span={24}
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "center",
                }}
              >
                <span>Total</span>
                <span style={{ color: "#fc5a29", fontSize: "20px" }}>
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(`${totalPrice}`)}
                </span>
              </Col>
              <Divider />
              <Col
                span={24}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingBottom: "16px",
                }}
              >
                <Button
                  style={{
                    backgroundColor: "#fc5a29",
                    color: "#fff",
                    border: "none",

                    height: "40px",
                    width: "70%",
                  }}
                  onClick={() => setCurrentStep(1)}
                  disabled={books.length > 0 ? false : true}
                >
                  Buy now ({books?.length ?? 0})
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      )}
      {currentStep === 1 && (
        <Row>
          <Col span={14}>
            {books &&
              books.map((book) => {
                const b = book.detail;
                const total = book.quantity * b.price;
                return (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      backgroundColor: "#fde4e4",
                      padding: "8px",
                      margin: "8px",
                    }}
                  >
                    <img
                      style={{ width: "50px", height: "50px" }}
                      src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${
                        b.thumbnail
                      }`}
                    />
                    <span>{b.mainText}</span>
                    <span>
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(`${b.price}`)}{" "}
                    </span>
                    <span>Quantity: {book.quantity}</span>
                    <span>
                      Total:{" "}
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(`${total}`)}{" "}
                    </span>
                    <button
                      style={{
                        border: "none",
                        padding: "8px 10px",
                        backgroundColor: "#fc9a72",
                        borderRadius: "10px",
                      }}
                      onClick={() => handleDeleteCart({ id: b._id })}
                    >
                      Delete
                    </button>
                  </div>
                );
              })}
          </Col>
          <Col span={10} style={{ backgroundColor: "#fde4e4" }}>
            <Form
              name="basic"
              initialValues={{ remember: true }}
              style={{ padding: "8px" }}
              onFinish={onFinish}
              form={form}
              // onFinishFailed={onFinishFailed}
              autoComplete="off"
              layout="vertical"
              fields={[
                {
                  name: ["name"],
                  value: user.fullName,
                },
                {
                  name: ["phone"],
                  value: user.phone,
                },
              ]}
            >
              <Form.Item
                label="Receiver"
                name="name"
                rules={[{ required: true, message: "Please input your name!" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Phone"
                name="phone"
                rules={[
                  { required: true, message: "Please input your phone!" },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Address"
                name="address"
                rules={[
                  { required: true, message: "Please input your address!" },
                ]}
              >
                <TextArea rows={2} />
              </Form.Item>
              <Form.Item label="Hình thức thanh toán" name="payment">
                <Radio checked>Thanh toán khi nhận hàng</Radio>
              </Form.Item>
              <Divider></Divider>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Total: </span>
                <span style={{ color: "#fc5a29", fontSize: "20px" }}>
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(`${totalPrice}`)}{" "}
                </span>
              </div>
              <Divider></Divider>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <button
                  style={{
                    backgroundColor: "#fc5a29",
                    color: "#fff",
                    border: "none",

                    height: "40px",
                    width: "80%",
                  }}
                  onClick={() => handleOrder()}
                >
                  Order ({books?.length ?? 0})
                </button>
              </div>
            </Form>
          </Col>
        </Row>
      )}
      {currentStep === 2 && (
        <Result
          icon={<SmileOutlined />}
          title="Great, Order success!"
          // extra={
          //   <Button type="primary" onClick={() => navigate("/history")}>
          //     History
          //   </Button>
          // }
        />
      )}
    </>
  );
};

export default OrderPage;
