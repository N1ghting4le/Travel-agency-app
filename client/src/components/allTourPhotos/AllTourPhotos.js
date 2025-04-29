'use client';

import { createPortal } from "react-dom";
import { useState, useEffect, useRef } from "react";
import styles from "@/app/(regularUser)/tours/[id]/page.module.css";
import "./allTourPhotos.css";

const AllTourPhotos = ({ baseSrc, photos, title }) => {
    const [open, setOpen] = useState(false);
    const [index, setIndex]  = useState(0);
    const ref = useRef();

    useEffect(() => {
        document.scrollingElement.style.overflowY = open ? "hidden" : "auto";
    }, [open]);

    useEffect(() => {
        const photo = document.querySelectorAll(".TVPhoto")[index];

        if (!photo) return;

        ref.current.scrollLeft = photo.offsetLeft - document.documentElement.offsetWidth / 2 + photo.offsetWidth / 2;
    }, [index]);

    return open ? createPortal(
        <div className={`TVModalContainer TVFade TVFadeIn TVGalleryWindow ${!open ? "TVHide" : ""}`}>
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
                                            src={`${baseSrc}/${src}`}
                                            alt={`hotel photo ${i + 1}`}
                                            style={{opacity: index === i ? 1 : 0}}/>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div 
                            className={`TVPhotoGalleryLeft TVSize-M ${!index ? "TVDisabled" : ""}`}
                            onClick={() => setIndex(i => i - 1)}/>
                        <div
                            className={`TVPhotoGalleryRight TVSize-M ${index === photos.length - 1 ? "TVDisabled" : ""}`}
                            onClick={() => setIndex(i => i + 1)}/>
                    </div>
                </div>
                <div className="TVPhotoGalleryFooter">
                    <div className="TVPhotoGalleryCount TVPhotoGalleryShape-Rectangle">{index + 1} / {photos.length}</div>
                </div>
                <div className="TVGalleryWindowPreviewSlider">
                    <div className="TVPhotoSliderGallery TVStyleTheme1">
                        <div className="TVSliderView TVScrollEnabled TVJustify-Center" ref={ref}>
                            <div className="TVSliderViewList">
                                {photos.map((src, i) => (
                                    <div 
                                        key={src}
                                        className={`TVPhoto ${i === index ? "TVActive" : ""}`}
                                        style={{backgroundImage: `url("${baseSrc}/${src}")`}}
                                        onClick={() => setIndex(i)}>
                                        <div className="TVPhotoPreview"/>
                                    </div>
                                ))}
                            </div>
                            <div className="TVSliderViewLeft TVHide"/>
                            <div className="TVSliderViewRight TVHide"/>
                        </div>
                    </div>
                </div>
            </div>
            <div className="TVClosePopUp" onClick={() => setOpen(false)}/>
        </div>
    , document.body) :
    <button className={`${styles.btn} ${styles.photoBtn}`} onClick={() => setOpen(true)}>Все фото</button>;
}

export default AllTourPhotos;