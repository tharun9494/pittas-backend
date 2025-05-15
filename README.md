# Order Management System Backend

A Node.js backend service for managing orders with Twilio integration for notifications.

## Features

- Order creation and management
- Twilio integration for order notifications
- Firebase Firestore database integration
- RESTful API endpoints
- Input validation and error handling

## Prerequisites

- Node.js (v14 or higher)
- Firebase project
- Twilio account

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
PORT=5000
NODE_ENV=development
FIREBASE_PROJECT_ID=your_project_id_here
FIREBASE_PRIVATE_KEY=your_private_key_here
FIREBASE_CLIENT_EMAIL=your_client_email_here
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_FLOW_SID=your_flow_sid_here
ADMIN_PHONE_NUMBER=your_admin_phone_here
TWILIO_PHONE_NUMBER=your_twilio_phone_here
ALLOWED_ORIGINS=http://localhost:3000,http://your-production-domain.com
```

## Running the Application

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### Orders

- `POST /api/orders/place` - Create a new order
  - Body: `{ customerName, orderAmount, phoneNumber }`

- `GET /api/orders` - Get all orders

- `GET /api/orders/:orderId` - Get order by ID

### Health Check

- `GET /health` - Check API health status

## Error Handling

The API uses standard HTTP status codes and returns JSON responses in the following format:

```json
{
    "success": boolean,
    "message": "Error message",
    "data": {} // Optional data object
}
```

## Development

To run tests:
```bash
npm test
```

## Security

- CORS is configured based on environment
- Input validation for all endpoints
- Environment variables for sensitive data
- Error messages are sanitized in production

## License

ISC 