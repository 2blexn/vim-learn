<script setup>
import { ref, onMounted, provide } from 'vue'
import { useVimKeys } from './composables/useVimKeys.js'
import { useI18n } from './composables/useI18n.js'
import TerminalNav from './components/TerminalNav.vue'
import HeroSection from './components/HeroSection.vue'
import ModeSection from './components/ModeSection.vue'
import CheatsheetSection from './components/CheatsheetSection.vue'
import PracticeSection from './components/PracticeSection.vue'
import FooterSection from './components/FooterSection.vue'

const activeSection = ref('hero')
const isLoaded = ref(false)

// Ініціалізуємо Vim-клавіші для скролу
useVimKeys()

// i18n
const { locale, t, setLocale, availableLocales } = useI18n()

const setActiveSection = (section) => {
  activeSection.value = section
}

provide('activeSection', activeSection)
provide('setActiveSection', setActiveSection)
provide('i18n', { locale, t, setLocale, availableLocales })

onMounted(() => {
  setTimeout(() => {
    isLoaded.value = true
  }, 100)
})
</script>

<template>
  <div class="app-container" :class="{ 'loaded': isLoaded }">
    <TerminalNav />
    <main>
      <HeroSection id="hero" />
      <ModeSection id="modes" />
      <CheatsheetSection id="cheatsheet" />
      <PracticeSection id="practice" />
    </main>
    <FooterSection />
  </div>
</template>

<style scoped>
.app-container {
  opacity: 0;
  transition: opacity 0.5s ease;
}

.app-container.loaded {
  opacity: 1;
}

main {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}
</style>
