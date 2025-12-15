<script setup>
import { ref, computed, inject } from 'vue'

const { t } = inject('i18n')

const activeCategory = ref('all')
const searchQuery = ref('')

const categories = computed(() => [
  { id: 'all', name: t('cheatsheet.categories.all'), icon: '*' },
  { id: 'motion', name: t('cheatsheet.categories.motion'), icon: '→' },
  { id: 'edit', name: t('cheatsheet.categories.edit'), icon: '✎' },
  { id: 'search', name: t('cheatsheet.categories.search'), icon: '?' },
  { id: 'file', name: t('cheatsheet.categories.file'), icon: '📁' },
  { id: 'advanced', name: t('cheatsheet.categories.advanced'), icon: '⚡' }
])

const commands = computed(() => [
  // Motion
  { keys: ['h'], desc: t('cheatsheet.commands.left'), category: 'motion' },
  { keys: ['j'], desc: t('cheatsheet.commands.down'), category: 'motion' },
  { keys: ['k'], desc: t('cheatsheet.commands.up'), category: 'motion' },
  { keys: ['l'], desc: t('cheatsheet.commands.right'), category: 'motion' },
  { keys: ['w'], desc: t('cheatsheet.commands.nextWord'), category: 'motion' },
  { keys: ['W'], desc: t('cheatsheet.commands.nextWORD'), category: 'motion' },
  { keys: ['b'], desc: t('cheatsheet.commands.prevWord'), category: 'motion' },
  { keys: ['B'], desc: t('cheatsheet.commands.prevWORD'), category: 'motion' },
  { keys: ['e'], desc: t('cheatsheet.commands.endWord'), category: 'motion' },
  { keys: ['0'], desc: t('cheatsheet.commands.lineStart'), category: 'motion' },
  { keys: ['^'], desc: t('cheatsheet.commands.firstChar'), category: 'motion' },
  { keys: ['$'], desc: t('cheatsheet.commands.lineEnd'), category: 'motion' },
  { keys: ['gg'], desc: t('cheatsheet.commands.fileStart'), category: 'motion' },
  { keys: ['G'], desc: t('cheatsheet.commands.fileEnd'), category: 'motion' },
  { keys: ['5G'], desc: t('cheatsheet.commands.goToLine'), category: 'motion' },
  { keys: ['Ctrl+d'], desc: t('cheatsheet.commands.scrollDown'), category: 'motion' },
  { keys: ['Ctrl+u'], desc: t('cheatsheet.commands.scrollUp'), category: 'motion' },
  { keys: ['%'], desc: t('cheatsheet.commands.matchBracket'), category: 'motion' },
  { keys: ['{'], desc: t('cheatsheet.commands.prevParagraph'), category: 'motion' },
  { keys: ['}'], desc: t('cheatsheet.commands.nextParagraph'), category: 'motion' },
  
  // Edit
  { keys: ['i'], desc: t('cheatsheet.commands.insertBefore'), category: 'edit' },
  { keys: ['I'], desc: t('cheatsheet.commands.insertLineStart'), category: 'edit' },
  { keys: ['a'], desc: t('cheatsheet.commands.insertAfter'), category: 'edit' },
  { keys: ['A'], desc: t('cheatsheet.commands.insertLineEnd'), category: 'edit' },
  { keys: ['o'], desc: t('cheatsheet.commands.newLineBelow'), category: 'edit' },
  { keys: ['O'], desc: t('cheatsheet.commands.newLineAbove'), category: 'edit' },
  { keys: ['x'], desc: t('cheatsheet.commands.deleteChar'), category: 'edit' },
  { keys: ['X'], desc: t('cheatsheet.commands.deleteCharLeft'), category: 'edit' },
  { keys: ['dd'], desc: t('cheatsheet.commands.deleteLine'), category: 'edit' },
  { keys: ['dw'], desc: t('cheatsheet.commands.deleteWord'), category: 'edit' },
  { keys: ['d$', 'D'], desc: t('cheatsheet.commands.deleteToEnd'), category: 'edit' },
  { keys: ['cc'], desc: t('cheatsheet.commands.changeLine'), category: 'edit' },
  { keys: ['cw'], desc: t('cheatsheet.commands.changeWord'), category: 'edit' },
  { keys: ['c$', 'C'], desc: t('cheatsheet.commands.changeToEnd'), category: 'edit' },
  { keys: ['yy'], desc: t('cheatsheet.commands.copyLine'), category: 'edit' },
  { keys: ['yw'], desc: t('cheatsheet.commands.copyWord'), category: 'edit' },
  { keys: ['p'], desc: t('cheatsheet.commands.pasteAfter'), category: 'edit' },
  { keys: ['P'], desc: t('cheatsheet.commands.pasteBefore'), category: 'edit' },
  { keys: ['u'], desc: t('cheatsheet.commands.undo'), category: 'edit' },
  { keys: ['Ctrl+r'], desc: t('cheatsheet.commands.redo'), category: 'edit' },
  { keys: ['.'], desc: t('cheatsheet.commands.repeatLast'), category: 'edit' },
  { keys: ['r'], desc: t('cheatsheet.commands.replaceChar'), category: 'edit' },
  { keys: ['R'], desc: t('cheatsheet.commands.replaceMode'), category: 'edit' },
  { keys: ['J'], desc: t('cheatsheet.commands.joinLines'), category: 'edit' },
  { keys: ['~'], desc: t('cheatsheet.commands.changeCase'), category: 'edit' },
  { keys: ['>>'], desc: t('cheatsheet.commands.indentRight'), category: 'edit' },
  { keys: ['<<'], desc: t('cheatsheet.commands.indentLeft'), category: 'edit' },
  
  // Search
  { keys: ['/'], desc: t('cheatsheet.commands.searchForward'), category: 'search' },
  { keys: ['?'], desc: t('cheatsheet.commands.searchBackward'), category: 'search' },
  { keys: ['n'], desc: t('cheatsheet.commands.nextResult'), category: 'search' },
  { keys: ['N'], desc: t('cheatsheet.commands.prevResult'), category: 'search' },
  { keys: ['*'], desc: t('cheatsheet.commands.searchWordForward'), category: 'search' },
  { keys: ['#'], desc: t('cheatsheet.commands.searchWordBackward'), category: 'search' },
  { keys: ['f{char}'], desc: t('cheatsheet.commands.findChar'), category: 'search' },
  { keys: ['F{char}'], desc: t('cheatsheet.commands.findCharBack'), category: 'search' },
  { keys: ['t{char}'], desc: t('cheatsheet.commands.toChar'), category: 'search' },
  { keys: [';'], desc: t('cheatsheet.commands.repeatFind'), category: 'search' },
  { keys: [','], desc: t('cheatsheet.commands.repeatFindBack'), category: 'search' },
  { keys: [':%s/a/b/g'], desc: t('cheatsheet.commands.replaceAll'), category: 'search' },
  { keys: [':s/a/b/g'], desc: t('cheatsheet.commands.replaceLine'), category: 'search' },
  
  // File
  { keys: [':w'], desc: t('cheatsheet.commands.save'), category: 'file' },
  { keys: [':w file'], desc: t('cheatsheet.commands.saveAs'), category: 'file' },
  { keys: [':q'], desc: t('cheatsheet.commands.quit'), category: 'file' },
  { keys: [':q!'], desc: t('cheatsheet.commands.forceQuit'), category: 'file' },
  { keys: [':wq', ':x', 'ZZ'], desc: t('cheatsheet.commands.saveQuit'), category: 'file' },
  { keys: [':e file'], desc: t('cheatsheet.commands.openFile'), category: 'file' },
  { keys: [':e!'], desc: t('cheatsheet.commands.reloadFile'), category: 'file' },
  { keys: [':bn'], desc: t('cheatsheet.commands.nextBuffer'), category: 'file' },
  { keys: [':bp'], desc: t('cheatsheet.commands.prevBuffer'), category: 'file' },
  { keys: [':bd'], desc: t('cheatsheet.commands.closeBuffer'), category: 'file' },
  { keys: [':ls'], desc: t('cheatsheet.commands.listBuffers'), category: 'file' },
  { keys: [':sp'], desc: t('cheatsheet.commands.splitHorizontal'), category: 'file' },
  { keys: [':vsp'], desc: t('cheatsheet.commands.splitVertical'), category: 'file' },
  { keys: ['Ctrl+w w'], desc: t('cheatsheet.commands.switchWindow'), category: 'file' },
  { keys: ['Ctrl+w q'], desc: t('cheatsheet.commands.closeWindow'), category: 'file' },
  
  // Advanced
  { keys: ['v'], desc: t('cheatsheet.commands.visualChar'), category: 'advanced' },
  { keys: ['V'], desc: t('cheatsheet.commands.visualLine'), category: 'advanced' },
  { keys: ['Ctrl+v'], desc: t('cheatsheet.commands.visualBlock'), category: 'advanced' },
  { keys: ['gv'], desc: t('cheatsheet.commands.reselect'), category: 'advanced' },
  { keys: ['q{reg}'], desc: t('cheatsheet.commands.recordMacro'), category: 'advanced' },
  { keys: ['@{reg}'], desc: t('cheatsheet.commands.playMacro'), category: 'advanced' },
  { keys: ['@@'], desc: t('cheatsheet.commands.repeatMacro'), category: 'advanced' },
  { keys: ['"{reg}y'], desc: t('cheatsheet.commands.copyToReg'), category: 'advanced' },
  { keys: ['"{reg}p'], desc: t('cheatsheet.commands.pasteFromReg'), category: 'advanced' },
  { keys: [':reg'], desc: t('cheatsheet.commands.showRegisters'), category: 'advanced' },
  { keys: ['m{a-z}'], desc: t('cheatsheet.commands.setMark'), category: 'advanced' },
  { keys: ["'{a-z}"], desc: t('cheatsheet.commands.goToMark'), category: 'advanced' },
  { keys: ['Ctrl+o'], desc: t('cheatsheet.commands.prevPosition'), category: 'advanced' },
  { keys: ['Ctrl+i'], desc: t('cheatsheet.commands.nextPosition'), category: 'advanced' },
  { keys: ['za'], desc: t('cheatsheet.commands.toggleFold'), category: 'advanced' },
  { keys: ['zR'], desc: t('cheatsheet.commands.openAllFolds'), category: 'advanced' },
  { keys: ['zM'], desc: t('cheatsheet.commands.closeAllFolds'), category: 'advanced' },
  { keys: ['ciw'], desc: t('cheatsheet.commands.changeInnerWord'), category: 'advanced' },
  { keys: ['ci"'], desc: t('cheatsheet.commands.changeInnerQuotes'), category: 'advanced' },
  { keys: ['di('], desc: t('cheatsheet.commands.deleteInnerParen'), category: 'advanced' },
  { keys: ['da{'], desc: t('cheatsheet.commands.deleteAroundBrace'), category: 'advanced' }
])

