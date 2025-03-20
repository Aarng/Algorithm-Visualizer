import { Selection } from 'd3';
import * as d3 from 'd3';
import { Algorithm } from './index';

interface BarData {
  value: number;
  index: number;
  state: 'default' | 'comparing' | 'sorted' | 'pivot';
}

let svg: Selection<SVGSVGElement, unknown, null, undefined>;
let data: BarData[];
let width: number;
let height: number;
let animationTimeout: NodeJS.Timeout | null = null;
let isRunning = false;
let onLineChange: ((line: number) => void) | null = null;

const generateRandomArray = (size: number): BarData[] => {
  return Array.from({ length: size }, (_, i) => ({
    value: Math.floor(Math.random() * 100) + 1,
    index: i,
    state: 'default'
  }));
};

const sleep = (ms: number) => new Promise(resolve => {
  if (!isRunning) throw new Error('Animation stopped');
  animationTimeout = setTimeout(resolve, ms);
});

const drawBars = () => {
  // Calculate responsive dimensions with padding
  const margin = { left: 40, right: 40, top: 60, bottom: 40 };
  const availableWidth = Math.min(width * 0.95, 1400) - margin.left - margin.right;
  const availableHeight = height - margin.top - margin.bottom;
  
  // Add a group for centering the visualization
  svg.selectAll('*').remove();
  const g = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  // Calculate bar width with spacing
  const barSpacing = Math.max(4, availableWidth * 0.02); // Responsive spacing
  const barWidth = (availableWidth / data.length) - barSpacing;

  const xScale = d3.scaleLinear()
    .domain([0, data.length])
    .range([0, availableWidth]);

  const yScale = d3.scaleLinear()
    .domain([0, 100])
    .range([availableHeight, 0]);

  // Draw background grid lines
  g.selectAll('.grid-line')
    .data(yScale.ticks(5))
    .join('line')
    .attr('class', 'grid-line')
    .attr('x1', 0)
    .attr('x2', availableWidth)
    .attr('y1', d => yScale(d))
    .attr('y2', d => yScale(d))
    .style('stroke', '#e0e0e0')
    .style('stroke-dasharray', '2,2');

  // Update bars with responsive sizing and spacing
  g.selectAll('.bar')
    .data(data)
    .join('rect')
    .attr('class', 'bar')
    .attr('x', (_d, i) => xScale(i) + barSpacing / 2)
    .attr('y', d => yScale(d.value))
    .attr('width', Math.max(barWidth, 2))
    .attr('height', d => availableHeight - yScale(d.value))
    .attr('rx', 3)
    .style('fill', d => {
      switch (d.state) {
        case 'comparing': return '#ff69b4';
        case 'sorted': return '#4CAF50';
        case 'pivot': return '#FFA500';
        default: return '#2196F3';
      }
    })
    .style('filter', 'drop-shadow(0px 2px 2px rgba(0,0,0,0.1))');

  // Update values with responsive font size and better positioning
  g.selectAll('.value')
    .data(data)
    .join('text')
    .attr('class', 'value')
    .attr('x', (_d, i) => xScale(i) + barWidth / 2 + barSpacing / 2)
    .attr('y', d => yScale(d.value) - 8)
    .attr('text-anchor', 'middle')
    .style('font-size', `${Math.min(14, Math.max(10, barWidth / 2.5))}px`)
    .style('font-weight', 'bold')
    .style('fill', '#333')
    .text(d => d.value);

  // Add y-axis grid values
  g.selectAll('.grid-value')
    .data(yScale.ticks(5))
    .join('text')
    .attr('class', 'grid-value')
    .attr('x', -10)
    .attr('y', d => yScale(d))
    .attr('text-anchor', 'end')
    .attr('dominant-baseline', 'middle')
    .style('font-size', '12px')
    .style('fill', '#666')
    .text(d => d);
};

async function quickSortAlgorithm(arr: BarData[], start: number, end: number, delay: number) {
  if (start >= end || !isRunning) return;

  if (onLineChange) onLineChange(2); // Check partition condition
  const pivot = arr[end];
  pivot.state = 'pivot';
  drawBars();
  await sleep(delay);

  if (onLineChange) onLineChange(3); // Find partition index
  let i = start - 1;

  if (onLineChange) onLineChange(13); // Start partitioning loop
  for (let j = start; j < end && isRunning; j++) {
    arr[j].state = 'comparing';
    drawBars();
    await sleep(delay);

    if (onLineChange) onLineChange(14); // Compare with pivot
    if (arr[j].value < pivot.value) {
      i++;
      if (onLineChange) onLineChange(17); // Swap elements
      [arr[i], arr[j]] = [arr[j], arr[i]];
      drawBars();
      await sleep(delay);
    }

    arr[j].state = 'default';
  }

  if (!isRunning) return;

  if (onLineChange) onLineChange(24); // Place pivot
  [arr[i + 1], arr[end]] = [arr[end], arr[i + 1]];
  pivot.state = 'default';
  arr[i + 1].state = 'sorted';
  drawBars();
  await sleep(delay);

  if (onLineChange) onLineChange(6); // Recursive calls
  await quickSortAlgorithm(arr, start, i, delay);
  await quickSortAlgorithm(arr, i + 2, end, delay);

  if (onLineChange) onLineChange(-1); // End of partition
}

export const quickSort: Algorithm = {
  initialize: (svgElement, w, h, onLineChangeFunc?: (line: number) => void) => {
    svg = svgElement;
    width = w;
    height = h;
    data = generateRandomArray(15);
    isRunning = false;
    onLineChange = onLineChangeFunc || null;
    drawBars();
  },

  animate: (speed) => {
    isRunning = true;
    const delay = 1000 / speed;
    return quickSortAlgorithm(data, 0, data.length - 1, delay);
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