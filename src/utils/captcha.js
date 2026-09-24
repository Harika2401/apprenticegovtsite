// Alphanumeric CAPTCHA generator matching the portal aesthetic in JavaScript

export function generateCaptchaCode(length = 6) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function drawCaptchaOnCanvas(canvas, code) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = canvas.width;
  const height = canvas.height;

  // Clear background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  // Add random background teal/green lines (matching apprenticeshipindia portal)
  const lineColors = ['#2e8b57', '#3cb371', '#20b2aa', '#5f9ea0', '#48bb78', '#38a169', '#2d6a4f'];
  for (let i = 0; i < 28; i++) {
    ctx.strokeStyle = lineColors[Math.floor(Math.random() * lineColors.length)];
    ctx.lineWidth = Math.random() * 1.5 + 0.5;
    ctx.beginPath();
    ctx.moveTo(Math.random() * width, Math.random() * height);
    ctx.lineTo(Math.random() * width, Math.random() * height);
    ctx.stroke();
  }

  // Draw characters with slight rotation & offset
  ctx.font = 'bold 32px "Trebuchet MS", "Lucida Sans", "Segoe UI", Arial, sans-serif';
  ctx.textBaseline = 'middle';

  const charSpacing = (width - 40) / code.length;
  for (let i = 0; i < code.length; i++) {
    const char = code[i];
    ctx.save();
    const x = 20 + i * charSpacing + Math.random() * 4;
    const y = height / 2 + (Math.random() * 6 - 3);
    const angle = (Math.random() * 22 - 11) * (Math.PI / 180);

    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.fillStyle = '#1e293b';
    ctx.fillText(char, 0, 0);
    ctx.restore();
  }

  // Overlay scratch lines through characters
  for (let i = 0; i < 14; i++) {
    ctx.strokeStyle = lineColors[Math.floor(Math.random() * lineColors.length)];
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(Math.random() * width, Math.random() * height);
    ctx.lineTo(Math.random() * width, Math.random() * height);
    ctx.stroke();
  }
}

export function speakCaptcha(code) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  
  // Spell out letters with small pauses
  const spokenText = code.split('').join(' . ');
  const utterance = new SpeechSynthesisUtterance(spokenText);
  utterance.rate = 0.8;
  utterance.pitch = 1.0;
  window.speechSynthesis.speak(utterance);
}
