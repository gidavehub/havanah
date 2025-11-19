'use client';

export default function ExplorePage() {
  return (
    <div className="page-container active explore-wrapper">
      <style jsx>{`
        .explore-wrapper {
          position: relative;
          min-height: 100vh;
          width: 100%;
          display: flex;
        }

        .aurora-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: -10;
        }

        .aurora-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(150px);
          animation: pulse 4s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }

        .aurora-orb:nth-child(1) {
          top: -25%;
          left: -25%;
          width: 50%;
          height: 50%;
          background: rgba(137, 207, 240, 0.2);
        }

        .aurora-orb:nth-child(2) {
          bottom: -25%;
          right: -25%;
          width: 50%;
          height: 50%;
          background: rgba(200, 150, 255, 0.2);
          animation-delay: 2s;
        }

        .sidebar {
          position: fixed;
          top: 80px;
          left: 0;
          height: calc(100vh - 80px);
          padding: 1rem;
          z-index: 20;
        }

        .sidebar-content {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 100%;
          background: rgba(255, 255, 255, 0.4);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.5);
          border-radius: 1rem;
          width: 16rem;
          padding: 1rem;
          box-shadow: 0 10px 30px -15px rgba(0, 0, 0, 0.1);
        }

        .dark-mode .sidebar-content {
          background: rgba(16, 28, 34, 0.2);
          border-color: rgba(255, 255, 255, 0.1);
        }

        .sidebar-header {
          display: flex;
          gap: 0.75rem;
          padding: 0.5rem;
        }

        .sidebar-avatar {
          width: 3rem;
          height: 3rem;
          border-radius: 50%;
          background-size: cover;
          background-position: center;
          box-shadow: inset 0 1px 2px 0 rgba(0, 0, 0, 0.1);
        }

        .sidebar-title h1 {
          font-size: 1rem;
          font-weight: 700;
          color: var(--text-light);
        }

        .dark-mode .sidebar-title h1 {
          color: var(--text-dark);
        }

        .sidebar-title p {
          font-size: 0.875rem;
          color: var(--text-muted-light);
        }

        .dark-mode .sidebar-title p {
          color: var(--text-muted-dark);
        }

        .nav-links {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .nav-links a {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.625rem 0.75rem;
          border-radius: 9999px;
          text-decoration: none;
          color: var(--text-light);
          transition: all 0.3s;
          font-size: 0.875rem;
        }

        .dark-mode .nav-links a {
          color: var(--text-dark);
        }

        .nav-links a:hover {
          background: rgba(43, 173, 238, 0.2);
          color: var(--primary);
        }

        .nav-links a.active {
          background: rgba(43, 173, 238, 0.3);
          color: var(--primary);
          font-weight: 600;
        }

        .dark-mode .nav-links a.active {
          background: rgba(43, 173, 238, 0.5);
        }

        .sidebar-cta {
          padding: 1rem;
          background: rgba(43, 173, 238, 0.1);
          border-radius: 0.5rem;
          text-align: center;
        }

        .sidebar-cta h3 {
          font-weight: 700;
          font-size: 0.875rem;
          color: var(--text-light);
          margin-bottom: 0.5rem;
        }

        .dark-mode .sidebar-cta h3 {
          color: var(--text-dark);
        }

        .sidebar-cta p {
          font-size: 0.75rem;
          color: var(--text-muted-light);
          margin-bottom: 0.75rem;
        }

        .dark-mode .sidebar-cta p {
          color: var(--text-muted-dark);
        }

        .sidebar-cta button {
          width: 100%;
          background: var(--primary);
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 700;
          cursor: pointer;
          transition: opacity 0.3s;
        }

        .sidebar-cta button:hover {
          opacity: 0.9;
        }

        .main-content {
          flex: 1;
          margin-left: 16rem;
          padding: 2rem 3rem;
        }

        .page-heading {
          margin-bottom: 1.5rem;
        }

        .page-heading h2 {
          font-size: 2rem;
          font-weight: 900;
          letter-spacing: -0.02em;
          color: var(--text-light);
          margin-bottom: 0.5rem;
        }

        .dark-mode .page-heading h2 {
          color: var(--text-dark);
        }

        .page-heading p {
          font-size: 1rem;
          color: var(--text-muted-light);
        }

        .dark-mode .page-heading p {
          color: var(--text-muted-dark);
        }

        .search-filter-bar {
          position: sticky;
          top: 95px;
          z-index: 10;
          padding: 0.5rem;
          background: rgba(255, 255, 255, 0.4);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.5);
          border-radius: 1rem;
          box-shadow: 0 10px 30px -15px rgba(0, 0, 0, 0.1);
          margin-bottom: 2rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .dark-mode .search-filter-bar {
          background: rgba(16, 28, 34, 0.2);
          border-color: rgba(255, 255, 255, 0.1);
        }

        .search-input-wrapper {
          display: flex;
          align-items: stretch;
          flex-grow: 1;
          height: 3rem;
        }

        .search-input-wrapper label {
          display: flex;
          align-items: stretch;
          flex-grow: 1;
          width: 100%;
          height: 100%;
        }

        .search-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          padding-left: 1rem;
          color: var(--text-muted-light);
        }

        .dark-mode .search-icon {
          color: var(--text-muted-dark);
        }

        .search-input-wrapper input {
          flex: 1;
          border: none;
          background: transparent;
          color: var(--text-light);
          font-size: 1rem;
          padding: 0 0.5rem;
          outline: none;
        }

        .dark-mode .search-input-wrapper input {
          color: var(--text-dark);
        }

        .search-input-wrapper input::placeholder {
          color: var(--text-muted-light);
        }

        .dark-mode .search-input-wrapper input::placeholder {
          color: var(--text-muted-dark);
        }

        .filter-chips {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .filter-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          height: 2.5rem;
          padding: 0 1rem;
          border-radius: 9999px;
          background: rgba(0, 0, 0, 0.05);
          border: none;
          color: var(--text-light);
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .dark-mode .filter-btn {
          background: rgba(255, 255, 255, 0.05);
          color: var(--text-dark);
        }

        .filter-btn:hover {
          background: rgba(0, 0, 0, 0.1);
        }

        .dark-mode .filter-btn:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .apply-btn {
          height: 2.5rem;
          padding: 0 1.5rem;
          background: var(--primary);
          color: white;
          border: none;
          border-radius: 9999px;
          font-size: 0.875rem;
          font-weight: 700;
          cursor: pointer;
          transition: opacity 0.3s;
          margin-left: 0.5rem;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .apply-btn:hover {
          opacity: 0.9;
        }

        .listings-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .listing-card {
          display: flex;
          flex-direction: column;
          background: rgba(255, 255, 255, 0.4);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.5);
          border-radius: 0.5rem;
          box-shadow: 0 10px 30px -15px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          transition: all 0.3s;
        }

        .dark-mode .listing-card {
          background: rgba(16, 28, 34, 0.2);
          border-color: rgba(255, 255, 255, 0.1);
        }

        .listing-card:hover {
          box-shadow: 0 20px 40px -20px rgba(0, 0, 0, 0.2);
          transform: translateY(-4px);
        }

        .listing-image-wrapper {
          position: relative;
        }

        .listing-image {
          aspect-ratio: 16 / 9;
          width: 100%;
          background-size: cover;
          background-position: center;
        }

        .favorite-btn {
          position: absolute;
          top: 0.75rem;
          right: 0.75rem;
          background: rgba(255, 255, 255, 0.5);
          backdrop-filter: blur(10px);
          padding: 0.5rem;
          border-radius: 50%;
          border: none;
          cursor: pointer;
          color: var(--text-light);
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .dark-mode .favorite-btn {
          background: rgba(16, 28, 34, 0.3);
        }

        .favorite-btn:hover {
          color: #ef4444;
        }

        .dark-mode .favorite-btn:hover {
          color: #f87171;
        }

        .listing-content {
          padding: 1rem;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }

        .listing-title {
          font-weight: 700;
          font-size: 1.125rem;
          color: var(--text-light);
          margin-bottom: 0.25rem;
        }

        .dark-mode .listing-title {
          color: var(--text-dark);
        }

        .listing-subtitle {
          font-size: 0.875rem;
          color: var(--text-muted-light);
          margin-top: 0.25rem;
          margin-bottom: 0.5rem;
        }

        .dark-mode .listing-subtitle {
          color: var(--text-muted-dark);
        }

        .listing-price {
          color: var(--primary);
          font-weight: 700;
          font-size: 1.125rem;
          margin-top: 0.5rem;
          margin-bottom: 1rem;
        }

        .listing-btn {
          width: 100%;
          background: var(--primary);
          color: white;
          border: none;
          padding: 0.5rem;
          border-radius: 9999px;
          font-size: 0.875rem;
          font-weight: 700;
          cursor: pointer;
          opacity: 0;
          transition: opacity 0.3s;
        }

        .listing-card:hover .listing-btn {
          opacity: 1;
        }

        .listing-btn:hover {
          opacity: 0.9;
        }

        @media (max-width: 1400px) {
          .listings-grid {
            grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          }
        }

        @media (max-width: 1024px) {
          .listings-grid {
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          }
        }

        @media (max-width: 768px) {
          .main-content {
            margin-left: 0;
            padding: 1rem;
          }

          .sidebar {
            position: fixed;
            left: 0;
            top: 80px;
            width: 100%;
            height: auto;
            padding: 1rem;
            z-index: 10;
            border-radius: 1rem;
            margin: 1rem;
          }

          .sidebar-content {
            width: 100%;
            padding: 1rem;
            flex-direction: row;
          }

          .listings-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>

      <div className="aurora-background">
        <div className="aurora-orb"></div>
        <div className="aurora-orb"></div>
      </div>

      <aside className="sidebar">
        <div className="sidebar-content">
          <div>
            <div className="sidebar-header">
              <div
                className="sidebar-avatar"
                style={{
                  backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAK5WSJLY2617xP1aqGngPMmr_Nk9hX7oif4hgh0I1lHTSMzP3c7s5AZSdCfj8kbRvhxWsQRHiBhQUvfAPv5h8hgaMIw-NU-ecZwgZP8CwNd_AlpcuhsqeH3BIE0QYIehPWX_grWLDCVFWBsHJOoc0EK87JDqQx01j-9GjpCxqsOjs1eFY8wStpWJ6daymLhnM-uDaatu2dtOUR9_cM9sM-O1e5nz0m5dRQhV3tNSLG2Gg8NEXUwC_d0n0zR3oXHG2NsW5a8hiygqrn")',
                }}
              ></div>
              <div className="sidebar-title">
                <h1>Havanah</h1>
                <p>Rentals & Sales</p>
              </div>
            </div>

            <nav className="nav-links">
              <a href="#" className="active">
                <span className="material-symbols-outlined">home</span>
                <p>Home</p>
              </a>
              <a href="#">
                <span className="material-symbols-outlined fill">explore</span>
                <p>Explore</p>
              </a>
              <a href="#">
                <span className="material-symbols-outlined">favorite</span>
                <p>Wishlist</p>
              </a>
              <a href="#">
                <span className="material-symbols-outlined">mail</span>
                <p>Messages</p>
              </a>
              <a href="#">
                <span className="material-symbols-outlined">person</span>
                <p>Account</p>
              </a>
            </nav>
          </div>

          <div className="sidebar-cta">
            <h3>List your property</h3>
            <p>Earn money by renting your car or apartment.</p>
            <button>Get Started</button>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <div className="page-heading">
          <h2>Explore Havanah</h2>
          <p>Search apartments, cars, and more...</p>
        </div>

        <div className="search-filter-bar">
          <div className="search-input-wrapper">
            <label>
              <div className="search-icon">
                <span className="material-symbols-outlined">search</span>
              </div>
              <input
                type="text"
                placeholder="Search apartments, cars, and more..."
              />
            </label>
          </div>
          <div className="filter-chips">
            <button className="filter-btn">
              <p>Category</p>
              <span className="material-symbols-outlined">expand_more</span>
            </button>
            <button className="filter-btn">
              <p>Location</p>
              <span className="material-symbols-outlined">expand_more</span>
            </button>
            <button className="filter-btn">
              <p>Price</p>
              <span className="material-symbols-outlined">expand_more</span>
            </button>
            <button className="filter-btn">
              <p>Brand</p>
              <span className="material-symbols-outlined">expand_more</span>
            </button>
            <button className="apply-btn">Apply</button>
          </div>
        </div>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>
          Discover Today
        </h2>

        <div className="listings-grid">
          {[
            {
              title: 'Modern Loft in Downtown',
              subtitle: '2 Bed, 2 Bath',
              price: '$2,500/mo',
              image:
                'https://lh3.googleusercontent.com/aida-public/AB6AXuA1H5o65W5iBMpA-KLJ0YM-Itk5nHBO4muUL470x0teXm6APkgrqDPwl5_D7hPQN9EtyQD_tAO8bETU86vYI9B4wNF18ZxXjpNM6AJO0-1gEV3B2LSsH8cUA7Ld9WAhElO_81HUvi837PqYBzBoPQNos54hLV09Um4JZokJJ1AdwtfawkDyScE7GyVLN-qo6ANpXVzzwvwWYgdqPxka_jm6Wi0xl3WKljLkkZ9SwRowWyY2jlswGBfdXYHJC-1qV_-jei6iJ6zkhSDo',
            },
            {
              title: 'Chevrolet Camaro 2022',
              subtitle: '25,000 miles',
              price: '$42,000',
              image:
                'https://lh3.googleusercontent.com/aida-public/AB6AXuCR-meHUO6XHK3K2rk8xD6Z04FlO6qVPvQcNu8TOFSeKX-LMh6rddSZFj_q0zL-Rxek5rzfkJCR5w4zHUEHxMoBQMoj5y1TZu_V31jmhtfJaqtiBJ0NjUehl84Ksrz9OI2S2S3kipUjodWDHjSMkUIamCB_anlaJ7iaqYfON1uFvslZwZO9k5pb0Z-Zp9nN2SCEc6sEyUK6M7e0QKv0l1hwZd4DD0pXt1Z_nt0Vk74Rl4pR9JU3xsdAxaRN2kr3pcUzRYU34RdMldiy',
            },
            {
              title: 'Ferrari 488 Spider',
              subtitle: 'Daily Rental',
              price: '$1,200/day',
              image:
                'https://lh3.googleusercontent.com/aida-public/AB6AXuArg6G-axehohmaGMaPNLIkjn8-ePzBxrUqj1efEA8MMuAD0keAVDskSeHxkC9SYvN7CdxBSKhQFYaTJ76EasVRJJpVgR2uUUEEsKuEOPZZPmnKJbgx-nMO6yNcE2GigbEhlX6pV4fkzKcaYdiwl2Udcr84mBWlEcV1WfGeczUL8131CHch2cbwW5NoW63QHP4hcPo-wkpOVKJ6YPlv4oF7yXGvnoiZUbUnTM_pEGn5HNL88oZv_4tPvxEye2mfId-_Lneiy9dJu8Vt',
            },
            {
              title: 'Sunny Studio Apartment',
              subtitle: '1 Bed, 1 Bath',
              price: '$1,800/mo',
              image:
                'https://lh3.googleusercontent.com/aida-public/AB6AXuDtrXxANSAgkhLZaOREq0OTEVbVHBSMmGt8ZPaZTgyEQU--EcDYfZVeK0whFQMPumTBEDBrRkZSB3HyOKNfaA5b-cLtuwYPnKq4WKO2UhNZCFGXfrqjF2-d0o-gROCyz5bJsYXw1isnr6EOCerggAlBIHib3KmAbE2ItlCjpD1rFvAwYxvrHpspogfr5cHsHR_7_S0n8h77SquFv9ondalS0M5LvgtIm-McWDG8nYhT6Z8HT7BtP1FurBWGFWYYXfDrOlrQvhKEGfCI',
            },
            {
              title: 'Jeep Wrangler 2021',
              subtitle: '35,000 miles',
              price: '$38,500',
              image:
                'https://lh3.googleusercontent.com/aida-public/AB6AXuAwmQYeKsYEfr38q7zoWF2RZ2VXP3QaESPkeL7IWOXTgXteDLN-P-nRXf7JCxr7vbqm_VV847K2ASJ89kxlqvTVchkXZZx3Bi0EpzaXOCqs-yv3lK40yj04Mu-VtgbMEEeXkyTMyZ_S2-ymVJTbRMy6cp0xUmnqSPT9TjBqU_gZ38NzPKY6otXJoMcTFkqBemlM6EP29KEhpRM2UKYFu80l-Y5x4QTdVM5PzNapIuui5GoBnf_U2y-sdOgDCZtF7c_tkWPriYt-DcGx',
            },
            {
              title: 'Tesla Model 3',
              subtitle: 'Weekly Rental',
              price: '$500/week',
              image:
                'https://lh3.googleusercontent.com/aida-public/AB6AXuDUOv7bIYaYaxQ8u0rED3x9SmYdNG3LiWW59RWAVhjzfaVVnr5BzZ_Y0WDx6R8-EFnlPkOz71rhfxeTqeahwubUPG08Wly6dOK553QZ9gQYeXbSZ9f-vc2TMNtt3PUmp0n0uqJmcJxSWMUg1DPlFsRivGhjmLsWkR0zUVFCcP-y0w0RaUkW1ulux_kSf_xhTgVAEpCiSE0nolhsg91qFEvNkhE2ETuaRLcCqiPKaZK79j-ZysLsN5YG-rdAGjKCy3DC_86Hn54qiJtU',
            },
          ].map((item, index) => (
            <div key={index} className="listing-card">
              <div className="listing-image-wrapper">
                <div
                  className="listing-image"
                  style={{ backgroundImage: `url("${item.image}")` }}
                ></div>
                <button className="favorite-btn">
                  <span className="material-symbols-outlined">favorite</span>
                </button>
              </div>
              <div className="listing-content">
                <h3 className="listing-title">{item.title}</h3>
                <p className="listing-subtitle">{item.subtitle}</p>
                <p className="listing-price">{item.price}</p>
                <button className="listing-btn">View Details</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
