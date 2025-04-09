import React, { useEffect } from "react";
import { FaTimesCircle } from "react-icons/fa"; // Import the "X" icon

const PaymentFailed = () => {
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (window.opener) {
                console.log("Closing the window after payment failed message");
                window.close();
            }
        }, 2000); // Close the window after 2 seconds

        return () => clearTimeout(timeout); // Cleanup timeout on unmount
    }, []);

    return (
        <div style={{ textAlign: "center", marginTop: "20%" }}>
            <FaTimesCircle style={{ fontSize: "50px", color: "red" }} />
            <h1>Payment Failed!</h1>
            <p>Returning you to your dashboard...</p>
        </div>
    );
};

export default PaymentFailed;
