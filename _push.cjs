const { execSync } = require('child_process');
try {
  execSync('git -C C:/AAA/tool_ui push', { stdio: 'inherit' });
  console.log('Pushed successfully');
} catch (e) {
  console.log('Push exit code:', e.status);
}
