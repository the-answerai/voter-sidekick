# Voter Sidekick: Empowering an Informed Electorate

## Introduction

In an era of information overload and media bias, the Voter Sidekick aims to solve a critical problem: making it easy for everyone to research laws and government representatives without the need for the lens of the media. This tool empowers citizens to actually do their own research and make informed decisions about their governance.

> "An educated citizenry is a vital requisite for our survival as a free people." - Thomas Jefferson

> "A republic, if you can keep it." - Benjamin Franklin

Franklin's quote reminds us of the responsibility we bear in maintaining our democratic system. The Voter Sidekick is designed to help citizens fulfill this responsibility by providing easy access to unbiased, comprehensive information about laws and representatives.

## Current Capabilities

- Start a new research project or explore existing communities
- Ask questions about U.S. congressional laws
- Receive explanations of laws in plain language
- Save documents and clips for easy sharing across social media and the community
- Receive suggested follow-up questions to deepen your understanding
- Access a database of U.S. congressional laws (with plans to expand to all levels of government)

Our goal is to make it easy to access information from all levels of government, including session transcripts, and to collect data that enables the public to make informed decisions about their representatives.

## Local Setup Guide

1. Clone the repository
2. Install dependencies:

   ```
   pnpm i
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Fill in the required API keys and database URLs
4. Set up the database:

   ```
   pnpm run setup-db
   ```

5. Run migrations:

   ```
   pnpm run migrate
   ```

6. Start the development server:

   ```
   pnpm run dev
   ```

Go to [http://localhost:3000](http://localhost:3000) to access the application.

## Tech Stack

- Next.js
- React
- Prisma
- Supabase
- Tailwind CSS
- TypeScript

## Data Loaders

Our project uses a set of loaders to fetch, process, and store data from various sources. Here's an overview of how our loaders work:

### Congress Downloader

The Congress Downloader is responsible for fetching bills from the U.S. Congress API and storing them locally. It can download bills for specific congresses and bill types. We download them to get around the rate limits of the Congress API.

Key features:

- Resumes downloads from where it left off
- Saves bills in JSON format
- Handles pagination automatically

Usage:

```javascript
const downloader = new CongressDownloader("./data/bills");
await downloader.downloadBills({ congress: 118, billType: "hr" });
```

### Bill Normalizer and Upserter

This loader fetches detailed information about each bill, normalizes the data, and upserts it into our Supabase database.

Key features:

- Fetches full bill details, including tags and text versions
- Generates a unique hash ID for each bill
- Upserts data to avoid duplicates

Usage:

```javascript
await getBillsFromCongress(118, "hr");
```

## Roadmap
- [ ] Connect Voter Sidekick to Public Court Records for Swing States
- [ ] User authentication and profiles to save chats
- [ ] Direct integration of state and local government data
- [ ] Social sharing features to help dispell lies and manipulation
- [ ] Integration of campaign finance data to follow the money and see who benifits 
- [ ] Desktop app development for private research so your data and questions stay with you
- [ ] Multi-language support to help encourage more people around the world 

## Live Coding Sessions

I built this in public and live streamed the entire process on my YouTube Channel [Digital At Scale](https://www.youtube.com/watch?v=5UH0B9elBa8&list=PLfkQz1-GoNNJk-aESloPbD0UPM0Sz_7tX) so that any of my methods and methodoligies could be challenges and improved upon. 

I believe in a transparent and open system of improving ourselves and our government, not a system that rewards tearing each other down.  Join us in our mission to create a more informed and engaged citizenry!

## Contributing

We welcome contributions from developers, researchers, and citizens passionate about transparency in governance. Please see our [CONTRIBUTING.md](CONTRIBUTING.md) file for more information on how to get involved.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
