# Pet Security Tag User Dashboard - Complete Flow Documentation

## 🏗️ Application Architecture

This is a **React + TypeScript User Dashboard** built with:
- **Frontend Framework**: React 18 with TypeScript
- **State Management**: Redux Toolkit (RTK Query)
- **Data Fetching**: RTK Query + TanStack React Query
- **Routing**: React Router DOM v7
- **Styling**: Tailwind CSS
- **Payment Processing**: Stripe (React Stripe.js)
- **Build Tool**: Vite
- **UI Libraries**: Framer Motion, Lucide React, React Icons
- **Form Handling**: React Hook Form
- **Localization**: IP-based geolocation for pricing

---

## 📁 Project Structure

```
src/
├── apis/                    # API layer (RTK Query)
│   ├── auth/               # Authentication APIs
│   │   ├── index.ts
│   │   └── types.ts
│   ├── user/               # User-facing APIs
│   │   ├── users/          # User account APIs
│   │   │   ├── index.ts
│   │   │   ├── pets/       # Pet management APIs
│   │   │   ├── petTagOrders/ # Order management APIs
│   │   │   └── contact/    # Contact/support APIs
│   │   └── qrcode/         # QR code & subscription APIs
│   └── queryClient.tsx     # TanStack React Query client
├── components/             # UI components
│   ├── auth/               # Authentication components
│   │   ├── index.tsx       # Login component
│   │   ├── sign-up.tsx
│   │   ├── email-verification.tsx
│   │   ├── forgot-password.tsx
│   │   ├── reset-password.tsx
│   │   └── ...
│   ├── common/             # Shared components
│   │   └── navbar.tsx
│   ├── contact/            # Contact form component
│   ├── order/              # Order components
│   │   ├── order.tsx       # New order creation
│   │   └── replacementOrder.tsx
│   ├── overview/           # Dashboard overview
│   ├── payment/            # Payment history
│   ├── pets/               # Pet management
│   │   ├── pets.tsx
│   │   ├── edit-pet/
│   │   ├── viewPet.tsx
│   │   ├── ReplacementTagModal.tsx
│   │   └── ShareLocationModal.tsx
│   ├── qrcode/             # QR code components
│   │   ├── qrVerificationPage.tsx
│   │   └── subscriptionModal.tsx
│   ├── settings/           # Settings components
│   │   ├── settings.tsx
│   │   ├── OwnerInfoTab.tsx
│   │   ├── ContactDetailsTab.tsx
│   │   └── VetDetailsTab.tsx
│   └── subscription/       # Subscription components
│       ├── subscriptionCard.tsx
│       ├── PaymentModal.tsx
│       └── PlanSelectionModal.tsx
├── context/                # React Context
│   └── LocalizationContext.tsx # IP-based pricing localization
├── pages/                  # Page components (route handlers)
│   ├── auth/               # Auth pages
│   ├── overview/           # Dashboard page
│   ├── pets/               # Pets page
│   ├── payment/            # Payment history page
│   ├── contact/            # Contact page
│   ├── settings/           # Settings page
│   ├── layout.tsx          # Main layout wrapper
│   ├── sideNav.tsx         # Side navigation
│   ├── navbar.tsx          # Top navbar
│   ├── protextedRoutes.tsx # Protected routes wrapper
│   └── publicRoutes.tsx    # Public routes wrapper
├── common/                 # Shared utilities/components
│   ├── button.tsx
│   ├── input.tsx
│   ├── Pagination.tsx
│   └── ...
├── types/                  # TypeScript type definitions
├── store.tsx               # Redux store configuration
├── App.tsx                 # Main app component with routing
└── main.tsx                # Application entry point
```

---

## 🔄 Complete Application Flow

### 1. **Application Initialization** (`main.tsx`)

**Flow:**
```
index.html → main.tsx → App.tsx
```

1. **Entry Point** (`index.html`):
   - Loads React app into `#root` div
   - Imports `main.tsx` as module

2. **Main Setup** (`main.tsx`):
   ```tsx
   - Wraps app in <React.StrictMode>
   - Provides Redux Store (<Provider store={store}>)
   - Provides React Query Client (<QueryClientProvider>)
   - Provides Localization Context (<LocalizationProvider>)
   - Renders <App /> component
   ```

