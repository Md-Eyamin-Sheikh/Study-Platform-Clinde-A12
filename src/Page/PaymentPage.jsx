import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CreditCard, ArrowLeft, CheckCircle } from 'lucide-react';

const PaymentPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const sessionId = searchParams.get('sessionId');
  const fee = searchParams.get('fee');

  useEffect(() => {
    // Get booking data from localStorage
    const pendingBooking = localStorage.getItem('pendingBooking');
    if (pendingBooking) {
      setBookingData(JSON.parse(pendingBooking));
    }
  }, []);

  const handlePayment = async () => {
    if (!bookingData) return;

    setProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // After successful payment, book the session
      const response = await fetch('http://localhost:5000/api/book-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData)
      });

      const result = await response.json();

      if (result.success) {
        setPaymentSuccess(true);
        localStorage.removeItem('pendingBooking');
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } else {
        alert(result.message || 'Failed to complete booking after payment.');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-md">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
          <p className="text-gray-900 mb-4">Your session has been booked successfully.</p>
          <p className="text-sm text-gray-700">Redirecting to home page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50  py-8">
      <div className="max-w-2xl mx-auto px-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Session Details
        </button>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-green-4 text-white p-6">
            <h1 className="text-2xl text-black font-bold flex items-center">
              <CreditCard className="w-6 h-6 mr-3" />
              Payment
            </h1>
          </div>

          <div className="p-6">
            {bookingData ? (
              <>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Booking Summary</h2>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-900">Session:</span>
                      <span className="font-medium text-gray-900">{bookingData.sessionTitle}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-900">Tutor:</span>
                      <span className="font-medium text-gray-900">{bookingData.tutorEmail}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-900">Student:</span>
                      <span className="font-medium text-gray-900">{bookingData.studentEmail}</span>
                    </div>
                    <hr className="my-2" />
                    <div className="flex justify-between text-lg font-bold">
                      <span className='text-gray-900'>Total Amount:</span>
                      <span className="text-green-600">${fee}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h3>
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center mb-4">
                      <input type="radio" id="card" name="payment" defaultChecked className="mr-3" />
                      <label htmlFor="card" className="flex items-center text-gray-950">
                        <CreditCard className="w-5 h-5 mr-2 text-gray-800" />
                        Credit/Debit Card
                      </label>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      <input
                        type="text"
                        placeholder="Card Number"
                        className="border rounded-lg px-3 text-gray-950 py-2"
                        // defaultValue="**** **** **** 1234"
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="MM/YY"
                          className="border rounded-lg text-gray-950 px-3 py-2"
                          // defaultValue="12/25"
                        />
                        <input
                          type="text"
                          placeholder="CVV"
                          className="border rounded-lg px-3 text-gray-950 py-2"
                          // defaultValue="123"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handlePayment}
                  disabled={processing}
                  className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-300 ${
                    processing
                      ? 'bg-gray-400 cursor-not-allowed'
                      : ' bg-green-500  hover:from-green-600 hover:to-blue-700'
                  }`}
                >
                  {processing ? 'Processing Payment...' : `Pay $${fee}`}
                </button>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">No booking data found. Please go back and try again.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
