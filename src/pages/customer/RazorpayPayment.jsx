import React from 'react';

const loadRazorpayScript = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

const RazorpayPayment = ({ cart, user, onPaymentSuccess }) => {
  const handlePayment = async () => {
    const res = await loadRazorpayScript('https://checkout.razorpay.com/v1/checkout.js');
    if (!res) {
      alert('Razorpay SDK failed to load. Are you online?');
      return;
    }

    // For demo, use dummy order details. In production, get order_id from backend
    const options = {
      key: 'rzp_test_PTBOcnLHmGQE1W', // Replace with your Razorpay key
      amount: cart.total * 100, // in paise
      currency: 'INR',
      name: 'Ziplyy',
      description: 'Order Payment',
      image: '/favicon.ico',
      handler: function (response) {
        // You can verify payment on backend here
        if (onPaymentSuccess) onPaymentSuccess(response);
      },
      prefill: {
        name: user?.name || '',
        email: user?.email || '',
        contact: user?.phone || '',
      },
      notes: {
        address: user?.address || '',
      },
      theme: {
        color: '#FF0000',
      },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div style={{ margin: '24px 0', textAlign: 'center' }}>
      <button
        onClick={handlePayment}
        style={{
          background: '#FF0000',
          color: 'white',
          border: 'none',
          borderRadius: 6,
          padding: '12px 32px',
          fontWeight: 600,
          fontSize: 16,
          cursor: 'pointer',
        }}
        disabled={!cart || !cart.items || cart.items.length === 0}
      >
        Online Payment
      </button>
    </div>
  );
};

export default RazorpayPayment; 