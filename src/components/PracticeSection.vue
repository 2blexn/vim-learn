<script setup>
import { ref, computed, onMounted, watch, inject } from 'vue'

const { t } = inject('i18n')

const currentChallenge = ref(0)
const userInput = ref('')
const isCorrect = ref(null)
const showHint = ref(false)
const completedChallenges = ref([])
const terminalHistory = ref([])
const wrongAttempts = ref(0)
const hintsUsed = ref(0)
const skippedChallenges = ref([])
const showResults = ref(false)
const testStartTime = ref(null)
const testEndTime = ref(null)

const challenges = computed(() => [
  {
    id: 1,
    task: t('practice.challenges.insertBefore'),
    expected: 'i',
    hint: t('practice.hints.insertBefore'),
    category: t('practice.categories.modes')
  },
  {
    id: 2,
    task: t('practice.challenges.goToStart'),
    expected: 'gg',
    hint: t('practice.hints.goToStart'),
    category: t('practice.categories.navigation')
  },
  {
    id: 3,
    task: t('practice.challenges.deleteLine'),
    expected: 'dd',
    hint: t('practice.hints.deleteLine'),
    category: t('practice.categories.editing')
  },
  {
    id: 4,
    task: t('practice.challenges.copyLine'),
    expected: 'yy',
    hint: t('practice.hints.copyLine'),
    category: t('practice.categories.editing')
  },
  {
    id: 5,
    task: t('practice.challenges.saveFile'),
    expected: ':w',
    hint: t('practice.hints.saveFile'),
    category: t('practice.categories.commands')
  },
  {
    id: 6,
    task: t('practice.challenges.quitNoSave'),
    expected: ':q!',
    hint: t('practice.hints.quitNoSave'),
    category: t('practice.categories.commands')
  },
  {
    id: 7,
    task: t('practice.challenges.goToLineEnd'),
    expected: '$',
    hint: t('practice.hints.goToLineEnd'),
    category: t('practice.categories.navigation')
  },
  {
    id: 8,
    task: t('practice.challenges.undo'),
    expected: 'u',
    hint: t('practice.hints.undo'),
    category: t('practice.categories.editing')
  },
  {
    id: 9,
    task: t('practice.challenges.searchForward'),
    expected: '/',
    hint: t('practice.hints.searchForward'),
    category: t('practice.categories.search')
  },
  {
    id: 10,
    task: t('practice.challenges.appendEnd'),
    expected: 'A',
    hint: t('practice.hints.appendEnd'),
    category: t('practice.categories.modes')
  },
  {
    id: 11,
    task: t('practice.challenges.deleteWord'),
    expected: 'dw',
    hint: t('practice.hints.deleteWord'),
    category: t('practice.categories.editing')
  },
  {
    id: 12,
    task: t('practice.challenges.visualLine'),
    expected: 'V',
    hint: t('practice.hints.visualLine'),
    category: t('practice.categories.modes')
  },
  {
    id: 13,
    task: t('practice.challenges.nextWord'),
    expected: 'w',
    hint: t('practice.hints.nextWord'),
    category: t('practice.categories.navigation')
  },
  {
    id: 14,
    task: t('practice.challenges.newLineBelow'),
    expected: 'o',
    hint: t('practice.hints.newLineBelow'),
    category: t('practice.categories.editing')
  },
  {
    id: 15,
    task: t('practice.challenges.saveQuit'),
    expected: ':wq',
    hint: t('practice.hints.saveQuit'),
    category: t('practice.categories.commands'),
    alternatives: [':x', 'ZZ']
  }
])

const challenge = computed(() => challenges.value[currentChallenge.value])

const progress = computed(() => {
  return Math.round((completedChallenges.value.length / challenges.value.length) * 100)
})

const isTestComplete = computed(() => {
  return completedChallenges.value.length === challenges.value.length
})

