# XPub Donate

A modern, real-time Bitcoin payment processing system built with Next.js, Express, and WebSocket.

## Features

- 🔒 Secure Bitcoin payment processing
- ⚡ Real-time payment status updates
- 📱 Responsive QR code generation
- 💱 Automatic USD to BTC conversion
- 🔄 WebSocket connection status indicator
- 📊 Transaction monitoring and notifications

🔑 Generate Bitcoin addresses from your xpub
📱 Modern UI with QR codes and real-time updates
🔒 Watch-only wallet (no private keys on server)
💱 Automatic USD to BTC conversion
⚡ WebSocket-based payment monitoring
🌐 Self-hosted solution for Bitcoin donations

## Tech Stack

### Frontend
- Next.js 19 with App Router and turbopack
- TypeScript
- Tailwind CSS
- shadcn/ui components
- WebSocket client
- QR code generation

### Backend
- Express.js
- TypeScript
- WebSocket server
- Bitcoin address generation
- Blockstream API integration
- Event-driven architecture

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Bitcoin extended public key (xpub/zpub)

### Environment Setup

1. Backend (.env)
2. Frontend (.env)

### Development

1. Start the backend server
2. Start the frontend development server


The application will be available at `http://localhost:3000`

## Architecture

### Payment Flow
1. User enters USD amount
2. System generates unique Bitcoin address
3. WebSocket connection established for real-time updates
4. Backend monitors address for incoming transactions
5. Frontend updates payment status in real-time
6. Success notification on confirmed payment

### Security Features
- Address generation using HD wallets
- Watch-only wallet (no private keys on server)
- Real-time transaction monitoring
- Secure WebSocket communication

## API Endpoints

### POST /api/payment/btc/new
Generate new payment address

### GET /api/payment/btc/:address/status
Check payment status

## WebSocket Events

### Client -> Server
- `subscribe` - Subscribe to a specific address
- `unsubscribe` - Unsubscribe from a specific address

### Server -> Client
- `status` - Payment status update
- `error` - Error message


## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.