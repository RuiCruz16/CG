import { CGFobject, CGFappearance } from '../lib/CGF.js';
import { MyCylinder } from './MyCylinder.js';
import { MyEllipsoid } from './MyEllipsoid.js';
import { MyRectangularPrism } from './MyRectangularPrism.js';
import { MyCylinderWTopCap } from './MyCylinderWTopCap.js';

export const HeliState = Object.freeze({
  LANDED: 'LANDED',
  TAKING_OFF: 'TAKING_OFF',
  FLYING: 'FLYING',
  LANDING: 'LANDING',
  RETURNING: 'RETURNING',
  REFFILLING: 'REFILLING'
});

export class MyHeli extends CGFobject {
  constructor(scene) {
    super(scene);
    this.scene = scene;
    
    this.bodyLength = 6;
    this.bodyWidth = 4;
    this.bodyHeight = 4;

    this.tailLength = 5;
    this.tailHeight = 1;

    this.mainRotorLength = this.bodyLength * 3;
    this.mainRotorHeight = 0.2;
    this.mainRotorWidth = 0.5;

    this.tailRotorLength = this.bodyLength*1.2;
    this.tailRotorHeight = 0.2;
    this.tailRotorWidth = 0.5;

    this.landingGearLength = this.bodyLength * 2;
    this.landingGearHeight = 7;

    this.bucketRadius = 2;
    this.bucketHeight = 3;

    this.bucketCableLength = 13;

    this.x = 100;
    this.y = 48;
    this.z = -100;
    this.orientation = 0;
    this.velocity = { x: 0, z: 0 };
    this.maxSpeed = 40;
    this.tilt = 0;
    
    this.heliState = HeliState.LANDED;
    this.cruiseAltitude = 70;
    this.altitude = this.y;

    this.targetAltitude = this.y;
    this.altitudeSpeed = 10;

    this.mainRotorAngle = 0;
    this.tailRotorAngle = 0;
    this.maxRotorSpeed = 20;
    this.currentRotorSpeed = 0;

    this.initBuffers();
  }

  initBuffers() {
    // Creating body, tail, and other parts of the helicopter
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
    this.bucket = new MyCylinderWTopCap(this.scene, 20, 1, this.bucketHeight, this.bucketRadius);
    this.bucketCap = new MyCylinder(this.scene, 20, 1, this.bucketHeight, this.bucketRadius);
    this.bucketCable = new MyCylinder(this.scene, 20, 1, this.bucketCableLength, this.bucketRadius/12);

    this.initTextures();
  }

  initTextures() {
    this.bodyTex = new CGFappearance(this.scene);
    this.bodyTex.setDiffuse(0.5, 0.5, 0.5, 1);
    this.bodyTex.setSpecular(0.2, 0.2, 0.2, 1);
    this.bodyTex.setShininess(10);
    this.bodyTex.loadTexture('images/heli_body.jpg');

    this.gearTex = new CGFappearance(this.scene);
    this.gearTex.setDiffuse(0.5, 0.5, 0.5, 1);
    this.gearTex.setSpecular(0.2, 0.2, 0.2, 1);
    this.gearTex.setShininess(10);
    this.gearTex.loadTexture('images/heli_gear.jpg');

    this.rotorTex = new CGFappearance(this.scene);
    this.rotorTex.setDiffuse(0.5, 0.5, 0.5, 1);
    this.rotorTex.setSpecular(0.2, 0.2, 0.2, 1);
    this.rotorTex.setShininess(10);
    this.rotorTex.loadTexture('images/heli_rotor.jpg');

    this.connectionTex = new CGFappearance(this.scene);
    this.connectionTex.setDiffuse(0.5, 0.5, 0.5, 1);
    this.connectionTex.setSpecular(0.2, 0.2, 0.2, 1);
    this.connectionTex.setShininess(10);
    this.connectionTex.loadTexture('images/heli_connection.jpg');

    this.tailTex = new CGFappearance(this.scene);
    this.tailTex.setDiffuse(0.5, 0.5, 0.5, 1);
    this.tailTex.setSpecular(0.2, 0.2, 0.2, 1);
    this.tailTex.setShininess(10);
    this.tailTex.loadTexture('images/heli_tail.jpg');

    this.bucketTex = new CGFappearance(this.scene);
    this.bucketTex.setDiffuse(0.5, 0.5, 0.5, 1);
    this.bucketTex.setSpecular(0.2, 0.2, 0.2, 1);
    this.bucketTex.setShininess(10);
    this.bucketTex.loadTexture('images/heli_tail.jpg');

    this.bucketCapTexEmpty = new CGFappearance(this.scene);
    this.bucketCapTexEmpty.setDiffuse(0.5, 0.5, 0.5, 1);
    this.bucketCapTexEmpty.setSpecular(0.2, 0.2, 0.2, 1);
    this.bucketCapTexEmpty.setShininess(10);
    this.bucketCapTexEmpty.loadTexture('images/inside_bucket.jpg');

    this.bucketCapTexFull = new CGFappearance(this.scene);
    this.bucketCapTexFull.setDiffuse(0.5, 0.5, 0.5, 1);
    this.bucketCapTexFull.setSpecular(0.2, 0.2, 0.2, 1);
    this.bucketCapTexFull.setShininess(10);
    this.bucketCapTexFull.loadTexture('images/water_bucket.jpg');

    this.bucketCableTex = new CGFappearance(this.scene);
    this.bucketCableTex.setDiffuse(0.5, 0.5, 0.5, 1);
    this.bucketCableTex.setSpecular(0.2, 0.2, 0.2, 1);
    this.bucketCableTex.setShininess(10);
    this.bucketCableTex.loadTexture('images/cable.jpg');
  }

