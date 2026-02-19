"use client";

import { createPortal } from "react-dom";
import { useState, useEffect, useRef } from "react";
import styles from "@/app/(regularUser)/tours/[id]/page.module.css";
import "./allTourPhotos.css";

const AllTourPhotos = ({ baseSrc, photos, title }) => {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const sliderRef = useRef(null);
  const activePhotoRef = useRef(null);

  const handleOpen = () => {
    setOpen(true);
    document.scrollingElement.style.overflowY = "hidden";
  };

  const handleClose = () => {
    setOpen(false);
    document.scrollingElement.style.overflowY = "auto";
  };

  const handleNext = () => {
    setIndex((index) => index + 1);
  };

  const handlePrev = () => {
    setIndex((index) => index - 1);
  };

  const handleIndex = (index) => () => {
    setIndex(index);
  };

  const handleActivePhotoRef = (i) => (el) => {
    if (index === i) {
      activePhotoRef.current = el;
    }
  };

  useEffect(() => {
    const photo = activePhotoRef.current;

    if (photo && sliderRef.current) {
      sliderRef.current.scrollLeft =
        photo.offsetLeft -
        document.documentElement.offsetWidth / 2 +
        photo.offsetWidth / 2;
    }
  }, [index]);

  if (open) {
    return createPortal(
      <div className="TVModalContainer TVFade TVFadeIn TVGalleryWindow">
        <div className="TVGalleryWindowContent">
          <div className="TVGalleryWindowGallery">
            <div className="TVPhotoGallery">
              <div className="TVPhotoGalleryTitle">{title}</div>
              <div className="TVPhotoGalleryContent">
                <div className="TVPhotoGalleryItems">
                  {photos.map((src, i) => (
                    <div key={src} className="TVPhotoGalleryImageWrapper">
                      <img
                        key={src}
                        className="TVPhotoGalleryImage"
                        src={`${baseSrc}${src}`}
                        alt={`hotel photo ${src}`}
                        style={{ opacity: index === i ? 1 : 0 }}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div
                className={`TVPhotoGalleryLeft TVSize-M ${!index ? "TVDisabled" : ""}`}
                onClick={handlePrev}
              />
              <div
                className={`TVPhotoGalleryRight TVSize-M ${index === photos.length - 1 ? "TVDisabled" : ""}`}
                onClick={handleNext}
              />
            </div>
          </div>
          <div className="TVPhotoGalleryFooter">
            <div className="TVPhotoGalleryCount TVPhotoGalleryShape-Rectangle">
              {index + 1} / {photos.length}
            </div>
          </div>
          <div className="TVGalleryWindowPreviewSlider">
            <div className="TVPhotoSliderGallery TVStyleTheme1">
              <div
                className="TVSliderView TVScrollEnabled TVJustify-Center"
                ref={sliderRef}
              >
                <div className="TVSliderViewList">
                  {photos.map((src, i) => (
                    <div
                      key={src}
                      className={`TVPhoto ${i === index ? "TVActive" : ""}`}
                      style={{ backgroundImage: `url("${baseSrc}${src}")` }}
                      onClick={handleIndex(i)}
                      ref={handleActivePhotoRef(i)}
                    >
                      <div className="TVPhotoPreview" />
                    </div>
                  ))}
                </div>
                <div className="TVSliderViewLeft TVHide" />
                <div className="TVSliderViewRight TVHide" />
              </div>
            </div>
          </div>
        </div>
        <div className="TVClosePopUp" onClick={handleClose} />
      </div>,
      document.body,
    );
  }

  return (
    <button className={`${styles.btn} ${styles.photoBtn}`} onClick={handleOpen}>
      Все фото
    </button>
  );
};

export default AllTourPhotos;
