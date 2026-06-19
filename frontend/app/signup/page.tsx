import { GuestOnly } from "@/components/auth/guest-only";
import { AuthForm } from "@/components/auth/auth-form";

export default function SignupPage() {
  return (
    <GuestOnly>
      <AuthForm mode="signup" />
    </GuestOnly>
  );
}
