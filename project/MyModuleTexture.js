import { CGFobject, CGFtexture, CGFappearance } from '../lib/CGF.js';

/**
 * MyModuleTexture
 * Creates a textured quad (rectangle)
 * Used in MyBuilding for applying special textures like heliport,
 * door, and the building signage
 */
export class MyModuleTexture extends CGFobject {
  constructor(scene, appearance, xPos, yPos, zPos, xSpacing, ySpacing, isCeiling) {
    super(scene);
    
    // Handle both appearance object and texture path string
    if (typeof appearance === 'string') {
      const texture = new CGFtexture(scene, appearance);
      this.appearance = new CGFappearance(scene);
      this.appearance.setTexture(texture);
    } else {
      this.appearance = appearance;
    }

    this.xPos = xPos;
    this.yPos = yPos;
    this.zPos  = zPos;
    this.xSpacing = xSpacing; // Half-width
    this.ySpacing = ySpacing; // Half-height
    this.isCeiling = isCeiling; // Orientation flag (vertical wall vs horizontal surface)

    this.initBuffers();
  }

  initBuffers() {
    if(this.isCeiling) {
      this.vertices = [
        this.xPos - this.xSpacing, this.yPos, this.zPos - this.ySpacing, // Bottom-left
        this.xPos + this.xSpacing, this.yPos, this.zPos - this.ySpacing, // Bottom-right
        this.xPos - this.xSpacing, this.yPos, this.zPos + this.ySpacing, // Top-left
        this.xPos + this.xSpacing, this.yPos, this.zPos + this.ySpacing // Top-right
      ];
    } else {
      this.vertices = [
        this.xPos - this.xSpacing, this.yPos + this.ySpacing, this.zPos,  // Top-left
        this.xPos + this.xSpacing, this.yPos + this.ySpacing, this.zPos,  // Top-right
        this.xPos - this.xSpacing, this.yPos - this.ySpacing, this.zPos, // Bottom-left
        this.xPos + this.xSpacing, this.yPos - this.ySpacing, this.zPos  // Bottom-right
      ];
    }

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

    if(this.isCeiling) {
      this.normals = [
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0
      ];
    } else {
      // Vertical surfaces
      this.normals = [
        1, 1, 1,
        1, 1, 1,
        1, 1, 1,
        1, 1, 1
      ];
    }

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
  }

  display() {
    this.appearance.apply();
    super.display();
  }
}
