# RentMate Setup Guide

This guide will help you set up the RentMate application for both web and mobile development.

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Git
- Firebase CLI
- Expo CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only) 

## 1. Project Setup

### Clone and Install Dependencies

```bash
# Clone the repository
git clone <repository-url>
cd RentMate

# Install root dependencies
npm install

# Install web dependencies
cd web
npm install

# Install mobile dependencies
cd ../mobile
npm install

# Install Firebase dependencies
cd ../firebase
npm install
```

## 2. Firebase Setup

### Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project named "rentmate"
3. Enable the following services:
   - Authentication (Email/Password, Google)
   - Firestore Database
   - Storage
   - Functions
   - Hosting
   - Extensions

### Configure Firebase

```bash
# Install Firebase CLI globally
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase (run in firebase/ directory)
cd firebase
firebase init

# Select the following services:
# - Firestore
# - Functions
# - Hosting
# - Storage
# - Emulators
```

### Set up Firestore Indexes

Create the following composite indexes in Firestore:

1. **Items Collection:**
   - `province` (Ascending) + `createdAt` (Descending)
   - `category` (Ascending) + `isAvailable` (Ascending) + `createdAt` (Descending)
   - `lessorId` (Ascending) + `createdAt` (Descending)
   - `location` (Ascending) + `isAvailable` (Ascending)

2. **Rentals Collection:**
   - `renterId` (Ascending) + `createdAt` (Descending)
   - `lessorId` (Ascending) + `createdAt` (Descending)
   - `status` (Ascending) + `createdAt` (Descending)

3. **Reviews Collection:**
   - `reviewedId` (Ascending) + `createdAt` (Descending)
   - `itemId` (Ascending) + `createdAt` (Descending)

### Configure Firebase Extensions

Install the following Firebase Extensions:

1. **Algolia Search:**
   ```bash
   firebase ext:install algolia-firestore-extension
   ```

2. **Resize Images:**
   ```bash
   firebase ext:install firestore-stripe-payments
   ```

## 3. Environment Configuration

### Web Environment Variables

Create `.env` file in `web/` directory:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
VITE_FIREBASE_VAPID_KEY=your_vapid_key
VITE_MAPBOX_TOKEN=your_mapbox_token
VITE_ALGOLIA_APP_ID=your_algolia_app_id
VITE_ALGOLIA_SEARCH_KEY=your_algolia_search_key
```

### Mobile Environment Variables

Create `.env` file in `mobile/` directory:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
EXPO_PUBLIC_ALGOLIA_APP_ID=your_algolia_app_id
EXPO_PUBLIC_ALGOLIA_SEARCH_KEY=your_algolia_search_key
```

## 4. Third-Party Services Setup

### Google Maps API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Maps JavaScript API and Places API
3. Create API key with appropriate restrictions
4. Add the API key to environment variables

### Mapbox (Alternative to Google Maps)

