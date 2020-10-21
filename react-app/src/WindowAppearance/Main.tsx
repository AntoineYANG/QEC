/*
 * @Author: Kanata You 
 * @Date: 2020-10-21 20:18:13 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2020-10-22 00:48:21
 */

import React, { Component } from "react";
import { Header } from "../Components/Header";
import { addHotKey, removeHotKey } from "../Shared/Listeners";
import { NewCommand } from "../Components/NewCommand";


export interface MainProps {};

export interface MainState {};

export class Main extends Component<MainProps, MainState> {

    protected newCommand: React.RefObject<NewCommand>;

    public constructor(props: MainProps) {
        super(props);

        this.state = {};

        this.newCommand = React.createRef<NewCommand>();
    }

    public render(): JSX.Element {
        return (
            <div className="container" >
                <Header />
                <NewCommand ref={ this.newCommand } />
            </div>
        );
    }

    public componentDidMount(): void {
        addHotKey("body", ["ctrl", "enter"], () => {
            this.newCommand.current?.create();
        }, 5);
    }

    public componentWillUnmount(): void {
        removeHotKey("body", ["ctrl", "enter"]);
    }

};
