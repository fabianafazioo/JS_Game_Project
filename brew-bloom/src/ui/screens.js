export function menuScreen(){
  return `
    <main class="screen" id="screenMenu">
      <div class="menu-wrap">
        <div class="brand">
          <div class="bloom">❀</div>
          <h1>Brew & Bloom</h1>
          <div class="bloom">❀</div>
        </div>
        <p class="subtitle muted">A Cozy Café Time Management Game</p>

        <div class="menu-icon">☕</div>

        <button class="btn btn-primary btn-xl" id="btnPlay">▶ Play</button>

        <div class="menu-row">
          <button class="btn btn-secondary" id="btnShop">Shop</button>
          <button class="btn btn-secondary" id="btnSettings">Settings</button>
          <button class="btn btn-secondary" id="btnCredits">Credits</button>
          <button class="btn btn-secondary" id="btnUIKit">UI Kit</button>
        </div>
      </div>
    </main>
  `;
}

export function gameScreen(){
  return `
    <header class="topbar hidden" id="topbar">
      <button class="icon-btn" id="btnBack" aria-label="Back">←</button>

      <div class="topbar-left">
        <div class="muted">Day <span id="dayNum">3</span></div>
        <div class="time" id="timeText">10:45 AM</div>
      </div>

      <div class="topbar-center">
        <div class="coin-pill">
          <span class="coin-icon">$</span>
          <span id="coinsText">1250</span>
        </div>
      </div>

      <div class="topbar-right">
        <div class="goal">
          <div class="goal-label">Daily Goal: <span id="goalText">9/15</span></div>
          <div class="bar"><div class="bar-fill" id="goalFill" style="width:60%"></div></div>
        </div>
      </div>
    </header>

    <main class="screen hidden" id="screenGame">
      <div class="layout">

        <section class="panel panel-soft" aria-label="Customer Queue">
          <div class="panel-title"><span class="bloom">❀</span>Customer Queue</div>
          <div class="queue" id="queue"></div>
        </section>

        <section class="ticket-wrap" aria-label="Order Ticket">
          <div class="ticket">
            <div class="ticket-line">══ ORDER TICKET ══</div>
            <div class="ticket-name" id="ticketName">Emma</div>

            <div class="ticket-divider"></div>

            <div class="ticket-items">
              <div class="ticket-item">
                <span class="check" id="coffeeCheck">○</span>
                <span class="icon">☕</span>
                <span class="label" id="coffeeLabel">Caramel Latte</span>
              </div>
              <div class="ticket-item">
                <span class="check" id="pastryCheck">○</span>
                <span class="icon">🥐</span>
                <span class="label" id="pastryLabel">Croissant</span>
              </div>
            </div>

            <div class="ticket-timer">⏱ <span id="ticketTimer">45s</span></div>
            <div class="ticket-status" id="ticketStatus">In Progress</div>
          </div>
        </section>

        <section class="right-col" aria-label="Actions">
          <button class="btn btn-primary btn-xl" id="btnServe" disabled>SERVE! 🎉</button>

          <div class="panel panel-soft">
            <button class="btn btn-dark w-full" id="btnUpgrades">Upgrades</button>
            <button class="btn btn-dark w-full" id="btnInventory">Inventory</button>
          </div>

          <div class="tip">💡 <strong>Tip:</strong> Perfect prep gives higher tips!</div>
        </section>

        <section class="panel panel-dark prep" aria-label="Prep Station">
          <div class="prep-header">Prep Station</div>

          <div class="prep-stage" id="prepStage">
            <!-- UI swaps content here -->
          </div>

          <div class="prep-buttons">
            <button class="btn btn-dark" id="btnPrepMenu">🍽 Menu</button>
            <button class="btn btn-dark" id="btnCoffeeStation">☕ Coffee</button>
            <button class="btn btn-dark" id="btnPastryStation">🥐 Pastry</button>
          </div>
        </section>

      </div>
    </main>
  `;
}

export function modals(){
  return `
    <div class="modal hidden" id="modalSettings">
      <div class="modal-card">
        <div class="modal-head">
          <h3>Settings</h3>
          <button class="icon-btn" id="settingsClose">✕</button>
        </div>
        <p class="muted">Add toggles here later (music/sfx).</p>
        <button class="btn btn-primary w-full" id="settingsOk">Close</button>
      </div>
    </div>

    <div class="modal hidden" id="modalCredits">
      <div class="modal-card">
        <div class="modal-head">
          <h3>Credits</h3>
          <button class="icon-btn" id="creditsClose">✕</button>
        </div>
        <p>Designed with ❤️ by your team.</p>
        <button class="btn btn-primary w-full" id="creditsOk">Close</button>
      </div>
    </div>

    <div class="modal hidden" id="modalUIKit">
      <div class="modal-card">
        <div class="modal-head">
          <h3>UI Kit</h3>
          <button class="icon-btn" id="uiClose">✕</button>
        </div>
        <p class="muted">Use this to show components later.</p>
        <button class="btn btn-primary w-full" id="uiOk">Close</button>
      </div>
    </div>
  `;
}
