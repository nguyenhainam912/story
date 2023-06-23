import { Col, Row, Statistic } from "antd";
import { useEffect } from "react";
import CountUp from "react-countup";
import { callDashBoard } from "../../service/api";
import { useState } from "react";

const DashBoardPage = () => {
  const [total, setTotal] = useState({ user: 0, order: 0 });
  const formatter = (value) => <CountUp end={value} />;
  const getDashBoard = async () => {
    const res = await callDashBoard();
    if (res && res.data) {
      setTotal({ user: res.data.countUser, order: res.data.countOrder });
    }
  };
  useEffect(() => {
    getDashBoard();
  }, []);
  return (
    <Row>
      <Col span={12}>
        <Statistic title="Users" value={total.user} formatter={formatter} />
      </Col>
      <Col span={12}>
        <Statistic title="Orders" value={total.order} formatter={formatter} />
      </Col>
    </Row>
  );
};
export default DashBoardPage;
