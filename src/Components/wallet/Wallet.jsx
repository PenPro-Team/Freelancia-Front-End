import React, { useState, useEffect, useCallback, useRef, use } from "react";
import { Form, Button, Alert, Spinner, Card, Toast, Badge } from "react-bootstrap";
import { PayPalService } from "./PaypalService";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getFromLocalStorage } from "../../network/local/LocalStorage";
import { useTranslation } from 'react-i18next';

const Wallet = () => {
    const { t } = useTranslation();
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
    const auth = getFromLocalStorage("auth");
    const currentUser = auth?.user;
    const [withdrawalLogs, setWithdrawalLogs] = useState([]);
    const [logsLoading, setLogsLoading] = useState(false);
    const [logsError, setLogsError] = useState(null);
    const [withdrawalFlag, setWithdrawalFlag] = useState(false);
    const newWindowRef = useRef(null); // Use useRef to store the newWindow reference

    useEffect(() => {
        const paymentId = searchParams.get('paymentId');
        const PayerID = searchParams.get('PayerID');

        fetchWithdrawalLogs();
        
        if (paymentId && PayerID) {
            handlePaymentVerification(paymentId, PayerID);
        }
    }, [searchParams,withdrawalFlag]);

    useEffect(() => {
        if (paypalWindow?.current) {
            const intervalId = setInterval(async () => {
                try {
                    const result = await PayPalService.checkPaymentStatus(paypalWindow.current);
                    
                    if (result.status === 'closed') {
                        clearInterval(intervalId);
                        
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
    }, [paypalWindow, navigate]);

    const handlePaymentVerification = async (paymentId, PayerID) => {
        setLoading(true);
        try {
            console.log(window);
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
                    // Store reference in useRef
                    newWindowRef.current = newWindow;
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
            if (!currentUser) {
                navigate('/');
                return;
            }
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
                        {withdrawalResponse ? t('wallet.payment.success') : t('wallet.payment.success')}
                    </strong>
                </Toast.Header>
                <Toast.Body>
                    {withdrawalResponse ? (
                        <>
                            {t('wallet.payment.withdrawalSuccess', { amount: withdrawalResponse.amount })}
                            <br />
                            {t('wallet.status')}: {withdrawalResponse.status}
                            <br />
                            {t('wallet.payment.completed', { balance: withdrawalResponse.new_balance.toFixed(2) })}
                        </>
                    ) : (
                        t('wallet.payment.completed', { balance: newBalance?.toFixed(2) || '0.00' })
                    )}
                </Toast.Body>
            </Toast>

            <div className="row g-4">
                <div className="col-md-6">
                    <Card className="p-4">
                        <Card.Header as="h4">{t('wallet.addBalance')}</Card.Header>
                        <Card.Body>
                            {error && <Alert variant="danger">{error}</Alert>}

                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>{t('wallet.amount')}</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder={t('wallet.enterAmount')}
                                        min="1"
                                        step="0.01"
                                        required
                                    />
                                    <Form.Text className="text-muted">
                                        {t('wallet.minAmount')}
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
                                            {t('wallet.processing')}
                                        </>
                                    ) : (
                                        t('wallet.payWithPaypal')
                                    )}
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </div>
                
                <div className="col-md-6">
                    <Card className="p-4">
                        <Card.Header as="h4">{t('wallet.withdrawFunds')}</Card.Header>
                        <Card.Body>
                            {withdrawalError && <Alert variant="danger">{withdrawalError}</Alert>}
                            {withdrawalStatus === 'success' && (
                                <Alert variant="success">
                                    {t('wallet.withdrawalRequestSubmitted')}
                                    <br />
                                    {t('wallet.status')}: {withdrawalResponse?.status}
                                    <br />
                                    {t('wallet.amount')}: ${withdrawalResponse?.amount}
                                    <br />
                                    {t('wallet.paypalEmail')}: {withdrawalResponse?.paypal_email}
                                </Alert>
                            )}
                            
                           {
                            currentUser? (
                                <Form onSubmit={handleWithdrawalSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>{t('wallet.availableBalance')}: ${currentUser.user_balance}</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={withdrawalAmount}
                                        onChange={(e) => setWithdrawalAmount(e.target.value)}
                                        placeholder={t('wallet.enterWithdrawAmount')}
                                        min="1"
                                        step="0.01"
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>{t('wallet.paypalEmail')}</Form.Label>
                                    <Form.Control
                                        type="email"
                                        value={paypalEmail}
                                        onChange={(e) => setPaypalEmail(e.target.value)}
                                        placeholder={t('wallet.enterPaypalEmail')}
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
                                            {t('wallet.processing')}
                                        </>
                                    ) : (
                                        t('wallet.requestWithdrawal')
                                    )}
                                </Button>
                            </Form>
                            ): null
                           }
                        </Card.Body>
                    </Card>
                </div>
            </div>

            <div className="row mt-4">
                <div className="col-12">
                    <Card>
                        <Card.Header as="h4">{t('wallet.withdrawalHistory')}</Card.Header>
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
                                                <th>{t('wallet.date')}</th>
                                                <th>{t('wallet.amount')}</th>
                                                <th>{t('wallet.paypalEmail')}</th>
                                                <th>{t('wallet.status')}</th>
                                                <th>{t('wallet.notes')}</th>
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
                                <p className="text-muted text-center">{t('wallet.noWithdrawalHistory')}</p>
                            )}
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </>
    );
};

export default Wallet;