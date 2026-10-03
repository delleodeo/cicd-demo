<script setup>
import { computed, onBeforeUnmount, ref } from 'vue'

const isDeploying = ref(false)
const isDarkMode = ref(localStorage.getItem('launchpad-theme') === 'dark')
const deploymentNumber = ref(128)
const completedSteps = ref(4)
let deploymentTimer

const pipelineSteps = [
  { name: 'Build', detail: 'Dependencies installed', duration: '18s' },
  { name: 'Test', detail: '42 checks passed', duration: '31s' },
  { name: 'Package', detail: 'Production bundle ready', duration: '12s' },
  { name: 'Deploy', detail: 'Live on production', duration: '24s' },
]

const progress = computed(() => `${(completedSteps.value / pipelineSteps.length) * 100}%`)
const statusLabel = computed(() => (isDeploying.value ? 'Deploying now' : 'Deployment successful'))

function toggleTheme() {
  isDarkMode.value = !isDarkMode.value
  localStorage.setItem('launchpad-theme', isDarkMode.value ? 'dark' : 'light')
}

function startDeployment() {
  if (isDeploying.value) return

  isDeploying.value = true
  completedSteps.value = 0
  deploymentTimer = setInterval(() => {
    if (completedSteps.value < pipelineSteps.length) {
      completedSteps.value += 1
      return
    }

    clearInterval(deploymentTimer)
    deploymentTimer = undefined
    deploymentNumber.value += 1
    isDeploying.value = false
  }, 650)
}

onBeforeUnmount(() => {
  if (deploymentTimer) clearInterval(deploymentTimer)
})
</script>

<template>
  <main class="app-shell" :class="{ dark: isDarkMode }">
    <nav class="topbar" aria-label="Main navigation">
      <a class="brand" href="/" aria-label="Launchpad home">
        <span class="brand-mark" aria-hidden="true">L</span>
        <span>Launchpad Update</span>
      </a>
      <div class="topbar-meta">
        <span class="environment"><span class="environment-dot"></span>Production</span>
        <button
          class="theme-toggle"
          type="button"
          :aria-label="isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'"
          :aria-pressed="isDarkMode"
          :title="isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'"
          @click="toggleTheme"
        >
          <span aria-hidden="true">{{ isDarkMode ? '☀' : '☾' }}</span>
        </button>
        <span class="avatar" aria-label="Signed in as Alex Morgan">AM</span>
      </div>
    </nav>

    <section class="content">
      <header class="hero">
        <div>
          <p class="eyebrow">Deployment overview</p>
          <h1>Ship with confidence.</h1>
          <p class="hero-copy">
            Track your release from the first commit to production, all in one clear view.
          </p>
        </div>
        <button class="deploy-button" type="button" :disabled="isDeploying" @click="startDeployment">
          <span class="button-icon" aria-hidden="true">{{ isDeploying ? '...' : '+' }}</span>
          {{ isDeploying ? 'Deploying...' : 'Deploy latest' }}
        </button>
      </header>

      <section class="stats-grid" aria-label="Deployment statistics">
        <article class="stat-card">
          <div class="stat-heading"><span class="stat-icon purple">↗</span><span>Current version</span></div>
          <strong>v2.4.1</strong>
          <span class="stat-caption">main branch</span>
        </article>
        <article class="stat-card">
          <div class="stat-heading"><span class="stat-icon green">✓</span><span>Success rate</span></div>
          <strong>98.6%</strong>
          <span class="stat-caption">last 30 deployments</span>
        </article>
        <article class="stat-card">
          <div class="stat-heading"><span class="stat-icon orange">◷</span><span>Avg. deploy time</span></div>
          <strong>1m 25s</strong>
          <span class="stat-caption">12% faster this week</span>
        </article>
      </section>

      <section class="dashboard-grid">
        <article class="panel pipeline-panel">
          <div class="panel-header">
            <div>
              <p class="eyebrow">Release pipeline</p>
              <h2>Production deployment</h2>
            </div>
            <span class="status-pill" :class="{ 'is-active': isDeploying }">
              <span class="status-dot"></span>{{ statusLabel }}
            </span>
          </div>

          <div class="progress-track" aria-hidden="true">
            <span class="progress-value" :style="{ width: progress }"></span>
          </div>
          <div class="pipeline" aria-label="Deployment pipeline steps">
            <div v-for="(step, index) in pipelineSteps" :key="step.name" class="pipeline-step">
              <div class="step-marker" :class="{ complete: index < completedSteps, current: index === completedSteps && isDeploying }">
                <span v-if="index < completedSteps">✓</span>
                <span v-else>{{ index + 1 }}</span>
              </div>
              <div class="step-content">
                <div class="step-title"><strong>{{ step.name }}</strong><span>{{ index < completedSteps ? step.duration : 'Pending' }}</span></div>
                <p>{{ step.detail }}</p>
              </div>
            </div>
          </div>
        </article>

        <aside class="panel activity-panel">
          <div class="panel-header">
            <div>
              <p class="eyebrow">Recent activity</p>
              <h2>Latest deployments</h2>
            </div>
            <button class="text-button" type="button">View all</button>
          </div>
          <ul class="activity-list">
            <li><span class="activity-check">✓</span><div><strong>v2.4.1</strong><p>Deployed to production</p></div><time>2m ago</time></li>
            <li><span class="activity-check">✓</span><div><strong>v2.4.0</strong><p>Deployed to production</p></div><time>3h ago</time></li>
            <li><span class="activity-check">✓</span><div><strong>v2.3.9</strong><p>Deployed to production</p></div><time>Yesterday</time></li>
          </ul>
          <div class="commit-card">
            <span class="commit-icon">#</span>
            <div><strong>Latest commit</strong><p>Refine dashboard experience</p></div>
            <span class="commit-id">a82f1c</span>
          </div>
        </aside>
      </section>

      <footer class="footer">
        <span><span class="online-dot"></span>All systems operational</span>
        <span>Last checked just now</span>
        <span>Build <strong>#{{ deploymentNumber }}</strong></span>
      </footer>
    </section>
  </main>
