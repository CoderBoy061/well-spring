import { GuestOnly } from "@/components/auth/guest-only";
import { AuthForm } from "@/components/auth/auth-form";

export default function LoginPage() {
  return (
    <GuestOnly>
      <AuthForm mode="login" />
    </GuestOnly>
  );
}
