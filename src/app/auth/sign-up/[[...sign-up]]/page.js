import { SignUp } from "@clerk/nextjs";
import { glassAppearance } from "@/lib/clerkAppearance";

export default function SignUpPage() {
  return <SignUp appearance={glassAppearance} path="/auth/sign-up" routing="path" signInUrl="/auth/sign-in" />;
}
