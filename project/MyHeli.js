import { CGFobject, CGFappearance } from '../lib/CGF.js';
import { MyCylinder } from './MyCylinder.js';
import { MyEllipsoid } from './MyEllipsoid.js';
import { MyRectangularPrism } from './MyRectangularPrism.js';
import { MyCylinderWTopCap } from './MyCylinderWTopCap.js';

/**
 * HeliState - Enum representing the different states of the helicopter
 * Uses Object.freeze to make it immutable
 */
export const HeliState = Object.freeze({
  LANDED: 'LANDED',           // Helicopter is landed
  TAKING_OFF: 'TAKING_OFF',   // Helicopter is taking off
  FLYING: 'FLYING',           // Helicopter is in flight  
  LANDING: 'LANDING',         // Helicopter is landing 
  RETURNING: 'RETURNING',     // Helicopter is returning to the heliport
  REFFILLING: 'REFILLING',    // Helicopter is refilling the bucket
  DROPPING: 'DROPPING'        // Helicopter is dropping water on fire
});

export class MyHeli extends CGFobject {
  constructor(scene) {
    super(scene);
    this.scene = scene;
    
    // Helicopter dimensions
    this.bodyLength = 6;
    this.bodyWidth = 4;
    this.bodyHeight = 4;

    // Tail dimensions
    this.tailLength = 5;
    this.tailHeight = 1;

    // Main rotor dimensions
    this.mainRotorLength = this.bodyLength * 3;
    this.mainRotorHeight = 0.2;
    this.mainRotorWidth = 0.5;

    // Tail rotor dimensions
    this.tailRotorLength = this.bodyLength*1.2;
    this.tailRotorHeight = 0.2;
    this.tailRotorWidth = 0.5;

    // Landing gear dimensions
    this.landingGearLength = this.bodyLength * 2;
    this.landingGearHeight = 7;

    // Bucket dimensions
    this.bucketRadius = 2;
    this.bucketHeight = 3;
    this.bucketCableLength = 13;

    // Initial position and orientation
    this.x = 100;
    this.y = 48;
    this.z = -100;
    this.orientation = 0;
    this.velocity = { x: 0, z: 0 };
    this.maxSpeed = 40;
    this.tilt = 0;
    
    // Helicopter initial state and altitude properties
    this.heliState = HeliState.LANDED;
    this.cruiseAltitude = 80;
    this.altitude = this.y;
    this.targetAltitude = this.y;
    this.altitudeSpeed = 10;

    // Rotor animation properties
    this.mainRotorAngle = 0;
    this.tailRotorAngle = 0;
    this.maxRotorSpeed = 20;
    this.currentRotorSpeed = 0;

    // Water bucket properties
    this.bucketIsFull = false;
    this.refillHeight = 5;

    this.initBuffers();
  }

  initBuffers() {
    // Main helicopter body
    this.body = new MyEllipsoid(this.scene, 50, 20, this.bodyLength, this.bodyHeight, this.bodyWidth);

    // Main rotor components
    this.mainRotor = new MyRectangularPrism(this.scene, this.mainRotorLength, this.mainRotorHeight, this.mainRotorWidth);
    this.mainRotorExtension = new MyCylinder(this.scene, 20, 1, this.tailLength/2, this.tailHeight/2);
    this.mainRotorConnection = new MyEllipsoid(this.scene, 50, 20, this.bodyLength/6, this.bodyHeight/8, this.bodyLength/6);

    // Tail rotor components
    this.tailRotor = new MyRectangularPrism(this.scene, this.tailRotorLength, this.tailRotorHeight, this.tailRotorWidth);
    this.tail = new MyCylinder(this.scene, 20, 1, this.tailLength, this.tailHeight);
    this.tailConnection = new MyEllipsoid(this.scene, 50, 20, this.bodyLength/4, this.bodyHeight/3, this.bodyLength/5);
    this.tailRotorConnection = new MyEllipsoid(this.scene, 50, 20, this.bodyLength/7, this.bodyHeight/9, this.bodyLength/7);
    this.tailRotorExtension = new MyCylinder(this.scene, 20, 1, this.tailLength/3, this.tailHeight/2);

    // Landing gear components
    this.landingGear = new MyCylinder(this.scene, 20, 1, this.landingGearLength, 0.5);

    // Bucket components
    this.bucket = new MyCylinderWTopCap(this.scene, 20, 1, this.bucketHeight, this.bucketRadius);
    this.bucketCap = new MyCylinder(this.scene, 20, 1, this.bucketHeight, this.bucketRadius);
    this.bucketCable = new MyCylinder(this.scene, 20, 1, this.bucketCableLength, this.bucketRadius/12);

    // Water representation for visualization
    this.water = new MyEllipsoid(this.scene, 50, 20, 10, 10, 10);

    this.initTextures();
  }

