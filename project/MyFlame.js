import { CGFobject, CGFappearance } from '../lib/CGF.js';
import { MyTriangle } from './MyTriangle.js';

export class MyFlame extends CGFobject {
    constructor(scene, width, height, x, z) {
        super(scene);
        this.scene = scene;
        
        this.width = width;
        this.height = height;
        this.active = true;
        this.x = x;
        this.z = z;
        
        this.outerFlames = [];
        this.middleFlames = [];
        this.innerFlames = [];
        
        this.initBuffers();
    }
    
    initBuffers() {
        this.initMaterials();
        this.createFlames();
    }

    initMaterials() {
        this.fireTex = new CGFappearance(this.scene);
        this.fireTex.setAmbient(0.6, 0.3, 0.1, 1.0);
        this.fireTex.setDiffuse(0.9, 0.4, 0.1, 1.0);
        this.fireTex.setSpecular(1.0, 0.6, 0.2, 1.0);
        this.fireTex.setShininess(10);
    }
    
    randomRange(min, max) {
        return min + Math.random() * (max - min);
    }
    
    createFlames() {
        const numOuterFlames = 8;
        for (let i = 0; i < numOuterFlames; i++) {
            const angle = (i / numOuterFlames) * Math.PI * 2 + this.randomRange(-0.2, 0.2);
            const flameWidth = this.width * this.randomRange(0.7, 0.9);
            const flameHeight = this.height * this.randomRange(0.5, 0.7);
            const offset = this.width * 0.4;
            
            this.outerFlames.push(new MyTriangle(this.scene, flameWidth, flameHeight, angle, offset));
        }
        
        const numMiddleFlames = 6;
        for (let i = 0; i < numMiddleFlames; i++) {
            const angle = (i / numMiddleFlames) * Math.PI * 2 + this.randomRange(-0.3, 0.3);
            const flameWidth = this.width * this.randomRange(0.5, 0.7);
            const flameHeight = this.height * this.randomRange(0.7, 0.9);
            const offset = this.width * 0.2;
            
            this.middleFlames.push(new MyTriangle(this.scene, flameWidth, flameHeight, angle, offset));
        }
        
        const numInnerFlames = 4;
        for (let i = 0; i < numInnerFlames; i++) {
            const angle = (i / numInnerFlames) * Math.PI * 2 + this.randomRange(-0.4, 0.4);
            const flameWidth = this.width * this.randomRange(0.3, 0.5);
            const flameHeight = this.height * this.randomRange(0.9, 1.1);
            const offset = this.width * 0.1;
            
            this.innerFlames.push(new MyTriangle(this.scene, flameWidth, flameHeight, angle, offset));
        }
        
        this.centralFlame = new MyTriangle(
            this.scene, 
            this.width * 0.3,
            this.height * 1.2,
            0,
            0
        );
    }
    
    extinguish() {
        if (this.active) {
            this.active = false;
            return true;
        }
        return false;
    }

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