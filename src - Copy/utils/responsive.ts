import { Dimensions, PixelRatio } from 'react-native';

const { width, height } = Dimensions.get('window');

// Base guideline sizes
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

// Width responsive
export const wp = (size: number) =>
  (width / guidelineBaseWidth) * size;

// Height responsive
export const hp = (size: number) =>
  (height / guidelineBaseHeight) * size;

// Font responsive
export const fp = (size: number) => {
  const scale = width / guidelineBaseWidth;
  const newSize = size * scale;

  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

// Check device type
export const isTablet = width >= 768;