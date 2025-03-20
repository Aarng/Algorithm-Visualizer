import { Selection } from 'd3';
import * as d3 from 'd3';
import { Algorithm } from './index';

// Tree structure for visualization
interface TreeNode {
  id: number;
  value: number;
  children: TreeNode[];
  x?: number;
  y?: number;
  visited: boolean;
  state: 'default' | 'current' | 'visited' | 'processing';
}

let svg: Selection<SVGSVGElement, unknown, null, undefined>;
let width: number;
let height: number;
let animationTimeout: NodeJS.Timeout | null = null;
let root: TreeNode;
let isRunning = false;
let onLineChange: ((line: number) => void) | null = null;

const createFixedTree = (): TreeNode => {
  // Create nodes with fixed structure as shown in the image
  const nodes: TreeNode[] = Array(7).fill(0).map((_, i) => ({
    id: i,
    value: i,
    children: [],
    visited: false,
    state: 'default'
  }));

  // Layer 0 -> Layer 1 connections
  nodes[0].children = [nodes[1], nodes[2]];       // Root -> 1, 2
  nodes[1].children = [nodes[3], nodes[4]];       // 1 -> 3, 4
  nodes[2].children = [nodes[5], nodes[6]];       // 2 -> 5, 6

  return nodes[0]; // Return root node
};

const sleep = (ms: number) => new Promise<void>(resolve => {
  if (!isRunning) throw new Error('Animation stopped');
  animationTimeout = setTimeout(resolve, ms);
});

const drawTree = () => {
  // Clear previous content
  svg.selectAll('*').remove();

  // Create hierarchical layout with wider spacing on larger screens
  const treeLayout = d3.tree<TreeNode>()
    .size([Math.min(width * 0.85, 1200), height - 100]); // Use up to 85% of width, max 1200px

  const hierarchy = d3.hierarchy(root);
  const treeData = treeLayout(hierarchy);

  // Add a group for centering the visualization
  const g = svg.append('g')
    .attr('transform', `translate(${(width - Math.min(width * 0.85, 1200)) / 2},0)`);

  // Draw edges
  g.selectAll('line')
    .data(treeData.links())
    .join('line')
    .attr('x1', d => d.source.x! + 50)
    .attr('y1', d => d.source.y! + 50)
    .attr('x2', d => d.target.x! + 50)
    .attr('y2', d => d.target.y! + 50)
    .attr('stroke', '#666')
    .attr('stroke-width', 2);

  // Create node groups
  const nodes = g.selectAll('.node')
    .data(treeData.descendants())
    .join('g')
    .attr('class', 'node')
    .attr('transform', d => `translate(${d.x + 50},${d.y + 50})`);

  // Draw node circles with larger radius on wider screens
  const nodeRadius = Math.min(30, Math.max(25, width / 50));
  nodes.append('circle')
    .attr('r', nodeRadius)
    .style('fill', d => {
      switch (d.data.state) {
        case 'current': return '#FF4081';    // Pink for current node
        case 'processing': return '#FFA726';  // Orange for nodes being processed
        case 'visited': return '#4CAF50';     // Green for visited nodes
        default: return '#2196F3';            // Blue for unvisited nodes
      }
    })
    .style('stroke', '#fff')
    .style('stroke-width', 3);

  // Add node values with responsive font size
  nodes.append('text')
    .attr('dy', '0.35em')
    .attr('text-anchor', 'middle')
    .style('font-size', `${Math.min(16, Math.max(14, width / 80))}px`)
    .style('fill', '#FFFFFF')
    .style('font-weight', 'bold')
    .style('user-select', 'none')
    .style('pointer-events', 'none')
    .text(d => d.data.value);
};

async function bfs(startNode: TreeNode, delay: number) {
  if (!onLineChange) return;

  onLineChange(2); // Initialize visited set and queue
  const queue: TreeNode[] = [startNode];
  startNode.state = 'current';
  drawTree();
  await sleep(delay);

  onLineChange(3); // Add start node to queue
  startNode.state = 'processing';
  drawTree();
  await sleep(delay);

  onLineChange(5); // Start BFS loop
  while (queue.length > 0 && isRunning) {
    onLineChange(6); // Process current node
    const current = queue.shift()!;
    current.state = 'current';
    drawTree();
    await sleep(delay);

    onLineChange(9); // Process neighbors
    for (const neighbor of current.children) {
      if (neighbor.state === 'default') {
        onLineChange(11); // Add unvisited neighbor
        neighbor.state = 'processing';
        queue.push(neighbor);
        drawTree();
        await sleep(delay);
      }
    }

    current.state = 'visited';
    drawTree();
    await sleep(delay);
  }

  onLineChange(-1); // End of algorithm
}

export const breadthFirstSearch: Algorithm = {
  initialize: (svgElement, w, h, onLineChangeFunc?: (line: number) => void) => {
    svg = svgElement;
    width = w;
    height = h;
    isRunning = true;
    onLineChange = onLineChangeFunc || null;
    root = createFixedTree();
    // Reset states
    const resetStates = (node: TreeNode) => {
      node.state = 'default';
      node.visited = false;
      node.children.forEach(resetStates);
    };
    resetStates(root);
    drawTree();
  },

  animate: (speed) => {
    isRunning = true;
    const delay = 1000 / speed;
    return bfs(root, delay);
  },

  cleanup: () => {
    isRunning = false;
    if (animationTimeout) {
      clearTimeout(animationTimeout);
      animationTimeout = null;
    }
    if (onLineChange) {
      onLineChange(-1);
    }
  }
}; 