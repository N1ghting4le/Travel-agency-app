'use client';

import { useState } from "react";

const ResetHoc = (Component) => function WrappedComponent(props) {
    const [resetKey, setResetKey] = useState(true);
    
    return <Component key={resetKey} {...props} reset={() => setResetKey(!resetKey)}/>;
}

export default ResetHoc;