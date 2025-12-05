import { FileText, FileUp, Sparkles } from "lucide-react";

export const HowItWorks = () => {
    return (
        <section
            id="how-it-works"
            className="min-h-screen container mx-auto flex flex-col justify-center items-center text-center py-20 space-y-6"
        >
            <p className="text-xl md:text-2xl text-teal-600 font-semibold">
                How it works
            </p>

            <h1 className="text-3xl md:text-6xl font-bold max-w-3xl">
                Get your match report in 3 simple steps
            </h1>

            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-10 px-6">
                <div className="flex flex-col justify-center items-center p-8 border border-gray-300 rounded-xl shadow-sm transition hover:shadow-lg min-h-[260px]">
                    <div className="w-16 h-16 rounded-full bg-teal-200 flex items-center justify-center mb-4">
                        <FileUp className="text-teal-600 size-8" />
                    </div>
                    <h2 className="text-xl font-semibold">1. Upload CV</h2>
                    <p className="text-gray-600 mt-2">
                        Upload your CV in PDF format.
                    </p>
                </div>

                <div className="flex flex-col justify-center items-center p-8 border border-gray-300 rounded-xl shadow-sm transition hover:shadow-lg min-h-[260px]">
                    <div className="w-16 h-16 rounded-full bg-teal-200 flex items-center justify-center mb-4">
                        <FileText className="text-teal-600 size-8" />
                    </div>
                    <h2 className="text-xl font-semibold">2. Add Job Description</h2>
                    <p className="text-gray-600 mt-2">
                        Paste the text from the job description you’re applying to.
                    </p>
                </div>

                <div className="flex flex-col justify-center items-center p-8 border border-gray-300 rounded-xl shadow-sm transition hover:shadow-lg min-h-[260px]">
                    <div className="w-16 h-16 rounded-full bg-teal-200 flex items-center justify-center mb-4">
                        <Sparkles className="text-teal-600 size-8" />
                    </div>
                    <h2 className="text-xl font-semibold">3. Get Results</h2>
                    <p className="text-gray-600 mt-2">
                        Receive an instant, detailed match analysis.
                    </p>
                </div>
            </div>
        </section>
    );
};
