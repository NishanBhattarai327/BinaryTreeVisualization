const svgNS = "http://www.w3.org/2000/svg";
const svgContainer = document.getElementById("svg-container");
const width = svgContainer.clientWidth;
const height = svgContainer.clientHeight;

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

  insert(value) {
    if (value < this.value) {
      if (this.left === null) {
        this.left = new Node(value, this.x - this.radius * 2, this.y + this.radius * 2, this.radius * 0.75);
        this.left.depth = this.depth + 1;
      } else {
        this.left.insert(value);
      }
    } else {
      if (this.right === null) {
        this.right = new Node(value, this.x + this.radius * 2, this.y + this.radius * 2, this.radius * 0.75);
        this.right.depth = this.depth + 1;
    } else {
        this.right.insert(value);
      }
    }
  }

  draw() {
    const circle = document.createElementNS(svgNS, "circle");
    circle.setAttribute("cx", this.x);
    circle.setAttribute("cy", this.y);
    circle.setAttribute("r", this.radius);
    circle.setAttribute("fill", "lightGreen");

    const text = document.createElementNS(svgNS, "text");
    text.setAttribute("x", this.x);
    text.setAttribute("y", this.y);
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("dominant-baseline", "middle");
    text.textContent = this.value.toString();


    svgContainer.appendChild(circle);
    svgContainer.appendChild(text);

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

const root = new Node(50, width / 2, 50, 50);
root.insert(25);
root.insert(75);
root.insert(12);
root.insert(37);
root.insert(87);
root.insert(62);
root.insert(99);

root.draw();
console.log(root);

document.querySelector("#number-input").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        const inputNum = parseFloat(event.target.value);
        console.log(inputNum, typeof inputNum);
        root.insert(inputNum);
        root.clear();
        root.draw();
    }
});