// Результати тесту
const testResults = computed(() => {
  const total = challenges.value.length
  const correct = completedChallenges.value.length
  const skipped = skippedChallenges.value.length
  const errors = wrongAttempts.value
  const hints = hintsUsed.value
  
  let score = correct * 100
  score -= errors * 10
  score -= hints * 15
  score -= skipped * 50
  score = Math.max(0, score)
  
  const maxScore = total * 100
  const percentage = Math.round((score / maxScore) * 100)
  
  let level, levelColor, levelIcon, message
  if (percentage >= 90) {
    level = t('practice.results.levels.master')
    levelColor = '#ffd700'
    levelIcon = '👑'
    message = t('practice.results.message.master')
  } else if (percentage >= 75) {
    level = t('practice.results.levels.expert')
    levelColor = '#3fb950'
    levelIcon = '🚀'
    message = t('practice.results.message.expert')
  } else if (percentage >= 60) {
    level = t('practice.results.levels.user')
    levelColor = '#58a6ff'
    levelIcon = '💪'
    message = t('practice.results.message.user')
  } else if (percentage >= 40) {
    level = t('practice.results.levels.learner')
    levelColor = '#d29922'
    levelIcon = '📚'
    message = t('practice.results.message.learner')
  } else {
    level = t('practice.results.levels.newbie')
    levelColor = '#f85149'
    levelIcon = '🌱'
    message = t('practice.results.message.newbie')
  }
  
  let timeSpent = 0
  if (testStartTime.value && testEndTime.value) {
    timeSpent = Math.round((testEndTime.value - testStartTime.value) / 1000)
  }
  
  const minutes = Math.floor(timeSpent / 60)
  const seconds = timeSpent % 60
  const timeFormatted = `${minutes}:${seconds.toString().padStart(2, '0')}`
  
  return {
    total,
    correct,
    skipped,
    errors,
    hints,
    score,
    maxScore,
    percentage,
    level,
    levelColor,
    levelIcon,
    message,
    timeSpent,
    timeFormatted
  }
})

watch(isTestComplete, (newVal) => {
  if (newVal) {
    testEndTime.value = Date.now()
    setTimeout(() => {
      showResults.value = true
    }, 1000)
  }
})

const checkAnswer = () => {
  const expected = challenge.value.expected
  const alternatives = challenge.value.alternatives || []
  const input = userInput.value.trim()
  
  if (input === expected || alternatives.includes(input)) {
    isCorrect.value = true
    if (!completedChallenges.value.includes(challenge.value.id)) {
      completedChallenges.value.push(challenge.value.id)
    }
    terminalHistory.value.push({
      type: 'success',
      text: `${t('practice.correct')} ${input}`
    })
    setTimeout(() => {
      if (currentChallenge.value < challenges.value.length - 1 && !isTestComplete.value) {
        nextChallenge()
      }
    }, 1000)
  } else {
    isCorrect.value = false
    wrongAttempts.value++
    terminalHistory.value.push({
      type: 'error',
      text: `${t('practice.incorrect')} ${input || t('practice.empty')}`
    })
  }
}

const nextChallenge = () => {
  let next = currentChallenge.value + 1
  while (next < challenges.value.length && completedChallenges.value.includes(challenges.value[next].id)) {
    next++
  }
  
  if (next >= challenges.value.length) {
    next = 0
    while (next < challenges.value.length && completedChallenges.value.includes(challenges.value[next].id)) {
      next++
    }
  }
  
  if (next < challenges.value.length) {
    currentChallenge.value = next
    userInput.value = ''
    isCorrect.value = null
    showHint.value = false
    terminalHistory.value.push({
      type: 'info',
      text: `${t('practice.task')} ${next + 1} ---`
    })
  }
}

const prevChallenge = () => {
  currentChallenge.value = currentChallenge.value === 0 
    ? challenges.value.length - 1 
    : currentChallenge.value - 1
  userInput.value = ''
  isCorrect.value = null
  showHint.value = false
}

const skipChallenge = () => {
  if (!skippedChallenges.value.includes(challenge.value.id)) {
    skippedChallenges.value.push(challenge.value.id)
  }
  if (!completedChallenges.value.includes(challenge.value.id)) {
    completedChallenges.value.push(challenge.value.id)
  }
  terminalHistory.value.push({
    type: 'hint',
    text: `${t('practice.answer')} ${challenge.value.expected}`
  })
  setTimeout(() => {
    if (!isTestComplete.value) {
      nextChallenge()
    }
  }, 1500)
}

const toggleHint = () => {
  if (!showHint.value) {
    hintsUsed.value++
  }
  showHint.value = !showHint.value
}

const resetProgress = () => {
  completedChallenges.value = []
  currentChallenge.value = 0
  terminalHistory.value = []
  userInput.value = ''
  isCorrect.value = null
  showHint.value = false
  wrongAttempts.value = 0
  hintsUsed.value = 0
  skippedChallenges.value = []
  showResults.value = false
  testStartTime.value = Date.now()
  testEndTime.value = null
  
  terminalHistory.value.push({
    type: 'info',
    text: t('practice.practiceMode')
  })
}

