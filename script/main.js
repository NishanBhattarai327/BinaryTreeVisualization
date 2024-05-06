const svgNS = "http://www.w3.org/2000/svg";
const svgContainer = document.getElementById("svg-container");
const width = svgContainer.clientWidth;
const height = svgContainer.clientHeight;
let treeHeight = 0;

let root = null;


// Add a property to track whether a node is currently being dragged
let isDragging = false;
let draggedNode = null;

// Function to handle mouse/touch down event on a node
function handleDragStart(event, node) {
    isDragging = true;
    draggedNode = node;
}

// Function to handle mouse/touch move event while dragging a node
function handleDragMove(event) {
    if (isDragging && draggedNode) {
        event.preventDefault();
        const newX = event.clientX - svgContainer.getBoundingClientRect().left;
        const newY = event.clientY - svgContainer.getBoundingClientRect().top;
        draggedNode.x = newX;
        draggedNode.y = newY;
        root.clear();
        root.draw();
    }
}

// Function to handle mouse/touch up event to stop dragging
function handleDragEnd() {
    isDragging = false;
    draggedNode = null;
}

class Node {
  constructor(value, x, y, radius) {
    this.value = value;
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.left = null;
    this.right = null;
    this.depth = 0;
  }

  getNode(value) {
    let node = root;
    while (node !== null && node.value !== value) {
        if (node.value < value) {
            node = node.right;
        } else {
            node = node.left;
        }
    }
    return node;
  }

  insert(value) {
    if (value < this.value) {
      if (this.left === null) {
        this.left = new Node(value, this.x - this.radius * 2, this.y + this.radius * 2, this.radius * 0.75);
        this.left.depth = this.depth + 1;
        treeHeight = Math.max(treeHeight, this.left.depth);
      } else {
        this.left.insert(value);
      }
    } else if (value > this.value) {
      if (this.right === null) {
        this.right = new Node(value, this.x + this.radius * 2, this.y + this.radius * 2, this.radius * 0.75);
        this.right.depth = this.depth + 1;
        treeHeight = Math.max(treeHeight, this.right.depth);
      } else {
        this.right.insert(value);
      }
    }
  }

  draw() {
    const svgWrapper = document.createElementNS(svgNS, "g");
    svgWrapper.setAttribute("class", "draggable")
    
    const circle = document.createElementNS(svgNS, "circle");
    circle.setAttribute("cx", this.x);
    circle.setAttribute("cy", this.y);
    circle.setAttribute("r", this.radius);
    circle.setAttribute("fill", "lightGreen");
    
    const text = document.createElementNS(svgNS, "text");
    text.setAttribute("x", this.x);
    text.setAttribute("y", this.y);
    text.setAttribute("font-size", this.radius);
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("dominant-baseline", "middle");
    text.textContent = this.value.toString();
    
    // Add event listeners for mouse events
    
    svgWrapper.addEventListener("mousedown", (event) => handleDragStart(event, this.getNode(this.value)));
    svgWrapper.addEventListener("mousemove", handleDragMove);
    svgWrapper.addEventListener("mouseup", handleDragEnd);
    svgWrapper.addEventListener("mouseleave", handleDragEnd);

    svgWrapper.appendChild(circle);
    svgWrapper.appendChild(text);
    svgContainer.appendChild(svgWrapper);

    if (this.left) {
      const line = document.createElementNS(svgNS, "line");
      line.setAttribute("x1", this.x);
      line.setAttribute("y1", this.y + this.radius);
      line.setAttribute("x2", this.left.x);
      line.setAttribute("y2", this.left.y);
      line.setAttribute("stroke", "black");
      svgContainer.appendChild(line);
      this.left.draw();
    }

    if (this.right) {
      const line = document.createElementNS(svgNS, "line");
      line.setAttribute("x1", this.x);
      line.setAttribute("y1", this.y + this.radius);
      line.setAttribute("x2", this.right.x);
      line.setAttribute("y2", this.right.y);
      line.setAttribute("stroke", "black");
      svgContainer.appendChild(line);
      this.right.draw();
    }
  }
  clear() {
    while (svgContainer.firstChild) {
      svgContainer.removeChild(svgContainer.firstChild);
    }
  }
}


// root =  new Node(45, width / 2, 50, 50);
// root.insert(25);
// root.insert(75);
// root.insert(12);
// root.insert(37);
// root.insert(87);
// root.insert(62);
// root.insert(99);

// root.draw();

const input = document.querySelector("#number-input"); 
input.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        const inputNum = parseFloat(event.target.value);
        input.value = '';

        if (root === null) {
            root = new Node(inputNum, width / 2, 50, 50);
        } else {
            root.insert(inputNum);
        }
        root.clear();
        root.draw();
    }
});