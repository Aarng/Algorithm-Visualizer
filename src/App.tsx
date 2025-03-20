import { useState } from 'react';
import { Box, Container, Flex, Grid, GridItem, Heading, Select, useBreakpointValue } from '@chakra-ui/react';
import AlgorithmVisualizer from './components/AlgorithmVisualizer';
import AlgorithmCode from './components/AlgorithmCode';
import ControlPanel from './components/ControlPanel';

const algorithms = {
  'bubblesort': 'Bubble Sort',
  'quicksort': 'Quicksort',
  'bfs': 'Breadth First Search',
  'dfs': 'Depth First Search',
};

function App() {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>('bubblesort');
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [currentLine, setCurrentLine] = useState(-1);

  const containerPadding = useBreakpointValue({ base: 2, sm: 4, md: 6 });
 
  const visualizerHeight = useBreakpointValue({ 
    base: "350px", 
    sm: "450px", 
    md: "500px"
  });

  const showCode = useBreakpointValue({ base: false, lg: true });
  const codeWidth = useBreakpointValue({ lg: "350px", xl: "400px" });

  return (
    <Container 
      maxW={{ base: "100%", sm: "container.sm", md: "container.md" }}
      p={containerPadding}
      minH="100vh"
      display="flex"
      flexDirection="column"
      bg="white"
    >
      <Flex 
        direction="column"
        flex="1"
        gap={{ base: 3, md: 4 }}
      >
        <Heading 
          
          textAlign="center"
          py={{ base: 1, sm: 2 }}
        >
          Algorithm Visualizer
        </Heading>
        
        <Flex 
          direction="row"
          justify="center"
          w="100%"
          mb={2}
        >
          <Select
            value={selectedAlgorithm}
            onChange={(e) => setSelectedAlgorithm(e.target.value)}
            isDisabled={isPlaying}
            size="md"
            maxW="300px"
          >
            {Object.entries(algorithms).map(([key, name]) => (
              <option key={key} value={key}>
                {name}
              </option>
            ))}
          </Select>
        </Flex>

        <Grid
          templateColumns={{ base: "1fr", lg: `1fr ${codeWidth}` }}
          gap={4}
          flex="1"
          alignItems="start"
        >
          <GridItem>
            <Box 
              borderWidth={1} 
              borderRadius="md"
              p={{ base: 1, sm: 2, md: 3 }}
              bg="white" 
              boxShadow="sm"
              height={visualizerHeight}
              w="100%"
              position="relative"
              overflow="hidden"
            >
              <AlgorithmVisualizer
                algorithm={selectedAlgorithm}
                isPlaying={isPlaying}
                speed={speed}
                onPlayingStateChange={setIsPlaying}
                onLineChange={setCurrentLine}
              />
            </Box>
          </GridItem>

          {showCode && (
            <GridItem position="sticky" top={4}>
              <Box
                borderWidth={1}
                borderRadius="lg"
                p={3}
                bg="white"
                boxShadow="sm"
                maxH={visualizerHeight}
                overflowY="auto"
              >
                <AlgorithmCode 
                  algorithm={selectedAlgorithm}
                  currentLine={currentLine}
                />
              </Box>
            </GridItem>
          )}
        </Grid>

        <ControlPanel
          isPlaying={isPlaying}
          onPlayPause={() => setIsPlaying(!isPlaying)}
          speed={speed}
          onSpeedChange={setSpeed}
        />
      </Flex>
    </Container>
  );
}

export default App;