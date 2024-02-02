import styles from './CardWithTitle.module.scss';

import { Card, Divider, H3 } from "@blueprintjs/core"
import { PropsWithChildren, ReactElement } from "react";

interface ICardWithTitleProps {
    header: string | ReactElement;
    buttons?: ReactElement;
}

export const CardWithTitle = ({ header, buttons, children }: PropsWithChildren<ICardWithTitleProps>) => {
    return (
        <Card>
            <div className={styles.cardHeader}>
                <H3 className={styles.cardTitle}>{header}</H3>
                <div className="cardHeaderButtons">
                    {buttons}
                </div>
            </div>
            {children}
        </Card>
    );
}