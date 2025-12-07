import Image from "next/image";

export const Testimonials = () => {
  return (
    <div id="testimonials" className="container mx-auto flex flex-col items-center justify-center space-y-6 my-32">
      {/* Section Title */}
      <p className="text-xl md:text-2xl text-center text-teal-600 font-semibold">
        Testimonials
      </p>

      <h1 className="text-3xl md:text-5xl text-center font-bold max-w-3xl">
        Loved by professionals worldwide
      </h1>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10 w-full px-6">
        {/* CARD 1 */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
          <p className="text-gray-700 leading-relaxed mb-6">
            &quot;This tool is a game-changer. I went from getting no replies to
            landing three interviews in one week. The suggestions were spot on.&quot;
          </p>

          <div className="flex items-center gap-4">
            <Image
              src="/ana.jpg"
              alt="person-1"
              priority
              width={40}
              height={40}
              className="rounded-full object-cover"
            />

            <div className="text-sm">
              <p className="font-bold text-gray-900">Sarah L.</p>
              <p className="text-gray-600">Software Engineer</p>
            </div>
          </div>
        </div>

        {/* CARD 2 */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
          <p className="text-gray-700 leading-relaxed mb-6">
            &quot;As a recent graduate, I was struggling to tailor my CV. CV Reviewer
            helped me understand what recruiters are looking for.&quot;
          </p>

          <div className="flex items-center gap-4">
            <Image
              src="/ana.jpg"
              alt="person-2"
              priority
              width={40}
              height={40}
              className="rounded-full object-cover"
            />

            <div className="text-sm">
              <p className="font-bold text-gray-900">Mark C.</p>
              <p className="text-gray-600">Marketing Graduate</p>
            </div>
          </div>
        </div>

        {/* CARD 3 */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
          <p className="text-gray-700 leading-relaxed mb-6">
            &quot;The ATS compatibility score is invaluable. I finally feel confident
            that my applications are being seen by human eyes.&quot;
          </p>

          <div className="flex items-center gap-4">
            <Image
              src="/ana.jpg"
              alt="person-3"
              priority
              width={40}
              height={40}
              className="rounded-full object-cover"
            />

            <div className="text-sm">
              <p className="font-bold text-gray-900">Jennifer P.</p>
              <p className="text-gray-600">Product Manager</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
