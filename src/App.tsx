import { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider, useAuth } from './AuthContext'
import { ThemeProvider } from './ThemeContext'
import { AppShell } from './components/AppShell'
import { DemoBar } from './components/demo/DemoBar'
import { markSeedToursDone } from './demo/onboarding'
import { AdminAnalyticsPage } from './pages/AdminAnalyticsPage'
import { AdminModerationPage } from './pages/AdminModerationPage'
import {
  BillingCancelPage,
  BillingReturnPage,
} from './pages/BillingReturnPage'
import { BillingSandboxPage } from './pages/BillingSandboxPage'
import { BrowsePage } from './pages/BrowsePage'
import { InboxPage } from './pages/InboxPage'
import { LandingPage } from './pages/LandingPage'
import { ListingDetailPage } from './pages/ListingDetailPage'
import { LoginPage } from './pages/LoginPage'
import { MyAdsPage } from './pages/MyAdsPage'
import { PricingPage } from './pages/PricingPage'
import { PublishListingPage } from './pages/PublishListingPage'
import { RegisterPage } from './pages/RegisterPage'
import { SeekerPremiumPage } from './pages/SeekerPremiumPage'

function AppRoutes() {
  const { user } = useAuth()

  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/browse" element={<BrowsePage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/seeker/premium" element={<SeekerPremiumPage />} />
        <Route path="/inbox" element={<InboxPage />} />
        <Route path="/listings/:id" element={<ListingDetailPage />} />
        <Route path="/advertiser/publish" element={<PublishListingPage />} />
        <Route path="/advertiser/ads" element={<MyAdsPage />} />
        <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
        <Route path="/admin/postings" element={<AdminModerationPage />} />
        <Route
          path="/billing/sandbox/:orderId"
          element={<BillingSandboxPage />}
        />
        <Route path="/billing/return" element={<BillingReturnPage />} />
        <Route path="/billing/cancel" element={<BillingCancelPage />} />
        <Route
          path="/login"
          element={user ? <Navigate to="/browse" replace /> : <LoginPage />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/browse" replace /> : <RegisterPage />}
        />
      </Routes>
    </AppShell>
  )
}

export default function App() {
  useEffect(() => {
    markSeedToursDone()
  }, [])

  return (
    <ThemeProvider>
      <AuthProvider>
        <DemoBar />
        <div className="pt-10">
          <AppRoutes />
        </div>
      </AuthProvider>
    </ThemeProvider>
  )
}
