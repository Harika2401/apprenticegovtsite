import React, { useState, useEffect } from 'react';
import { CandidateLoginForm } from './components/CandidateLoginForm.jsx';
import { CandidateRegisterForm } from './components/CandidateRegisterForm.jsx';
import { BlankPage } from './components/BlankPage.jsx';
import { PlaywrightHelperModal } from './components/PlaywrightHelperModal.jsx';
import { generateCaptchaCode } from './utils/captcha.js';
import { findUserByEmail, registerCandidate, getRegisteredUsers } from './utils/userStore.js';

export default function App() {
  // Navigation mode: 'login' or 'register'
  const [authMode, setAuthMode] = useState('login');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginCaptchaInput, setLoginCaptchaInput] = useState('');
  const [loginCaptchaCode, setLoginCaptchaCode] = useState('');
  const [loginError, setLoginError] = useState(null);
  const [isLoginLoading, setIsLoginLoading] = useState(false);

  // Register form state
  const [isItiStudent, setIsItiStudent] = useState(false);
  const [rollNumber, setRollNumber] = useState('');
  const [registerMobile, setRegisterMobile] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerConfirmEmail, setRegisterConfirmEmail] = useState('');
  const [registerCaptchaInput, setRegisterCaptchaInput] = useState('');
  const [registerCaptchaCode, setRegisterCaptchaCode] = useState('');
  const [registerError, setRegisterError] = useState(null);
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);

  // Authentication & Blank Page State
  const [isSuccess, setIsSuccess] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [successAction, setSuccessAction] = useState('login'); // 'login' | 'register'

  // Initialize CAPTCHAs on mount
  useEffect(() => {
    refreshLoginCaptcha();
    refreshRegisterCaptcha();
    // Warm up the database in localStorage
    getRegisteredUsers();
  }, []);

  const refreshLoginCaptcha = () => {
    setLoginCaptchaCode(generateCaptchaCode());
    setLoginCaptchaInput('');
  };

  const refreshRegisterCaptcha = () => {
    setRegisterCaptchaCode(generateCaptchaCode());
    setRegisterCaptchaInput('');
  };

  // Handler for candidate login submit
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoginLoading(true);

    setTimeout(() => {
      // 1. Basic validation
      const trimmedEmail = loginEmail.trim();
      if (!trimmedEmail) {
        setLoginError("Can't login! Email address is required.");
        setIsLoginLoading(false);
        return;
      }

      // 2. Validate CAPTCHA (case-insensitive check for robustness)
      if (
        !loginCaptchaInput.trim() ||
        loginCaptchaInput.trim().toLowerCase() !== loginCaptchaCode.toLowerCase()
      ) {
        setLoginError("Can't login! Invalid CAPTCHA code entered. Please try again.");
        refreshLoginCaptcha();
        setIsLoginLoading(false);
        return;
      }

      // 3. Verify candidate credentials against portal database
      const candidate = findUserByEmail(trimmedEmail);

      if (!candidate) {
        // As requested: "if the credentials are wrong it should return can't login and all"
        setLoginError("Can't login! Invalid credentials: No candidate record found for this Email ID. Please register first or verify your email.");
        refreshLoginCaptcha();
        setIsLoginLoading(false);
        return;
      }

      // 4. Success: User sees a blank page as it was temporary
      setCurrentUser(candidate);
      setSuccessAction('login');
      setIsSuccess(true);
      setIsLoginLoading(false);
    }, 400);
  };

  // Handler for candidate registration submit
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setRegisterError(null);
    setIsRegisterLoading(true);

    setTimeout(() => {
      const trimmedEmail = registerEmail.trim();
      const trimmedConfirmEmail = registerConfirmEmail.trim();
      const trimmedMobile = registerMobile.trim();

      // Field validation
      if (!trimmedMobile) {
        setRegisterError("Can't register! Mobile number is required.");
        setIsRegisterLoading(false);
        return;
      }

      if (!/^\d{10}$/.test(trimmedMobile.replace(/\D/g, ''))) {
        setRegisterError("Can't register! Please enter a valid 10-digit mobile number.");
        setIsRegisterLoading(false);
        return;
      }

      if (!trimmedEmail) {
        setRegisterError("Can't register! Email address is required.");
        setIsRegisterLoading(false);
        return;
      }

      if (!trimmedEmail.includes('@') || !trimmedEmail.includes('.')) {
        setRegisterError("Can't register! Please enter a valid email format.");
        setIsRegisterLoading(false);
        return;
      }

      if (trimmedEmail.toLowerCase() !== trimmedConfirmEmail.toLowerCase()) {
        setRegisterError("Can't register! Email ID and Confirm Email ID do not match.");
        setIsRegisterLoading(false);
        return;
      }

      // Validate CAPTCHA
      if (
        !registerCaptchaInput.trim() ||
        registerCaptchaInput.trim().toLowerCase() !== registerCaptchaCode.toLowerCase()
      ) {
        setRegisterError("Can't register! Invalid CAPTCHA code. Please try again.");
        refreshRegisterCaptcha();
        setIsRegisterLoading(false);
        return;
      }

      // Try registering
      try {
        const newUser = registerCandidate({
          email: trimmedEmail,
          mobile: trimmedMobile,
          isItiStudent,
        });

        // Success: As requested: "user can login and register then he will see a blank page as it was temporary"
        setCurrentUser(newUser);
        setSuccessAction('register');
        setIsSuccess(true);
      } catch (err) {
        setRegisterError(`Can't register! ${err.message || 'User already exists.'}`);
        refreshRegisterCaptcha();
      } finally {
        setIsRegisterLoading(false);
      }
    }, 400);
  };

  const handleLogout = () => {
    setIsSuccess(false);
    setCurrentUser(null);
    setLoginEmail('');
    setLoginCaptchaInput('');
    refreshLoginCaptcha();
    setRegisterCaptchaInput('');
    refreshRegisterCaptcha();
    setRollNumber('');
    setLoginError(null);
    setRegisterError(null);
  };

  // If credentials are correct -> user will see a blank page as it was temporary
  if (isSuccess) {
    return (
      <BlankPage
        currentUser={currentUser}
        onLogout={handleLogout}
        actionType={successAction}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col justify-between font-sans text-gray-800 antialiased selection:bg-blue-100 selection:text-blue-900">
      {/* Top Main Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg bg-white rounded-lg p-6 sm:p-10 shadow-xs border border-gray-200">
          
          {/* Radio Switcher: Login as a candidate vs Register as a candidate */}
          <div className="flex items-center justify-center gap-8 mb-8 pb-6 border-b border-gray-100">
            {/* Login Radio */}
            <label
              htmlFor="login-radio"
              className="flex items-center gap-2.5 cursor-pointer text-sm font-normal text-gray-800 select-none group"
            >
              <input
                type="radio"
                id="login-radio"
                name="auth-mode"
                data-testid="login-radio"
                checked={authMode === 'login'}
                onChange={() => {
                  setAuthMode('login');
                  setLoginError(null);
                  refreshLoginCaptcha();
                }}
                className="sr-only"
              />
              <span
                className={`w-4 h-4 rounded-full border flex items-center justify-center transition ${
                  authMode === 'login'
                    ? 'border-[#e02b64] bg-white'
                    : 'border-gray-400 bg-white group-hover:border-gray-600'
                }`}
              >
                {authMode === 'login' && (
                  <span className="w-2 h-2 rounded-full bg-[#e02b64]" />
                )}
              </span>
              <span className={authMode === 'login' ? 'font-medium text-gray-900' : 'text-gray-700'}>
                Login as a candidate
              </span>
            </label>

            {/* Register Radio */}
            <label
              htmlFor="register-radio"
              className="flex items-center gap-2.5 cursor-pointer text-sm font-normal text-gray-800 select-none group"
            >
              <input
                type="radio"
                id="register-radio"
                name="auth-mode"
                data-testid="register-radio"
                checked={authMode === 'register'}
                onChange={() => {
                  setAuthMode('register');
                  setRegisterError(null);
                  refreshRegisterCaptcha();
                }}
                className="sr-only"
              />
              <span
                className={`w-4 h-4 rounded-full border flex items-center justify-center transition ${
                  authMode === 'register'
                    ? 'border-[#e02b64] bg-white'
                    : 'border-gray-400 bg-white group-hover:border-gray-600'
                }`}
              >
                {authMode === 'register' && (
                  <span className="w-2 h-2 rounded-full bg-[#e02b64]" />
                )}
              </span>
              <span className={authMode === 'register' ? 'font-medium text-gray-900' : 'text-gray-700'}>
                Register as a candidate
              </span>
            </label>
          </div>

          {/* Form Rendering */}
          {authMode === 'login' ? (
            <CandidateLoginForm
              email={loginEmail}
              setEmail={setLoginEmail}
              captchaCode={loginCaptchaCode}
              userCaptcha={loginCaptchaInput}
              setUserCaptcha={setLoginCaptchaInput}
              onRefreshCaptcha={refreshLoginCaptcha}
              onSubmit={handleLoginSubmit}
              errorMessage={loginError}
              isLoading={isLoginLoading}
              onResendActivation={() => {
                alert('An activation link has been resent to your registered email address if it exists.');
              }}
              onSelectSampleCandidate={(email) => {
                setLoginEmail(email);
                setLoginCaptchaInput(loginCaptchaCode);
              }}
            />
          ) : (
            <CandidateRegisterForm
              isItiStudent={isItiStudent}
              setIsItiStudent={setIsItiStudent}
              rollNumber={rollNumber}
              setRollNumber={setRollNumber}
              onItiSubmitSuccess={(student) => {
                setCurrentUser({
                  id: student.rollNumber,
                  email: student.email || `${student.rollNumber.toLowerCase()}@iti-candidate.edu.in`,
                  mobile: student.mobile || '',
                  isItiStudent: true,
                });
                setSuccessAction('register');
                setIsSuccess(true);
              }}
              mobile={registerMobile}
              setMobile={setRegisterMobile}
              email={registerEmail}
              setEmail={setRegisterEmail}
              confirmEmail={registerConfirmEmail}
              setConfirmEmail={setRegisterConfirmEmail}
              captchaCode={registerCaptchaCode}
              userCaptcha={registerCaptchaInput}
              setUserCaptcha={setRegisterCaptchaInput}
              onRefreshCaptcha={refreshRegisterCaptcha}
              onSubmit={handleRegisterSubmit}
              errorMessage={registerError}
              isLoading={isRegisterLoading}
            />
          )}
        </div>
      </main>

      {/* Floating Playwright & Typebot Guide Modal */}
      <PlaywrightHelperModal currentUrl={typeof window !== 'undefined' ? window.location.href : ''} />
    </div>
  );
}
