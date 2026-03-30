"use client";

import styles from "./photos.module.css";
import { helperStyle } from "../input/Input";
import { useState, useEffect } from "react";
import { useFieldArray, Controller } from "react-hook-form";
import { Button, FormHelperText } from "@mui/material";
import { CloudUpload } from "@mui/icons-material";
import Image from "next/image";
import { photoFormats } from "./constants";

const Photos = ({ control, trigger, error, externalPreviews }) => {
  const [previews, setPreviews] = useState([]);
  const [loadError, setLoadError] = useState(false);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "photos",
  });

  useEffect(() => {
    setPreviews(externalPreviews);
  }, [externalPreviews]);

  const handleUploadedPhoto = (e) => {
    const addedPhotos = [];

    Array.from(e.target.files).forEach((file) => {
      if (!loadError && !photoFormats.includes(file.type)) {
        setLoadError(true);
        setTimeout(() => setLoadError(false), 3000);
      } else {
        const photo = URL.createObjectURL(file);

        addedPhotos.push(photo);
        append(file);
      }
    });

    setPreviews((previews) => [...previews, ...addedPhotos]);
    trigger("photos");
    e.target.value = "";
  };

  const removePhoto = (i) => () => {
    setPreviews((previews) => previews.filter((_, index) => index !== i));
    remove(i);
  };

  return (
    <div className={styles.photosWrapper}>
      <h3>Фотографии</h3>
      <div className={styles.photoGrid}>
        {fields.map(({ id }, i) => (
          <div key={id}>
            <Controller
              control={control}
              name={`photos.${i}`}
              render={() => (
                <>
                  <Image
                    src={previews[i]}
                    alt={id}
                    width={200}
                    height={200}
                    className={styles.image}
                  />
                  <button
                    onClick={removePhoto(i)}
                    className={styles.removeIcon}
                  />
                </>
              )}
            />
          </div>
        ))}
      </div>
      <div style={{ position: "relative" }}>
        <Button
          component="label"
          variant="contained"
          tabIndex={-1}
          startIcon={<CloudUpload />}
        >
          Загрузить фотографии
          <input
            accept="image/*"
            style={{ display: "none" }}
            type="file"
            multiple
            onChange={handleUploadedPhoto}
          />
        </Button>
        {(error || loadError) && (
          <FormHelperText sx={helperStyle} error>
            {loadError
              ? "Сюда можно загружать только фотографии"
              : error.message || error.root.message}
          </FormHelperText>
        )}
      </div>
    </div>
  );
};

export default Photos;
