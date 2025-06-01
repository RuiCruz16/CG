import { CGFobject } from '../lib/CGF.js';

/**
 * MyTriangle class
 * Creates a subdivided triangle that can be used for flame effects
 * The triangular shape is divided into horizontal segments to allow 
 * for wave-like animation effects through shaders
 */
export class MyTriangle extends CGFobject {
    constructor(scene, width, height, rotationAngle, translationZ) {
        super(scene);
        this.width = width;
        this.height = height;
        this.rotationAngle = rotationAngle; // Rotation around Y axis
        this.translationZ = translationZ; // Translation along Z axis
        this.divisions = 5; // Number of horizontal subdivisions
        this.seed = Math.random() * 1000; // Random seed for shader variation

        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        const subdivisions = this.divisions;
        
        let frontPoints = [];
        let backPoints = [];

        // Bottom-left vertex of the base
        frontPoints.push({
            x: -this.width / 2,
            y: 0,
            z: 0,
            s: 0, // Horizontal coordinate of the texture
            t: 1 // Vertical coordinate of the texture
        });
        
        // Bottom-right vertex of the base
        frontPoints.push({
            x: this.width / 2,
            y: 0,
            z: 0,
            s: 1,
            t: 1
        });

        for (let i = 1; i < subdivisions; i++) {
            const ratio = i / subdivisions;
            const currentHeight = this.height * ratio; // Current height of this row
            
            // Width decreases as we go up
            const currentWidth = this.width * (1 - ratio);
            
            // Left point of current row
            frontPoints.push({
                x: -currentWidth / 2,
                y: currentHeight,
                z: 0,
                s: 0.5 - (0.5 * (1 - ratio)),
                t: 1 - ratio
            });
            
            // Right point of current row
            frontPoints.push({
                x: currentWidth / 2,
                y: currentHeight,
                z: 0,
                s: 0.5 + (0.5 * (1 - ratio)),
                t: 1 - ratio
            });
        }

        // Top of the triangle
        frontPoints.push({
            x: 0,
            y: this.height,
            z: 0,
            s: 0.5,
            t: 0
        });

        // Create back points by copying front points (inverted normals for the back face)
        backPoints = frontPoints.map(point => ({
            x: point.x,
            y: point.y,
            z: point.z,
            s: point.s,
            t: point.t
        }));

        for (let i = 0; i < frontPoints.length; i++) {
            this.vertices.push(frontPoints[i].x, frontPoints[i].y, frontPoints[i].z);
            this.normals.push(0, 0, 1); // Normal pointing forward
            this.texCoords.push(frontPoints[i].s, frontPoints[i].t);
        }
        
        for (let i = 0; i < backPoints.length; i++) {
            this.vertices.push(backPoints[i].x, backPoints[i].y, backPoints[i].z);
            this.normals.push(0, 0, -1); // Normal pointing backward
            this.texCoords.push(backPoints[i].s, backPoints[i].t);
        }

        const frontOffset = 0;
        
        // Triangles for the front face
        for (let row = 0; row < subdivisions; row++) {
            if (row === 0) {
                this.indices.push(
                    frontOffset + 0, // Bottom left
                    frontOffset + 1, // Bottom right
                    frontOffset + 2  // First row left
                );
                this.indices.push(
                    frontOffset + 1, // Bottom right
                    frontOffset + 3, // First row right
                    frontOffset + 2 // First row left
                );
            } else if (row === subdivisions - 1) {
                const lastRowStart = frontOffset + 2 * row;
                this.indices.push(
                    lastRowStart, // Last row left
                    lastRowStart + 1, // Last row right
                    frontPoints.length - 1 // Top of the triangle
                );
            } else {
                const rowStart = frontOffset + 2 * row;
                const nextRowStart = rowStart + 2;
                
                // Left triangle
                this.indices.push(
                    rowStart, // Current row left
                    rowStart + 1, // Current row right
                    nextRowStart // Next row left
                );
                // Right triangle
                this.indices.push(
                    rowStart + 1, // Current row right
                    nextRowStart + 1, // Next row right
                    nextRowStart // Next row right
                );
            }
        }
        
        const backOffset = frontPoints.length;
        
        // Triangles for the back face (inverted order)
        for (let row = 0; row < subdivisions; row++) {
            if (row === 0) {
                this.indices.push(
                    backOffset + 0, // Bottom left
                    backOffset + 2, // First row left
                    backOffset + 1 // Bottom right
                );
                this.indices.push(
                    backOffset + 1, // Bottom right
                    backOffset + 2, // First row left
                    backOffset + 3 // First row right
                );
            } else if (row === subdivisions - 1) {
                const lastRowStart = backOffset + 2 * row;
                this.indices.push(
                    lastRowStart, // Last row left
                    backPoints.length - 1 + backOffset, // Top of the triangle
                    lastRowStart + 1 // Last row right
                );
            } else {
                const rowStart = backOffset + 2 * row;
                const nextRowStart = rowStart + 2;
                
                // Left triangle
                this.indices.push(
                    rowStart, // Current row left
                    nextRowStart, // Next row left
                    rowStart + 1 // Current row right
                );
                // Right triangle
                this.indices.push(
                    rowStart + 1, // Current row right
                    nextRowStart, // Next row left
                    nextRowStart + 1 // Next row right
                );
            }
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    display() {
        if (this.scene.activeShader && this.scene.activeShader.setUniformsValues) {
            try {
                this.scene.activeShader.setUniformsValues({
                    vertexSeed: this.seed
                });
            } catch (e) {
            }
        }

        this.scene.pushMatrix();
            this.scene.rotate(this.rotationAngle, 0, 1, 0);
            this.scene.translate(0, 0, this.translationZ);
            super.display();
        this.scene.popMatrix();
    }
}
