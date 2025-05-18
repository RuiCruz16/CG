import { CGFobject, CGFappearance, CGFtexture } from '../lib/CGF.js';
import { MyCone } from './MyCone.js';
import { MyTriangle } from './MyTriangle.js';

export class MyFire extends CGFobject {
    constructor(scene, width, height, x, z) {
        super(scene);
        this.scene = scene;
        
        this.width = width;
        this.height = height;

        this.active = true;

        this.flames = [];
        this.numFlames = 10;

        this.x = x;
        this.z = z;
        
        this.initBuffers();
    }
    
    initBuffers() {
        this.fire = new MyCone(this.scene, 20, 20, this.height, this.width);
        for (let i = 0; i < this.numFlames; i++) {
            this.flames[i] = new MyTriangle(this.scene, this.width, this.height-1, Math.random() * Math.PI * 2, Math.random() * this.width - 0.5);
        }

        this.initMaterials();
    }

    initMaterials() {
        // Fire texture
        this.fireTex = new CGFappearance(this.scene);
        this.fireTex.setAmbient(0.6, 0.3, 0.1, 1.0);
        this.fireTex.setDiffuse(0.9, 0.4, 0.1, 1.0);
        this.fireTex.setSpecular(1.0, 0.6, 0.2, 1.0);
        this.fireTex.setShininess(10);
        this.fireTex.loadTexture('images/fire1.jpg');
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
        this.scene.pushMatrix();
            this.scene.translate(this.x, 0, this.z);
            this.fireTex.apply();

            if (this.active) {
                this.scene.pushMatrix();
                    for (let flame of this.flames) {
                        flame.display();
                    }
                this.scene.popMatrix();
                this.fire.display();
            }
            
        this.scene.popMatrix();
    }
}