import { Badge, Descriptions, Divider, Drawer, Modal, Upload } from "antd";
import moment from "moment/moment";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const DetailBook = (props) => {
  const { dataDetail, openViewDetail, setOpenViewDetail, setDataDetail } =
    props;
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState([]);

  const onClose = () => {
    setOpenViewDetail(false);
    setDataDetail(null);
  };

  useEffect(() => {
    if (dataDetail) {
      let imgThumbnail = {},
        imgSlider = [];
      if (dataDetail.thumbnail) {
        imgThumbnail = {
          uid: uuidv4(),
          name: dataDetail.thumbnail,
          status: "done",
          url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${
            dataDetail.thumbnail
          }`,
        };
      }
      if (dataDetail.slider && dataDetail.slider.length > 0) {
        dataDetail.slider.map((item) => {
          imgSlider.push({
            uid: uuidv4(),
            name: item,
            status: "done",
            url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
          });
        });
      }
      setFileList([imgThumbnail, ...imgSlider]);
    }
  }, [dataDetail]);

  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };

  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
  return (
    <>
      <Drawer
        title="Basic Drawer"
        placement="right"
        onClose={onClose}
        open={openViewDetail}
        width="50vw"
      >
        <Descriptions title="User Info" bordered column={2}>
          <Descriptions.Item label="id">
            {props?.dataDetail?._id}
          </Descriptions.Item>
          <Descriptions.Item label="Name">
            {props?.dataDetail?.mainText}
          </Descriptions.Item>
          <Descriptions.Item label="Author">
            {props?.dataDetail?.author}
          </Descriptions.Item>
          <Descriptions.Item label="Price">
            {props?.dataDetail?.price}
          </Descriptions.Item>
          <Descriptions.Item label="Category" span={2}>
            <Badge status="processing" text={props?.dataDetail?.category} />
          </Descriptions.Item>
          <Descriptions.Item label="Created At">
            {moment(props?.dataDetail?.createdAt).format("YYYY-MM-DD HH:mm:ss")}
          </Descriptions.Item>
          <Descriptions.Item label="Updated At">
            {moment(props?.dataDetail?.updatedAt).format("YYYY-MM-DD HH:mm:ss")}
          </Descriptions.Item>
        </Descriptions>
        <Divider orientation="left"> Image Book</Divider>
        <Upload
          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          listType="picture-card"
          fileList={fileList}
          onPreview={handlePreview}
          onChange={handleChange}
          showUploadList={{ showRemoveIcon: false }}
        ></Upload>
        <Modal
          open={previewOpen}
          title={previewTitle}
          footer={null}
          onCancel={handleCancel}
        >
          <img alt="example" style={{ width: "100%" }} src={previewImage} />
        </Modal>
      </Drawer>
    </>
  );
};

export default DetailBook;