1. Go to [Mapbox](https://www.mapbox.com/)
2. Create an account and get access token
3. Add the token to environment variables

### Algolia Search

1. Go to [Algolia](https://www.algolia.com/)
2. Create an account and application
3. Get App ID and Search API Key
4. Configure Firebase Extension

## 5. Development Setup

### Start Firebase Emulators

```bash
cd firebase
firebase emulators:start
```

This will start:
- Auth Emulator: http://localhost:9099
- Firestore Emulator: http://localhost:8080
- Functions Emulator: http://localhost:5001
- Storage Emulator: http://localhost:9199
- Hosting Emulator: http://localhost:5000
- Emulator UI: http://localhost:4000

### Start Web Development Server

```bash
cd web
npm run dev
```

The web app will be available at: http://localhost:3000

### Start Mobile Development Server

```bash
cd mobile
npx expo start
```

This will start the Expo development server and show QR code for mobile app testing.

## 6. Database Schema

### Users Collection
```typescript
{
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  phoneNumber?: string;
  role: 'renter' | 'lessor' | 'admin';
  createdAt: Date;
  updatedAt: Date;
  location?: GeoPoint;
  address?: string;
  city?: string;
  province: string; // Davao del Sur
  isVerified: boolean;
  rating: number;
  totalReviews: number;
}
```

### Items Collection
```typescript
{
  id: string;
  title: string;
  description: string;
  category: ItemCategory;
  subcategory?: string;
  price: number;
  priceType: PriceType;
  images: string[];
  location: GeoPoint;
  address: string;
  city: string;
  province: string; // Davao del Sur
  lessorId: string;
  isAvailable: boolean;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  specifications?: Record<string, any>;
  deposit?: number;
  minimumRentalPeriod?: number;
  maximumRentalPeriod?: number;
  rating: number;
  totalReviews: number;
  viewCount: number;
}
```

### Rentals Collection
```typescript
{
  id: string;
  itemId: string;
  renterId: string;
  lessorId: string;
  startDate: Date;
  endDate: Date;
  totalAmount: number;
  deposit: number;
  status: RentalStatus;
  createdAt: Date;
  updatedAt: Date;
  pickupLocation?: string;
  returnLocation?: string;
  specialRequests?: string;
}
```

## 7. Testing

### Web Testing
```bash
cd web
npm run test
```

### Mobile Testing
```bash
cd mobile
npm test
```

### E2E Testing
```bash
# Install Playwright
npm install -g playwright

# Run E2E tests
npx playwright test
```

## 8. Deployment

### Deploy Web App
```bash
cd web
npm run build
cd ../firebase
firebase deploy --only hosting
```

### Deploy Mobile App
```bash
cd mobile

# Build for Android
eas build --platform android

# Build for iOS
eas build --platform ios

# Submit to stores
eas submit --platform all
```

### Deploy Firebase Functions
```bash
cd firebase
firebase deploy --only functions
```

## 9. Monitoring and Analytics

### Firebase Analytics
- Enable Firebase Analytics in the console
- Add tracking events in the application
- Monitor user behavior and app performance

### Error Monitoring
- Set up Firebase Crashlytics
- Configure error reporting
- Monitor app stability

## 10. Security Checklist

- [ ] Firebase Security Rules are properly configured
- [ ] Environment variables are not committed to version control
- [ ] API keys have appropriate restrictions
- [ ] User authentication is properly implemented
- [ ] Data validation is in place
- [ ] File upload restrictions are configured
- [ ] HTTPS is enforced in production
- [ ] Regular security audits are scheduled

## 11. Performance Optimization

### Web App
- Enable code splitting
- Optimize images and assets
- Implement caching strategies
- Use CDN for static assets

### Mobile App
- Optimize bundle size
- Implement lazy loading
- Use image compression
- Enable offline functionality

## 12. Troubleshooting

### Common Issues

1. **Firebase Connection Issues:**
   - Check environment variables
   - Verify Firebase project configuration
   - Ensure emulators are running

2. **Mobile Build Issues:**
   - Clear Expo cache: `expo r -c`
   - Update Expo SDK
   - Check native dependencies

3. **Geolocation Issues:**
   - Verify location permissions
   - Check API key restrictions
   - Test on physical device

### Support

For additional support:
- Check the [Firebase Documentation](https://firebase.google.com/docs)
- Visit [Expo Documentation](https://docs.expo.dev/)
- Review [React Native Documentation](https://reactnative.dev/docs/getting-started)

## 13. Next Steps

After setup, consider implementing:

1. **Advanced Features:**
   - Push notifications
   - Real-time chat
   - Payment integration
   - Advanced search filters

2. **Performance Improvements:**
   - Image optimization
   - Caching strategies
   - Offline support

3. **Analytics and Monitoring:**
   - User behavior tracking
   - Performance monitoring
   - Error reporting

4. **Security Enhancements:**
   - Two-factor authentication
   - Advanced user verification
   - Fraud detection

---

**Note:** This setup guide assumes you have basic knowledge of React, React Native, Firebase, and mobile development. For detailed explanations of any step, refer to the official documentation of each technology. 

# Start all services
npm run dev

# Or start individually
npm run dev:web      # Web app on localhost:3000
npm run dev:mobile   # Mobile app with Expo
npm run dev:firebase # Firebase emulators 