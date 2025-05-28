import { CGFobject } from '../lib/CGF.js';
import { MyModule } from './MyModule.js';

export class MyBuilding extends CGFobject {
  constructor(scene, width, floors, windowsPerFloor, windowTexture, buildingColor) {
    super(scene);
    this.width = width;
    this.floors = floors;
    this.windowsPerFloor = windowsPerFloor;
    this.windowTexture = windowTexture;
    this.buildingColor = buildingColor;

    this.centerModuleWidth = this.width / 2.5;
    this.sideModuleWidth = 0.75 * this.centerModuleWidth;
    this.heightPerFloor = this.centerModuleWidth * 0.3;

    this.initBuffers();
  }

  initBuffers() {
    this.createModules();
  }

  createModules() {
    this.centerModule = new MyModule(this.scene, this.centerModuleWidth, this.floors + 1, this.windowsPerFloor, this.heightPerFloor, this.windowTexture, this.buildingColor, true);
    this.rightModule = new MyModule(this.scene, this.sideModuleWidth, this.floors, this.windowsPerFloor, this.heightPerFloor, this.windowTexture, this.buildingColor, false);
    this.leftModule = new MyModule(this.scene, this.sideModuleWidth, this.floors, this.windowsPerFloor, this.heightPerFloor, this.windowTexture, this.buildingColor, false);
  }

  update(t) {
    if (this.centerModule) {
      this.centerModule.update(t);
    }
  }

  display() {
    this.scene.pushMatrix();
        this.centerModule.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
        this.scene.translate(this.centerModuleWidth / 2 + this.sideModuleWidth / 2, 0, 0);
        this.rightModule.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
        this.scene.translate(-(this.centerModuleWidth / 2 + this.sideModuleWidth / 2), 0, 0);
        this.rightModule.display();
    this.scene.popMatrix();
  }
}
