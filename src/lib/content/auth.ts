/**
 * Auth copy · follows the same _KA/_EN + getter pattern as the other content
 * modules. AuthProvider sits outside LocaleProvider, so it cannot read locale
 * from context; it returns an AuthErrorCode instead and the form, which is
 * inside the provider, resolves the message.
 */

export type AuthErrorCode =
  | "supabase_not_configured"
  | "email_not_found"
  | "google_not_enabled"
  | "email_not_confirmed"
  | "too_many_requests"
  | "same_password"
  | "password_too_short"
  | "invalid_credentials"
  | "already_registered"
  | "invalid_email"
  | "send_failed"
  | "account_not_created"
  | "current_password_wrong"
  | "google_account_no_password"
  | "unknown";

export interface AuthCopy {
  loading: string;

  loginTitle: string;
  loginSubtitle: string;
  loginFooterPrompt: string;
  loginFooterCta: string;
  oauthFailed: string;

  registerTitle: string;
  registerSubtitle: string;
  registerFooterPrompt: string;
  registerFooterCta: string;
  registerFooterWaitlist: string;
  registerSuccess: string;

  forgotTitle: string;
  forgotSubtitle: string;
  forgotFooterPrompt: string;
  forgotFooterCta: string;
  forgotSubmit: string;
  forgotSent: string;
  resetLinkExpired: string;

  resetTitle: string;
  resetSubtitle: string;
  resetFooterPrompt: string;
  resetFooterCta: string;

  orWithEmail: string;
  emailLabel: string;
  passwordLabel: string;
  passwordPlaceholder: string;
  forgotPasswordLink: string;
  signIn: string;
  nameLabel: string;
  namePlaceholder: string;
  firstNameLabel: string;
  firstNamePlaceholder: string;
  lastNameLabel: string;
  lastNamePlaceholder: string;
  referralCodeLabel: string;
  referralCodePlaceholder: string;
  referralCodeHint: string;
  referralCodeInvalid: string;
  minSixChars: string;
  createAccount: string;

  googleSignIn: string;
  googleRegister: string;

  termsPrefix: string;
  termsLink: string;
  termsAnd: string;
  privacyLink: string;

  newPassword: string;
  repeatNewPassword: string;
  repeatPassword: string;
  savePassword: string;
  currentPassword: string;
  changePassword: string;
  passwordChanged: string;
  passwordTooShort: string;
  passwordsDoNotMatch: string;
  newPasswordMustDiffer: string;
  googleAccountNotice: string;

  showPassword: string;
  hidePassword: string;

  verifyPrompt: string;
  verifyBody: string;
  verifySend: string;
  verifyLater: string;
  verifySent: string;
  close: string;

  errors: Record<AuthErrorCode, string>;
}

