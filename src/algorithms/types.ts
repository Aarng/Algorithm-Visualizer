export interface Algorithm {
  initialize: (
    svg: any, 
    width: number, 
    height: number, 
    onLineChange?: (line: number) => void
  ) => void;
  animate: (speed: number) => Promise<void>;
  cleanup: () => void;
}

export interface BarData {
  value: number;
  state: 'default' | 'comparing' | 'sorted' | 'swapping';
} 