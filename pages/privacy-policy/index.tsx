"use client";
import { usePolicy } from "@/context/PolicyContext";

// Utility function to replace placeholders in HTML string
function replacePlaceholders(content: string, replacements: Record<string, string>) {
  let updated = content;
  Object.entries(replacements).forEach(([placeholder, value]) => {
    const regex = new RegExp(placeholder.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&"), "gi");
    updated = updated.replace(regex, value);
  });
  return updated;
}

function PrivacyPolicy() {
  const { policy, isLoading }: any = usePolicy();

  // Dynamic content replacements
  const replacements = {
    "[Insert Date]": "10 June 2025",
    "[currency]": "Rupees",
    "[Your Country/State]": "Tamil Nadu, India",
    "FT Digital Computer": "Brilliant Memory Computers",
    "[your email address]": "arupadainaturals@gmail.com",
    "[your phone number]": "+91-7904303676",
    "[insert email]": "arupadainaturals@gmail.com",
    "[your business address]": "Shop No 2, GF 1/L, Blackers Road Gaiety Palace, Anna Salai, Chennai – 600002 (Near Casino Theatre, Next to Ola Electric Store)",
  };

  if (isLoading) {
    return (
      <div className="bg-white p-5 shadow-md rounded-lg lg:p-20 animate-pulse">
        <div className="h-8 bg-gray-300 rounded w-1/2 mb-6"></div>
        <div className="space-y-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="h-4 bg-gray-200 rounded w-full"></div>
          ))}
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/4"></div>
        </div>
      </div>
    );
  }

  // Inject dynamic values into HTML string
  const htmlContent = replacePlaceholders(policy?.data?.privacy_policy || "", replacements);

  return (
    <div className="bg-white p-5 shadow-md rounded-lg lg:p-20">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">Privacy Policy</h1>
      <div
        className="text-gray-600"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </div>
  );
}

export default PrivacyPolicy;
