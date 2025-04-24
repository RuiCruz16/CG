import { CGFobject, CGFappearance } from '../lib/CGF.js';
import { MySphere } from './MySphere.js'; // For the bucket and cockpit
import { MyCone } from './MyCone.js'; // For the landing gear
import { MyCylinder } from './MyCylinder.js'; // For the body, tail, and rotors
import { MyEllipsoid } from './MyEllipsoid.js';
import { MyRectangularPrism } from './MyRectangularPrism.js';

export class MyHeli extends CGFobject {
  constructor(scene) {
    super(scene);
    this.scene = scene;
    
    this.bodyLength = 6; // Length of the helicopter body
    this.bodyWidth = 4;   // Width of the body
    this.bodyHeight = 4;  // Height of the body

    this.tailLength = 5;  // Tail length
    this.tailHeight = 1;  // Tail height

    this.mainRotorLength = this.bodyLength * 3; // Main rotor radius
    this.mainRotorHeight = 0.2; // Main rotor height
    this.mainRotorWidth = 0.5; // Main rotor width

    this.tailRotorLength = this.bodyLength*1.2; // Tail rotor radius
    this.tailRotorHeight = 0.2; // Tail rotor height
    this.tailRotorWidth = 0.5; // Tail rotor width

    this.landingGearLength = this.bodyLength * 2; // Landing gear length
    this.landingGearHeight = 7; // Landing gear height

    this.bucketSize = 2; // Bucket size
    this.initBuffers();
  }

  initBuffers() {
    // Create body, tail, and other parts of the helicopter
    this.body = new MyEllipsoid(this.scene, 50, 20, this.bodyLength, this.bodyHeight, this.bodyWidth);
    this.mainRotor = new MyRectangularPrism(this.scene, this.mainRotorLength, this.mainRotorHeight, this.mainRotorWidth);
    this.mainRotorExtension = new MyCylinder(this.scene, 20, 1, this.tailLength/2, this.tailHeight/2);
    this.mainRotorConnection = new MyEllipsoid(this.scene, 50, 20, this.bodyLength/6, this.bodyHeight/8, this.bodyLength/6);
    //this.tail = new MyRectangularPrism(this.scene, this.tailLength, this.tailHeight, this.tailHeight);
    this.tailRotor = new MyRectangularPrism(this.scene, this.tailRotorLength, this.tailRotorHeight, this.tailRotorWidth);
    this.tail = new MyCylinder(this.scene, 20, 1, this.tailLength, this.tailHeight);
    this.tailConnection = new MyEllipsoid(this.scene, 50, 20, this.bodyLength/4, this.bodyHeight/3, this.bodyLength/5);
    this.tailRotorConnection = new MyEllipsoid(this.scene, 50, 20, this.bodyLength/7, this.bodyHeight/9, this.bodyLength/7);
    this.tailRotorExtension = new MyCylinder(this.scene, 20, 1, this.tailLength/3, this.tailHeight/2);
    this.landingGear = new MyCylinder(this.scene, 20, 1, this.landingGearLength, 0.5);

    this.initTextures();
  }

  initTextures() {
    this.bodyTexture = new CGFappearance(this.scene);
    this.bodyTexture.setDiffuse(0.5, 0.5, 0.5, 1);
    this.bodyTexture.setSpecular(0.2, 0.2, 0.2, 1);
    this.bodyTexture.setShininess(10);
  }

