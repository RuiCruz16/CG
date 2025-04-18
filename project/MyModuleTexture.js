import { CGFobject, CGFappearance } from '../lib/CGF.js';

export class MyModuleTexture extends CGFobject {
  constructor(scene, texturePath, xPos, yPos, zPos, xSpacing, ySpacing, isCeiling) {
    super(scene);
    this.texturePath = texturePath;

    this.xPos = xPos;
    this.yPos = yPos;
    this.zPos  = zPos;
    this.xSpacing = xSpacing;
    this.ySpacing = ySpacing;
    this.isCeiling = isCeiling;

    this.appearance = new CGFappearance(scene);
    this.appearance.loadTexture(texturePath);
    this.initBuffers();
  }

  initBuffers() {
    if(this.isCeiling) {
      this.vertices = [
        this.xPos - this.xSpacing, this.yPos, this.zPos - this.ySpacing,
        this.xPos + this.xSpacing, this.yPos, this.zPos - this.ySpacing,
        this.xPos - this.xSpacing, this.yPos, this.zPos + this.ySpacing,
        this.xPos + this.xSpacing, this.yPos, this.zPos + this.ySpacing
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
