import React, { useState, useEffect } from 'react';
import logo from './assets/ESCM_Logo.png';
import { Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import './App.css';

const App = () => {
  const navigate = useNavigate();
  const [cameraPermission, setCameraPermission] = useState(null);

  useEffect(() => {
    // Check camera permission status
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'camera' }).then((result) => {
        setCameraPermission(result.state);
        result.onchange = () => {
          setCameraPermission(result.state);
        };
      });
    }
  }, []);

  const handleARTour = async () => {
    try {
      // Request camera permission
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      // Stop the stream immediately - we just needed permission
      stream.getTracks().forEach(track => track.stop());
      navigate('/gps');
    } catch (error) {
      alert('Camera permission is required for the AR tour. Please enable camera access in your browser settings.');
    }
  };

  const handleMarkerDemo = async () => {
    try {
      // Request camera permission
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      // Stop the stream immediately - we just needed permission
      stream.getTracks().forEach(track => track.stop());
      navigate('/demo');
    } catch (error) {
      alert('Camera permission is required for the AR demo. Please enable camera access in your browser settings.');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <img
          src={logo}
          alt="Ethnic Studies Changemaker Logo"
          className="App-logo"
        />
        <Typography variant="h4" sx={{ fontWeight: 700, marginBottom: 1 }}>
          Welcome to A.R.E.S
        </Typography>
        <Typography variant="h6" sx={{ marginBottom: 4, opacity: 0.9 }}>
          Augmented Reality for Ethnic Studies
        </Typography>
        
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 2, 
          width: '100%', 
          maxWidth: '400px',
          padding: '0 20px'
        }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<LocationOnIcon />}
            onClick={handleARTour}
            sx={{
              py: 2,
              fontSize: '1.1rem',
              fontWeight: 600,
              background: '#003262',
              '&:hover': {
                background: '#004a8f',
              },
            }}
            fullWidth
          >
            Start AR Tour
          </Button>
          
          <Button
            variant="outlined"
            size="large"
            startIcon={<CameraAltIcon />}
            onClick={handleMarkerDemo}
            sx={{
              py: 2,
              fontSize: '1rem',
              borderColor: '#FDB515',
              color: '#FDB515',
              '&:hover': {
                borderColor: '#ffc847',
                background: 'rgba(253, 181, 21, 0.1)',
              },
            }}
            fullWidth
          >
            Marker AR Demo
          </Button>
        </Box>

        {cameraPermission === 'denied' && (
          <Typography 
            variant="body2" 
            sx={{ 
              marginTop: 3, 
              padding: 2, 
              background: 'rgba(255, 0, 0, 0.1)',
              borderRadius: 1,
              maxWidth: '400px',
              fontSize: '0.85rem'
            }}
          >
            Camera permission is denied. Please enable it in your browser settings to use AR features.
          </Typography>
        )}
      </header>
    </div>
  );
};

export default App;
