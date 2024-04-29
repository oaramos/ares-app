// import './demo.css';

var PATTERN_URL =
  'https://raw.githubusercontent.com/oaramos/ares-app/main/src/assets/pattern-berkeley_icon.patt';

export default function Demo() {
  return (
    <a-scene
      xr-mode-ui="enabled: false;"
      arjs="trackingMethod: best; sourceType:webcam; debugUIEnabled: false;"
    >
      <a-marker type="pattern" url={PATTERN_URL}>
        <a-box color="red"></a-box>
      </a-marker>
      <a-marker-camera></a-marker-camera>
    </a-scene>
  );
}
