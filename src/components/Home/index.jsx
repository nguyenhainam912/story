import {
  Button,
  Checkbox,
  Col,
  Divider,
  Form,
  Image,
  Input,
  InputNumber,
  Pagination,
  Rate,
  Row,
  Tabs,
} from "antd";
import { useEffect, useState } from "react";
import { AiFillFilter, AiOutlineReload } from "react-icons/ai";
import { callCategory, callGetListBook } from "../../service/api";
import { useNavigate } from "react-router-dom";
const Home = () => {
  const [currentTab, setCurrentTab] = useState("popular");
  const [category, setCategory] = useState([]);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [total, setTotal] = useState(10);
  const [sortQuery, setSortQuery] = useState("-sold");
  const [filter, setFilter] = useState("");
  const [dataBook, setDataBook] = useState([]);

  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onClick = (e) => {
    console.log("click ", e);
    setCurrentTab(e.key);
  };
  const fetchCategory = async () => {
    const res = await callCategory();
    if (res && res.data) {
      setCategory(res.data);
    }
  };
  const fetchBook = async () => {
    let query = `current=${current}&pageSize=${pageSize}`;
    if (filter) {
      query += `&${filter}`;
    }
    if (sortQuery) {
      query += `&sort=${sortQuery}`;
    }
    const res = await callGetListBook(query);
    setTotal(res?.data?.meta?.total);
    if (res && res.data && res.data.result) {
      setDataBook(res.data.result);
    }
  };
  useEffect(() => {
    fetchCategory();
  }, []);

  useEffect(() => {
    fetchBook();
  }, [current, pageSize, filter, sortQuery]);
  const items = [
    {
      label: "Popular",
      key: "-sold",
      children: <></>,
    },
    {
      label: "New",
      key: "-updatedAt",
      children: <></>,
    },
    {
      label: "Low to high price",
      key: "-price",
      children: <></>,
    },
    {
      label: "High to low price",
      key: "price",
      children: <></>,
    },
  ];

  const handleChangeFilter = (changedValues, values) => {
    console.log("value change", changedValues, values);

    if (changedValues.category) {
      const cate = values.category;
      if (cate && cate.length > 0) {
        const f = cate.join(",");
        setFilter(`category=${f}`);
      } else {
        setFilter("");
      }
    }
  };
  const handleOnChangePage = (pagination) => {
    if (pagination && pagination.current !== current) {
      setCurrent(pagination.current);
    }
    if (pagination && pagination.pageSize !== pageSize) {
      setPageSize(pagination.pageSize);
      setCurrent(1);
    }
  };
  const onChangeTab = (key) => {
    setSortQuery(key);
    setCurrent(1);
  };

  const onFinish = (values) => {
    console.log(values);
    if (values?.range?.from >= 0 && values?.range?.to >= 0) {
      let f = `price>=${values?.range?.from}&price<=${values?.range?.to}`;
      if (values?.category?.length) {
        const cate = values?.category?.join(",");
        f += `&category=${cate}`;
      }
      setFilter(f);
    }
  };
  const nonAccentVietnamese = (str) => {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");

    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");

    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư

    // Loại bỏ các ký tự đặc biệt
    // str = str.replace(/[^a-zA-Z0-9 \s]/g, "")

    return str;
  };
  const convertSlug = (str) => {
    str = nonAccentVietnamese(str);
    str = str.replace(/^\s+|\s+$/g, ""); // trim
    str = str.toLowerCase();

    // remove accents, swap ñ for n, etc
    var from = "ãàáäâẽèéëêìíïîõòóöôùúüûñç·/_,:;";
    var to = "aaaaaeeeeeiiiiooooouuuunc------";
    for (var i = 0, l = from.length; i < l; i++) {
      str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
    }

    str = str
      .replace(/[^a-z0-9 -]/g, "") // remove invalid chars
      .replace(/\s+/g, "-") // collapse whitespace and replace by -
      .replace(/-+/g, "-"); // collapse dashes

    return str;
  };
  const handleRedirectBook = (book) => {
    const slug = convertSlug(book.mainText);
    navigate(`/book/${slug}?id=${book._id}`);
  };
  return (
    <div style={{ backgroundColor: "#f4f4f4" }}>
      <Row justify="space-between" gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col
          xs={0}
          sm={0}
          md={4}
          lg={4}
          xl={4}
          style={{ padding: "16px", backgroundColor: "#fff" }}
        >
          <Row justify="space-between">
            <span>
              Filter <AiFillFilter />
            </span>
            <span>
              <AiOutlineReload onClick={() => form.resetFields()} />
            </span>
          </Row>
          <Divider />
          <Form
            name="basic"
            //   labelCol={{ span: 8 }}
            //   wrapperCol={{ span: 16 }}
            //   style={{ maxWidth: 600 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            //   onFinishFailed={onFinishFailed}
            autoComplete="off"
            layout="vertical"
            form={form}
            onValuesChange={(changedValues, values) =>
              handleChangeFilter(changedValues, values)
            }
          >
            <Form.Item label="List Book" name="category">
              <Checkbox.Group
                style={{ flexDirection: "column" }}
                options={category}
                //   onChange={onChange}
              />
            </Form.Item>
            <Divider />
            <Form.Item label="Price range">
              <Form.Item
                name={["range", "from"]}
                style={{
                  display: "inline-block",
                  width: "calc(50% - 16px)",
                  margin: "0 2px",
                }}
              >
                <InputNumber
                  step={1000}
                  placeholder="From"
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                />
              </Form.Item>
              -
              <Form.Item
                name={["range", "to"]}
                style={{
                  display: "inline-block",
                  width: "calc(50% - 16px)",
                  margin: "0 2px",
                }}
              >
                <InputNumber
                  placeholder="to"
                  step={1000}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                />
              </Form.Item>
            </Form.Item>
          </Form>
          <Button
            type="primary"
            style={{ width: "90%", margin: "5%" }}
            onClick={() => form.submit()}
          >
            APPLY
          </Button>
          {/* <Col>
            <Form
              name="basic"
              //   labelCol={{ span: 8 }}
              //   wrapperCol={{ span: 16 }}
              //   style={{ maxWidth: 600 }}
              initialValues={{ remember: true }}
              //   onFinish={onFinish}
              //   onFinishFailed={onFinishFailed}
              autoComplete="off"
              layout="vertical"
            >
              <Form.Item label="Rate" name="rate">
                <Rate defaultValue="5" disabled="true" />
                <Col>
                  <Rate defaultValue="4" disabled="true" />
                </Col>
                <Col>
                  <Rate defaultValue="3" disabled="true" />
                </Col>
                <Col>
                  <Rate defaultValue="2" disabled="true" />
                </Col>
                <Col>
                  <Rate defaultValue="1" disabled="true" />
                </Col>
              </Form.Item>
            </Form>
          </Col> */}
        </Col>
        <Col
          xs={24}
          sm={24}
          md={20}
          lg={20}
          xl={20}
          style={{ padding: "8px", backgroundColor: "#fff" }}
        >
          <Tabs
            onClick={onClick}
            selectedKeys={[currentTab]}
            mode="horizontal"
            items={items}
            onChange={onChangeTab}
          />
          <Row gutter={[24, 16]}>
            {dataBook &&
              dataBook.map((item) => {
                return (
                  <Col span={4} onClick={() => handleRedirectBook(item)}>
                    <div className="thumbnail">
                      <Image
                        //  width={200}
                          height={190}
                        preview={false}
                        src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${
                          item.thumbnail
                        }`}
                      />
                    </div>{" "}
                    <div className="text">{item.mainText}</div>
                    <div className="price">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(`${item.price}`)}
                    </div>
                    <div className="">
                      <div className="rate">
                        <Rate
                          defaultValue="5"
                          disabled="true"
                          style={{ fontSize: "10px" }}
                        />
                      </div>
                      <div className="sold">Sold {item.sold}</div>
                    </div>
                  </Col>
                );
              })}
          </Row>
          <Pagination
            showSizeChanger
            // onShowSizeChange={onShowSizeChange}
            responsive
            current={current}
            pageSize={pageSize}
            total={total}
            style={{ paddingTop: "16px" }}
            onChange={(p, s) => handleOnChangePage({ current: p, pageSize: s })}
          />
        </Col>
      </Row>
    </div>
  );
};

export default Home;
