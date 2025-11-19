import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import landmarks from '../data/landmarks.json';
import mediaMap from '../mediaMap';

function toRad(value) {
  return (value * Math.PI) / 180;
}

function haversineMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function GpsDemo() {
  const navigate = useNavigate();
  const [position, setPosition] = useState(null);
  const [activeId, setActiveId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);

  useEffect(() => {
    // Request camera and location permissions on mount
    const requestPermissions = async () => {
      try {
        // Request camera permission
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach(track => track.stop());
        
        // Request location permission
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            () => setCameraReady(true),
            (error) => {
              console.error('Location permission denied:', error);
              alert('Location permission is required for the AR tour. Please enable location access.');
            }
          );
        } else {
          setCameraReady(true);
        }
      } catch (error) {
        console.error('Camera permission denied:', error);
        alert('Camera permission is required for the AR tour. Please enable camera access.');
      }
    };
    
    requestPermissions();
  }, []);

  useEffect(() => {
    const scene = document.querySelector('a-scene');
    const onUpdate = (e) => {
      const { detail } = e;
      if (detail && typeof detail.position?.lat === 'number') {
        setPosition({
          lat: detail.position.lat,
          lon: detail.position.lon,
          accuracy: detail.position.accuracy,
        });
      }
    };
    if (scene) {
      scene.addEventListener('gps-camera-update-position', onUpdate);
    }
    return () => {
      if (scene) scene.removeEventListener('gps-camera-update-position', onUpdate);
    };
  }, []);

  const withMedia = useMemo(() => {
    return landmarks.map(l => ({
      ...l,
      image: mediaMap[l.id]?.image || l.image,
      audio: mediaMap[l.id]?.audio || l.audio,
    }));
  }, []);

  const nearest = useMemo(() => {
    if (!position) return null;
    let best = null;
    for (const lm of withMedia) {
      const d = haversineMeters(position.lat, position.lon, lm.latitude, lm.longitude);
      if (!best || d < best.distance) best = { ...lm, distance: d };
    }
    return best;
  }, [position, withMedia]);

  useEffect(() => {
    if (!nearest) return;
    const withinMeters = 80; // proximity threshold
    if (nearest.distance <= withinMeters) {
      setActiveId(nearest.id);
    } else if (activeId === nearest.id) {
      setActiveId(null);
      setIsPlaying(false);
    }
  }, [nearest]);

  useEffect(() => {
    if (!activeId) return;
    setIsPlaying(false);
  }, [activeId]);

  const active = useMemo(() => withMedia.find(l => l.id === activeId) || null, [activeId, withMedia]);

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
          <h2>Loading AR Tour...</h2>
          <p style={{ marginTop: 10 }}>Please allow camera and location permissions</p>
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
      <div
        style={{
          position: 'fixed',
          top: 8,
          left: 56,
          right: 8,
          zIndex: 10,
          padding: 12,
          background: 'rgba(0,0,0,0.7)',
          color: 'white',
          borderRadius: 8,
          fontSize: 14,
          backdropFilter: 'blur(10px)',
        }}
      >
        <strong>AR Tour Active:</strong> Walk toward a landmark. A labeled panel appears in AR. A content card will show when you're within ~80m.
      </div>

      {active && (
        <div
          style={{
            position: 'fixed',
            bottom: 12,
            left: 12,
            right: 12,
            zIndex: 20,
            background: 'rgba(255,255,255,0.95)',
            borderRadius: 12,
            padding: 12,
            boxShadow: '0 4px 16px rgba(0,0,0,0.2)'
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: 6 }}>{active.title}</div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <img src={active.image} alt={active.title} style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 8 }} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: 12, color: '#333', marginBottom: 8 }}>
                {active.description}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => {
                    const el = document.getElementById('gps-audio');
                    if (!el) return;
                    if (isPlaying) {
                      el.pause();
                      setIsPlaying(false);
                    } else {
                      el.play().then(() => setIsPlaying(true)).catch(() => {});
                    }
                  }}
                  style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #003262', background: '#003262', color: 'white' }}
                >
                  {isPlaying ? 'Pause narration' : 'Play narration'}
                </button>
              </div>
              <div style={{ marginTop: 8, fontSize: 11, color: '#666' }}>{Math.round(nearest?.distance || 0)} m away</div>
            </div>
          </div>
          <audio id="gps-audio" src={active.audio} preload="auto" />
        </div>
      )}

      <a-scene
        vr-mode-ui="enabled: false;"
        renderer="antialias: true; alpha: true"
      >
        <a-camera gps-camera="minDistance: 5;"></a-camera>

        {withMedia.map(l => (
          <a-entity
            key={l.id}
            gps-entity-place={`latitude: ${l.latitude}; longitude: ${l.longitude};`}
            look-at="[gps-camera]"
          >
            <a-plane color="#003262" height="0.6" width="2.6" position="0 2 0" opacity="0.85"></a-plane>
            <a-text
              value={l.title}
              align="center"
              color="#FDB515"
              width="4"
              position="0 2 0.05"
            ></a-text>
          </a-entity>
        ))}
      </a-scene>
    </div>
  );
}


