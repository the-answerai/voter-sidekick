# AI Policy Researcher: Empowering an Informed Electorate

## Introduction

In an era of information overload and media bias, the AI Policy Researcher aims to solve a critical problem: making it easy for everyone to research laws and government representatives without the need for the lens of the media. This tool empowers citizens to actually do their own research and make informed decisions about their governance.

> "An educated citizenry is a vital requisite for our survival as a free people." - Thomas Jefferson

> "A republic, if you can keep it." - Benjamin Franklin

Franklin's quote reminds us of the responsibility we bear in maintaining our democratic system. The AI Policy Researcher is designed to help citizens fulfill this responsibility by providing easy access to unbiased, comprehensive information about laws and representatives.

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

- [ ] User authentication and profiles
- [ ] Integration of state and local government data
- [ ] Social sharing features
- [ ] Integration of campaign finance data
- [ ] Desktop app development for private research
- [ ] Multi-language support

## Live Coding Sessions

We will be live streaming coding sessions every day from now until the election. Our goal is to provide the electorate with a free tool they can use to get information about politicians, ballot initiatives, and most importantly, who is behind them and what their motivations are.

Join us in our mission to create a more informed and engaged citizenry!

## Contributing

We welcome contributions from developers, researchers, and citizens passionate about transparency in governance. Please see our [CONTRIBUTING.md](CONTRIBUTING.md) file for more information on how to get involved.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
