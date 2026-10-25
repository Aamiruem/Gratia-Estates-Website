import { useState } from "react";
import { ArrowLeft, Eye, EyeOff, LockKeyhole, ShieldCheck } from "lucide-react";
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

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const result = isSignup
        ? await authApi.signup(name.trim(), email.trim(), password, setupCode)
        : await authApi.login(email.trim(), password);
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
                <span className="mb-2 block text-sm font-semibold text-[#263746]">
                  Password
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
