import React from 'react';
import { User, AlertCircle, CheckCircle2 } from 'lucide-react';
import { CaptchaBox } from './CaptchaBox.jsx';

export function CandidateLoginForm({
  email,
  setEmail,
  captchaCode,
  userCaptcha,
  setUserCaptcha,
  onRefreshCaptcha,
  onSubmit,
  errorMessage,
  isLoading = false,
  onResendActivation,
  onSelectSampleCandidate,
}) {
  return (
    <form onSubmit={onSubmit} className="w-full max-w-md mx-auto" noValidate>
      {/* Error Banner when credentials are wrong */}
      {errorMessage && (
        <div
          id="error-message"
          data-testid="error-message"
          data-status="login-failed"
          role="alert"
          className="mb-5 p-3.5 bg-red-50 border-l-4 border-red-600 rounded-r-md text-red-700 text-sm flex items-start gap-2.5 shadow-sm transition-all animate-bounce-short"
        >
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-red-900 tracking-tight">Can't Login</p>
            <p className="text-red-700 text-xs mt-0.5 font-medium leading-relaxed">
              {errorMessage}
            </p>
          </div>
        </div>
      )}

      {/* Field: Enter Your Email ID* */}
      <div className="mb-4">
        <label
          htmlFor="email"
          className="block text-center text-sm font-medium text-gray-700 mb-2"
        >
          Enter Your Email ID<span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type="email"
            id="email"
            name="email"
            data-testid="email-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter Your Email ID"
            autoComplete="email"
            required
            className="w-full px-4 py-3 text-sm text-gray-800 bg-white border border-gray-300 rounded-lg pr-11 focus:outline-none focus:border-blue-700 focus:ring-1 focus:ring-blue-700 transition placeholder-gray-400"
          />
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-rose-500">
            <User className="w-5 h-5" strokeWidth={1.75} />
          </div>
        </div>
      </div>

      {/* CAPTCHA section */}
      <CaptchaBox
        captchaCode={captchaCode}
        userCaptchaInput={userCaptcha}
        onCaptchaInputChange={setUserCaptcha}
        onRefreshCaptcha={onRefreshCaptcha}
      />

      {/* Submit Button */}
      <div className="mt-5">
        <button
          type="submit"
          id="submit-btn"
          data-testid="submit-btn"
          disabled={isLoading}
          className="w-full py-3.5 px-4 bg-[#141d5b] hover:bg-[#0f1747] active:bg-[#090e30] text-white font-semibold text-base rounded-md transition duration-150 shadow-sm cursor-pointer disabled:opacity-60 flex items-center justify-center tracking-wide"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Verifying...</span>
            </div>
          ) : (
            'Submit'
          )}
        </button>
      </div>

      {/* Resend activation link */}
      <div className="mt-4 text-center">
        <button
          type="button"
          id="resend-activation-link"
          data-testid="resend-activation-link"
          onClick={onResendActivation}
          className="text-xs text-rose-500 hover:text-rose-600 hover:underline transition font-medium cursor-pointer"
        >
          Resend activation link ?
        </button>
      </div>

      {/* Quick Test Accounts for user & Playwright testing */}
      <div className="mt-8 pt-4 border-t border-gray-200">
        <p className="text-[12px] font-semibold text-gray-500 uppercase tracking-wider text-center mb-2">
          Test Credentials (or enter your own / test wrong credentials)
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={() => onSelectSampleCandidate('candidate@example.com')}
            className="text-xs px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition cursor-pointer border border-gray-300"
          >
            candidate@example.com <span className="text-green-600 font-semibold">(Valid)</span>
          </button>
          <button
            type="button"
            onClick={() => onSelectSampleCandidate('test@gmail.com')}
            className="text-xs px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition cursor-pointer border border-gray-300"
          >
            test@gmail.com <span className="text-green-600 font-semibold">(Valid)</span>
          </button>
          <button
            type="button"
            onClick={() => onSelectSampleCandidate('wrong_user@invalid.com')}
            className="text-xs px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded transition cursor-pointer border border-rose-200"
          >
            wrong_user@invalid.com <span className="text-red-500 font-semibold">(Wrong)</span>
          </button>
        </div>
      </div>
    </form>
  );
}
