import narration from '../assets/narration.mp3';
import marker from '../assets/pattern-berkeley_icon.patt';
import apartheidbanner from '../assets/apartheidbanner.jpeg';

const AFRAME = window.AFRAME;

// Q: Should we stop the sound at any point? Maybe we include a click event?
AFRAME.registerComponent('play', {
  init: function () {
    this.el.addEventListener('markerFound', () => {
      this.el.components.sound.playSound();
    });
  },
});

export default function Demo() {
  return (
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
        sound="src: #narration; volume: 50;"
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
  );
}
