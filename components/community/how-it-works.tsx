

export const HowItWorksSection = () => {
    return (
        <div className="container mx-auto px-4 my-20">
            <h1 className="text-5xl md:text-7xl font-bold text-center mb-12">How it works</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* Step 1 */}
                <div className="flex flex-col items-center text-center p-6  rounded-xl shadow-lg">
                    <div className="w-14 h-14 rounded-full bg-blue-200 flex items-center justify-center mb-4">
                        <span className="text-indigo-600 text-2xl font-bold">1</span>
                    </div>
                    <h2 className="text-xl font-bold mb-2">Enter Your Prompt</h2>
                    <p className="text-sm opacity-80">
                        Provide a topic for a podcast or upload your CV and a job description.
                    </p>
                </div>

                {/* Step 2 */}
                <div className="flex flex-col items-center text-center p-6  rounded-xl shadow-lg">
                    <div className="w-14 h-14 rounded-full bg-blue-200 flex items-center justify-center mb-4">
                        <span className="text-indigo-600 text-2xl font-bold">2</span>
                    </div>
                    <h2 className="text-xl font-bold mb-2">Generate Output</h2>
                    <p className="text-sm opacity-80">
                        AI processes your input to generate a podcast or CV review.
                    </p>
                </div>

                {/* Step 3 */}
                <div className="flex flex-col items-center text-center p-6 rounded-xl shadow-lg">
                    <div className="w-14 h-14 rounded-full bg-blue-200 flex items-center justify-center mb-4">
                        <span className="text-indigo-600 text-2xl font-bold">3</span>
                    </div>
                    <h2 className="text-xl font-bold mb-2">Download & Share</h2>
                    <p className="text-sm opacity-80">
                        Save your generated content and share it anywhere.
                    </p>
                </div>

            </div>
        </div>

    )
}