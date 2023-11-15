const Demo = () => {
  return (
    <>
      <a-scene vr-mode-ui="enabled: false;"
        renderer="logarithmicDepthBuffer: true;"
        embedded
        arjs="trackingMethod: best; sourceType:webcam; debugUIEnabled: false; patternRatio: 0.5">
        <a-marker preset='hiro'>
          <a-box color="#4CC3D9" position="0 0 0"></a-box>
        </a-marker>
        <a-entity camera ></a-entity>
      </a-scene>
    </>
  );
};

export default Demo;
