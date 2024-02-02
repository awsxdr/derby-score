import styles from './ColorPicker.module.scss';

import { AnchorButton, Button, Card, MultiSlider, Slider } from '@blueprintjs/core';
import { Classes, Popover2, Popover2TargetProps, Popover2HoverTargetHandlers, Popover2ClickTargetHandlers } from '@blueprintjs/popover2';
import { Color } from '../../types';
import cn from 'classnames';

interface IColorButtonProps {
    color: Color;
    onClick?: () => void;
    className?: string;
}

const ColorButton = ({color, onClick, className}: IColorButtonProps) => (
    <Button className={cn(styles.colorButton, className)} onClick={onClick}>
        <div style={{ background: color.toHex() }}></div>
    </Button>
)

const colors = [
    "#000",
    "#888",
    "#fff",
    "#f00",
    "#faa",
    "#f80",
    "#ff0",
    "#0f0",
    "#080",
    "#0ff",
    "#088",
    "#00f",
    "#a0a",
].map(Color.fromHex);

interface IColorPickerProps {
    color: Color;
    onColorPicked: (color: Color) => void;
    disabled?: boolean;
}

export const ColorPicker = ({ color, onColorPicked, disabled }: IColorPickerProps) => {

    const handleHueChanged = (hue: number) => {
        onColorPicked(new Color(hue, color.saturation, color.value));
    }

    const handleSaturationChanged = (saturation: number) => {
        onColorPicked(new Color(color.hue, saturation, color.value));
    }
    
    const handleValueChanged = (value: number) => {
        console.log(new Color(color.hue, color.saturation, value).toHex());
        onColorPicked(new Color(color.hue, color.saturation, value));
    }

    const saturationMaxColor = new Color(color.hue, 100, color.value).toHex();
    const saturationMinColor = new Color(color.hue, 0, color.value).toHex();
    const valueMaxColor = new Color(color.hue, color.saturation, 100).toHex();

    return (
        <Popover2
            interactionKind="click"
            popoverClassName={Classes.POPOVER2_CONTENT_SIZING}
            position="auto"
            content={
                <>
                    <div className={styles.colorPickerButtonContainer}>
                        { colors.map(color => <ColorButton color={color} onClick={() => onColorPicked(color)} />)}
                    </div>
                    <div>
                        <Slider showTrackFill={false} min={0} max={360} value={color.hue} onChange={handleHueChanged} labelRenderer={undefined} labelStepSize={1000} className={styles.colorSlider} />
                        <MultiSlider showTrackFill={true} min={0} max={100} labelRenderer={undefined} labelStepSize={1000} className={styles.simpleSlider}>
                            <MultiSlider.Handle value={color.value} onChange={handleValueChanged} trackStyleBefore={{ background: `linear-gradient(to right, black, ${color.toHex()})` }} trackStyleAfter={{ background: `linear-gradient(to right, ${color.toHex()}, ${valueMaxColor})` }} />
                        </MultiSlider>
                        <MultiSlider showTrackFill={true} min={0} max={100} labelRenderer={undefined} labelStepSize={1000} className={styles.simpleSlider}>
                            <MultiSlider.Handle value={color.saturation} onChange={handleSaturationChanged} trackStyleBefore={{ background: `linear-gradient(to right, ${saturationMinColor}, ${color.toHex()})` }} trackStyleAfter={{ background: `linear-gradient(to right, ${color.toHex()}, ${saturationMaxColor})` }} />
                        </MultiSlider>
                    </div>
                </>
            }
            renderTarget={({ isOpen, ref, ...targetProps }) => (
                <AnchorButton {...targetProps} elementRef={ref} className={styles.colorButton} disabled={disabled}>
                    <div style={{ background: color.toHex() }}></div>
                </AnchorButton>
            )}
        />
    );
}