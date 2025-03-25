import React, { useState, useEffect, useCallback, useRef } from "react";
import { Form, Button, Alert, Spinner, Card, Toast } from "react-bootstrap";
import { PayPalService } from "./PaypalService";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getFromLocalStorage } from "../../network/local/LocalStorage";

const Wallet = () => {
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const paypalWindow = useRef();
    const [showToast, setShowToast] = useState(false);
    const [newBalance, setNewBalance] = useState(null);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [payWindow, setPayWindow ]= useState(null);
    const [paypalVarWindow, setPaypalVarWindow] = useState(null);

    useEffect(() => {
        const paymentId = searchParams.get('paymentId');
        const PayerID = searchParams.get('PayerID');

        if (paymentId && PayerID) {
            handlePaymentVerification(paymentId, PayerID);
        }
    }, [searchParams]);

    const handleCloseWindow = useCallback(() => {
        console.log("Attempting to close PayPal window");
        console.log("PayPal window state:", {
            paypalVarWindow: paypalVarWindow?.closed,
            paypalWindowRef: paypalWindow.current?.closed
        });

        let windowClosed = false;

        // Try closing with paypalVarWindow first
        if (paypalVarWindow && !paypalVarWindow.closed) {
            try {
                console.log("Attempting to close paypalVarWindow");
                paypalVarWindow.close();
                windowClosed = true;
                console.log("Successfully closed paypalVarWindow");
            } catch (e) {
                console.error('Error closing paypalVarWindow:', e);
            }
        }

        // Try closing with ref if first attempt failed
        if (!windowClosed && paypalWindow.current && !paypalWindow.current.closed) {
            try {
                console.log("Attempting to close paypalWindow.current");
                paypalWindow.current.close();
                windowClosed = true;
                console.log("Successfully closed paypalWindow.current");
            } catch (e) {
                console.error('Error closing paypalWindow.current:', e);
            }
        }

        // Clear references only if we successfully closed the window
        if (windowClosed) {
            console.log("Clearing window references");
            setPaypalVarWindow(null);
            paypalWindow.current = null;
        } else {
            console.warn("Failed to close PayPal window");
        }
    }, [paypalVarWindow]);

    useEffect(() => {
        if (paypalWindow?.current) {
            const intervalId = setInterval(async () => {
                try {
                    const result = await PayPalService.checkPaymentStatus(paypalWindow.current);
                    
                    if (result.status === 'closed') {
                        clearInterval(intervalId);
                        handleCloseWindow();
                        
                        // Get payment details from URL
                        const urlParams = new URLSearchParams(window.location.search);
                        const paymentId = urlParams.get('paymentId');
                        const PayerID = urlParams.get('PayerID');
                        
                        if (paymentId && PayerID) {
                            await handlePaymentVerification(paymentId, PayerID);
                        }
                    }
                } catch (error) {
                    console.error('Error checking payment status:', error);
                }
            }, 1000);

            return () => clearInterval(intervalId);
        }
    }, [paypalWindow, navigate, handleCloseWindow]);

    const handlePaymentVerification = async (paymentId, PayerID) => {
        setLoading(true);
        try {
            const response = await PayPalService.verifyPayment(paymentId, PayerID);
            if (response.status === 'success') {
                
                if (paypalWindow && !paypalWindow.closed) {
                    paypalWindow.close();
                }
                // Show success message
                setNewBalance(response.new_balance);
                setShowToast(true);
                
                // Navigate after showing success
                setTimeout(() => {
                    navigate('/dashboard', {
                        state: { message: response.message }
                    });
                }, 2000);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await PayPalService.chargeBalance(amount);
            
            if (response.redirect_url) {
                console.log("Opening PayPal window");
                const newWindow = window.open(
                    response.redirect_url,
                    'PayPalWindow',
                    'width=800,height=600,toolbar=0,menubar=0,location=0,status=1'
                );
                
                if (newWindow) {
                    console.log("PayPal window opened successfully");
                    // Store reference before React state updates
                    paypalWindow.current = newWindow;
                    setPaypalVarWindow(newWindow);
                    
                    // Verify window is accessible
                    try {
                        newWindow.focus();
                        console.log("PayPal window focused");
                    } catch (e) {
                        console.error("Error focusing PayPal window:", e);
                    }
                } else {
                    throw new Error('Popup was blocked. Please allow popups and try again.');
                }
            }
        } catch (err) {
            console.error("PayPal window error:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Toast 
                show={showToast} 
                onClose={() => setShowToast(false)}
                delay={3000}
                autohide
                style={{
                    position: 'fixed',
                    top: 20,
                    right: 20,
                    zIndex: 9999
                }}
            >
                <Toast.Header>
                    <strong className="me-auto">Payment Successful</strong>
                </Toast.Header>
                <Toast.Body>
                    Payment completed! Your new balance is ${newBalance}
                </Toast.Body>
            </Toast>

            <Card className="p-4">
                <Card.Header as="h4">Add Balance using PayPal</Card.Header>
                <Card.Body>
                    {error && <Alert variant="danger">{error}</Alert>}

                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Amount (USD)</Form.Label>
                            <Form.Control
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="Enter amount"
                                min="1"
                                step="0.01"
                                required
                            />
                            <Form.Text className="text-muted">
                                Minimum amount is $1.00
                            </Form.Text>
                        </Form.Group>

                        <Button
                            variant="primary"
                            type="submit"
                            disabled={loading || !amount || parseFloat(amount) < 1}
                            className="w-100"
                        >
                            {loading ? (
                                <>
                                    <Spinner animation="border" size="sm" className="me-2" />
                                    Processing...
                                </>
                            ) : (
                                'Pay with PayPal'
                            )}
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </>
    );
};

export default Wallet;