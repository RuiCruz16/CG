import { CGFobject, CGFappearance } from '../lib/CGF.js';
import { MyWindow } from './MyWindow.js';
import { MyModuleTexture } from './MyModuleTexture.js';

export class MyModule extends CGFobject {
  constructor(scene, width, floors, windowsPerFloor, heightPerFloor, windowTexture, buildingColor, isCenter) {
    super(scene);
    this.width = width;
    this.floors = floors;
    this.windowsPerFloor = windowsPerFloor;
    this.heightPerFloor = heightPerFloor;
    this.windowTexture = windowTexture;
    this.buildingColor = buildingColor;
    this.isCenter = isCenter;

    this.appearance = new CGFappearance(scene);
    this.appearance.setAmbient(buildingColor[0] * 0.8, buildingColor[1] * 0.8, buildingColor[2] * 0.8, 0);
    this.appearance.setDiffuse(buildingColor[0] * 0.95, buildingColor[1] * 0.95, buildingColor[2] * 0.95, 0);
    this.appearance.setSpecular(0.5, 0.5, 0.5, 0);

    this.elements = [];
    this.createElements();

    this.initBuffers();
  }

  initBuffers() {
    const halfWidth = this.width / 2;

    this.vertices = [
      -halfWidth, 0, halfWidth,
      halfWidth, 0, halfWidth,
      halfWidth, this.heightPerFloor * this.floors, halfWidth,
      -halfWidth, this.heightPerFloor *this.floors, halfWidth,
      -halfWidth, 0, -halfWidth,
      halfWidth, 0, -halfWidth,
      halfWidth, this.heightPerFloor * this.floors, -halfWidth,
      -halfWidth, this.heightPerFloor * this.floors, -halfWidth,
      -halfWidth, 0, halfWidth,
      halfWidth, 0, halfWidth,
      halfWidth, this.heightPerFloor * this.floors, halfWidth,
      -halfWidth, this.heightPerFloor * this.floors, halfWidth,
      -halfWidth, 0, -halfWidth,
      halfWidth, 0, -halfWidth,
      halfWidth, this.heightPerFloor * this.floors, -halfWidth,
      -halfWidth, this.heightPerFloor * this.floors, -halfWidth,
      -halfWidth, 0, halfWidth,
      halfWidth, 0, halfWidth,
      halfWidth, this.heightPerFloor * this.floors, halfWidth,
      -halfWidth, this.heightPerFloor * this.floors, halfWidth,
      -halfWidth, 0, -halfWidth,
      halfWidth, 0, -halfWidth,
      halfWidth, this.heightPerFloor * this.floors, -halfWidth,
      -halfWidth, this.heightPerFloor * this.floors, -halfWidth
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

  createElements() {
    const windowWidth = this.width / this.windowsPerFloor;

    for (let i = 0; i < this.floors; i++) {
      for (let j = 0; j < this.windowsPerFloor; j++) {
        if (i == 0 && this.isCenter) {
          const yPosDoor = this.heightPerFloor / 3;
          const zPos = this.width / 2 + 0.1;
          const xVariationDoor = (this.width/2) * 0.15;
          const yVariationDoor = this.heightPerFloor / 3;
          this.elements.push(new MyModuleTexture(this.scene, 'images/door.jpg', 0, yPosDoor, zPos, xVariationDoor, yVariationDoor, false));

          const yPosSign = this.heightPerFloor;
          const yVariationSign = this.heightPerFloor / 5;
          const xVariationSign = (this.width/2) * 0.25;
          this.elements.push(new MyModuleTexture(this.scene, 'images/letreiro.jpg', 0, yPosSign, zPos, xVariationSign, yVariationSign, false));
          break;
        } else {
          if (i == this.floors - 1 && this.isCenter) {
            const Variation = (this.width/2) * 0.70;
            this.elements.push(new MyModuleTexture(this.scene, 'images/heliport.jpg', 0, this.heightPerFloor * this.floors + 0.1, 0, Variation, Variation, true));
          }
          const xPos = -this.width / 2 + (j + 0.5) * windowWidth;
          const yPos = i * this.heightPerFloor + (this.heightPerFloor / 2);
          const zPos = this.width / 2 + 0.1;
          const xVariation = windowWidth / 5;
          const yVariation = this.heightPerFloor / 4;
          this.elements.push(new MyWindow(this.scene, this.windowTexture, xPos, yPos, zPos, xVariation, yVariation));
        }
      }
    }
  }

  display() {
    this.appearance.apply();

    for (let i = 0; i < this.elements.length; i++) {
      this.scene.pushMatrix();
        this.elements[i].display();
      this.scene.popMatrix();
    }
    
    this.scene.pushMatrix();
      super.display();
    this.scene.popMatrix();
  }
}
