import React from 'react';
import { Box, Text, VStack } from '@chakra-ui/react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface AlgorithmCodeProps {
  algorithm: string;
  currentLine: number;
}

const algorithmCode: Record<string, { code: string; lineOffset: number }> = {
  bubblesort: {
    code: `function bubbleSort(arr) {
  let n = arr.length;
  let swapped;
  
  do {
    swapped = false;
    
    for (let i = 0; i < n - 1; i++) {
      if (arr[i] > arr[i + 1]) {
        // Swap elements
        let temp = arr[i];
        arr[i] = arr[i + 1];
        arr[i + 1] = temp;
        swapped = true;
      }
    }
    
    n--;
  } while (swapped);
  
  return arr;
}`,
    lineOffset: 1
  },
  quicksort: {
    code: `function quickSort(arr, low, high) {
  if (low < high) {
    // Find the partition index
    let pi = partition(arr, low, high);
    
    // Sort elements before and after partition
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }
}

function partition(arr, low, high) {
  let pivot = arr[high];
  let i = low - 1;
  
  for (let j = low; j < high; j++) {
    if (arr[j] < pivot) {
      i++;
      // Swap elements
      let temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
  }
  
  // Place pivot in correct position
  let temp = arr[i + 1];
  arr[i + 1] = arr[high];
  arr[high] = temp;
  
  return i + 1;
}`,
    lineOffset: 1
  },
  bfs: {
    code: `function bfs(graph, start) {
  const visited = new Set();
  const queue = [start];
  visited.add(start);
  
  while (queue.length > 0) {
    const vertex = queue.shift();
    console.log(vertex);
    
    for (let neighbor of graph[vertex]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
}`,
    lineOffset: 1
  },
  dfs: {
    code: `function dfs(graph, start, visited = new Set()) {
  visited.add(start);
  console.log(start);
  
  for (let neighbor of graph[start]) {
    if (!visited.has(neighbor)) {
      dfs(graph, neighbor, visited);
    }
  }
}`,
    lineOffset: 1
  }
};

const AlgorithmCode: React.FC<AlgorithmCodeProps> = ({ algorithm, currentLine }) => {
  const { code, lineOffset } = algorithmCode[algorithm] || { code: '', lineOffset: 0 };
  console.log('Current line:', currentLine);

  const customStyle = {
    ...tomorrow,
    'pre[class*="language-"]': {
      ...tomorrow['pre[class*="language-"]'],
      margin: 0,
      padding: 0,
      background: 'transparent',
    }
  };

  const lineProps = (lineNumber: number) => {
    const isHighlighted = lineNumber === currentLine;
    return {
      style: {
        display: 'block',
        backgroundColor: isHighlighted ? 'rgba(255, 64, 129, 0.3)' : 'transparent',
        borderLeft: isHighlighted ? '4px solid #FF4081' : '4px solid transparent',
        paddingLeft: '1rem',
        transition: 'all 0.2s ease-in-out'
      }
    };
  };

  return (
    <VStack align="stretch" spacing={3}>
      <Text fontWeight="medium" fontSize="sm" color="gray.600">
        Algorithm Implementation
      </Text>
      <Box fontSize="sm" fontFamily="mono" position="relative">
        <SyntaxHighlighter
          language="javascript"
          style={customStyle}
          showLineNumbers
          lineNumberStyle={{ 
            opacity: 0.5, 
            minWidth: '2.5em',
            paddingRight: '1em',
            textAlign: 'right',
            userSelect: 'none'
          }}
          customStyle={{ 
            margin: 0, 
            padding: '0.5rem',
            background: 'transparent',
            fontSize: '0.875rem'
          }}
          lineProps={lineProps}
          wrapLines={true}
          startingLineNumber={lineOffset}
        >
          {code}
        </SyntaxHighlighter>
      </Box>
    </VStack>
  );
};

export default AlgorithmCode; 