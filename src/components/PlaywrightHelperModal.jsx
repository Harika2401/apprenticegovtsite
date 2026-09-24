import React, { useState } from 'react';
import { Code2, Copy, Check, X, Terminal, ExternalLink } from 'lucide-react';

export function PlaywrightHelperModal({ currentUrl }) {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const samplePlaywrightCode = `// playwright-typebot-login.js
// Node.js Playwright script to automate candidate login with Typebot input
import { chromium } from 'playwright';

async function runCandidateAuth(userEmail, isLogin = true) {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // 1. Navigate to your Candidate Portal
  await page.goto('${currentUrl || window?.location?.origin || 'http://localhost:3000'}');

  if (isLogin) {
    // Select Login radio
    await page.click('#login-radio');

    // 2. Fill in Email from Typebot
    await page.fill('#email', userEmail);

    // 3. Extract CAPTCHA code directly from page (no flaky OCR needed!)
    const captchaText = await page.textContent('#current-captcha-code');
    await page.fill('#captcha-input', captchaText.trim());

    // 4. Submit
    await page.click('#submit-btn');

    // 5. Verify outcome: Blank page if correct, or error if wrong
    try {
      await page.waitForSelector('#blank-page', { timeout: 3000 });
      console.log('✅ LOGIN SUCCESS: User verified and reached the blank page!');
      return { status: 'success', message: 'Logged in successfully' };
    } catch {
      const errorText = await page.textContent('#error-message');
      console.log('❌ CANNOT LOGIN:', errorText);
      return { status: 'failed', error: errorText };
    }
  } else {
    // Register candidate flow
    await page.click('#register-radio');
    await page.fill('#mobile', '9876543210');
    await page.fill('#register-email', userEmail);
    await page.fill('#confirm-email', userEmail);

    const captchaText = await page.textContent('#current-captcha-code');
    await page.fill('#captcha-input', captchaText.trim());

    await page.click('#register-btn');
    await page.waitForSelector('#blank-page', { timeout: 3000 });
    console.log('✅ REGISTRATION SUCCESS: Candidate registered & blank page loaded!');
  }

  await browser.close();
}

// Test with valid credentials:
runCandidateAuth('candidate@example.com', true);

// Test with wrong credentials (triggers "Can't login"):
// runCandidateAuth('wrong_candidate@domain.com', true);
`;

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <>
      {/* Floating trigger button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-40 bg-[#141d5b] text-white hover:bg-[#0d143f] px-3.5 py-2 rounded-full shadow-lg flex items-center gap-2 text-xs font-semibold tracking-wide transition cursor-pointer border border-blue-400/30"
      >
        <Terminal className="w-4 h-4 text-emerald-400" />
        <span>Playwright & Typebot Guide</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-gray-200">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#141d5b] text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Code2 className="w-5 h-5 text-emerald-400" />
                <h3 className="font-semibold text-base">Playwright & Typebot Integration</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-gray-300 hover:text-white p-1 rounded-md transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-5 text-sm text-gray-700">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-blue-900 text-xs leading-relaxed">
                <strong>How it works:</strong> Typebot collects the candidate email / phone, Playwright opens this portal, types credentials into the selectors below, auto-extracts the CAPTCHA from <code className="bg-blue-100 px-1 py-0.5 rounded font-mono">#current-captcha-code</code>, and submits. If correct, Playwright waits for <code className="bg-blue-100 px-1 py-0.5 rounded font-mono">#blank-page</code>. If wrong, it asserts <code className="bg-blue-100 px-1 py-0.5 rounded font-mono">#error-message</code>.
              </div>

              {/* Selectors Table */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-2 text-xs uppercase tracking-wider">
                  Target DOM Selectors
                </h4>
                <div className="overflow-x-auto border border-gray-200 rounded-lg text-xs font-mono">
                  <table className="w-full text-left">
                    <thead className="bg-gray-100 text-gray-600 font-sans font-semibold">
                      <tr>
                        <th className="py-2 px-3">Field / Action</th>
                        <th className="py-2 px-3">Primary Selector (ID)</th>
                        <th className="py-2 px-3">Test ID / Attribute</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      <tr>
                        <td className="py-1.5 px-3 font-sans">Login Mode Radio</td>
                        <td className="py-1.5 px-3 text-blue-600">#login-radio</td>
                        <td className="py-1.5 px-3 text-gray-500">[data-testid="login-radio"]</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 px-3 font-sans">Register Mode Radio</td>
                        <td className="py-1.5 px-3 text-blue-600">#register-radio</td>
                        <td className="py-1.5 px-3 text-gray-500">[data-testid="register-radio"]</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 px-3 font-sans">Login Email Field</td>
                        <td className="py-1.5 px-3 text-blue-600">#email</td>
                        <td className="py-1.5 px-3 text-gray-500">[data-testid="email-input"]</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 px-3 font-sans">Register Mobile</td>
                        <td className="py-1.5 px-3 text-blue-600">#mobile</td>
                        <td className="py-1.5 px-3 text-gray-500">[data-testid="mobile-input"]</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 px-3 font-sans">Register Email</td>
                        <td className="py-1.5 px-3 text-blue-600">#register-email</td>
                        <td className="py-1.5 px-3 text-gray-500">[data-testid="register-email-input"]</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 px-3 font-sans">Confirm Email</td>
                        <td className="py-1.5 px-3 text-blue-600">#confirm-email</td>
                        <td className="py-1.5 px-3 text-gray-500">[data-testid="confirm-email-input"]</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 px-3 font-sans">ITI Student Checkbox</td>
                        <td className="py-1.5 px-3 text-blue-600">#iti-student</td>
                        <td className="py-1.5 px-3 text-gray-500">[data-testid="iti-student-checkbox"]</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 px-3 font-sans">ITI Roll Number Field</td>
                        <td className="py-1.5 px-3 text-blue-600">#roll-number</td>
                        <td className="py-1.5 px-3 text-gray-500">[data-testid="roll-number-input"]</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 px-3 font-sans">ITI Find Details Button</td>
                        <td className="py-1.5 px-3 text-pink-600 font-bold">#find-details-btn</td>
                        <td className="py-1.5 px-3 text-gray-500">[data-testid="find-details-btn"]</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 px-3 font-sans">ITI Roll Error Message</td>
                        <td className="py-1.5 px-3 text-rose-600">#roll-error</td>
                        <td className="py-1.5 px-3 text-gray-500">[data-testid="roll-error"]</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 px-3 font-sans">CAPTCHA Code Reader</td>
                        <td className="py-1.5 px-3 text-emerald-600 font-bold">#current-captcha-code</td>
                        <td className="py-1.5 px-3 text-gray-500">canvas[data-code]</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 px-3 font-sans">CAPTCHA Input</td>
                        <td className="py-1.5 px-3 text-blue-600">#captcha-input</td>
                        <td className="py-1.5 px-3 text-gray-500">[data-testid="captcha-input"]</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 px-3 font-sans">Submit (Login) Button</td>
                        <td className="py-1.5 px-3 text-blue-600">#submit-btn</td>
                        <td className="py-1.5 px-3 text-gray-500">[data-testid="submit-btn"]</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 px-3 font-sans">Register Button</td>
                        <td className="py-1.5 px-3 text-blue-600">#register-btn</td>
                        <td className="py-1.5 px-3 text-gray-500">[data-testid="register-btn"]</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 px-3 font-sans">Success (Blank Page)</td>
                        <td className="py-1.5 px-3 text-emerald-700 font-bold">#blank-page</td>
                        <td className="py-1.5 px-3 text-gray-500">[data-status="success"]</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 px-3 font-sans">Error Banner (Can't Login)</td>
                        <td className="py-1.5 px-3 text-rose-600 font-bold">#error-message</td>
                        <td className="py-1.5 px-3 text-gray-500">[data-status="login-failed"]</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Ready Playwright Code */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900 text-xs uppercase tracking-wider">
                    Copyable Playwright Script (JavaScript)
                  </h4>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(samplePlaywrightCode, 1)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded border border-gray-300 transition cursor-pointer"
                  >
                    {copiedIndex === 1 ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-green-600" />
                        <span className="text-green-600">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-3 bg-gray-900 text-gray-100 rounded-lg text-xs font-mono overflow-x-auto max-h-56 leading-relaxed">
                  {samplePlaywrightCode}
                </pre>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex justify-end">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-md text-xs font-semibold cursor-pointer"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