</template>

<style scoped>
:global(*) { box-sizing: border-box; }
:global(body) { margin: 0; min-width: 320px; background: #f6f7fb; color: #182230; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
:global(button) { font: inherit; }

.app-shell { min-height: 100vh; background: radial-gradient(circle at 82% -10%, #eeeaff 0, transparent 34%), #f6f7fb; }
.topbar { height: 76px; display: flex; align-items: center; justify-content: space-between; padding: 0 clamp(24px, 6vw, 88px); background: rgba(255, 255, 255, .8); border-bottom: 1px solid #e9eaf1; }
.brand { display: inline-flex; align-items: center; gap: 11px; color: #182230; font-size: 16px; font-weight: 750; letter-spacing: -.02em; text-decoration: none; }
.brand-mark { display: grid; width: 31px; height: 31px; place-items: center; border-radius: 9px; background: #6856e8; color: white; font-size: 18px; font-weight: 800; box-shadow: 0 5px 12px rgba(104, 86, 232, .25); }
.topbar-meta, .environment { display: flex; align-items: center; gap: 17px; }
.environment { gap: 8px; color: #566276; font-size: 13px; font-weight: 600; }
.environment-dot, .online-dot { width: 7px; height: 7px; border-radius: 50%; background: #899690; box-shadow: 0 0 0 3px #dff7ec; }
.theme-toggle { display: grid; width: 32px; height: 32px; place-items: center; border: 1px solid #e1e4ec; border-radius: 50%; background: #fff; color: #657187; cursor: pointer; font-size: 17px; line-height: 1; transition: background .2s, color .2s, transform .2s; }
.theme-toggle:hover { background: #f0eeff; color: #5f4bda; transform: rotate(12deg); }
.theme-toggle:focus-visible { outline: 3px solid #c7c0ff; outline-offset: 3px; }
.avatar { display: grid; width: 34px; height: 34px; place-items: center; border-radius: 50%; background: #e8e4ff; color: #5b4ad0; font-size: 11px; font-weight: 800; }
.content { width: min(1120px, calc(100% - 48px)); margin: 0 auto; padding: 64px 0 28px; }
.hero { display: flex; align-items: flex-end; justify-content: space-between; gap: 32px; margin-bottom: 42px; }
.eyebrow { margin: 0 0 9px; color: #7568d9; font-size: 11px; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; }
h1, h2, p { margin-top: 0; }
h1 { margin-bottom: 12px; color: #172234; font-size: clamp(33px, 4.4vw, 50px); line-height: 1.05; letter-spacing: -.055em; }
.hero-copy { max-width: 480px; margin-bottom: 0; color: #718096; font-size: 15px; line-height: 1.7; }
.deploy-button { display: inline-flex; align-items: center; gap: 9px; padding: 13px 18px; border: 0; border-radius: 10px; background: #6856e8; color: white; box-shadow: 0 9px 18px rgba(104, 86, 232, .23); cursor: pointer; font-size: 13px; font-weight: 750; transition: transform .2s, background .2s; white-space: nowrap; }
.deploy-button:hover:not(:disabled) { background: #5745d1; transform: translateY(-2px); }
.deploy-button:focus-visible, .text-button:focus-visible { outline: 3px solid #c7c0ff; outline-offset: 3px; }
.deploy-button:disabled { cursor: wait; opacity: .75; }
.button-icon { font-size: 19px; line-height: 12px; }
.stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 18px; }
.stat-card, .panel { border: 1px solid #e6e8f0; border-radius: 14px; background: rgba(255, 255, 255, .9); box-shadow: 0 8px 30px rgba(40, 51, 78, .035); }
.stat-card { padding: 20px 22px 18px; }
.stat-heading { display: flex; align-items: center; gap: 9px; margin-bottom: 15px; color: #748095; font-size: 12px; font-weight: 650; }
.stat-icon { display: grid; width: 25px; height: 25px; place-items: center; border-radius: 7px; font-size: 14px; font-weight: 800; }
.purple { background: #efedff; color: #6b58e4; }.green { background: #e5f8f0; color: #27a66e; }.orange { background: #fff1e3; color: #ea8b39; }
.stat-card strong { display: block; margin-bottom: 4px; color: #192436; font-size: 22px; letter-spacing: -.03em; }
.stat-caption { color: #98a1b1; font-size: 11px; }
.dashboard-grid { display: grid; grid-template-columns: minmax(0, 1.55fr) minmax(310px, 1fr); gap: 18px; }
.panel { padding: 25px; }
.panel-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 15px; margin-bottom: 25px; }
h2 { margin-bottom: 0; color: #1c293b; font-size: 18px; letter-spacing: -.025em; }
.status-pill { display: inline-flex; align-items: center; gap: 7px; padding: 7px 10px; border-radius: 20px; background: #e6f8ef; color: #239663; font-size: 10px; font-weight: 750; white-space: nowrap; }
.status-pill.is-active { background: #fff3e7; color: #d87921; }.status-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
.progress-track { height: 5px; margin: 2px 6px 28px; overflow: hidden; border-radius: 5px; background: #eceef4; }
.progress-value { display: block; height: 100%; border-radius: inherit; background: linear-gradient(90deg, #8172f0, #5f4bda); transition: width .35s ease; }
.pipeline { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
.pipeline-step { min-width: 0; }.step-marker { display: grid; width: 29px; height: 29px; margin-bottom: 12px; place-items: center; border: 1px solid #dfe2ea; border-radius: 50%; background: white; color: #9ca5b4; font-size: 11px; font-weight: 750; }
.step-marker.complete { border-color: #6d5be4; background: #6d5be4; color: white; }.step-marker.current { border-color: #ea9a4a; color: #d87921; box-shadow: 0 0 0 4px #fff0dd; }
.step-title { display: flex; justify-content: space-between; gap: 7px; color: #283549; font-size: 12px; }.step-title span { color: #8e99aa; font-size: 10px; }.step-content p { margin: 5px 0 0; color: #97a0b0; font-size: 10px; line-height: 1.45; }
.text-button { border: 0; background: none; color: #6d5be4; cursor: pointer; font-size: 11px; font-weight: 700; }.activity-list { display: grid; gap: 18px; margin: 0 0 22px; padding: 0; list-style: none; }
.activity-list li { display: flex; align-items: center; gap: 10px; }.activity-check { display: grid; width: 25px; height: 25px; place-items: center; border-radius: 50%; background: #e7f8f0; color: #27a66e; font-size: 12px; font-weight: 800; }.activity-list strong, .commit-card strong { display: block; color: #314056; font-size: 12px; }.activity-list p, .commit-card p { margin: 3px 0 0; color: #909aaa; font-size: 10px; }.activity-list time { margin-left: auto; color: #a5adba; font-size: 10px; }
.commit-card { display: flex; align-items: center; gap: 10px; padding: 13px; border: 1px solid #eceef3; border-radius: 9px; background: #fafbfc; }.commit-icon { display: grid; width: 25px; height: 25px; place-items: center; border-radius: 6px; background: #eeecff; color: #6d5be4; font-family: monospace; font-size: 11px; font-weight: bold; }.commit-id { margin-left: auto; color: #a0a8b6; font-family: monospace; font-size: 10px; }
.footer { display: flex; gap: 24px; margin-top: 26px; color: #99a2b0; font-size: 10px; }.footer span { display: inline-flex; align-items: center; gap: 8px; }.footer strong { color: #626e80; font-weight: 700; }
.app-shell.dark { background: radial-gradient(circle at 82% -10%, #292449 0, transparent 38%), #111522; color: #e8ebf4; }
.dark .topbar { background: rgba(21, 25, 39, .88); border-color: #292f42; }
.dark .brand, .dark h1, .dark h2, .dark .stat-card strong, .dark .step-title, .dark .activity-list strong, .dark .commit-card strong { color: #edf0f8; }
.dark .environment { color: #b5bfd1; }
.dark .theme-toggle { border-color: #3a4258; background: #252b3c; color: #f4c85c; }
.dark .theme-toggle:hover { background: #30384e; color: #ffe08b; }
.dark .hero-copy, .dark .stat-heading, .dark .step-content p, .dark .activity-list p, .dark .commit-card p { color: #9ca7bb; }
.dark .stat-card, .dark .panel { border-color: #2c3347; background: rgba(25, 30, 46, .92); box-shadow: 0 8px 30px rgba(0, 0, 0, .14); }
.dark .stat-caption, .dark .step-title span, .dark .activity-list time, .dark .commit-id, .dark .footer { color: #7f8ba2; }
.dark .progress-track { background: #30374a; }
.dark .step-marker { border-color: #3a4255; background: #202638; color: #8894a9; }
.dark .step-marker.complete { border-color: #6d5be4; background: #6d5be4; color: white; }
.dark .step-marker.current { border-color: #ea9a4a; background: #252a38; }
.dark .commit-card { border-color: #30374a; background: #1c2233; }
.dark .text-button { color: #a59aff; }
.dark .footer strong { color: #aeb7c8; }
@media (max-width: 760px) { .content { padding-top: 42px; }.hero { align-items: flex-start; flex-direction: column; margin-bottom: 30px; }.deploy-button { width: 100%; justify-content: center; }.stats-grid, .dashboard-grid { grid-template-columns: 1fr; }.pipeline-panel { min-width: 0; }.footer { flex-wrap: wrap; gap: 12px 20px; } }
@media (max-width: 480px) { .topbar { padding: 0 18px; }.environment { display: none; }.content { width: min(100% - 32px, 1120px); }.panel { padding: 20px 17px; }.pipeline { gap: 4px; }.step-title { display: block; }.step-title span { display: block; margin-top: 3px; }.stat-card { padding: 17px; } }
</style>
