const features = [
  {
    title: "ATS Compatibility Score",
    description:
      "Understand how compatible your resume is with ATS systems.",
  },
  {
    title: "Keyword Analysis",
    description:
      "Identify important keywords from the job description.",
  },
  {
    title: "Skills Matching",
    description:
      "Compare your skills with the requirements of the job.",
  },
  {
    title: "Resume Suggestions",
    description:
      "Get useful suggestions to improve your resume.",
  },
  {
    title: "PDF & DOCX Support",
    description:
      "Upload your resume using commonly used document formats.",
  },
  {
    title: "Job Discovery",
    description:
      "Discover relevant job opportunities through the Find Jobs page.",
  },
];

export default function Features() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">

      <div className="mx-auto max-w-3xl text-center">

        <p className="font-semibold text-purple-600">
          FEATURES
        </p>

        <h1 className="mt-3 text-5xl font-bold">
          Everything You Need
        </h1>

        <p className="mt-5 text-lg text-gray-600">
          Powerful tools designed to help you understand and improve
          your resume.
        </p>

      </div>

      <div className="mt-16 grid gap-6 md:grid-cols-3">

        {features.map((feature) => (
          <div
            key={feature.title}
            className="rounded-2xl border bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >

            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-xl">
              ✦
            </div>

            <h2 className="text-xl font-bold">
              {feature.title}
            </h2>

            <p className="mt-3 leading-7 text-gray-600">
              {feature.description}
            </p>

          </div>
        ))}

      </div>

    </section>
  );
}