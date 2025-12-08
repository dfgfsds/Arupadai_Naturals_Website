import { Truck, RotateCw, ShieldCheck, Headphones } from 'lucide-react';

const features = [
  {
    icon: <Truck className="text-green-900 w-10 h-10" />,
    title: 'Reliable Shipping',
    description: (
      <>
        <p>We ensure your products are packed with care and delivered safely to your doorstep.</p>
        <p>Our trusted courier partners provide timely updates and secure handling for every order.</p>
        <p>No matter where you are, we make sure your package reaches you in perfect condition.</p>
        <p>Shop with confidence, knowing your delivery is in safe hands.</p>
      </>
    ),
  },
  {
    icon: <RotateCw className="text-green-900 w-10 h-10" />,
    title: 'Satisfaction Guarantee',
    description: (
      <>
        <p>Your happiness matters to us. If you receive a damaged or wrong product, we’ll replace it instantly.</p>
        <p>We follow a smooth return and replacement process for a worry-free experience.</p>
        <p>Every order is double-checked before dispatch to ensure top quality.</p>
        <p>Trust us to stand by our promise of purity and reliability.</p>
      </>
    ),
  },
  {
    icon: <ShieldCheck className="text-green-900 w-10 h-10" />,
    title: 'Secure Payments',
    description: (
      <>
        <p>Our payment gateway is 100% safe, encrypted, and verified for your protection.</p>
        <p>Choose from multiple payment options with full transparency and security.</p>
        <p>We value your privacy — your payment details remain strictly confidential.</p>
        <p>Shop peacefully with complete confidence in every transaction.</p>
      </>
    ),
  },
  {
    icon: <Headphones className="text-green-900 w-10 h-10" />,
    title: 'Customer Support',
    description: (
      <>
        <p>We’re here to help you at every step — from product queries to post-purchase care.</p>
        <p>Our friendly team is just a call or message away for quick assistance.</p>
        <p>
          Call our expert anytime at{' '}
          <span className="text-green-900 font-bold">+91-7904303676</span>.
        </p>
        <p>
          If you have any complaints, report it through{' '}
          <span className="text-green-900 font-bold">
            customercare.arupadainaturals@gmail.com
          </span>.
        </p>
      </>
    ),
  },
];


export default function SpecialSection() {
  return (
    <div className="bg-[#f7f9fc] py-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-4">
        {features.map((feature, index) => (
          <div
            key={index}
            className="text-center border-r last:border-none border-gray-200 px-4"
          >
            <div className="flex justify-center mb-4">{feature.icon}</div>
            <h4 className="font-semibold text-lg text-black">{feature.title}</h4>
            <span className="text-gray-500 text-sm mt-1">{feature.description}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