3. **State Management Setup** (`store.tsx`):
   - Configures Redux store with multiple RTK Query APIs:
     - `authApi` - Authentication
     - `userApi` - User account management
     - `contactApi` - Contact/support
     - `petTagOrdersApi` - Order management
     - `petsApi` - Pet management
     - `qrcodeApi` - QR codes & subscriptions
   - All APIs configured with middleware for caching and invalidation

---

### 2. **Localization & Pricing** (`context/LocalizationContext.tsx`)

**IP-Based Geolocation:**
```
1. On app load, detect user's country via IP (ipapi.co)
2. Set pricing based on country:
   - US: USD pricing
   - CA: CAD pricing
   - Default: GBP pricing
3. Provide context with:
   - Shipping prices
   - Tag prices
   - Subscription prices (monthly/yearly/lifetime)
```

**Pricing Structure:**
- **Tag Prices:**
  - US: $3.99
  - CA: $5.59 CAD
  - Default (GBP): £2.99

- **Shipping Prices:**
  - US: $9.19
  - CA: $15.09 CAD
  - European countries: £2.90
  - Default: £2.90

- **Subscription Prices:**
  - **US:**
    - Monthly: $3.69
    - Yearly: $37.99
    - Lifetime: $169.99
  - **CA:**
    - Monthly: $5.11 CAD
    - Yearly: $53.99 CAD
    - Lifetime: $239.99 CAD
  - **Default (GBP):**
    - Monthly: £2.75
    - Yearly: £28.99
    - Lifetime: £129.99

---

### 3. **Routing & Navigation** (`App.tsx`)

**Route Structure:**
```
/Public Routes (redirects to /overview if logged in)
  ├── / → Login
  ├── /signup → Sign Up
  ├── /forgot-password → Forgot Password
  ├── /password-reset-email-sent → Email Sent Confirmation
  ├── /reset-password → Reset Password
  ├── /password-changed → Success Page
  ├── /verify-email-sent → Email Verification Sent
  ├── /verify-email → Email Verification
  └── /verification-success → Verification Success

/Special Route
  └── /qr/verify/:code → QR Verification Page (accessible to all)

/Protected Routes (requires authentication)
  └── / → Layout wrapper
      ├── /overview → Dashboard Overview
      ├── /order → Create New Order
      ├── /replacement-order/:petId → Replacement Order
      ├── /pets → Manage Pets
      ├── /edit-pet/:petId → Edit Pet
      ├── /view-pet/:id → View Pet Details
      ├── /contact → Contact Support
      ├── /payments → Payment History
      └── /settings → Account Settings
```

**Route Protection Flow:**
1. User navigates to route
2. `ProtectedRoutes` checks:
   - `localStorage.getItem("token")` exists
   - If authenticated → Render `<Outlet />` (child routes)
   - If not authenticated → Redirect to `/`
3. `PublicRoutes` checks:
   - If token exists → Redirect to `/overview`
   - If no token → Render public routes

---

### 4. **Authentication Flow**

#### **Login Process** (`components/auth/index.tsx`)

**Flow:**
```
1. User enters email & password
2. Form validation (react-hook-form)
3. Submit → useLoginMutation (RTK Query)
4. API Call: POST /api/v1/auth/login
   Body: { email, password }
5. On Success:
   - Store token: localStorage.setItem("token", token)
   - Show success toast
   - Check for redirect URL (from QR verification)
   - Navigate to /overview or redirectTo URL
6. On Error: Show error toast
```

#### **Sign Up Process** (`components/auth/sign-up.tsx`)

**Flow:**
```
1. User enters: firstName, lastName, email, password
2. Form validation
3. Submit → useSignupMutation
4. API Call: POST /api/v1/auth/register
   Body: { firstName, lastName, email, password }
5. On Success:
   - Navigate to /verify-email-sent
   - User must verify email before login
6. Verification email sent automatically by backend
```

#### **Email Verification** (`components/auth/email-verification.tsx`)

**Flow:**
```
1. User clicks link from email (with token)
2. Token extracted from URL query params
3. Submit → useVerifyEmailMutation
4. API Call: POST /api/v1/auth/verify-email
   Body: { token }
5. On Success: Navigate to /verification-success
6. User can now login
```

