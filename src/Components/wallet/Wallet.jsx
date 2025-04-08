import React, { useState, useEffect, useCallback, useRef, use } from "react";
import { Form, Button, Alert, Spinner, Card, Toast, Badge } from "react-bootstrap";
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
    const [withdrawalAmount, setWithdrawalAmount] = useState('');
    const [paypalEmail, setPaypalEmail] = useState('');
    const [withdrawalLoading, setWithdrawalLoading] = useState(false);
    const [withdrawalError, setWithdrawalError] = useState(null);
    const [withdrawalStatus, setWithdrawalStatus] = useState(null);
    const [withdrawalResponse, setWithdrawalResponse] = useState(null);
    const currentUser = getFromLocalStorage("auth").user;
    const [withdrawalLogs, setWithdrawalLogs] = useState([]);
    const [logsLoading, setLogsLoading] = useState(false);
    const [logsError, setLogsError] = useState(null);
    const [withdrawalFlag, setWithdrawalFlag] = useState(false);

    useEffect(() => {
        const paymentId = searchParams.get('paymentId');
        const PayerID = searchParams.get('PayerID');

        fetchWithdrawalLogs();
        
        if (paymentId && PayerID) {
            handlePaymentVerification(paymentId, PayerID);
        }
    }, [searchParams,withdrawalFlag]);

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
                console.log('New balance:', response.new_balance); // Debug log
                setNewBalance(response.new_balance);
                setShowToast(true);
                
                setTimeout(() => {
                    navigate('/dashboard', {
                        state: { 
                            message: response.message,
                            newBalance: response.new_balance // Pass balance to dashboard
                        }
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

    const handleWithdrawalSubmit = async (e) => {
        e.preventDefault();
        setWithdrawalLoading(true);
        setWithdrawalError(null);
        setWithdrawalResponse(null);

        try {
            if (parseFloat(withdrawalAmount) > currentUser.user_balance) {
                throw new Error('Insufficient balance for withdrawal');
            }

            const response = await PayPalService.requestWithdrawal(withdrawalAmount, paypalEmail);
            setWithdrawalResponse(response);
            setWithdrawalStatus('success');
            setNewBalance(response.new_balance);
            
            // After successful submission, refresh the withdrawal logs
            await fetchWithdrawalLogs();
            
            // Reset form and show success message
            setWithdrawalAmount('');
            setPaypalEmail('');
            setShowToast(true);
        } catch (err) {
            setWithdrawalError(err.message);
            setWithdrawalStatus('error');
        } finally {
            setWithdrawalFlag(!withdrawalFlag);
            setWithdrawalLoading(false);
        }
    };


    const fetchWithdrawalLogs = async () => {
        setLogsLoading(true);
        setLogsError(null);
        try {
            const logs = await PayPalService.getWithdrawalLogs();
            setWithdrawalLogs(logs.results);
            console.log('Withdrawal logs:', logs); // Debug log
            
        } catch (err) {
            setLogsError(err.message);
        } finally {
            setLogsLoading(false);
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
                    <strong className="me-auto">
                        {withdrawalResponse ? 'Withdrawal Request Submitted' : 'Payment Successful'}
                    </strong>
                </Toast.Header>
                <Toast.Body>
                    {withdrawalResponse ? (
                        <>
                            Withdrawal request for ${withdrawalResponse.amount} submitted successfully!
                            <br />
                            Status: {withdrawalResponse.status}
                            <br />
                            New balance: ${withdrawalResponse.new_balance.toFixed(2)}
                        </>
                    ) : (
                        `Payment completed! Your new balance is $${newBalance?.toFixed(2) || '0.00'}`
                    )}
                </Toast.Body>
            </Toast>

            <div className="row g-4">
                <div className="col-md-6">
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
                </div>
                
                <div className="col-md-6">
                    <Card className="p-4">
                        <Card.Header as="h4">Withdraw Funds</Card.Header>
                        <Card.Body>
                            {withdrawalError && <Alert variant="danger">{withdrawalError}</Alert>}
                            {withdrawalStatus === 'success' && (
                                <Alert variant="success">
                                    Withdrawal request submitted successfully!
                                    <br />
                                    Status: {withdrawalResponse.status}
                                    <br />
                                    Amount: ${withdrawalResponse.amount}
                                    <br />
                                    PayPal Email: {withdrawalResponse.paypal_email}
                                </Alert>
                            )}
                            
                            <Form onSubmit={handleWithdrawalSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Available Balance: ${currentUser.user_balance}</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={withdrawalAmount}
                                        onChange={(e) => setWithdrawalAmount(e.target.value)}
                                        placeholder="Enter amount to withdraw"
                                        min="1"
                                        step="0.01"
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>PayPal Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        value={paypalEmail}
                                        onChange={(e) => setPaypalEmail(e.target.value)}
                                        placeholder="Enter your PayPal email"
                                        required
                                    />
                                </Form.Group>

                                <Button
                                    variant="primary"
                                    type="submit"
                                    disabled={withdrawalLoading || !withdrawalAmount || !paypalEmail || parseFloat(withdrawalAmount) > currentUser.user_balance}
                                    className="w-100"
                                >
                                    {withdrawalLoading ? (
                                        <>
                                            <Spinner animation="border" size="sm" className="me-2" />
                                            Processing...
                                        </>
                                    ) : (
                                        'Request Withdrawal'
                                    )}
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </div>
            </div>

            <div className="row mt-4">
                <div className="col-12">
                    <Card>
                        <Card.Header as="h4">Withdrawal History</Card.Header>
                        <Card.Body>
                            {logsError && <Alert variant="danger">{logsError}</Alert>}
                            {logsLoading ? (
                                <div className="text-center">
                                    <Spinner animation="border" />
                                </div>
                            ) : withdrawalLogs.length > 0 ? (
                                <div className="table-responsive">
                                    <table className="table table-striped">
                                        <thead>
                                            <tr>
                                                <th>Date</th>
                                                <th>Amount</th>
                                                <th>PayPal Email</th>
                                                <th>Status</th>
                                                <th>Notes</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {withdrawalLogs.map((log) => (
                                                <tr key={log.id}>
                                                    <td>{new Date(log.created_at).toLocaleDateString()}</td>
                                                    <td>${log.amount}</td>
                                                    <td>{log.paypal_email}</td>
                                                    <td>
                                                        <Badge bg={
                                                            log.status === 'approved' ? 'success' :
                                                            log.status === 'pending' ? 'warning' :
                                                            log.status === 'rejected' ? 'danger' : 'secondary'
                                                        }>
                                                            {log.status}
                                                        </Badge>
                                                    </td>
                                                    <td>{log.notes || '-'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="text-muted text-center">No withdrawal history found</p>
                            )}
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </>
    );
};

export default Wallet;