const handleKeydown = (e) => {
  if (e.key === 'Enter') {
    e.preventDefault()
    checkAnswer()
  }
}

const closeResults = () => {
  showResults.value = false
}

onMounted(() => {
  testStartTime.value = Date.now()
  terminalHistory.value.push({
    type: 'info',
    text: t('practice.practiceMode')
  })
})
</script>

<template>
  <section class="practice-section" id="practice">
    <div class="section-header">
      <span class="section-tag">:practice</span>
      <h2>{{ t('practice.title') }}</h2>
      <p>{{ t('practice.description') }}</p>
    </div>
    
    <!-- Results Modal -->
    <Transition name="modal">
      <div v-if="showResults" class="results-overlay" @click.self="closeResults">
        <div class="results-modal terminal-window">
          <div class="terminal-header">
            <span class="terminal-btn red"></span>
            <span class="terminal-btn yellow"></span>
            <span class="terminal-btn green"></span>
            <span class="terminal-title">{{ t('practice.results.title') }}</span>
          </div>
          <div class="terminal-body results-body">
            <div class="results-hero">
              <div class="level-badge" :style="{ '--level-color': testResults.levelColor }">
                <span class="level-icon">{{ testResults.levelIcon }}</span>
                <span class="level-name">{{ testResults.level }}</span>
              </div>
              <div class="score-display">
                <span class="score-value">{{ testResults.percentage }}%</span>
                <span class="score-label">{{ testResults.score }} / {{ testResults.maxScore }} {{ t('practice.results.score') }}</span>
              </div>
              <p class="results-message">{{ testResults.message }}</p>
            </div>
            
            <div class="results-stats">
              <div class="stat-box correct">
                <span class="stat-icon">✓</span>
                <span class="stat-num">{{ testResults.correct - testResults.skipped }}</span>
                <span class="stat-label">{{ t('practice.results.stats.correct') }}</span>
              </div>
              <div class="stat-box skipped">
                <span class="stat-icon">→</span>
                <span class="stat-num">{{ testResults.skipped }}</span>
                <span class="stat-label">{{ t('practice.results.stats.skipped') }}</span>
              </div>
              <div class="stat-box errors">
                <span class="stat-icon">✗</span>
                <span class="stat-num">{{ testResults.errors }}</span>
                <span class="stat-label">{{ t('practice.results.stats.errors') }}</span>
              </div>
              <div class="stat-box hints">
                <span class="stat-icon">💡</span>
                <span class="stat-num">{{ testResults.hints }}</span>
                <span class="stat-label">{{ t('practice.results.stats.hints') }}</span>
              </div>
            </div>
            
            <div class="results-time">
              <span class="time-icon">⏱</span>
              <span>{{ t('practice.results.time') }} <strong>{{ testResults.timeFormatted }}</strong></span>
            </div>
            
            <div class="results-breakdown">
              <div class="breakdown-title">{{ t('practice.results.breakdown') }}</div>
              <div class="breakdown-item">
                <span>{{ t('practice.results.correctAnswers') }}</span>
                <span class="breakdown-value positive">+{{ (testResults.correct - testResults.skipped) * 100 }} {{ t('practice.results.points') }}</span>
              </div>
              <div class="breakdown-item" v-if="testResults.errors > 0">
                <span>{{ t('practice.results.errorPenalty') }}</span>
                <span class="breakdown-value negative">-{{ testResults.errors * 10 }} {{ t('practice.results.points') }}</span>
              </div>
              <div class="breakdown-item" v-if="testResults.hints > 0">
                <span>{{ t('practice.results.hintPenalty') }}</span>
                <span class="breakdown-value negative">-{{ testResults.hints * 15 }} {{ t('practice.results.points') }}</span>
              </div>
              <div class="breakdown-item" v-if="testResults.skipped > 0">
                <span>{{ t('practice.results.skipPenalty') }}</span>
                <span class="breakdown-value negative">-{{ testResults.skipped * 50 }} {{ t('practice.results.points') }}</span>
              </div>
            </div>
            
            <div class="results-actions">
              <button class="result-btn primary" @click="resetProgress">
                <span>🔄</span> {{ t('practice.results.tryAgain') }}
              </button>
              <button class="result-btn" @click="closeResults">
                <span>📋</span> {{ t('practice.results.viewAnswers') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
    
    <div class="practice-container">
      <div class="practice-terminal terminal-window">
        <div class="terminal-header">
          <span class="terminal-btn red"></span>
          <span class="terminal-btn yellow"></span>
          <span class="terminal-btn green"></span>
          <span class="terminal-title">vim-practice</span>
        </div>
        <div class="terminal-body">
          <div class="terminal-output">
            <div 
              v-for="(line, i) in terminalHistory.slice(-8)" 
              :key="i"
              class="output-line"
              :class="line.type"
            >
              {{ line.text }}
            </div>
          </div>
          
          <div class="challenge-box" :class="{ 'completed': completedChallenges.includes(challenge.id) }">
            <div class="challenge-category">{{ challenge.category }}</div>
            <div class="challenge-task">
              <span class="prompt">❯</span>
              {{ challenge.task }}
            </div>
            <div v-if="completedChallenges.includes(challenge.id)" class="challenge-done">
              ✓ {{ t('practice.completed') }}
            </div>
          </div>
          
          <div class="input-area">
            <span class="input-prompt">:</span>
            <input 
              v-model="userInput"
              type="text"
              class="vim-input"
              :class="{ 
                'correct': isCorrect === true, 
                'incorrect': isCorrect === false 
              }"
              :placeholder="t('practice.inputPlaceholder')"
              @keydown="handleKeydown"
              :disabled="isTestComplete"
            >
            <span class="cursor-block">█</span>
          </div>
          
          <div v-if="showHint" class="hint-box">
            <span class="hint-icon">💡</span>
            {{ challenge.hint }}
          </div>
          
          <div v-if="isTestComplete && !showResults" class="complete-banner">
            {{ t('practice.testComplete') }}
          </div>
        </div>
      </div>
      
      <div class="practice-sidebar">
        <div class="progress-card">
          <div class="progress-header">
            <span>{{ t('practice.progress') }}</span>
            <span class="progress-value">{{ completedChallenges.length }}/{{ challenges.length }}</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: progress + '%' }"></div>
          </div>
          <div class="progress-percent">{{ progress }}%</div>
        </div>
        
        <div class="controls-card">
          <button class="control-btn primary" @click="checkAnswer" :disabled="isTestComplete">
            <span>{{ t('practice.check') }}</span>
            <kbd>Enter</kbd>
          </button>
          <button class="control-btn" @click="toggleHint">
            <span>{{ showHint ? t('practice.hideHint') : t('practice.hint') }}</span>
            <kbd>?</kbd>
          </button>
          <button class="control-btn" @click="skipChallenge" :disabled="isTestComplete">
            <span>{{ t('practice.skip') }}</span>
            <kbd>→</kbd>
          </button>
        </div>
        
        <div class="navigation-card">
          <div class="nav-header">{{ t('practice.navigation') }}</div>
          <div class="nav-buttons">
            <button class="nav-btn" @click="prevChallenge">
              <span>←</span> {{ t('practice.prev') }}
            </button>
            <button class="nav-btn" @click="nextChallenge" :disabled="isTestComplete">
              {{ t('practice.next') }} <span>→</span>
            </button>
          </div>
          <button class="reset-btn" @click="resetProgress">
            {{ isTestComplete ? t('practice.tryAgain') : t('practice.reset') }}
          </button>
        </div>
        
        <div class="stats-card">
          <div class="stat-item">
            <span class="stat-label">{{ t('practice.current') }}</span>
            <span class="stat-value">{{ currentChallenge + 1 }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">{{ t('practice.completed') }}</span>
            <span class="stat-value success">{{ completedChallenges.length }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">{{ t('practice.errors') }}</span>
            <span class="stat-value" :class="{ 'error': wrongAttempts > 0 }">{{ wrongAttempts }}</span>
          </div>
        </div>
        
        <button v-if="isTestComplete" class="show-results-btn" @click="showResults = true">
          {{ t('practice.showResults') }}
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.practice-section {
  padding: 100px 0;
}

.section-header {
  text-align: center;
  margin-bottom: 50px;
}

.section-tag {
  display: inline-block;
  padding: 6px 12px;
  background: var(--bg-secondary);
  border: 1px solid var(--accent-purple);
  border-radius: 4px;
  color: var(--accent-purple);
  font-size: 0.875rem;
  margin-bottom: 16px;
}

.section-header h2 {
  font-size: 2.5rem;
  margin-bottom: 12px;
}

.section-header p {
  font-size: 1.1rem;
  color: var(--text-secondary);
}

.practice-container {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 24px;
}

.practice-terminal {
  min-height: 500px;
}

.terminal-output {
  min-height: 120px;
  padding: 16px;
  background: var(--bg-tertiary);
  border-radius: 6px;
  margin-bottom: 20px;
  font-size: 0.85rem;
}

.output-line {
  padding: 4px 0;
  opacity: 0;
  animation: fade-in 0.3s ease forwards;
}

.output-line.success {
  color: var(--accent-green);
}

.output-line.error {
  color: var(--accent-red);
}

.output-line.info {
  color: var(--text-muted);
}

.output-line.hint {
  color: var(--accent-yellow);
}

.challenge-box {
  padding: 24px;
  background: linear-gradient(135deg, var(--bg-tertiary) 0%, var(--bg-secondary) 100%);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  margin-bottom: 20px;
  position: relative;
  transition: all 0.3s;
}

.challenge-box.completed {
  border-color: var(--accent-green);
  background: linear-gradient(135deg, rgba(63, 185, 80, 0.1) 0%, var(--bg-secondary) 100%);
}

.challenge-done {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 4px 10px;
  background: var(--accent-green);
  color: var(--bg-primary);
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
}

.challenge-category {
  display: inline-block;
  padding: 4px 10px;
  background: var(--accent-purple);
  color: var(--bg-primary);
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-bottom: 12px;
}

.challenge-task {
  font-size: 1.25rem;
  color: var(--text-primary);
}

.challenge-task .prompt {
  color: var(--accent-green);
  margin-right: 8px;
}

.input-area {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px;
  background: var(--bg-primary);
  border: 2px solid var(--border-color);
  border-radius: 6px;
  transition: border-color 0.2s;
}

.input-area:focus-within {
  border-color: var(--accent-cyan);
}

.input-prompt {
  color: var(--accent-yellow);
  font-size: 1.25rem;
  font-weight: 600;
}

.vim-input {
  flex: 1;
  background: transparent;
  border: none;
  color: var(--text-primary);
  font-family: var(--font-mono);
  font-size: 1.1rem;
  outline: none;
}

.vim-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.vim-input.correct {
  color: var(--accent-green);
  text-shadow: 0 0 10px var(--glow-green);
}

.vim-input.incorrect {
  color: var(--accent-red);
}

.vim-input::placeholder {
  color: var(--text-muted);
}

.cursor-block {
  color: var(--accent-green);
  animation: blink 1s step-end infinite;
}

.hint-box {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 16px;
  padding: 12px 16px;
  background: rgba(210, 153, 34, 0.1);
  border: 1px solid var(--accent-yellow);
  border-radius: 6px;
  color: var(--accent-yellow);
  font-size: 0.9rem;
  animation: fade-in 0.3s ease;
}

.complete-banner {
  margin-top: 20px;
  padding: 16px;
  background: linear-gradient(135deg, rgba(63, 185, 80, 0.2) 0%, rgba(88, 166, 255, 0.2) 100%);
  border: 1px solid var(--accent-green);
  border-radius: 8px;
  text-align: center;
  color: var(--accent-green);
  font-size: 1.1rem;
  animation: fade-in 0.5s ease;
}

.practice-sidebar {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.progress-card,
.controls-card,
.navigation-card,
.stats-card {
  padding: 20px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.progress-value {
  color: var(--accent-cyan);
  font-weight: 600;
}

.progress-bar {
  height: 8px;
  background: var(--bg-tertiary);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--accent-green), var(--accent-cyan));
  border-radius: 4px;
  transition: width 0.5s ease;
}

.progress-percent {
  text-align: center;
  color: var(--accent-green);
  font-size: 1.5rem;
  font-weight: 700;
}

.control-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 12px 16px;
  margin-bottom: 8px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  color: var(--text-primary);
  font-family: var(--font-mono);
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.control-btn:last-child {
  margin-bottom: 0;
}

.control-btn:hover:not(:disabled) {
  background: var(--bg-primary);
  border-color: var(--accent-cyan);
}

.control-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.control-btn.primary {
  background: var(--accent-green);
  border-color: var(--accent-green);
  color: var(--bg-primary);
}

.control-btn.primary:hover:not(:disabled) {
  box-shadow: 0 4px 15px var(--glow-green);
}

.control-btn kbd {
  padding: 4px 8px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  font-size: 0.75rem;
}

.nav-header {
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin-bottom: 12px;
}

.nav-buttons {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.nav-btn {
  flex: 1;
  padding: 10px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  color: var(--text-secondary);
  font-family: var(--font-mono);
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
}

.nav-btn:hover:not(:disabled) {
  background: var(--bg-primary);
  color: var(--text-primary);
}

.nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.reset-btn {
  width: 100%;
  padding: 10px;
  background: transparent;
  border: 1px solid var(--accent-red);
  border-radius: 6px;
  color: var(--accent-red);
  font-family: var(--font-mono);
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
}

.reset-btn:hover {
  background: var(--accent-red);
  color: var(--bg-primary);
}

.stats-card {
  display: flex;
  justify-content: space-between;
}

.stat-item {
  text-align: center;
}

.stat-label {
  display: block;
  color: var(--text-muted);
  font-size: 0.7rem;
  text-transform: uppercase;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
}

.stat-value.success {
  color: var(--accent-green);
}

.stat-value.error {
  color: var(--accent-red);
}

.show-results-btn {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, var(--accent-purple) 0%, var(--accent-cyan) 100%);
  border: none;
  border-radius: 8px;
  color: white;
  font-family: var(--font-mono);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.show-results-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(163, 113, 247, 0.4);
}

/* Results Modal */
.results-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.results-modal {
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.results-body {
  padding: 30px;
}

.results-hero {
  text-align: center;
  margin-bottom: 30px;
}

.level-badge {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 24px;
  background: linear-gradient(135deg, var(--bg-tertiary) 0%, var(--bg-secondary) 100%);
  border: 2px solid var(--level-color);
  border-radius: 50px;
  margin-bottom: 20px;
  box-shadow: 0 0 30px color-mix(in srgb, var(--level-color) 30%, transparent);
}

.level-icon {
  font-size: 1.5rem;
}

.level-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--level-color);
}

.score-display {
  margin-bottom: 16px;
}

.score-value {
  display: block;
  font-size: 4rem;
  font-weight: 700;
  background: linear-gradient(135deg, var(--accent-green), var(--accent-cyan));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
}

.score-label {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.results-message {
  color: var(--text-primary);
  font-size: 1.1rem;
}

.results-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 24px;
}

.stat-box {
  padding: 16px 12px;
  background: var(--bg-tertiary);
  border-radius: 8px;
  text-align: center;
}

.stat-box .stat-icon {
  display: block;
  font-size: 1.25rem;
  margin-bottom: 8px;
}

.stat-box .stat-num {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
}

.stat-box .stat-label {
  display: block;
  font-size: 0.7rem;
  color: var(--text-muted);
  text-transform: uppercase;
  margin-top: 4px;
}

.stat-box.correct .stat-num { color: var(--accent-green); }
.stat-box.skipped .stat-num { color: var(--accent-yellow); }
.stat-box.errors .stat-num { color: var(--accent-red); }
.stat-box.hints .stat-num { color: var(--accent-cyan); }

.results-time {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  background: var(--bg-tertiary);
  border-radius: 6px;
  margin-bottom: 24px;
  color: var(--text-secondary);
}

.results-time strong {
  color: var(--accent-cyan);
}

.results-breakdown {
  padding: 20px;
  background: var(--bg-tertiary);
  border-radius: 8px;
  margin-bottom: 24px;
}

.breakdown-title {
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border-color);
}

