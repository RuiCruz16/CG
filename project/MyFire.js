import { CGFobject } from '../lib/CGF.js';
import { MyFlame } from './MyFlame.js';

export class MyFire extends CGFobject {
    constructor(scene, forestRows, forestCols, forestSpacing, density) {
        super(scene);
        this.scene = scene;
        
        this.forestRows = forestRows;
        this.forestCols = forestCols;
        this.forestSpacing = forestSpacing;
        
        this.density = density;
        this.flames = [];
        this.active = true;
        
        this.initBuffers();
    }
    
    initBuffers() {
        this.createFlames();
    }
    
    randomRange(min, max) {
        return min + Math.random() * (max - min);
    }
    
    createFlames() {
        const forestArea = this.forestRows * this.forestCols;
        const numFlames = Math.floor(forestArea * this.density);
        
        for (let i = 0; i < numFlames; i++) {
            const row = Math.floor(Math.random() * this.forestRows);
            const col = Math.floor(Math.random() * this.forestCols);
            
            const offsetX = Math.random() * 10 - 5;
            const offsetZ = Math.random() * 10 - 5;
            
            const x = row * this.forestSpacing + offsetX;
            const z = col * this.forestSpacing + offsetZ;
            
            const flameSize = this.randomRange(0.7, 1.3);
            const width = 5 * flameSize;
            const height = 10 * flameSize;
            
            this.flames.push(new MyFlame(this.scene, width, height, x, z));
        }
        
        const numLargeFlames = Math.floor(numFlames * 0.2);
        for (let i = 0; i < numLargeFlames; i++) {
            const row = Math.floor(Math.random() * this.forestRows);
            const col = Math.floor(Math.random() * this.forestCols);
            
            const offsetX = Math.random() * 10 - 5;
            const offsetZ = Math.random() * 10 - 5;
            
            const x = row * this.forestSpacing + offsetX;
            const z = col * this.forestSpacing + offsetZ;
            
            const width = this.randomRange(8, 12);
            const height = this.randomRange(15, 20);
            
            this.flames.push(new MyFlame(this.scene, width, height, x, z));
        }
    }
    
    extinguish() {
        if (this.active) {
            this.active = false;
            for (const flame of this.flames) {
                flame.extinguish();
            }
            return true;
        }
        return false;
    }
    
    isPointAboveFire(x, z) {
        for (const flame of this.flames) {
            if (flame.isPointAboveFire(x, z)) {
                return true;
            }
        }
        return false;
    }
    
    display() {
        if (!this.active) return;
        
        for (const flame of this.flames) {
            flame.display();
        }
    }
}