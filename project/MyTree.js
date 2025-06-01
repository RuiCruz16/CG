import { CGFobject } from '../lib/CGF.js';
import { MyCone } from './MyCone.js';
import { MyPyramid } from './MyPyramid.js';

/*
 * MyTree
 * Creates a 3D tree object with a trunk and a crown made of pyramids.
 * Each tree has customizable properties such as height, radius, tilt angle,
 * color, and materials
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

    // Store materials for the trunk and leaves
    this.trunkMaterial = trunkMaterial;
    this.pyramidMaterial = leafMaterial;

    this.initBuffers();
  }

  initBuffers() {
    // Create the trunk using a cone
    this.trunk = new MyCone(this.scene, 20, 1, this.trunkHeight, this.trunkRadius);

    // Create array to store the pyramids for the crown
    this.pyramids = [];

    // Calculate crown properties
    let treetop = this.trunkHeight * 0.8; //Crown takes up 80% of the trunk height
    let trunkHeightWithoutPyramids = this.trunkHeight - treetop;  // Height of the trunk without the crown
    let numPyramids = Math.floor(this.trunkHeight / 2); // Number of pyramids based on trunk height
    let pyramidHeight = treetop / numPyramids; // Height of each pyramid in the crown
    let pyramidBaseSize = this.trunkRadius * 2; // Width of the base (starts twice the trunk radius)

    // Create multiple pyramids fwith decreasing size for the crown
    for (let i = 0; i < numPyramids; i++) {
        this.pyramids.push(new MyPyramid(this.scene, 6, pyramidHeight, pyramidBaseSize));
        pyramidBaseSize *= 0.9; // Each pyramid is 90% the size of the previous one
    }

    // Store calculated values use later in display
    this.numPyramids = numPyramids;
    this.trunkHeightWithoutPyramids = trunkHeightWithoutPyramids;
    this.pyramidBaseSize = pyramidBaseSize;
    this.pyramidHeight = pyramidHeight;
  }

  display() {
    // Apply tilt transformation to the tree
    this.scene.pushMatrix();
        // Apply rotation based on the specified axis
        if (this.rotationAxis === 'x') {
            this.scene.rotate(this.tiltAngle, 1, 0, 0); // Tilt around the X-axis
        } else if (this.rotationAxis === 'z') {
            this.scene.rotate(this.tiltAngle, 0, 0, 1); // Tilt around the Z-axis
        }

      // Draw the trunk with its material
      this.scene.pushMatrix();
          this.trunkMaterial.apply();
          this.trunk.display();
      this.scene.popMatrix();

      // Draw the pyramids that form the crown
      let yOffset = this.trunkHeightWithoutPyramids;  // Start stacking pyramids at the top of the trunk
      for (let i = 0; i < this.numPyramids; i++) {
        this.scene.pushMatrix();
          
          this.scene.translate(0, yOffset, 0);  // Position each pyramid layer
          this.scene.scale(1, 2, 1);  // Stretch vertically for a more tree-like appearance
          this.pyramidMaterial.apply(); // Apply leaf material
          this.pyramids[i].display(); 
        this.scene.popMatrix();

        // Move the next pyramid higher up
        yOffset += this.pyramidHeight;
      }
    this.scene.popMatrix();
  }
}