  display() {

    // Draw the helicopter body
    this.scene.pushMatrix();
        this.scene.translate(0, this.landingGearHeight, 0);
        this.bodyTexture.apply();
        this.body.display();
    this.scene.popMatrix();

    // Draw the main rotor
    this.scene.pushMatrix();
        this.scene.translate(0, this.landingGearHeight + this.bodyHeight + 1, 0);
        this.mainRotor.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
      this.scene.translate(0, this.landingGearHeight + this.bodyHeight + 1, 0);
      this.scene.rotate(Math.PI / 2, 0, 1, 0);
      this.mainRotor.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
        this.scene.translate(0, this.landingGearHeight + this.bodyHeight + 1, 0);
        this.scene.rotate(Math.PI / 2, 1, 0, 0);
        this.mainRotorExtension.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
        this.scene.translate(0, this.landingGearHeight + this.bodyHeight + 1, 0);
        this.scene.rotate(Math.PI / 2, 0, 1, 0);
        this.mainRotorConnection.display();
    this.scene.popMatrix();

    // Draw the tail
    this.scene.pushMatrix();
      this.scene.translate(this.bodyLength-0.5, this.landingGearHeight, 0);
      this.scene.rotate(Math.PI / 2, 0, 1, 0);
      this.tail.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
      this.scene.translate(this.bodyLength + this.tailLength, this.landingGearHeight, 0);
      this.scene.rotate(Math.PI / 3, 0, 0, 1);
      this.scene.rotate(Math.PI / 2, 0, 1, 0);
      this.scene.scale(0.5, 0.5, 0.6);
      this.tail.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
      this.scene.translate(this.bodyLength + this.tailLength, this.landingGearHeight, 0);
      this.scene.rotate(-Math.PI / 3, 0, 0, 1);
      this.scene.rotate(Math.PI / 2, 0, 1, 0);
      this.scene.scale(0.5, 0.5, 0.6);
      this.tail.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
      this.scene.translate(this.bodyLength + this.tailLength, this.landingGearHeight, 0);
      this.tailConnection.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
        this.scene.translate(this.bodyLength + this.tailLength, this.landingGearHeight, 0);
        this.tailRotorExtension.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
        this.scene.translate(this.bodyLength + this.tailLength, this.landingGearHeight, this.tailLength/3);
        this.scene.rotate(Math.PI / 2, 1, 0, 0);
        this.tailRotorConnection.display();
    this.scene.popMatrix();


    // Draw the tail rotor
    this.scene.pushMatrix();
        this.scene.translate(this.bodyLength + this.tailLength, this.landingGearHeight, this.tailLength/3);
        this.tailRotor.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
        this.scene.translate(this.bodyLength + this.tailLength, this.landingGearHeight, this.tailLength/3);
        this.scene.rotate(Math.PI / 2, 0, 0, 1);
        this.tailRotor.display();
    this.scene.popMatrix();

    // Draw the landing gear
    this.scene.pushMatrix();
      this.scene.translate(-this.landingGearLength/2, 0, this.bodyWidth+1);
      this.scene.rotate(Math.PI / 2, 0, 1, 0);
      this.landingGear.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
      this.scene.translate(-this.landingGearLength/2, 0, -this.bodyWidth-1);
      this.scene.rotate(Math.PI / 2, 0, 1, 0);
      this.landingGear.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
      this.scene.translate(-this.landingGearLength/4, 0, 0);
      this.scene.translate(0, this.landingGearHeight - this.bodyHeight/2, this.bodyWidth/2);
      this.scene.rotate(Math.PI / 3, 1, 0, 0);
      this.scene.scale(0.5, 0.5, 0.5);
      this.landingGear.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
      this.scene.translate(-this.landingGearLength/4, 0, 0);
      this.scene.translate(0, this.landingGearHeight - this.bodyHeight/2, -this.bodyWidth/2);
      this.scene.rotate(Math.PI, 0, 1, 0);
      this.scene.rotate(Math.PI / 3, 1, 0, 0);
      this.scene.scale(0.5, 0.5, 0.5);
      this.landingGear.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
      this.scene.translate(this.landingGearLength/4, 0, 0);
      this.scene.translate(0, this.landingGearHeight - this.bodyHeight/2, this.bodyWidth/2);
      this.scene.rotate(Math.PI / 3, 1, 0, 0);
      this.scene.scale(0.5, 0.5, 0.5);
      this.landingGear.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
      this.scene.translate(this.landingGearLength/4, 0, 0);
      this.scene.translate(0, this.landingGearHeight - this.bodyHeight/2, -this.bodyWidth/2);
      this.scene.rotate(Math.PI, 0, 1, 0);
      this.scene.rotate(Math.PI / 3, 1, 0, 0);
      this.scene.scale(0.5, 0.5, 0.5);
      this.landingGear.display();
    this.scene.popMatrix();

  }
}
