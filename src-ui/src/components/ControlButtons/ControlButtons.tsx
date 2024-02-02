import { Button } from "@blueprintjs/core";
import { useHotkeys } from 'react-hotkeys-hook';

interface IControlButtonsProps {
    isJamRunning: boolean;
    onStartJam: () => void;
    onCallJam: () => void;
    onStartTimeout: () => void;
}

export const ControlButtons = ({ isJamRunning, onStartJam, onCallJam, onStartTimeout }: IControlButtonsProps) => {

    const hotkeyOptions = {
        enableOnFormTags: true,
        preventDefault: true,
    };

    useHotkeys('`', () => { if(!isJamRunning) { onStartJam() } }, hotkeyOptions, [isJamRunning, onStartJam]);
    useHotkeys('c', () => { if(isJamRunning) { onCallJam() } }, hotkeyOptions, [isJamRunning, onCallJam]);
    useHotkeys('t', onStartTimeout, hotkeyOptions, [onStartTimeout]);

    return (
        <>
            <Button onClick={onStartJam} icon="play" disabled={isJamRunning} intent={isJamRunning ? 'none' : 'primary'} large>Start Jam</Button>
            <Button onClick={onCallJam} icon="stop" disabled={!isJamRunning} intent={isJamRunning ? 'primary' : 'none'} large>Call Jam</Button>
            <Button onClick={onStartTimeout} icon="stopwatch" large>Timeout</Button>
        </>
    );
}