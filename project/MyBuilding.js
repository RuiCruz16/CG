import { CGFobject, CGFappearance, CGFtexture } from '../lib/CGF.js';
import { MyModule } from './MyModule.js';

/**
 * MyBuilding class
 * Creates a fire station building composed of three modules:
 * a taller central module (with heliport) and two smaller side modules
 */
export class MyBuilding extends CGFobject {
  constructor(scene, width, floors, windowsPerFloor, windowTexture, buildingColor) {
    super(scene);
    this.width = width; // Total width of the building
    this.floors = floors; // Number of floors for the side modules (central module gets +1)
    this.windowsPerFloor = windowsPerFloor;
    this.windowTexture = windowTexture;
    this.buildingColor = buildingColor;

    this.centerModuleWidth = this.width / 2.5;
    this.sideModuleWidth = 0.75 * this.centerModuleWidth;
    this.heightPerFloor = this.centerModuleWidth * 0.3;

    // Load textures for building elements
    this.windowTextureObj = new CGFtexture(scene, windowTexture);
    this.doorTexture = new CGFtexture(scene, 'images/door.jpg');
    this.letreiroTexture = new CGFtexture(scene, 'images/letreiro.jpg');
    
    // Create material appearances
    this.windowAppearance = new CGFappearance(scene);
    this.windowAppearance.setTexture(this.windowTextureObj);
    
    this.doorAppearance = new CGFappearance(scene);
    this.doorAppearance.setTexture(this.doorTexture);
    
    this.letreiroAppearance = new CGFappearance(scene);
    this.letreiroAppearance.setTexture(this.letreiroTexture);

    this.initBuffers();
  }

  initBuffers() {
    this.createModules();
  }

  createModules() {
    // Create central module (with heliport)
    this.centerModule = new MyModule(
      this.scene, 
      this.centerModuleWidth, 
      this.floors + 1, // Central module has an extra floor
      this.windowsPerFloor, 
      this.heightPerFloor, 
      this.windowAppearance,
      this.doorAppearance,
      this.letreiroAppearance,
      this.buildingColor, 
      true
    );
    
    // Create side modules
    this.rightModule = new MyModule(
      this.scene, 
      this.sideModuleWidth, 
      this.floors, 
      this.windowsPerFloor, 
      this.heightPerFloor, 
      this.windowAppearance,
      this.doorAppearance,
      this.letreiroAppearance,
      this.buildingColor, 
      false
    );
    
    this.leftModule = new MyModule(
      this.scene, 
      this.sideModuleWidth, 
      this.floors, 
      this.windowsPerFloor, 
      this.heightPerFloor, 
      this.windowAppearance,
      this.doorAppearance,
      this.letreiroAppearance,
      this.buildingColor, 
      false
    );
  }

  update(t) {
    if (this.centerModule) {
      this.centerModule.update(t); // heliport animations
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
        this.leftModule.display();
    this.scene.popMatrix();
  }
}
