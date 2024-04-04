export default function Demo() {
  return (
    <a-scene arjs="trackingMethod: best; sourceType:webcam; debugUIEnabled: false;">
      <a-marker preset="hiro">
        <a-box color="red"></a-box>
      </a-marker>
      <a-entity camera></a-entity>
    </a-scene>
  );
}
