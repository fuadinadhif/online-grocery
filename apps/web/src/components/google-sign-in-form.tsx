import { googleSignInAction } from "@/actions/google-sign-in-action";

export default function SignInForm({ className }: { className?: string }) {
  return (
    <form action={googleSignInAction} className={className}>
      <button type="submit">Continue with Google</button>
    </form>
  );
}
