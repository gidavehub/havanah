'use client';

export default function ItemDetailsPage() {
  return (
    <div className="page-container active" style={{ marginTop: '80px', paddingBottom: '2rem' }}>
      <div style={{ padding: '0 1rem', maxWidth: '1280px', margin: '0 auto' }}>
        {/* Breadcrumbs */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2rem' }}>
          <a href="#" style={{ color: 'var(--text-muted-light)', fontSize: '0.875rem', fontWeight: 500, textDecoration: 'none' }}>
            Home
          </a>
          <span style={{ color: 'var(--text-muted-light)', fontSize: '0.875rem', fontWeight: 500 }}>/</span>
          <a href="#" style={{ color: 'var(--text-muted-light)', fontSize: '0.875rem', fontWeight: 500, textDecoration: 'none' }}>
            Apartments in Miami
          </a>
          <span style={{ color: 'var(--text-muted-light)', fontSize: '0.875rem', fontWeight: 500 }}>/</span>
          <span style={{ color: 'var(--text-light)', fontSize: '0.875rem', fontWeight: 500 }}>Sunny 2-Bedroom Loft</span>
        </div>

        {/* Main Content Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', marginBottom: '2rem' }}>
          {/* Left Column: Image Gallery */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div
              style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '4/3',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: '1rem',
                overflow: 'hidden',
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC42CUS_KHaeIIPoMB2RoclaT1JZ2YscIQ4ufHDMtPpv_tXCelLQlYkWP10jF_HcBNmlQtyuOtNX5YinmPdfo7sY7UrksngGn1g-JfQENOL3ETSsAdbMSHvADf00IvPbRVy8mO0L6jfEdDJhVPnDigIbCC2QFfC1MOQdj9KwSxhJNd1kZsrk5LLysm-UzDwHgvn6qKVv_oVqv09AfbohmT0XNYkCF94km_1RRSq5OBnmYwJc_5mLPtMDTljnADH-waq-e-QgeLk7M1R")',
              }}
            >
              <button
                style={{
                  position: 'absolute',
                  bottom: '1rem',
                  right: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  borderRadius: '9999px',
                  background: 'rgba(255, 255, 255, 0.4)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  cursor: 'pointer',
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>
                  photo_library
                </span>
                <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>View All Photos</span>
              </button>
            </div>

            {/* Carousel */}
            <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto' }}>
              {[
                'https://lh3.googleusercontent.com/aida-public/AB6AXuC7MsoOtbPBnOnNkNNNUXo_R5Fdw4kVT1n7ifXKMNp8oLciPQXpDA83Z2UzlYXx-LTvxfCQgBTTkU0Ozv8WZArB0b9440KpTxfZuG5pxsmTNn76D1gksupOo1N2ZXvVXEmps0du6ihuuFRchzcb89IEKM6Z0jAE7oolKFsaY5oNLEy4jVZ0-SsWKaTWS_CKbOLzcyiEUw1jVIsMrBGngv4chbZ1HAt06q0ikMMBBnmb8FAgoDRrU4kkd3eBIBscoEDpBX1QOTT7fOfL',
                'https://lh3.googleusercontent.com/aida-public/AB6AXuAOZZh-BEhoO_oqRpCUMyjsQpRCzC-RwFu1kl4Tm6NjQkEayhiSsuPiIhojtH-jm8wI8qubXEXZtrDDAn90vGWXzPzAPQtEKtLLUtYLolVLv_npwtkWk4QSC1QMZyKwTu8dYsMdxUpLLK-8obgaTLH5W8v7CRi_XqPYgB72VWoy-9a-61iMdnOxta31WA82UdTviEM-EPethjnN3Mwqe4A718uyjG-thKk6vz5JopSZd2iEsI5QreFQCre9EZVrBv3760eYLZhzG_hr',
                'https://lh3.googleusercontent.com/aida-public/AB6AXuDecmWla1W8XfYqqpaY7cGWbIzA7ja6NgBeuUrnUzJhY2g8azibBgIEevlfPe9E1N8eW5THWMPTHgW3JqJvUOApfHblqhB5vnQydqLnp8zbOqfCebJQMUcTbA7-WqjH9ycSC99f2uzQbl-TOxkYc2P8nN8xSz7tvHi3r2pKzzgOhNeUR51cRn8gqYqm3nioq768zlPjsBq0aEg7vZcGAsK_859tkm-Dd0W9GJ85RmniyWubz4ICjmLvaQC5EpJuv4VZEsQbHGoAJeAM',
                'https://lh3.googleusercontent.com/aida-public/AB6AXuCOl_VdlwyOq0QMx_x3JLCrcptrK5Y3HeDROu9BCqk2-VfAhAkA2cuTbrInyI422WTXAM-2SIWFv30u9G5zqPYDNfgC-4D6ww0x90_65LTha0iThYNTekhTRElr3Yh6SqV34Qb4N0htl5JQx0gS0gCmlZNtdCCWNqGCnUs1HvHajSQipXpdBHaWSt5qEbIxTSOMSUryIpq8a6vxpItNDumIrE4P2RmKNxjLdKBmYQSQExQMEMCQeXpV-OU4FkZWeaS7Shy3V5Rin7I-',
                'https://lh3.googleusercontent.com/aida-public/AB6AXuCmpPkeB5xjBuCj0vQwEVNiy3oT0xEVw5QtvA9BZ4YLg_iRiiXV_OZzOkcRAJ04Lt6kG7ntCX4PXxhmHIGzNTW0bWx8WN075Wl8eEgWoh7h7YZopwENY3vJeiGyPQdhK9VAeV9-CaonXeOY8AtlmTaozBJggq7s_0WRUbu8s4fStKSRQjrJWjsFaJfn57w27WkWX7ZWJI_dGJE94P9FUKBRo6cC2KKt7LbgvHN_BKPn6-RTuJGnfC9am9498btQtP5MGCZvF1ThhOtV',
              ].map((img, idx) => (
                <div
                  key={idx}
                  style={{
                    flex: '0 0 auto',
                    width: '120px',
                    height: '80px',
                    borderRadius: '0.5rem',
                    backgroundImage: `url("${img}")`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    border: idx === 0 ? '2px solid var(--primary)' : 'none',
                    opacity: idx === 0 ? 1 : 0.7,
                    cursor: 'pointer',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Right Column: Information */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Heading */}
            <div>
              <h1 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-light)', marginBottom: '0.5rem' }}>
                Sunny 2-Bedroom Loft
              </h1>
              <p style={{ color: 'var(--text-muted-light)', fontSize: '1rem' }}>Miami, Florida</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem' }}>
                <span className="material-symbols-outlined" style={{ color: '#eab308', fontSize: '1.125rem' }}>
                  star
                </span>
                <span style={{ fontWeight: 700 }}>4.8</span>
                <a href="#" style={{ color: 'var(--text-muted-light)', fontSize: '0.875rem', textDecoration: 'underline' }}>
                  (212 reviews)
                </a>
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--border-light)' }} />

            {/* Feature Icons */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
              {[
                { icon: 'bed', label: '2 Bedrooms' },
                { icon: 'bathtub', label: '2 Bathrooms' },
                { icon: 'wifi', label: 'Fast Wi-Fi' },
                { icon: 'ac_unit', label: 'Air Conditioning' },
              ].map((feature, idx) => (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', textAlign: 'center' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '56px',
                      height: '56px',
                      backgroundColor: 'rgba(72, 209, 204, 0.1)',
                      borderRadius: '50%',
                      color: 'var(--primary)',
                    }}
                  >
                    <span className="material-symbols-outlined">{feature.icon}</span>
                  </div>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{feature.label}</span>
                </div>
              ))}
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--border-light)' }} />

            {/* Description */}
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>About this space</h2>
              <p style={{ color: 'var(--text-muted-light)' }}>
                Experience Miami in style from this stunning 2-bedroom loft in the heart of the city. Featuring floor-to-ceiling windows, modern decor, and a private balcony with breathtaking views. Perfect for couples, small families, or business travelers looking for a luxurious and convenient stay.
              </p>
            </div>

            {/* Booking Card */}
            <div
              style={{
                padding: '1.5rem',
                borderRadius: '1rem',
                background: 'rgba(255, 255, 255, 0.4)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1.5rem' }}>
                <div>
                  <span style={{ fontSize: '1.875rem', fontWeight: 900, color: 'var(--text-light)' }}>$250</span>
                  <span style={{ color: 'var(--text-muted-light)' }}>/ night</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <span className="material-symbols-outlined" style={{ color: '#eab308', fontSize: '1rem' }}>
                    star
                  </span>
                  <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>4.8</span>
                  <span style={{ color: 'var(--text-muted-light)', fontSize: '0.875rem' }}>(212 reviews)</span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                    CHECK-IN
                  </label>
                  <input
                    type="date"
                    style={{
                      width: '100%',
                      padding: '0.625rem',
                      backgroundColor: 'rgba(255, 255, 255, 0.5)',
                      border: '1px solid var(--border-light)',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                    CHECK-OUT
                  </label>
                  <input
                    type="date"
                    style={{
                      width: '100%',
                      padding: '0.625rem',
                      backgroundColor: 'rgba(255, 255, 255, 0.5)',
                      border: '1px solid var(--border-light)',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                  GUESTS
                </label>
                <select
                  style={{
                    width: '100%',
                    padding: '0.625rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.5)',
                    border: '1px solid var(--border-light)',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                  }}
                >
                  <option>2 guests</option>
                  <option>3 guests</option>
                  <option>4 guests</option>
                </select>
              </div>

              <button
                style={{
                  width: '100%',
                  backgroundColor: 'var(--primary)',
                  color: 'white',
                  fontWeight: 700,
                  padding: '0.75rem 1rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Reserve Your Stay
              </button>
              <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted-light)', marginTop: '1rem' }}>
                You won't be charged yet
              </p>
            </div>

            {/* Host Information */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', border: '1px solid var(--border-light)', borderRadius: '0.5rem' }}>
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB680kcvrah-Sy2q9PGkAI4x5YKdV73HLDbhyEwNr3ce2254wYcHMXKX-a5HfANXkSvTadYMNA9mOlUhg23k9iy26kp9H4WD_0P9ahIkf5xQoXDKnMO1vPcOWefdsWssxnyN8KnbLdHmVOI8I0IFVx1VgtoZTy_mIh6ofq5r1X8DB-weURXGicUgG_AjX5h0ot4f_TCtQhY0z1T0-Tfn7sC54v6_JZM2nwHkTw1iO0DMXLWxkqeQkrIpIud876UHAl1-VqcuRsp0MMe"
                alt="Host avatar"
                style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <div>
                <p style={{ fontWeight: 700 }}>Hosted by Andrea</p>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted-light)' }}>Superhost · 5 years hosting</p>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid var(--border-light)' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Reviews</h2>
          <div style={{ display: 'flex', gap: '3rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <p style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--text-light)' }}>4.8</p>
              <div style={{ display: 'flex', gap: '0.125rem' }}>
                {[1, 2, 3, 4].map((i) => (
                  <span key={i} className="material-symbols-outlined" style={{ color: 'var(--text-light)', fontSize: '1.25rem' }}>
                    star
                  </span>
                ))}
                <span className="material-symbols-outlined" style={{ color: 'var(--text-light)', fontSize: '1.25rem', fontVariationSettings: "'FILL' 0" }}>
                  star
                </span>
              </div>
              <p style={{ color: 'var(--text-muted-light)', fontSize: '1rem' }}>Based on 212 reviews</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '20px 1fr 40px', alignItems: 'center', gap: '0.75rem', minWidth: '200px', maxWidth: '400px' }}>
              {[
                { star: 5, width: 85 },
                { star: 4, width: 10 },
                { star: 3, width: 3 },
                { star: 2, width: 1 },
                { star: 1, width: 1 },
              ].map((row, idx) => (
                <>
                  <p key={`star-${idx}`} style={{ fontSize: '0.875rem' }}>{row.star}</p>
                  <div key={`bar-${idx}`} style={{ display: 'flex', height: '0.5rem', borderRadius: '9999px', backgroundColor: 'var(--border-light)', overflow: 'hidden' }}>
                    <div style={{ borderRadius: '9999px', backgroundColor: 'var(--primary)', width: `${row.width}%` }}></div>
                  </div>
                  <p key={`pct-${idx}`} style={{ color: 'var(--text-muted-light)', fontSize: '0.875rem', textAlign: 'right' }}>
                    {row.width}%
                  </p>
                </>
              ))}
            </div>
          </div>
        </div>

        {/* Location Section */}
        <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid var(--border-light)' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Location</h2>
          <p style={{ color: 'var(--text-muted-light)', marginBottom: '1rem' }}>Miami, Florida</p>
          <div
            style={{
              aspectRatio: '2/1',
              width: '100%',
              borderRadius: '1rem',
              overflow: 'hidden',
              backgroundImage:
                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCjC4oTqGtGTDWkLbp2teoVpjZiJeTVZY_dBmdZJKEVolhicIbxTjBvRh5rCcnK1nv0ONzOPAUVRof8ENgX4JB-vPtGcYQ_KoG0fswUGbcXTNS_MA74vMYkF66vEigTzXWHK6Rzzx2gNn7373p-SjUt3_Y5MghGLAh1TwNKIi9X0pf2vDmth9z5GMvk4Gr_dchqQIOzf4Tfj0aYe8Y61IGqiysV484UyVTBsZlFchRWMPtlrXFHHkaYlgqqnCkcT3dnacLOEyBLakgc")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        </div>
      </div>
    </div>
  );
}
