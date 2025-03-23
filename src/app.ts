import { WebMidi } from "webmidi";
import { defineCustomElements } from "tiny-midi-web-components/loader";
import { WebMidiTonnetzController } from "tiny-midi-web-components";

class AppElement extends HTMLElement {
  connectedCallback() {
    defineCustomElements();

    const tonnetzElement = document.createElement('tiny-tonnetz');
    tonnetzElement.isLightTheme = true;
    tonnetzElement.style.position = "absolute";
    tonnetzElement.style.inset = "0";
    tonnetzElement.style.aspectRatio = "auto";
    this.appendChild(tonnetzElement);

    WebMidi
      .enable({ sysex: false })
      .then(onEnabled)
      .catch(err => alert(err));

    function onEnabled() {
      if (WebMidi.inputs.length < 1) {
        console.log("No device detected.");

      } else {
        WebMidi.inputs.forEach((device, index) => {
          console.log(`${index}: ${device.name}`);
          const controller = new WebMidiTonnetzController(tonnetzElement);
          controller.listen(device);
        });
      }
    }
  }
}

customElements.define('app-root', AppElement);
