import { CGFobject, CGFshader, CGFtexture } from '../lib/CGF.js';
import { MyFlame } from './MyFlame.js';

/**
 * MyFire class
 * Creates a forest fire with multiple flame instances distributed across the forest area
 * Uses shader-based effects for realistic fire animation and appearance
 */
export class MyFire extends CGFobject {
    constructor(scene, forestRows, forestCols, forestSpacing, density) {
        super(scene);
        this.scene = scene;
        
        // Forest grid parameters (used to align fire with forest layout)
        this.forestRows = forestRows;
        this.forestCols = forestCols;
        this.forestSpacing = forestSpacing;
        
        this.density = density; // higher = more flames
        this.flames = [];
        this.active = true; // Whether the fire is currently active
        
        this.initBuffers();
        this.initShaders();

        this.timeFactor = 0;
        this.fireTexture = new CGFtexture(scene, 'images/fire.jpg'); // Fire texture
    }

    initShaders() {
        this.fireShader = new CGFshader(
            this.scene.gl,
            'shaders/fire.vert',
            'shaders/fire.frag'
        );

        this.fireShader.setUniformsValues({ uFireTexture: 0 });
    }
    
    initBuffers() {
        this.createFlames();
    }
    
    randomRange(min, max) {
        return min + Math.random() * (max - min);
    }
    
    createFlames() {
        // Calculate total number of flames based on forest area and density
        const forestArea = this.forestRows * this.forestCols;
        const numFlames = Math.floor(forestArea * this.density);
        
        // Create regular-sized flames
        for (let i = 0; i < numFlames; i++) {
            // Choose a random position within the forest grid
            const row = Math.floor(Math.random() * this.forestRows);
            const col = Math.floor(Math.random() * this.forestCols);
            
            const offsetX = Math.random() * 10 - 5;
            const offsetZ = Math.random() * 10 - 5;
            
            // Final position
            const x = row * this.forestSpacing + offsetX;
            const z = col * this.forestSpacing + offsetZ;
            
            // Randomize flame size for visual variety
            const flameSize = this.randomRange(0.7, 1.3);
            const width = 5 * flameSize;
            const height = 10 * flameSize;
            
            this.flames.push(new MyFlame(this.scene, width, height, x, z));
        }
        
        const numLargeFlames = Math.floor(numFlames * 0.2); // larger flames
        for (let i = 0; i < numLargeFlames; i++) {
            // Same positioning logic as regular flames
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
    
    // Extinguish the fire (used when water is dropped on the fire)
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

    // Check if a point is above any part of the fire (used for water drop collision detection)
    isPointAboveFire(x, z) {
        for (const flame of this.flames) {
            if (flame.isPointAboveFire(x, z)) {
                return true;
            }
        }
        return false;
    }

    // Update animation state for the fire
    update(t) {
        if (!this.active) return;
        
        this.timeFactor = (t % 10000) / 1000; // Range 0-10 repeating
        
        if (this.fireShader) {
            this.fireShader.setUniformsValues({ 
                timeFactor: this.timeFactor
            });
        }
    }
    
    display() {
        if (!this.active) return;
    
        this.scene.setActiveShader(this.fireShader);
        this.fireShader.setUniformsValues({ timeFactor: this.timeFactor });
        this.fireTexture.bind(0);
    
        for (const flame of this.flames) {
            flame.display();
        }
    
        this.scene.setActiveShader(this.scene.defaultShader);
    }
}