  turn(v) {
    if (this.heliState != HeliState.FLYING) {
      return;
    }
    this.orientation += v;
    
    let speed = Math.sqrt(this.velocity.x ** 2 + this.velocity.z ** 2);
    
    let forwardVector = {
      x: Math.cos(this.orientation - v),
      z: -Math.sin(this.orientation - v)
    };
    
    let currentDirection = this.velocity.x * forwardVector.x + this.velocity.z * forwardVector.z;
    let isMovingForward = currentDirection >= 0;
    
    if (!isMovingForward) speed = -speed;
    
    this.velocity.x = speed * Math.cos(this.orientation);
    this.velocity.z = -speed * Math.sin(this.orientation);
  }
  
  accelerate(v) {
    if (this.heliState != HeliState.FLYING) return;

    const dirX = Math.cos(this.orientation);
    const dirZ = -Math.sin(this.orientation);

    // Predict new velocity if we apply acceleration v
    const newVx = this.velocity.x - v * dirX;
    const newVz = this.velocity.z - v * dirZ;

    const newSpeed = Math.sqrt(newVx ** 2 + newVz ** 2);

    if (newSpeed > this.maxSpeed) return;

    if (v == 0) {
      console.log("stop");
      this.velocity.x = this.velocity.x - this.velocity.x * 0.05;
      this.velocity.z = this.velocity.z - this.velocity.z * 0.05;
    }
    else {
      this.velocity.x = newVx;
      this.velocity.z = newVz;
    }

    this.tilt = v > 0 ? Math.PI / 18 : (v < 0 ? -Math.PI / 18 : 0);
  }

  returnToHeliport() {
    const heliportX = 100;
    const heliportZ = -100;
    const heliportY = 48;
    
    if (Math.abs(this.x - heliportX) < 1 && Math.abs(this.z - heliportZ) < 1) {
      this.targetAltitude = heliportY;
      this.heliState = HeliState.LANDING;
      this.velocity = { x: 0, z: 0 };
      this.tilt = 0;
      return;
    }
    
    this.targetAltitude = this.cruiseAltitude;
    
    const dx = heliportX - this.x;
    const dz = heliportZ - this.z;
    
    const distance = Math.sqrt(dx * dx + dz * dz);
    
    const dirX = dx / distance;
    const dirZ = dz / distance;
    
    const targetAngle = Math.atan2(dirZ, -dirX);
    
    this.orientation = targetAngle;
    
    this.velocity.x = this.maxSpeed * dirX;
    this.velocity.z = this.maxSpeed * dirZ;
    
    this.heliState = HeliState.RETURNING;
  }

  update(deltaTime) {
    let dt = deltaTime / 1000;
    
    const heliportX = 100;
    const heliportZ = -100;
    const heliportY = 48;
    
    if (this.heliState == HeliState.FLYING || this.heliState == HeliState.RETURNING) {
      this.x += this.velocity.x * dt;
      this.z += this.velocity.z * dt;
      
      if (this.heliState == HeliState.RETURNING && 
          Math.abs(this.x - heliportX) < 1 && 
          Math.abs(this.z - heliportZ) < 1 && 
          Math.abs(this.y - this.cruiseAltitude) < 1) {
        this.targetAltitude = heliportY;
        this.heliState = HeliState.LANDING;
        this.velocity = { x: 0, z: 0 };
        this.tilt = 0;
      }
    }
  
    if (this.y < this.targetAltitude) {
      this.y = Math.min(this.y + this.altitudeSpeed * dt, this.targetAltitude);
    } else if (this.y > this.targetAltitude) {
      this.y = Math.max(this.y - this.altitudeSpeed * dt, this.targetAltitude);
    }
  
    if (this.y == this.cruiseAltitude && 
        (this.heliState != HeliState.LANDING && this.heliState != HeliState.RETURNING)) {
      this.heliState = HeliState.FLYING;
    } else if (this.y == heliportY && this.heliState == HeliState.LANDING) {
      this.heliState = HeliState.LANDED;
    }

    this.updateRotorRotation(dt);
  }

