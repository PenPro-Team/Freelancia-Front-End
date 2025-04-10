import { AxiosPayPalInstance, AxiosWithdrawalsInstance } from "../../network/API/AxiosInstance";
import { getFromLocalStorage } from "../../network/local/LocalStorage";

export const PayPalService = {
    chargeBalance: async (amount) => {
        const auth = getFromLocalStorage("auth");
        console.log('Auth token:', auth.access); // For debugging
        if (!auth || !auth.user.access) {
            console.error('No auth token found');
            throw new Error('Authentication required');
        }
        
        
        try {
            const response = await AxiosPayPalInstance.post('charge/', {
                amount: parseFloat(amount),
            }, {
                headers: {
                    'Authorization': `Bearer ${auth.user.access}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            const errorDetails = {
                status: error.response?.status,
                data: error.response?.data,
                headers: error.response?.headers
            };
            console.error('PayPal charge error details:', errorDetails);
            throw new Error(error.response?.data?.detail || error.response?.data?.message || 'Payment initiation failed');
        }
    },

    verifyPayment: async (paymentId, PayerID, token) => {
        const auth = getFromLocalStorage("auth");
        if (!auth || !auth.user.access) {
            console.error('No auth token found');
            throw new Error('Authentication required');
        }

        try {
            const userId = auth.user.id;
            const response = await AxiosPayPalInstance.get(
                `success/?user_id=${userId}&paymentId=${paymentId}&PayerID=${PayerID}&token=${token}`,
                {
                    headers: {
                        'Authorization': `Bearer ${auth.user.access}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                }
            );
            // Log the response for debugging
            console.log('Payment verification response:', response.data);
            if (response.data.status == 'success') {
                return {
                    status: response.data.status,
                    message: response.data.message,
                    new_balance: response.data.new_balance // Ensure this matches the backend response
                };
            }
        } catch (error) {
            const errorDetails = {
                status: error.response?.status,
                data: error.response?.data,
                headers: error.response?.headers
            };
            console.error('PayPal verification error details:', errorDetails);
            throw new Error(error.response?.data?.detail || 'Payment verification failed');
        }
    },

    checkPaymentStatus: async (paypalWindow) => {
        if (!paypalWindow || paypalWindow.closed) {
            return { status: 'closed' };
        }
        
        try {
            // Try to access location, if it fails with SecurityError, we're still on PayPal
            try {
                const currentUrl = paypalWindow.location.href;
                // Only try to access href if we're back on our domain
                if (currentUrl.startsWith(window.location.origin) || 
                    currentUrl.includes('127.0.0.1:8000') || 
                    currentUrl.includes('localhost:8000')) {
                    return { status: 'success' };
                }
            } catch (e) {
                // If we get SecurityError, we're still on PayPal domain
                if (e.name === 'SecurityError') {
                    return { status: 'pending' };
                }
                throw e;
            }
            
            return { status: 'pending' };
        } catch (error) {
            console.error('Payment status check failed:', error);
            return { status: 'error', message: error.message };
        }
    },

    requestWithdrawal: async (amount, paypalEmail) => {
        const auth = getFromLocalStorage("auth");
        if (!auth || !auth.user.access) {
            throw new Error('Authentication required');
        }
        
        try {
            const response = await AxiosWithdrawalsInstance.post('create/', {
                amount: parseFloat(amount),
                paypal_email: paypalEmail
            }, {
                headers: {
                    'Authorization': `Bearer ${auth.user.access}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Withdrawal request failed';
            throw new Error(errorMessage);
        }
    },

    getWithdrawalLogs: async () => {
        const auth = getFromLocalStorage("auth");
        if (!auth || !auth.user.access) {
            throw new Error('Authentication required');
        }
        
        try {
            const response = await AxiosWithdrawalsInstance.get('', {  // Add specific endpoint
                headers: {
                    'Authorization': `Bearer ${auth.user.access}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log('Withdrawal logs response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching withdrawal logs:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch withdrawal logs');
        }
    }
};