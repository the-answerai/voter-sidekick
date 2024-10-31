"use client";

import React from "react";

export default function VolunteerPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Volunteer with Voter Sidekick</h1>
      <div className="w-full h-[600px]">
        <iframe
          className="airtable-embed w-full h-full"
          src="https://airtable.com/embed/app7EPzlq7OvwUQP1/pagtwfypEYiZO5hJU/form"
          frameBorder="0"
          style={{ background: "transparent", border: "1px solid #ccc" }}
        />
      </div>
    </div>
  );
}
