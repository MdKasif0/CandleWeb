# Personalized Birthday Website Generator

## Introduction

This web application allows users to create personalized "Happy Birthday" websites. Users can choose from various templates, add personal messages and images, and generate a unique, shareable link to celebrate a friend or loved one's special day.

## Core Features

### Progressive Web App (PWA)

This application is a fully-featured Progressive Web App (PWA), offering a seamless, native-app-like experience on any device.

-   **Installable:** Users can add the app directly to their home screen on mobile and desktop for quick and easy access, just like a native app.
-   **Offline Capable:** Thanks to advanced caching with a service worker, the application and any created wishes are accessible even without a stable internet connection.
-   **Reliable & Engaging:** Enjoy a fast, reliable, and engaging experience with a custom icon and splash screen.

## Project Structure

-   `/src/app/`: Contains the main application pages.
    -   `/src/app/page.tsx`: The landing page where users can start creating a wish.
    -   `/src/app/create/page.tsx`: The form for customizing the birthday website.
    -   `/src/app/wish/[id]/page.tsx`: The dynamic page that will display the final, generated birthday wish.
-   `/src/components/ui`: Contains the ShadCN UI components.
-   `/public/`: For static assets like images, fonts, and the `manifest.webmanifest` for PWA configuration.

## Technologies Used

-   **Next.js**: React framework for server-side rendering and static site generation.
-   **React**: For building the user interface.
-   **TypeScript**: For type-safe JavaScript.
-   **Tailwind CSS**: For styling the application.
-   **ShadCN UI**: For pre-built, accessible UI components.
-   **React Hook Form & Zod**: For robust form handling and validation.
-   **@ducanh2912/next-pwa**: For enabling Progressive Web App capabilities.
