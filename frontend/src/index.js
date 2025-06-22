import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { Provider } from 'react-redux';
import store from './store';
//import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/styles/bootstrap.custom.css';
import './assets/styles/index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import HomeScreen from './screens/application/HomeScreen';
import PrivateRoute from './components/users/PrivateRoute';
import AdminRoute from './components/admin/AdminRoute';
import ApplicationScreen from './screens/application/ApplicationScreen';
import CartScreen from './screens/application/CartScreen';
import LoginScreen from './screens/users/LoginScreen';
import RegisterScreen from './screens/users/RegisterScreen';
import BillingAddressScreen from './screens/application/BillingAddressScreen';
import PaymentScreen from './screens/application/PaymentScreen';
import PlaceOrderScreen from './screens/application/PlaceOrderScreen';
import OrderScreen from './screens/application/OrderScreen';
import ProfileScreen from './screens/users/ProfileScreen';
import OrderListScreen from './screens/admin/OrderListScreen';
import ApplicationListScreen from './screens/admin/ApplicationListScreen';
import ApplicationEditScreen from './screens/admin/ApplicationEditScreen';
import UserListScreen from './screens/admin/UserListScreen';
import UserEditScreen from './screens/admin/UserEditScreen';



const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      {/* Public Routes */}
      <Route index element={<HomeScreen />} />
      <Route path='/search/:keyword' element={<HomeScreen />} />
      <Route path='/page/:pageNumber' element={<HomeScreen />} />
      <Route path='/search/:keyword/page/:pageNumber' element={<HomeScreen />} />
      
      {/* Application Routes */}
      <Route path='/application/:id' element={<ApplicationScreen />}>
        <Route path='comments' element={<HomeScreen />} /> {/* Only if needed */}
      </Route>
      
      <Route path='/cart' element={<CartScreen />} />
      <Route path='/login' element={<LoginScreen />} />
      <Route path='/register' element={<RegisterScreen />} />

      {/* Private Routes */}
      <Route element={<PrivateRoute />}>
        <Route path='/billingAddress' element={<BillingAddressScreen />} />
        <Route path='/payment' element={<PaymentScreen />} />
        <Route path='/placeorder' element={<PlaceOrderScreen />} />
        <Route path='/order/:id' element={<OrderScreen />} />
        <Route path='/profile' element={<ProfileScreen />} />
      </Route>

      {/* Admin Routes */}
      <Route element={<AdminRoute />}>
        <Route path='/admin/orderlist' element={<OrderListScreen />} />
        <Route path='/admin/applicationlist' element={<ApplicationListScreen />} />
        <Route path='/admin/applicationlist/:pageNumber' element={<ApplicationListScreen />} />
        <Route path='/admin/application/:id/edit' element={<ApplicationEditScreen />} />
        <Route path='/admin/userslists' element={<UserListScreen />} />
        <Route path='/admin/user/:id/edit' element={<UserEditScreen />} />
      </Route>
    </Route>
  )
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PayPalScriptProvider deferLoading={true}>
      <RouterProvider router={router} />
      </PayPalScriptProvider>
    </Provider>
  </React.StrictMode>
);


reportWebVitals();
