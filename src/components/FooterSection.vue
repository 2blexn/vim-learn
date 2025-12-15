<script setup>
import { ref, inject } from 'vue'

const { t } = inject('i18n')

const currentYear = new Date().getFullYear()
const commandInput = ref('')
const commandOutput = ref('')

const executeCommand = () => {
  const cmd = commandInput.value.trim().toLowerCase()
  
  const commands = {
    ':help': t('footer.responses.help'),
    ':q': t('footer.responses.quit'),
    ':q!': t('footer.responses.forceQuit'),
    ':wq': t('footer.responses.saveQuit'),
    ':version': t('footer.responses.version'),
    'vim': t('footer.responses.vim'),
    ':smile': t('footer.responses.smile'),
    ':coffee': t('footer.responses.coffee'),
    ':vim': t('footer.responses.vimCmd'),
    'hello': t('footer.responses.hello')
  }
  
  commandOutput.value = commands[cmd] || t('footer.responses.notFound').replace('{cmd}', cmd)
  
  setTimeout(() => {
    commandOutput.value = ''
    commandInput.value = ''
  }, 3000)
}
</script>

<template>
  <footer class="footer-section">
    <div class="footer-container">
      <div class="footer-terminal terminal-window">
        <div class="terminal-header">
          <span class="terminal-btn red"></span>
          <span class="terminal-btn yellow"></span>
          <span class="terminal-btn green"></span>
          <span class="terminal-title">vim@terminal</span>
        </div>
        <div class="terminal-body">
          <div class="footer-content">
            <div class="footer-logo">
              <span class="logo-vim">VIM</span>
              <span class="logo-learn">.learn()</span>
            </div>
            
            <p class="footer-desc">
              {{ t('footer.description') }}<br>
              {{ t('footer.madeWith') }}
            </p>
            
            <div class="footer-command">
              <span class="prompt">❯</span>
              <input 
                v-model="commandInput"
                type="text"
                class="command-input"
                :placeholder="t('footer.inputPlaceholder')"
                @keydown.enter="executeCommand"
              >
            </div>
            
            <div v-if="commandOutput" class="command-output">
              {{ commandOutput }}
            </div>
          </div>
          
          <div class="footer-links">
            <div class="link-group">
              <h4>{{ t('footer.sections') }}</h4>
              <a href="#hero">:home</a>
              <a href="#modes">:modes</a>
              <a href="#cheatsheet">:keys</a>
              <a href="#practice">:practice</a>
            </div>
            
            <div class="link-group">
              <h4>{{ t('footer.resources') }}</h4>
              <a href="https://www.vim.org/" target="_blank">vim.org</a>
              <a href="https://neovim.io/" target="_blank">Neovim</a>
              <a href="https://vimawesome.com/" target="_blank">Vim Plugins</a>
              <a href="https://vim-adventures.com/" target="_blank">Vim Adventures</a>
            </div>
            
            <div class="link-group">
              <h4>{{ t('footer.quickCommands') }}</h4>
              <code>{{ t('footer.commands.quit') }}</code>
              <code>{{ t('footer.commands.save') }}</code>
              <code>{{ t('footer.commands.delete') }}</code>
              <code>{{ t('footer.commands.undo') }}</code>
            </div>
          </div>
        </div>
      </div>
      
      <div class="footer-bottom">
        <div class="copyright">
          <span class="comment"># </span>
          {{ t('footer.copyright') }}
        </div>
        <div class="vim-quote">
          <span class="comment">" </span>
          {{ t('footer.quote') }}
          <span class="comment"> "</span>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer-section {
  padding: 60px 0 30px;
  margin-top: 60px;
  border-top: 1px solid var(--border-color);
}

.footer-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}

.footer-terminal {
  margin-bottom: 30px;
}

.terminal-body {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 40px;
  padding: 30px;
}

.footer-logo {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 16px;
}

.logo-vim {
  color: var(--accent-green);
  text-shadow: 0 0 10px var(--glow-green);
}

.logo-learn {
  color: var(--text-secondary);
}

.footer-desc {
  color: var(--text-secondary);
  font-size: 0.9rem;
  line-height: 1.7;
  margin-bottom: 20px;
}

.footer-command {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 6px;
}

.prompt {
  color: var(--accent-green);
}

.command-input {
  flex: 1;
  background: transparent;
  border: none;
  color: var(--text-primary);
  font-family: var(--font-mono);
  font-size: 0.9rem;
  outline: none;
}

.command-input::placeholder {
  color: var(--text-muted);
}

.command-output {
  margin-top: 12px;
  padding: 10px 16px;
  background: var(--bg-tertiary);
  border-radius: 6px;
  color: var(--accent-cyan);
  font-size: 0.9rem;
  animation: fade-in 0.3s ease;
}

.footer-links {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}

.link-group h4 {
  color: var(--accent-purple);
  font-size: 0.9rem;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border-color);
}

.link-group a,
.link-group code {
  display: block;
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.85rem;
  padding: 6px 0;
  transition: color 0.2s;
}

.link-group a:hover {
  color: var(--accent-cyan);
}

.link-group code {
  font-family: var(--font-mono);
  color: var(--text-muted);
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20px;
  border-top: 1px solid var(--border-color);
}

.copyright {
  color: var(--text-muted);
  font-size: 0.8rem;
}

.vim-quote {
  color: var(--text-muted);
  font-size: 0.8rem;
  font-style: italic;
}

.comment {
  color: var(--accent-green);
}

@media (max-width: 1024px) {
  .terminal-body {
    grid-template-columns: 1fr;
    gap: 30px;
  }
}

@media (max-width: 768px) {
  .footer-links {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  .footer-bottom {
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }
}
</style>
