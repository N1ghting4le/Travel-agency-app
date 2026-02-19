import styles from "./submitWrapper.module.css";
import SubmitBtn from "../submitBtn/SubmitBtn";
import { FormHelperText } from "@mui/material";
import { PENDING, ERROR, FULFILLED, IDLE } from "@/constants/queryStates";

const helperStyle = {
  fontSize: "16px",
};

const SubmitWrapper = ({
  queryState,
  spinner,
  btnText,
  errorMsg,
  successText,
  disabled = false,
}) => (
  <div className={styles.submitWrapper}>
    {queryState === PENDING ? (
      spinner
    ) : (
      <SubmitBtn
        style={{ width: "100%" }}
        disabled={disabled || queryState !== IDLE}
      >
        {btnText}
      </SubmitBtn>
    )}
    {queryState === ERROR && (
      <FormHelperText sx={helperStyle} error>
        {errorMsg}
      </FormHelperText>
    )}
    {queryState === FULFILLED && (
      <FormHelperText sx={{ ...helperStyle, color: "green" }}>
        {successText}
      </FormHelperText>
    )}
  </div>
);

export default SubmitWrapper;
