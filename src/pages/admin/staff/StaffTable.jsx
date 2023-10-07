import {
  Button,
  Form,
  Popover,
  Row,
  Space,
  Table,
  message,
  notification,
} from "antd";
import { callDeleteUser, callGetListUser } from "../../../service/api";
import { useEffect, useState } from "react";
import DetailUser from "./DetailUser";
import {
  AiOutlineDownload,
  AiOutlineExport,
  AiOutlinePlus,
  AiOutlineReload,
} from "react-icons/ai";
import ModalAddUser from "./ModalAddUser";
import * as XLSX from "xlsx";
import ModalUpdateUser from "./ModalUpdate";
import { WarningTwoTone } from "@ant-design/icons";
import InputSearch from "./InputSearch";


const UserTable = () => {
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
      title: "Tên",
      dataIndex: "fullName",
      sorter: true,
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: true,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      sorter: true,
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      sorter: true,
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
                        onClick={() => deleteUser(record?._id)}
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

  let [listUser, setListUser] = useState([]);
  let [current, setCurrent] = useState(1);
  let [pageSize, setPageSize] = useState(5);
  let [total, setTotal] = useState(0);
  let [openViewDetail, setOpenViewDetail] = useState(false);
  let [dataDetail, setDataDetail] = useState([]);
  let [openModalAddUser, setOpenModalAddUser] = useState(false);
  let [openModalImport, setOpenModalImport] = useState(false);
  let [openModalUpdate, setOpenModalUpdate] = useState(false);
  let [dataUpdate, setDataUpdate] = useState({});

  const onChange = (pagination, filters, sorter, extra) => {
    console.log("params", pagination, filters, sorter, extra);
    if (pagination && pagination.current !== current) {
      setCurrent(pagination.current);
    }
    if (pagination && pagination.pageSize !== pageSize) {
      setPageSize(pagination.pageSize);
      setCurrent(1);
    }

    if (sorter.order === "ascend") {
      callSortUser(sorter.field);
    } else if (sorter.order === "descend") {
      callSortUser(-sorter.field);
    } else {
      callGetUser();
    }
  };

  const callSortUser = async (field) => {
    const query = `current=${current}&pageSize=${pageSize}&sort=${field}&role=USER`;
    const res = await callGetListUser(query);
    if (res && res.data) {
      setListUser(res.data.result);
      setTotal(res.data.meta.total);
    }
  };

  const callGetUser = async () => {
    const query = `current=${current}&pageSize=${pageSize}&role=USER`;
    const res = await callGetListUser(query);
    if (res && res.data) {
      setListUser(res.data.result);
      setTotal(res.data.meta.total);
    }
  };

  const onClose = () => {
    setOpenViewDetail(false);
  };

  const handleExportData = () => {
    console.log("ee");
    if (listUser.length > 0) {
      const worksheet = XLSX.utils.json_to_sheet(listUser);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
      XLSX.writeFile(workbook, "ExportUser.csv");
    }
  };

  const renderHeader = () => {
    return (
      <Row justify="space-between" align="center ">
        <p>Table List Staff</p>
        <div style={{ display: "flex", gap: "10px" }}>
          {/* <Button
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
          </Button> */}
          <Button
            type="primary"
            icon={<AiOutlinePlus />}
            style={{ display: "flex", alignItems: "center", gap: 6 }}
            onClick={showModalAddUser}
          >
            Add
          </Button>
          {/* <Button
            icon={<AiOutlineReload />}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          ></Button> */}
        </div>
      </Row>
    );
  };

  const showModalAddUser = () => {
    setOpenModalAddUser(true);
  };

  const handleOkModalAddUser = () => {
    setOpenModalAddUser(false);
  };

  const handleCancelModalAddUser = () => {
    setOpenModalAddUser(false);
  };

  const showModalImport = () => {
    setOpenModalImport(true);
  };

  const handleOkModalImport = () => {
    setOpenModalAddUser(false);
  };

  const handleCancelModalImport = () => {
    setOpenModalImport(false);
  };

  const handleCancelModalUpdate = () => {
    setOpenModalUpdate(false);
  };

  const deleteUser = async (id) => {
    const res = await callDeleteUser(id);
    if (res && res.data) {
      message.success("Delete User Successful");
      await callGetUser();
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
    console.log("search", data);
    setListUser(data);
    setPageSize(data.length);
    setTotal(data.length);
  };

  useEffect(() => {
    callGetUser();
  }, [current, pageSize]);

  return (
    <>
      <InputSearch handleSearch={handleSearch} />
      <Table
        title={renderHeader}
        columns={columns}
        dataSource={listUser}
        onChange={onChange}
        rowKey= "_id"
        // rowKey= "fullName"
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
        <DetailUser
          openViewDetail={openViewDetail}
          dataDetail={dataDetail}
          onClose={onClose}
        />
      )}
      {openModalAddUser === true && (
        <ModalAddUser
          openModalAddUser
          callGetUser={callGetUser}
          handleOkModalAddUser={handleOkModalAddUser}
          handleCancelModalAddUser={handleCancelModalAddUser}
        />
      )}
      {openModalImport === true && (
        <ModalImport
          openModalImport
          callGetUser={callGetUser}
          handleOkModalImport={handleOkModalImport}
          handleCancelModalImport={handleCancelModalImport}
        />
      )}
      {openModalUpdate === true && (
        <ModalUpdateUser
          openModalUpdate
          dataUpdate={dataUpdate}
          callGetUser={callGetUser}
          handleCancelModalUpdate={handleCancelModalUpdate}
        />
      )}
    </>
  );
};

export default UserTable;
