import { CGFobject, CGFappearance } from '../lib/CGF.js';
import { MyCone } from './MyCone.js';
import { MyPyramid } from './MyPyramid.js';

/**
 * MyTree
 * @constructor
 * @param scene - Reference to the scene
 * @param trunkHeight - Height of the tree trunk (cone)
 * @param trunkRadius - Base radius of the tree trunk (cone)
 * @param tiltAngle - Tilt angle of the tree
 * @param rotationAxis - Axis of rotation for the tree
 * @param color - Color of the tree
 */
export class MyTree extends CGFobject {
  constructor(scene, trunkHeight, trunkRadius, tiltAngle, rotationAxis, color) {
    super(scene);
    this.trunkHeight = trunkHeight;
    this.trunkRadius = trunkRadius;
    this.tiltAngle = tiltAngle;
    this.rotationAxis = rotationAxis;
    this.color = color;
    this.initBuffers();
  }

  initBuffers() {
    // Tree trunk (cone)
    this.trunk = new MyCone(this.scene, 20, 1, this.trunkHeight, this.trunkRadius); // 20 slices, 1 stack
    this.trunkMaterial = new CGFappearance(this.scene);
    this.trunkMaterial.setDiffuse(0.5, 0.25, 0.1, 1);  // Brown color for trunk

    // Tree crown (pyramids)
    this.pyramids = [];
    let treetop = this.trunkHeight * 0.8;
    let trunkHeightWithoutPyramids = this.trunkHeight - treetop;
    let numPyramids = Math.floor(this.trunkHeight / 2);
    let pyramidHeight = treetop / numPyramids; // Adjust height based on number of pyramids
    let pyramidBaseSize = this.trunkRadius * 2; // Base size of the pyramid
    this.pyramidMaterial = new CGFappearance(this.scene);
    this.pyramidMaterial.setDiffuse(0.0, 1.0, 0.0, 1);  // Green color for foliage

    // Create multiple pyramids for the crown
    for (let i = 0; i < numPyramids; i++) {
    this.pyramids.push(new MyPyramid(this.scene, 6, pyramidHeight, pyramidBaseSize));
    pyramidBaseSize *= 0.9;
    }

    this.numPyramids = numPyramids;
    this.trunkHeightWithoutPyramids = trunkHeightWithoutPyramids;
    this.pyramidBaseSize = pyramidBaseSize;
    this.pyramidHeight = pyramidHeight;
  }

  display() {
    // Draw the trunk (cone)
    this.scene.pushMatrix();
        this.trunkMaterial.apply();
        this.trunk.display();
    this.scene.popMatrix();

    // Draw the pyramids (crown)
    let yOffset = this.trunkHeightWithoutPyramids;
    for (let i = 0; i < this.numPyramids; i++) {
      this.scene.pushMatrix();
        
        this.scene.translate(0, yOffset, 0);  // Stack pyramids on top of each other
        this.scene.scale(1, 2, 1);
        this.pyramidMaterial.apply();
        this.pyramids[i].display();
      this.scene.popMatrix();

      // Move the next pyramid higher up
      yOffset += this.pyramidHeight;
    }
  }
}
