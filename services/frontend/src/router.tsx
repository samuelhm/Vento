import { createBrowserRouter, Outlet } from 'react-router';
import { MainLayout } from './layouts/MainLayout';
import { AuthLayout } from './layouts/AuthLayout';
import { UserLayout } from './layouts/UserLayout';
import { Home, homeLoader } from './pages/Home';
import { Product, productLoader } from './pages/Product';
import { Search, searchLoader } from './pages/Search';
import { Login, loginAction } from './pages/Login';
import { Register } from './pages/Register/Register';
import { registerAction } from './pages/Register/Register.action';
import { ForgotPassword, forgotPasswordAction } from './pages/ForgotPassword';
import { ResetPassword, resetPasswordAction } from './pages/ResetPassword';
import { MyProducts, myProductsLoader } from './pages/MyProducts';
import { MyPurchases, myPurchasesLoader } from './pages/MyPurchases';
import { MySales, mySalesLoader } from './pages/MySales';
import { MyReviews, myReviewsLoader } from './pages/MyReviews';
import { Favorites, favoritesLoader } from './pages/Favorites';
import { Profile } from './pages/Profile';
import { CreateProduct, createProductAction } from './pages/CreateProduct';
import { EditProduct, editProductAction, editProductLoader } from './pages/EditProduct';
import { ProtectedLayout } from './layouts/ProtectedLayout';
import { Dashboard } from './pages/Dashboard';
import { Chat } from './pages/Chat';
import { TermsAndConditions } from './pages/TermsAndConditions/TermsAndConditions';
import { About } from './pages/About/About';
import { HowItWorks } from './pages/HowItWorks/HowItWorks';
import { ScrollToTop } from './components/ScrollToTop';
import { Help } from './pages/Help';
import { Rules } from './pages/Rules';
import { SafetyTips } from './pages/SafetyTips';
import { SellerProfile, sellerLoader } from './pages/SellerProfile';
import { NotFound } from './pages/NotFound';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { RootHydrateFallback } from './components/RootHydrateFallback';

const GlobalScrollWrapper = () => (
  <FavoritesProvider>
    <ScrollToTop />
    <Outlet />
  </FavoritesProvider>
);

export const router = createBrowserRouter([
  {
    element: <GlobalScrollWrapper />,
    hydrateFallbackElement: <RootHydrateFallback />,
    children: [
    {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
        loader: homeLoader,
      },
      {
        path: 'product/:id',
        element: <Product />,
        loader: productLoader,
      },
      {
        path: 'search',
        element: <Search />,
        loader: searchLoader,
      },
      {
          path: "user/:id",
          element: <SellerProfile />,
          loader: sellerLoader,
      },
    ],
  },
  {
    path: '/terms',
    element: <TermsAndConditions />
  },
  {
    path: '/about',
    element: <About />
      
  },
  {
    path: '/howitworks',
    element: <HowItWorks />
  },
  {
    path: '/help',
    element: <Help />
  },
  {
    path: '/safetytips',
    element: <SafetyTips />
  },
  {
    path: '/rules',
    element: <Rules />
  },
  {
    element: <ProtectedLayout />,
    children: [
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        element: <UserLayout />,
        children: [
          {
            path: 'my-products',
            element: <MyProducts />,
            loader: myProductsLoader,
          },
          {
            path: 'my-purchases',
            element: <MyPurchases />,
            loader: myPurchasesLoader,
          },
          {
            path: 'my-sales',
            element: <MySales />,
            loader: mySalesLoader,
          },
          {
            path: 'my-reviews',
            element: <MyReviews />,
            loader: myReviewsLoader,
          },
          {
            path: 'favorites',
            element: <Favorites />,
            loader: favoritesLoader,
          },
          {
            path: 'profile',
            element: <Profile />,
          },
          {
            path: 'my-products/new',
            element: <CreateProduct />,
            action: createProductAction,
          },
          {
            path: 'my-products/:id/edit',
            element: <EditProduct />,
            loader: editProductLoader,
            action: editProductAction,
          },
          {
            path: "chat",
            element: <Chat />,
          },
        ],
      },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: <Login />,
        action: loginAction,
      },
      {
        path: 'register',
        element: <Register />,
        action: registerAction,
      },
      {
        path: 'forgot-password',
        element: <ForgotPassword />,
        action: forgotPasswordAction,
      },
      {
        path: 'reset-password',
        element: <ResetPassword />,
        action: resetPasswordAction,
      },
    ]
  },
  {
    path: '*',
    element: <NotFound />,
  }
  ]
}
]);
