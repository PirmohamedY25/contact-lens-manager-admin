import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import theme from './theme';
import { AuthProvider } from './context/AuthContext';

// Components
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
   return (
       <AuthProvider>
           <ThemeProvider theme={theme}>
               <CssBaseline />
               <Router>
                   <Routes>
                       {/* Main route redirects to login */}
                       <Route path="/" element={<Navigate to="/login" />} />
                       
                       {/* Admin routes */}
                       <Route path="/login" element={<Login />} />
                       <Route 
                           path="/dashboard" 
                           element={
                               <ProtectedRoute>
                                   <Dashboard />
                               </ProtectedRoute>
                           } 
                       />
                       
                       {/* Redirect all other routes to login */}
                       <Route path="*" element={<Navigate to="/login" />} />
                   </Routes>
               </Router>
           </ThemeProvider>
       </AuthProvider>
   );
}

export default App;