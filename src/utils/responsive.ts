// src/utils/responsive.ts
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Baseado em um design mobile (ex: iPhone 13)
const guidelineBaseWidth = 390;
const guidelineBaseHeight = 844;

const horizontalScale = (size: number) => (width / guidelineBaseWidth) * size;
const verticalScale = (size: number) => (height / guidelineBaseHeight) * size;
const moderateScale = (size: number, factor = 0.5) =>
  size + (horizontalScale(size) - size) * factor;

/**
 * Responsive scale helpers based on the current device dimensions.
 *
 * `hs` scales horizontal measurements, `vs` scales vertical measurements, and
 * `ms` applies a softer scale for text and mixed-size values.
 */
export { horizontalScale as hs, verticalScale as vs, moderateScale as ms };
