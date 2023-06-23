import { Space, Table, Tag } from "antd";
import { useEffect, useState } from "react";
import { callOrderHistory } from "../../service/api";
import ReactJson from "react-json-view";

const HistoryPage = () => {
  const columns = [
    {
      title: "Stt",
      dataIndex: "key",
      key: "stt",
    },
    {
      title: "Time",
      dataIndex: "time",
      key: "time",
    },
    {
      title: "Total price",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (priceTotal) => {
        return (
          <p>
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(`${priceTotal}`)}{" "}
          </p>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <>
          <Tag color="green">{status}</Tag>
        </>
      ),
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
  const [dataHistory, setDataHistory] = useState([]);

  const getOrderHistory = async () => {
    const res = await callOrderHistory();
    if (res && res.data) {
      const a = res.data.map((item, index) => ({
        key: index,
        time: item.createdAt,
        totalPrice: item.totalPrice,
        status: "Success",
        detail: item.detail,
      }));
      setDataHistory(a);
    }
  };

  useEffect(() => {
    getOrderHistory();
  }, []);

  return (
    <>
      <span>History</span>
      <Table columns={columns} dataSource={dataHistory} />
    </>
  );
};

export default HistoryPage;
