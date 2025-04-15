import { CGFobject, CGFappearance } from '../lib/CGF.js';
import { MyWindow } from './MyWindow.js';

export class MyModule extends CGFobject {
  constructor(scene, width, floors, windowsPerFloor, windowTexture, buildingColor) {
    super(scene);
    this.width = width;
    this.floors = floors;
    this.windowsPerFloor = windowsPerFloor;
    this.windowTexture = windowTexture;
    this.buildingColor = buildingColor;

    this.appearance = new CGFappearance(scene);
    this.appearance.setAmbient(buildingColor[0] * 0.8, buildingColor[1] * 0.8, buildingColor[2] * 0.8, 0);
    this.appearance.setDiffuse(buildingColor[0] * 0.95, buildingColor[1] * 0.95, buildingColor[2] * 0.95, 0);
    this.appearance.setSpecular(0.5, 0.5, 0.5, 0);

    this.windows = [];
    this.createWindows();

    this.initBuffers();
  }

  initBuffers() {
    const height = this.width / 4;
    const halfWidth = this.width / 2;

    this.vertices = [
      -halfWidth, 0, halfWidth,
      halfWidth, 0, halfWidth,
      halfWidth, height * this.floors, halfWidth,
      -halfWidth, height *this.floors, halfWidth,
      -halfWidth, 0, -halfWidth,
      halfWidth, 0, -halfWidth,
      halfWidth, height * this.floors, -halfWidth,
      -halfWidth, height * this.floors, -halfWidth,
      -halfWidth, 0, halfWidth,
      halfWidth, 0, halfWidth,
      halfWidth, height * this.floors, halfWidth,
      -halfWidth, height * this.floors, halfWidth,
      -halfWidth, 0, -halfWidth,
      halfWidth, 0, -halfWidth,
      halfWidth, height * this.floors, -halfWidth,
      -halfWidth, height * this.floors, -halfWidth,
      -halfWidth, 0, halfWidth,
      halfWidth, 0, halfWidth,
      halfWidth, height * this.floors, halfWidth,
      -halfWidth, height * this.floors, halfWidth,
      -halfWidth, 0, -halfWidth,
      halfWidth, 0, -halfWidth,
      halfWidth, height * this.floors, -halfWidth,
      -halfWidth, height * this.floors, -halfWidth
    ];

    //Counter-clockwise reference of vertices
    this.indices = [
      // front face
      0, 1, 2,
      2, 3, 0,
      // right face
      1, 5, 6,
      6, 2, 1,
      // down face
      1, 0, 4,
      4, 5, 1,
      // up face
      3, 2, 6,
      6, 7, 3,
      // left face
      4, 0, 3,
      3, 7, 4,
      // back face
      7, 6, 5,
      5, 4, 7 
    ];

    this.normals = [
      -1, 0, 0,
      1, 0, 0,
      1, 0, 0,
      -1, 0, 0,
      -1, 0, 0,
      1, 0, 0,
      1, 0, 0,
      -1, 0, 0,
      0, -1, 0,
      0, -1, 0,
      0, 1, 0,
      0, 1, 0,
      0, -1, 0,
      0, -1, 0,
      0, 1, 0,
      0, 1, 0,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,
      0, 0, -1
    ];

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
  }

  createWindows() {
    const windowWidth = this.width / this.windowsPerFloor;
    const floorSize = this.width / 4;

    for (let i = 0; i < this.floors; i++) {
      for (let j = 0; j < this.windowsPerFloor; j++) {
        const xPos = -this.width / 2 + (j + 0.5) * windowWidth;
        const yPos = i * floorSize + (floorSize / 2);
        const zPos = this.width / 2 + 0.1;
        const xVariation = windowWidth / 4;
        const yVariation = floorSize / 4;
        this.windows.push(new MyWindow(this.scene, this.windowTexture, xPos, yPos, zPos, xVariation, yVariation));
      }
    }
  }

  display() {
    this.appearance.apply();

    for (let i = 0; i < this.windows.length; i++) {
      this.scene.pushMatrix();
        this.windows[i].display();
      this.scene.popMatrix();
    }
    
    this.scene.pushMatrix();
      super.display();
    this.scene.popMatrix();
  }
}
