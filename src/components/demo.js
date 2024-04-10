// import './demo.css';
export default function Demo() {
  return (
    <a-scene
      xr-mode-ui="enabled: false;"
      arjs="trackingMethod: best; sourceType:webcam; debugUIEnabled: false;"
    >
      <a-marker preset="hiro">
        <a-box color="red"></a-box>
      </a-marker>
      <a-marker-camera></a-marker-camera>
    </a-scene>
  );
}
