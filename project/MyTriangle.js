import { CGFobject } from '../lib/CGF.js';

export class MyTriangle extends CGFobject {
    constructor(scene, width, height, rotationAngle, translationZ) {
        super(scene);
        this.width = width;
        this.height = height;
        this.rotationAngle = rotationAngle;
        this.translationZ = translationZ;

        this.seed = Math.random() * 1000;

        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        // Define the vertices of the triangle
        this.vertices.push(
            -this.width / 2, 0, 0,
            this.width / 2, 0, 0,
            0, this.height, 0,
            -this.width / 2, 0, 0,
            this.width / 2, 0, 0,
            0, this.height, 0,
        );

        // Define the indices for the triangle
        this.indices.push(
            0, 1, 2,
            3, 5, 4,
        );

        // Define the normals for each vertex
        this.normals.push(
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            0, 0, -1,
            0, 0, -1,
            0, 0, -1,
        );

        // Define texture coordinates for each vertex
        this.texCoords.push(
            0, 1,
            1, 1,
            0.5, 0,
            0, 1,
            1, 1,
            0.5, 0,
        );

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