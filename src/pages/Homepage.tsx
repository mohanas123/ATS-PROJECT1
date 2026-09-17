import { useState } from "react";

export default function Homepage() {
  const [file, setFile] = useState<File | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [checking, setChecking] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) return;

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      alert("Please upload a PDF or DOCX resume.");
      return;
    }

    setFile(selectedFile);
    setScore(null);
  };

  const checkATSScore = () => {
    if (!file) {
      alert("Please upload your resume first.");
      return;
    }

    setChecking(true);

    // Temporary ATS score calculation
    // Replace this with your existing AI/API analysis later.
    setTimeout(() => {
      const atsScore = Math.floor(Math.random() * 21) + 70;
      setScore(atsScore);
      setChecking(false);
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-white text-gray-900">

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-16">

        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left Content */}
          <div>

            <p className="text-purple-600 font-semibold tracking-wide mb-4">
              OPTIMIZE YOUR RESUME. IMPROVE YOUR OPPORTUNITIES.
            </p>

            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Know Your Resume's
              <span className="block text-purple-600">
                ATS Compatibility
              </span>
            </h1>

            <p className="mt-6 text-lg text-gray-600 max-w-xl">
              Upload your resume and check your ATS score.
              Discover how well your resume performs with
              Applicant Tracking Systems.
            </p>

          </div>

          {/* Resume Checker */}
          <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-lg">

            <h2 className="text-2xl font-bold text-center">
              Check Your Resume
            </h2>

            <p className="text-gray-500 text-center mt-2">
              Upload your resume to get your ATS compatibility score.
            </p>

            {/* Upload Box */}
            <label
              htmlFor="resume-upload"
              className="mt-8 block cursor-pointer"
            >
              <div className="border-2 border-dashed border-purple-300 rounded-2xl p-10 text-center hover:bg-purple-50 transition">

                <div className="text-5xl mb-4">
                  📄
                </div>

                <h3 className="font-semibold text-lg">
                  Upload Your Resume
                </h3>

                <p className="text-sm text-gray-500 mt-2">
                  PDF or DOCX • Maximum 10MB
                </p>

                <div className="mt-5 inline-block bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold">
                  Choose Resume
                </div>

              </div>

              <input
                id="resume-upload"
                type="file"
                accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            {/* Selected File */}
            {file && (
              <div className="mt-5 p-4 bg-gray-50 rounded-xl flex items-center justify-between">

                <div>
                  <p className="font-medium text-sm">
                    {file.name}
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>

                <span className="text-green-600 font-semibold">
                  ✓ Ready
                </span>

              </div>
            )}

            {/* Check Button */}
            <button
              onClick={checkATSScore}
              disabled={!file || checking}
              className="w-full mt-6 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white py-4 rounded-xl font-semibold transition"
            >
              {checking
                ? "Analyzing Resume..."
                : "Check ATS Score →"}
            </button>

          </div>

        </div>

      </section>

      {/* ATS Result */}
      {score !== null && (
        <section className="max-w-5xl mx-auto px-6 pb-16">

          <div className="border border-gray-200 rounded-3xl p-8 shadow-sm">

            <h2 className="text-3xl font-bold text-center">
              Your ATS Resume Score
            </h2>

            <div className="mt-8 flex flex-col items-center">

              <div className="w-40 h-40 rounded-full border-8 border-purple-600 flex flex-col items-center justify-center">

                <span className="text-5xl font-bold text-purple-600">
                  {score}
                </span>

                <span className="text-gray-500">
                  / 100
                </span>

              </div>

              <h3 className="mt-6 text-xl font-semibold">
                {score >= 80
                  ? "Good ATS Compatibility"
                  : score >= 60
                  ? "Needs Improvement"
                  : "Needs Major Improvement"}
              </h3>

            </div>

            {/* Score Details */}
            <div className="grid md:grid-cols-3 gap-5 mt-10">

              <div className="border rounded-2xl p-6">
                <p className="text-gray-500">
                  Keyword Match
                </p>

                <p className="text-3xl font-bold mt-2">
                  {Math.max(score - 4, 0)}%
                </p>
              </div>

              <div className="border rounded-2xl p-6">
                <p className="text-gray-500">
                  Skills Match
                </p>

                <p className="text-3xl font-bold mt-2">
                  {Math.max(score + 2, 0)}%
                </p>
              </div>

              <div className="border rounded-2xl p-6">
                <p className="text-gray-500">
                  Formatting
                </p>

                <p className="text-3xl font-bold mt-2">
                  {Math.min(score + 5, 100)}%
                </p>
              </div>

            </div>

          </div>

        </section>
      )}

    </main>
  );
}