import { googleSignInAction } from "@/actions/google-sign-in-action";

export default function GoogleSignInForm({
  className,
}: {
  className?: string;
}) {
  return (
    <form action={googleSignInAction} className={`${className} cursor-pointer`}>
      <button type="submit" className="cursor-pointer">
        Continue with Google
      </button>
    </form>
  );
}