export const AUTH_KA: AuthCopy = {
  loading: "იტვირთება…",

  loginTitle: "კეთილი იყოს დაბრუნება",
  loginSubtitle: "შედი შენს Aylopet ანგარიშზე.",
  loginFooterPrompt: "არ გაქვს ანგარიში?",
  loginFooterCta: "რეგისტრაცია",
  oauthFailed: "ავტორიზაცია ვერ მოხერხდა. სცადე თავიდან.",

  registerTitle: "ანგარიშის შექმნა",
  registerSubtitle: "შექმენი Aylopet ანგარიში და გახსენი პერსონალური პანელი.",
  registerFooterPrompt: "უკვე გაქვს ანგარიში?",
  registerFooterCta: "შესვლა",
  registerFooterWaitlist: "მოლოდინის სია",
  registerSuccess:
    "ანგარიში შეიქმნა. შეამოწმე ელ. ფოსტა (inbox და spam) დადასტურების ბმულისთვის, შემდეგ შედი.",

  forgotTitle: "პაროლის აღდგენა",
  forgotSubtitle: "შეიყვანე ელ. ფოსტა და გამოგიგზავნით აღდგენის ბმულს.",
  forgotFooterPrompt: "გაგახსენდა პაროლი?",
  forgotFooterCta: "შესვლა",
  forgotSubmit: "აღდგენის ბმულის გაგზავნა",
  forgotSent:
    "თუ ეს ელ. ფოსტა არსებობს, აღდგენის ბმული გამოგიგზავნეთ. შეამოწმე inbox და spam.",
  resetLinkExpired:
    "აღდგენის ბმული ვადაგასულია ან უკვე გამოყენებულია. მოითხოვე ახალი ბმული.",

  resetTitle: "ახალი პაროლი",
  resetSubtitle: "აირჩიე ახალი პაროლი შენი Aylopet ანგარიშისთვის.",
  resetFooterPrompt: "გსურს გაუქმება?",
  resetFooterCta: "პანელში დაბრუნება",

  orWithEmail: "ან ელ. ფოსტით",
  emailLabel: "ელ. ფოსტა",
  passwordLabel: "პაროლი",
  passwordPlaceholder: "შენი პაროლი",
  forgotPasswordLink: "დაგავიწყდა პაროლი?",
  signIn: "შესვლა",
  nameLabel: "სახელი",
  namePlaceholder: "შენი სახელი",
  firstNameLabel: "სახელი",
  firstNamePlaceholder: "მაგ. ნინო",
  lastNameLabel: "გვარი",
  lastNamePlaceholder: "მაგ. ბერიძე",
  referralCodeLabel: "რეფერალ კოდი",
  referralCodePlaceholder: "AYLO-XXXXXX",
  referralCodeHint: "არასავალდებულო, თუ მეგობარმა მოგიწვია",
  referralCodeInvalid: "კოდის ფორმატი არასწორია (მაგ. AYLO-9K2M4P)",
  minSixChars: "მინიმუმ 6 სიმბოლო",
  createAccount: "ანგარიშის შექმნა",

  googleSignIn: "Google-ით შესვლა",
  googleRegister: "Google-ით რეგისტრაცია",

  termsPrefix: "რეგისტრაციით ეთანხმები",
  termsLink: "წესებს",
  termsAnd: "და",
  privacyLink: "კონფიდენციალურობას",

  newPassword: "ახალი პაროლი",
  repeatNewPassword: "გაიმეორე ახალი პაროლი",
  repeatPassword: "გაიმეორე პაროლი",
  savePassword: "პაროლის შენახვა",
  currentPassword: "მიმდინარე პაროლი",
  changePassword: "პაროლის შეცვლა",
  passwordChanged: "პაროლი წარმატებით შეიცვალა.",
  passwordTooShort: "პაროლი უნდა იყოს მინიმუმ 6 სიმბოლო.",
  passwordsDoNotMatch: "პაროლები არ ემთხვევა.",
  newPasswordMustDiffer: "ახალი პაროლი უნდა განსხვავდებოდეს მიმდინარისგან.",
  googleAccountNotice:
    "შენი ანგარიში Google-ით შედის. პაროლის შეცვლა ამ ანგარიშისთვის არ არის საჭირო.",

  showPassword: "პაროლის ჩვენება",
  hidePassword: "პაროლის დამალვა",

  verifyPrompt: "გსურს ელ. ფოსტის დამატებითი დაცვა?",
  verifyBody:
    "რეგისტრაცია უკვე დასრულებულია. სურვილის შემთხვევაში დაადასტურე ელ. ფოსტა უსაფრთხოებისთვის — ეს არ არის სავალდებულო.",
  verifySend: "გაგზავნე დადასტურების ბმული",
  verifyLater: "ახლა არა",
  verifySent: "დამატებითი დაცვისთვის დადასტურების ბმული გამოგიგზავნეთ.",
  close: "დახურვა",

  errors: {
    supabase_not_configured: "Supabase არ არის კონფიგურირებული.",
    email_not_found: "ელ. ფოსტა ვერ მოიძებნა.",
    google_not_enabled:
      "Google შესვლა ჯერ არ არის ჩართული Supabase-ში. სცადე ელ. ფოსტით ან ჩართე Google provider.",
    email_not_confirmed:
      "ელ. ფოსტა ჯერ არ არის დადასტურებული. გახსენი inbox-ში დადასტურების ბმული, ან პანელიდან გაგზავნე ხელახლა.",
    too_many_requests: "ძალიან ბევრი მცდელობა. დაელოდე ერთ წუთს და სცადე თავიდან.",
    same_password: "ახალი პაროლი უნდა განსხვავდებოდეს არსებულისგან.",
    password_too_short: "პაროლი უნდა იყოს მინიმუმ 6 სიმბოლო.",
    invalid_credentials: "არასწორი ელ. ფოსტა ან პაროლი.",
    already_registered: "ეს ელ. ფოსტა უკვე რეგისტრირებულია. სცადე შესვლა.",
    invalid_email: "შეამოწმე ელ. ფოსტის ფორმატი.",
    send_failed:
      "ელ. ფოსტის გაგზავნა ვერ მოხერხდა. შეამოწმე inbox/spam, ან სცადე ცოტა ხანში.",
    account_not_created: "ანგარიში ვერ შეიქმნა.",
    current_password_wrong: "მიმდინარე პაროლი არასწორია.",
    google_account_no_password:
      "ეს ანგარიში Google-ით შედის. პაროლის შეცვლა აქ არ არის ხელმისაწვდომი.",
    unknown: "დაფიქსირდა შეცდომა. სცადე თავიდან.",
  },
};

