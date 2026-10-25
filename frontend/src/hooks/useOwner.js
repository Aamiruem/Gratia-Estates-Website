import { useEffect, useState } from "react";
import { authApi } from "../services/authApi";

// Shared "is the signed-in user the video owner?" state for the whole site.
// Pages announce sign-in / sign-out with notifyAuthChanged() so the header
// updates immediately.
const EVENT = "gratia-auth-changed";
let cached = null; // { checked, isOwner, user }
let inflight = null;

async function check() {
  try {
    const session = await authApi.restoreSession();
    cached = { checked: true, isOwner: session?.is_video_admin === true, user: session?.user ?? null };
  } catch {
    cached = { checked: true, isOwner: false, user: null };
  }
  return cached;
}

export function notifyAuthChanged() {
  cached = null;
  inflight = null;
  window.dispatchEvent(new Event(EVENT));
}

export default function useOwner() {
  const [state, setState] = useState(cached ?? { checked: false, isOwner: false, user: null });

  useEffect(() => {
    let active = true;
    const refresh = () => {
      inflight = inflight ?? check();
      inflight.then((result) => active && setState(result));
    };
    if (!cached) refresh();
    window.addEventListener(EVENT, refresh);
    return () => {
      active = false;
      window.removeEventListener(EVENT, refresh);
    };
  }, []);

  return state;
}
