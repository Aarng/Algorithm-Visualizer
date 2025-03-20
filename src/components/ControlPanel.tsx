
import { 
  Flex, 
  IconButton, 
  Slider, 
  SliderFilledTrack, 
  SliderThumb, 
  SliderTrack, 
  Tooltip,
  useBreakpointValue
} from '@chakra-ui/react';
import { FaPause, FaPlay } from 'react-icons/fa';

interface ControlPanelProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
}

const ControlPanel = ({ isPlaying, onPlayPause, speed, onSpeedChange }: ControlPanelProps) => {
  const buttonSize = useBreakpointValue({ base: "sm", sm: "md", lg: "lg" });
  const spacing = useBreakpointValue({ base: 2, sm: 3, md: 4 });
  const sliderWidth = useBreakpointValue({ base: "100%", sm: "200px", md: "300px" });

  return (
    <Flex 
      gap={spacing}
      align="center" 
      justify="center"
      direction={{ base: "column", sm: "row" }}
      p={spacing}
      borderRadius="lg"
      bg="white"
      boxShadow="sm"
      mt={{ base: 2, md: 4 }}
    >
      <Tooltip label={isPlaying ? 'Pause' : 'Play'} placement="top">
        <IconButton
          aria-label={isPlaying ? 'Pause' : 'Play'}
          icon={isPlaying ? <FaPause /> : <FaPlay />}
          onClick={onPlayPause}
          size={buttonSize}
          colorScheme={isPlaying ? "red" : "green"}
          isRound
        />
      </Tooltip>
      
      <Flex 
        flex="1"
        maxW={sliderWidth}
        align="center"
        w="100%"
      >
        <Tooltip label={`Speed: ${speed}x`} placement="top">
          <Slider
            min={0.5}
            max={3}
            step={0.5}
            value={speed}
            onChange={onSpeedChange}
            aria-label="Animation Speed"
            size={buttonSize === "lg" ? "lg" : "md"}
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
        </Tooltip>
      </Flex>
    </Flex>
  );
};

export default ControlPanel;