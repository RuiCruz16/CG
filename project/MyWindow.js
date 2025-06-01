import { CGFobject } from '../lib/CGF.js';

/**
 * MyWindow class
 * Represents a window used in building facades
 * Creates a textured quad at a specific position (xPos, yPos, zPos) with configurable dimensions (xSpacing, ySpacing)
 */
export class MyWindow extends CGFobject {
  constructor(scene, appearance, xPos, yPos, zPos, xSpacing, ySpacing) {
    super(scene);
    this.appearance = appearance;

    this.xPos = xPos;
    this.yPos = yPos;
    this.zPos  = zPos;
    this.xSpacing = xSpacing;
    this.ySpacing = ySpacing;

    this.initBuffers();
  }

  initBuffers() {
    this.vertices = [
      this.xPos - this.xSpacing, this.yPos + this.ySpacing, this.zPos,  // Top-left
      this.xPos + this.xSpacing, this.yPos + this.ySpacing, this.zPos,  // Top-right
      this.xPos - this.xSpacing, this.yPos - this.ySpacing, this.zPos, // Bottom-left
      this.xPos + this.xSpacing, this.yPos - this.ySpacing, this.zPos  // Bottom-right
    ];

    this.indices = [
      0, 2, 1,
      2, 3, 1
    ];

    this.texCoords = [
      0, 0,
      1, 0,
      0, 1,
      1, 1
    ];

    this.normals = [
      1, 1, 1,
      1, 1, 1,
      1, 1, 1,
      1, 1, 1
    ];

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
  }

  display() {
    this.appearance.apply();
    super.display();
  }
}
