/*
 * @Author: Kanata You 
 * @Date: 2020-10-22 00:32:54 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2020-10-22 02:31:30
 */

import React, { Component } from "react";
import $ from "jquery";
import { addHotKey, removeHotKey, initHotKeyListeners } from "../Shared/Listeners";


export interface NewCommandProps {};

export interface NewCommandState {
    active: boolean;
};

export class NewCommand extends Component<NewCommandProps, NewCommandState> {

    protected containerID: number;

    public constructor(props: NewCommandProps) {
        super(props);
        this.state = {
            active: false
        };

        this.containerID = Math.floor(Math.random() * 1000000);
    }

    public render(): JSX.Element {
        return (
            <div id={ `command-box-${ this.containerID }` } style={{
                display: this.state.active ? "flex" : "none",
                position: "absolute",
                bottom: "40px",
                left: 0,
                width: "100vw",
                alignItems: "center",
                justifyContent: "center"
            }}
            onKeyDown={
                e => {
                    e.stopPropagation();
                }
            } >
                <input className="command-box" type="text"
                name={ `command-input-${ this.containerID }` }
                style={{
                    border: "1px solid white",
                    width: "calc(100vw - 200px)",
                    minHeight: "1em",
                    padding: "6px 12px"
                }} />
            </div>
        );
    }

    public componentDidMount(): void {
        initHotKeyListeners(`#command-box-${ this.containerID }`, false);
        
        addHotKey(`#command-box-${ this.containerID }`, ["esc"], () => {
            this.close();
        }, 10);
    }

    public componentDidUpdate(): void {
        if (this.state.active) {
            $(`#command-box-${ this.containerID } input`).val("").focus();
        }
    }

    public componentWillUnmount(): void {
        removeHotKey(`#command-box-${ this.containerID }`, ["esc"]);
    }

    public create(): void {
        if (!this.state.active) {
            $(`#command-box-${ this.containerID } input`).val("");
            this.setState({
                active: true
            });
        }
    }

    public close(): void {
        if (this.state.active) {
            $(`#command-box-${ this.containerID } input`).val("");
            this.setState({
                active: false
            });
        }
    }

};
