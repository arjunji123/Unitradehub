import React from "react";

const TermsAndConditions = () => {
  return (
    <div className="bg-gray-900 text-gray-200 min-h-screen py-6 px-4">
      <div className="max-w-2xl mx-auto bg-gray-800 shadow-lg rounded-lg p-3">
        <h1 className="text-2xl sm:text-3xl font-semibold text-white mb-6 text-center">
          UNITRADE HUB
        </h1>
        <h2 className="text-xl sm:text-2xl font-medium text-gray-100 mb-4 text-center">
          Unitrade App Terms and Conditions
        </h2>

        <div className="text-sm sm:text-base">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-100 mt-6 mb-2">
            1. Introduction
          </h3>
          <p className="text-gray-300 mb-4">
            1.1 These Terms and Conditions ("Terms") govern your use of the Coin App ("App") and any services provided through the App
          </p>
          <p className="text-gray-300 mb-4">
            1.2 By downloading, installing, or using the App, you agree to be bound by these Terms.
          </p>

          <h3 className="text-lg sm:text-xl font-semibold text-gray-100 mt-6 mb-2">
            2. Eligibility
          </h3>
          <p className="text-gray-300 mb-4">
            2.1 The App is intended for users who are at least 18 years old.
          </p>
          <p className="text-gray-300 mb-4">
            2.2 You must have a valid email address and mobile number to use the App.
          </p>

          <h3 className="text-lg sm:text-xl font-semibold text-gray-100 mt-6 mb-2">
            3. Account Registration
          </h3>
          <p className="text-gray-300 mb-4">
            3.1 To use the App, you must create an account ("Account") by
            providing required information.
          </p>
          <p className="text-gray-300 mb-4">
            3.2 You are responsible for maintaining the confidentiality and
            security of your Account.
          </p>

          <h3 className="text-lg sm:text-xl font-semibold text-gray-100 mt-6 mb-2">
            4. Coin Purchases and Transactions
          </h3>
          <p className="text-gray-300 mb-4">
            4.1 Coins purchased through the App are refundable.
          </p>
          <p className="text-gray-300 mb-4">
            4.2 Transactions made through the App are final and irreversible.
          </p>
          <p className="text-gray-300 mb-4">
            4.3 You are responsible for any taxes or fees associated with Coin
            purchases or transactions.
          </p>

          <h3 className="text-lg sm:text-xl font-semibold text-gray-100 mt-6 mb-2">
            5. Intellectual Property
          </h3>
          <p className="text-gray-300 mb-4">
            5.1 The App and its content are protected by intellectual property
            laws.
          </p>
          <p className="text-gray-300 mb-4">
            5.2 You may not reproduce, distribute, or display any App content
            without permission.
          </p>

          <h3 className="text-lg sm:text-xl font-semibold text-gray-100 mt-6 mb-2">
            6. Disclaimers and Limitations
          </h3>
          <p className="text-gray-300 mb-4">
            6.1 The App is provided "as-is" and "as-available" without
            warranties of any kind.
          </p>
          <p className="text-gray-300 mb-4">
            6.2 We are not liable for any damages or losses resulting from App
            use.
          </p>

          <h3 className="text-lg sm:text-xl font-semibold text-gray-100 mt-6 mb-2">
            7. Governing Law
          </h3>
          <p className="text-gray-300 mb-4">
            7.1 These Terms are governed by and construed in accordance with the
            laws of [Country/State].
          </p>
          <p className="text-gray-300 mb-4">
            7.2 Any disputes arising from these Terms will be resolved through
            [Dispute Resolution Process].
          </p>

          <h3 className="text-lg sm:text-xl font-semibold text-gray-100 mt-6 mb-2">
            8. Changes to Terms
          </h3>
          <p className="text-gray-300 mb-4">
            8.1 We reserve the right to modify these Terms at any time.
          </p>
          <p className="text-gray-300 mb-4">
            8.2 Changes will be effective upon posting on the App or website.
          </p>

          <h3 className="text-lg sm:text-xl font-semibold text-gray-100 mt-6 mb-2">
            9. Termination
          </h3>
          <p className="text-gray-300 mb-4">
            9.1 We may terminate or suspend your Account or App use at any time.
          </p>
          <p className="text-gray-300 mb-4">
            9.2 Upon termination, you must cease using the App and delete it
            from your device.
          </p>

          <h3 className="text-lg sm:text-xl font-semibold text-gray-100 mt-6 mb-2">
            10. Contact Us
          </h3>
          <p className="text-gray-300 mb-4">
            10.1 If you have questions or concerns, please contact us at{" "}
            <a
              href="mailto:support@example.com"
              className="text-blue-400 hover:underline"
            >
              support@example.com
            </a>
            .
          </p>
          <div>
          By using the Unitrade App, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
