import { ArrowLeft, Check, Loader2, Mail, ShieldCheck, X } from "lucide-react";
import { useState } from "react";
import { authApi } from "../services/authApi";

const inputClass =
  "w-full rounded-xl border border-white/15 bg-[#102333] px-4 py-3 text-sm text-white outline-none placeholder:text-white/40 focus:border-[#c9a45c] focus:ring-4 focus:ring-[#c9a45c]/15";

export default function OwnerEmailChange({ currentEmail, onChanged, onCancel }) {
  const [newEmail, setNewEmail] = useState("");
  const [code, setCode] = useState("");
  const [challenge, setChallenge] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const requestCode = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const result = await authApi.startEmailChange(newEmail.trim());
      setChallenge(result);
    } catch (requestError) {
      setError(requestError.message || "Could not send a verification code.");
    } finally {
      setBusy(false);
    }
  };

  const confirmChange = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const result = await authApi.verifyEmailChange(challenge.challenge_id, code.trim());
      onChanged(result);
    } catch (verifyError) {
      setError(verifyError.message || "Could not verify the code.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form
      onSubmit={challenge ? confirmChange : requestCode}
      className="mt-4 grid gap-4 rounded-2xl border border-white/10 bg-[#0b1a27]/70 p-4 sm:p-5"
    >
      <div className="flex items-start gap-3">
        <ShieldCheck size={18} className="mt-0.5 shrink-0 text-[#e1c98f]" aria-hidden="true" />
        <div>
          <p className="text-sm font-semibold text-white">Change owner email</p>
          <p className="mt-1 text-xs leading-5 text-white/65">
            Current owner: {currentEmail}. Verify the new address with a one-time code.
          </p>
        </div>
      </div>

      {challenge ? (
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-white/80">
            Verification code sent to {challenge.sent_to}
          </span>
          <input
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9]{6}"
            maxLength={6}
            required
            value={code}
            onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder="6-digit code"
            className={inputClass}
          />
        </label>
      ) : (
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-white/80">New email address</span>
          <input
            type="email"
            autoComplete="email"
            autoCapitalize="none"
            required
            value={newEmail}
            onChange={(event) => setNewEmail(event.target.value)}
            placeholder="name@example.com"
            className={inputClass}
          />
        </label>
      )}

      {error && <p role="alert" className="rounded-xl border border-red-300/30 bg-red-500/10 px-3 py-2 text-sm text-red-100">{error}</p>}

      <div className="flex flex-wrap gap-2">
        <button
          type="submit"
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-full bg-[#c9a45c] px-4 py-2.5 text-sm font-semibold text-[#142536] transition hover:bg-[#e1c98f] disabled:opacity-60"
        >
          {busy ? <Loader2 size={15} className="animate-spin" aria-hidden="true" /> : challenge ? <Check size={15} aria-hidden="true" /> : <Mail size={15} aria-hidden="true" />}
          {busy ? "Please wait..." : challenge ? "Verify and change email" : "Send verification code"}
        </button>
        {challenge && (
          <button
            type="button"
            disabled={busy}
            onClick={() => {
              setChallenge(null);
              setCode("");
              setError("");
            }}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-2.5 text-sm font-semibold text-white/80 hover:bg-white/10 disabled:opacity-60"
          >
            <ArrowLeft size={14} aria-hidden="true" /> Back
          </button>
        )}
        <button
          type="button"
          disabled={busy}
          onClick={onCancel}
          className="inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-semibold text-white/70 hover:bg-white/10 disabled:opacity-60"
        >
          <X size={14} aria-hidden="true" /> Cancel
        </button>
      </div>
    </form>
  );
}
