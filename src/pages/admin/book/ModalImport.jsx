import { Modal, Table, message, notification } from "antd";
import Dragger from "antd/es/upload/Dragger";
import { InboxOutlined } from "@ant-design/icons";
import { useState } from "react";
import * as XLSX from "xlsx";
import { callBulkCreateUser } from "../../../service/api";
import templateFile from "./Test.xlsx?url";

const ModalImport = (props) => {
  const {
    openModalImport,
    handleOkModalImport,
    handleCancelModalImport,
    callGetUser,
  } = props;

  const [isSubmit, setIsSubmit] = useState(false);
  const [dataExcel, setDataExcel] = useState([]);
  const columns = [
    {
      title: "Name",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
  ];
  const dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess("Ok");
    }, 1000);
  };
  const handleSubmit = async () => {
    const data = dataExcel.map((item) => {
      item.password = "123456";
      return item;
    });
    const res = await callBulkCreateUser(data);
    if (res.data) {
      notification.success({
        description: `Success: ${res.data.countSuccess}, Error: ${res.data.countError}`,
        message: "Upload Success",
      });
      setDataExcel([]);
      handleCancelModalImport();
      callGetUser();
    } else {
      notification.error({
        description: res.message,
        message: "Error",
      });
    }
  };
  return (
    <Modal
      title="Modal Import"
      //   width={"50vw"}
      open={openModalImport}
      onOk={() => handleSubmit()}
      okText="Import"
      onCancel={handleCancelModalImport}
      confirmLoading={isSubmit}
      okButtonProps={{
        disabled: dataExcel.length < 1,
      }}
    >
      <Dragger
        name="file"
        multiple={false}
        // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
        maxCount={1}
        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        customRequest={dummyRequest}
        onChange={(info) => {
          const { status } = info.file;

          if (status !== "uploading") {
            console.log(info.file, info.fileList);
          }
          if (status === "done") {
            if (info.fileList && info.fileList.length > 0) {
              const file = info.fileList[0].originFileObj;
              const reader = new FileReader();
              reader.readAsArrayBuffer(file);

              reader.onload = function (e) {
                let data = new Uint8Array(e.target.result);
                let workbook = XLSX.read(data, { type: "array" });
                // find the name of your sheet in the workbook first
                let worksheet = workbook.Sheets[workbook.SheetNames[0]];

                // convert to json format
                const json = XLSX.utils.sheet_to_json(worksheet, {
                  header: ["fullName", "email", "phone"],
                  range: 1,
                });
                if (json && json.length > 0) setDataExcel(json);
              };
            }
            message.success(`${info.file.name} file uploaded successfully.`);
          } else if (status === "error") {
            message.error(`${info.file.name} file upload failed.`);
          }
        }}
        onDrop={(e) => {
          console.log("Dropped files", e.dataTransfer.files);
        }}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          Click or drag file to this area to upload
        </p>
        <p className="ant-upload-hint">
          Support for a single or bulk upload. Strictly prohibited from
          uploading company data or other banned files.
        </p>
        <a href={templateFile} download onClick={(e) => e.stopPropagation()}>
          Download sample template here
        </a>
      </Dragger>

      <Table
        dataSource={dataExcel}
        columns={columns}
        title={() => <p>Data Upload</p>}
        rowKey="fullName"
      />
    </Modal>
  );
};
export default ModalImport;
