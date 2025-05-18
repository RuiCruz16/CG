import { CGFobject, CGFappearance, CGFtexture } from '../lib/CGF.js';

export class MyLake extends CGFobject {
    constructor(scene, x, z, size) {
        super(scene);
        this.scene = scene;
        
        this.x = x;
        this.z = z;
        this.size = size || 30;  // Default lake size
        
        this.initMaterials();
        this.initBuffers();
    }
    
    initMaterials() {
        // Water texture
        this.waterTex = new CGFappearance(this.scene);
        this.waterTex.setAmbient(0.2, 0.4, 0.8, 1.0);
        this.waterTex.setDiffuse(0.2, 0.4, 0.8, 1.0);
        this.waterTex.setSpecular(0.8, 0.8, 0.8, 1.0);
        this.waterTex.setShininess(120);
        this.waterTex.loadTexture('images/water.jpg');
    }
    
    initBuffers() {
        this.vertices = [
            -this.size/2, 0.1, -this.size/2,  // Slightly raised above ground level
            this.size/2, 0.1, -this.size/2,
            this.size/2, 0.1, this.size/2,
            -this.size/2, 0.1, this.size/2
        ];
        
        this.indices = [
            0, 2, 1,
            0, 3, 2
        ];
        
        this.normals = [
            0, 1, 0,
            0, 1, 0,
            0, 1, 0,
            0, 1, 0
        ];
        
        this.texCoords = [
            0, 0,
            4, 0,  // Repeat the texture multiple times
            4, 4,
            0, 4
        ];
        
        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
    
    display() {
        this.scene.pushMatrix();
        
            this.scene.translate(this.x, 0, this.z);
            
            this.waterTex.apply();
            super.display();
        
        this.scene.popMatrix();
    }
    
    // Check if a point is above the lake (with some margin)
    isPointAboveLake(x, z, margin = 5) {
        const halfSize = this.size/2 + margin;
        return (
            x >= this.x - halfSize && 
            x <= this.x + halfSize && 
            z >= this.z - halfSize && 
            z <= this.z + halfSize
        );
    }
}