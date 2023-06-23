import { Col, Row, Skeleton, Space } from "antd";

const SkeletonPage = () => {
  return (
    <Row>
      <Col span={12}>
        <Skeleton.Input
          active
          block={true}
          style={{ width: "80%", height: "300px" }}
        />
        <Row style={{ display: "flex", gap: 20, marginTop: "20px" }}>
          <Skeleton.Image active />
          <Skeleton.Image active />
          <Skeleton.Image active />
        </Row>
      </Col>
      <Col span={12}>
        <Skeleton active paragraph={{ rows: 3 }} />
        <Skeleton active paragraph={{ rows: 2 }} />
        <div style={{ display: "flex", gap: 20 }}>
          <Skeleton.Button active />
          <Skeleton.Button active />
        </div>
      </Col>
    </Row>
  );
};

export default SkeletonPage;
