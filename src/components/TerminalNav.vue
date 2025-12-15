<script setup>
import { ref, inject } from 'vue'

const activeSection = inject('activeSection')
const { t, locale, setLocale, availableLocales } = inject('i18n')
const isMenuOpen = ref(false)
const isLangOpen = ref(false)

const navItems = [
  { id: 'hero', labelKey: 'nav.home', icon: '~' },
  { id: 'modes', labelKey: 'nav.modes', icon: 'M' },
  { id: 'cheatsheet', labelKey: 'nav.keys', icon: 'K' },
  { id: 'practice', labelKey: 'nav.practice', icon: 'P' }
]

const scrollToSection = (id) => {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
  isMenuOpen.value = false
}

const selectLocale = (code) => {
  setLocale(code)
  isLangOpen.value = false
}

const getCurrentFlag = () => {
  const current = availableLocales.find(l => l.code === locale.value)
  return current ? current.flag : '🌐'
}
</script>

<template>
  <nav class="terminal-nav">
    <div class="nav-container">
      <div class="nav-logo" @click="scrollToSection('hero')">
        <span class="logo-vim">VIM</span>
        <span class="logo-learn">.learn()</span>
        <span class="cursor">_</span>
      </div>
      
      <button class="menu-toggle" @click="isMenuOpen = !isMenuOpen">
        <span>{{ isMenuOpen ? ':q!' : ':menu' }}</span>
      </button>
      
      <ul class="nav-links" :class="{ 'open': isMenuOpen }">
        <li v-for="item in navItems" :key="item.id">
          <a 
            @click.prevent="scrollToSection(item.id)"
            :class="{ active: activeSection === item.id }"
            href="#"
          >
            <span class="nav-icon">{{ item.icon }}</span>
            <span class="nav-label">{{ t(item.labelKey) }}</span>
          </a>
        </li>
      </ul>
      
      <div class="nav-right">
        <!-- Language Selector -->
        <div class="lang-selector" :class="{ open: isLangOpen }">
          <button class="lang-toggle" @click="isLangOpen = !isLangOpen">
            <span class="lang-flag">{{ getCurrentFlag() }}</span>
            <span class="lang-arrow">▼</span>
          </button>
          <div class="lang-dropdown" v-if="isLangOpen">
            <button
              v-for="lang in availableLocales"
              :key="lang.code"
              class="lang-option"
              :class="{ active: locale === lang.code }"
              @click="selectLocale(lang.code)"
            >
              <span class="lang-flag">{{ lang.flag }}</span>
              <span class="lang-name">{{ lang.name }}</span>
            </button>
          </div>
        </div>
        
        <div class="nav-status">
          <span class="status-mode">{{ t('nav.normal') }}</span>
          <span class="status-file">{{ t('nav.file') }}</span>
          <span class="status-pos">[100%]</span>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.terminal-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
  backdrop-filter: blur(10px);
}

.nav-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
  height: 56px;
  display: flex;
  align-items: center;
  gap: 40px;
}

.nav-logo {
  display: flex;
  align-items: center;
  font-size: 1.25rem;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s;
}

.nav-logo:hover {
  transform: scale(1.02);
}

.logo-vim {
  color: var(--accent-green);
  text-shadow: 0 0 10px var(--glow-green);
}

.logo-learn {
  color: var(--text-secondary);
}

.cursor {
  color: var(--accent-green);
  animation: blink 1s step-end infinite;
}

.menu-toggle {
  display: none;
  padding: 8px 12px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  color: var(--accent-cyan);
  font-family: var(--font-mono);
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.menu-toggle:hover {
  background: var(--accent-cyan);
  color: var(--bg-primary);
}

.nav-links {
  display: flex;
  list-style: none;
  gap: 8px;
}

.nav-links a {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.875rem;
  border-radius: 4px;
  transition: all 0.2s;
  border: 1px solid transparent;
}

.nav-links a:hover {
  color: var(--text-primary);
  background: var(--bg-tertiary);
  border-color: var(--border-color);
}

.nav-links a.active {
  color: var(--accent-green);
  background: rgba(63, 185, 80, 0.1);
  border-color: var(--accent-green);
}

.nav-icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-tertiary);
  border-radius: 3px;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--accent-purple);
}

.nav-right {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 16px;
}

.lang-selector {
  position: relative;
}

.lang-toggle {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  color: var(--text-primary);
  font-family: var(--font-mono);
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.lang-toggle:hover {
  border-color: var(--accent-cyan);
}

.lang-flag {
  font-size: 1.1rem;
}

.lang-arrow {
  font-size: 0.6rem;
  color: var(--text-muted);
  transition: transform 0.2s;
}

.lang-selector.open .lang-arrow {
  transform: rotate(180deg);
}

.lang-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  overflow: hidden;
  min-width: 150px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  z-index: 100;
}

.lang-option {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 14px;
  background: transparent;
  border: none;
  color: var(--text-secondary);
  font-family: var(--font-mono);
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.lang-option:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

.lang-option.active {
  background: rgba(63, 185, 80, 0.1);
  color: var(--accent-green);
}

.lang-name {
  flex: 1;
}

.nav-status {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 0.75rem;
}

.status-mode {
  padding: 4px 8px;
  background: var(--accent-green);
  color: var(--bg-primary);
  font-weight: 600;
  border-radius: 3px;
}

.status-file {
  color: var(--text-secondary);
}

.status-pos {
  color: var(--accent-cyan);
}

@media (max-width: 768px) {
  .menu-toggle {
    display: block;
  }
  
  .nav-links {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    flex-direction: column;
    background: var(--bg-secondary);
    border-bottom: 1px solid var(--border-color);
    padding: 16px;
    display: none;
  }
  
  .nav-links.open {
    display: flex;
  }
  
  .nav-status {
    display: none;
  }
}
</style>
