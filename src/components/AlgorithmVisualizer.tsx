import { Box, useBreakpointValue, useToken } from '@chakra-ui/react';
import * as d3 from 'd3';
import { useEffect, useRef, useState } from 'react';
import { algorithms } from '../algorithms';

interface AlgorithmVisualizerProps {
  algorithm: string;
  isPlaying: boolean;
  speed: number;
  onPlayingStateChange: (isPlaying: boolean) => void;
  onLineChange?: (line: number) => void;
}

const AlgorithmVisualizer = ({ 
  algorithm, 
  isPlaying, 
  speed, 
  onPlayingStateChange,
  onLineChange = () => {} 
}: AlgorithmVisualizerProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const algorithmRef = useRef<any>(null);
  const animationRef = useRef<Promise<void> | null>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 400 });
  const [bg] = useToken('colors', ['gray.50']);

  const padding = useBreakpointValue({ base: 4, sm: 6, md: 8 });
  
  const baseWidth = useBreakpointValue({
    base: 300,  // Mobile
    sm: 450,    // Small screens
    md: 700,    // Medium screens
    lg: 900,    // Large screens
    xl: 1200,   // Extra large screens
    '2xl': 1536 // XXL screens
  }) || 300;

  const baseHeight = useBreakpointValue({ 
    base: 400,
    sm: 450,
    md: 500,
    lg: 550,
    xl: 600,
    '2xl': 650
  }) || 400;

  // Update dimensions on resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const container = containerRef.current;
        const containerWidth = container.clientWidth - (padding as number) * 2;
        
        // Use the breakpoint-based width, but don't exceed container width
        let width = Math.min(baseWidth, containerWidth);
        
        // Calculate height while maintaining aspect ratio
        let height = Math.min(baseHeight, width * 0.6);
        
        // Ensure minimum dimensions
        width = Math.max(width, 300);
        height = Math.max(height, 300);
        
        setDimensions({ width, height });
      }
    };

    // Initial dimensions
    updateDimensions();

    // Add resize observer
    const resizeObserver = new ResizeObserver(updateDimensions);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // Cleanup
    return () => resizeObserver.disconnect();
  }, [padding, baseHeight, baseWidth]);

  // Cleanup and reinitialize when algorithm or dimensions change
  useEffect(() => {
    if (!svgRef.current || dimensions.width === 0 || dimensions.height === 0) return;

    // Cleanup previous algorithm
    if (algorithmRef.current) {
      algorithmRef.current.cleanup();
    }

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Initialize new algorithm with current dimensions and line change callback
    const selectedAlgorithm = algorithms[algorithm];
    if (selectedAlgorithm) {
      selectedAlgorithm.initialize(svg, dimensions.width, dimensions.height, onLineChange);
      algorithmRef.current = selectedAlgorithm;
    }

    return () => {
      if (algorithmRef.current) {
        algorithmRef.current.cleanup();
      }
    };
  }, [algorithm, dimensions.width, dimensions.height, onLineChange]);

  // Handle play/pause and speed changes
  useEffect(() => {
    if (!algorithmRef.current) return;

    if (isPlaying) {
      animationRef.current = algorithmRef.current.animate(speed);
      animationRef.current?.then(() => {
        onPlayingStateChange(false);
        onLineChange(-1);
      }).catch(() => {
        onPlayingStateChange(false);
        onLineChange(-1);
      });
    } else {
      algorithmRef.current.cleanup();
      animationRef.current = null;
      onLineChange(-1);
    }

    return () => {
      if (algorithmRef.current) {
        algorithmRef.current.cleanup();
      }
      onLineChange(-1);
    };
  }, [isPlaying, speed, onPlayingStateChange, onLineChange]);

  return (
    <Box 
      ref={containerRef}
      width="100%" 
      height={baseHeight}
      bg={bg} 
      borderRadius="lg"
      overflow="hidden"
      position="relative"
      p={padding}
      maxW={{
        base: "100%",
        sm: "450px",
        md: "700px",
        lg: "900px",
        xl: "1200px",
        "2xl": "1536px"
      }}
      mx="auto"
    >
      <Box
        width="100%"
        height="100%"
        display="flex"
        alignItems="center"
        justifyContent="center"
        overflow="hidden"
      >
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
          preserveAspectRatio="xMidYMid meet"
          style={{ 
            maxWidth: '100%',
            maxHeight: '100%',
            overflow: 'visible'
          }}
        />
      </Box>
    </Box>
  );
};

export default AlgorithmVisualizer; 