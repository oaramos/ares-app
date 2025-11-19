import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import narration from '../assets/narration.mp3';
import marker from '../assets/pattern-berkeley_icon.patt';
import apartheidbanner from '../assets/apartheidbanner.jpeg';

const AFRAME = window.AFRAME;

// Q: Should we stop the sound at any point? Maybe we include a click event?
AFRAME.registerComponent('play', {
  init: function () {
    this.onFound = () => {
      if (this.el.components.sound) {
        this.el.components.sound.playSound();
      }
    };
    this.onLost = () => {
      if (this.el.components.sound) {
        this.el.components.sound.stopSound();
      }
    };
    this.el.addEventListener('markerFound', this.onFound);
    this.el.addEventListener('markerLost', this.onLost);
  },
  remove: function () {
    this.el.removeEventListener('markerFound', this.onFound);
    this.el.removeEventListener('markerLost', this.onLost);
  },
});

export default function Demo() {
  const navigate = useNavigate();
  const [cameraReady, setCameraReady] = useState(false);

  useEffect(() => {
    // Request camera permission on mount
    const requestCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach(track => track.stop());
        setCameraReady(true);
      } catch (error) {
        console.error('Camera permission denied:', error);
        alert('Camera permission is required for the AR demo. Please enable camera access.');
      }
    };
    
    requestCamera();
  }, []);

  if (!cameraReady) {
    return (
      <div style={{ 
        width: '100vw', 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: '#60697c',
        color: 'white',
        flexDirection: 'column',
        padding: 20
      }}>
        <div style={{ textAlign: 'center' }}>
          <h2>Loading AR Demo...</h2>
          <p style={{ marginTop: 10 }}>Please allow camera permission</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <IconButton
        onClick={() => navigate('/')}
        sx={{
          position: 'fixed',
          top: 8,
          left: 8,
          zIndex: 100,
          background: 'rgba(0,0,0,0.7)',
          color: 'white',
          '&:hover': {
            background: 'rgba(0,0,0,0.9)',
          },
        }}
      >
        <ArrowBackIcon />
      </IconButton>
      <a-scene
        id="scene"
        xr-mode-ui="enabled: false;"
        arjs="trackingMethod: best; sourceType:webcam; debugUIEnabled: false;"
      >
      <a-assets>
        <img id="berkeley" src={apartheidbanner} alt="berkeley"></img>
        <audio id="narration" src={narration} preload="auto"></audio>
      </a-assets>
      <a-marker
        id="marker"
        type="pattern"
        url={marker}
        sound="src: #narration; volume: 1.0; autoplay: false;"
        play
      >
        {/* Width and Height Determined by img aspect ratio*/}
        <a-entity position="0 0 0">
          <a-image
            src="#berkeley"
            width="6"
            height="4"
            position=".5 0 0"
            rotation="-90 -90 0"
          ></a-image>
        </a-entity>
      </a-marker>
      <a-marker-camera></a-marker-camera>
    </a-scene>
    </div>
  );
}
