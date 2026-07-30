import { SignIn } from "@clerk/nextjs";
import { glassAppearance } from "@/lib/clerkAppearance";

export default function SignInPage() {
  return <SignIn appearance={glassAppearance} path="/auth/sign-in" routing="path" signUpUrl="/auth/sign-up" />;
}
