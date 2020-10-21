/*
 * @Author: Kanata You 
 * @Date: 2020-10-21 21:35:28 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2020-10-22 00:21:24
 */

import React from "react";


export interface WindowButtonProps {
    name: string;
    path: string;
    trigger: () => void;
};

export const WindowButton = (props: WindowButtonProps): JSX.Element => {
    return (
        <div title={ props.name } className="windowbutton" onClick={ props.trigger } >
            <svg width="100%" height="100%" viewBox="0 0 100 100" >
                <path d={ props.path } />
            </svg>
        </div>
    );
};
