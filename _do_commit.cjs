const { execSync } = require('child_process');
const fs = require('fs');
const repoPath = 'C:/AAA/tool_ui';
const msgPath = repoPath + '/_commit_msg.txt';
const msg = fs.readFileSync(msgPath, 'utf-8').trim();
try {
  execSync('git -C ' + repoPath + ' commit -F ' + msgPath, { stdio: 'inherit' });
  console.log('Committed successfully');
} catch (e) {
  console.log('Exit code:', e.status);
}
