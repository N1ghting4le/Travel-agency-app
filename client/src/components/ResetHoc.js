"use client";

import { useState } from "react";

const ResetHoc = (Component) =>
  function WrappedComponent(props) {
    const [resetKey, setResetKey] = useState(true);

    const reset = () => {
      setResetKey((key) => !key);
    };

    return <Component key={resetKey} {...props} reset={reset} />;
  };

export default ResetHoc;
