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
    
    this.bodyLength = 10; // Length of the helicopter body
    this.bodyWidth = 8;   // Width of the body
    this.bodyHeight = 8;  // Height of the body

    this.tailLength = 4;  // Tail length
    this.tailHeight = 1;  // Tail height

    this.mainRotorLength = 6; // Main rotor radius
    this.mainRotorHeight = 0.5; // Main rotor height
    this.mainRotorWidth = 0.5; // Main rotor width

    this.tailRotorLength = 2; // Tail rotor radius
    this.tailRotorHeight = 0.2; // Tail rotor height
    this.tailRotorWidth = 0.2; // Tail rotor width

    this.landingGearLength = 1; // Landing gear size
    this.bucketSize = 2; // Bucket size
    this.initBuffers();
  }

  initBuffers() {
    // Create body, tail, and other parts of the helicopter
    this.body = new MyEllipsoid(this.scene, 50, 20, this.bodyLength, this.bodyHeight, this.bodyWidth);
    this.mainRotor = new MyRectangularPrism(this.scene, this.mainRotorLength, this.mainRotorHeight, this.mainRotorWidth);
    this.tailRotor = new MyRectangularPrism(this.scene, this.tailRotorLength, this.tailRotorHeight, this.tailRotorWidth);
    this.tail = new MyCylinder(this.scene, 20, 1, this.tailLength, this.tailHeight);

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
        this.scene.translate(0, 10, 0);
        this.bodyTexture.apply();
        this.body.display();
    this.scene.popMatrix();

    // Draw the tail
    this.scene.pushMatrix();
        this.scene.translate(this.bodyLength - 1, 10, 0);
        this.scene.rotate(Math.PI / 2, 0, 1, 0);
        this.scene.scale(2, 2, 2);
        this.tail.display();
    this.scene.popMatrix();

  }
}
