import { signOutAction } from "@/actions/sign-out-action";

export default function OAuthSignOutForm() {
  return (
    <form action={signOutAction} className="cursor-pointer">
      <button type="submit" className="cursor-pointer">
        Sign Out
      </button>
    </form>
  );
}
