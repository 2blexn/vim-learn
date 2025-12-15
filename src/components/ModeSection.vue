<script setup>
import { ref, inject, computed } from 'vue'

const { t } = inject('i18n')

const activeMode = ref('normal')

const modes = computed(() => [
  {
    id: 'normal',
    name: t('modes.normal.name'),
    key: 'Esc',
    color: '#3fb950',
    icon: '◆',
    description: t('modes.normal.desc'),
    commands: [
      { keys: ['h', 'j', 'k', 'l'], desc: t('modes.commands.cursorMove') },
      { keys: ['w', 'b'], desc: t('modes.commands.wordForwardBack') },
      { keys: ['0', '$'], desc: t('modes.commands.lineStartEnd') },
      { keys: ['gg', 'G'], desc: t('modes.commands.fileStartEnd') },
      { keys: ['dd'], desc: t('modes.commands.deleteLine') },
      { keys: ['yy'], desc: t('modes.commands.copyLine') },
      { keys: ['p'], desc: t('modes.commands.paste') },
      { keys: ['u'], desc: t('modes.commands.undo') }
    ]
  },
  {
    id: 'insert',
    name: t('modes.insert.name'),
    key: 'i',
    color: '#58a6ff',
    icon: '◇',
    description: t('modes.insert.desc'),
    commands: [
      { keys: ['i'], desc: t('modes.commands.insertBefore') },
      { keys: ['I'], desc: t('modes.commands.insertLineStart') },
      { keys: ['a'], desc: t('modes.commands.insertAfter') },
      { keys: ['A'], desc: t('modes.commands.insertLineEnd') },
      { keys: ['o'], desc: t('modes.commands.newLineBelow') },
      { keys: ['O'], desc: t('modes.commands.newLineAbove') },
      { keys: ['Esc'], desc: t('modes.commands.returnNormal') }
    ]
  },
  {
    id: 'visual',
    name: t('modes.visual.name'),
    key: 'v',
    color: '#a371f7',
    icon: '▣',
    description: t('modes.visual.desc'),
    commands: [
      { keys: ['v'], desc: t('modes.commands.charSelect') },
      { keys: ['V'], desc: t('modes.commands.lineSelect') },
      { keys: ['Ctrl+v'], desc: t('modes.commands.blockSelect') },
      { keys: ['d'], desc: t('modes.commands.deleteSelected') },
      { keys: ['y'], desc: t('modes.commands.copySelected') },
      { keys: ['>', '<'], desc: t('modes.commands.indentRightLeft') },
      { keys: ['~'], desc: t('modes.commands.changeCase') }
    ]
  },
  {
    id: 'command',
    name: t('modes.command.name'),
    key: ':',
    color: '#d29922',
    icon: '▶',
    description: t('modes.command.desc'),
    commands: [
      { keys: [':w'], desc: t('modes.commands.save') },
      { keys: [':q'], desc: t('modes.commands.quit') },
      { keys: [':wq', ':x'], desc: t('modes.commands.saveQuit') },
      { keys: [':q!'], desc: t('modes.commands.forceQuit') },
      { keys: [':%s/a/b/g'], desc: t('modes.commands.replace') },
      { keys: [':set nu'], desc: t('modes.commands.showLineNumbers') },
      { keys: [':help'], desc: t('modes.commands.help') }
    ]
  }
])

const setActiveMode = (modeId) => {
  activeMode.value = modeId
}

const getActiveMode = () => {
  return modes.value.find(m => m.id === activeMode.value)
}
</script>

