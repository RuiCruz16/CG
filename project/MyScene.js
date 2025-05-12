import { CGFscene, CGFcamera, CGFaxis, CGFtexture, CGFappearance } from "../lib/CGF.js";
import { MyPlane } from "./MyPlane.js";
import { MySphere } from "./MySphere.js";
import { MyPanorama } from "./MyPanorama.js";
import { MyTree } from "./MyTree.js";
import { MyForest } from "./MyForest.js";
import { MyBuilding } from './MyBuilding.js';
import { MyHeli } from './MyHeli.js';

/**
 * MyScene
 * @constructor
 */
export class MyScene extends CGFscene {
  constructor() {
    super();
  }
  init(application) {
    super.init(application);

    this.initCameras();
    this.initLights();

    //Background color
    this.gl.clearColor(0, 0, 0, 1.0);

    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);

    this.enableTextures(true);

    this.planeMaterial = new CGFappearance(this);
    this.planeMaterial.setAmbient(0.1, 0.1, 0.1, 1);
    this.planeMaterial.setDiffuse(0.9, 0.9, 0.9, 1);
    this.planeMaterial.setSpecular(0.1, 0.1, 0.1, 1);
    this.planeMaterial.setShininess(10.0);
    this.planeMaterial.loadTexture('images/grass.png');
    //this.planeMaterial.setTextureWrap('REPEAT', 'REPEAT');

    this.earthMaterial = new CGFappearance(this);
    this.earthMaterial.setAmbient(0.1, 0.1, 0.1, 1);
    this.earthMaterial.setDiffuse(0.9, 0.9, 0.9, 1);
    this.earthMaterial.setSpecular(0.1, 0.1, 0.1, 1);
    this.earthMaterial.setShininess(10.0);
    this.earthMaterial.loadTexture('images/earth.jpg');

    // Textures
    this.textureGrass =  new CGFtexture(this, 'images/grass.png'); 

    this.setUpdatePeriod(50);

    //Initialize scene objects
    this.axis = new CGFaxis(this, 20, 1);
    this.plane = new MyPlane(this, 64);
    this.sphere = new MySphere(this, 50, 50);
    this.panorama = new MyPanorama(this, 'images/panorama.jpg');
    this.tree = new MyTree(this, 30, 5, Math.PI/4, 'z', [0.0, 1.0, 0.0]);
    this.forest = new MyForest(this, 4, 4);
    this.helicopter = new MyHeli(this);


    this.building = new MyBuilding(this, 100, 3, 2, 'images/window.jpg', [1, 1, 1, 1]);

    this.displayNormals = false;
    this.speedFactor = 1;
  }
  initLights() {
    this.lights[0].setPosition(200, 200, 200, 1);
    this.lights[0].setDiffuse(1.0, 1.0, 1.0, 1.0);
    this.lights[0].enable();
    this.lights[0].update();
  }
  initCameras() {
    this.camera = new CGFcamera(
      Math.PI / 3,
      0.1,
      1000,
      vec3.fromValues(200, 200, 200),
      vec3.fromValues(0, 0, 0)
    );
  }

  /*
  checkKeys() {
    var text = "Keys pressed: ";
    var keysPressed = false;

    // Check for key codes e.g. in https://keycode.info/
    if (this.gui.isKeyPressed("KeyW")) {
      text += " W ";
      keysPressed = true;
    }

    if (this.gui.isKeyPressed("KeyS")) {
      text += " S ";
      keysPressed = true;
    }
    if (keysPressed)
      console.log(text);
  }
  */

  checkKeys() {
    
    if (this.gui.isKeyPressed("KeyW")) {
      this.helicopter.accelerate(0.5 * this.speedFactor);
      console.log("accelerate");
    }
  
    if (this.gui.isKeyPressed("KeyS"))
      this.helicopter.accelerate(-0.5 * this.speedFactor);

    if (!this.gui.isKeyPressed("KeyW") && !this.gui.isKeyPressed("KeyS"))
      this.helicopter.accelerate(0);
  
    if (this.gui.isKeyPressed("KeyA"))
      this.helicopter.turn(0.1 * this.speedFactor);
  
    if (this.gui.isKeyPressed("KeyD"))
      this.helicopter.turn(-0.1 * this.speedFactor);
  
    if (this.gui.isKeyPressed("KeyR")) {
      this.helicopter.x = 100;
      this.helicopter.z = -100;
      this.helicopter.y = 48;
      this.helicopter.velocity = { x: 0, z: 0 };
      this.helicopter.orientation = 0;
      this.helicopter.tilt = 0;
      this.helicopter.targetAltitude = 48;
    }
  
    if (this.gui.isKeyPressed("KeyP")) {
      console.log("Cruise altitude: " + this.helicopter.y);
      this.helicopter.targetAltitude = this.helicopter.cruiseAltitude;
    }
    
    if (this.gui.isKeyPressed("KeyL")) {
      this.helicopter.tilt = 0;
      this.helicopter.targetAltitude = 0;
      this.helicopter.velocity = { x: 0, z: 0 };
    }
  }

  update(t) {
    this.checkKeys();
    this.helicopter.update(this.updatePeriod); 
  }

  setDefaultAppearance() {
    this.setAmbient(0.5, 0.5, 0.5, 1.0);
    this.setDiffuse(0.5, 0.5, 0.5, 1.0);
    this.setSpecular(0.5, 0.5, 0.5, 1.0);
    this.setShininess(10.0);
  }
  display() {
    // ---- BEGIN Background, camera and axis setup
    // Clear image and depth buffer everytime we update the scene
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    // Initialize Model-View matrix as identity (no transformation
    this.updateProjectionMatrix();
    this.loadIdentity();
    // Apply transformations corresponding to the camera position relative to the origin
    this.applyViewMatrix();

    // Draw axis
    //this.axis.display();

    if (this.displayNormals) {
      this.building.centerModule.enableNormalViz();
      this.building.leftModule.enableNormalViz();
      this.building.rightModule.enableNormalViz();
      this.helicopter.tailRotor.enableNormalViz();
    } else {
      this.building.centerModule.disableNormalViz();
      this.building.leftModule.disableNormalViz();
      this.building.rightModule.disableNormalViz();
      this.helicopter.tailRotor.disableNormalViz();
    }    

    this.setDefaultAppearance();

    this.pushMatrix();
      //this.translate(100, 48, -100);
      this.helicopter.display(); // Display the helicopter
    this.popMatrix();

    this.pushMatrix();
      this.forest.display(); // Display the forest of trees
    this.popMatrix();

    this.pushMatrix();
      //this.tree.display(); // Display the tree
    this.popMatrix();
      

    this.pushMatrix();
      this.translate(100, 0, -100);
      this.building.display();
    this.popMatrix();

    this.pushMatrix();
      this.scale(400, 1, 400);
      this.rotate(-Math.PI / 2, 1, 0, 0);
      this.planeMaterial.apply(); // Apply the texture to the plane!
      this.plane.display();
    this.popMatrix();

    this.pushMatrix();
      this.earthMaterial.apply(); // Apply the texture to the sphere!
      //this.sphere.display();
    this.popMatrix();

    this.panorama.display(); // Display the panorama

  }
}