  updateRotorRotation(dt) {
    let targetSpeed = 0;
    
    switch (this.heliState) {
      case HeliState.LANDED:
        targetSpeed = 0;
        break;
      case HeliState.TAKING_OFF:
        const takeoffPercentage = (this.y - 48) / (this.cruiseAltitude - 48);
        targetSpeed = this.maxRotorSpeed * takeoffPercentage;
        break;
      case HeliState.FLYING:
      case HeliState.RETURNING:
      case HeliState.REFFILLING:
        targetSpeed = this.maxRotorSpeed;
        break;
      case HeliState.LANDING:
        const landingPercentage = (this.y - 48) / (this.cruiseAltitude - 48);
        targetSpeed = this.maxRotorSpeed * landingPercentage;
        break;
    }
    
    const speedDiff = targetSpeed - this.currentRotorSpeed;
    if (Math.abs(speedDiff) < 0.01) {
      this.currentRotorSpeed = targetSpeed;
    } else {
      this.currentRotorSpeed += speedDiff * dt * 2;
    }
    
    this.mainRotorAngle += this.currentRotorSpeed * dt * 10;
    this.tailRotorAngle += this.currentRotorSpeed * dt * 15;
    
    this.mainRotorAngle %= Math.PI * 2;
    this.tailRotorAngle %= Math.PI * 2;
  }

