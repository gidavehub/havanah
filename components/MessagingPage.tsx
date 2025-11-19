'use client';

export default function MessagingPage() {
  return (
    <div className="page-container active messaging-container">
      <style jsx>{`
        .messaging-container {
          display: flex;
          height: calc(100vh - 80px);
          gap: 1.5rem;
          padding: 1rem;
          background: var(--background-light);
        }

        .dark-mode .messaging-container {
          background: var(--background-dark);
        }

        .messaging-sidebar {
          width: 4rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          background: var(--content-light);
          border-radius: 0.5rem;
          padding: 1.5rem 0;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }

        .dark-mode .messaging-sidebar {
          background: var(--content-dark);
        }

        .messaging-icon {
          font-size: 2rem;
          color: var(--primary);
          margin-bottom: 1.5rem;
        }

        .messaging-nav {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          flex: 1;
        }

        .messaging-nav-btn {
          padding: 0.75rem;
          border: none;
          background: transparent;
          border-radius: 50%;
          cursor: pointer;
          color: var(--text-muted-light);
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .dark-mode .messaging-nav-btn {
          color: var(--text-muted-dark);
        }

        .messaging-nav-btn:hover {
          background: rgba(43, 173, 238, 0.1);
          color: var(--primary);
        }

        .messaging-nav-btn.active {
          background: rgba(43, 173, 238, 0.1);
          color: var(--primary);
        }

        .conversations-list {
          width: 22rem;
          display: flex;
          flex-direction: column;
          background: var(--content-light);
          border-radius: 0.5rem;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
          overflow: hidden;
        }

        .dark-mode .conversations-list {
          background: var(--content-dark);
        }

        .conversations-header {
          padding: 1rem;
          border-bottom: 1px solid var(--border-light);
        }

        .dark-mode .conversations-header {
          border-bottom-color: var(--border-dark);
        }

        .conversations-header h1 {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-light);
          margin-bottom: 1rem;
        }

        .dark-mode .conversations-header h1 {
          color: var(--text-dark);
        }

        .search-box {
          display: flex;
          align-items: center;
          background: var(--background-light);
          border-radius: 9999px;
          padding: 0 1rem;
        }

        .dark-mode .search-box {
          background: var(--background-dark);
        }

        .search-box input {
          flex: 1;
          border: none;
          background: transparent;
          color: var(--text-light);
          padding: 0.75rem;
          font-family: 'Manrope', sans-serif;
        }

        .dark-mode .search-box input {
          color: var(--text-dark);
        }

        .search-box input::placeholder {
          color: var(--text-muted-light);
        }

        .dark-mode .search-box input::placeholder {
          color: var(--text-muted-dark);
        }

        .conversations-scroll {
          flex: 1;
          overflow-y: auto;
        }

        .conversation-item {
          display: flex;
          gap: 1rem;
          padding: 0.75rem;
          cursor: pointer;
          transition: all 0.3s;
          border-left: 4px solid transparent;
          padding-left: 1rem;
        }

        .conversation-item:hover {
          background: rgba(43, 173, 238, 0.05);
        }

        .dark-mode .conversation-item:hover {
          background: rgba(43, 173, 238, 0.1);
        }

        .conversation-item.active {
          background: rgba(43, 173, 238, 0.1);
          border-left-color: var(--primary);
        }

        .dark-mode .conversation-item.active {
          background: rgba(43, 173, 238, 0.2);
        }

        .conversation-avatar {
          width: 3.5rem;
          height: 3.5rem;
          border-radius: 50%;
          background-size: cover;
          background-position: center;
          position: relative;
          flex-shrink: 0;
        }

        .online-indicator {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 1rem;
          height: 1rem;
          background: #22c55e;
          border-radius: 50%;
          border: 2px solid var(--content-light);
        }

        .dark-mode .online-indicator {
          border-color: var(--content-dark);
        }

        .conversation-name {
          font-weight: 600;
          color: var(--text-light);
          font-size: 1rem;
          margin-bottom: 0.25rem;
        }

        .dark-mode .conversation-name {
          color: var(--text-dark);
        }

        .conversation-preview {
          font-size: 0.875rem;
          color: var(--text-muted-light);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .dark-mode .conversation-preview {
          color: var(--text-muted-dark);
        }

        .conversation-time {
          text-align: right;
          color: var(--text-muted-light);
          font-size: 0.75rem;
        }

        .dark-mode .conversation-time {
          color: var(--text-muted-dark);
        }

        .conversation-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 1.5rem;
          height: 1.5rem;
          background: var(--primary);
          color: white;
          border-radius: 50%;
          font-size: 0.75rem;
          font-weight: 700;
          margin-top: auto;
        }

        .chat-window {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: var(--content-light);
          border-radius: 0.5rem;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
          overflow: hidden;
        }

        .dark-mode .chat-window {
          background: var(--content-dark);
        }

        .chat-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem;
          border-bottom: 1px solid var(--border-light);
        }

        .dark-mode .chat-header {
          border-bottom-color: var(--border-dark);
        }

        .chat-header-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .chat-header-avatar {
          width: 3rem;
          height: 3rem;
          border-radius: 50%;
          background-size: cover;
          background-position: center;
          position: relative;
        }

        .online-status {
          font-size: 0.875rem;
          color: #22c55e;
          font-weight: 500;
        }

        .chat-header h2 {
          font-weight: 700;
          color: var(--text-light);
          font-size: 1.125rem;
        }

        .dark-mode .chat-header h2 {
          color: var(--text-dark);
        }

        .view-listing-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: rgba(43, 173, 238, 0.1);
          color: var(--primary);
          border: none;
          border-radius: 9999px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .view-listing-btn:hover {
          background: rgba(43, 173, 238, 0.2);
        }

        .messages {
          flex: 1;
          overflow-y: auto;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .date-separator {
          text-align: center;
          font-size: 0.75rem;
          color: var(--text-muted-light);
        }

        .dark-mode .date-separator {
          color: var(--text-muted-dark);
        }

        .message {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
        }

        .message.user {
          flex-direction: row-reverse;
        }

        .message-avatar {
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 50%;
          background-size: cover;
          background-position: center;
          flex-shrink: 0;
        }

        .message-content {
          display: flex;
          flex-direction: column;
          gap: 0.375rem;
        }

        .message.user .message-content {
          align-items: flex-end;
        }

        .message-bubble {
          padding: 1rem;
          border-radius: 0.5rem;
          max-width: 28rem;
          word-wrap: break-word;
        }

        .message.agent .message-bubble {
          background: var(--background-light);
          border-radius: 0 0.5rem 0.5rem 0.5rem;
          color: var(--text-light);
        }

        .dark-mode .message.agent .message-bubble {
          background: var(--background-dark);
          color: var(--text-dark);
        }

        .message.user .message-bubble {
          background: var(--user-bubble-light);
          border-radius: 0.5rem 0 0.5rem 0.5rem;
          color: var(--text-light);
        }

        .dark-mode .message.user .message-bubble {
          background: var(--user-bubble-dark);
        }

        .message-time {
          font-size: 0.75rem;
          color: var(--text-muted-light);
        }

        .dark-mode .message-time {
          color: var(--text-muted-dark);
        }

        .message-status {
          display: inline-flex;
          align-items: center;
          margin-left: 0.25rem;
          color: var(--primary);
        }

        .message-input-area {
          position: relative;
          padding: 1rem;
          background: var(--content-light);
          border-top: 1px solid var(--border-light);
        }

        .dark-mode .message-input-area {
          background: var(--content-dark);
          border-top-color: var(--border-dark);
        }

        .liquid-glass {
          background: rgba(255, 255, 255, 0.5);
          backdrop-filter: blur(12px);
          box-shadow: inset 0 1px 1px 0 rgba(255, 255, 255, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 0.5rem;
        }

        .dark-mode .liquid-glass {
          background: rgba(255, 255, 255, 0.05);
          box-shadow: inset 0 1px 1px 0 rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.1);
        }

        .message-input-wrapper {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .message-input-wrapper input {
          flex: 1;
          background: transparent;
          border: none;
          color: var(--text-light);
          font-family: 'Manrope', sans-serif;
          padding: 0.75rem;
          outline: none;
          font-size: 1rem;
        }

        .dark-mode .message-input-wrapper input {
          color: var(--text-dark);
        }

        .message-input-wrapper input::placeholder {
          color: var(--text-muted-light);
        }

        .dark-mode .message-input-wrapper input::placeholder {
          color: var(--text-muted-dark);
        }

        .message-action-btn {
          padding: 0.5rem;
          border: none;
          background: transparent;
          border-radius: 50%;
          cursor: pointer;
          color: var(--text-muted-light);
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .dark-mode .message-action-btn {
          color: var(--text-muted-dark);
        }

        .message-action-btn:hover {
          background: rgba(43, 173, 238, 0.1);
          color: var(--primary);
        }

        .message-send-btn {
          padding: 0.75rem;
          background: var(--primary);
          color: white;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-left: 0.5rem;
        }

        .message-send-btn:hover {
          opacity: 0.9;
        }
      `}</style>

      <aside className="messaging-sidebar">
        <span className="material-symbols-outlined messaging-icon">sailing</span>
        <nav className="messaging-nav">
          <button className="messaging-nav-btn active">
            <span className="material-symbols-outlined">grid_view</span>
          </button>
          <button className="messaging-nav-btn">
            <span className="material-symbols-outlined">chat</span>
          </button>
          <button className="messaging-nav-btn">
            <span className="material-symbols-outlined">calendar_month</span>
          </button>
          <button className="messaging-nav-btn">
            <span className="material-symbols-outlined">favorite</span>
          </button>
        </nav>
        <button className="messaging-nav-btn">
          <span className="material-symbols-outlined">settings</span>
        </button>
      </aside>

      <section className="conversations-list">
        <div className="conversations-header">
          <h1>Messages</h1>
          <div className="search-box">
            <span className="material-symbols-outlined">search</span>
            <input type="text" placeholder="Search messages" />
          </div>
        </div>

        <div className="conversations-scroll">
          {[
            {
              name: 'Maria Rodriguez',
              preview: 'Re: Downtown Loft Apt',
              message: 'Yes, it\'s available for a tour...',
              time: '10:30 AM',
              badge: 2,
              online: true,
              active: true,
              image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB8x-N4SQMGakKfTOZq_lJb8gveK7pH3Wv8Phw47R34z_SsqmDOsEakg8oI_uZZYpUPGcICGYyIdr7bzRIF4GEIzo_eO1OmlS2t26JeVE7addvs81snYVfwFVoiYjQsuI-T-vmiNgD7kGJLN30NdL0LqmONEFI3LX_egx-m80nGyfKn6pLnvOS1KQH0ZnhRu93InMV2Z8uFNl5iyJOBIt2hDVX_FaRRvVQ-6uCi7pH6O03NopMUmjf5M4rdc7Qee-xnxASO2D7OLgAd',
            },
            {
              name: 'David Chen',
              preview: 'Re: 2022 Honda Civic',
              message: 'Let\'s schedule a test drive.',
              time: '2:45 PM',
              badge: 0,
              online: false,
              active: false,
              image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAB_vG8cGkUPrBq8WVAFv4tyJNSFNIxNbnsMy3UHrnPMz5SMVnE522XXG-jVyXBigT7a5H4pATwjMKzu8bVATrQWdjsgzg8CYBxhrSQ9YJU7xjYpsWM45Knm1z9iCFkFixBJWXo1opag4HH36Z9FyDBfJnkAWQQGSuw0SVqIJUGaSAg3Fwh0utgGM5MblxkcEo3MMd3RyA3Dw1gkYeK6CLuFdcLkRmrfbuatk9WcZvG6eTdOmO8KrGIHeSeuEvgNrtoMItzlQspxO3T',
            },
            {
              name: 'Sarah Jenkins',
              preview: 'Re: Luxury Beachfront Villa',
              message: 'Great! I\'ll prepare the paperwork.',
              time: 'Yesterday',
              badge: 0,
              online: false,
              active: false,
              image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAYv_3H08k036vT59K59q9cUdG72d09gyV0wUbSdeXqSJRS6NxjAQuM_Ep0pxfV6PD8UeInh7qMKYTsQTWkDs41ZJLtywzkLaH3E1YYHDGMyqzv43KmIxYDt6j_SuCihF63YzG6adZ24ahHE08iH1ZIpzUeXKUPRkNRTvz45QkpFYa9cRfS2byEouoejL_M8pHd6orv-zQ8MZupETKNKzGMc3NgJYzNsIxXcuZS85ukii8ZStnnhhtkspXP4i221CioUUO_ypY6CByD',
            },
          ].map((conv, index) => (
            <div
              key={index}
              className={`conversation-item ${conv.active ? 'active' : ''}`}
            >
              <div className="conversation-avatar" style={{ backgroundImage: `url("${conv.image}")` }}>
                {conv.online && <div className="online-indicator"></div>}
              </div>
              <div style={{ flex: 1 }}>
                <p className="conversation-name">{conv.name}</p>
                <p className="conversation-preview">{conv.message}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p className="conversation-time">{conv.time}</p>
                {conv.badge > 0 && (
                  <div className="conversation-badge">{conv.badge}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <main className="chat-window">
        <header className="chat-header">
          <div className="chat-header-info">
            <div
              className="chat-header-avatar"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD4zCfjjLPspX5b9fMs1f0CbiKUceJyNqrj13W9HwwU2OUH3CBUoriZf8R7SeULqMAHwxE0uF7EEtEbGTrr12YE-Z7TaOGXBQkfa9NAcdJhj2agXxREOzoekpWQTZDz78od41eIS5Su-MhBJ4-sscREA7uGQvPoToEoRtYaZsKOmTJyXqdhVB4Fns_WryeCPK72FoxANCZArlpwxa8hH7x5e49waEyhlpo4rZfhxrmMSER7_-WHIFIWWjW3I81tRwsED9Ubv0d5fDmY")',
              }}
            ></div>
            <div>
              <h2>Maria Rodriguez</h2>
              <p className="online-status">Online</p>
            </div>
          </div>
          <button className="view-listing-btn">
            <span className="material-symbols-outlined">apartment</span>
            View Listing
          </button>
        </header>

        <div className="messages">
          <div className="date-separator">Today</div>

          {[
            {
              type: 'agent',
              text: 'Hi John! I saw you were interested in the Downtown Loft. Do you have any questions about the property?',
              time: '10:28 AM',
              image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDMKe4GwHTxwKa5iBz8cT6MvjIvZEXBH80791-lr24A0K02U8wfzbJLwAV9ljj2eDweQtyNCEF2y01Dh4pokjRtOVBlyGZE-ZlzqfUR42NwfVDiAOfXsYAmVSlSVmgeaPFmaZJ7hjSbrxUCDsp7XT2LSTDx10atRwfLxYARGnR-uPpu4o-YfXJtcWlzFLHD6W0NIBTjNyjxqe7oqkh9BF7xbz_l8y10QVtDgEh3l85s4g_8nGuRKXA3Pr11HK1No62kRiEN6fdgYUNu',
            },
            {
              type: 'user',
              text: 'Hello Maria, thanks for reaching out. I was wondering if it\'s available for a tour this weekend?',
              time: '10:29 AM',
              image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDVV4GW-ZaSEmciZJ4ZEo6bzo4UUzW-j-JilR6y8RZNFlqf3n795Er1Drw8puggZS40T8PA6GDBq4ZJVJhzEeqYdeoBAQW4cVOH8TgRhWd3ZyCc7-mHdR6EGv8A2hKqHhe-M52DbxFT_YTqgiSbKGjCJGnAPBw-UgFH4QUJcI8ae4cPLEl-WVBrmIsBSqxQ4Hb6CEQDHdlougzn0bdJ5IB1etSCOHW73liZClKUlmIOMloVXojw8Zrrt5IeyNAG8KTwV7yryT3RANDA',
            },
            {
              type: 'agent',
              text: 'Yes, it\'s available for a tour this Saturday. I have slots open at 11 AM and 2 PM. Which one works best for you?',
              time: '10:30 AM',
              image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBRZibidGp3MiYw9RNT30wXbFAsNSTl-oTlZarICHY9ByqiGz-OxY4YhB2RRAcbKRfczdD5iho6KJct5unVN8LWmfebnjlsJzwMc7Qv5PHe1BoszW0klTlnZcbXmoKMzQhF8tFNMeXtZcRRbSnPgAEmeoEjTlNe29aAOqb4epiEikEsJm80G2pxAdcBcE-t5SL-8JsrbIRMFVLpRaAbZyU1ZcQsYl7k97nE_Da9KHBjudBa9dCMYxEZubaX2slGdW2O8ZxLD3vnDuRv',
            },
          ].map((msg, index) => (
            <div key={index} className={`message ${msg.type}`}>
              <div
                className="message-avatar"
                style={{ backgroundImage: `url("${msg.image}")` }}
              ></div>
              <div className="message-content">
                <div className="message-bubble">
                  <p>{msg.text}</p>
                </div>
                <div className="message-time">
                  {msg.time}
                  {msg.type === 'user' && (
                    <span className="message-status material-symbols-outlined">done_all</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <footer className="message-input-area">
          <div className="liquid-glass">
            <div className="message-input-wrapper">
              <input type="text" placeholder="Type your message here..." />
              <button className="message-action-btn">
                <span className="material-symbols-outlined">add_photo_alternate</span>
              </button>
              <button className="message-action-btn">
                <span className="material-symbols-outlined">attach_file</span>
              </button>
              <button className="message-send-btn">
                <span className="material-symbols-outlined">send</span>
              </button>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
