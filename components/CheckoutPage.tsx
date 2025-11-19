'use client';

export default function CheckoutPage() {
  return (
    <div className="page-container active checkout-container">
      <style jsx>{`
        .checkout-container {
          display: flex;
          gap: 3rem;
          padding: 2rem;
          max-width: 1400px;
          margin: 0 auto;
          margin-top: 80px;
        }

        .checkout-form {
          flex: 1;
          max-width: 65%;
        }

        .checkout-title {
          font-size: 2rem;
          font-weight: 900;
          letter-spacing: -0.033em;
          color: var(--text-light);
          margin-bottom: 1.5rem;
        }

        .dark-mode .checkout-title {
          color: var(--text-dark);
        }

        .breadcrumb {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 2rem;
          font-size: 1rem;
          flex-wrap: wrap;
        }

        .breadcrumb-link {
          color: var(--text-muted-light);
          text-decoration: none;
        }

        .dark-mode .breadcrumb-link {
          color: var(--text-muted-dark);
        }

        .breadcrumb-active {
          color: var(--text-light);
          font-weight: 700;
        }

        .dark-mode .breadcrumb-active {
          color: var(--text-dark);
        }

        .form-section {
          margin-bottom: 2.5rem;
        }

        .form-section-title {
          font-size: 1.375rem;
          font-weight: 700;
          letter-spacing: -0.015em;
          color: var(--text-light);
          padding: 1.25rem 0 0.75rem 0;
          border-top: 1px solid transparent;
        }

        .dark-mode .form-section-title {
          color: var(--text-dark);
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
          margin-bottom: 1rem;
        }

        .form-grid.full {
          grid-template-columns: 1fr;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-label {
          font-size: 1rem;
          font-weight: 500;
          color: var(--text-light);
          margin-bottom: 0.5rem;
        }

        .dark-mode .form-label {
          color: var(--text-dark);
          color: rgba(227, 233, 236, 0.9);
        }

        .form-input {
          padding: 0.9375rem;
          border: 1px solid var(--border-light);
          border-radius: 0.5rem;
          font-size: 1rem;
          font-family: 'Manrope', sans-serif;
          color: var(--text-light);
          background: white;
          transition: all 0.3s;
        }

        .dark-mode .form-input {
          background: var(--background-dark);
          border-color: var(--border-dark);
          color: var(--text-dark);
        }

        .form-input:focus {
          outline: none;
          ring: 2px;
          ring-color: rgba(43, 173, 238, 0.5);
          border-color: var(--primary);
        }

        .payment-methods {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .payment-method {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem;
          border: 2px solid var(--border-light);
          border-radius: 0.5rem;
          cursor: pointer;
          transition: all 0.3s;
        }

        .dark-mode .payment-method {
          border-color: var(--border-dark);
        }

        .payment-method:hover {
          border-color: var(--primary);
          background: rgba(43, 173, 238, 0.05);
        }

        .payment-method.active {
          border-color: var(--primary);
          background: rgba(43, 173, 238, 0.2);
        }

        .dark-mode .payment-method.active {
          background: rgba(43, 173, 238, 0.3);
        }

        .payment-method input[type="radio"] {
          cursor: pointer;
        }

        .payment-method-label {
          font-weight: 600;
          color: var(--text-light);
        }

        .dark-mode .payment-method-label {
          color: var(--text-dark);
        }

        .checkbox-group {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-top: 2rem;
        }

        .checkbox-group input[type="checkbox"] {
          width: 1.25rem;
          height: 1.25rem;
          cursor: pointer;
        }

        .checkbox-label {
          font-size: 0.875rem;
          color: var(--text-muted-light);
        }

        .dark-mode .checkbox-label {
          color: var(--text-muted-dark);
        }

        .checkbox-label a {
          color: var(--primary);
          font-weight: 600;
          text-decoration: none;
        }

        .checkout-summary {
          width: 35%;
          position: sticky;
          top: 100px;
          height: fit-content;
        }

        .summary-box {
          background: white;
          border: 1px solid var(--border-light);
          border-radius: 0.5rem;
          padding: 1.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .dark-mode .summary-box {
          background: rgba(26, 41, 51, 0.8);
          border-color: var(--border-dark);
        }

        .summary-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-light);
          margin-bottom: 1.5rem;
        }

        .dark-mode .summary-title {
          color: var(--text-dark);
        }

        .summary-item {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid var(--border-light);
        }

        .dark-mode .summary-item {
          border-bottom-color: var(--border-dark);
        }

        .summary-item-image {
          width: 6rem;
          height: 6rem;
          border-radius: 0.5rem;
          background-size: cover;
          background-position: center;
        }

        .summary-item-info h4 {
          font-weight: 700;
          color: var(--text-light);
          margin-bottom: 0.25rem;
        }

        .dark-mode .summary-item-info h4 {
          color: var(--text-dark);
        }

        .summary-item-info p {
          font-size: 0.875rem;
          color: var(--text-muted-light);
          margin-bottom: 0.25rem;
        }

        .dark-mode .summary-item-info p {
          color: var(--text-muted-dark);
        }

        .summary-breakdown {
          padding-bottom: 1rem;
          margin-bottom: 1rem;
          border-bottom: 1px solid var(--border-light);
        }

        .dark-mode .summary-breakdown {
          border-bottom-color: var(--border-dark);
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.75rem;
          font-size: 0.875rem;
        }

        .summary-row-label {
          color: var(--text-muted-light);
        }

        .dark-mode .summary-row-label {
          color: var(--text-muted-dark);
        }

        .summary-row-value {
          color: var(--text-light);
          font-weight: 500;
        }

        .dark-mode .summary-row-value {
          color: var(--text-dark);
        }

        .summary-promo {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .summary-promo input {
          flex: 1;
          padding: 0.75rem;
          border: 1px solid var(--border-light);
          border-radius: 0.5rem;
          font-family: 'Manrope', sans-serif;
          color: var(--text-light);
          background: white;
        }

        .dark-mode .summary-promo input {
          background: var(--background-dark);
          border-color: var(--border-dark);
          color: var(--text-dark);
        }

        .summary-promo button {
          padding: 0.75rem 1rem;
          background: rgba(43, 173, 238, 0.2);
          color: var(--primary);
          border: none;
          border-radius: 0.5rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
        }

        .summary-promo button:hover {
          background: rgba(43, 173, 238, 0.3);
        }

        .summary-total {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 0;
          font-size: 1.125rem;
          font-weight: 700;
          color: var(--text-light);
        }

        .dark-mode .summary-total {
          color: var(--text-dark);
        }

        .summary-total-amount {
          font-size: 1.5rem;
          font-weight: 900;
        }

        .btn-complete {
          width: 100%;
          padding: 1rem;
          background: var(--primary);
          color: white;
          border: none;
          border-radius: 0.5rem;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          margin-top: 1rem;
          transition: opacity 0.3s;
        }

        .btn-complete:hover {
          opacity: 0.9;
        }

        .security-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          color: var(--text-muted-light);
          margin-top: 1rem;
          text-align: center;
        }

        .dark-mode .security-badge {
          color: var(--text-muted-dark);
        }

        @media (max-width: 768px) {
          .checkout-container {
            flex-direction: column;
            gap: 2rem;
          }

          .checkout-form {
            max-width: 100%;
          }

          .checkout-summary {
            width: 100%;
            position: static;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .payment-methods {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="checkout-form">
        <h1 className="checkout-title">Checkout</h1>

        <div className="breadcrumb">
          <a href="#" className="breadcrumb-link">Home</a>
          <span>/</span>
          <a href="#" className="breadcrumb-link">Apartment Booking</a>
          <span>/</span>
          <span className="breadcrumb-active">Checkout</span>
        </div>

        {/* Contact Information */}
        <div className="form-section">
          <h2 className="form-section-title">Contact Information</h2>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">First Name</label>
              <input className="form-input" type="text" placeholder="John" />
            </div>
            <div className="form-group">
              <label className="form-label">Last Name</label>
              <input className="form-input" type="text" placeholder="Doe" />
            </div>
          </div>
          <div className="form-grid full">
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" type="email" placeholder="john@example.com" />
            </div>
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input className="form-input" type="tel" placeholder="+1 (555) 000-0000" />
            </div>
            <div className="form-group">
              <label className="form-label">Country/Region</label>
              <input className="form-input" type="text" placeholder="United States" />
            </div>
          </div>
        </div>

        {/* Billing Address */}
        <div className="form-section">
          <h2 className="form-section-title">Billing Address</h2>
          <div className="form-grid full">
            <div className="form-group">
              <label className="form-label">Street Address</label>
              <input className="form-input" type="text" placeholder="123 Main St" />
            </div>
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">City</label>
              <input className="form-input" type="text" placeholder="New York" />
            </div>
            <div className="form-group">
              <label className="form-label">State/Province</label>
              <input className="form-input" type="text" placeholder="NY" />
            </div>
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">ZIP Code</label>
              <input className="form-input" type="text" placeholder="10001" />
            </div>
            <div className="form-group">
              <label className="form-label">Country</label>
              <input className="form-input" type="text" placeholder="United States" />
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="form-section">
          <h2 className="form-section-title">Payment Method</h2>
          <div className="payment-methods">
            <div className="payment-method active">
              <input type="radio" name="payment" id="card" defaultChecked />
              <span className="material-symbols-outlined">credit_card</span>
              <label className="payment-method-label">Credit Card</label>
            </div>
            <div className="payment-method">
              <input type="radio" name="payment" id="paypal" />
              <span className="material-symbols-outlined">payment</span>
              <label className="payment-method-label">PayPal</label>
            </div>
          </div>

          <div className="form-grid full">
            <div className="form-group">
              <label className="form-label">Card Number</label>
              <input
                className="form-input"
                type="text"
                placeholder="0000 0000 0000 0000"
              />
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Expiry Date</label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="MM/YY"
                />
              </div>
              <div className="form-group">
                <label className="form-label">CVC</label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="123"
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Name on Card</label>
              <input
                className="form-input"
                type="text"
                placeholder="Enter name on card"
              />
            </div>
          </div>
        </div>

        <div className="checkbox-group">
          <input type="checkbox" id="terms" defaultChecked />
          <label className="checkbox-label" htmlFor="terms">
            I agree to the <a href="#">Terms of Service</a> and{' '}
            <a href="#">Privacy Policy</a>.
          </label>
        </div>

        <button className="btn-complete">Complete Purchase</button>
        <div className="security-badge">
          <span className="material-symbols-outlined">lock</span>
          <p>Your payment is safe and secure.</p>
        </div>
      </div>

      <div className="checkout-summary">
        <div className="summary-box">
          <h3 className="summary-title">Your Order Summary</h3>

          <div
            className="summary-item"
            style={{ paddingBottom: '1.5rem', marginBottom: '1.5rem' }}
          >
            <div
              className="summary-item-image"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDMx_YZ1qHRH8HkxRxP3WxTa9Fn3G_kyq2DdoJEJPjbIBa0e3nl3G3Gj6kNIiXUDmv8Of4zs63YZiTD61Qki_xD_-grwmbfH4TLhnYynaPrEmuFfp2WHnRviML8eULXBcHWRzjP8R3Y781u8WZn5HniY7Z4QkMATkC_CRNhwAiFTcipdknhGGl_eKvC8uSidAyld3ymsmYtqBeaemVOT6qY49F1LknSdKbBzaawB9xxdN0Xyhe6bGlb2Y7jMZo7a632gqrRrf71oyaa")',
              }}
            ></div>
            <div className="summary-item-info">
              <h4>1-BR Apartment in Downtown</h4>
              <p>Rental for 14 nights</p>
              <p>July 15 - July 29, 2024</p>
            </div>
          </div>

          <div className="summary-breakdown">
            <div className="summary-row">
              <span className="summary-row-label">Subtotal</span>
              <span className="summary-row-value">$2,100.00</span>
            </div>
            <div className="summary-row">
              <span className="summary-row-label">Taxes & Fees</span>
              <span className="summary-row-value">$185.50</span>
            </div>
            <div className="summary-row">
              <span className="summary-row-label">Service Fee</span>
              <span className="summary-row-value">$50.00</span>
            </div>
          </div>

          <div className="summary-promo">
            <input type="text" placeholder="Enter code" />
            <button>Apply</button>
          </div>

          <div className="summary-total">
            <span>Total</span>
            <span className="summary-total-amount">$2,335.50</span>
          </div>
        </div>
      </div>
    </div>
  );
}
