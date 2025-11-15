import { OverlayLink } from "components/ui/overlay-link";
import { getSessionRole, clearSession } from "lib/auth/session";

async function doLogout() {
  "use server";
  await clearSession();
}

export async function AuthButtons() {
  const role = await getSessionRole();
  if (!role) {
    return (
      <OverlayLink
        href="/auth/login"
        prefetch={true}
        className="text-[#bf9d6d] px-3 py-2 rounded-md transition-all duration-200 hover:text-[#f0e3d7] hover:bg-[#bf9d6d] font-inter"
      >
        Login
      </OverlayLink>
    );
  }
  return (
    <form action={doLogout}>
      <button
        type="submit"
        className="text-[#bf9d6d] px-3 py-2 rounded-md transition-all duration-200 hover:text-[#f0e3d7] hover:bg-[#bf9d6d] font-inter"
      >
        Logout
      </button>
    </form>
  );
}