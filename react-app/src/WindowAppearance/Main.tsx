/*
 * @Author: Kanata You 
 * @Date: 2020-10-21 20:18:13 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2020-11-10 14:49:24
 */

import React, { Component } from "react";
import axios from "axios";
import { Header } from "../Components/Header";
import { addHotKey, removeHotKey } from "../Shared/Listeners";
import { NewCommand } from "../Components/NewCommand";
import { Editor } from "../Components/Editor";
import { Config } from "../Shared/Types";


export interface MainProps {};

export interface MainState {};

export class Main extends Component<MainProps, MainState> {

    protected header: React.RefObject<Header>;
    protected newCommand: React.RefObject<NewCommand>;
    protected editor: React.RefObject<Editor>;

    protected static curRef: Main | null = null;

    public constructor(props: MainProps) {
        super(props);

        this.state = {};

        this.header = React.createRef<Header>();
        this.newCommand = React.createRef<NewCommand>();
        this.editor = React.createRef<Editor>();
    }

    public render(): JSX.Element {
        return (
            <div className="container" >
                <Header ref={ this.header } />
                <Editor ref={ this.editor } />
                <NewCommand ref={ this.newCommand } />
            </div>
        );
    }

    public static loadFile(file: { path: string; data: string; }): void {
        Main.curRef?.editor.current?.setState({file});
        Main.curRef?.header.current?.setState({
            path: file.path
        });
    }

    public static openCmd(): void {
        this.curRef?.newCommand.current?.create();
    }

    public componentDidMount(): void {
        Main.curRef = this;
        addHotKey("body", ["ctrl", "enter"], () => {
            this.newCommand.current?.create();
        }, 5);

        axios.get<Config>(`/initConfig`);
    }

    public componentWillUnmount(): void {
        removeHotKey("body", ["ctrl", "enter"]);
    }

};