  initTextures() {
    // Body texture
    this.bodyTex = new CGFappearance(this.scene);
    this.bodyTex.setDiffuse(0.5, 0.5, 0.5, 1);
    this.bodyTex.setSpecular(0.2, 0.2, 0.2, 1);
    this.bodyTex.setShininess(10);
    this.bodyTex.loadTexture('images/heli_body.jpg');

    // Landing gear texture
    this.gearTex = new CGFappearance(this.scene);
    this.gearTex.setDiffuse(0.5, 0.5, 0.5, 1);
    this.gearTex.setSpecular(0.2, 0.2, 0.2, 1);
    this.gearTex.setShininess(10);
    this.gearTex.loadTexture('images/heli_gear.jpg');

    // Rotor texture
    this.rotorTex = new CGFappearance(this.scene);
    this.rotorTex.setDiffuse(0.5, 0.5, 0.5, 1);
    this.rotorTex.setSpecular(0.2, 0.2, 0.2, 1);
    this.rotorTex.setShininess(10);
    this.rotorTex.loadTexture('images/heli_rotor.jpg');

    // Connection points texture
    this.connectionTex = new CGFappearance(this.scene);
    this.connectionTex.setDiffuse(0.5, 0.5, 0.5, 1);
    this.connectionTex.setSpecular(0.2, 0.2, 0.2, 1);
    this.connectionTex.setShininess(10);
    this.connectionTex.loadTexture('images/heli_connection.jpg');

    // Tail texture
    this.tailTex = new CGFappearance(this.scene);
    this.tailTex.setDiffuse(0.5, 0.5, 0.5, 1);
    this.tailTex.setSpecular(0.2, 0.2, 0.2, 1);
    this.tailTex.setShininess(10);
    this.tailTex.loadTexture('images/heli_tail.jpg');

    // Bucket texture
    this.bucketTex = new CGFappearance(this.scene);
    this.bucketTex.setDiffuse(0.5, 0.5, 0.5, 1);
    this.bucketTex.setSpecular(0.2, 0.2, 0.2, 1);
    this.bucketTex.setShininess(10);
    this.bucketTex.loadTexture('images/heli_tail.jpg');

    // Empty Bucket cap textures
    this.bucketCapTexEmpty = new CGFappearance(this.scene);
    this.bucketCapTexEmpty.setDiffuse(0.5, 0.5, 0.5, 1);
    this.bucketCapTexEmpty.setSpecular(0.2, 0.2, 0.2, 1);
    this.bucketCapTexEmpty.setShininess(10);
    this.bucketCapTexEmpty.loadTexture('images/inside_bucket.jpg');

    // Full Bucket cap textures
    this.bucketCapTexFull = new CGFappearance(this.scene);
    this.bucketCapTexFull.setDiffuse(0.5, 0.5, 0.5, 1);
    this.bucketCapTexFull.setSpecular(0.2, 0.2, 0.2, 1);
    this.bucketCapTexFull.setShininess(10);
    this.bucketCapTexFull.loadTexture('images/water.jpg');

    // Bucket cable texture
    this.bucketCableTex = new CGFappearance(this.scene);
    this.bucketCableTex.setDiffuse(0.5, 0.5, 0.5, 1);
    this.bucketCableTex.setSpecular(0.2, 0.2, 0.2, 1);
    this.bucketCableTex.setShininess(10);
    this.bucketCableTex.loadTexture('images/cable.jpg');

  }

