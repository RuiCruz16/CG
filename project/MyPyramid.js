import { CGFobject } from '../lib/CGF.js';

/**
 * MyPyramid
 * Creates a parameterized pyramid with a polygonal base and a single apex
 * Used in the project as the crown of the trees
 */
export class MyPyramid extends CGFobject {
    constructor(scene, slices, height, baseSize) {
        super(scene);
        this.slices = slices; // Number of triangular faces
        this.height = height; // Vertical height
        this.baseSize = baseSize; // Radius of the base
        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        var ang = 0;
        var alphaAng = 2 * Math.PI / this.slices; // Angular step between slices

        // Lateral faces of the pyramid (triangles from base to apex)
        for (var i = 0; i < this.slices; i++) {
            var sa = Math.sin(ang);
            var ca = Math.cos(ang);
            var saNext = Math.sin(ang + alphaAng);
            var caNext = Math.cos(ang + alphaAng);

            this.vertices.push(0, this.height, 0);  // Apex
            this.vertices.push(ca * this.baseSize, 0, -sa * this.baseSize);  // First base point
            this.vertices.push(caNext * this.baseSize, 0, -saNext * this.baseSize);  // Next base point

            this.texCoords.push(0.5, 0.0);  // Apex
            this.texCoords.push(0.0, 1.0);  // Left bottom of texture
            this.texCoords.push(1.0, 1.0);  // Right bottom of texture

            // Normal vector calculation (cross product approach) for the face
            var normal = [
                saNext - sa,
                ca * saNext - ca * sa,
                caNext - ca
            ];

            // Normalize the vector
            var nsize = Math.sqrt(normal[0] ** 2 + normal[1] ** 2 + normal[2] ** 2);
            normal[0] /= nsize;
            normal[1] /= nsize;
            normal[2] /= nsize;

            // Apply the normal to all three vertices of this face
            this.normals.push(...normal);
            this.normals.push(...normal);
            this.normals.push(...normal);

            this.indices.push(3 * i, 3 * i + 1, 3 * i + 2);

            ang += alphaAng;
        }

        // Reset angle for the base plane
        ang = 0;

        // Add a plane to the base of the pyramid
        for (var i = 0; i < this.slices; i++) {
            var sa = Math.sin(ang);
            var ca = Math.cos(ang);
            var saNext = Math.sin(ang + alphaAng);
            var caNext = Math.cos(ang + alphaAng);

            // Base vertices
            this.vertices.push(ca * this.baseSize, 0, -sa * this.baseSize);  // Base point 1
            this.vertices.push(caNext * this.baseSize, 0, -saNext * this.baseSize);  // Base point 2
            this.vertices.push(0, 0, 0);  // Center of the base

            this.texCoords.push((ca + 1) / 2, (sa + 1) / 2);  // Base point 1 texture coordinate
            this.texCoords.push((caNext + 1) / 2, (saNext + 1) / 2);  // Base point 2 texture coordinate
            this.texCoords.push(0.5, 0.5);  // Center of the base texture coordinate

            this.normals.push(0, -1, 0);
            this.normals.push(0, -1, 0);
            this.normals.push(0, -1, 0);

            this.indices.push(3 * this.slices + 3 * i, 3 * this.slices + 3 * i + 2, 3 * this.slices + 3 * i + 1);

            ang += alphaAng;
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}
