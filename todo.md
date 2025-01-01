# Bitcoin Payment Website Todo

## Initial Setup
- [x] Create project structure (frontend/backend)
- [x] Initialize frontend with Next.js, TypeScript, and Shadcn UI
- [x] Initialize backend with Express and TypeScript
- [x] Set up environment variables configuration

## Backend Development
- [x] Set up Bitcoin payment processing service
  - [x] Implement xpub key derivation for unique addresses
  - [x] Create payment monitoring system
  - [x] Implement webhook handling for payment notifications
- [x] Create API endpoints
  - [x] POST /api/payment/new - Generate new payment address
  - [x] GET /api/payment/:address/status - Get payment status

## Frontend Development (shadcn, react 19)
- [x] Design and implement UI components
  - [x] Payment form
  - [x] QR code display
  - [x] Payment status indicator
  - [x] Success/Error messages
  - [x] Cryptocurrency selection (BTC/ETH)

- [x] Implement payment flow
  - [x] Amount input
  - [x] Generate payment address
  - [x] Real-time payment status updates
  - [x] Success confirmation

- [x] Implement USD price conversion
  - [x] Add price service with CoinGecko API
  - [x] Convert USD to BTC amount
  - [x] Display both USD and BTC amounts
  - [x] Real-time price updates

- [x] Improve QR code functionality
  - [x] Add BIP21 URI format (bitcoin:address?amount=x)
  - [x] Add payment amount validation
  - [x] Add fallback QR code display
  - [x] Add copy amount button

- [x] Add payment notifications
  - [x] Add toast notifications 

## Testing
- [ ] Backend unit tests
- [ ] Test Bitcoin payment flow
- [ ] Frontend integration tests
- [ ] End-to-end payment flow testing

## Deployment
- [ ] Set up CI/CD pipeline
- [ ] Deploy backend
- [ ] Deploy frontend
- [ ] Configure production environment variables
- [ ] Set up blockchain nodes/providers
  - [ ] Bitcoin node configuration