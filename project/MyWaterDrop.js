import { CGFobject, CGFappearance } from '../lib/CGF.js';
import { MySphere } from './MySphere.js';

export class MyWaterDrop extends CGFobject {
    constructor(scene, x, y, z) {
        super(scene);
        this.scene = scene;
        
        this.x = x;
        this.y = y;
        this.z = z;
        
        this.velocity = 0;
        this.acceleration = 10;
        this.active = true;
        
        this.radius = 2;
        this.hasReachedGround = false;
        
        this.initBuffers();
    }
    
    initBuffers() {
        this.waterSphere = new MySphere(this.scene, 15, 15);
        
        this.waterMaterial = new CGFappearance(this.scene);
        this.waterMaterial.setAmbient(0.2, 0.4, 0.8, 0.8);
        this.waterMaterial.setDiffuse(0.2, 0.4, 0.8, 0.9);
        this.waterMaterial.setSpecular(0.5, 0.7, 1.0, 1.0);
        this.waterMaterial.setShininess(100);
        this.waterMaterial.loadTexture('images/water.jpg');
    }
    
    update(deltaTime) {
        if (!this.active) return;
        
        const dt = deltaTime / 1000;
        
        this.velocity += this.acceleration * dt;
        this.y -= this.velocity * dt;
        
        if (this.y < 1) {
            this.y = 0.5;
            this.hasReachedGround = true;
            
            if (this.scene.fire && this.scene.fire.isPointAboveFire(this.x, this.z)) {
                this.scene.fire.extinguish();
            }
            
            this.active = false;
        }
    }
    
    display() {
        if (!this.active) return;
        
        this.scene.pushMatrix();
            this.scene.translate(this.x, this.y, this.z);
            this.scene.scale(this.radius, this.radius, this.radius);
            this.waterMaterial.apply();
            this.waterSphere.display();
        this.scene.popMatrix();
    }
}