import React from "react";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl min-h-screen">
      <div className="h-[calc(100vh-4rem)] overflow-y-auto">
        <h1 className="text-3xl font-bold mb-6">About 🗳️ Voter Sidekick</h1>
        <h3 className="text-xl mb-6">
          Using AI to Protect Election Integrity Through Transparency
        </h3>

        <div className="bg-yellow-50 rounded-lg bg-gray-50 p-6 rounded-lg border border-gray-200 mt-8">
          <p className="text-sm text-gray-700 italic">
            Voter Sidekick is a non-partisan, open-source project dedicated to
            empowering informed civic participation through direct access to
            source documents.
          </p>
        </div>

        <section className="prose lg:prose-xl pt-8">
          <p className="lead">
            In what many are calling the most consequential election of our
            lifetime, we face an unprecedented challenge: how do we maintain
            faith in our democratic process when trust in institutions is at an
            all-time low? As we approach the 2024 election, it&apos;s clear that
            no matter which side loses, the results will likely be contested.
            We&apos;ll face a tsunami of legal challenges, disputed ballots, and
            complex policy documents—all while being bombarded with
            misinformation from every direction.
          </p>

          <h2 className="text-2xl font-bold mb-4 pt-8">
            The Problem We&apos;re Solving
          </h2>
          <p>
            The gap between what politicians say in public and what they argue
            in court has never been wider. Take, for example, the stark contrast
            in statements about election fraud in 2020:
          </p>
          <ul className="list-disc list-inside pt-2 ml-4">
            <li>
              <strong>In Public</strong>: &ldquo;This is a fraud on the American
              public... We know there was massive fraud. It was a rigged
              election 100%.&rdquo;
            </li>
            <li>
              <strong>In Court</strong>: &ldquo;This is not a fraud case... We
              are not alleging fraud in this lawsuit.&rdquo;
            </li>
          </ul>

          <h2 className="text-2xl font-bold mb-4 pt-8">
            What Makes Voter Sidekick Different?
          </h2>
          <ol className="list-decimal list-inside pt-2 ml-4">
            <li>
              <strong>Direct Source Access</strong>: We only use primary
              sources—court documents, official transcripts, and actual
              legislation. No media interpretation, no spin.
            </li>
            <li>
              <strong>Transparent Citations</strong>: Every answer comes with
              direct citations, allowing you to verify the information yourself.
            </li>
            <li>
              <strong>Complex Document Analysis</strong>: Our system can analyze
              numerous official documents including Project 2025, Immigration
              Bill, Affordable Care Act, and more.
            </li>
          </ol>

          <div className="bg-red-50 p-6 rounded-lg border border-red-200 my-8">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">
              Addressing the AI Elephant in the Room
            </h3>
            <p className="text-sm text-yellow-700">
              Yes, AI can make things up. We&apos;ve all heard about
              hallucination in AI models. But here&apos;s the difference: Voter
              Sidekick isn&apos;t asking AI to generate information—it&apos;s
              using AI to find and present information that already exists in
              verified documents. Every response includes direct citations,
              allowing users to verify the information themselves. Think of it
              this way: courts are the last remaining guardrail where standards
              of evidence still matter. What&apos;s said in a courtroom, under
              evidence still matter. What&apos;s said in a courtroom, under
              oath, carries different weight than what&apos;s posted on social
              media. Our tool helps highlight these crucial differences.
            </p>
          </div>

          <h2 className="text-2xl font-bold mb-4 pt-8">How It Works</h2>
          <ol className="list-decimal list-inside pt-2 ml-4">
            <li>Select the topic you want to explore</li>
            <li>Ask any question about the content</li>
            <li>Receive answers with direct citations from original sources</li>
          </ol>

          <h2 className="text-2xl font-bold mb-4 pt-8">Get Involved</h2>
          <ul className="list-disc list-inside pt-2 ml-4">
            <li>Share Voter Sidekick with your friends</li>
            <li>
              Join our development team:{" "}
              <a
                href="https://github.com/the-answerai/voter-sidekick"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                GitHub
              </a>
            </li>
            <li>
              Volunteer:{" "}
              <a
                href="https://airtable.com/app7EPzlq7OvwUQP1/pagtwfypEYiZO5hJU/form"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Sign Up
              </a>
            </li>
            <li>Watch our full video explanation: [VIDEO LINK]</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