const filteredCommands = computed(() => {
  let result = commands.value
  
  if (activeCategory.value !== 'all') {
    result = result.filter(cmd => cmd.category === activeCategory.value)
  }
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(cmd => 
      cmd.desc.toLowerCase().includes(query) ||
      cmd.keys.some(k => k.toLowerCase().includes(query))
    )
  }
  
  return result
})

const getCategoryColor = (category) => {
  const colors = {
    motion: 'var(--accent-cyan)',
    edit: 'var(--accent-green)',
    search: 'var(--accent-yellow)',
    file: 'var(--accent-purple)',
    advanced: 'var(--accent-orange)'
  }
  return colors[category] || 'var(--text-secondary)'
}
</script>

<template>
  <section class="cheatsheet-section" id="cheatsheet">
    <div class="section-header">
      <span class="section-tag">:keys</span>
      <h2>{{ t('cheatsheet.title') }}</h2>
      <p>{{ t('cheatsheet.description') }}</p>
    </div>
    
    <div class="cheatsheet-controls">
      <div class="search-box">
        <span class="search-icon">/</span>
        <input 
          v-model="searchQuery"
          type="text" 
          :placeholder="t('cheatsheet.search')"
          class="search-input"
        >
        <span class="search-hint">{{ t('cheatsheet.searchHint') }}</span>
      </div>
      
      <div class="category-tabs">
        <button
          v-for="cat in categories"
          :key="cat.id"
          class="category-tab"
          :class="{ active: activeCategory === cat.id }"
          @click="activeCategory = cat.id"
        >
          <span class="cat-icon">{{ cat.icon }}</span>
          <span class="cat-name">{{ cat.name }}</span>
        </button>
      </div>
    </div>
    
    <div class="commands-grid">
      <div 
        v-for="cmd in filteredCommands"
        :key="cmd.keys.join('-')"
        class="command-card"
        :style="{ '--cat-color': getCategoryColor(cmd.category) }"
      >
        <div class="card-keys">
          <kbd v-for="key in cmd.keys" :key="key">{{ key }}</kbd>
        </div>
        <div class="card-desc">{{ cmd.desc }}</div>
        <div class="card-category">{{ cmd.category }}</div>
      </div>
    </div>
    
    <div v-if="filteredCommands.length === 0" class="no-results">
      <span class="no-results-icon">🔍</span>
      <p>{{ t('cheatsheet.noResults') }}</p>
    </div>
    
    <div class="cheatsheet-footer">
      <div class="tip-box">
        <span class="tip-icon">💡</span>
        <span>{{ t('cheatsheet.tip') }} <kbd>d2w</kbd> {{ t('cheatsheet.tipExample') }} <kbd>5j</kbd> {{ t('cheatsheet.tipExample2') }}</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cheatsheet-section {
  padding: 100px 0;
}

