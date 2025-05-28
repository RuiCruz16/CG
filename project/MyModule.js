import { CGFobject, CGFappearance, CGFtexture, CGFshader } from '../lib/CGF.js';
import { MyWindow } from './MyWindow.js';
import { MyModuleTexture } from './MyModuleTexture.js';
import { HeliState } from './MyHeli.js';

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
    this.appearance.setAmbient(buildingColor[0] * 0.8, buildingColor[1] * 0.8, buildingColor[2] * 0.8, 1.0);
    this.appearance.setDiffuse(buildingColor[0] * 0.8, buildingColor[1] * 0.8, buildingColor[2] * 0.8, 1.0);
    this.appearance.setSpecular(0.5, 0.5, 0.5, 1.0);
    this.appearance.setShininess(10.0);

    this.heliportTexture = new CGFtexture(scene, 'images/heliport.jpg');
    this.heliportUpTexture = new CGFtexture(scene, 'images/heliport_up.png');
    this.heliportDownTexture = new CGFtexture(scene, 'images/heliport_down.png');

    this.heliportShader = new CGFshader(scene.gl, 'shaders/heliport.vert', 'shaders/heliport.frag');

    this.heliportShader.setUniformsValues({
      uSampler: 0,
      uSamplerAlt: 1,
      uTimeFactor: 0.0,
      uManeuverType: 0
    });

    this.elements = [];
    this.createElements();

    this.initBuffers();
  }

  initBuffers() {
    const halfWidth = this.width / 2;
    const height = this.heightPerFloor * this.floors;

    this.vertices = [
      // Front face
      -halfWidth, 0, halfWidth,       // 0
       halfWidth, 0, halfWidth,       // 1
       halfWidth, height, halfWidth,  // 2
      -halfWidth, height, halfWidth,  // 3
      // Back face
      -halfWidth, 0, -halfWidth,      // 4
       halfWidth, 0, -halfWidth,      // 5
       halfWidth, height, -halfWidth, // 6
      -halfWidth, height, -halfWidth, // 7
      // Right face
       halfWidth, 0, halfWidth,       // 8
       halfWidth, 0, -halfWidth,      // 9
       halfWidth, height, -halfWidth, // 10
       halfWidth, height, halfWidth,  // 11
      // Left face
      -halfWidth, 0, halfWidth,       // 12
      -halfWidth, 0, -halfWidth,      // 13
      -halfWidth, height, -halfWidth, // 14
      -halfWidth, height, halfWidth,  // 15
      // Top face
      -halfWidth, height, halfWidth,  // 16
       halfWidth, height, halfWidth,  // 17
       halfWidth, height, -halfWidth, // 18
      -halfWidth, height, -halfWidth, // 19
      // Bottom face
      -halfWidth, 0, halfWidth,       // 20
       halfWidth, 0, halfWidth,       // 21
       halfWidth, 0, -halfWidth,      // 22
      -halfWidth, 0, -halfWidth       // 23
    ];

    this.indices = [
      // Front face
       0,  1,  2,    2,  3,  0,
      // Back face
       7,  6,  5,    5,  4,  7,
      // Right face
       8,  9, 10,   10, 11,  8,
      // Left face
      15, 14, 13,   13, 12, 15,
      // Top face
      16, 17, 18,   18, 19, 16,
      // Bottom face
      23, 22, 21,   21, 20, 23
    ];

    this.normals = [
      // Front face
      1, 1, 1,   1, 1, 1,   1, 1, 1,   1, 1, 1,
      // Back face
      -1, 1, -1,  -1, 1, -1,  -1, 1, -1,  -1, 1, -1,
      // Right face
      1, 1, -1,   1, 1, -1,   1, 1, -1,   1, 1, -1,
      // Left face
      -1, 1, 1,  -1, 1, 1,  -1, 1, 1,  -1, 1, 1,
      // Top face
      0, 1, 0,   0, 1, 0,   0, 1, 0,   0, 1, 0,
      // Bottom face
      0, -1, 0,  0, -1, 0,  0, -1, 0,  0, -1, 0
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
            this.heliport = new MyModuleTexture(this.scene, 'images/heliport.jpg', 0, this.heightPerFloor * this.floors + 0.1, 0, Variation, Variation, true);
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

  update(t) {
    if (!this.heliport || !this.scene.helicopter) return;

    const timeFactor = (t % 1000) / 1000;
    
    const state = this.scene.helicopter.heliState;
    let maneuverType = 0;
    
    if (state === HeliState.TAKING_OFF) {
      maneuverType = 1;
    } else if (state === HeliState.LANDING) {
      maneuverType = 2;
    }
    
    this.heliportShader.setUniformsValues({
      uTimeFactor: timeFactor,
      uManeuverType: maneuverType
    });
  }

  enableNormalViz() {
    super.enableNormalViz();
  }
  
  disableNormalViz() {
    super.disableNormalViz();
  }  

  display() {
    this.appearance.apply();

    for (let i = 0; i < this.elements.length; i++) {
      this.scene.pushMatrix();
        this.elements[i].display();
      this.scene.popMatrix();
    }

    if (this.heliport) {
      const currentShader = this.scene.activeShader;
      
      this.scene.setActiveShader(this.heliportShader);
      
      this.heliportTexture.bind(0);
      
      if (this.scene.helicopter.heliState === HeliState.TAKING_OFF) {
        this.heliportUpTexture.bind(1);
      } else if (this.scene.helicopter.heliState === HeliState.LANDING) {
        this.heliportDownTexture.bind(1);
      } else {
        this.heliportTexture.bind(1);
      }
      
      this.scene.pushMatrix();
        this.heliport.display();
      this.scene.popMatrix();
      
      this.scene.setActiveShader(currentShader);
    }
    
    this.scene.pushMatrix();
      super.display();
    this.scene.popMatrix();
  }
}
