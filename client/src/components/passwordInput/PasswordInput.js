'use client';

import styles from "./passwordInput.module.css";
import { useState } from "react";
import Input from "../input/Input";
import { VisibilityOutlined, VisibilityOffOutlined } from "@mui/icons-material";

const PasswordInput = ({ placeholder, error, ...props }) => {
    const [show, setShow] = useState(false);

    const toggleShow = () => setShow(show => !show);

    return (
        <div className={styles.passwordWrapper}>
            <Input
                type={show ? "text" : "password"}
                placeholder={placeholder}
                error={error}
                {...props}/>
            <div className={styles.passwordControl} onClick={toggleShow}>
                {show ?
                <VisibilityOutlined className={styles.eye}/> :
                <VisibilityOffOutlined className={styles.eye}/>}
            </div>
        </div>
    );
}

export default PasswordInput;