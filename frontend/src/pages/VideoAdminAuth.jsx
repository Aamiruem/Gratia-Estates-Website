import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Loader2, LockKeyhole, MailCheck, RotateCw, ShieldCheck, Smartphone } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import SEO from "../components/SEO";
import { authApi } from "../services/authApi";

const inputClass =
  "w-full rounded-xl border border-[#d9dce0] bg-[#fbfaf7] px-4 py-3.5 text-sm text-[#142536] outline-none transition placeholder:text-[#9ba2a9] focus:border-[#c9a45c] focus:bg-white focus:ring-4 focus:ring-[#c9a45c]/15";

export default function VideoAdminAuth() {
  const navigate = useNavigate();
  const [otpChannel, setOtpChannel] = useState("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [otpOptions, setOtpOptions] = useState({ email: false, phone: false });
  const [otpOptionsLoaded, setOtpOptionsLoaded] = useState(false);
  const [otpOptionsError, setOtpOptionsError] = useState("");
  const [otpOptionsRefresh, setOtpOptionsRefresh] = useState(0);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  // Step 2 (one-time code): { id, sentTo, channel, deliveredVia, resendAfter }
  const [challenge, setChallenge] = useState(null);

  useEffect(() => {
    authApi
      .otpOptions()
      .then((options) => {
        setOtpOptions(options);
        setOtpOptionsError("");
        setOtpOptionsLoaded(true);
        if (!options.email && options.phone) setOtpChannel("phone");
      })
      .catch((optionsError) => {
        console.error("Could not load owner verification options.", optionsError);
        setOtpOptionsError("Could not reach the server. Make sure the backend is running, then try again.");
        setOtpOptionsLoaded(true);
      });
  }, [otpOptionsRefresh]);

  const finish = async (result) => {
    if (!result.is_video_admin) {
      await authApi.logout();
      throw new Error("This account is not configured as the video library owner.");
    }
    navigate("/videos", { replace: true });
  };

  const toChallenge = (result, fallback = {}) => ({
    id: result.challenge_id,
    sentTo: result.sent_to,
    channel: result.channel || fallback.channel || otpChannel,
    deliveredVia: result.delivered_via || fallback.deliveredVia,
    localCode: result.local_code,
    expiresInMinutes: result.expires_in_minutes ?? 10,
    resendAfter: result.resend_after_seconds,
  });

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const identifier = otpChannel === "phone" ? phone.trim() : email.trim();
      setChallenge(toChallenge(await authApi.login(otpChannel, identifier)));
    } catch (authError) {
      console.error("Video owner sign-in failed.", authError);
      setError(authError.message || "Could not send the code. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const channels = [
    { id: "email", label: "Email OTP", icon: MailCheck, hint: otpOptions.email_hint },
    { id: "phone", label: "Mobile OTP", icon: Smartphone, hint: otpOptions.phone_hint },
  ];

  return (
    <>
      <SEO
        title="Owner sign-in | Gratia Estates"
        description="Secure owner access for managing the Gratia Estates video library."
        path="/video-admin/login"
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
                Welcome back to your video library.
              </h1>
              <p className="mt-5 max-w-md text-sm leading-7 text-white/70">
                No password needed. Sign in with a one-time code sent to your owner email or mobile number.
              </p>
            </div>
            <div className="relative mt-10 flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[.06] p-4">
              <ShieldCheck size={21} className="mt-0.5 shrink-0 text-[#e1c98f]" aria-hidden="true" />
              <p className="text-xs leading-5 text-white/75">
                Only the owner&apos;s registered email or mobile number can receive a sign-in code.
              </p>
            </div>
          </aside>

          <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-14">
            <div className="mb-8 flex items-center gap-2 text-xs font-bold uppercase tracking-[.16em] text-[#9a7940]">
              <LockKeyhole size={15} aria-hidden="true" />
              Secure owner access
            </div>
            <h2 className="font-display text-3xl font-semibold text-[#142536] sm:text-4xl">Sign in</h2>
            <p className="mt-3 text-sm leading-6 text-[#68737e]">
              Choose where to receive your one-time code.
            </p>

            {error && (
              <div role="alert" className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-800">
                {error}
              </div>
            )}

            {challenge ? (
              <CodeStep
                challenge={challenge}
                onVerified={finish}
                onResent={(next) => setChallenge(toChallenge(next, challenge))}
                onBack={() => setChallenge(null)}
              />
            ) : (
              <form onSubmit={submit} className="mt-8 grid gap-5">
                <fieldset className="grid gap-2 sm:grid-cols-2">
                  <legend className="mb-2 text-sm font-semibold text-[#263746]">Send code to</legend>
                  {channels.map(({ id, label, icon: Icon, hint }) => {
                    const available = otpOptions[id];
                    const selected = otpChannel === id;
                    return (
                      <label
                        key={id}
                        className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm transition ${selected && available ? "border-[#c9a45c] bg-[#fbf8f0]" : "border-[#d9dce0] bg-white"} ${available ? "cursor-pointer" : "cursor-not-allowed opacity-60"}`}
                      >
                        <input
                          type="radio"
                          name="otp-channel"
                          value={id}
                          checked={selected}
                          onChange={() => {
                            setOtpChannel(id);
                            setError("");
                          }}
                          disabled={!available}
                          className="mt-1 accent-[#9a7940]"
                        />
                        <span>
                          <span className="flex items-center gap-2 font-medium text-[#263746]">
                            <Icon size={17} className="text-[#9a7940]" aria-hidden="true" />
                            {label}
                          </span>
                          {hint && <span className="mt-1 block text-xs text-[#68737e]">{hint}</span>}
                        </span>
                      </label>
                    );
                  })}
                </fieldset>

                {otpOptionsError && (
                  <div role="alert" className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-900">
                    <p>{otpOptionsError}</p>
                    <button
                      type="button"
                      onClick={() => {
                        setOtpOptionsLoaded(false);
                        setOtpOptionsRefresh((attempt) => attempt + 1);
                      }}
                      className="mt-2 font-semibold underline"
                    >
                      Try again
                    </button>
                  </div>
                )}

                {otpChannel === "phone" ? (
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-[#263746]">Mobile number</span>
                    <input
                      type="tel"
                      autoComplete="tel"
                      inputMode="tel"
                      required
                      maxLength={20}
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      placeholder="+91 98765 43210"
                      className={inputClass}
                    />
                  </label>
                ) : (
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-[#263746]">Email</span>
                    <input
                      type="email"
                      autoComplete="username"
                      autoCapitalize="none"
                      required
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="name@example.com"
                      className={inputClass}
                    />
                  </label>
                )}

                <button
                  type="submit"
                  disabled={submitting || !otpOptionsLoaded || !otpOptions[otpChannel]}
                  className="mt-2 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#142536] px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#263f55] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#c9a45c]/40 disabled:cursor-not-allowed disabled:opacity-65"
                >
                  {submitting && <Loader2 size={17} className="animate-spin" aria-hidden="true" />}
                  {submitting
                    ? "Sending code..."
                    : !otpOptionsLoaded
                      ? "Checking..."
                      : otpOptions[otpChannel]
                        ? "Send OTP"
                        : "OTP unavailable"}
                </button>
              </form>
            )}

            <div className="mt-7 border-t border-[#e7e2d8] pt-6">
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
      </section>
    </>
  );
}

// Step 2: six boxes for the code, with paste support, an expiry countdown and a resend timer.
function CodeStep({ challenge, onVerified, onResent, onBack }) {
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [wait, setWait] = useState(challenge.resendAfter ?? 30);
  const [remaining, setRemaining] = useState(challenge.expiresInMinutes * 60);
  const [notice, setNotice] = useState("");
  const boxes = useRef([]);
  const isPhone = challenge.channel === "phone";

  useEffect(() => {
    setRemaining(challenge.expiresInMinutes * 60);
    boxes.current[0]?.focus();
  }, [challenge.id, challenge.expiresInMinutes]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setWait((w) => Math.max(w - 1, 0));
      setRemaining((r) => Math.max(r - 1, 0));
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

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

  const fillAndVerify = (code) => {
    setDigits(code.split(""));
    verify(code);
  };

  const setDigit = (index, value) => {
    const clean = value.replace(/\D/g, "");
    if (clean.length > 1) {
      // Pasted or autofilled code: spread it across the boxes.
      const next = clean.slice(0, 6).split("");
      setDigits([...next, ...Array(6 - next.length).fill("")]);
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
      setNotice("A new code has been sent.");
    } catch (resendError) {
      setError(resendError.message);
    }
  };

  const minutes = Math.floor(remaining / 60);
  const seconds = String(remaining % 60).padStart(2, "0");
  const expired = remaining === 0;

  const destination =
    challenge.deliveredVia === "push"
      ? "your phone (ntfy app notification)"
      : challenge.deliveredVia === "log"
        ? "this computer (local test mode)"
        : challenge.sentTo;

  return (
    <form
      className="mt-8"
      onSubmit={(event) => {
        event.preventDefault();
        if (digits.every(Boolean)) verify(digits.join(""));
        else setError("Please enter all 6 digits.");
      }}
    >
      <div className="flex items-center gap-4 rounded-2xl border border-[#e7e2d8] bg-[#fbf8f0] p-4">
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[#142536] text-[#e1c98f]">
          {isPhone ? <Smartphone size={22} aria-hidden="true" /> : <MailCheck size={22} aria-hidden="true" />}
        </span>
        <div className="min-w-0">
          <p className="font-semibold text-[#142536]">Enter your 6-digit code</p>
          <p className="mt-0.5 text-sm leading-6 text-[#5e6872]">
            Sent to <strong className="font-semibold text-[#263746]">{destination}</strong>
          </p>
        </div>
      </div>

      {challenge.localCode && (
        <div className="mt-4 rounded-2xl border border-[#c9a45c]/50 bg-gradient-to-br from-[#fff9ec] to-[#f6ecd6] p-5">
          <p className="text-xs font-bold uppercase tracking-[.16em] text-[#9a7940]">Local test mode · your code</p>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
            <p className="font-display text-4xl font-bold tracking-[.3em] text-[#142536]" aria-live="polite">
              {challenge.localCode}
            </p>
            <button
              type="button"
              onClick={() => fillAndVerify(challenge.localCode)}
              disabled={busy || expired}
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#142536] px-5 text-sm font-semibold text-white transition hover:bg-[#263f55] disabled:opacity-60"
            >
              <ShieldCheck size={16} aria-hidden="true" />
              Use this code
            </button>
          </div>
          <p className="mt-3 text-xs leading-5 text-[#7a6a4a]">
            Shown only on this computer because real email/SMS delivery is not set up yet.
          </p>
        </div>
      )}

      <fieldset className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <legend className="text-sm font-semibold text-[#263746]">Verification code</legend>
          <span className={`text-xs font-semibold ${expired ? "text-red-700" : "text-[#68737e]"}`}>
            {expired ? "Code expired · resend below" : `Expires in ${minutes}:${seconds}`}
          </span>
        </div>
        <div className="grid grid-cols-6 gap-2 sm:gap-3">
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
              className={`h-14 w-full min-w-0 rounded-xl border text-center font-display text-2xl font-bold text-[#142536] outline-none transition focus:border-[#c9a45c] focus:bg-white focus:ring-4 focus:ring-[#c9a45c]/15 disabled:opacity-60 sm:h-16 ${digit ? "border-[#c9a45c] bg-white" : "border-[#d9dce0] bg-[#fbfaf7]"}`}
            />
          ))}
        </div>
      </fieldset>

      {error && <p role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}
      {notice && !error && <p role="status" className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{notice}</p>}

      <button
        type="submit"
        disabled={busy || expired}
        className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#142536] px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#263f55] disabled:cursor-not-allowed disabled:opacity-65"
      >
        {busy ? <Loader2 size={17} className="animate-spin" aria-hidden="true" /> : <ShieldCheck size={17} aria-hidden="true" />}
        {busy ? "Verifying..." : "Verify and sign in"}
      </button>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm">
        <button type="button" onClick={onBack} className="inline-flex items-center gap-1.5 font-medium text-[#68737e] hover:text-[#142536]">
          <ArrowLeft size={15} aria-hidden="true" /> Change email / mobile
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

      {!challenge.localCode && (
        <details className="mt-6 rounded-xl border border-[#e7e2d8] px-4 py-3 text-sm text-[#5e6872]">
          <summary className="cursor-pointer font-semibold text-[#263746]">Didn&apos;t get the code?</summary>
          <ul className="mt-2 list-disc space-y-1 pl-5 leading-6">
            {challenge.deliveredVia === "push" ? (
              <>
                <li>Open the ntfy app and check you are subscribed to your private Gratia channel.</li>
                <li>Allow notifications for ntfy in your phone settings.</li>
              </>
            ) : (
              <li>Check your spam or junk folder.</li>
            )}
            <li>Wait a few seconds, then press Resend code.</li>
          </ul>
        </details>
      )}
    </form>
  );
}