  turn(v) {
    // Prevent turning if not flying
    if (this.heliState != HeliState.FLYING) {
      return;
    }

    // Update orientation angle
    this.orientation += v;
    
    // Calculate current speed magnitude
    let speed = Math.sqrt(this.velocity.x ** 2 + this.velocity.z ** 2);
    
    // Calculate the forward direction vector based on precious orientation
    let forwardVector = {
      x: Math.cos(this.orientation - v),
      z: -Math.sin(this.orientation - v)
    };

    // Determine if helicopter is moving forward or backward    
    let currentDirection = this.velocity.x * forwardVector.x + this.velocity.z * forwardVector.z;
    let isMovingForward = currentDirection >= 0;
    
    // If the helicopter is moving backward, reverse the speed
    if (!isMovingForward) speed = -speed;
    
    // Update velocity based on new orientation
    this.velocity.x = speed * Math.cos(this.orientation);
    this.velocity.z = -speed * Math.sin(this.orientation);
  }
  
  accelerate(v) {
    // Prevent acceleration if not flying
    if (this.heliState != HeliState.FLYING) return;

    // Calculate direction vector based on current orientation
    const dirX = Math.cos(this.orientation);
    const dirZ = -Math.sin(this.orientation);

    // Predict new velocity if we apply acceleration v
    const newVx = this.velocity.x - v * dirX;
    const newVz = this.velocity.z - v * dirZ;

    // Predict new speed if we apply acceleration v
    const newSpeed = Math.sqrt(newVx ** 2 + newVz ** 2);

    // Do not allow speed to exceed maxSpeed
    if (newSpeed > this.maxSpeed) return;

    // Update velocity based on acceleration
    if (v == 0) {
      // If no acceleration, apply a deceleration factor to slow down
      this.velocity.x = this.velocity.x - this.velocity.x * 0.05;
      this.velocity.z = this.velocity.z - this.velocity.z * 0.05;
    }
    else {
      // Aply acceleration in the direction of the current orientation
      this.velocity.x = newVx;
      this.velocity.z = newVz;
    }

    // Update tilt based on acceleration direction
    this.tilt = v > 0 ? Math.PI / 18 : (v < 0 ? -Math.PI / 18 : 0);
  }

  /**
   * Automatically returns the helicopter to the heliport
   */
  returnToHeliport() {
    const heliportX = 100;
    const heliportZ = -100;
    const heliportY = 48;
    
    // If already at heliport, start landing
    if (Math.abs(this.x - heliportX) < 1 && Math.abs(this.z - heliportZ) < 1) {
      this.targetAltitude = heliportY;
      this.heliState = HeliState.LANDING;
      this.velocity = { x: 0, z: 0 };
      this.tilt = 0;
      return;
    }

    // Set cruise altitude for return flight    
    this.targetAltitude = this.cruiseAltitude;
    
    // Calculate diretion to heliport
    const dx = heliportX - this.x;
    const dz = heliportZ - this.z;
    
    // Calculate distance to heliport
    const distance = Math.sqrt(dx * dx + dz * dz);
    
    // Normalize direction vector
    const dirX = dx / distance;
    const dirZ = dz / distance;
    
    // Calculate target angle based on direction vector
    const targetAngle = Math.atan2(dirZ, -dirX);
    
    // Update orientation to face heliport
    this.orientation = targetAngle;

    // Set velocity towards heliport at max speed    
    this.velocity.x = this.maxSpeed * dirX;
    this.velocity.z = this.maxSpeed * dirZ;
    
    // Set helicopter state to returning
    this.heliState = HeliState.RETURNING;
  }

