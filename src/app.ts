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

    const webMidiTonnetzController = new WebMidiTonnetzController(tonnetzElement);

    WebMidi
      .enable()
      .then(() => {
        if (WebMidi.inputs.length < 1) {
          console.log("No device detected.");
        }
      })
      .catch(err => alert(err));


    WebMidi.addListener('connected', event => {
      if (event.port.type === 'input') {
        console.log(`[${event.port.id} connected] ${event.port.name}`);
        webMidiTonnetzController.listen(event.port);
      }
    });

    WebMidi.addListener('disconnected', event => {
      if (event.port.type === 'input') {
        console.log(`[${event.port.id} disconnected] ${event.port.name}`);
        webMidiTonnetzController.unlisten(event.port);
      }
    });
  }
}

customElements.define('app-root', AppElement);
