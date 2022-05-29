class Node {  
    constructor(value, char, left, right) {  
        this.val  = value; // number of character occurrences  
        this.char  = char; // character to be encoded  
        this.left = left;  
        this.right = right;  
    }  
}
//Huffman coding is a compression algorithm that represents a string sequence in binary  
export class huffmanTree{
    constructor(array){  
        //The first step is to count the frequency of characters  
        let hash = {};  
        for(let i = 0; i < array.length; i++){  
            hash[array[i]] = hash[array[i]] + 1;  
        }  
        this.hash = hash;  
  
        //Constructing Huffman tree  
        this.huffmanTree = this.getHuffmanTree();  
  
        let map = this.getHuffmanCode(this.huffmanTree);  
        //Look at the cross reference table, that is, what is the binary encoding of each character  
        //console.log(map);  
  
        //Final binary encoding  
        this.binaryArray = this.getBinaryArray(map, array);  
    }  
  
    //Constructing Huffman tree  
    getHuffmanTree(){  
        //The number of occurrences of each character is node.val , tectonic forest  
        let forest = []  
        for(let char in this.hash){  
            let node = new Node(this.hash[char], char); 
            forest.push(node);  
        }  
  
        //When there is only one node left in the forest, the merging process is finished and the tree is generated  
        let allNodes = []; // stores the merged nodes, because any node in the forest cannot be deleted, otherwise. Left. Right will not find the node  
        while(forest.length !== 1){  
            //Find the two smallest trees in the forest and merge them  
            forest.sort((a, b) => {  
                return a.val - b.val;  
            });  
  
            let node = new Node(forest[0].val + forest[1].val, '');  
            allNodes.push(forest[0]);  
            allNodes.push(forest[1]);  
            node.left  = allNodes[ allNodes.length  -2]; // the left subtree places words with low frequency  
            node.right  = allNodes[ allNodes.length  -1]; // the right subtree places the word frequency high  
  
            //Delete the two smallest trees  
            forest = forest.slice(2);  
            //Added tree join  
            forest.push(node);  
        }  
  
        //Generated Huffman tree  
        return forest[0];  
    }  

    //Traverse the Huffman tree and return a table of original characters and binary codes
    /** @return {Map} */
    getHuffmanCode(tree){  
        let hash = new Map(); // cross reference table
        let traversal = (node, curPath) => {  
            if (!node.length && !node.right) return;  
            if (node.left && !node.left.left && !node.left.right){
                hash.set(node.left.char, curPath + '0')
            }  
            if (node.right && !node.right.left && !node.right.right){  
                hash.set(node.right.char, curPath + '1')
            }  
            //Traverse to the left and add 0 to the path  
            if(node.left){  
                traversal(node.left, curPath + '0');  
            }  
            //Go right and add 1 to the path  
            if(node.right){  
                traversal(node.right, curPath + '1');  
            }  
        };  
        traversal(tree, '');  
        return hash;  
    }  
  
    //Returns the final compressed binary string  
    getBinaryArray(map, originStr){  
        let result = '';  
        for(let i = 0; i < originStr.length; i++){  
            result += map[originStr[i]];  
        }  
        return result;  
    }
}