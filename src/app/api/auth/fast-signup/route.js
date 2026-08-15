import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { email, firstName, lastName } = await req.json();

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 },
      );
    }

    const user = await clerkClient.users.createUser({
      emailAddress: [email],
      firstName: firstName || "",
      lastName: lastName || "",
      skipPasswordRequirement: true,
      skipPasswordChecks: true,
    });

    const tokenResponse = await clerkClient.signInTokens.createSignInToken({
      userId: user.id,
      expiresInSeconds: 60 * 5,
    });

    return NextResponse.json({
      success: true,
      ticket: tokenResponse.token,
    });
  } catch (error) {
    console.error("Fast Signup Error:", error);

    const isExistingUser = error.errors?.some(
      (err) => err.code === "form_identifier_exists",
    );

    if (isExistingUser) {
      return NextResponse.json({ success: false, error: "EXISTS" });
    }

    return NextResponse.json(
      { success: false, error: error.message || "Failed to create user" },
      { status: 500 },
    );
  }
}
