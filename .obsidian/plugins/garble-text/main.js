const { Plugin } = require('obsidian');

module.exports = class SimpleGarble extends Plugin {
  async onload() {
    this.addCommand({
      id: 'toggle-garble',
      name: 'Toggle Garble Text',
      callback: () => {
        const container = document.querySelector('.app-container');
        
        if (container.classList.contains('is-text-garbled')) {
          // Ungarble
          container.classList.remove('is-text-garbled');
        } else {
          // Garble
          this.app.garbleText();
        }
      }
    });
  }
}