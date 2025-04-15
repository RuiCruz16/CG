import { CGFappearance } from "../lib/CGF.js";
import { MySphere } from "./MySphere.js";

export class MyPanorama {
    constructor(scene, texturePath) {
        this.scene = scene;

        this.appearance = new CGFappearance(scene);
        this.appearance.setEmission(1, 1, 1, 1); // Fully emissive
        this.appearance.loadTexture(texturePath);

        this.sphere = new MySphere(scene, 50, 50, true); // Inverted sphere
    }

    display() {
        this.appearance.apply();
        this.scene.pushMatrix();
        let pos = this.scene.camera.position;
        this.scene.translate(pos[0], pos[1], pos[2]);
        this.scene.rotate(-Math.PI/2, 1, 0, 0);
        this.scene.scale(200, 200, 200);
        this.sphere.display();
        this.scene.popMatrix();
    }
}