  /**
   * Updates helicopter physics, position and state
   */
  update(deltaTime) {
    // Convert miliseconds to seconds for deltaTime
    let dt = deltaTime / 1000;

    // Heliport coordinates
    const heliportX = 100;
    const heliportZ = -100;
    const heliportY = 48;
    
    // Update helicopter position based on velocity
    if (this.heliState == HeliState.FLYING || this.heliState == HeliState.RETURNING) {
      this.x += this.velocity.x * dt;
      this.z += this.velocity.z * dt;
      
      // If returning, and close to heliport, start landing
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

    // Fill bucket when at water collection height
    if (this.heliState == HeliState.REFFILLING && Math.abs(this.y - this.refillHeight) < 0.1) {
      this.bucketIsFull = true;
    }

    // Smoothly adjust altitude towards target altitude
    if (this.y < this.targetAltitude) {
      this.y = Math.min(this.y + this.altitudeSpeed * dt, this.targetAltitude);
    } else if (this.y > this.targetAltitude) {
      this.y = Math.max(this.y - this.altitudeSpeed * dt, this.targetAltitude);
    }
  
    // Update helicopter state based on altitude
    if (this.y == this.cruiseAltitude && 
        (this.heliState != HeliState.LANDING && this.heliState != HeliState.RETURNING)) {
      this.heliState = HeliState.FLYING;
    } else if (this.y == heliportY && this.heliState == HeliState.LANDING) {
      this.heliState = HeliState.LANDED;
    }

    // Update rotor animation
    this.updateRotorRotation(dt);
  }

  /**
   * Updates the rotor rotation speed based on the helicopter state 
  */
  updateRotorRotation(dt) {
    // Target rotor speed based on helicopter state
    let targetSpeed = 0;
    
    switch (this.heliState) {
      case HeliState.LANDED:
        targetSpeed = 0;  // Rotors stopped when landed
        break;
      case HeliState.TAKING_OFF:
        // Gradually increase rotor speed during takeoff
        const takeoffPercentage = (this.y - 48) / (this.cruiseAltitude - 48);
        targetSpeed = this.maxRotorSpeed * takeoffPercentage;
        break;
      case HeliState.FLYING:
      case HeliState.RETURNING:
      case HeliState.REFFILLING:
        targetSpeed = this.maxRotorSpeed; // Full speed when flying
        break;
      case HeliState.LANDING:
        // Gradually decrease rotor speed during landing
        const landingPercentage = (this.y - 48) / (this.cruiseAltitude - 48);
        targetSpeed = this.maxRotorSpeed * landingPercentage;
        break;
    }
    
    // Smoothly adjust current rotor speed towards target speed
    const speedDiff = targetSpeed - this.currentRotorSpeed;
    if (Math.abs(speedDiff) < 0.01) {
      this.currentRotorSpeed = targetSpeed;
    } else {
      this.currentRotorSpeed += speedDiff * dt * 2;
    }
    
    // Update rotor angles based on current speed
    this.mainRotorAngle += this.currentRotorSpeed * dt * 10;
    this.tailRotorAngle += this.currentRotorSpeed * dt * 15;
    
    // Keep angles within 0 to 2π range
    this.mainRotorAngle %= Math.PI * 2;
    this.tailRotorAngle %= Math.PI * 2;
  }

  /**
   * Initiates the collection of water procedure when over lake
   */
  collectWater() {
    // Check if helicopter is in a state that allows water collection
    if (Math.abs(this.y - this.refillHeight) < 0.1) {
      this.heliState = HeliState.REFFILLING;
      this.bucketIsFull = true;
      this.velocity = { x: 0, z: 0 };
      this.tilt = 0;
    }
    else {
      // If not at refill height, set target altitude to refill height
      this.heliState = HeliState.REFFILLING;
      this.targetAltitude = this.refillHeight;
      this.velocity = { x: 0, z: 0 };
      this.tilt = 0;
    }    
  }

  display() {
    this.scene.pushMatrix();

      // Position and orient the helicopter
      this.scene.translate(this.x, this.y, this.z);
      this.scene.rotate(this.orientation, 0, 1, 0);
      this.scene.rotate(this.tilt, 0, 0, 1);

      // Draw the water bucket if the helicopter is flying, refilling or returning
      if (this.heliState == HeliState.FLYING || this.heliState == HeliState.REFFILLING || this.heliState == HeliState.RETURNING) {
        // Draw the bucket cable
        this.scene.pushMatrix();
          this.scene.translate(0, -this.bucketCableLength + this.landingGearHeight, 0);
          this.scene.rotate(-Math.PI / 2, 1, 0, 0);
          this.bucketCableTex.apply();
          this.bucketCable.display();
        this.scene.popMatrix();

        // Draw the bucket
        this.scene.pushMatrix();
          this.scene.translate(0, -this.bucketCableLength -this.bucketHeight + this.landingGearHeight, 0);
          this.scene.rotate(-Math.PI / 2, 1, 0, 0);

          // Apply the bucket cap texture based on whether it's full or empty
          if (this.bucketIsFull) {
            this.bucketCapTexFull.apply();
          }
          else {
            this.bucketCapTexEmpty.apply();
          }
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

      // Draw the main rotor (perpendicular)
      this.scene.pushMatrix();
        this.scene.translate(0, this.landingGearHeight + this.bodyHeight + 1, 0);
        this.scene.rotate(this.mainRotorAngle + Math.PI/2, 0, 1, 0);
        this.rotorTex.apply();
        this.mainRotor.display();
      this.scene.popMatrix();

      // Draw the main rotor extension
      this.scene.pushMatrix();
        this.scene.translate(0, this.landingGearHeight + this.bodyHeight + 1, 0);
        this.scene.rotate(Math.PI / 2, 1, 0, 0);
        this.connectionTex.apply();
        this.mainRotorExtension.display();
      this.scene.popMatrix();

      // Draw the main rotor connection
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

      // Draw the upper tail fin
      this.scene.pushMatrix();
        this.scene.translate(this.bodyLength + this.tailLength, this.landingGearHeight, 0);
        this.scene.rotate(Math.PI / 3, 0, 0, 1);
        this.scene.rotate(Math.PI / 2, 0, 1, 0);
        this.scene.scale(0.5, 0.5, 0.6);
        this.tailTex.apply();
        this.tail.display();
      this.scene.popMatrix();

      // Draw the lower tail fin
      this.scene.pushMatrix();
        this.scene.translate(this.bodyLength + this.tailLength, this.landingGearHeight, 0);
        this.scene.rotate(-Math.PI / 3, 0, 0, 1);
        this.scene.rotate(Math.PI / 2, 0, 1, 0);
        this.scene.scale(0.5, 0.5, 0.6);
        this.tailTex.apply();
        this.tail.display();
      this.scene.popMatrix();

      // Draw the tail connection
      this.scene.pushMatrix();
        this.scene.translate(this.bodyLength + this.tailLength, this.landingGearHeight, 0);
        this.tailConnection.display();
      this.scene.popMatrix();

      // Draw the tail rotor extension 
      this.scene.pushMatrix();
        this.scene.translate(this.bodyLength + this.tailLength, this.landingGearHeight, 0);
        this.connectionTex.apply();
        this.tailRotorExtension.display();
      this.scene.popMatrix();

      // Draw the tail rotor connection
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

      // Draw the tail rotor (perpendicular)
      this.scene.pushMatrix();
        this.scene.translate(this.bodyLength + this.tailLength, this.landingGearHeight, this.tailLength/3);
        this.scene.rotate(this.tailRotorAngle + Math.PI/2, 0, 0, 1);
        this.rotorTex.apply();
        this.tailRotor.display();
      this.scene.popMatrix();

      // Draw the landing gear struts
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
        this.scene.translate(0, this.landingGearHeight - this.bodyHeight/2, this.bodyWidth/2);377 
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