#### **Password Reset Flow**

**Forgot Password** (`components/auth/forgot-password.tsx`):
```
1. User enters email
2. Submit → useForgotPasswordMutation
3. API Call: POST /api/v1/auth/forgot-password
   Body: { email }
4. Navigate to /password-reset-email-sent
5. User receives reset link in email
```

**Reset Password** (`components/auth/reset-password.tsx`):
```
1. User clicks reset link (with token)
2. Token extracted from URL
3. User enters new password
4. Submit → useResetPasswordMutation
5. API Call: POST /api/v1/auth/reset-password
   Body: { token, password }
6. Navigate to /password-changed
7. User can login with new password
```

---

### 5. **Layout & Navigation Structure**

#### **Main Layout** (`pages/layout.tsx`)

**Component Hierarchy:**
```
<Layout>
  ├── <SideNav /> (Left sidebar navigation)
  ├── <Navbar /> (Top navigation bar)
  └── <Outlet /> (Page content - scrollable)
```

**Features:**
- Responsive design with mobile hamburger menu
- Fixed sidebar and navbar
- Scrollable content area
- Sidebar toggle functionality

#### **Side Navigation** (`pages/sideNav.tsx`)

**Navigation Items:**
- **ACTIONS**:
  - Overview
  - Pets
  - Contact Support

- **GENERAL**:
  - Payment History
  - Account Setting
  - Logout

**Features:**
- Active route highlighting
- Mobile responsive (overlay + toggle)
- Logout modal confirmation
- Logout process:
  1. Clear `token` from localStorage
  2. Redirect to `/` (login page)

#### **Navbar** (`components/common/navbar.tsx`)

**Features:**
- Displays user information
- User profile/account access
- Responsive design

---

### 6. **Dashboard Overview** (`pages/overview/index.tsx`)

**Components:**
1. **Active Tags Counter**:
   - Displays count of verified QR tags
   - Fetches pets with verified QR codes
   - Link to view pets

2. **Subscription Card** (`components/subscription/subscriptionCard.tsx`):
   - Shows active subscription details
   - Displays subscription type, days remaining
   - Upgrade/renew options
   - Link to order if no subscription

3. **Pet Profile Card**:
   - Information about pet profiles
   - Link to pets page

4. **Order More Tags Card**:
   - Quick link to create new order

5. **Customer Support Card**:
   - Link to contact support page

**Data Fetching:**
```tsx
// Fetch pets to count active tags
useGetUserPetsQuery({ page: 1, limit: 100 })

// Fetch subscriptions (in SubscriptionCard)
useGetUserSubscriptionsQuery({})
useGetSubscriptionStatsQuery()
```

---

### 7. **Pet Management Flow**

#### **Pets Page** (`pages/pets/index.tsx`)

**Features:**
- List all user's pets
- View pet details (modal)
- Edit pet information
- Order replacement tag
- Share location feature

**Data Flow:**
```tsx
// Fetch user's pets
useGetUserPetsQuery({ page: 1, limit: 10 })

// Pet actions:
- View Pet → Opens ViewPetModal
- Edit Pet → Navigate to /edit-pet/:petId
- Replacement Order → Navigate to /replacement-order/:petId
- Share Location → Opens ShareLocationModal
```

#### **Edit Pet** (`pages/pets/edit-pet/:petId`)

**Flow:**
```
1. Fetch pet data: useGetPetQuery(petId)
2. User edits pet information:
   - Pet name, age, breed
   - Medication, allergies, notes
   - Hide name option
3. Upload pet image (optional)
4. Submit → useUpdatePetMutation
5. API Call: PUT /api/v1/user/pets/:petId
6. Success → Navigate back to /pets
```

#### **View Pet** (`pages/pets/viewPet.tsx`)

**Features:**
- Full pet profile display
- QR code information
- Subscription status
- Edit button
- Replacement order button

#### **Replacement Order** (`pages/replacement-order/:petId`)

