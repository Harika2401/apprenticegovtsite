import React, { useState } from 'react';
import { Smartphone, User, AlertCircle } from 'lucide-react';
import { CaptchaBox } from './CaptchaBox.jsx';
import { lookupItiStudent } from '../utils/userStore.js';

export function CandidateRegisterForm({
  isItiStudent,
  setIsItiStudent,
  mobile,
  setMobile,
  email,
  setEmail,
  confirmEmail,
  setConfirmEmail,
  captchaCode,
  userCaptcha,
  setUserCaptcha,
  onRefreshCaptcha,
  onSubmit,
  errorMessage,
  isLoading = false,
  rollNumber,
  setRollNumber,
  onItiSubmitSuccess,
}) {
  const [rollError, setRollError] = useState('');
  const [isSearchingIti, setIsSearchingIti] = useState(false);

  const handleFindDetails = () => {
    setRollError('');
    const trimmed = rollNumber ? rollNumber.trim() : '';

    // As shown in user screenshot: "Roll Number is required"
    if (!trimmed) {
      setRollError('Roll Number is required');
      return;
    }

    setIsSearchingIti(true);
    setTimeout(() => {
      // Check if known or valid roll number
      if (trimmed.toLowerCase().includes('wrong') || trimmed.toLowerCase().includes('invalid') || trimmed === '00000') {
        setRollError("Can't find candidate: Roll Number not found in portal database.");
        setIsSearchingIti(false);
        return;
      }

      const student = lookupItiStudent(trimmed);
      if (student) {
        setRollError('');
        // User requirements: "if the credentials are correct user can login and register then he will see a blank page as it was temporary"
        if (onItiSubmitSuccess) {
          onItiSubmitSuccess(student);
        }
      } else {
        setRollError("Can't find candidate: Roll Number not found in portal database.");
      }
      setIsSearchingIti(false);
    }, 350);
  };

  const handleItiCheckboxChange = (checked) => {
    setIsItiStudent(checked);
    setRollError('');
  };

  return (
    <form
      onSubmit={(e) => {
        if (isItiStudent) {
          e.preventDefault();
          handleFindDetails();
        } else {
          onSubmit(e);
        }
      }}
      className="w-full max-w-md mx-auto"
      noValidate
    >
      {/* Error Banner when details are invalid */}
      {errorMessage && !isItiStudent && (
        <div
          id="error-message"
          data-testid="error-message"
          data-status="register-failed"
          role="alert"
          className="mb-5 p-3.5 bg-red-50 border-l-4 border-red-600 rounded-r-md text-red-700 text-sm flex items-start gap-2.5 shadow-sm transition-all"
        >
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-red-900 tracking-tight">Registration Failed</p>
            <p className="text-red-700 text-xs mt-0.5 font-medium leading-relaxed">
              {errorMessage}
            </p>
          </div>
        </div>
      )}

      {/* ITI Student Checkbox (matching screenshot) */}
      <div className="mb-4 flex items-center">
        <label
          htmlFor="iti-student"
          className="flex items-center gap-2.5 text-sm text-gray-800 cursor-pointer select-none font-normal"
        >
          <input
            type="checkbox"
            id="iti-student"
            name="itiStudent"
            data-testid="iti-student-checkbox"
            checked={isItiStudent}
            onChange={(e) => handleItiCheckboxChange(e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer accent-blue-700"
          />
          <span className="text-[15px]">ITI Student</span>
        </label>
      </div>

      {/* When student is ITI: Just give Roll Number and Find Details */}
      {isItiStudent ? (
        <div className="mb-6 transition-all duration-200">
          {/* Roll Number Label with red asterisk */}
          <label
            htmlFor="roll-number"
            className="block text-sm text-gray-800 font-normal mb-1.5"
          >
            Roll Number <span className="text-red-500">*</span>
          </label>

          {/* Input + "Find Details" Pink Button Row (exact match to screenshot) */}
          <div className="flex items-center gap-3">
            <input
              type="text"
              id="roll-number"
              name="rollNumber"
              data-testid="roll-number-input"
              value={rollNumber}
              onChange={(e) => {
                setRollNumber(e.target.value);
                if (rollError) setRollError('');
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleFindDetails();
                }
              }}
              placeholder="Enter Roll number"
              autoComplete="off"
              className="flex-1 px-4 py-3 text-sm text-gray-800 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-700 focus:ring-1 focus:ring-blue-700 transition placeholder-gray-400"
            />

            {/* Pink "Find Details" Button matching screenshot */}
            <button
              type="button"
              id="find-details-btn"
              data-testid="find-details-btn"
              onClick={handleFindDetails}
              disabled={isSearchingIti}
              className="bg-[#ff8da1] hover:bg-[#ff758f] active:bg-[#f06292] text-white font-medium rounded-xl px-5 py-2 text-center text-sm leading-tight shadow-sm transition duration-150 cursor-pointer disabled:opacity-60 shrink-0 min-w-[95px] select-none"
            >
              {isSearchingIti ? (
                'Finding...'
              ) : (
                <>
                  Find<br />Details
                </>
              )}
            </button>
          </div>

          {/* Red Error Message under input matching screenshot */}
          {rollError && (
            <p
              id="roll-error"
              data-testid="roll-error"
              className="text-red-600 text-xs mt-1.5 font-normal"
            >
              {rollError}
            </p>
          )}
        </div>
      ) : (
        /* When student is NOT ITI: Show the regular registration fields */
        <>
          {/* Enter your mobile number */}
          <div className="mb-3.5">
            <div className="relative">
              <input
                type="tel"
                id="mobile"
                name="mobile"
                data-testid="mobile-input"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="Enter your mobile number"
                autoComplete="tel"
                required
                className="w-full px-4 py-3 text-sm text-gray-800 bg-white border border-gray-300 rounded-lg pr-11 focus:outline-none focus:border-blue-700 focus:ring-1 focus:ring-blue-700 transition placeholder-gray-400"
              />
              <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-rose-500">
                <Smartphone className="w-5 h-5" strokeWidth={1.75} />
              </div>
            </div>
          </div>

          {/* Enter Your Email ID */}
          <div className="mb-3.5">
            <div className="relative">
              <input
                type="email"
                id="register-email"
                name="email"
                data-testid="register-email-input"
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

          {/* Confirm Your Email ID */}
          <div className="mb-4">
            <div className="relative">
              <input
                type="email"
                id="confirm-email"
                name="confirmEmail"
                data-testid="confirm-email-input"
                value={confirmEmail}
                onChange={(e) => setConfirmEmail(e.target.value)}
                placeholder="Confirm Your Email ID"
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

          {/* Register Button */}
          <div className="mt-5">
            <button
              type="submit"
              id="register-btn"
              data-testid="register-btn"
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-[#141d5b] hover:bg-[#0f1747] active:bg-[#090e30] text-white font-semibold text-base rounded-md transition duration-150 shadow-sm cursor-pointer disabled:opacity-60 flex items-center justify-center tracking-wide"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Registering...</span>
                </div>
              ) : (
                'Register'
              )}
            </button>
          </div>
        </>
      )}
    </form>
  );
}
