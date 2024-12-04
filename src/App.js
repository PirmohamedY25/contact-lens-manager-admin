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
// Import Calculator with correct path
import Calculator from './public/Calculator/calculator.js';

function App() {
   return (
       <AuthProvider>
           <ThemeProvider theme={theme}>
               <CssBaseline />
               <Router>
                   <Routes>
                       {/* Calculator as public route */}
                       <Route path="/" element={<Calculator />} />
                       
                       {/* Original routes */}
                       <Route path="/login" element={<Login />} />
                       <Route 
                           path="/dashboard" 
                           element={
                               <ProtectedRoute>
                                   <Dashboard />
                               </ProtectedRoute>
                           } 
                       />
                       
                       {/* Redirect all other routes to calculator */}
                       <Route path="*" element={<Navigate to="/" />} />
                   </Routes>
               </Router>
           </ThemeProvider>
       </AuthProvider>
   );
}

export default App;