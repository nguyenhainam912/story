import { useEffect } from "react";
import {  callGetListUser, callListOrder } from "../../../service/api";
import { Button, Row, Table } from "antd";
import { useState } from "react";
import ReactJson from "react-json-view";
import moment from "moment/moment";
import { AiOutlineExport, AiOutlinePlus } from "react-icons/ai";
import ModalAddOrder from "./ModalAddOrder";
import * as XLSX from "xlsx";

const OrderTable = () => {
  const [dataTable, setDataTable] = useState([]);
  let [current, setCurrent] = useState(1);
  let [pageSize, setPageSize] = useState(10);
  let [total, setTotal] = useState(0);
  let [openModalAddOrder, setOpenModalAddOrder] = useState(false);

  const columns = [
    {
      title: "id",
      dataIndex: "id",
      // key: "id",
      render: (text, record, index) => {
        return (
          <a
            href="#"
            key={index}
            
          >
            {index}
          </a>
        );
      },
    },
    {
      title: "Tổng tiền",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Tên Khách Hàng",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Ngày giao dịch",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: "Người phụ trách",
      dataIndex: "staffName",
      key: "staffName",
    },
    {
      title: "Chi tiết",
      dataIndex: "detail",
      key: "detail",
      render: (detail) => (
        <>
          <ReactJson src={detail} collapsed={true} name="history"/>
        </>
      ),
    },
  ];

  const getListOrder = async () => {
    const query = `current=${current}&pageSize=${pageSize}`
    const res = await callListOrder(query);

    if (res && res.data && res.data.result) {
      setTotal(res.data.meta.total);
      const a = (res.data.result.map((item) => {
        return {
          id: item._id,
          price: +item.totalPrice + ' đ',
          name: item.name,
          address: item.address,
          createdAt: (moment(item.createdAt)).format('DD/MM/YYYY HH:mm:ss'),
          phone: item.phone,
          staffName: item.staffName,
          detail: item.detail
        };
      }));
      
      console.log("a", a);
      setDataTable(a);
    }
  };

  const onChange = async (pagination) => {
    if (pagination && pagination.current !== current) {
      setCurrent(pagination.current);
    }
    if (pagination && pagination.pageSize !== pageSize) {
      setPageSize(pagination.pageSize);
      setCurrent(1);
    }
    await getListOrder()
  }
  const showModalAddOrder = () => {
    setOpenModalAddOrder(true);
  };
  const handleOkModalAddOrder = () => {
    setOpenModalAddOrder(false);
  };

  const handleCancelModalAddOrder = () => {
    setOpenModalAddOrder(false);
  };
  const handleExportData = () => {
    if (dataTable.length > 0) {
      const worksheet = XLSX.utils.json_to_sheet(dataTable);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
      XLSX.writeFile(workbook, "ExportUser.csv");
    }
  };

  const renderHeader = () => {
    return (
      <Row justify="space-between" align="center ">
        <p>Table List Order</p>
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
          {/* <Button
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
            onClick={showModalAddOrder}
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
  useEffect(() => {
    getListOrder();
  }, []);
  console.log(dataTable);
  return <>
  <Table title={renderHeader} columns={columns} dataSource={dataTable} onChange={onChange} 
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
  }}/>
  {openModalAddOrder === true && (
    <ModalAddOrder
      openModalAddUser
      getListOrder={getListOrder}
      handleOkModalAddOrder={handleOkModalAddOrder}
      handleCancelModalAddOrder={handleCancelModalAddOrder}
    />
  )}</>;
};
export default OrderTable;