  display() {
    this.scene.pushMatrix();

      this.scene.translate(this.x, this.y, this.z);
      this.scene.rotate(this.orientation, 0, 1, 0);
      this.scene.rotate(this.tilt, 0, 0, 1);

      if (this.heliState == HeliState.FLYING || this.heliState == HeliState.REFFILLING || this.heliState == HeliState.RETURNING) {
        this.scene.pushMatrix();
          this.scene.translate(0, -this.bucketCableLength + this.landingGearHeight, 0);
          this.scene.rotate(-Math.PI / 2, 1, 0, 0);
          this.bucketCableTex.apply();
          this.bucketCable.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
          this.scene.translate(0, -this.bucketCableLength -this.bucketHeight + this.landingGearHeight, 0);
          this.scene.rotate(-Math.PI / 2, 1, 0, 0);
          this.bucketCapTexEmpty.apply();
          this.bucketCap.display();
          this.bucketTex.apply();
          this.bucket.display();
        this.scene.popMatrix();
      }

      // Draw the helicopter body
      this.scene.pushMatrix();
        this.scene.translate(0, this.landingGearHeight, 0);
        this.bodyTex.apply();
        this.body.display();
      this.scene.popMatrix();

      // Draw the main rotor
      this.scene.pushMatrix();
        this.scene.translate(0, this.landingGearHeight + this.bodyHeight + 1, 0);
        this.scene.rotate(this.mainRotorAngle, 0, 1, 0);
        this.rotorTex.apply();
        this.mainRotor.display();
      this.scene.popMatrix();

      this.scene.pushMatrix();
        this.scene.translate(0, this.landingGearHeight + this.bodyHeight + 1, 0);
        this.scene.rotate(this.mainRotorAngle + Math.PI/2, 0, 1, 0);
        this.rotorTex.apply();
        this.mainRotor.display();
      this.scene.popMatrix();

      this.scene.pushMatrix();
        this.scene.translate(0, this.landingGearHeight + this.bodyHeight + 1, 0);
        this.scene.rotate(Math.PI / 2, 1, 0, 0);
        this.connectionTex.apply();
        this.mainRotorExtension.display();
      this.scene.popMatrix();

      this.scene.pushMatrix();
        this.scene.translate(0, this.landingGearHeight + this.bodyHeight + 1, 0);
        this.scene.rotate(Math.PI / 2, 0, 1, 0);
        this.connectionTex.apply();
        this.mainRotorConnection.display();
      this.scene.popMatrix();

      // Draw the tail
      this.scene.pushMatrix();
        this.scene.translate(this.bodyLength-0.5, this.landingGearHeight, 0);
        this.scene.rotate(Math.PI / 2, 0, 1, 0);
        this.tailTex.apply();
        this.tail.display();
      this.scene.popMatrix();

      this.scene.pushMatrix();
        this.scene.translate(this.bodyLength + this.tailLength, this.landingGearHeight, 0);
        this.scene.rotate(Math.PI / 3, 0, 0, 1);
        this.scene.rotate(Math.PI / 2, 0, 1, 0);
        this.scene.scale(0.5, 0.5, 0.6);
        this.tailTex.apply();
        this.tail.display();
      this.scene.popMatrix();

      this.scene.pushMatrix();
        this.scene.translate(this.bodyLength + this.tailLength, this.landingGearHeight, 0);
        this.scene.rotate(-Math.PI / 3, 0, 0, 1);
        this.scene.rotate(Math.PI / 2, 0, 1, 0);
        this.scene.scale(0.5, 0.5, 0.6);
        this.tailTex.apply();
        this.tail.display();
      this.scene.popMatrix();

      this.scene.pushMatrix();
        this.scene.translate(this.bodyLength + this.tailLength, this.landingGearHeight, 0);
        this.tailConnection.display();
      this.scene.popMatrix();

      this.scene.pushMatrix();
        this.scene.translate(this.bodyLength + this.tailLength, this.landingGearHeight, 0);
        this.connectionTex.apply();
        this.tailRotorExtension.display();
      this.scene.popMatrix();

      this.scene.pushMatrix();
        this.scene.translate(this.bodyLength + this.tailLength, this.landingGearHeight, this.tailLength/3);
        this.scene.rotate(Math.PI / 2, 1, 0, 0);
        this.connectionTex.apply();
        this.tailRotorConnection.display();
      this.scene.popMatrix();

      // Draw the tail rotor
      this.scene.pushMatrix();
        this.scene.translate(this.bodyLength + this.tailLength, this.landingGearHeight, this.tailLength/3);
        this.scene.rotate(this.tailRotorAngle, 0, 0, 1);
        this.rotorTex.apply();
        this.tailRotor.display();
      this.scene.popMatrix();

      this.scene.pushMatrix();
        this.scene.translate(this.bodyLength + this.tailLength, this.landingGearHeight, this.tailLength/3);
        this.scene.rotate(this.tailRotorAngle + Math.PI/2, 0, 0, 1);
        this.rotorTex.apply();
        this.tailRotor.display();
      this.scene.popMatrix();

      // Draw the landing gear
      this.scene.pushMatrix();
        this.scene.translate(-this.landingGearLength/2, 0, this.bodyWidth+1);
        this.scene.rotate(Math.PI / 2, 0, 1, 0);
        this.gearTex.apply();
        this.landingGear.display();
      this.scene.popMatrix();

      this.scene.pushMatrix();
        this.scene.translate(-this.landingGearLength/2, 0, -this.bodyWidth-1);
        this.scene.rotate(Math.PI / 2, 0, 1, 0);
        this.gearTex.apply();
        this.landingGear.display();
      this.scene.popMatrix();

      this.scene.pushMatrix();
        this.scene.translate(-this.landingGearLength/4, 0, 0);
        this.scene.translate(0, this.landingGearHeight - this.bodyHeight/2, this.bodyWidth/2);
        this.scene.rotate(Math.PI / 3, 1, 0, 0);
        this.scene.scale(0.5, 0.5, 0.5);
        this.gearTex.apply();
        this.landingGear.display();
      this.scene.popMatrix();

      this.scene.pushMatrix();
        this.scene.translate(-this.landingGearLength/4, 0, 0);
        this.scene.translate(0, this.landingGearHeight - this.bodyHeight/2, -this.bodyWidth/2);
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.scene.rotate(Math.PI / 3, 1, 0, 0);
        this.scene.scale(0.5, 0.5, 0.5);
        this.gearTex.apply();
        this.landingGear.display();
      this.scene.popMatrix();

      this.scene.pushMatrix();
        this.scene.translate(this.landingGearLength/4, 0, 0);
        this.scene.translate(0, this.landingGearHeight - this.bodyHeight/2, this.bodyWidth/2);
        this.scene.rotate(Math.PI / 3, 1, 0, 0);
        this.scene.scale(0.5, 0.5, 0.5);
        this.gearTex.apply();
        this.landingGear.display();
      this.scene.popMatrix();

      this.scene.pushMatrix();
        this.scene.translate(this.landingGearLength/4, 0, 0);
        this.scene.translate(0, this.landingGearHeight - this.bodyHeight/2, -this.bodyWidth/2);
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.scene.rotate(Math.PI / 3, 1, 0, 0);
        this.scene.scale(0.5, 0.5, 0.5);
        this.gearTex.apply();
        this.landingGear.display();
      this.scene.popMatrix();

    this.scene.popMatrix();
  }
}
