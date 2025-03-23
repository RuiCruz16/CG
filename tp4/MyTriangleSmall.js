import {CGFobject} from '../lib/CGF.js';
/**
 * MyTriangleSmall
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyTriangleSmall extends CGFobject {
    constructor(scene, textureCoords) {
        super(scene);
        this.texCoords = textureCoords
        this.initBuffers();
    }
    
    initBuffers() {
        this.vertices = [
            -1, 0, 0,	//0
            1, 0, 0,	//1
            0, 1, 0,	//2
            -1, 0, 0,	//3
            1, 0, 0,	//4
            0, 1, 0	    //5
        ];

        //Counter-clockwise reference of vertices
        this.indices = [
            0, 1, 2,
            3, 5, 4
        ];

        this.normals = [
            0, 0, 1,    //0
            0, 0, 1,    //1
            0, 0, 1,    //2
            0, 0, -1,   //3
            0, 0, -1,   //4
            0, 0, -1    //5
        ];


        //The defined indices (and corresponding vertices)
        //will be read in groups of three to draw triangles
        this.primitiveType = this.scene.gl.TRIANGLES;

        this.initGLBuffers();
    }
}