.breakdown-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.breakdown-value {
  font-weight: 600;
}

.breakdown-value.positive {
  color: var(--accent-green);
}

.breakdown-value.negative {
  color: var(--accent-red);
}

.results-actions {
  display: flex;
  gap: 12px;
}

.result-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 20px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-tertiary);
  color: var(--text-primary);
  font-family: var(--font-mono);
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
}

.result-btn:hover {
  background: var(--bg-primary);
  border-color: var(--accent-cyan);
}

.result-btn.primary {
  background: var(--accent-green);
  border-color: var(--accent-green);
  color: var(--bg-primary);
}

.result-btn.primary:hover {
  box-shadow: 0 4px 15px var(--glow-green);
}

/* Modal transitions */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .results-modal,
.modal-leave-to .results-modal {
  transform: scale(0.9) translateY(20px);
}

@media (max-width: 1024px) {
  .practice-container {
    grid-template-columns: 1fr;
  }
  
  .practice-sidebar {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
  
  .show-results-btn {
    grid-column: span 2;
  }
}

@media (max-width: 640px) {
  .practice-sidebar {
    grid-template-columns: 1fr;
  }
  
  .show-results-btn {
    grid-column: span 1;
  }
  
  .results-stats {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .results-actions {
    flex-direction: column;
  }
}
</style>
