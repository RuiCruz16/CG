import { CGFobject } from '../lib/CGF.js';

/**
 * MyEllipsoid
 * @constructor
 * @param scene - Reference to MyScene object
 * @param slices - Number of divisions around the Y axis (circular divisions)
 * @param stacks - Number of divisions along the Y axis (vertical divisions)
 * @param radiusX - Radius along the X-axis (horizontal stretch)
 * @param radiusY - Radius along the Y-axis (vertical stretch)
 * @param radiusZ - Radius along the Z-axis (depth stretch)
 */
export class MyEllipsoid extends CGFobject {
    constructor(scene, slices, stacks, radiusX, radiusY, radiusZ) {
        super(scene);
        this.slices = slices;
        this.stacks = stacks;
        this.radiusX = radiusX;
        this.radiusY = radiusY;
        this.radiusZ = radiusZ;
        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];
    
        var alphaAng = 2 * Math.PI / this.slices;  // Angle step around the circle
        var betaAng = Math.PI / this.stacks;      // Angle step from top to bottom
    
        // Loop through stacks and slices to generate vertices and normals
        for (var i = 0; i <= this.stacks; i++) {
            var theta = i * betaAng; // Stack angle from 0 to PI
            var sinTheta = Math.sin(theta);
            var cosTheta = Math.cos(theta);
    
            for (var j = 0; j <= this.slices; j++) {
                var phi = j * alphaAng; // Slice angle
                var sinPhi = Math.sin(phi);
                var cosPhi = Math.cos(phi);
    
                var x = this.radiusX * sinTheta * cosPhi;
                var y = this.radiusY * sinTheta * sinPhi;
                var z = this.radiusZ * cosTheta;
    
                var nx = (sinTheta * cosPhi) / this.radiusX;
                var ny = (sinTheta * sinPhi) / this.radiusY;
                var nz = cosTheta / this.radiusZ;
                
                // Normalize the normal vector
                var length = Math.sqrt(nx*nx + ny*ny + nz*nz);
                nx /= length;
                ny /= length;
                nz /= length;
    
                this.vertices.push(x, y, z);
                this.normals.push(nx, ny, nz);
                this.texCoords.push(j / this.slices, i / this.stacks);
    
                if (i < this.stacks && j < this.slices) {
                    var current = i * (this.slices + 1) + j;
                    var next = current + this.slices + 1;
    
                    this.indices.push(current, next, current + 1);
                    this.indices.push(current + 1, next, next + 1);
                }
            }
        }
    
        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    display() {
        super.display();
    }
}
