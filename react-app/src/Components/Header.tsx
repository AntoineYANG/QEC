/*
 * @Author: Kanata You 
 * @Date: 2020-10-21 20:21:11 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2020-10-28 19:14:54
 */

import React, { Component } from "react";
import { WindowButton } from "./WindowButton";
import { getWindow, ElectronWindowIsMaximized, ElectronMinimize, ElectronMaximize, ElectronClose } from "../Shared/ElectronAPI";


export interface HeaderProps {};

export interface HeaderState {};

export class Header extends Component<HeaderProps, HeaderState> {

    public constructor(props: HeaderProps) {
        super(props);

        this.state = {};
    }

    public render(): JSX.Element {
        return (
            <div className="header" >
                <div key="left" className="header-strip" >
                    <label key="icon" className="header-item" style={{
                        width: "16.1px",
                        height: "16.1px",
                        margin: "0 7px",
                        display: "inline-block",
                        transform: "translateY(-2px)",
                        fontWeight: "bold",
                        fontSize: "119%"
                    }} >
                        Z
                    </label>
                    <label key="filename" className="header-btn-groups" style={{
                        height: "16.1px",
                        display: "inline-block",
                        transform: "translateY(1.8px)",
                        margin: "0 2em",
                        width: "35vw",
                        overflow: "hidden",
                        textOverflow: "ellipsis"
                    }} >
                        Start with new file
                    </label>
                </div>
                <div key="right" className="header-btn-groups" >
                    <WindowButton key="minimize" name="minimize"
                    path="M28,50 L72,50"
                    trigger={
                        () => {
                            ElectronMinimize();
                        }
                    } />
                    <WindowButton key="maximize" name={
                        ElectronWindowIsMaximized ? "maximize" : "unmaximize"
                    }
                    path={
                        ElectronWindowIsMaximized ? (
                            "M28,46 L60,46 L60,70 L28,70 Z M38,36 L70,36 L70,58 L38,58 Z"
                        ) : "M30,34 L70,34 L70,69 L30,69 Z"
                    }
                    trigger={
                        () => {
                            ElectronMaximize();
                        }
                    } />
                    <WindowButton key="close" name="close"
                    path="M32,32 L68,68 M32,68 L68,32"
                    trigger={
                        () => {
                            ElectronClose();
                        }
                    } />
                </div>
            </div>
        );
    }

    public componentDidMount(): void {
        getWindow()?.on("maximize", () => this.forceUpdate());
    }

};