**Flow:**
```
1. User clicks "Order Replacement" for a pet
2. Navigate to /replacement-order/:petId
3. Form pre-filled with pet information
4. User selects tag color, shipping address
5. Payment flow (same as new order)
6. Creates replacement order (bypasses 5-pet limit)
```

---

### 8. **Order Management Flow**

#### **Create New Order** (`components/order/order.tsx`)

**Complete Order Flow:**
```
1. User fills order form:
   - Quantity (up to 5 pets total limit)
   - Pet name(s)
   - Tag color(s) - one per tag if quantity > 1
   - Shipping address (street, city, state, zipCode, country)
   - Phone number with country code

2. Price Calculation:
   - Tag price: Based on user's country (from LocalizationContext)
   - Shipping: Based on country
   - Total: (tagPrice * quantity) + shipping
   - Converted to EUR for backend (backend stores in EUR)

3. Stripe Payment Setup:
   - Initialize Stripe: loadStripe(VITE_STRIPE_PUBLISH_KEY)
   - Create PaymentIntent via backend
   - API Call: POST /api/v1/user/user-pet-tag-orders
     Body: {
       quantity, petName, totalCostEuro,
       tagColor/tagColors, phone, shipping address
     }
   - Returns: { order, payment: { clientSecret, paymentIntentId } }

4. Payment Processing:
   - User enters card details (Stripe Elements)
   - Create payment method: stripe.createPaymentMethod()
   - Confirm payment: stripe.confirmCardPayment(clientSecret)
   - Backend confirms: POST /api/v1/user/user-pet-tag-orders/:orderId/confirm-payment
     Body: { paymentIntentId }

5. Order Completion:
   - Backend assigns QR codes to order
   - Creates Pet records
   - Sends order confirmation email
   - Returns: { order, pets, qrCodes }

6. Success:
   - Show success message
   - Navigate to /pets or /overview
```

**Pet Limit Validation:**
```tsx
// Check before creating order
useGetUserPetCountQuery()

// Validates:
- Current pet count
- Max allowed: 5 pets
- Can order more: boolean
- Remaining slots: number
```

**Currency Conversion:**
- Frontend displays in user's local currency (USD/CAD/GBP)
- Backend stores in EUR
- Conversion rates:
  - GBP → EUR: × 1.17
  - USD → EUR: × 0.92
  - CAD → EUR: × 0.68

---

### 9. **QR Code Verification Flow**

#### **QR Verification Page** (`components/qrcode/qrVerificationPage.tsx`)

**Flow:**
```
1. User scans QR code → Navigate to /qr/verify/:code
   (Public route - accessible to logged-in and non-logged-in users)

2. Fetch QR Details:
   - API Call: GET /api/v1/qr/verify-details/:code
   - Returns: { qrCode, isVerified, hasActiveSubscription, canAutoVerify, ... }

3. Verification Logic:
   a) If already verified with active subscription:
      → Show success, redirect to /overview

   b) If user not logged in:
      → Redirect to login with redirectTo state
      → After login, redirect back to verification page

   c) If logged in and canAutoVerify:
      → Auto-verify with existing subscription
      → API Call: POST /api/v1/qr/auto-verify
        Body: { qrCodeId }

   d) If logged in but needs subscription:
      → Show SubscriptionModal
      → User selects plan (monthly/yearly/lifetime)
      → Payment flow
      → Verify QR code

4. Subscription Flow (if needed):
   a) User selects subscription type
   b) Create Stripe subscription via backend
   c) Payment processing
   d) Confirm subscription payment
   e) Link subscription to QR code
   f) Mark QR as verified
```

#### **Subscription Modal** (`components/qrcode/subscriptionModal.tsx`)

**Features:**
- Display subscription plans with pricing
- Price based on user's country (LocalizationContext)
- Payment processing via Stripe
- Success callback

---

### 10. **Subscription Management**

#### **Subscription Card** (`components/subscription/subscriptionCard.tsx`)

**Display Logic:**
```
1. Fetch subscriptions: useGetUserSubscriptionsQuery({})
2. Fetch stats: useGetSubscriptionStatsQuery()

3. If no active subscription:
   - Show "No Active Subscription" message
   - Link to /order to get started

4. If active subscription:
   - Display subscription type (Monthly/Yearly/Lifetime)
   - Show days remaining
   - Show expiration date
   - Show "Expiring Soon" warning if < 7 days
   - Upgrade/Renew buttons
```

