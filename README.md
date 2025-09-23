# Ticket Frontend

A modern ticket management system built with Next.js, TypeScript, and Ant Design.

## Features

- Create, view, and manage tickets
- Real-time ticket status updates
- Priority-based ticket organization
- Responsive design with Ant Design components
- Form validation and error handling
- Debounced search functionality

## Tech Stack

- **Framework**: Next.js 15.5.3 with Turbopack
- **Language**: TypeScript
- **UI Library**: Ant Design 5.27.4
- **Styling**: Styled Components
- **State Management**: TanStack Query (React Query)
- **HTTP Client**: Axios
- **Package Manager**: Yarn

## Prerequisites

- Node.js (version 18 or higher)
- Yarn package manager

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd ticket-frontend
```

2. Install dependencies:

```bash
yarn install
```

## Development

Start the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `yarn dev` - Start development server with Turbopack
- `yarn build` - Build the application for production
- `yarn start` - Start the production server
- `yarn lint` - Run ESLint for code quality checks

## Project Structure

```
src/
├── app/                 # Next.js app router pages
│   ├── tickets/        # Ticket-related pages
│   └── layout.tsx      # Root layout
├── components/         # Reusable UI components
├── container/          # Page containers with business logic
│   ├── create-ticket/  # Create ticket functionality
│   ├── ticket-detail/  # Ticket detail view
│   └── tickets/        # Ticket list view
├── hooks/              # Custom React hooks
├── provider/           # Context providers
├── services/           # API services
└── types/              # TypeScript type definitions
```

## Features Overview

### Ticket Management

- Create new tickets with title, description, status, and priority
- View ticket details
- List all tickets with search and filtering
- Real-time updates using React Query

### Form Validation

- Title validation (minimum 5 characters)
- Description validation (maximum 5000 characters)
- Required field validation for status and priority

### UI/UX

- Responsive design
- Loading states and error handling
- Toast notifications for user feedback
- Empty states and skeleton loading

## API Integration

The application integrates with a backend API for ticket operations:

- `GET /tickets` - Fetch all tickets
- `POST /tickets` - Create new ticket
- `GET /tickets/:id` - Fetch ticket details

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run linting: `yarn lint`
5. Submit a pull request

## License

This project is private and proprietary.
