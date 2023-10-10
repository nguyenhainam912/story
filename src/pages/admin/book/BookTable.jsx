import {
  Button,
  Form,
  Image,
  Popover,
  Row,
  Space,
  Table,
  message,
  notification,
} from "antd";
import { useEffect, useState } from "react";
import {
  AiOutlineDownload,
  AiOutlineExport,
  AiOutlinePlus,
  AiOutlineReload,
} from "react-icons/ai";
import ModalAddBook from "./ModalAddBook";
import ModalImport from "./ModalImport";
import * as XLSX from "xlsx";
import ModalUpdateUser from "./ModalUpdate";
import { WarningTwoTone } from "@ant-design/icons";
import { callDeleteBook, callGetListBook } from "../../../service/api";
import InputSearch from "./InputSearch";
import DetailBook from "./DetailBook";
import ModalUpdateBook from "./ModalUpdate";

const BookTable = () => {
  const columns = [
    {
      title: "id",
      dataIndex: "_id",
      render: (text, record, index) => {
        return (
          <a
            href="#"
            key={index}
            onClick={() => {
              setOpenViewDetail(true);
              setDataDetail(record);
            }}
          >
            {index}
            {/* {record._id} */}
          </a>
        );
      },
    },
    {
      title: "Tên sách",
      dataIndex: "mainText",
      sorter: true,
    },
    {
      title: "Thể loại",
      dataIndex: "category",
      sorter: true,
    },
    {
      title: "Tác giả",
      dataIndex: "author",
      sorter: true,
    },
    {
      title: "Giá bán",
      dataIndex: "price",
      sorter: true,
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      sorter: true,
    },
    {
      title: "Đã bán",
      dataIndex: "sold",
      sorter: true,
    },
    {
      title: "Ảnh Sách",
      dataIndex: "thumbnail",
      render: (thumbnail) => {
        return (
          <Image
            //  width={200}
              height={50}
            preview={false}
            src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${
              thumbnail
            }`}
          />
        );
      },
    },
    {
      title: "Action",
      width: "200px",
      render: (text, record, index) => {
        return (
          <div key={index}>
            <Space>
              <Button
                onClick={() => {
                  setOpenModalUpdate(true);
                  setDataUpdate(record);
                }}
              >
                update
              </Button>

              <Popover
                placement="left"
                title={() => (
                  <div>
                    {" "}
                    <WarningTwoTone twoToneColor="#ffa500" /> Confirm Delete
                    User
                  </div>
                )}
                content={() => (
                  <>
                    <p>You sure delete this user {record.fullName} ?</p>
                    <div
                      style={{
                        display: "flex",
                        gap: "6px",
                        justifyContent: "end",
                      }}
                    >
                      <Button>Cancel</Button>
                      <Button
                        type="primary"
                        onClick={() => deleteBook(record?._id)}
                      >
                        OK
                      </Button>
                    </div>
                  </>
                )}
                trigger="click"
              >
                <Button>Delete</Button>
              </Popover>
            </Space>
          </div>
        );
      },
    },
  ];

  let [listBook, setListBook] = useState([]);
  let [current, setCurrent] = useState(1);
  let [pageSize, setPageSize] = useState(5);
  let [total, setTotal] = useState(0);
  let [sortQuery, setSortQuery] = useState("-updatedAt");
  let [openViewDetail, setOpenViewDetail] = useState(false);
  let [dataDetail, setDataDetail] = useState([]);
  let [openModalAddBook, setOpenModalAddBook] = useState(false);
  let [openModalImport, setOpenModalImport] = useState(false);
  let [openModalUpdate, setOpenModalUpdate] = useState(false);
  let [dataUpdate, setDataUpdate] = useState({});

  const onChange = (pagination, filters, sorter, extra) => {
    // console.log("params", pagination, filters, sorter, extra);
    if (pagination && pagination.current !== current) {
      setCurrent(pagination.current);
    }
    if (pagination && pagination.pageSize !== pageSize) {
      setPageSize(pagination.pageSize);
      setCurrent(1);
    }

    if (sorter.order === "ascend") {
      callSortBook(sorter.field);
    } else if (sorter.order === "descend") {
      callSortBook(-sorter.field);
    } else {
      callGetBook();
    }
  };

  const callSortBook = async (field) => {
    const query = `current=${current}&pageSize=${pageSize}&sort=${field}`;
    const res = await callGetListBook(query);
    if (res && res.data) {
      setListBook(res.data.result);
      setTotal(res.data.meta.total);
    }
  };

  const callGetBook = async () => {
    const query = `current=${current}&pageSize=${pageSize}&sort=${sortQuery}`;
    const res = await callGetListBook(query);
    if (res && res.data) {
      setListBook(res.data.result);
      setTotal(res.data.meta.total);
    }
  };

  const onClose = () => {
    setOpenViewDetail(false);
  };

  const handleExportData = () => {
    if (listBook.length > 0) {
      const worksheet = XLSX.utils.json_to_sheet(listBook);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
      XLSX.writeFile(workbook, "ExportUser.csv");
    }
  };

  const renderHeader = () => {
    return (
      <Row justify="space-between" align="center ">
        <p>Table List Book</p>
        <div style={{ display: "flex", gap: "10px" }}>
          <Button
            type="primary"
            icon={<AiOutlineExport />}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
            onClick={() => handleExportData()}
          >
            Export
          </Button>
          <Button
            type="primary"
            icon={<AiOutlineDownload />}
            style={{ display: "flex", alignItems: "center", gap: 6 }}
            onClick={showModalImport}
          >
            Import
          </Button>
          <Button
            type="primary"
            icon={<AiOutlinePlus />}
            style={{ display: "flex", alignItems: "center", gap: 6 }}
            onClick={showModalAddBook}
          >
            Add
          </Button>
          <Button
            icon={<AiOutlineReload />}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          ></Button>
        </div>
      </Row>
    );
  };

  const showModalAddBook = () => {
    setOpenModalAddBook(true);
  };

  const showModalImport = () => {
    setOpenModalImport(true);
  };

  const handleOkModalImport = () => {
    setOpenModalAddBook(false);
  };

  const handleCancelModalImport = () => {
    setOpenModalImport(false);
  };

  const handleCancelModalUpdate = () => {
    setOpenModalUpdate(false);
  };

  const deleteBook = async (id) => {
    const res = await callDeleteBook(id);
    if (res && res.data) {
      message.success("Delete User Successful");
      await callGetBook();
    } else {
      notification.error({
        message: "Error",
        description: res.message,
      });
    }
  };

  const updateUser = async (user) => {
    await updateUser({
      _id: user._id,
      fullName: user.fullName,
      phone: user.phone,
    });
    message.success("Update User Successful");
  };

  const handleSearch = (data) => {
    console.log(data);
    // setCurrent(data.meta.current);
    setPageSize(+data.meta.total);
    setTotal(+data.meta.total);

    setListBook(data.result);
  };

  useEffect(() => {
    callGetBook();
  }, [current, pageSize, sortQuery]);
  return (
    <>
      <InputSearch handleSearch={handleSearch} />
      <Table
        title={renderHeader}
        columns={columns}
        dataSource={listBook}
        onChange={onChange}
        rowKey="_id"
        pagination={{
          current: current,
          pageSize: pageSize,
          total: total,
          showTotal: (total, range) => {
            return (
              <div>
                {range[0]}-{range[1]} / {total} rows
              </div>
            );
          },
        }}
      />
      {openViewDetail === true && (
        <DetailBook
          openViewDetail={openViewDetail}
          setOpenViewDetail={setOpenViewDetail}
          setDataDetail={setDataDetail}
          dataDetail={dataDetail}
          onClose={onClose}
        />
      )}
      {openModalAddBook === true && (
        <ModalAddBook
          // openModalAddBook
          callGetBook={callGetBook}
          // handleOkModalAddBook={handleOkModalAddBook}
          // handleCancelModalAddBook={handleCancelModalAddBook}
          openModalAddBook={openModalAddBook}
          setOpenModalAddBook={setOpenModalAddBook}
        />
      )}
      {openModalImport === true && (
        <ModalImport
          openModalImport
          callGetBook={callGetBook}
          handleOkModalImport={handleOkModalImport}
          handleCancelModalImport={handleCancelModalImport}
        />
      )}
      {openModalUpdate === true && (
        <ModalUpdateBook
          openModalUpdate={openModalUpdate}
          setOpenModalUpdate={setOpenModalUpdate}
          dataUpdate={dataUpdate}
          setDataUpdate={setDataUpdate}
          callGetBook={callGetBook}
        />
      )}
    </>
  );
};

export default BookTable;
