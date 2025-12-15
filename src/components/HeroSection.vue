<script setup>
import { ref, onMounted, inject, computed, watch } from 'vue'

const { t, locale } = inject('i18n')

const typingComplete = ref(false)
const isInitialLoad = ref(true)

// Computed для рядків терміналу - автоматично оновлюється при зміні мови
const terminalLines = computed(() => [
  { type: 'command', text: '$ vim --version' },
  { type: 'output', text: t('hero.terminalLines.version') },
  { type: 'output', text: t('hero.terminalLines.compiled') },
  { type: 'empty', text: '' },
  { type: 'command', text: t('hero.terminalLines.cat') },
  { type: 'header', text: '╔══════════════════════════════════════════╗' },
  { type: 'header', text: `║     🚀 ${t('hero.welcome')}    ║` },
  { type: 'header', text: '╚══════════════════════════════════════════╝' },
  { type: 'empty', text: '' },
  { type: 'info', text: t('hero.terminalLines.interactive') },
  { type: 'info', text: t('hero.terminalLines.learn') },
  { type: 'empty', text: '' },
  { type: 'prompt', text: '$ _' }
])

// Для анімації показуємо рядки поступово тільки при першому завантаженні
const visibleLines = ref(0)

onMounted(() => {
  const delays = [0, 400, 600, 700, 900, 1100, 1200, 1300, 1400, 1600, 1800, 1900, 2000]
  delays.forEach((delay, index) => {
    setTimeout(() => {
      visibleLines.value = index + 1
      if (index === delays.length - 1) {
        typingComplete.value = true
        isInitialLoad.value = false
      }
    }, delay)
  })
})

// Коли змінюється мова після завантаження - показуємо всі рядки одразу
watch(locale, () => {
  if (!isInitialLoad.value) {
    visibleLines.value = terminalLines.value.length
  }
})

const scrollToSection = (id) => {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<template>
  <section class="hero-section">
    <div class="hero-content">
      <div class="terminal-window hero-terminal">
        <div class="terminal-header">
          <span class="terminal-btn red"></span>
          <span class="terminal-btn yellow"></span>
          <span class="terminal-btn green"></span>
          <span class="terminal-title">vim@learn: ~</span>
        </div>
        <div class="terminal-body">
          <div 
            v-for="(line, index) in terminalLines.slice(0, visibleLines)" 
            :key="`${locale}-${index}`"
            class="terminal-line"
            :class="line.type"
          >
            <span v-if="line.type === 'command'" class="prompt">❯ </span>
            <span>{{ line.text }}</span>
            <span 
              v-if="line.type === 'prompt' && typingComplete" 
              class="cursor-blink"
            >█</span>
          </div>
        </div>
      </div>
      
      <div class="hero-info">
        <h1>
          <span class="accent">{{ t('hero.title') }}</span> {{ t('hero.titleVim') }}
          <span class="subtitle">{{ t('hero.subtitle') }}</span>
        </h1>
        
        <p class="hero-description">
          {{ t('hero.description') }}
        </p>
        
        <div class="hero-stats">
          <div class="stat">
            <span class="stat-value">50+</span>
            <span class="stat-label">{{ t('hero.commands') }}</span>
          </div>
          <div class="stat">
            <span class="stat-value">4</span>
            <span class="stat-label">{{ t('hero.modes') }}</span>
          </div>
          <div class="stat">
            <span class="stat-value">∞</span>
            <span class="stat-label">{{ t('hero.practice') }}</span>
          </div>
        </div>
        
        <div class="hero-actions">
          <button class="btn btn-primary" @click="scrollToSection('cheatsheet')">
            <span>{{ t('hero.start') }}</span>
            <kbd>Enter</kbd>
          </button>
          <button class="btn btn-secondary" @click="scrollToSection('modes')">
            <span>{{ t('hero.modesBtn') }}</span>
          </button>
        </div>
        
        <div class="quick-tip">
          <span class="tip-icon">💡</span>
          <span class="tip-text">
            {{ t('hero.tip') }} <kbd>j</kbd> {{ t('hero.tipScroll') }} <kbd>G</kbd> {{ t('hero.tipEnd') }}
          </span>
        </div>
      </div>
    </div>
    
    <div class="hero-decoration">
      <div class="grid-lines"></div>
    </div>
  </section>
</template>

<style scoped>
.hero-section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 100px 0 60px;
  position: relative;
  overflow: hidden;
}

.hero-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
  width: 100%;
}

.hero-terminal {
  animation: fade-in 0.8s ease-out;
}

.terminal-body {
  font-size: 0.9rem;
  line-height: 1.8;
}

.terminal-line {
  opacity: 0;
  animation: slide-in-left 0.3s ease-out forwards;
}

.terminal-line.command {
  color: var(--accent-cyan);
}

.terminal-line.output {
  color: var(--text-secondary);
}

.terminal-line.header {
  color: var(--accent-green);
  text-shadow: 0 0 10px var(--glow-green);
}

.terminal-line.info {
  color: var(--accent-purple);
}

.terminal-line.prompt {
  color: var(--accent-yellow);
}

.terminal-line.empty {
  height: 1.2em;
}

.prompt {
  color: var(--accent-green);
}

.hero-info {
  animation: fade-in 0.8s ease-out 0.3s backwards;
}

.hero-info h1 {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 20px;
  line-height: 1.2;
}

.hero-info h1 .accent {
  color: var(--accent-green);
  text-shadow: 0 0 20px var(--glow-green);
}

.hero-info h1 .subtitle {
  display: block;
  font-size: 1.25rem;
  font-weight: 400;
  color: var(--text-secondary);
  margin-top: 8px;
}

.hero-description {
  font-size: 1.1rem;
  color: var(--text-secondary);
  margin-bottom: 30px;
  max-width: 500px;
}

.hero-stats {
  display: flex;
  gap: 40px;
  margin-bottom: 30px;
}

.stat {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--accent-cyan);
  text-shadow: 0 0 15px var(--glow-cyan);
}

.stat-label {
  font-size: 0.875rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.hero-actions {
  display: flex;
  gap: 16px;
  margin-bottom: 30px;
}

.btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 24px;
  border: none;
  border-radius: 6px;
  font-family: var(--font-mono);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: var(--accent-green);
  color: var(--bg-primary);
  box-shadow: 0 4px 15px var(--glow-green);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 25px var(--glow-green);
}

.btn-primary kbd {
  padding: 4px 8px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  font-size: 0.75rem;
}

.btn-secondary {
  background: transparent;
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover {
  background: var(--bg-tertiary);
  border-color: var(--accent-cyan);
  color: var(--accent-cyan);
}

.quick-tip {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.quick-tip kbd {
  padding: 2px 8px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  color: var(--accent-cyan);
  font-weight: 600;
}

.hero-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
}

.grid-lines {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    linear-gradient(var(--border-color) 1px, transparent 1px),
    linear-gradient(90deg, var(--border-color) 1px, transparent 1px);
  background-size: 50px 50px;
  opacity: 0.1;
}

@media (max-width: 1024px) {
  .hero-content {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  
  .hero-info {
    text-align: center;
  }
  
  .hero-info h1 {
    font-size: 2.25rem;
  }
  
  .hero-description {
    margin-left: auto;
    margin-right: auto;
  }
  
  .hero-stats {
    justify-content: center;
  }
  
  .hero-actions {
    justify-content: center;
  }
  
  .quick-tip {
    justify-content: center;
  }
}
</style>
