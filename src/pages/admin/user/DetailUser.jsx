import { Badge, Descriptions, Drawer } from "antd";
import moment from "moment/moment";
import { useState } from "react";

const DetailUser = (props) => {
  console.log(props.dataDetail);
  return (
    <>
      <Drawer
        title="Basic Drawer"
        placement="right"
        onClose={props.onClose}
        open={props.openViewDetail}
        width="50vw"
      >
        <Descriptions title="User Info" bordered column={2}>
          <Descriptions.Item label="id">
            {props?.dataDetail?._id}
          </Descriptions.Item>
          <Descriptions.Item label="Email">
            {props?.dataDetail?.email}
          </Descriptions.Item>
          <Descriptions.Item label="Full Name">
            {props?.dataDetail?.fullName}
          </Descriptions.Item>
          <Descriptions.Item label="Phone">
            {props?.dataDetail?.phone}
          </Descriptions.Item>
          <Descriptions.Item label="Role" span={2}>
            <Badge status="processing" text={props?.dataDetail?.role} />
          </Descriptions.Item>
          <Descriptions.Item label="Created At">
            {moment(props?.dataDetail?.createdAt).format("YYYY-MM-DD HH:mm:ss")}
          </Descriptions.Item>
          <Descriptions.Item label="Updated At">
            {moment(props?.dataDetail?.updatedAt).format("YYYY-MM-DD HH:mm:ss")}
          </Descriptions.Item>
        </Descriptions>
      </Drawer>
    </>
  );
};

export default DetailUser;
