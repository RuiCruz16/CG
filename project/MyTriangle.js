import { CGFobject } from '../lib/CGF.js';

export class MyTriangle extends CGFobject {
    constructor(scene, width, height, rotationAngle, translationZ) {
        super(scene);
        this.width = width;
        this.height = height;
        this.rotationAngle = rotationAngle;
        this.translationZ = translationZ;
        this.divisions = 5;
        this.seed = Math.random() * 1000;

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

        frontPoints.push({
            x: -this.width / 2,
            y: 0,
            z: 0,
            s: 0,
            t: 1
        });
        
        frontPoints.push({
            x: this.width / 2,
            y: 0,
            z: 0,
            s: 1,
            t: 1
        });

        for (let i = 1; i < subdivisions; i++) {
            const ratio = i / subdivisions;
            const currentHeight = this.height * ratio;
            
            const currentWidth = this.width * (1 - ratio);
            
            frontPoints.push({
                x: -currentWidth / 2,
                y: currentHeight,
                z: 0,
                s: 0.5 - (0.5 * (1 - ratio)),
                t: 1 - ratio
            });
            
            frontPoints.push({
                x: currentWidth / 2,
                y: currentHeight,
                z: 0,
                s: 0.5 + (0.5 * (1 - ratio)),
                t: 1 - ratio
            });
        }

        frontPoints.push({
            x: 0,
            y: this.height,
            z: 0,
            s: 0.5,
            t: 0
        });

        backPoints = frontPoints.map(point => ({
            x: point.x,
            y: point.y,
            z: point.z,
            s: point.s,
            t: point.t
        }));

        for (let i = 0; i < frontPoints.length; i++) {
            this.vertices.push(frontPoints[i].x, frontPoints[i].y, frontPoints[i].z);
            this.normals.push(0, 0, 1);
            this.texCoords.push(frontPoints[i].s, frontPoints[i].t);
        }
        
        for (let i = 0; i < backPoints.length; i++) {
            this.vertices.push(backPoints[i].x, backPoints[i].y, backPoints[i].z);
            this.normals.push(0, 0, -1);
            this.texCoords.push(backPoints[i].s, backPoints[i].t);
        }

        const frontOffset = 0;
        
        for (let row = 0; row < subdivisions; row++) {
            if (row === 0) {
                this.indices.push(
                    frontOffset + 0, 
                    frontOffset + 1, 
                    frontOffset + 2
                );
                this.indices.push(
                    frontOffset + 1, 
                    frontOffset + 3, 
                    frontOffset + 2
                );
            } else if (row === subdivisions - 1) {
                const lastRowStart = frontOffset + 2 * row;
                this.indices.push(
                    lastRowStart, 
                    lastRowStart + 1, 
                    frontPoints.length - 1
                );
            } else {
                const rowStart = frontOffset + 2 * row;
                const nextRowStart = rowStart + 2;
                
                this.indices.push(
                    rowStart, 
                    rowStart + 1, 
                    nextRowStart
                );
                this.indices.push(
                    rowStart + 1, 
                    nextRowStart + 1, 
                    nextRowStart
                );
            }
        }
        
        const backOffset = frontPoints.length;
        
        for (let row = 0; row < subdivisions; row++) {
            if (row === 0) {
                this.indices.push(
                    backOffset + 0, 
                    backOffset + 2, 
                    backOffset + 1
                );
                this.indices.push(
                    backOffset + 1, 
                    backOffset + 2, 
                    backOffset + 3
                );
            } else if (row === subdivisions - 1) {
                const lastRowStart = backOffset + 2 * row;
                this.indices.push(
                    lastRowStart, 
                    backPoints.length - 1 + backOffset, 
                    lastRowStart + 1
                );
            } else {
                const rowStart = backOffset + 2 * row;
                const nextRowStart = rowStart + 2;
                
                this.indices.push(
                    rowStart, 
                    nextRowStart, 
                    rowStart + 1
                );
                this.indices.push(
                    rowStart + 1, 
                    nextRowStart, 
                    nextRowStart + 1
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
