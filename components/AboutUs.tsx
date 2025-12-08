// 'use client';

// import Breadcrumb from "./Breadcrumb";

// const AboutUs = () => {
//     const breadcrumbItems = [
//         { name: 'Home', href: '/' },
//         { name: 'About Us', href: '/aboutUs', isActive: true },
//     ];

//     return (
//         <section >
//             <div className="container mx-auto px-4 py-12">
//                 <Breadcrumb items={breadcrumbItems} />
//             </div>
//             <div className="py-16 bg-gray-50 px-4 sm:px-6 lg:px-8">
//                 <div className="max-w-5xl mx-auto text-center">
//                     <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-6">
//                         About ARUPADAI NATURALS
//                     </h2>
//                     <p className="text-lg sm:text-xl text-gray-700 leading-relaxed">
//                         <span className="block mb-4">
//                             <strong>At Arupadai Naturals</strong>  we believe in harnessing the power of nature to nourish and care for your skin. Our range of natural and organic products is carefully crafted to provide you healthy complexion.
//                         </span>
//                     </p>

//                     <div className="mt-10 flex justify-center">
//                         <div className="w-32 h-1 bg-green-600 rounded"></div>
//                     </div>
//                 </div>
//             </div>
//         </section>
//     );
// };

// export default AboutUs;


'use client';

import Breadcrumb from "./Breadcrumb";

const AboutUs = () => {
    const breadcrumbItems = [
        { name: 'Home', href: '/' },
        { name: 'About Us', href: '/aboutUs', isActive: true },
    ];

    return (
        <section>
            {/* Breadcrumb */}
            <div className="container mx-auto px-4 py-12">
                <Breadcrumb items={breadcrumbItems} />
            </div>

            {/* About Section */}
            <div className="py-16 bg-gray-50 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto text-center">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-6">
                        About ARUPADAI NATURALS
                    </h2>

                    <p className="text-lg sm:text-xl text-gray-700 leading-relaxed text-justify">
                        Arupadai Naturals is a proudly homegrown brand founded in <strong>2025</strong> by <strong>Gokul Kumar</strong>, and is powered by <strong>GK Creations</strong>. Based in <strong>Sivakasi, Tamil Nadu</strong>, our journey began with a simple belief — that true beauty and wellness come from the lap of nature itself.
                        <br /><br />
                        At Arupadai Naturals, we create handmade, <strong>100% natural products</strong> that celebrate the richness of traditional Indian self-care. From face pack powders and herbal soaps to nourishing hair oils and health mixes, every product is lovingly crafted using vegetables, nuts, seeds, plants, and flowers — with no preservatives or harmful chemicals.
                        <br /><br />
                        Our tagline, <strong>“Rooted in Tradition. Inspired by Nature.”</strong>, reflects our commitment to bringing back time-tested beauty and wellness rituals in their purest form. Each blend carries the wisdom of ancient ingredients, carefully chosen to rejuvenate your skin, hair, and health — naturally.
                        <br /><br />
                        We believe that self-care should be honest, sustainable, and deeply connected to nature. Every product we make is not just a formula, but a reflection of our passion for purity, tradition, and holistic living.
                        <br /><br />
                        <strong>Welcome to Arupadai Naturals</strong> — where every drop, grain, and leaf tells the story of nature’s healing power.
                    </p>

                    <div className="mt-10 flex justify-center">
                        <div className="w-32 h-1 bg-green-600 rounded"></div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutUs;
