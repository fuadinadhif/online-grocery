import { signOutAction } from "@/actions/sign-out-action";

export default function SignOutForm() {
  return (
    <form action={signOutAction}>
      <button type="submit">Sign Out</button>
    </form>
  );
}
