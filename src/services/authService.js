import { supabase } from "../lib/supabase";

// SIGNUP - New donor registratio
export async function signup({ fullName, email, mobile, password }) {
  // Step 1: Create Supabase Auth user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) throw new Error(authError.message);
  if (!authData.user) {
    throw new Error("Signup started — check your email to confirm account before logging in.");
  }

  // Step 2: Create user profile in user_accounts
  const { data: profile, error: profileError } = await supabase
    .from("user_accounts")
    .insert({
      id: authData.user.id,
      user_code: generateUserCode("donor"),
      role: "donor",
      full_name: fullName,
      email,
      mobile,
      account_status: "active",
      email_verified: false,
      mobile_verified: false,
    })
    .select()
    .single();

  if (profileError) {
    // Clean up auth user if profile creation fails
    await supabase.auth.admin.deleteUser(authData.user.id);
    throw new Error(`Profile creation failed: ${profileError.message}`);
  }

  return profile;
}