**Upgrade Flow:**
```
1. User clicks "Upgrade"
2. Opens PlanSelectionModal
3. User selects new plan
4. Opens PaymentModal with Stripe
5. API Call: POST /api/v1/user/subscriptions/upgrade
   Body: { subscriptionId, newType, amount, currency }
6. Confirm payment
7. Subscription upgraded (prorated)
```

**Renewal Flow:**
```
1. User clicks "Renew"
2. Opens PaymentModal
3. API Call: POST /api/v1/user/subscriptions/renew
   Body: { subscriptionId }
4. Confirm payment
5. Subscription extended
```

#### **Payment Modal** (`components/subscription/PaymentModal.tsx`)

**Features:**
- Stripe Elements integration
- Card payment processing
- Handles renewals, upgrades, and initial subscriptions
- Success/error handling

---

### 11. **Payment History** (`components/payment/payment.tsx`)

**Data Fetching:**
```tsx
// Fetch orders
useGetPetTagOrdersQuery({ page: 1, limit: 50 })

// Fetch subscriptions (include expired)
useGetUserSubscriptionsQuery({ 
  page: 1, 
  limit: 50, 
  includeAll: 'true' 
})
```

**Payment History Display:**
```
1. Combine orders and subscriptions
2. Transform data:
   - Orders: { type: 'order', ...orderData }
   - Subscriptions: { 
       type: 'subscription',
       totalCostEuro: amountPaid,
       subscriptionType,
       ...
     }
3. Sort by date (newest first)
4. Display in table:
   - Date
   - Type (Order/Subscription)
   - Description
   - Amount (converted to user's currency)
   - Status
```

**Currency Conversion:**
- Orders: Convert EUR → user's currency
- Subscriptions: Already in user's currency
- Format with appropriate symbol (£, $, €)

---

### 12. **Settings Page** (`components/settings/settings.tsx`)

**Tabs:**
1. **Owner Info Tab** (`OwnerInfoTab.tsx`):
   - First name, Last name
   - Email
   - Phone number with country code selector

2. **Contact Details Tab** (`ContactDetailsTab.tsx`):
   - Street address
   - City, State
   - Zip code, Country

3. **Vet Details Tab** (`VetDetailsTab.tsx`):
   - Veterinary clinic information (if applicable)

**Update Flow:**
```
1. Fetch user data: useGetSingleUserQuery()
2. User edits information
3. Submit → useUpdateSingleUserMutation()
4. API Call: PATCH /api/v1/user/update-single-user
5. Success → Show toast, update UI
```

**Delete Account:**
```
1. User clicks "Delete Account"
2. Confirmation modal
3. Submit → useDeleteAccountMutation()
4. API Call: DELETE /api/v1/user/delete-account
5. Success → Clear token, redirect to login
```

---

### 13. **Contact Support** (`components/contact/contact.tsx`)

**Features:**
- Contact form (fullName, email, purpose, message)
- Submit contact request
- API Call: POST /api/v1/user/contact
- Success message displayed

---

### 14. **API Layer Architecture**

#### **RTK Query Setup**

**Base Query Configuration:**
```typescript
fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('token');
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
})
```

**API Endpoints:**

**Auth API** (`apis/auth/index.ts`):
- `POST /auth/login`
- `POST /auth/register`
- `POST /auth/verify-email`
- `POST /auth/forgot-password`
- `POST /auth/reset-password`

**User API** (`apis/user/users/index.ts`):
- `GET /user/get-single-user`
- `PATCH /user/update-single-user`
- `DELETE /user/delete-account`

**Pet Tag Orders API** (`apis/user/users/petTagOrders/index.ts`):
- `GET /user/user-pet-count`
- `POST /user/user-pet-tag-orders`
- `GET /user/user-pet-tag-orders`
- `GET /user/user-pet-tag-orders/:orderId`
- `PUT /user/user-pet-tag-orders/:orderId`
- `POST /user/user-pet-tag-orders/:orderId/confirm-payment`

