import { GLTFLoader } from './vendor/three/examples/jsm/loaders/GLTFLoader.js';

// Both the loader and its model are packaged with the extension for offline use.
window.EscapeModelAssets = {
  loadWorkstation() {
    return new GLTFLoader().loadAsync('assets/escape/models/workstation-v2.glb')
      .then(result => result.scene);
  }
};
window.dispatchEvent(new Event('escape-models-ready'));
