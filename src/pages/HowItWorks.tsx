const steps = [
  {
    number: "01",
    title: "Upload Your Resume",
    description:
      "Upload your resume in PDF or DOCX format.",
  },
  {
    number: "02",
    title: "Add Job Description",
    description:
      "Paste the job description you want to apply for.",
  },
  {
    number: "03",
    title: "AI Analysis",
    description:
      "ResumeIQ analyzes your resume against the job requirements.",
  },
  {
    number: "04",
    title: "Improve Your Resume",
    description:
      "Get actionable suggestions to improve your ATS compatibility.",
  },
];

export default function HowItWorks() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">

      <div className="mx-auto max-w-3xl text-center">

        <p className="font-semibold text-purple-600">
          HOW IT WORKS
        </p>

        <h1 className="mt-3 text-5xl font-bold">
          How ResumeIQ Works
        </h1>

        <p className="mt-5 text-lg text-gray-600">
          Analyze your resume, understand your ATS compatibility,
          and improve your chances of getting noticed.
        </p>

      </div>

      <div className="mt-16 grid gap-8 md:grid-cols-4">

        {steps.map((step) => (
          <div
            key={step.number}
            className="rounded-2xl border bg-white p-7 shadow-sm"
          >

            <div className="text-4xl font-bold text-purple-600">
              {step.number}
            </div>

            <h2 className="mt-6 text-xl font-bold">
              {step.title}
            </h2>

            <p className="mt-3 leading-7 text-gray-600">
              {step.description}
            </p>

          </div>
        ))}

      </div>

    </section>
  );
}