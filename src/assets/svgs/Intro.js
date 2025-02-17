import * as React from 'react';
import { Dimensions, View } from 'react-native';
import Svg, {
  Defs,
  LinearGradient,
  Stop,
  Ellipse,
  Path,
  Circle,
  G,
  Rect,
} from 'react-native-svg';
/* SVGR has dropped some elements not supported by react-native-svg: title */
const Medicine = (props) => {
  const originalWidth = 1050;
  const originalHeight = 600;
  const aspectRatio = originalWidth / originalHeight;
  const windowWidth = Dimensions.get('window').width;

  return (
    <View
      style={{
        width: windowWidth,
        aspectRatio,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${originalWidth} ${originalHeight}`}
        style={{ marginLeft: 120,
         }}
      >



      </Svg>
    </View>
  );
};
export default Medicine;
