# Personalized Birthday Website Generator

## Introduction

This web application allows you to create and share beautiful, personalized "Happy Birthday" websites in minutes. Leverage the power of AI to generate heartfelt messages, choose from stunning animated templates, and create a unique, shareable link to celebrate a friend or loved one's special day.

## Core Features

-   **AI-Powered Message Generation**: Never be at a loss for words. Our integrated AI helps you craft the perfect witty, heartfelt, or humorous birthday message based on who it's for and from.

-   **Template-Based Creation**: Get started quickly by choosing from a selection of beautifully designed and animated templates. Each template provides a unique and engaging experience for the recipient.

-   **Easy Personalization**: Customize your chosen template with the recipient's name, your name, a personal message (written by you or with AI), and an optional photo to make it truly special.

-   **Instant, Shareable Websites**: Once you're done, the app generates a unique and private link to the birthday website. Copy the link and share it with the birthday person instantly.

-   **Progressive Web App (PWA)**: Enjoy a seamless, native-app-like experience. The app is fully installable on mobile devices and desktops, and it even works offline, so you can view your created wishes anytime, anywhere.

## Project Structure

-   `/src/app/`: Contains the main application pages.
    -   `/src/app/page.tsx`: The landing page where users can see their created wishes.
    -   `/src/app/templates/page.tsx`: The page to browse and select a template.
    -   `/src/app/create/page.tsx`: The form for customizing the birthday website.
    -   `/src/app/wish/[id]/page.tsx`: The dynamic page that displays the final, generated birthday wish.
-   `/src/ai/`: Contains the Genkit AI flows, such as message generation.
-   `/src/components/ui`: Contains the ShadCN UI components.
-   `/public/`: For static assets like images, fonts, and the `manifest.webmanifest` for PWA configuration.

## Technologies Used

-   **Next.js**: React framework for server-side rendering and static site generation.
-   **React**: For building the user interface.
-   **TypeScript**: For type-safe JavaScript.
-   **Genkit**: For integrating powerful AI features like message generation.
-   **Tailwind CSS**: For styling the application.
-   **ShadCN UI**: For pre-built, accessible UI components.
-   **React Hook Form & Zod**: For robust form handling and validation.
-   **@ducanh2912/next-pwa**: For enabling Progressive Web App capabilities.
