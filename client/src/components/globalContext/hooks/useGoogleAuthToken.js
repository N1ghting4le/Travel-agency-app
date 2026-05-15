import { useContext } from "react";
import { Context } from "../GlobalContext";

export const useGoogleAuthToken = () => {
  const { googleAuthToken, setGoogleAuthToken } = useContext(Context);

  return { googleAuthToken, setGoogleAuthToken };
};
