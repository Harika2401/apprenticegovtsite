import React, { useEffect, useRef } from 'react';
import { RotateCw, Volume2 } from 'lucide-react';
import { drawCaptchaOnCanvas, speakCaptcha } from '../utils/captcha.js';

export function CaptchaBox({
  captchaCode,
  userCaptchaInput,
  onCaptchaInputChange,
  onRefreshCaptcha,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current && captchaCode) {
      drawCaptchaOnCanvas(canvasRef.current, captchaCode);
    }
  }, [captchaCode]);

  const handleAudioPlay = () => {
    speakCaptcha(captchaCode);
  };

  const handleQuickFill = () => {
    onCaptchaInputChange(captchaCode);
  };

  return (
    <div className="flex flex-col items-center my-4">
      {/* CAPTCHA Display Card matching apprenticeshipindia portal style */}
      <div className="border border-gray-300 rounded p-1 bg-white shadow-sm inline-block">
        <div className="relative border border-gray-200 overflow-hidden rounded bg-white">
          <canvas
            ref={canvasRef}
            width={240}
            height={90}
            className="block cursor-pointer select-none"
            onClick={onRefreshCaptcha}
            title="Click image to refresh CAPTCHA"
            id="captcha-canvas"
            data-testid="captcha-canvas"
            data-code={captchaCode}
          />
          {/* Machine-readable element for Playwright / Typebot automation */}
          <span
            id="current-captcha-code"
            data-testid="current-captcha-code"
            className="sr-only"
            aria-hidden="false"
          >
            {captchaCode}
          </span>
        </div>

        {/* Input + Action Buttons row */}
        <div className="flex items-center gap-1.5 mt-2">
          <input
            id="captcha-input"
            name="captcha"
            type="text"
            data-testid="captcha-input"
            placeholder="Enter CAPTCHA"
            value={userCaptchaInput}
            onChange={(e) => onCaptchaInputChange(e.target.value)}
            autoComplete="off"
            className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition placeholder-gray-400"
            required
          />

          {/* Refresh Button - Green Square */}
          <button
            type="button"
            id="refresh-captcha-btn"
            data-testid="refresh-captcha-btn"
            onClick={onRefreshCaptcha}
            title="Refresh CAPTCHA"
            className="w-8 h-8 flex items-center justify-center bg-[#28a745] hover:bg-[#218838] text-white rounded transition shadow-sm cursor-pointer active:scale-95"
            aria-label="Refresh CAPTCHA"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          {/* Audio/Speaker Button - Green Square */}
          <button
            type="button"
            id="audio-captcha-btn"
            data-testid="audio-captcha-btn"
            onClick={handleAudioPlay}
            title="Listen to CAPTCHA"
            className="w-8 h-8 flex items-center justify-center bg-[#28a745] hover:bg-[#218838] text-white rounded transition shadow-sm cursor-pointer active:scale-95"
            aria-label="Play audio CAPTCHA"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Automation helper hint */}
      <div className="mt-1 flex items-center gap-2 text-[11px] text-gray-400">
        <span>Playwright selector: <code className="bg-gray-100 px-1 py-0.5 rounded text-gray-600">#captcha-input</code></span>
        <span>•</span>
        <button
          type="button"
          onClick={handleQuickFill}
          className="text-blue-600 hover:underline cursor-pointer"
          title="Fills the exact captcha into the field"
        >
          Auto-fill CAPTCHA
        </button>
      </div>
    </div>
  );
}
