import { Selection } from 'd3';
import { breadthFirstSearch } from './breadthFirstSearch';
import { depthFirstSearch } from './depthFirstSearch';
import { quickSort } from './quickSort';
import { bubbleSort } from './bubbleSort';

export interface Algorithm {
  initialize: (
    svg: Selection<SVGSVGElement, unknown, null, undefined>, 
    width: number, 
    height: number,
    onLineChange?: (line: number) => void
  ) => void;
  animate: (speed: number) => Promise<void>;
  cleanup: () => void;
}

export const algorithms: Record<string, Algorithm> = {
  'bubblesort': bubbleSort,
  'quicksort': quickSort,
  'bfs': breadthFirstSearch,
  'dfs': depthFirstSearch,
};

export { bubbleSort }; 