import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import ReactPannellum from "react-pannellum";
import { baseURLLocalPublic } from "../../../Api/baseURLLocal";
// import { baseURLPublicName } from "../../../Api/baseURL";
const PanoramaImg = ({ showModal, style ,className}) => {
  console.log('showModal : ',showModal)
  const config = {
    autoRotate: -10,
    autoLoad: true,
    showZoomCtrl: false,

  };
  return (
    <>
      {showModal?.is_panorama ? (
        <ReactPannellum
          // id="1"
          id={`pannellum-${showModal?.id}`} 
          // sceneId="firstScene"
          sceneId={`scene-${showModal?.id}`} 
          imageSource={`${showModal?.image}`}
          config={config}
          style={{
            borderRadius: "33px 25px",
            width: "100%",
            aspectRatio: 1,
            background: "#000000",
            ...style,
          }}
        />
      ) : (
        <LazyLoadImage
        // src={`${baseURLLocalPublic}/storage${
        //   showModal && showModal.item_images[0].image_url
        // }`}
        src={`${showModal?.image}`}
          // className={className}
          style={{ 
            borderRadius: "33px 25px",
            aspectRatio: 1,
            width: "100%",

           }}
          effect="blur"
        />
      )}
    </>
  );
};

export default PanoramaImg;
