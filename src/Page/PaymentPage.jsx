import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { CreditCard, ArrowLeft, CheckCircle, Crown, Zap } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { AuthContext } from '../providers/AuthProvider';
import Swal from 'sweetalert2';

const stripePromise = loadStripe('pk_test_51S7K9LBZpO9sl6i9FaCDFvCLpHvbSzY8O94exklBAiZkXvsh1KkH5eznVRHEXeVcDXAtEUgi7UkBh0AW85k4vIAx00BdJblZLE');

const CheckoutForm = ({ bookingData, fee, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);

    try {
      // Create payment intent
      const amountInCents = Math.round(fee * 100); 
      const response = await fetch('https://study-hub-survar-a12.vercel.app/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: amountInCents })
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Payment intent error:', errorData);
        throw new Error(`Server error: ${response.status}`);
      }

      const { clientSecret } = await response.json();

      // Confirm payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        }
      });

      if (result.error) {
        Swal.fire('Payment Error!', result.error.message, 'error');
      } else {
        // Payment successful, book the session
        const bookResponse = await fetch('https://study-hub-survar-a12.vercel.app/api/book-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bookingData)
        });

        const bookResult = await bookResponse.json();
        if (bookResult.success) {
          onSuccess();
        } else {
          Swal.fire('Booking Error!', 'Payment successful but booking failed. Please contact support.', 'warning');
        }
      }
    } catch (error) {
      Swal.fire('Payment Failed!', 'Payment failed. Please try again.', 'error');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-900 mb-2">Card Details</label>
        <div className="border rounded-lg p-3">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
              },
            }}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={!stripe || processing}
        className={`w-full py-3 px-6 rounded-lg font-semibold text-black transition-all duration-300 ${
          processing || !stripe
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
        }`}
      >
        {processing ? 'Processing Payment...' : `Pay $${fee}`}
      </button>
    </form>
  );
};

const PaymentPage = () => {
  const { user, loading } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const location = useLocation();

  const fee = searchParams.get('fee') || location.state?.fee;
  const planDetails = location.state?.planDetails;
  const isSubscription = location.state?.bookingData?.type === 'subscription';

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
      return;
    }
    
    // Handle subscription data from location state
    if (location.state?.bookingData) {
      setBookingData(location.state.bookingData);
    } else {
      // Handle session booking data from localStorage
      const pendingBooking = localStorage.getItem('pendingBooking');
      if (pendingBooking) {
        setBookingData(JSON.parse(pendingBooking));
      }
    }
  }, [user, loading, navigate, location.state]);

  const handlePaymentSuccess = () => {
    setPaymentSuccess(true);
    localStorage.removeItem('pendingBooking');
    setTimeout(() => navigate('/'), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-md">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
          <p className="text-gray-600 mb-4">
            {isSubscription 
              ? 'Your subscription has been activated successfully.' 
              : 'Your session has been booked successfully.'
            }
          </p>
          <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Session Details
        </button>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className={`bg-gradient-to-r ${
            isSubscription 
              ? 'from-purple-600 to-blue-600' 
              : 'from-green-600 to-emerald-600'
          } text-white p-6`}>
            <h1 className="text-2xl font-bold flex items-center">
              {isSubscription ? (
                <Crown className="w-6 h-6 mr-3" />
              ) : (
                <CreditCard className="w-6 h-6 mr-3" />
              )}
              {isSubscription ? 'Subscription Payment' : 'Session Payment'}
            </h1>
          </div>

          <div className="p-6">
            {bookingData ? (
              <>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    {isSubscription ? 'Subscription Summary' : 'Booking Summary'}
                  </h2>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    {isSubscription ? (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-900">Plan:</span>
                          <span className="font-medium text-black">{planDetails?.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-900">Billing:</span>
                          <span className="font-medium text-black">Monthly</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-900">Features:</span>
                          <span className="font-medium text-black">{planDetails?.features?.length} included</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-900">Session:</span>
                          <span className="font-medium text-black">{bookingData.sessionTitle}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-900">Tutor:</span>
                          <span className="font-medium text-black">{bookingData.tutorEmail}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-900">Student:</span>
                          <span className="font-medium text-black">{bookingData.studentEmail}</span>
                        </div>
                      </>
                    )}
                    <hr className="my-2" />
                    <div className="flex justify-between text-lg font-bold">
                      <span className='text-black'>Total Amount:</span>
                      <span className="text-green-600">${fee}</span>
                    </div>
                  </div>
                </div>

                <Elements stripe={stripePromise}>
                  <CheckoutForm 
                    bookingData={bookingData} 
                    fee={fee} 
                    onSuccess={handlePaymentSuccess} 
                  />
                </Elements>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-900">No booking data found. Please go back and try again.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
