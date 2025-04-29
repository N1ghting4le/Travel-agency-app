'use client';

import styles from "./photos.module.css";
import { helperStyle } from "../input/Input";
import { useState } from "react";
import { useFieldArray, Controller } from "react-hook-form";
import { Button, FormHelperText } from "@mui/material";
import { CloudUpload } from "@mui/icons-material";
import Image from "next/image";

const photoFormats = [
    "image/jpeg", "image/png", "image/gif", "image/svg+xml", "image/webp", "image/ico",
    "image/tiff", "image/eps"
];

const Photos = ({ control, trigger, error }) => {
    const [previews, setPreviews] = useState([]);
    const [loadError, setLoadError] = useState(false);
   
    const { fields, append, remove } = useFieldArray({
        control,
        name: "photos"
    });

    const handleUploadedPhoto = (e) => {
        const addedPhotos = [];

        Array.from(e.target.files).forEach(file => {
            if (!loadError && !photoFormats.includes(file.type)) {
                setLoadError(true);
                setTimeout(() => setLoadError(false), 3000);
                return;
            }

            const photo = URL.createObjectURL(file);

            addedPhotos.push(photo);
            append(file);
        });

        setPreviews(previews => [...previews, ...addedPhotos]);
        trigger("photos");
        e.target.value = "";
    }
   
    const removePhoto = (i) => {
        setPreviews(previews => previews.filter((_, index) => index !== i));
        remove(i);
    }

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
                                    alt={i + 1}
                                    width={200}
                                    height={200}
                                    className={styles.image}
                                />
                                <button onClick={() => removePhoto(i)} className={styles.removeIcon}/>
                                </>
                            )}
                        />
                    </div>
                ))}
            </div>
            <div>
                <Button
                    component="label"
                    variant="contained"
                    tabIndex={-1}
                    startIcon={<CloudUpload/>}
                >
                    Загрузить фотографии
                    <input
                        accept="image/*"
                        style={{ display: 'none' }}
                        type="file"
                        multiple
                        onChange={handleUploadedPhoto}
                    />
                </Button>
                {error &&
                <FormHelperText sx={helperStyle} error>
                    {error.message || error.root.message}
                </FormHelperText>}
                {loadError &&
                <FormHelperText sx={helperStyle} error>
                    Сюда можно загружать только фотографии
                </FormHelperText>}
            </div>
        </div>
    );
}

export default Photos;