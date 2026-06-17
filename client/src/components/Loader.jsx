import React from 'react'
import './Loader.css'

export default function Loader({ style }) {
  return (
    <div style={{ padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', ...style }}>
      <div className="loader-container">
        <div className="loader-plate">
          <div className="black">
            <div className="border">
              <div className="white">
                <div className="center" />
              </div>
            </div>
          </div>
        </div>
        <div className="loader-player">
          <div className="rect" />
          <div className="circ" />
        </div>
      </div>
      <div style={{ marginTop: '24px', fontSize: '14px', fontWeight: 600, color: 'var(--text-2)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
        Loading...
      </div>
    </div>
  )
}
