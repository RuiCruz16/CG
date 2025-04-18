import { CGFobject, CGFappearance } from '../lib/CGF.js';
import { MyTree } from './MyTree.js';

/*
    * MyForest
    * @constructor
    * @param scene - Reference to the scene
    * @param row - Number of rows in the forest
    * @param col - Number of columns in the forest
*/

export class MyForest extends CGFobject {
    constructor(scene, row, col) {
        super(scene);
        this.row = row;
        this.col = col;
        this.trees = [];
        this.offsets = [];
        this.initBuffers();
    }

    initBuffers() {
        for (let i = 0; i < this.row; i++) {
            this.trees[i] = [];
            this.offsets[i] = [];
            for (let j = 0; j < this.col; j++) {
                let trunkHeight = Math.random() * 20 + 5;
                let trunkRadius = Math.random() * 4 + 1; 
                let tiltAngle = Math.random() * Math.PI / 10;
                let rotationAxis = Math.random() < 0.5 ? 'x' : 'z';
                let color = [Math.random(), Math.random(), Math.random()];
                this.trees[i][j] = new MyTree(this.scene, trunkHeight, trunkRadius, tiltAngle, rotationAxis, color);

                // Randomly place the trees in the forest
                this.offsets[i][j] = {
                    offsetX: Math.random() * 10 - 5, // Random offset between -5 and 5
                    offsetZ: Math.random() * 10 - 5  // Random offset between -5 and 5
                }
            }
        }
    }

    display() {
        const spacing = 30; // Increase spacing between trees
        for (let i = 0; i < this.row; i++) {
            for (let j = 0; j < this.col; j++) {
                this.scene.pushMatrix();

                    let offsetX = this.offsets[i][j].offsetX;
                    let offsetZ = this.offsets[i][j].offsetZ;

                    this.scene.translate(i * spacing + offsetX, 0, j * spacing + offsetZ);
                    this.trees[i][j].display();
                this.scene.popMatrix();
            }
        }
    }

}
    
