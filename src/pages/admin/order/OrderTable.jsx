import { useEffect } from "react";
import { callListOrder } from "../../../service/api";
import { Table } from "antd";
import { useState } from "react";
import ReactJson from "react-json-view";

const OrderTable = () => {
  const [dataTable, setDataTable] = useState([]);
  const columns = [
    {
      title: "id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "id",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Detail",
      dataIndex: "detail",
      key: "detail",
      render: (detail) => (
        <>
          <ReactJson src={detail} collapsed={true} />
        </>
      ),
    },
  ];

  const getListOrder = async () => {
    const res = await callListOrder();
    if (res && res.data && res.data.result) {
      const a = res.data.result.map((item) => {
        return {
          id: item._id,
          price: +item.totalPrice,
          name: item.name,
          address: item.address,
          phone: item.phone,
          detail: item.detail
        };
      });
      console.log("a", a);
      setDataTable(a);
    }
  };
  useEffect(() => {
    getListOrder();
  }, []);
  console.log(dataTable);
  return <Table columns={columns} dataSource={dataTable} />;
};
export default OrderTable;
