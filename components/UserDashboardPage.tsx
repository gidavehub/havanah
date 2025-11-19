'use client';

export default function UserDashboardPage() {
  return (
    <div className="page-container active user-dashboard">
      <style jsx>{`
        .user-dashboard {
          padding: 2rem;
          max-width: 80rem;
          margin: 0 auto;
        }

        .dashboard-header {
          margin-bottom: 2rem;
        }

        .dashboard-title {
          font-size: 2rem;
          font-weight: 900;
          letter-spacing: -0.033em;
          color: var(--text-light);
          margin-bottom: 0.5rem;
        }

        .dark-mode .dashboard-title {
          color: var(--text-dark);
        }

        .dashboard-subtitle {
          color: var(--text-muted-light);
          font-size: 1rem;
        }

        .dark-mode .dashboard-subtitle {
          color: var(--text-muted-dark);
        }

        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .service-card {
          position: relative;
          border-radius: 1rem;
          overflow: hidden;
          background: linear-gradient(to top right, rgba(255,255,255,0.8), rgba(255,255,255,0));
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 0;
          display: flex;
          flex-direction: column;
        }

        .dark-mode .service-card {
          background: linear-gradient(to top right, rgba(26, 41, 51, 0.5), rgba(26, 41, 51, 0));
          border-color: rgba(255, 255, 255, 0.1);
        }

        .service-image {
          width: 100%;
          aspect-ratio: 16 / 9;
          background-size: cover;
          background-position: center;
        }

        .service-content {
          padding: 1.5rem;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .service-title {
          font-size: 1.125rem;
          font-weight: 700;
          color: var(--text-light);
          margin-bottom: 1rem;
        }

        .dark-mode .service-title {
          color: var(--text-dark);
        }

        .service-info {
          font-size: 0.875rem;
          color: var(--text-muted-light);
          margin-bottom: 0.5rem;
        }

        .dark-mode .service-info {
          color: var(--text-muted-dark);
        }

        .progress-bar {
          width: 100%;
          height: 0.5rem;
          background: #e5e7eb;
          border-radius: 9999px;
          overflow: hidden;
          margin: 0.5rem 0 1rem 0;
        }

        .dark-mode .progress-bar {
          background: #4b5563;
        }

        .progress-fill {
          height: 100%;
          background: var(--primary);
          border-radius: 9999px;
        }

        .service-buttons {
          display: flex;
          gap: 0.75rem;
        }

        .btn-secondary {
          flex: 1;
          padding: 0.625rem 1.5rem;
          background: rgba(43, 173, 238, 0.2);
          color: var(--primary);
          border: none;
          border-radius: 9999px;
          font-size: 0.875rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
        }

        .dark-mode .btn-secondary {
          background: rgba(43, 173, 238, 0.3);
        }

        .btn-secondary:hover {
          background: rgba(43, 173, 238, 0.3);
        }

        .btn-primary {
          flex: 1;
          padding: 0.625rem 1.5rem;
          background: var(--primary);
          color: white;
          border: none;
          border-radius: 9999px;
          font-size: 0.875rem;
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.3s;
        }

        .btn-primary:hover {
          transform: scale(1.05);
        }

        .quick-actions {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .action-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 1.5rem;
          background: linear-gradient(to top right, rgba(255,255,255,0.5), rgba(255,255,255,0));
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 1rem;
          color: var(--text-light);
          cursor: pointer;
          transition: all 0.3s;
          text-align: center;
        }

        .dark-mode .action-btn {
          background: linear-gradient(to top right, rgba(26, 41, 51, 0.5), rgba(26, 41, 51, 0));
          border-color: rgba(255, 255, 255, 0.1);
          color: var(--text-dark);
        }

        .action-btn:hover {
          background: rgba(255, 255, 255, 0.7);
        }

        .dark-mode .action-btn:hover {
          background: rgba(26, 41, 51, 0.7);
        }

        .action-icon {
          font-size: 2rem;
          color: var(--primary);
        }
      `}</style>

      <div className="dashboard-header">
        <h1 className="dashboard-title">Welcome back, Olivia!</h1>
        <p className="dashboard-subtitle">You have 2 active rentals and 1 purchased vehicle.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <div style={{ gridColumn: 'span 1' }}>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 700, marginBottom: '1rem' }}>
            My Services
          </h2>

          <div className="services-grid">
            {[
              {
                title: 'Audi A4 Rental',
                start: 'June 1, 2024',
                end: 'July 1, 2024',
                remaining: '15 days',
                progress: 50,
                image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAoHpRqSFah18UwWFt6WLinL2HXz29SB_WSH1oxAskEIXWrgbOaxMOw1El7e9fB_-SzEvMnVpvqeGDgjQfxYbyV6dQ9JoJZctIehpf4izhVW0cZr-E0Y_yMiqr8jwVuK0EL8cc7REfP4rAHV8cjp40JBwlATX8wJ9bKfM8lhnfnBQzx6phM63o0cnIT6CVdD9OD7mpwEnI6m7T0X9ku3GwSPJjjE0NiBJRCNlcr88ibaduwOGWLWoF2DgZnzlJSQ8cpa8UrNrL0_gRW',
                showExtend: true,
              },
              {
                title: 'Downtown Loft',
                start: 'Jan 15, 2024',
                end: 'Jan 15, 2025',
                remaining: '6 months',
                progress: 50,
                image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAyiH7NU_hdLoBOZaQVRjhTzhiCngydMXGlHjcweiK2DJoFP59MaE3TSF--1_VgXODXibT9UiXVWhpScRsJhs0ZahekUth6vMuBByMdevChXlacqrjXBS2tzYH9lMeQAi1YGtinZSKzWOQUh3Rhy4DQZVmOcITRFR6HUtoPnuI428f1Kur-JFtSbMID3DfMRecESTb2sJVAfmh_IHlRe1F_-ueC2SG1AmvEzyCdKF_PDJ4QCtzAgfE6IchLsEAcZBNuOrwFsU2tz-OY',
                showExtend: false,
              },
              {
                title: 'Porsche 911 Carrera (Owned)',
                start: 'Purchased on March 22, 2024',
                end: '',
                remaining: '',
                progress: 0,
                image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUFZvSUTa9pe6M5SH4yEfgKbiMnPecMo6rwHwjRUU5KtKT6yk8b6dfCJFNGAKp84vRkcG_-6ZnkNSGgy_zKVtd65hdDA7BTm_6dyd_FpQJ6huAg88s_tihzTK738IfoFhRQ4iZjNKbKag7PQDXTgNTanaUxNbN_JngYHgu3wtcWavD0jGWDdEhr0ToNWJqwCxLRgqS2x3a3IWh93kI08gGTIdIo0PLOADLXWG0pHDcPrIYT1oW52wQkwcSGAud5Bljz4YchV4lTmvf',
                showExtend: false,
              },
            ].map((service, index) => (
              <div key={index} className="service-card">
                <div
                  className="service-image"
                  style={{ backgroundImage: `url("${service.image}")` }}
                ></div>
                <div className="service-content">
                  <p className="service-title">{service.title}</p>
                  <div>
                    <p className="service-info">Start Date: {service.start}</p>
                    {service.end && (
                      <p className="service-info">End Date: {service.end}</p>
                    )}
                  </div>
                  {service.remaining && (
                    <div>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          fontSize: '0.875rem',
                          marginBottom: '0.5rem',
                        }}
                      >
                        <span>Time Remaining</span>
                        <span style={{ fontWeight: 600, color: 'var(--text-light)' }}>
                          {service.remaining}
                        </span>
                      </div>
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{ width: `${service.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  <div className="service-buttons">
                    {service.showExtend && <button className="btn-secondary">Extend</button>}
                    <button className="btn-primary">
                      {service.title.includes('Owned') ? 'View Documents' : 'Manage'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 700, marginBottom: '1rem' }}>
            Quick Actions
          </h2>
          <div className="quick-actions">
            <button className="action-btn">
              <span className="action-icon material-symbols-outlined">apartment</span>
              <span>Book an Apartment</span>
            </button>
            <button className="action-btn">
              <span className="action-icon material-symbols-outlined">directions_car</span>
              <span>Rent a Car</span>
            </button>
            <button className="action-btn" style={{ gridColumn: 'span 2' }}>
              <span className="action-icon material-symbols-outlined">sell</span>
              <span>Browse Cars for Sale</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
