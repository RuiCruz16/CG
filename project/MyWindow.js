import { CGFobject, CGFappearance } from '../lib/CGF.js';

export class MyWindow extends CGFobject {
  constructor(scene, texturePath, xPos, yPos, zPos, xSpacing, ySpacing) {
    super(scene);
    this.texturePath = texturePath;

    this.xPos = xPos;
    this.yPos = yPos;
    this.zPos  = zPos;
    this.xSpacing = xSpacing;
    this.ySpacing = ySpacing;

    this.appearance = new CGFappearance(scene);
    this.appearance.loadTexture(texturePath);
    this.initBuffers();
  }

  initBuffers() {
    this.vertices = [
      this.xPos - this.xSpacing, this.yPos + this.ySpacing, this.zPos,  // Top-left
      this.xPos + this.xSpacing, this.yPos + this.ySpacing, this.zPos,  // Top-right
      this.xPos - this.xSpacing, this.yPos - this.ySpacing, this.zPos, // Bottom-left
      this.xPos + this.xSpacing, this.yPos - this.ySpacing, this.zPos  // Bottom-right
    ];

    //console.log("TOP LEFT: ", this.xPos - this.xSpacing, this.yPos + this.ySpacing, this.zPos);
    //console.log("TOP RIGHT: ", this.xPos + this.xSpacing, this.yPos + this.ySpacing, this.zPos);
    //console.log("BOTTOM LEFT: ", this.xPos - this.xSpacing, this.yPos - this.ySpacing, this.zPos);
    //console.log("BOTTOM RIGHT: ", this.xPos + this.xSpacing, this.yPos - this.ySpacing, this.zPos);

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
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1
    ];

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
  }

  display() {
    this.appearance.apply();
    super.display();
  }
}
