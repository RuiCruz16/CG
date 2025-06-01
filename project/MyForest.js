import { CGFobject, CGFappearance, CGFtexture } from '../lib/CGF.js';
import { MyTree } from './MyTree.js';

/*
    * MyForest class
    * Creates a forest of trees with random properties arranged in a grid pattern.
    * Each tree has randomized characteristics (height, radius, tilt, etc.) for natural variety.
*/
export class MyForest extends CGFobject {
    constructor(scene, row, col, spacing) {
        super(scene);
        this.row = row;     // Number of rows with trees in the forest
        this.col = col;     // Number of columns with trees in the forest
        this.spacing = spacing; // Spacing between trees in the forest
        this.trees = [];    // Array to store all tree objects    
        this.offsets = [];  // Array to store random offsets for each tree

        // Load textures for the trunk and leaves
        this.trunkTexture = new CGFtexture(scene, 'images/trunk.jpg');
        this.leafTexture = new CGFtexture(scene, 'images/leaf.jpg');
        
        // Create materials for the trunk
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

        // Initialize the trees and their properties
        for (let i = 0; i < this.row; i++) {
            this.trees[i] = [];     
            this.offsets[i] = [];

            for (let j = 0; j < this.col; j++) {
                // Genreate random properties for each tree
                let trunkHeight = Math.random() * 20 + 5;   // Random height between 5 and 25
                let trunkRadius = Math.random() * 4 + 1;    // Random radius between 1 and 5
                let tiltAngle = Math.random() * Math.PI / 10;   // Random tilt angle between 0 and 18 degrees
                let rotationAxis = Math.random() < 0.5 ? 'x' : 'z'; // Randomly choose rotation axis (x or z)
                let color = [0, Math.random(), 0];  // Random green color for leaves, varying the green component

                // Create materials for the leaves
                const treeLeafMaterial = new CGFappearance(this.scene);
                treeLeafMaterial.setAmbient(color[0], color[1], color[2], 1);
                treeLeafMaterial.setDiffuse(color[0], color[1], color[2], 1);
                treeLeafMaterial.setSpecular(0.1, 0.1, 0.1, 1);
                treeLeafMaterial.setShininess(10.0);
                treeLeafMaterial.setTexture(this.leafTexture);
                treeLeafMaterial.setTextureWrap('REPEAT', 'REPEAT');

                // Create a new tree with the generated properties
                this.trees[i][j] = new MyTree(this.scene, trunkHeight, trunkRadius, tiltAngle, rotationAxis, color, this.trunkMaterial, treeLeafMaterial);

                // Randomly place the trees in the forest
                this.offsets[i][j] = {
                    offsetX: Math.random() * 10 - 5, // Random X offset between -5 and 5
                    offsetZ: Math.random() * 10 - 5  // Random Z offset between -5 and 5
                }
            }
        }
    }

    display() {
        // Display each tree in the forest
        for (let i = 0; i < this.row; i++) {
            for (let j = 0; j < this.col; j++) {
                this.scene.pushMatrix();

                    // Get the random offsets for the current tree
                    let offsetX = this.offsets[i][j].offsetX;
                    let offsetZ = this.offsets[i][j].offsetZ;

                    // Apply transformations to position the tree
                    this.scene.translate(i * this.spacing + offsetX, 0, j * this.spacing + offsetZ); // Position the tree based on its row and column + offset
                    this.trees[i][j].display();
                this.scene.popMatrix();
            }
        }
    }

}
