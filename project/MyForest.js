import { CGFobject, CGFappearance, CGFtexture } from '../lib/CGF.js';
import { MyTree } from './MyTree.js';

/*
    * MyForest
    * @constructor
    * @param scene - Reference to the scene
    * @param row - Number of rows in the forest
    * @param col - Number of columns in the forest
*/
export class MyForest extends CGFobject {
    constructor(scene, row, col, spacing) {
        super(scene);
        this.row = row;
        this.col = col;
        this.spacing = spacing;
        this.trees = [];
        this.offsets = [];

        this.trunkTexture = new CGFtexture(scene, 'images/trunk.jpg');
        this.leafTexture = new CGFtexture(scene, 'images/leaf.jpg');
        
        this.trunkMaterial = new CGFappearance(scene);
        this.trunkMaterial.setAmbient(0.5, 0.25, 0.1, 1);
        this.trunkMaterial.setDiffuse(0.5, 0.25, 0.1, 1);
        this.trunkMaterial.setSpecular(0.1, 0.1, 0.1, 1);
        this.trunkMaterial.setShininess(10.0);
        this.trunkMaterial.setTexture(this.trunkTexture);
        this.trunkMaterial.setTextureWrap('REPEAT', 'REPEAT');

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
                let color = [0, Math.random(), 0];

                const treeLeafMaterial = new CGFappearance(this.scene);
                treeLeafMaterial.setAmbient(color[0], color[1], color[2], 1);
                treeLeafMaterial.setDiffuse(color[0], color[1], color[2], 1);
                treeLeafMaterial.setSpecular(0.1, 0.1, 0.1, 1);
                treeLeafMaterial.setShininess(10.0);
                treeLeafMaterial.setTexture(this.leafTexture);
                treeLeafMaterial.setTextureWrap('REPEAT', 'REPEAT');

                this.trees[i][j] = new MyTree(this.scene, trunkHeight, trunkRadius, tiltAngle, rotationAxis, color, this.trunkMaterial, treeLeafMaterial);

                // Randomly place the trees in the forest
                this.offsets[i][j] = {
                    offsetX: Math.random() * 10 - 5, // Random offset between -5 and 5
                    offsetZ: Math.random() * 10 - 5  // Random offset between -5 and 5
                }
            }
        }
    }

    display() {
        for (let i = 0; i < this.row; i++) {
            for (let j = 0; j < this.col; j++) {
                this.scene.pushMatrix();

                    let offsetX = this.offsets[i][j].offsetX;
                    let offsetZ = this.offsets[i][j].offsetZ;

                    this.scene.translate(i * this.spacing + offsetX, 0, j * this.spacing + offsetZ);
                    this.trees[i][j].display();
                this.scene.popMatrix();
            }
        }
    }

}
