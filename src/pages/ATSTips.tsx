const tips = [
  {
    title: "Use Relevant Keywords",
    description:
      "Match important skills and keywords from the job description naturally in your resume.",
  },
  {
    title: "Keep Your Formatting Simple",
    description:
      "Use a clean structure that ATS systems can easily parse.",
  },
  {
    title: "Use Standard Section Names",
    description:
      "Use familiar headings such as Experience, Education, Skills and Projects.",
  },
  {
    title: "Avoid Unnecessary Graphics",
    description:
      "Complex graphics and decorative layouts may make resume parsing harder.",
  },
  {
    title: "Customize Your Resume",
    description:
      "Tailor your resume according to the specific job you are applying for.",
  },
  {
    title: "Check Your Skills",
    description:
      "Make sure your important technical and professional skills are clearly mentioned.",
  },
];

export default function ATSTips() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">

      <div className="mx-auto max-w-3xl text-center">

        <p className="font-semibold text-purple-600">
          ATS TIPS
        </p>

        <h1 className="mt-3 text-5xl font-bold">
          Improve Your ATS Resume
        </h1>

        <p className="mt-5 text-lg text-gray-600">
          Simple tips to make your resume easier for Applicant
          Tracking Systems to understand.
        </p>

      </div>

      <div className="mx-auto mt-16 max-w-4xl space-y-5">

        {tips.map((tip, index) => (
          <div
            key={tip.title}
            className="flex gap-5 rounded-2xl border bg-white p-6 shadow-sm"
          >

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-100 font-bold text-purple-600">
              {index + 1}
            </div>

            <div>
              <h2 className="text-xl font-bold">
                {tip.title}
              </h2>

              <p className="mt-2 leading-7 text-gray-600">
                {tip.description}
              </p>
            </div>

          </div>
        ))}

      </div>

    </section>
  );
}