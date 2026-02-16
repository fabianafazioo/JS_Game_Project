export function homeScreen(){
  return `
    <div class="home-bg" id="homeBg"></div>

    <main class="screen" id="screenMenu">
      <div class="menu-wrap">
        <div class="home-grid">
          <div>
            <div class="brand">
              <div class="bloom">❀</div>
              <h1>Brew & Bloom</h1>
              <div class="bloom">❀</div>
            </div>

            <p class="subtitle muted">Cozy Coffee Shop Game</p>

            <div class="menu-col" style="margin-top:18px;">
              <button class="btn btn-primary btn-xl btn-play" id="btnPlay">▶ Play</button>
              <button class="btn btn-secondary btn-small" id="btnInventory">Inventory</button>
              <button class="btn btn-secondary btn-small" id="btnSettings">Settings</button>
              <button class="btn btn-secondary btn-small" id="btnCredits">Credits</button>
            </div>
          </div>

          <div class="hero-cup-big">
            <img src="assets/images/coffee-cup.gif" alt="Coffee Cup" />
          </div>
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
        <div class="muted">Day <span id="dayNum">1</span></div>
        <div class="time" id="timeText">Brew Time</div>
      </div>

      <div class="topbar-center">
        <div class="coin-pill">
          <span class="coin-icon">$</span>
          <span id="cashText">200.00</span>
        </div>
      </div>

      <div class="topbar-right">
        <div class="goal">
          <div class="goal-label">Daily Goal: <span id="goalText">0/10</span></div>
          <div class="bar"><div class="bar-fill" id="goalFill" style="width:0%"></div></div>
        </div>
      </div>
    </header>

    <main class="screen hidden" id="screenGame">
      <div class="layout">

        <section class="panel panel-soft" aria-label="Customer Queue">
          <div class="panel-title"><span class="bloom">❀</span>Customer Queue</div>
          <div class="muted" id="queueText">Customers will appear and walk to tables.</div>
          <div style="height:10px"></div>
          <div id="queueList"></div>
        </section>

        <section class="panel panel-soft">
          <div class="panel-title"><span class="bloom">❀</span>Café Scene</div>

          <div class="cafe-wrap">
            <div class="cafe-toolbar">
              <div class="pill">⏱ Order Timer: <span id="timerText">40s</span></div>
              <div class="pill">🧍 Server: <span class="muted">Move with Arrow Keys</span></div>
              <div class="pill">📌 Hint: <span class="muted">Walk near a customer</span></div>
            </div>

            <div class="canvas-area">
              <canvas id="cafeCanvas" width="780" height="420"></canvas>
            </div>

            <div class="cafe-toolbar">
              <button class="btn btn-secondary" id="btnTakeOrder">Take Order</button>
              <button class="btn btn-primary" id="btnServe">Serve</button>
              <button class="btn btn-secondary" id="btnOpenInventory">Inventory</button>
            </div>

            <div class="muted" style="padding:0 12px 12px;">
              <span id="msgText"></span>
            </div>
          </div>
        </section>

        <section class="right-col" aria-label="Actions">
          <div class="panel panel-soft">
            <div class="panel-title">Quick Buttons</div>
            <button class="btn btn-dark w-full" id="btnMoney">$ Money</button>
            <button class="btn btn-dark w-full" id="btnQueue">Customer Queue</button>
            <button class="btn btn-dark w-full" id="btnSettingsInGame">Settings</button>
          </div>

          <div class="tip">
            💡 <strong>Gameplay:</strong> Buy ingredients in Inventory → take orders → serve fast.
          </div>
        </section>

        <section class="panel panel-dark prep" aria-label="Prep Station">
          <div class="prep-header">Ingredient Tray (Click to “prep”)</div>
          <div class="prep-stage">
            <div class="tray" id="tray"></div>
          </div>
          <div class="muted" style="text-align:center;">
            Tip: Serving consumes ingredients. If you don’t have them, delivery fails.
          </div>
        </section>

      </div>
    </main>
  `;
}

export function modals(){
  return `
    <!-- Welcome -->
    <div class="modal hidden" id="modalWelcome">
      <div class="modal-card">
        <div class="modal-head">
          <h3>Welcome to Brew & Bloom ✨</h3>
          <button class="icon-btn" id="welcomeClose">✕</button>
        </div>

        <div class="welcome">
          <div class="cup">
            <img src="assets/images/coffee-cup.gif" alt="Cup"/>
          </div>
          <div>
            <h3>Hi Barista! ☕</h3>
            <div class="muted">
              Before serving coffee and pastries, you must buy ingredients in <strong>Inventory</strong>:
              <strong>Milk, Coffee Beans, Sugar</strong>, and <strong>pre-made pastries</strong>.
              <br/><br/>
              You start with <strong>$200.00</strong> so you can stock up and start earning!
            </div>
          </div>
        </div>

        <div style="height:12px"></div>
        <button class="btn btn-primary w-full" id="welcomeGoInventory">Go to Inventory</button>
        <div style="height:10px"></div>
        <button class="btn btn-secondary w-full" id="welcomeOk">Got it!</button>
      </div>
    </div>

    <!-- Inventory -->
    <div class="modal hidden" id="modalInventory">
      <div class="modal-card">
        <div class="modal-head">
          <h3>Inventory</h3>
          <button class="icon-btn" id="invClose">✕</button>
        </div>

        <div class="muted" style="margin-bottom:10px;">
          Buy ingredients and pastries (pre-made) to fulfill orders.
        </div>

        <div class="slider-row">
          <div><strong>Cash</strong></div>
          <div class="coin-pill"><span class="coin-icon">$</span><span id="invCash">200.00</span></div>
        </div>

        <div id="invGrid"></div>

        <div style="height:12px"></div>
        <button class="btn btn-secondary w-full" id="invDone">Done</button>
      </div>
    </div>

    <!-- Settings -->
    <div class="modal hidden" id="modalSettings">
      <div class="modal-card">
        <div class="modal-head">
          <h3>Settings</h3>
          <button class="icon-btn" id="settingsClose">✕</button>
        </div>

        <div class="slider-row">
          <div><strong>Music</strong> <span class="muted">(volume)</span></div>
          <input type="range" id="musicVol" min="0" max="1" step="0.01"/>
          <button class="btn btn-secondary" id="toggleMusic">On</button>
        </div>

        <div class="slider-row">
          <div><strong>Click Button</strong> <span class="muted">(volume)</span></div>
          <input type="range" id="sfxVol" min="0" max="1" step="0.01"/>
          <button class="btn btn-secondary" id="toggleSfx">On</button>
        </div>

        <button class="btn btn-primary w-full" id="settingsOk">Close</button>
      </div>
    </div>

    <!-- Credits -->
    <div class="modal hidden" id="modalCredits">
      <div class="modal-card">
        <div class="modal-head">
          <h3>Credits</h3>
          <button class="icon-btn" id="creditsClose">✕</button>
        </div>
        <p>Designed with ❤️.</p>
        <button class="btn btn-primary w-full" id="creditsOk">Close</button>
      </div>
    </div>
  `;
}
