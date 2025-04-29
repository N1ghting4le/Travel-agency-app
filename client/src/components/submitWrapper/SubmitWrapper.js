import styles from "./submitWrapper.module.css";
import SubmitBtn from "../submitBtn/SubmitBtn";
import { FormHelperText } from "@mui/material";
import { helperStyle } from "../input/Input";

const SubmitWrapper = ({ queryState, spinner, btnText, errorMsg, successText, disabled = false }) => (
    <div className={styles.submitWrapper}>
        {queryState === "pending" ? spinner :
        <SubmitBtn
            style={{width: "100%"}}
            disabled={disabled || queryState !== "idle"}>{btnText}</SubmitBtn>}
        {queryState === "error" &&
        <FormHelperText sx={helperStyle} error>{errorMsg}</FormHelperText>}
        {queryState === "fulfilled" &&
        <FormHelperText sx={{...helperStyle, color: "green"}}>{successText}</FormHelperText>}
    </div>
);

export default SubmitWrapper;