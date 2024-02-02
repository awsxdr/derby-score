import styles from './TeamColorSidebar.module.css';

import { Color } from "../../types";

interface ITeamColorSidebarProps {
    color: Color;
    side: 'left' | 'right';
}

export const TeamColorSidebar = ({ color, side }: ITeamColorSidebarProps) => {

    return (
        <div className={styles.sideBar} style={{background: `linear-gradient(to ${side}, black, ${color.toHex()})`}}></div>
    );
}