import React from 'react';
import { View, StyleSheet } from 'react-native';
import ColorPicker, {
  Panel1,
  HueSlider,
  OpacitySlider,
  Swatches,
  PreviewText,
  colorKit,
} from 'reanimated-color-picker';
import { Container } from './Container';

const defaultSwatches = new Array(6).fill('#fff').map(() => colorKit.randomRgbColor().hex());

export default function PanelColorPicker({
  value,
  onChange,
  onComplete,
  swatches = defaultSwatches,
  style,
}: {
  value: string;
  onChange?: (color: any) => void;
  onComplete?: (color: any) => void;
  swatches?: string[];
  style?: any;
}) {
  return (
    <Container>
      <View style={[styles.pickerContainer, style]}>
        <ColorPicker
          value={value}
          sliderThickness={25}
          thumbSize={24}
          thumbShape="circle"
          onChange={onChange}
          onComplete={onComplete}
          style={styles.picker}
          boundedThumb>
          <Panel1 style={styles.panelStyle} />
          <HueSlider style={styles.sliderStyle} />
          <OpacitySlider style={styles.sliderStyle} />
          <Swatches
            style={styles.swatchesContainer}
            swatchStyle={styles.swatchStyle}
            colors={swatches}
          />
          <PreviewText style={styles.previewTxt} colorFormat="hex" />
        </ColorPicker>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  pickerContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  picker: {
    width: '100%',
    maxWidth: 340,
  },
  panelStyle: {
    borderRadius: 16,
    marginBottom: 12,
    width: '100%',
    height: 180,
  },
  sliderStyle: {
    marginVertical: 8,
    width: '100%',
  },
  swatchesContainer: {
    marginVertical: 8,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  swatchStyle: {
    marginHorizontal: 4,
    borderRadius: 12,
    width: 32,
    height: 32,
  },
  previewTxt: {
    marginTop: 8,
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
});