**Pets API** (`apis/user/users/pets/index.ts`):
- `GET /user/pets`
- `GET /user/pets/:petId`
- `PUT /user/pets/:petId`
- `POST /user/pets/:petId/upload-image`

**QR Code API** (`apis/user/qrcode/index.ts`):
- `GET /qr/verify-details/:code`
- `POST /qr/auto-verify`
- `POST /qr/verify-subscription`
- `POST /qr/confirm-subscription`
- `GET /user/subscriptions`
- `GET /user/subscription/qr/:qrCodeId`
- `GET /user/subscriptions/stats`
- `POST /user/subscriptions/renew`
- `POST /user/subscriptions/upgrade`
- `POST /user/subscriptions/confirm-payment`

**Contact API** (`apis/user/users/contact/index.ts`):
- `POST /user/contact`

**Cache Management:**
- Tag-based invalidation
- Auto-refetch on mutation
- Tags: `['User']`, `['Pet']`, `['PetTagOrder']`, `['QRCode']`, `['Subscription']`

---

### 15. **Stripe Integration**

#### **Stripe Setup**

**Initialization:**
```typescript
const stripePromise = loadStripe(VITE_STRIPE_PUBLISH_KEY)
```

**Payment Flow:**
```
1. Frontend creates order → Backend creates PaymentIntent
2. Backend returns: { clientSecret, paymentIntentId }
3. Frontend uses Stripe Elements for card input
4. User enters card details
5. Create payment method: stripe.createPaymentMethod()
6. Confirm payment: stripe.confirmCardPayment(clientSecret)
7. On success → Confirm with backend
8. Backend verifies payment and completes order
```

**Subscription Flow:**
```
1. User selects subscription plan
2. Frontend calls backend to create Stripe subscription
3. Backend creates Stripe subscription
4. Returns: { subscriptionId, clientSecret }
5. Frontend confirms payment with Stripe
6. Frontend confirms subscription payment with backend
7. Backend creates Subscription record
8. Links subscription to QR code
```

---

### 16. **Error Handling & Notifications**

**Toast Notifications** (`react-hot-toast`):
- Success: `toast.success("Message")`
- Error: `toast.error("Message")`
- Configured in `App.tsx`: `<Toaster position="top-center" />`

**Error States:**
- API errors caught in try-catch blocks
- Error messages displayed via toast
- Loading states shown during API calls
- Skeleton loaders for better UX

---

### 17. **State Management Flow**

**Redux Store Structure:**
```typescript
{
  authApi: { ... },           // Auth state/cache
  userApi: { ... },           // User account cache
  contactApi: { ... },        // Contact cache
  petTagOrdersApi: { ... },   // Orders cache
  petsApi: { ... },           // Pets cache
  qrcodeApi: { ... }          // QR codes & subscriptions cache
}
```

**Data Flow:**
```
Component → RTK Query Hook → API Call → Redux Cache → Component Re-render
```

---

### 18. **Complete User Journey Examples**

#### **New User Journey:**
```
1. User visits app → / (login page)
2. Clicks "Register" → /signup
3. Fills registration form → Email sent
4. Verifies email → /verify-email
5. Success → /verification-success
6. Logs in → /overview
7. Views subscription card → No active subscription
8. Clicks "Get Started" → /order
9. Creates order → Payment → Success
10. QR codes assigned → Pets created
11. Views pets → /pets
12. Verifies QR code → Subscription payment
13. QR verified → Active tag shown
```

#### **Existing User Journey:**
```
1. User logs in → /overview
2. Views active tags count
3. Clicks "Order More Tags" → /order
4. Creates new order (if < 5 pets)
5. Payment → Success
6. New pets added
7. Manages pets → Edit details, view QR
8. Orders replacement tag for lost tag
9. Upgrades subscription plan
10. Views payment history
11. Updates account settings
12. Contacts support if needed
```

#### **QR Code Scanner Journey:**
```
1. Finder scans QR code on pet tag
2. Redirected to /qr/verify/:code
3. Sees pet profile (if verified)
   OR
   Sees verification prompt (if not verified)
4. If pet owner scans their own QR:
   - Already logged in → Auto-verify or upgrade
   - Not logged in → Login → Auto-verify or upgrade
5. QR verified → Subscription active
```

