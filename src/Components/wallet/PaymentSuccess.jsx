import React, { useEffect } from "react";
import { FaCheckCircle } from "react-icons/fa"; // Import the check icon
import "./PaymentSuccess.css"; // Import the CSS file for animations

const PaymentSuccess = () => {
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (window.opener) {
                console.log("Closing the window after payment success message");
                window.close();
            }
        }, 2000); // Close the window after 2 seconds

        return () => clearTimeout(timeout); // Cleanup timeout on unmount
    }, []);

    return (
        <div className="payment-success-container">
            <FaCheckCircle className="success-icon" />
            <h1 className="success-message">Payment Successful!</h1>
            <p className="success-subtext">Getting you back to your dashboard...</p>
        </div>
    );
};

export default PaymentSuccess;
