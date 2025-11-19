'use client';

export default function AgentDashboardPage() {
  return (
    <div className="page-container active agent-wrapper" style={{ marginTop: '80px' }}>
      <style jsx>{`
        .agent-wrapper {
          display: flex;
          min-height: 100vh;
        }

        .agent-sidebar {
          width: 16rem;
          padding: 1rem;
          background: white;
          border-right: 1px solid var(--border-light);
          flex-shrink: 0;
          position: fixed;
          height: calc(100vh - 80px);
          left: 0;
          top: 80px;
          overflow-y: auto;
        }

        .dark-mode .agent-sidebar {
          background: var(--background-dark);
          border-right-color: var(--border-dark);
        }

        .agent-main {
          flex: 1;
          margin-left: 16rem;
          padding: 2rem;
          overflow-y: auto;
        }

        .agent-nav-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.625rem 0.75rem;
          border-radius: 9999px;
          text-decoration: none;
          color: var(--text-muted-light);
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s;
          margin-bottom: 0.5rem;
        }

        .dark-mode .agent-nav-item {
          color: var(--text-muted-dark);
        }

        .agent-nav-item:hover {
          background: rgba(43, 173, 238, 0.1);
          color: var(--primary);
        }

        .agent-nav-item.active {
          background: rgba(43, 173, 238, 0.2);
          color: var(--primary);
          font-weight: 600;
        }

        .dark-mode .agent-nav-item.active {
          background: rgba(43, 173, 238, 0.3);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          padding: 1.5rem;
          background: white;
          border: 1px solid var(--border-light);
          border-radius: 0.5rem;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }

        .dark-mode .stat-card {
          background: rgba(26, 41, 51, 0.5);
          border-color: var(--border-dark);
        }

        .stat-label {
          color: var(--text-muted-light);
          font-size: 1rem;
          font-weight: 500;
          margin-bottom: 0.5rem;
        }

        .dark-mode .stat-label {
          color: var(--text-muted-dark);
        }

        .stat-value {
          font-size: 1.875rem;
          font-weight: 700;
          color: var(--text-light);
        }

        .dark-mode .stat-value {
          color: var(--text-dark);
        }

        .stat-change {
          font-size: 1rem;
          font-weight: 500;
          margin-left: 0.5rem;
        }

        .stat-change.positive {
          color: #22c55e;
        }

        .stat-change.negative {
          color: #ef4444;
        }

        .table-wrapper {
          background: white;
          border: 1px solid var(--border-light);
          border-radius: 0.5rem;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
          overflow: hidden;
          margin-bottom: 2rem;
        }

        .dark-mode .table-wrapper {
          background: rgba(26, 41, 51, 0.5);
          border-color: var(--border-dark);
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        thead {
          background: rgba(0, 0, 0, 0.02);
        }

        .dark-mode thead {
          background: rgba(0, 0, 0, 0.2);
        }

        th {
          padding: 1rem;
          text-align: left;
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-muted-light);
          border: none;
        }

        .dark-mode th {
          color: var(--text-muted-dark);
        }

        td {
          padding: 1rem;
          border-top: 1px solid var(--border-light);
          color: var(--text-light);
        }

        .dark-mode td {
          border-top-color: var(--border-dark);
          color: var(--text-dark);
        }

        .table-image {
          width: 5rem;
          height: 3.5rem;
          border-radius: 0.375rem;
          background-size: cover;
          background-position: center;
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
      `}</style>

      <aside className="agent-sidebar">
        <div
          style={{
            backgroundImage:
              'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCXKLq2DA1OVKTn8_CZKhu0qz_JF4SVmTDg4YQNuH3zSHYkOW6bbcFglAgeVOC7qiwd0gI-LsnLT0F8GRYiZ-21tCB4sN5Xg5xwz9owMZRBzyRzK0gavxxGVuNeuTC8-z5p30hdkcRoqiyAFfybadS5X690WgL0BgGvZol0sEa2GhRLbtgyxfMAirdRtrEIRD65cz71tXxWRa5VlENRaTb17rddl2OPHDCR3BWvfCdePz-UYY2zqhbXSVwLt6khjcqvXsiq6LlFeQuK")',
            width: '2.5rem',
            height: '2.5rem',
            borderRadius: '50%',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            marginBottom: '0.75rem',
          }}
        ></div>
        <h1 style={{ fontSize: '1rem', fontWeight: 600 }}>Havanah</h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted-light)', marginBottom: '1.5rem' }}>
          Agent Dashboard
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '2rem' }}>
          <a href="#" className="agent-nav-item active">
            <span className="material-symbols-outlined">grid_view</span>
            <p>Dashboard</p>
          </a>
          <a href="#" className="agent-nav-item">
            <span className="material-symbols-outlined">list</span>
            <p>Listings</p>
          </a>
          <a href="#" className="agent-nav-item">
            <span className="material-symbols-outlined">redeem</span>
            <p>Offers</p>
          </a>
          <a href="#" className="agent-nav-item">
            <span className="material-symbols-outlined">credit_card</span>
            <p>Payments</p>
          </a>
          <a href="#" className="agent-nav-item">
            <span className="material-symbols-outlined">person</span>
            <p>Profile</p>
          </a>
        </div>

        <button style={{ background: 'var(--primary)', color: 'white', padding: '0.625rem 1rem', border: 'none', borderRadius: '9999px', width: '100%', marginBottom: '1rem', cursor: 'pointer' }}>
          Add New Listing
        </button>

        <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1rem' }}>
          <a href="#" className="agent-nav-item">
            <span className="material-symbols-outlined">settings</span>
            <p>Settings</p>
          </a>
          <a href="#" className="agent-nav-item">
            <span className="material-symbols-outlined">logout</span>
            <p>Logout</p>
          </a>
        </div>
      </aside>

      <main className="agent-main">
        <h1 className="dashboard-title">Welcome back, Havanah!</h1>
        <p className="dashboard-subtitle">Here's an overview of your business activities.</p>

        <div className="stats-grid" style={{ marginBottom: '2rem', marginTop: '2rem' }}>
          <div className="stat-card">
            <p className="stat-label">Active Listings</p>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem' }}>
              <p className="stat-value">12</p>
              <p className="stat-change positive">+2%</p>
            </div>
          </div>
          <div className="stat-card">
            <p className="stat-label">Pending Offers</p>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem' }}>
              <p className="stat-value">5</p>
              <p className="stat-change negative">-5%</p>
            </div>
          </div>
          <div className="stat-card">
            <p className="stat-label">Total Earnings</p>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem' }}>
              <p className="stat-value">$24,500</p>
              <p className="stat-change positive">+10%</p>
            </div>
          </div>
        </div>

        <h2 style={{ fontSize: '1.375rem', fontWeight: 700, marginBottom: '1rem' }}>
          My Listings
        </h2>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Listing</th>
                <th>Type</th>
                <th>Status</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Bright Downtown Loft', location: 'New York, NY', type: 'Apartment', status: 'Active', price: '$3,200/mo', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCLBC-DqIGonJKa19GKw6tULRYS5NIbPQZgbMEC14li30pSQdbTPT68bToRLLCkfscPq8AIjyndcFnJu5RqMHq7yqj-xdcht-ajJ3sI2JBB5JYKj7PzQ7UopKAISfRRdKXXbsajXf8IovZods8aRcxYfdYh4pSZ4JODaSGEXjBD4_WUZLFo5BcD5tFupQxhBi08k1nDbnKyjpRgkpRcB1J5QXzl9UPZ_-hghmOIjsYsbSgu_Txa3Hjor5Qav-mOUJkj1xn-MPzf2TPB' },
                { name: 'Tesla Model 3', location: '2022', type: 'Car Sale', status: 'Pending', price: '$45,000', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC2OgjitqA9-IX9IWejp4DXqMfx6uWstKAeTTO51azH9OWaXu8aT4iAKO92dYRdJ1uW7hc4zErLk1uOxoVo5zRgWdKgmcF6Cy-xFIhL5uMxjWhxSBHegOUVdaPelRS_zlK-zBmNiegvJNBm2aqTW9zDwfNitNtx6OFdb0gFH-mMmVGkT_GQLY6WkggynQXNrGN_GHZrZoHD9OGUnMQ-nEwav17laZ7aAP8ynA_waPNtvY3mAHJgLbNzCxlIgfTX496pHcz3zFPgYTKk' },
                { name: 'Ford Mustang Convertible', location: '2023', type: 'Car Rental', status: 'Active', price: '$150/day', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBPZowJSNo83QbwHctChDa8c5ILh7uqG88wdyxz2tosTzvH_NYkScx_i8SHCpp4PNwgbo4txmk-h4qUF0LYUIgzow8Zz0xMZBPrccak85n562p1xFGRHeFKFOXJmhWw7M8jyB69JQWU0z8YQ1uL1zQJycxkINpg3dY1fMWA7Zb47VhqBBbSUw7ktMcHNG1al-qO8pwB-rmu-q4dY-R9e7K8LA3P9AdqED0DUH0WPEX2Yxf0WHDCIyBL2wHmX0OFKxxg_9fFOHF2JGCR' },
              ].map((item, index) => (
                <tr key={index}>
                  <td>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <div
                        className="table-image"
                        style={{ backgroundImage: `url("${item.image}")` }}
                      ></div>
                      <div>
                        <p style={{ fontWeight: 600 }}>{item.name}</p>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted-light)' }}>
                          {item.location}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontSize: '0.875rem' }}>{item.type}</td>
                  <td>
                    <span
                      style={{
                        display: 'inline-flex',
                        padding: '0.3rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        backgroundColor: item.status === 'Active' ? '#dcfce7' : '#fef3c7',
                        color: item.status === 'Active' ? '#166534' : '#92400e',
                      }}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td style={{ fontWeight: 500 }}>{item.price}</td>
                  <td>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                      <span className="material-symbols-outlined">more_horiz</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
