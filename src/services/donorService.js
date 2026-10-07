import { supabase } from "../lib/supabase";

// ============================================
// HELPER: Generate donor code
// ============================================
function generateDonorCode() {
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `DNR-${rand}`;
}

// ============================================
// HELPER: Calculate donor eligibility
// ============================================
function calculateDonorEligibility(formData) {
  if (formData.hemoglobinOk === "no") {
    return {
      level: "block",
      reason: "Low hemoglobin — please address this first.",
    };
  }

  if (formData.weightOver50 === "no") {
    return {
      level: "block",
      reason: "Minimum weight for donation is 50 kg.",
    };
  }

  if ((formData.chronic || []).length > 0) {
    return {
      level: "block",
      reason: `Cannot donate with: ${formData.chronic.join(", ")}`,
    };
  }

  if (formData.smoker === "yes" || formData.alcohol === "yes") {
    return {
      level: "caution",
      reason: "Smoker/alcohol use noted — staff will review during intake.",
    };
  }

  return {
    level: "ok",
    reason: "Eligible to donate",
  };
}

// ============================================
// REGISTER DONOR - Full signup flow
// ============================================
export async function registerDonor(formData) {
  // Step 1: Create Supabase Auth user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
  });

  if (authError) throw new Error(authError.message);
  if (!authData.user) {
    throw new Error("Check your email to confirm account.");
  }

  const userId = authData.user.id;

  // Step 2: Create user account
  const { data: account, error: accountError } = await supabase
    .from("user_accounts")
    .insert({
      id: userId,
      user_code: generateDonorCode(),
      role: "donor",
      full_name: formData.fullName,
      email: formData.email,
      mobile: formData.phone,
      account_status: "active",
      email_verified: false,
      mobile_verified: false,
    })
    .select()
    .single();

  if (accountError) throw new Error(accountError.message);

  // Step 3: Calculate eligibility
  const eligibility = calculateDonorEligibility(formData);

  // Step 4: Create donor profile
  const { data: profile, error: profileError } = await supabase
    .from("donor_profiles")
    .insert({
      user_id: userId,
      blood_group: formData.bloodGroup,
      gender: formData.gender,
      dob: formData.dob,
      weight_over_50: formData.weightOver50 === "yes",
      hemoglobin_ok: formData.hemoglobinOk === "yes",
      is_smoker: formData.smoker === "yes",
      consumes_alcohol: formData.alcohol === "yes",
      alcohol_frequency: formData.alcoholFreq || null,
      chronic_conditions: formData.chronic || [],
      last_donation_date: formData.lastDonation || null,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      pincode: formData.pincode,
      latitude: formData.lat ? parseFloat(formData.lat) : null,
      longitude: formData.lng ? parseFloat(formData.lng) : null,
      aadhaar_number: formData.aadhaar || null,
      eligibility_level: eligibility.level,
      eligibility_reason: eligibility.reason,
      available: eligibility.level === "ok" || eligibility.level === "caution",
      is_verified: false,
    })
    .select()
    .single();

  if (profileError) {
     
    await supabase.auth.admin.deleteUser(userId);
    throw new Error(profileError.message);
  }

  return {
    id: profile.id,
    userId,
    fullName: account.full_name,
    email: account.email,
    phone: account.mobile,
    bloodGroup: profile.blood_group,
    city: profile.city,
    eligibility,
  };
}

 
// GET DONOR PROFILE 
 
export async function getDonorProfile(userId) {
  const { data: account, error: accountError } = await supabase
    .from("user_accounts")
    .select("*")
    .eq("id", userId)
    .single();

  if (accountError) throw new Error(accountError.message);

  const { data: profile, error: profileError } = await supabase
    .from("donor_profiles")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (profileError) throw new Error(profileError.message);

  return {
    id: profile.id,
    userId,
    fullName: account.full_name,
    email: account.email,
    phone: account.mobile,
    gender: profile.gender,
    dob: profile.dob,
    bloodGroup: profile.blood_group,
    address: profile.address,
    city: profile.city,
    state: profile.state,
    pincode: profile.pincode,
    lastDonation: profile.last_donation_date,
    available: profile.available,
    verified: profile.is_verified,
    eligibility: {
      level: profile.eligibility_level || "ok",
      reason: profile.eligibility_reason || "",
    },
    latitude: profile.latitude,
    longitude: profile.longitude,
  };
}