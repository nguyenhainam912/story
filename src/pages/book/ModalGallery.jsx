import { Col, Image, Modal, Row, Space } from "antd";
import ImageGallery from "react-image-gallery";

const ModalGallery = (props) => {
  const { openModal, setOpenModal, currentIndex, refGallery, images } = props;
  return (
    <Modal
      open={openModal}
      onOk={() => setOpenModal(false)}
      onCancel={() => setOpenModal(false)}
      footer={null}
      closable={null}
      width="60vw"
    >
      <Row>
        <Col span={12}>
          <ImageGallery
            ref={refGallery}
            items={images}
            showPlayButton={false}
            showFullscreenButton={false}
            showThumbnails={false}
            slideOnThumbnailOver={true}
            // renderLeftNav={() => <></>}
            // renderRightNav={() => <></>}
          />
        </Col>
        <Col span={12}>
          <Row>
            {images &&
              images.map((item, index) => {
                return (
                  <Col>
                    <Image
                      key={index}
                      preview={false}
                      width={100}
                      height={100}
                      src={item.original}
                      style={{ padding: "8px" }}
                      onClick={() => {
                        refGallery.current.slideToIndex(index);
                      }}
                    />
                  </Col>
                );
              })}
          </Row>
        </Col>
      </Row>
    </Modal>
  );
};

export default ModalGallery;