export const AUTH_EN: AuthCopy = {
  loading: "Loading…",

  loginTitle: "Welcome back",
  loginSubtitle: "Sign in to your Aylopet account.",
  loginFooterPrompt: "Don't have an account?",
  loginFooterCta: "Register",
  oauthFailed: "Sign in failed. Please try again.",

  registerTitle: "Create an account",
  registerSubtitle: "Create your Aylopet account and open your dashboard.",
  registerFooterPrompt: "Already have an account?",
  registerFooterCta: "Sign in",
  registerFooterWaitlist: "Waitlist",
  registerSuccess:
    "Account created. Check your email (inbox and spam) for the confirmation link, then sign in.",

  forgotTitle: "Reset your password",
  forgotSubtitle: "Enter your email and we'll send you a reset link.",
  forgotFooterPrompt: "Remembered your password?",
  forgotFooterCta: "Sign in",
  forgotSubmit: "Send reset link",
  forgotSent:
    "If that email exists, we've sent a reset link. Check your inbox and spam.",
  resetLinkExpired:
    "This reset link has expired or has already been used. Request a new one.",

  resetTitle: "New password",
  resetSubtitle: "Choose a new password for your Aylopet account.",
  resetFooterPrompt: "Want to cancel?",
  resetFooterCta: "Back to dashboard",

  orWithEmail: "or with email",
  emailLabel: "Email",
  passwordLabel: "Password",
  passwordPlaceholder: "Your password",
  forgotPasswordLink: "Forgot your password?",
  signIn: "Sign in",
  nameLabel: "Name",
  namePlaceholder: "Your name",
  firstNameLabel: "First name",
  firstNamePlaceholder: "e.g. Nino",
  lastNameLabel: "Last name",
  lastNamePlaceholder: "e.g. Beridze",
  referralCodeLabel: "Referral code",
  referralCodePlaceholder: "AYLO-XXXXXX",
  referralCodeHint: "Optional, if a friend invited you",
  referralCodeInvalid: "Invalid code format (e.g. AYLO-9K2M4P)",
  minSixChars: "At least 6 characters",
  createAccount: "Create account",

  googleSignIn: "Sign in with Google",
  googleRegister: "Sign up with Google",

  termsPrefix: "By registering you agree to our",
  termsLink: "Terms",
  termsAnd: "and",
  privacyLink: "Privacy Policy",

  newPassword: "New password",
  repeatNewPassword: "Repeat new password",
  repeatPassword: "Repeat password",
  savePassword: "Save password",
  currentPassword: "Current password",
  changePassword: "Change password",
  passwordChanged: "Password changed successfully.",
  passwordTooShort: "Password must be at least 6 characters.",
  passwordsDoNotMatch: "Passwords do not match.",
  newPasswordMustDiffer: "The new password must differ from the current one.",
  googleAccountNotice:
    "Your account signs in with Google. Changing a password is not needed for this account.",

  showPassword: "Show password",
  hidePassword: "Hide password",

  verifyPrompt: "Want extra protection for your email?",
  verifyBody:
    "Your registration is already complete. If you'd like, confirm your email for extra security — it is not required.",
  verifySend: "Send confirmation link",
  verifyLater: "Not now",
  verifySent: "We've sent a confirmation link for extra protection.",
  close: "Close",

  errors: {
    supabase_not_configured: "Supabase is not configured.",
    email_not_found: "Email address not found.",
    google_not_enabled:
      "Google sign in is not enabled in Supabase yet. Use email, or enable the Google provider.",
    email_not_confirmed:
      "Your email is not confirmed yet. Open the confirmation link in your inbox, or resend it from the dashboard.",
    too_many_requests: "Too many attempts. Wait a minute and try again.",
    same_password: "The new password must differ from the current one.",
    password_too_short: "Password must be at least 6 characters.",
    invalid_credentials: "Incorrect email or password.",
    already_registered: "This email is already registered. Try signing in.",
    invalid_email: "Check the email format.",
    send_failed:
      "We couldn't send the email. Check inbox/spam, or try again shortly.",
    account_not_created: "The account could not be created.",
    current_password_wrong: "The current password is incorrect.",
    google_account_no_password:
      "This account signs in with Google. Changing the password here is not available.",
    unknown: "Something went wrong. Please try again.",
  },
};

export function getAuthCopy(locale: "ka" | "en"): AuthCopy {
  return locale === "ka" ? AUTH_KA : AUTH_EN;
}
