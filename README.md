# Coding Objectives for the AI Policy Researcher

Day 1: Core Backend and Law Import Automation

Hour 1-2: Supabase Schema Setup
• Objective: Define the schema in Supabase to store laws, topics, and user interactions.
• Tasks:
• In Supabase, create the following tables:
• Laws Table: id, title, summary, tags, source_link, federal/state/local, date_added, topics
• User_Submissions Table: id, law_title, law_source, user_id, status, date_submitted
• Users Table: id, email, username
• Make sure tags are saved as an array (for flexibility in assigning multiple topics).
• Set up relationships between users and their submissions.
• Outcome: A database schema ready for storing laws, user submissions, and user-specific interactions.

Hour 3-4: Law Importing with API Integration
• Objective: Automate the importing of laws from APIs like ProPublica or Open States.
• Tasks:
• Write a script that pulls laws based on topics and regions (e.g., healthcare, immigration) and stores them in Supabase.
• Use basic tagging (e.g., “federal”, “state”, “immigration”) to categorize laws as they are imported.
• Ensure this script can be run on-demand (or on a schedule later) to keep the database updated.
• Outcome: Automatically populate the Supabase database with relevant laws.

Hour 5-6: AnswerAI Integration (Basic Chatbot Functionality)
• Objective: Improve chatbot responses by pulling data from the Supabase database.
• Tasks:
• Link the chatbot with Supabase to retrieve and display laws based on user queries.
• Use AnswerAI for basic document chunking and summarization of long laws into short chatbot responses.
• Ensure the chatbot responds with laws based on the topic and locale filters the user selects.
• Outcome: The chatbot dynamically pulls law data and delivers relevant, concise responses.

Hour 7-8: User Submission Form (Airtable Integration)
• Objective: Allow users to submit new laws or sources.
• Tasks:
• Create an Airtable form where users can submit law sources (title, link, topic, description).
• Use a tool like Zapier or Integromat to automate the process of transferring data from Airtable to Supabase after a quick review.
• Add a status field in Supabase (pending, approved) to track user-submitted sources.
• Outcome: User-submitted laws are automatically added to the Supabase database after review.

Hour 9-10: Front-End Improvements
• Objective: Enhance the React front-end for better user experience and law search capabilities.
• Tasks:
• Improve UI for law search (topics, locale dropdowns) using Tailwind for clean visuals.
• Ensure that when users select a topic/locale, the chatbot automatically queries relevant laws from Supabase.
• Add user feedback (loading spinners, success messages) to the UI when laws are retrieved.
• Outcome: Smooth user experience with better interactivity and visual feedback.

Hour 11-12: Initial Testing and Debugging
• Objective: Test the entire flow to ensure everything is working properly.
• Tasks:
• Test chatbot responses for accuracy when fetching laws from Supabase.
• Submit a test law via the Airtable form and confirm it gets added to Supabase after review.
• Check error handling (e.g., what happens when a law isn’t found).
• Outcome: The app is functional, with law importing, chatbot interaction, and user submissions all working correctly.

Day 2: User-Specific Features and Final Deployment
Hour 1-2: Saving and Retrieving User Data
• Objective: Allow users to save and retrieve their favorite laws.
• Tasks:
• Implement functionality that lets users save laws to their session (store them temporarily in local storage or cookies).
• Prepare the database to save these preferences for later integration with Auth0.
• Outcome: Users can save laws temporarily in the app.
Hour 3-4: Auth0 Setup (Authentication)
• Objective: Implement user authentication using Auth0.
• Tasks:
• Set up Auth0 for basic user login (Google, email/password).
• Protect user-specific routes (e.g., saved laws, submission history).
• Ensure that user data (e.g., saved laws) is stored in Supabase under their profile.
• Outcome: Auth0 integrated for user login, and users can save their laws after authentication.
Hour 5-6: Document Chunking and Enhancing the Chatbot
• Objective: Improve chatbot responses with more advanced document chunking.
• Tasks:
• Use AnswerAI to break long documents into chunks that are returned one at a time to avoid overwhelming the user.
• Enhance chatbot prompts by including context-based follow-up questions (e.g., “Would you like to see related laws?”).
• Outcome: Chatbot is more user-friendly, delivering responses in digestible chunks with contextual follow-ups.
Hour 7-8: Final Testing of Airtable Submissions and Supabase
• Objective: Ensure Airtable submissions work smoothly and are reflected in Supabase.
• Tasks:
• Test multiple submissions via Airtable to confirm correct tagging and approval process.
• Make sure user-submitted laws appear in the chatbot responses after approval.
• Outcome: Airtable integration is working perfectly, and user submissions are showing up in the chatbot.
Hour 9-10: Vercel Deployment (Final Touches)
• Objective: Redeploy the app on Vercel with all final changes.
• Tasks:
• Redeploy with environment variables (Supabase keys, Airtable API keys, Auth0 credentials) properly configured.
• Perform one last round of debugging and browser testing (desktop and mobile).
• Outcome: The app is fully deployed and functional on Vercel.
Hour 11-12: Go Live and Post-Launch Testing
• Objective: Final deployment and live testing.
• Tasks:
• Ensure everything is functional with real users testing the app.
• Collect initial feedback from users (test saving laws, querying the chatbot).
• Set up monitoring tools (like Google Analytics or Vercel Analytics) to track user interactions.
• Outcome: The app is live and ready for use, with post-launch testing in place.

Follow-Up Actions (Post Beta Release)

1. Add Advanced Filtering: Improve the filtering system to allow users to search laws by more detailed criteria (e.g., sponsor, status, date).
2. User Notifications: Add email notifications for users when their submissions are approved or when new laws are added to their topics of interest.
3. Mobile Optimization: Refine the UI for better mobile responsiveness and user experience.
4. Improve Analytics: Track specific chatbot queries, drop-offs, and other engagement metrics to continuously improve the app.
5. Multi-Language Support: Consider adding multi-language support if your audience expands to non-English speakers.
   This plan allows you to focus on critical features while stretching the workload over two days. You’ll end with a functional MVP ready for user testing and iteration. How does this revised plan align with your vision? Let me know if you’d like to tweak anything further!
