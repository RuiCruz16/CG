import { CGFappearance } from "../lib/CGF.js";
import { MySphere } from "./MySphere.js";

/**
 * MyPanorama
 * Creates a skybox/background using an inverted sphere centered on the camera
 * Used to provide a 360° background environment for the scene
 */
export class MyPanorama {
    constructor(scene, texturePath) {
        this.scene = scene;

        this.appearance = new CGFappearance(scene);
        this.appearance.setEmission(1, 1, 1, 1); // Fully emissive (not affected by the scene lighting)
        this.appearance.loadTexture(texturePath);

        this.sphere = new MySphere(scene, 50, 50, true); // Inverted sphere
    }

    display() {
        this.appearance.apply();
        this.scene.pushMatrix();
        let pos = this.scene.camera.position;
        this.scene.translate(pos[0], pos[1], pos[2]); // Center the sphere on the camera
        this.scene.rotate(-Math.PI/2, 1, 0, 0);
        this.scene.scale(1000, 1000, 1000);
        this.sphere.display();
        this.scene.popMatrix();
    }
}
