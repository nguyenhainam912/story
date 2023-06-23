import { Col, Input, InputNumber, Rate, Row } from "antd";
import { useLocation } from "react-router-dom";
import { callGetBookById } from "../../service/api";
import { useEffect, useState, useRef } from "react";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/scss/image-gallery.scss";
import ModalGallery from "./ModalGallery";
import SkeletonPage from "./SkeletonPage";
import { useDispatch } from "react-redux";
import { doAddBookAction } from "../../redux/order/orderSlice";
const BookPage = () => {
  let location = useLocation();
  let params = new URLSearchParams(location.search);

  const id = params?.get("id");

  const [dataBook, setDataBook] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [valueInput, setValueInput] = useState(1);

  const [currentIndex, setCurrentIndex] = useState("");
  const refGallery = useRef();
  const dispatch = useDispatch();
  const images = dataBook?.items ?? [];
  const getBookById = async (id) => {
    if (id) {
      const res = await callGetBookById(id);
      if (res && res.data) {
        let raw = res.data;
        console.log(raw);

        raw.items = getImages(raw);
        setTimeout(() => {
          setDataBook(raw);
        }, 2000);
      }
    }
  };

  const getImages = (raw) => {
    const images = [];
    if (raw.thumbnail) {
      images.push({
        original: `${import.meta.env.VITE_BACKEND_URL}/images/book/${
          raw.thumbnail
        }`,
        thumbnail: `${import.meta.env.VITE_BACKEND_URL}/images/book/${
          raw.thumbnail
        }`,
        originClass: "origin-image",
        thumbnailClass: "thumbnail-image",
      });
    }
    if (raw.slider) {
      raw?.slider?.map((item) => {
        images.push({
          original: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
          thumbnail: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
          originClass: "origin-image",
          thumbnailClass: "thumbnail-image",
        });
      });
    }
    return images;
  };

  const handleOnClickImage = () => {
    setOpenModal(true);
    setCurrentIndex(refGallery?.current?.getCurrentIndex() ?? 0);
  };

  const handleClickQuantity = (e) => {
    if (e.target.innerText === "-") {
      if (valueInput - 1 <= 0) return;
      setValueInput(+valueInput - 1);
    }
    if (e.target.innerText === "+") {
      if (valueInput === +dataBook.quantity) return;

      setValueInput(+valueInput + 1);
    }
  };

  const handleAddToCart = (quantity, book) => {
    dispatch(doAddBookAction({ quantity, detail: book, _id: book._id }));
  };
  const handleChangeInput = (value) => {
    if (!isNaN(value)) {
      if (+value > 0 && +value < dataBook.quantity) {
        setValueInput(+value);
      }
    }
  };
  useEffect(() => {
    getBookById(id);
  }, []);

  return (
    <>
      {dataBook && dataBook._id ? (
        <Row style={{ backgroundColor: "#fff" }}>
          <Col span={12}>
            <ImageGallery
              ref={refGallery}
              items={images}
              showPlayButton={false}
              showFullscreenButton={false}
              slideOnThumbnailOver={true}
              renderLeftNav={() => <></>}
              renderRightNav={() => <></>}
              onClick={() => handleOnClickImage()}
              style={{ height: "300px" }}
            />
          </Col>
          <Col span={12}>
            <div>
              Author: <a>{dataBook.author}</a>
            </div>
            <div style={{ padding: "4px" }}>
              {" "}
              <h4
                style={{
                  color: "rgb(120 120 120)",
                  fontWeight: "500",
                  fontSize: "1rem",
                }}
              >
                {dataBook.mainText}
              </h4>
            </div>
            <div>
              {" "}
              <Rate disabled value={5} style={{ fontSize: "12px" }}></Rate>
              <span style={{ paddingLeft: "8px" }}>Sold: {dataBook.sold}</span>
            </div>
            <div
              style={{
                backgroundColor: "#f4f4f4",
                padding: "20px 14px",
                margin: "10px 0",
              }}
            >
              {" "}
              <span
                style={{
                  color: "#d0011b",
                  fontSize: "1.5rem",
                  fontWeight: "400",
                }}
              >
                {dataBook.price} đ
              </span>
            </div>
            <div>
              {" "}
              <span style={{ color: "#757575", paddingRight: "46px" }}>
                Ship:{" "}
              </span>
              <span style={{ color: "#222" }}>Free ship</span>
            </div>
            <div style={{ marginTop: "10px" }}>
              {" "}
              <span
                style={{
                  color: "#757575",
                  paddingRight: "20px",
                }}
              >
                Quantity:{" "}
              </span>
              <InputNumber
                style={{ width: "120px" }}
                addonBefore={
                  <span onClick={(e) => handleClickQuantity(e)}>-</span>
                }
                addonAfter={
                  <span onClick={(e) => handleClickQuantity(e)}>+</span>
                }
                value={valueInput}
                onChange={(e) => handleChangeInput(e)}
                controls={false}
                // onPressEnter={(e) =>
                //   setValueInput(
                //     e.nativeEvent.data < 1 ? "1" : e.nativeEvent.data
                //   )
                // }
              />
            </div>
            <div style={{ margin: "16px" }}>
              <button
                style={{
                  background: "rgba(208,1,27,.08)",
                  color: "#d0011b",
                  outline: "none",
                  border: "1px solid #d0011b",
                  height: "48px",
                  width: "170px",
                }}
                onClick={() => handleAddToCart(valueInput, dataBook)}
              >
                Add cart
              </button>
              <button
                style={{
                  background: "#d0011b",
                  marginLeft: "14px",
                  color: "#fff",
                  outline: "none",
                  height: "48px",
                  width: "120px",
                }}
              >
                Buy
              </button>
            </div>
          </Col>
        </Row>
      ) : (
        <SkeletonPage />
      )}
      <ModalGallery
        openModal={openModal}
        setOpenModal={setOpenModal}
        currentIndex={currentIndex}
        refGallery={refGallery}
        images={images}
      ></ModalGallery>
    </>
  );
};

export default BookPage;
