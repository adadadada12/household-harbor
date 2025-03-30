
# Household Harbor

Household Harbor is a modern web application designed to help users track and manage their kitchen groceries and household items to minimize waste and stay organized.

## Features

- **Dashboard**: Main interface for managing items with filtering, sorting, and category options
- **Stats**: Insights into item usage, waste trends, and expiration patterns
- **Settings**: Customize app preferences, manage data, and control notifications
- **Item Management**: Add, edit, and delete items with key information
- **Expiry Tracking**: Clear visual indicators for item expiration status
- **Notifications**: Stay informed about items nearing expiration

## Item Tracking Features

- Track both Food and Household items (medicine, supplements, etc.)
- Record item name, category, quantity, and expiry information
- Choose between setting a specific expiry date or days until expiry
- Optional purchase date tracking
- Visual indicators for expired items, soon-to-expire items, and fresh items

## Technologies Used

- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Vite
- Recharts for data visualization

## Getting Started

To run the application locally:

```
npm install
npm run dev
```

## Project Structure

- `/src/components`: Reusable UI components
- `/src/pages`: Main application pages (Dashboard, Stats, Settings)
- `/src/context`: State management for items
- `/src/types`: TypeScript type definitions
- `/src/utils`: Utility functions for data processing
