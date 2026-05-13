const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const sourceFile = path.join(__dirname, '..', '명찰 명단 양식.xlsx');
const targetFile = path.join(__dirname, 'public', 'data.xlsx');

console.log(`Watching for changes in: ${sourceFile}`);

function syncFile() {
  try {
    console.log('Change detected. Syncing...');
    fs.copyFileSync(sourceFile, targetFile);
    console.log('Sync complete.');
    // Optional: touch a file that Vite watches to force reload if needed
    // But Vite usually detects public/ asset changes.
  } catch (err) {
    console.error('Sync failed:', err.message);
  }
}

// Initial sync
syncFile();

// Watch for changes
fs.watch(sourceFile, (event, filename) => {
  if (filename && event === 'change') {
    // Debounce to handle multiple events from some editors
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(syncFile, 500);
  }
});
