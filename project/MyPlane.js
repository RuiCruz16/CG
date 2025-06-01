import {CGFobject} from '../lib/CGF.js';

/**
 * MyPlane
 * Creates a flat rectangular plane in the XY plane with configurable divisions and texture mapping
 */
export class MyPlane extends CGFobject {
	constructor(scene, nrDivs, minS, maxS, minT, maxT) {
		super(scene);
		// nrDivs = 1 if not provided
		nrDivs = typeof nrDivs !== 'undefined' ? nrDivs : 1;
		this.nrDivs = nrDivs;
		this.patchLength = 1.0 / nrDivs; // Size of each division square
		
		// Texture coordinate ranges with default values
		this.minS = minS || 0;
		this.maxS = maxS || 1;
		this.minT = minT || 0;
		this.maxT = maxT || 1;

		// Texture coordinate increment per division
		this.q = (this.maxS - this.minS) / this.nrDivs; // S increment
		this.w = (this.maxT - this.minT) / this.nrDivs; // T increment
		this.initBuffers();
	}
	initBuffers() {
		// Generate vertices, normals, and texCoords
		this.vertices = [];
		this.normals = [];
		this.texCoords = [];

		// Start from top-left corner (y = 0.5, x = -0.5)
		var yCoord = 0.5;

		for (var j = 0; j <= this.nrDivs; j++) {
			var xCoord = -0.5;
			for (var i = 0; i <= this.nrDivs; i++) {
				this.vertices.push(xCoord, yCoord, 0);
				this.normals.push(0, 0, 1);
				this.texCoords.push(this.minS + i * this.q, this.minT + j * this.w);
				xCoord += this.patchLength;
			}
			yCoord -= this.patchLength;
		}

		// Generating indices
		this.indices = [];

		var ind = 0; // Current vertex index

		// Create triangle strips row by row
		for (var j = 0; j < this.nrDivs; j++) {
			for (var i = 0; i <= this.nrDivs; i++) {
				this.indices.push(ind); // Current row vertex
				this.indices.push(ind + this.nrDivs + 1); // Vertex below (next row)
				ind++;
			}
			if (j + 1 < this.nrDivs) {
				this.indices.push(ind + this.nrDivs); // First vertex of next strip
				this.indices.push(ind); // Last vertex of current strip
			}
		}
		this.primitiveType = this.scene.gl.TRIANGLE_STRIP;
		this.initGLBuffers();
	}

	setFillMode() { 
		this.primitiveType=this.scene.gl.TRIANGLE_STRIP;
	}

	setLineMode() 
	{ 
		this.primitiveType=this.scene.gl.LINES;
	};

}
