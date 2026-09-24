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
      <div className="mb-5">
        <label
          htmlFor="email"
          className="block text-[26px] font-normal text-[#323232] mb-3"
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
            className="w-full h-[64px] px-4 pr-12 text-[22px] text-gray-800 bg-white border border-[#cfcfcf] rounded-[10px] focus:outline-none focus:border-[#8d8d8d] transition placeholder:text-[#7d7d7d]"
          />
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-[#ef5c8b]">
            <User className="w-7 h-7" strokeWidth={1.75} />
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
          className="w-full py-5 px-4 bg-[#1d2b7b] hover:bg-[#19266e] active:bg-[#111d57] text-white font-semibold text-[28px] rounded-[10px] transition duration-150 shadow-sm cursor-pointer disabled:opacity-60 flex items-center justify-center tracking-wide"
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
      <div className="mt-4 text-right">
        <button
          type="button"
          id="resend-activation-link"
          data-testid="resend-activation-link"
          onClick={onResendActivation}
          className="text-[20px] text-[#ef5c8b] hover:text-[#d74d7b] underline-offset-2 transition font-normal cursor-pointer"
        >
          Resend activation link ?
        </button>
      </div>

      {/* Quick Test Accounts for user & Playwright testing */}
      <div className="mt-8">
        <p className="text-[18px] font-normal text-[#2d2d2d] text-left mb-3">
          Test Credentials (or enter your own / test wrong credentials)
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onSelectSampleCandidate('candidate@example.com')}
            className="text-[18px] px-3 py-2 bg-white hover:bg-gray-50 text-gray-700 rounded-md transition cursor-pointer border border-[#d2d2d2]"
          >
            candidate@example.com <span className="text-green-600 font-semibold">(Valid)</span>
          </button>
          <button
            type="button"
            onClick={() => onSelectSampleCandidate('test@gmail.com')}
            className="text-[18px] px-3 py-2 bg-white hover:bg-gray-50 text-gray-700 rounded-md transition cursor-pointer border border-[#d2d2d2]"
          >
            test@gmail.com <span className="text-green-600 font-semibold">(Valid)</span>
          </button>
          <button
            type="button"
            onClick={() => onSelectSampleCandidate('wrong_user@invalid.com')}
            className="text-[18px] px-3 py-2 bg-white hover:bg-gray-50 text-gray-700 rounded-md transition cursor-pointer border border-[#d2d2d2]"
          >
            wrong_user@invalid.com <span className="text-red-500 font-semibold">(Wrong)</span>
          </button>
        </div>
      </div>
    </form>
  );
}
