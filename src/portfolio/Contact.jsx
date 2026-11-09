"use client";

import { useRef, useState } from "react";
import { toast } from "react-hot-toast";

const Contact = () => {
  const form = useRef();
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationSentTo, setVerificationSentTo] = useState("");
  const [verifiedEmail, setVerifiedEmail] = useState("");
  const [verificationToken, setVerificationToken] = useState("");
  const [isRequestingCode, setIsRequestingCode] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const requestVerificationCode = async () => {
    const formElement = form.current;
    if (!formElement) return;

    const emailInput = formElement.elements.user_email;
    if (!emailInput.reportValidity()) return;

    setIsRequestingCode(true);
    try {
      const response = await fetch("/api/contact/verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          companyWebsite: formElement.elements.company_website.value,
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Could not send a verification code.");
      }

      setVerificationSentTo(email.trim().toLowerCase());
      setVerificationCode("");
      setVerificationToken("");
      setVerifiedEmail("");
      toast.success("If this address can receive email, a code has been sent.");
    } catch (error) {
      console.error("Contact verification request failed.", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not send a verification code. Please try again."
      );
    } finally {
      setIsRequestingCode(false);
    }
  };

  const verifyEmail = async () => {
    if (verificationSentTo !== email.trim().toLowerCase()) {
      toast.error("Request a code for this email address first.");
      return;
    }
    if (!/^\d{6}$/.test(verificationCode)) {
      toast.error("Enter the six-digit verification code.");
      return;
    }

    setIsVerifyingCode(true);
    try {
      const response = await fetch("/api/contact/verification/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), code: verificationCode }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Could not verify this email address.");
      }

      setVerificationToken(result.verificationToken);
      setVerifiedEmail(email.trim().toLowerCase());
      toast.success("Email address verified.");
    } catch (error) {
      console.error("Contact email verification failed.", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not verify this email address. Please try again."
      );
    } finally {
      setIsVerifyingCode(false);
    }
  };

  const sendEmail = async (e) => {
    e.preventDefault();

    const formElement = form.current;
    if (!formElement) return;
    if (
      !verificationToken ||
      verifiedEmail !== email.trim().toLowerCase()
    ) {
      toast.error("Verify your email address before sending a message.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formElement.elements.user_name.value,
          email: email.trim(),
          subject: formElement.elements.user_subject.value,
          message: formElement.elements.message.value,
          companyWebsite: formElement.elements.company_website.value,
          verificationToken,
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        if (response.status === 403 || response.status === 502) {
          setVerificationToken("");
          setVerifiedEmail("");
          setVerificationSentTo(email.trim().toLowerCase());
          setVerificationCode("");
        }
        throw new Error(result.message || "Could not send your message.");
      }

      toast.success("Message sent successfully!");
      formElement.reset();
      setEmail("");
      setVerificationCode("");
      setVerificationSentTo("");
      setVerifiedEmail("");
      setVerificationToken("");
    } catch (error) {
      console.error("Contact message submission failed.", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not send your message. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const isBusy = isRequestingCode || isVerifyingCode || isSubmitting;
  const normalizedEmail = email.trim().toLowerCase();
  const hasVerificationForCurrentEmail =
    Boolean(normalizedEmail) && verificationSentTo === normalizedEmail;

  return (
    <>
      <main>
        <div>
          <div className="container">
            <section className="contact-section">
              <div className="py-8 lg:py-16 px-4 mx-auto max-w-screen-md">
                <h1 className="mb-4 text-4xl tracking-tight font-extrabold text-center text-gray-900 dark:text-dark-text">
                  Contact Me!
                </h1>
                <p className="mb-8 lg:mb-16 font-light text-center text-gray-800 dark:text-gray-400">
                  I&apos;d love to hear from you. Send me a message and
                  I&apos;ll respond as soon as possible.
                </p>
                <form
                  className="space-y-8"
                  ref={form}
                  onSubmit={sendEmail}
                  aria-busy={isBusy}
                >
                  <div className="sr-only" aria-hidden="true">
                    <label htmlFor="company_website">Leave this field empty</label>
                    <input
                      id="company_website"
                      type="text"
                      name="company_website"
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="name"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      name="user_name"
                      id="name"
                      maxLength={100}
                      disabled={isBusy}
                      className="block p-3 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-dark-text dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      Your email
                    </label>
                    <input
                      type="email"
                      name="user_email"
                      id="email"
                      maxLength={254}
                      disabled={isBusy}
                      value={email}
                      onChange={(event) => {
                        setEmail(event.target.value);
                        setVerificationCode("");
                        setVerificationSentTo("");
                        setVerifiedEmail("");
                        setVerificationToken("");
                      }}
                      className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-dark-text dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="you@example.com"
                      required
                    />
                    <button
                      type="button"
                      onClick={requestVerificationCode}
                      disabled={
                        isBusy ||
                        Boolean(verifiedEmail) &&
                          verifiedEmail === normalizedEmail
                      }
                      className="mt-3 py-2 px-4 text-sm font-medium rounded-lg bg-primary-700 hover:bg-primary-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-primary-600 dark:hover:bg-primary-700"
                    >
                      {isRequestingCode
                        ? "Sending code..."
                        : hasVerificationForCurrentEmail
                          ? "Resend verification code"
                          : "Send verification code"}
                    </button>
                  </div>
                  {hasVerificationForCurrentEmail && !verificationToken && (
                      <div>
                        <label
                          htmlFor="verification_code"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          Verification code
                        </label>
                        <div className="flex flex-col gap-3 sm:flex-row">
                          <input
                            type="text"
                            id="verification_code"
                            inputMode="numeric"
                            autoComplete="one-time-code"
                            pattern="[0-9]{6}"
                            maxLength={6}
                            disabled={isBusy}
                            value={verificationCode}
                            onChange={(event) =>
                              setVerificationCode(
                                event.target.value.replace(/\D/g, "").slice(0, 6)
                              )
                            }
                            className="block p-3 w-full sm:max-w-xs text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-dark-text"
                            aria-describedby="verification-code-help"
                            required
                          />
                          <button
                            type="button"
                            onClick={verifyEmail}
                            disabled={isBusy || verificationCode.length !== 6}
                            className="py-3 px-5 text-sm font-medium rounded-lg bg-primary-700 hover:bg-primary-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-primary-600 dark:hover:bg-primary-700"
                          >
                            {isVerifyingCode ? "Verifying..." : "Verify email"}
                          </button>
                        </div>
                        <p
                          id="verification-code-help"
                          className="mt-2 text-sm text-gray-600 dark:text-gray-400"
                        >
                          The code expires in 10 minutes.
                        </p>
                      </div>
                    )}
                  {verificationToken && verifiedEmail === normalizedEmail && (
                      <p
                        role="status"
                        className="text-sm text-green-700 dark:text-green-400"
                      >
                        Email address verified. You can now send your message.
                      </p>
                    )}
                  <div>
                    <label
                      htmlFor="subject"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      Subject
                    </label>
                    <input
                      type="text"
                      name="user_subject"
                      id="subject"
                      maxLength={150}
                      disabled={isBusy}
                      className="block p-3 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-dark-text dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Let us know how we can help you"
                      required
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="message"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      Your message
                    </label>
                    <textarea
                      name="message"
                      id="message"
                      rows="6"
                      maxLength={3000}
                      disabled={isBusy}
                      className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg shadow-sm border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-dark-text dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Leave a comment..."
                      required
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    disabled={isBusy || !verificationToken}
                    className="py-3 px-5 text-sm font-medium text-center rounded-lg bg-primary-700 sm:w-fit hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                  >
                    {isSubmitting
                      ? "Sending..."
                      : verificationToken
                        ? "Send message"
                        : "Verify your email first"}
                  </button>
                </form>
              </div>
            </section>
          </div>
        </div>
      </main>
    </>
  );
};

export default Contact;