.section-header {
  text-align: center;
  margin-bottom: 40px;
}

.section-tag {
  display: inline-block;
  padding: 6px 12px;
  background: var(--bg-secondary);
  border: 1px solid var(--accent-cyan);
  border-radius: 4px;
  color: var(--accent-cyan);
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

.cheatsheet-controls {
  margin-bottom: 40px;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  margin-bottom: 20px;
  transition: border-color 0.2s;
}

.search-box:focus-within {
  border-color: var(--accent-cyan);
}

.search-icon {
  color: var(--accent-yellow);
  font-size: 1.25rem;
  font-weight: 600;
}

.search-input {
  flex: 1;
  background: transparent;
  border: none;
  color: var(--text-primary);
  font-family: var(--font-mono);
  font-size: 1rem;
  outline: none;
}

.search-input::placeholder {
  color: var(--text-muted);
}

.search-hint {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.category-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.category-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  color: var(--text-secondary);
  font-family: var(--font-mono);
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.category-tab:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

.category-tab.active {
  background: var(--accent-cyan);
  border-color: var(--accent-cyan);
  color: var(--bg-primary);
}

.cat-icon {
  font-size: 1rem;
}

.commands-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.command-card {
  padding: 20px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  transition: all 0.2s;
  position: relative;
  overflow: hidden;
}

.command-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 3px;
  height: 100%;
  background: var(--cat-color);
}

.command-card:hover {
  border-color: var(--cat-color);
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.card-keys {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.card-keys kbd {
  padding: 6px 12px;
  background: var(--bg-tertiary);
  border: 1px solid var(--cat-color);
  border-radius: 4px;
  color: var(--cat-color);
  font-size: 0.9rem;
  font-weight: 600;
}

.card-desc {
  color: var(--text-primary);
  font-size: 0.95rem;
  line-height: 1.5;
}

.card-category {
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 2px 8px;
  background: var(--bg-tertiary);
  border-radius: 4px;
  font-size: 0.65rem;
  color: var(--text-muted);
  text-transform: uppercase;
}

.no-results {
  text-align: center;
  padding: 60px 20px;
  color: var(--text-secondary);
}

.no-results-icon {
  font-size: 3rem;
  display: block;
  margin-bottom: 16px;
}

.cheatsheet-footer {
  margin-top: 40px;
}

.tip-box {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  background: var(--bg-secondary);
  border: 1px solid var(--accent-yellow);
  border-radius: 8px;
  color: var(--text-secondary);
}

.tip-box kbd {
  padding: 3px 8px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  color: var(--accent-cyan);
  font-size: 0.85rem;
}

@media (max-width: 768px) {
  .category-tabs {
    overflow-x: auto;
    flex-wrap: nowrap;
    padding-bottom: 8px;
  }
  
  .category-tab {
    white-space: nowrap;
  }
}
</style>
