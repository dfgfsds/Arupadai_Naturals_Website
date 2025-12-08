import BestSellers from "@/components/BestSellers";
import Categories from "@/components/CategoriesSlider";
import HeroSection from "@/components/HeroSection";
import ReviewCarousel from "@/components/ReviewCarousel";
import SpecialSection from "@/components/SpecialSection";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <Categories />
      <BestSellers />
      <ReviewCarousel />
      {/* <div className="py-16 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-6">
            About ARUPADAI NATURALS
          </h2>
          <p className="text-lg sm:text-xl text-gray-700 leading-relaxed">
            <span className="block mb-4">
              <strong>At Arupadai Naturals</strong>  we believe in harnessing the power of nature to nourish and care for your skin. Our range of natural and organic products is carefully crafted to provide you healthy complexion.
            </span>
          </p>

          <div className="mt-10 flex justify-center">
            <div className="w-32 h-1 bg-green-600 rounded"></div>
          </div>
        </div>
      </div> */}
      <div className="py-16 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-6">
            About ARUPADAI NATURALS
          </h2>

          <div className="text-lg sm:text-xl text-gray-700 leading-relaxed text-justify space-y-4">
            <span>
              <strong>Arupadai Naturals</strong> is a proudly homegrown brand founded in 2025 by{" "}
              <strong>Gokul Kumar</strong>, and is powered by <strong>GK Creations</strong>. Based in
              Sivakasi, Tamil Nadu, our journey began with a simple belief — that true beauty and wellness
              come from the lap of nature itself.
            </span>

            <span>
              At Arupadai Naturals, we create handmade, <strong>100% natural products</strong> that
              celebrate the richness of traditional Indian self-care. From face pack powders and herbal
              soaps to nourishing hair oils and health mixes, every product is lovingly crafted using
              vegetables, nuts, seeds, plants, and flowers — with no preservatives or harmful chemicals.
            </span>

            <span>
              Our tagline, <em>“Rooted in Tradition. Inspired by Nature.”</em> reflects our commitment to
              bringing back time-tested beauty and wellness rituals in their purest form. Each blend
              carries the wisdom of ancient ingredients, carefully chosen to rejuvenate your skin, hair,
              and health — naturally.
            </span>

            <span>
              We believe that self-care should be honest, sustainable, and deeply connected to nature.
              Every product we make is not just a formula, but a reflection of our passion for purity,
              tradition, and holistic living.
            </span>

            <span>
              <strong>Welcome to Arupadai Naturals</strong> — where every drop, grain, and leaf tells the
              story of nature’s healing power.
            </span>
          </div>

          <div className="mt-10 flex justify-center">
            <div className="w-32 h-1 bg-green-600 rounded"></div>
          </div>
        </div>
      </div>

      {/* <div className="w-full max-w-3xl mx-auto my-8 px-4">
        <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg shadow-lg">
          <iframe
            src="https://www.youtube.com/embed/azYMOjWgMCs?si=hW3TK9AdmXBlT0TW"
            title="BMC Introduction Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            className="absolute top-0 left-0 w-full h-full"
          ></iframe>
        </div>
      </div> */}

      <SpecialSection />
    </div>
  );
}