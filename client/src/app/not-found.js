import "./not-found.css";
import Link from "next/link";

export const metadata = {
    title: "You got lost!"
};

const NotFound = () => (
    <div className="o-404">
        <h1 className="a-title">404</h1>
        <p className="a-message">
            You came to the wrong neighborhood
        </p>
        <div className="o-cat">
            <div className="m-ears">
                <div className="m-ear -right"/>
                <div className="m-ear -left"/>
            </div>
            <div className="m-face">
                <div className="m-eyes">
                    <div className="m-eye -left">
                        <div className="a-eyePupil"/>
                    </div>
                    <div className="m-eye -right">
                        <div className="a-eyePupil"/>
                    </div>
                </div>
                <div className="m-nose"/>
            </div>
        </div>
        <p className="a-message">
            Back to <Link href="/" style={{color: "lightcoral"}}>main page</Link>
        </p>
    </div>
);

export default NotFound;