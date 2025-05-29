import { CGFobject } from '../lib/CGF.js';
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
  constructor(scene, trunkHeight, trunkRadius, tiltAngle, rotationAxis, color, trunkMaterial, leafMaterial) {
    super(scene);
    this.trunkHeight = trunkHeight;
    this.trunkRadius = trunkRadius;
    this.tiltAngle = tiltAngle;
    this.rotationAxis = rotationAxis;

    // Validate color parameter
    if (!Array.isArray(color) || color.length < 3) {
        console.warn("Invalid color provided for MyTree. Using default green color.");
        this.color = [0.0, 1.0, 0.0]; // Default to green
    } else {
        this.color = color;
    }

    this.trunkMaterial = trunkMaterial;
    this.pyramidMaterial = leafMaterial;

    this.initBuffers();
  }

  initBuffers() {
    // Tree trunk (cone)
    this.trunk = new MyCone(this.scene, 20, 1, this.trunkHeight, this.trunkRadius);

    // Tree crown (pyramids)
    this.pyramids = [];
    let treetop = this.trunkHeight * 0.8;
    let trunkHeightWithoutPyramids = this.trunkHeight - treetop;
    let numPyramids = Math.floor(this.trunkHeight / 2);
    let pyramidHeight = treetop / numPyramids; // Adjust height based on number of pyramids
    let pyramidBaseSize = this.trunkRadius * 2; // Base size of the pyramid

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
    // Apply tilt transformation
    this.scene.pushMatrix();
        if (this.rotationAxis === 'x') {
            this.scene.rotate(this.tiltAngle, 1, 0, 0); 
        } else if (this.rotationAxis === 'z') {
            this.scene.rotate(this.tiltAngle, 0, 0, 1); // Tilt around the Z-axis
        }

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
    this.scene.popMatrix(); // Pop the tilt transformation
  }
}