---

## 🔐 Security Features

1. **Authentication:**
   - JWT token stored in localStorage
   - Token sent in `Authorization: Bearer <token>` header
   - Protected routes check token existence

2. **Route Protection:**
   - All user routes wrapped in `ProtectedRoutes`
   - Redirects to `/` if not authenticated
   - Public routes redirect to `/overview` if authenticated

3. **Payment Security:**
   - Stripe handles all payment processing
   - No card details stored on frontend
   - Payment intents verified on backend

---

## 📊 Key Features Summary

✅ **Authentication & Authorization**
- User registration with email verification
- Login/logout
- Password reset flow
- Protected routes

✅ **Pet Management**
- Create pets (via orders)
- Edit pet information
- Upload pet images
- View pet profiles
- Replace lost tags

✅ **Order Management**
- Create new orders (max 5 pets)
- Multiple tag colors support
- Replacement orders (bypasses limit)
- Stripe payment integration
- Order confirmation

✅ **QR Code Management**
- QR code verification
- Auto-verification with existing subscription
- Subscription purchase for QR activation
- QR code status tracking

✅ **Subscription Management**
- Monthly/Yearly/Lifetime plans
- Auto-renewal via Stripe
- Upgrade subscriptions
- Renew subscriptions
- Subscription status display

✅ **Payment History**
- View all orders
- View all subscriptions
- Combined payment history
- Currency conversion

✅ **Localization**
- IP-based country detection
- Dynamic pricing (USD/CAD/GBP)
- Currency symbols
- Shipping costs by country

✅ **User Settings**
- Update profile information
- Update contact details
- Delete account
- Multi-tab interface

✅ **Responsive Design**
- Mobile-friendly navigation
- Adaptive layouts
- Touch-friendly UI

---

## 🔗 API Endpoints Summary

**Base URL**: `VITE_API_BASE_URL` (from environment variables)

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/verify-email` - Email verification
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password` - Reset password

### User Account
- `GET /user/get-single-user` - Get current user
- `PATCH /user/update-single-user` - Update user
- `DELETE /user/delete-account` - Delete account

### Pet Tag Orders
- `GET /user/user-pet-count` - Get pet count for limit validation
- `POST /user/user-pet-tag-orders` - Create order
- `GET /user/user-pet-tag-orders` - Get user orders
- `GET /user/user-pet-tag-orders/:orderId` - Get order details
- `PUT /user/user-pet-tag-orders/:orderId` - Update order
- `POST /user/user-pet-tag-orders/:orderId/confirm-payment` - Confirm payment

### Pets
- `GET /user/pets` - Get user pets
- `GET /user/pets/:petId` - Get pet details
- `PUT /user/pets/:petId` - Update pet
- `POST /user/pets/:petId/upload-image` - Upload pet image
- `POST /user/pets/:petId/replacement-order` - Create replacement order
- `POST /user/replacement-orders/:orderId/confirm-payment` - Confirm replacement payment

### QR Codes & Subscriptions
- `GET /qr/verify-details/:code` - Get QR verification details
- `POST /qr/auto-verify` - Auto-verify QR code
- `POST /qr/verify-subscription` - Verify QR with subscription
- `POST /qr/confirm-subscription` - Confirm subscription payment
- `GET /user/subscriptions` - Get user subscriptions
- `GET /user/subscription/qr/:qrCodeId` - Get subscription by QR
- `GET /user/subscriptions/stats` - Get subscription statistics
- `POST /user/subscriptions/renew` - Renew subscription
- `POST /user/subscriptions/upgrade` - Upgrade subscription
- `POST /user/subscriptions/confirm-payment` - Confirm subscription payment

### Contact
- `POST /user/contact` - Submit contact form

---

## 🎨 UI/UX Features

- **Design System**: Tailwind CSS with custom color scheme
- **Primary Color**: `#4CB2E2` (Cyan blue)
- **Font**: Afacad (Google Fonts)
- **Icons**: React Icons + Lucide React
- **Animations**: Framer Motion
- **Toast Notifications**: React Hot Toast
- **Form Validation**: React Hook Form

---

This completes the comprehensive flow documentation of the Pet Security Tag User Dashboard application.
