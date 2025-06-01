import { CGFobject, CGFappearance } from '../lib/CGF.js';
import { MyTriangle } from './MyTriangle.js';

/**
 * MyFlame class
 * Represents an individual flame in the fire system
 * Uses multiple triangular planes arranged in a circular pattern to create a 3D flame effect
 */
export class MyFlame extends CGFobject {
    constructor(scene, width, height, x, z) {
        super(scene);
        this.scene = scene;
        
        this.width = width;
        this.height = height;
        this.active = true; // Whether the flame is currently burning
        this.x = x;
        this.z = z;
        
        this.outerFlames = [];
        this.middleFlames = [];
        this.innerFlames = [];
        
        this.initBuffers();
    }
    
    initBuffers() {
        this.createFlames();
    }
    
    randomRange(min, max) {
        return min + Math.random() * (max - min);
    }
    
    createFlames() {
        // Create outer flame layer - wider, shorter triangles spread in a circle
        const numOuterFlames = 8;
        for (let i = 0; i < numOuterFlames; i++) {
            // Calculate angle with some randomization
            const angle = (i / numOuterFlames) * Math.PI * 2 + this.randomRange(-0.2, 0.2);
            
            // Randomize dimensions for natural appearance
            const flameWidth = this.width * this.randomRange(0.7, 0.9);
            const flameHeight = this.height * this.randomRange(0.5, 0.7);
            const offset = this.width * 0.4; // Offset from center
            
            this.outerFlames.push(new MyTriangle(this.scene, flameWidth, flameHeight, angle, offset));
        }
        
        // Create middle flame layer - medium triangles
        const numMiddleFlames = 6;
        for (let i = 0; i < numMiddleFlames; i++) {
            const angle = (i / numMiddleFlames) * Math.PI * 2 + this.randomRange(-0.3, 0.3);
            const flameWidth = this.width * this.randomRange(0.5, 0.7);
            const flameHeight = this.height * this.randomRange(0.7, 0.9);
            const offset = this.width * 0.2; // Less offset (closer to center)
            
            this.middleFlames.push(new MyTriangle(this.scene, flameWidth, flameHeight, angle, offset));
        }
        
        // Create inner flame layer - narrower, taller triangles
        const numInnerFlames = 4;
        for (let i = 0; i < numInnerFlames; i++) {
            const angle = (i / numInnerFlames) * Math.PI * 2 + this.randomRange(-0.4, 0.4);
            const flameWidth = this.width * this.randomRange(0.3, 0.5);
            const flameHeight = this.height * this.randomRange(0.9, 1.1);
            const offset = this.width * 0.1; // Minimal offset (near center)
            
            this.innerFlames.push(new MyTriangle(this.scene, flameWidth, flameHeight, angle, offset));
        }
        
        // Create a central flame - tallest and centered
        this.centralFlame = new MyTriangle(
            this.scene, 
            this.width * 0.3,
            this.height * 1.2,
            0,
            0
        );
    }
    
    // Extinguish the flame when the water is dropped
    extinguish() {
        if (this.active) {
            this.active = false;
            return true;
        }
        return false;
    }

    // Check if a point is above this flame (used for collision detection with water drops)
    isPointAboveFire(x, z) {
        return (x >= this.x - 10 && x <= this.x + 10 &&
                z >= this.z - 10 && z <= this.z + 10);
    }
    
    display() {
        if (!this.active) return;
        
        this.scene.pushMatrix();
            this.scene.translate(this.x, 0, this.z);
            
            for (const flame of this.outerFlames) {
                flame.display();
            }
            
            for (const flame of this.middleFlames) {
                flame.display();
            }
            
            for (const flame of this.innerFlames) {
                flame.display();
            }
            
            this.centralFlame.display();
        
        this.scene.popMatrix();
    }
}