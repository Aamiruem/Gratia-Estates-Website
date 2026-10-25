import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Eye, EyeOff, KeyRound, Loader2, LockKeyhole, MailCheck, RotateCw, ShieldCheck } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import SEO from "../components/SEO";
import { authApi } from "../services/authApi";

export default function VideoAdminAuth() {
  const navigate = useNavigate();
  const location = useLocation();
  const isSignup = location.pathname === "/video-admin/signup";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [setupCode, setSetupCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  // Step 2 (one-time code): { id, sentTo, resendAfter }
  const [challenge, setChallenge] = useState(null);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [resetDone, setResetDone] = useState("");

  const finish = async (result) => {
    if (!result.is_video_admin) {
      await authApi.logout();
      throw new Error("This account is not configured as the video library owner.");
    }
    navigate("/videos", { replace: true });
  };

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const result = isSignup
        ? await authApi.signup(name.trim(), email.trim(), password, setupCode)
        : await authApi.login(email.trim(), password);
      if (result.otp_required) {
        setChallenge({ id: result.challenge_id, sentTo: result.sent_to, resendAfter: result.resend_after_seconds });
        return;
      }
      if (!result.is_video_admin) {
        await authApi.logout();
        throw new Error(
          "This account is not configured as the video library owner.",
        );
      }
      navigate("/videos", { replace: true });
    } catch (authError) {
      console.error(
        isSignup ? "Video owner registration failed." : "Video owner sign-in failed.",
        authError,
      );
      setError(
        authError.message ||
          (isSignup
            ? "Owner registration failed. Please try again."
            : "Sign-in failed. Please try again."),
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <SEO
        title={`${isSignup ? "Owner sign-up" : "Owner sign-in"} | Gratia Estates`}
        description={`${isSignup ? "Create" : "Secure"} owner access for managing the Gratia Estates video library.`}
        path={isSignup ? "/video-admin/signup" : "/video-admin/login"}
        noindex
      />
      <section className="relative isolate overflow-hidden bg-[#f4f0e7] py-12 sm:py-16 lg:py-20">
        <div
          className="pointer-events-none absolute -right-36 -top-40 -z-10 size-[28rem] rounded-full bg-[#d9c18d]/25 blur-3xl"
          aria-hidden="true"
        />
        <div className="container-luxury grid overflow-hidden rounded-[2rem] bg-white shadow-[0_30px_90px_rgba(20,37,54,.16)] lg:grid-cols-[.88fr_1.12fr]">
          <aside className="relative flex flex-col justify-between overflow-hidden bg-[#142536] p-7 text-white sm:p-10 lg:p-12">
            <div
              className="pointer-events-none absolute -bottom-24 -left-24 size-80 rounded-full border border-white/10"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute -bottom-14 -left-14 size-60 rounded-full border border-white/10"
              aria-hidden="true"
            />
            <div className="relative">
              <Link to="/" aria-label="Gratia Estates home">
                <Logo variant="light" className="h-12 text-[18px]" />
              </Link>
              <p className="mt-10 text-xs font-bold uppercase tracking-[.2em] text-[#e1c98f]">
                Video library
              </p>
              <h1 className="mt-4 max-w-md font-display text-3xl font-semibold leading-tight text-white sm:text-4xl">
                {isSignup
                  ? "Set up your video library owner account."
                  : "Welcome back to your video library."}
              </h1>
              <p className="mt-5 max-w-md text-sm leading-7 text-white/70">
                {isSignup
                  ? "Create the owner account with the configured owner email and private setup code."
                  : "Sign in with your Gratia Estates owner email and password."}
              </p>
            </div>
            <div className="relative mt-10 flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[.06] p-4">
              <ShieldCheck
                size={21}
                className="mt-0.5 shrink-0 text-[#e1c98f]"
                aria-hidden="true"
              />
              <p className="text-xs leading-5 text-white/75">
                Only the configured owner account can change videos. Owner
                registration requires a private setup code and closes after
                the account is created.
              </p>
            </div>
          </aside>

          <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-14">
            <div className="mb-8 flex items-center gap-2 text-xs font-bold uppercase tracking-[.16em] text-[#9a7940]">
              <LockKeyhole size={15} aria-hidden="true" />
              Secure owner access
            </div>
            <h2 className="font-display text-3xl font-semibold text-[#142536] sm:text-4xl">
              {isSignup ? "Create owner account" : "Sign in"}
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#68737e]">
              {isSignup
                ? "Register the configured owner account. This one-time setup is locked after registration."
                : "Use your existing owner account, or create it if this is your first sign-in."}
            </p>

            {error && (
              <div
                role="alert"
                className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-800"
              >
                <p className="font-semibold">Sign-in could not continue</p>
                <p className="mt-1">{error}</p>
              </div>
            )}

            {resetDone && !forgotOpen && (
              <p role="status" className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                {resetDone}
              </p>
            )}
            {forgotOpen ? (
              <ForgotPassword
                initialEmail={email}
                onDone={(message) => {
                  setForgotOpen(false);
                  setResetDone(message);
                  setPassword("");
                }}
                onCancel={() => setForgotOpen(false)}
              />
            ) : challenge ? (
              <CodeStep
                challenge={challenge}
                onVerified={finish}
                onResent={(next) => setChallenge({ id: next.challenge_id, sentTo: next.sent_to, resendAfter: next.resend_after_seconds })}
                onBack={() => {
                  setChallenge(null);
                  setPassword("");
                }}
              />
            ) : (
            <form onSubmit={submit} className="mt-8 grid gap-5">
              {isSignup && (
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-[#263746]">
                    Name
                  </span>
                  <input
                    type="text"
                    autoComplete="name"
                    minLength={2}
                    maxLength={100}
                    required
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Your name"
                    className="w-full rounded-xl border border-[#d9dce0] bg-[#fbfaf7] px-4 py-3.5 text-sm text-[#142536] outline-none transition placeholder:text-[#9ba2a9] focus:border-[#c9a45c] focus:bg-white focus:ring-4 focus:ring-[#c9a45c]/15"
                  />
                </label>
              )}
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-[#263746]">
                  Email
                </span>
                <input
                  type="email"
                  autoComplete={isSignup ? "email" : "username"}
                  autoCapitalize="none"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="name@example.com"
                  className="w-full rounded-xl border border-[#d9dce0] bg-[#fbfaf7] px-4 py-3.5 text-sm text-[#142536] outline-none transition placeholder:text-[#9ba2a9] focus:border-[#c9a45c] focus:bg-white focus:ring-4 focus:ring-[#c9a45c]/15"
                />
              </label>
              {isSignup && (
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-[#263746]">
                    Private setup code
                  </span>
                  <input
                    type="password"
                    autoComplete="off"
                    minLength={32}
                    maxLength={256}
                    required
                    value={setupCode}
                    onChange={(event) => setSetupCode(event.target.value)}
                    placeholder="Enter the code configured on the backend"
                    className="w-full rounded-xl border border-[#d9dce0] bg-[#fbfaf7] px-4 py-3.5 text-sm text-[#142536] outline-none transition placeholder:text-[#9ba2a9] focus:border-[#c9a45c] focus:bg-white focus:ring-4 focus:ring-[#c9a45c]/15"
                  />
                </label>
              )}
              <label className="block">
                <span className="mb-2 flex items-center justify-between text-sm font-semibold text-[#263746]">
                  Password
                  {!isSignup && (
                    <button
                      type="button"
                      onClick={() => {
                        setError("");
                        setResetDone("");
                        setForgotOpen(true);
                      }}
                      className="text-xs font-semibold text-[#9a7940] hover:text-[#142536] hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </span>
                <span className="relative block">
                  <input
                    type={showPassword ? "text" : "password"}
                    autoComplete={isSignup ? "new-password" : "current-password"}
                    minLength={isSignup ? 8 : undefined}
                    maxLength={128}
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your password"
                    className="w-full rounded-xl border border-[#d9dce0] bg-[#fbfaf7] px-4 py-3.5 pr-12 text-sm text-[#142536] outline-none transition placeholder:text-[#9ba2a9] focus:border-[#c9a45c] focus:bg-white focus:ring-4 focus:ring-[#c9a45c]/15"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((shown) => !shown)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    aria-pressed={showPassword}
                    className="absolute inset-y-0 right-0 grid w-12 place-items-center text-[#68737e] transition hover:text-[#142536] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#c9a45c]"
                  >
                    {showPassword ? (
                      <EyeOff size={18} aria-hidden="true" />
                    ) : (
                      <Eye size={18} aria-hidden="true" />
                    )}
                  </button>
                </span>
              </label>
              <button
                type="submit"
                disabled={submitting}
                className="mt-2 inline-flex min-h-12 items-center justify-center rounded-full bg-[#142536] px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#263f55] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#c9a45c]/40 disabled:cursor-wait disabled:opacity-65"
              >
                {submitting
                  ? isSignup
                    ? "Creating account..."
                    : "Signing in..."
                  : isSignup
                    ? "Create owner account"
                    : "Sign in to video library"}
              </button>
            </form>
            )}

            <div className="mt-7 border-t border-[#e7e2d8] pt-6">
              <div className="flex flex-col gap-4">
                <Link
                  to={isSignup ? "/video-admin/login" : "/video-admin/signup"}
                  className="text-sm font-semibold text-[#9a7940] transition hover:text-[#142536]"
                >
                  {isSignup
                    ? "Already registered? Sign in"
                    : "First time here? Create the owner account"}
                </Link>
                <Link
                  to="/videos"
                  className="inline-flex items-center gap-2 text-sm font-medium text-[#68737e] transition hover:text-[#142536]"
                >
                  <ArrowLeft size={15} aria-hidden="true" />
                  Back to videos
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

// Step 2: six boxes for the emailed code, with paste support and a resend timer.
function CodeStep({ challenge, onVerified, onResent, onBack }) {
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [wait, setWait] = useState(challenge.resendAfter ?? 30);
  const [notice, setNotice] = useState("");
  const boxes = useRef([]);

  useEffect(() => {
    boxes.current[0]?.focus();
  }, [challenge.id]);

  useEffect(() => {
    if (wait <= 0) return undefined;
    const timer = window.setTimeout(() => setWait((w) => w - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [wait]);

  const verify = async (code) => {
    setBusy(true);
    setError("");
    try {
      const result = await authApi.verifyCode(challenge.id, code);
      await onVerified(result);
    } catch (verifyError) {
      setError(verifyError.message || "That code didn't work. Please try again.");
      setDigits(["", "", "", "", "", ""]);
      boxes.current[0]?.focus();
    } finally {
      setBusy(false);
    }
  };

  const setDigit = (index, value) => {
    const clean = value.replace(/\D/g, "");
    if (clean.length > 1) {
      // Pasted or autofilled code: spread it across the boxes.
      const next = clean.slice(0, 6).split("");
      const filled = [...next, ...Array(6 - next.length).fill("")];
      setDigits(filled);
      boxes.current[Math.min(next.length, 5)]?.focus();
      if (next.length === 6) verify(next.join(""));
      return;
    }
    const next = [...digits];
    next[index] = clean;
    setDigits(next);
    if (clean && index < 5) boxes.current[index + 1]?.focus();
    if (next.every(Boolean)) verify(next.join(""));
  };

  const onKeyDown = (index, event) => {
    if (event.key === "Backspace" && !digits[index] && index > 0) boxes.current[index - 1]?.focus();
    if (event.key === "ArrowLeft" && index > 0) boxes.current[index - 1]?.focus();
    if (event.key === "ArrowRight" && index < 5) boxes.current[index + 1]?.focus();
  };

  const resend = async () => {
    setError("");
    setNotice("");
    try {
      const next = await authApi.resendCode(challenge.id);
      onResent(next);
      setWait(next.resend_after_seconds ?? 30);
      setDigits(["", "", "", "", "", ""]);
      setNotice("A new code is on its way.");
    } catch (resendError) {
      setError(resendError.message);
    }
  };

  return (
    <form
      className="mt-8"
      onSubmit={(event) => {
        event.preventDefault();
        if (digits.every(Boolean)) verify(digits.join(""));
        else setError("Please enter all 6 digits.");
      }}
    >
      <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-emerald-600 text-white">
          <MailCheck size={19} aria-hidden="true" />
        </span>
        <p className="text-sm leading-6 text-emerald-900">
          We've sent a 6-digit code to <strong>{challenge.sentTo}</strong>. Enter it below to
          finish signing in. The code expires in 10 minutes.
        </p>
      </div>

      <fieldset className="mt-6">
        <legend className="mb-3 text-sm font-semibold text-[#263746]">Verification code</legend>
        <div className="flex gap-2 sm:gap-3">
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (boxes.current[index] = el)}
              value={digit}
              onChange={(event) => setDigit(index, event.target.value)}
              onKeyDown={(event) => onKeyDown(index, event)}
              inputMode="numeric"
              autoComplete={index === 0 ? "one-time-code" : "off"}
              maxLength={index === 0 ? 6 : 1}
              aria-label={`Digit ${index + 1}`}
              disabled={busy}
              className="h-14 w-full min-w-0 rounded-xl border border-[#d9dce0] bg-[#fbfaf7] text-center font-display text-2xl font-bold text-[#142536] outline-none transition focus:border-[#c9a45c] focus:bg-white focus:ring-4 focus:ring-[#c9a45c]/15 disabled:opacity-60 sm:h-16"
            />
          ))}
        </div>
      </fieldset>

      {error && <p role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}
      {notice && !error && <p role="status" className="mt-4 text-sm text-emerald-700">{notice}</p>}

      <button
        type="submit"
        disabled={busy}
        className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#142536] px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#263f55] disabled:opacity-65"
      >
        {busy ? <Loader2 size={17} className="animate-spin" aria-hidden="true" /> : <ShieldCheck size={17} aria-hidden="true" />}
        {busy ? "Verifying..." : "Verify and sign in"}
      </button>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm">
        <button type="button" onClick={onBack} className="inline-flex items-center gap-1.5 font-medium text-[#68737e] hover:text-[#142536]">
          <ArrowLeft size={15} aria-hidden="true" /> Use a different account
        </button>
        <button
          type="button"
          onClick={resend}
          disabled={wait > 0}
          className="inline-flex items-center gap-1.5 font-semibold text-[#9a7940] hover:text-[#142536] disabled:cursor-not-allowed disabled:text-[#9aa3ac]"
        >
          <RotateCw size={14} aria-hidden="true" />
          {wait > 0 ? `Resend code in ${wait}s` : "Resend code"}
        </button>
      </div>
    </form>
  );
}

// "Forgot password?": email -> one-time code + new password -> done.
function ForgotPassword({ initialEmail, onDone, onCancel }) {
  const [email, setEmail] = useState(initialEmail || "");
  const [challenge, setChallenge] = useState(null);
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [wait, setWait] = useState(0);

  useEffect(() => {
    if (wait <= 0) return undefined;
    const timer = window.setTimeout(() => setWait((w) => w - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [wait]);

  const requestCode = async (event) => {
    event?.preventDefault();
    setError("");
    setBusy(true);
    try {
      const result = challenge
        ? await authApi.resendCode(challenge.challenge_id)
        : await authApi.forgotPassword(email.trim());
      setChallenge(result);
      setWait(result.resend_after_seconds ?? 30);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  };

  const reset = async (event) => {
    event.preventDefault();
    setError("");
    if (!/^\d{6}$/.test(code)) return setError("Please enter the 6-digit code.");
    if (newPassword.length < 8) return setError("Your new password needs at least 8 characters.");
    if (newPassword !== confirmPassword) return setError("The two passwords don't match.");
    setBusy(true);
    try {
      const result = await authApi.resetPassword(challenge.challenge_id, code, newPassword);
      onDone(result.message);
    } catch (resetError) {
      setError(resetError.message);
    } finally {
      setBusy(false);
    }
  };

  const input =
    "w-full rounded-xl border border-[#d9dce0] bg-[#fbfaf7] px-4 py-3.5 text-sm text-[#142536] outline-none transition placeholder:text-[#9ba2a9] focus:border-[#c9a45c] focus:bg-white focus:ring-4 focus:ring-[#c9a45c]/15";

  return (
    <div className="mt-8">
      <div className="flex items-start gap-3 rounded-2xl border border-[#c9a45c]/40 bg-[#fbf6ea] p-4">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#c9a45c] text-[#142536]">
          <KeyRound size={19} aria-hidden="true" />
        </span>
        <div>
          <p className="font-semibold text-[#142536]">Reset your password</p>
          <p className="text-sm leading-6 text-[#5e6872]">
            {challenge
              ? <>If <strong>{challenge.sent_to}</strong> is the owner email, a 6-digit code is on its way. Enter it with your new password.</>
              : "Enter your owner email and we'll send you a one-time code."}
          </p>
        </div>
      </div>

      {!challenge ? (
        <form onSubmit={requestCode} className="mt-6 grid gap-4">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-[#263746]">Owner email</span>
            <input type="email" required autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@example.com" className={input} />
          </label>
          <button type="submit" disabled={busy} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#142536] px-6 py-3 text-sm font-semibold text-white hover:bg-[#263f55] disabled:opacity-65">
            {busy ? <Loader2 size={17} className="animate-spin" aria-hidden="true" /> : <MailCheck size={17} aria-hidden="true" />}
            {busy ? "Sending..." : "Send reset code"}
          </button>
        </form>
      ) : (
        <form onSubmit={reset} className="mt-6 grid gap-4">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-[#263746]">6-digit code</span>
            <input
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={code}
              onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))}
              placeholder="••••••"
              className={`${input} text-center font-display text-2xl font-bold tracking-[.5em]`}
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-[#263746]">New password</span>
            <span className="relative block">
              <input type={show ? "text" : "password"} autoComplete="new-password" minLength={8} value={newPassword} onChange={(event) => setNewPassword(event.target.value)} placeholder="At least 8 characters" className={`${input} pr-12`} />
              <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? "Hide password" : "Show password"} className="absolute inset-y-0 right-0 grid w-12 place-items-center text-[#68737e]">
                {show ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
              </button>
            </span>
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-[#263746]">Confirm new password</span>
            <input type={show ? "text" : "password"} autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Type it again" className={input} />
          </label>
          <button type="submit" disabled={busy} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#142536] px-6 py-3 text-sm font-semibold text-white hover:bg-[#263f55] disabled:opacity-65">
            {busy ? <Loader2 size={17} className="animate-spin" aria-hidden="true" /> : <ShieldCheck size={17} aria-hidden="true" />}
            {busy ? "Updating..." : "Set new password"}
          </button>
          <button type="button" onClick={() => requestCode()} disabled={wait > 0 || busy} className="inline-flex items-center justify-center gap-1.5 text-sm font-semibold text-[#9a7940] hover:text-[#142536] disabled:cursor-not-allowed disabled:text-[#9aa3ac]">
            <RotateCw size={14} aria-hidden="true" />
            {wait > 0 ? `Resend code in ${wait}s` : "Resend code"}
          </button>
        </form>
      )}

      {error && <p role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}

      <button type="button" onClick={onCancel} className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-[#68737e] hover:text-[#142536]">
        <ArrowLeft size={15} aria-hidden="true" /> Back to sign in
      </button>
    </div>
  );
}
