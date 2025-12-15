import { ref, computed } from 'vue'
import { translations } from '../i18n/translations.js'

const currentLocale = ref(localStorage.getItem('vim-learn-locale') || 'uk')

export function useI18n() {
  const locale = computed(() => currentLocale.value)
  
  const t = (key) => {
    const keys = key.split('.')
    let result = translations[currentLocale.value]
    
    for (const k of keys) {
      if (result && result[k] !== undefined) {
        result = result[k]
      } else {
        // Fallback to Ukrainian
        result = translations['uk']
        for (const fallbackKey of keys) {
          if (result && result[fallbackKey] !== undefined) {
            result = result[fallbackKey]
          } else {
            return key
          }
        }
        return result
      }
    }
    
    return result
  }
  
  const setLocale = (newLocale) => {
    if (translations[newLocale]) {
      currentLocale.value = newLocale
      localStorage.setItem('vim-learn-locale', newLocale)
      document.documentElement.lang = newLocale
    }
  }
  
  const availableLocales = [
    { code: 'uk', name: 'Українська', flag: '🇺🇦' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' }
  ]
  
  return {
    locale,
    t,
    setLocale,
    availableLocales,
    translations
  }
}

