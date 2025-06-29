class PaystackService {
  public publicKey: string;

  constructor() {
    this.publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || '';
  }

  async initializePayment(data: {
    email: string;
    amount: number; // in major currency unit (NGN or USD)
    currency?: string;
    reference?: string;
    callback_url?: string;
    metadata?: any;
  }): Promise<any> {
    // For demo purposes, return a mock response
    return {
      status: true,
      data: {
        reference: this.generateReference(),
        authorization_url: '#',
        access_code: 'demo_access_code'
      }
    };
  }

  async verifyPayment(reference: string): Promise<any> {
    // For demo purposes, return a mock verification
    return {
      status: true,
      data: {
        reference: reference,
        status: 'success',
        amount: 10000,
        currency: 'NGN'
      }
    };
  }

  openPaymentModal(data: {
    key: string;
    email: string;
    amount: number;
    currency?: string;
    ref: string;
    callback: (response: any) => void;
    onClose: () => void;
  }) {
    // Load Paystack inline script if not already loaded
    if (!window.PaystackPop) {
      const script = document.createElement('script');
      script.src = 'https://js.paystack.co/v1/inline.js';
      script.onload = () => this.openModal(data);
      document.head.appendChild(script);
    } else {
      this.openModal(data);
    }
  }

  private openModal(data: any) {
    if (!this.publicKey) {
      // Demo mode - show alert instead of actual payment
      const proceed = confirm(`Demo Payment Modal\n\nAmount: ${data.currency || 'NGN'} ${(data.amount / 100).toLocaleString()}\nEmail: ${data.email}\n\nClick OK to simulate successful payment, Cancel to simulate failed payment.`);
      
      if (proceed) {
        // Simulate successful payment
        setTimeout(() => {
          data.callback({
            status: 'success',
            reference: data.ref,
            trans: data.ref,
            transaction: data.ref
          });
        }, 1000);
      } else {
        // Simulate cancelled payment
        data.onClose();
      }
      return;
    }

    // Real Paystack integration
    const handler = window.PaystackPop.setup({
      key: this.publicKey,
      email: data.email,
      amount: data.amount,
      currency: data.currency || 'NGN',
      ref: data.ref,
      callback: data.callback,
      onClose: data.onClose
    });
    handler.openIframe();
  }

  generateReference(): string {
    return `ref_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  isConfigured(): boolean {
    return !!this.publicKey;
  }
}

// Extend Window interface for Paystack
declare global {
  interface Window {
    PaystackPop: any;
  }
}

export const paystackService = new PaystackService();