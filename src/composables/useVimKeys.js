import { onMounted, onUnmounted } from 'vue'

export function useVimKeys() {
  const handleKeydown = (e) => {
    // Ігноруємо, якщо фокус на полі вводу
    const activeElement = document.activeElement
    const isInputFocused = activeElement && (
      activeElement.tagName === 'INPUT' ||
      activeElement.tagName === 'TEXTAREA' ||
      activeElement.isContentEditable
    )
    
    if (isInputFocused) return
    
    switch (e.key) {
      case 'j':
        // Скрол вниз на 100px
        window.scrollBy({
          top: 100,
          behavior: 'smooth'
        })
        break
        
      case 'k':
        // Скрол вгору на 100px
        window.scrollBy({
          top: -100,
          behavior: 'smooth'
        })
        break
        
      case 'G':
        // Shift + g - перейти в кінець
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: 'smooth'
        })
        break
        
      case 'g':
        // Подвійне g для переходу на початок (потрібен другий g)
        // Для простоти - одне g переходить на початок
        if (e.shiftKey === false) {
          // Простий g - чекаємо другий g (gg)
          // Тут використовуємо таймер для виявлення gg
          if (window._lastGPress && Date.now() - window._lastGPress < 500) {
            window.scrollTo({
              top: 0,
              behavior: 'smooth'
            })
            window._lastGPress = null
          } else {
            window._lastGPress = Date.now()
          }
        }
        break
        
      case 'd':
        // Ctrl+d - пів екрану вниз
        if (e.ctrlKey) {
          e.preventDefault()
          window.scrollBy({
            top: window.innerHeight / 2,
            behavior: 'smooth'
          })
        }
        break
        
      case 'u':
        // Ctrl+u - пів екрану вгору
        if (e.ctrlKey) {
          e.preventDefault()
          window.scrollBy({
            top: -window.innerHeight / 2,
            behavior: 'smooth'
          })
        }
        break
    }
  }
  
  onMounted(() => {
    window.addEventListener('keydown', handleKeydown)
  })
  
  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown)
  })
  
  return {
    handleKeydown
  }
}

