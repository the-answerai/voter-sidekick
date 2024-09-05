This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `src/app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Project Structure

- **Chatbots Configuration**: The chatbot configurations are located in the `src/chatbots` directory. Each chatbot has its own configuration file, such as `basic.ts`, `basic2.ts`, `basic3.ts`, and `another-test.ts`.
- **Dynamic Chat Selection**: The `DynamicChatSelect` component allows users to select different chatbots dynamically. The available chatbots are defined in `src/chatbots/config/chatbotConfig.ts`.
- **Theme Customization**: The theme colors for the chatbots are generated using the `generateThemeColors` utility in `src/utils/generateThemeColors.ts`.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Development Notes

- **TypeScript**: This project uses TypeScript for type safety. The configuration can be found in `tsconfig.json`.
- **ESLint**: Linting is set up using ESLint with the configuration in `.eslintrc.json`.
- **Tailwind CSS**: Tailwind CSS is used for styling. The configuration is in `tailwind.config.ts` and `src/app/globals.css`.
- **Environment Variables**: Local environment variables should be stored in `.env.local` files, which are ignored by git.

For more detailed information on the project structure and configuration, refer to the respective files in the codebase.