<template>
  <section class="mode-section" id="modes">
    <div class="section-header">
      <span class="section-tag">:modes</span>
      <h2>{{ t('modes.title') }}</h2>
      <p>{{ t('modes.description') }}</p>
    </div>
    
    <div class="modes-container">
      <div class="mode-tabs">
        <button
          v-for="mode in modes"
          :key="mode.id"
          class="mode-tab"
          :class="{ active: activeMode === mode.id }"
          :style="{ '--mode-color': mode.color }"
          @click="setActiveMode(mode.id)"
        >
          <span class="mode-icon">{{ mode.icon }}</span>
          <span class="mode-name">{{ mode.name }}</span>
          <kbd class="mode-key">{{ mode.key }}</kbd>
        </button>
      </div>
      
      <div class="mode-content terminal-window">
        <div class="terminal-header">
          <span class="terminal-btn red"></span>
          <span class="terminal-btn yellow"></span>
          <span class="terminal-btn green"></span>
          <span 
            class="terminal-title mode-indicator"
            :style="{ color: getActiveMode().color }"
          >
            -- {{ getActiveMode().name }} --
          </span>
        </div>
        <div class="terminal-body">
          <div class="mode-description">
            <p>{{ getActiveMode().description }}</p>
          </div>
          
          <div class="mode-commands">
            <div class="command-header">
              <span class="prompt">❯</span> {{ t('modes.mainCommands') }}
            </div>
            <div 
              v-for="(cmd, index) in getActiveMode().commands" 
              :key="index"
              class="command-row"
            >
              <div class="command-keys">
                <kbd 
                  v-for="key in cmd.keys" 
                  :key="key"
                  :style="{ borderColor: getActiveMode().color }"
                >
                  {{ key }}
                </kbd>
              </div>
              <span class="command-desc">{{ cmd.desc }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="mode-diagram">
      <div class="diagram-title">{{ t('modes.switching') }}</div>
      <div class="diagram-flow">
        <div class="diagram-node normal">NORMAL</div>
        <div class="diagram-arrows">
          <div class="arrow-group">
            <span class="arrow">→</span>
            <kbd>i, a, o</kbd>
            <span class="arrow">→</span>
          </div>
        </div>
        <div class="diagram-node insert">INSERT</div>
        
        <div class="diagram-arrows">
          <div class="arrow-group reverse">
            <span class="arrow">←</span>
            <kbd>Esc</kbd>
            <span class="arrow">←</span>
          </div>
        </div>
        
        <div class="diagram-spacer"></div>
        
        <div class="diagram-node normal">NORMAL</div>
        <div class="diagram-arrows">
          <div class="arrow-group">
            <span class="arrow">→</span>
            <kbd>v, V</kbd>
            <span class="arrow">→</span>
          </div>
        </div>
        <div class="diagram-node visual">VISUAL</div>
        
        <div class="diagram-spacer"></div>
        
        <div class="diagram-node normal">NORMAL</div>
        <div class="diagram-arrows">
          <div class="arrow-group">
            <span class="arrow">→</span>
            <kbd>:</kbd>
            <span class="arrow">→</span>
          </div>
        </div>
        <div class="diagram-node command">COMMAND</div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.mode-section {
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
  border: 1px solid var(--accent-green);
  border-radius: 4px;
  color: var(--accent-green);
  font-size: 0.875rem;
  margin-bottom: 16px;
}

.section-header h2 {
  font-size: 2.5rem;
  margin-bottom: 12px;
  color: var(--text-primary);
}

.section-header p {
  font-size: 1.1rem;
  color: var(--text-secondary);
  max-width: 600px;
  margin: 0 auto;
}

.modes-container {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 24px;
  margin-bottom: 60px;
}

.mode-tabs {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.mode-tab {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  color: var(--text-secondary);
  font-family: var(--font-mono);
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.mode-tab:hover {
  background: var(--bg-tertiary);
  border-color: var(--mode-color);
  color: var(--text-primary);
}

.mode-tab.active {
  background: var(--bg-tertiary);
  border-color: var(--mode-color);
  color: var(--mode-color);
  box-shadow: 0 0 15px color-mix(in srgb, var(--mode-color) 30%, transparent);
}

.mode-icon {
  font-size: 1rem;
}

.mode-name {
  flex: 1;
  font-weight: 600;
}

.mode-key {
  padding: 4px 8px;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 0.75rem;
  color: var(--text-muted);
}

.mode-tab.active .mode-key {
  border-color: var(--mode-color);
  color: var(--mode-color);
}

.mode-content {
  min-height: 400px;
}

.mode-indicator {
  font-weight: 700;
  text-shadow: 0 0 10px currentColor;
}

.mode-description {
  padding: 16px 20px;
  background: var(--bg-tertiary);
  border-radius: 6px;
  margin-bottom: 24px;
}

.mode-description p {
  color: var(--text-secondary);
  line-height: 1.7;
}

.mode-commands {
  padding: 0 4px;
}

.command-header {
  color: var(--accent-cyan);
  margin-bottom: 16px;
  font-weight: 600;
}

.command-row {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 10px 0;
  border-bottom: 1px solid var(--border-color);
}

.command-row:last-child {
  border-bottom: none;
}

.command-keys {
  display: flex;
  gap: 6px;
  min-width: 150px;
}

.command-keys kbd {
  padding: 6px 10px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--accent-cyan);
}

.command-desc {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.mode-diagram {
  padding: 30px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
}

.diagram-title {
  text-align: center;
  color: var(--text-secondary);
  margin-bottom: 24px;
  font-size: 0.9rem;
}

.diagram-flow {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 12px;
}

.diagram-node {
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.8rem;
}

.diagram-node.normal {
  background: rgba(63, 185, 80, 0.15);
  border: 1px solid var(--accent-green);
  color: var(--accent-green);
}

.diagram-node.insert {
  background: rgba(88, 166, 255, 0.15);
  border: 1px solid var(--accent-cyan);
  color: var(--accent-cyan);
}

.diagram-node.visual {
  background: rgba(163, 113, 247, 0.15);
  border: 1px solid var(--accent-purple);
  color: var(--accent-purple);
}

.diagram-node.command {
  background: rgba(210, 153, 34, 0.15);
  border: 1px solid var(--accent-yellow);
  color: var(--accent-yellow);
}

.diagram-arrows {
  display: flex;
  align-items: center;
}

.arrow-group {
  display: flex;
  align-items: center;
  gap: 6px;
}

.arrow-group .arrow {
  color: var(--text-muted);
}

.arrow-group kbd {
  padding: 4px 8px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 0.7rem;
  color: var(--text-secondary);
}

.diagram-spacer {
  width: 100%;
  height: 16px;
}

@media (max-width: 768px) {
  .modes-container {
    grid-template-columns: 1fr;
  }
  
  .mode-tabs {
    flex-direction: row;
    flex-wrap: wrap;
  }
  
  .mode-tab {
    flex: 1;
    min-width: 140px;
    justify-content: center;
  }
  
  .mode-name {
    flex: none;
  }
  
  .diagram-flow {
    flex-direction: column;
  }
  
  .diagram-spacer {
    height: 8px;
  }
}
</style>
