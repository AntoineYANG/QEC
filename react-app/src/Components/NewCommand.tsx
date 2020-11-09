/*
 * @Author: Kanata You 
 * @Date: 2020-10-22 00:32:54 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2020-11-09 13:40:26
 */

import React, { Component } from "react";
import $ from "jquery";
import { addHotKey, removeHotKey, initHotKeyListeners } from "../Shared/Listeners";
import { AutoCompleter } from "./AutoCompleter";
import { CommandDict, parseParams } from "../Handlers/CommandParser";


export interface NewCommandProps {};

export interface NewCommandState {
    active: boolean;
};

export class NewCommand extends Component<NewCommandProps, NewCommandState> {

    protected containerID: number;

    protected history: Array<string>;
    protected historyIdx: number;
    protected historyLock: boolean;

    public constructor(props: NewCommandProps) {
        super(props);
        this.state = {
            active: false
        };

        this.containerID = Math.floor(Math.random() * 1000000);
        this.history = [];
        this.historyIdx = -1;
        this.historyLock = false;
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
                <input className="command-box" type="text" spellCheck="false"
                name={ `command-input-${ this.containerID }` }
                onChange={
                    e => {
                        this.parse($(e.target).val()! as string | "");
                        if (!this.historyLock) {
                            this.historyIdx = -1;
                        } else {
                            this.historyLock = false;
                        }
                    }
                }
                style={{
                    border: "1px solid white",
                    width: "calc(100vw - 200px)",
                    minHeight: "1em",
                    padding: "6px 12px"
                }} />
                <AutoCompleter />
            </div>
        );
    }

    public componentDidMount(): void {
        initHotKeyListeners(`#command-box-${ this.containerID }`, false);
        
        addHotKey(`#command-box-${ this.containerID }`, ["esc"], () => {
            this.close();
        }, 10);
        addHotKey(`#command-box-${ this.containerID }`, ["tab"], () => {
            const autoCompleter = AutoCompleter.getRef();
            if (autoCompleter) {
                if (autoCompleter.state.list.length === 1 && autoCompleter.state.list2.length) {
                    let res = autoCompleter.state.list2[autoCompleter.state.focusIdx2];
                    res = (
                        $(`#command-box-${ this.containerID } input`).val()! as string
                    ).split(/ {1,}/).reverse().slice(1).reverse().join(" ") + " " + res;
                    $(`#command-box-${ this.containerID } input`).val(res);
                    this.parse(res);
                } else {
                    const res = autoCompleter.state.list[autoCompleter.state.focusIdx] + " ";
                    $(`#command-box-${ this.containerID } input`).val(res);
                    this.parse(res);
                }
            }
        }, 10);
        addHotKey(`#command-box-${ this.containerID }`, ["up"], () => {
            const autoCompleter = AutoCompleter.getRef();
            if ((
                (
                    $(`#command-box-${ this.containerID } input`).val()! as string
                ).length === 0 || this.historyIdx !== -1
            ) && this.history.length) {
                if (this.historyIdx === -1) {
                    this.historyIdx = this.history.length - 1;
                } else if (this.historyIdx >= 1) {
                    this.historyIdx -= 1;
                } else {
                    return;
                }
                const cmd: string = this.history[this.historyIdx];
                $(`#command-box-${ this.containerID } input`).val(cmd);
                this.parse(cmd);
                this.historyLock = true;
            } else if (autoCompleter && autoCompleter.state.list.length) {
                if (autoCompleter.state.list.length === 1 && autoCompleter.state.list2.length) {
                    autoCompleter.setState({
                        focusIdx2: (
                            autoCompleter.state.list2.length + autoCompleter.state.focusIdx2 - 1
                        ) % autoCompleter.state.list2.length
                    });
                } else {
                    autoCompleter.setState({
                        focusIdx: (
                            autoCompleter.state.list.length + autoCompleter.state.focusIdx - 1
                        ) % autoCompleter.state.list.length
                    });
                }
            }
        }, 10);
        addHotKey(`#command-box-${ this.containerID }`, ["down"], () => {
            const autoCompleter = AutoCompleter.getRef();
            if ((
                (
                    $(`#command-box-${ this.containerID } input`).val()! as string
                ).length === 0 || this.historyIdx !== -1
            ) && this.history.length) {
                if (this.historyIdx !== -1 && this.historyIdx < this.history.length - 1) {
                    this.historyLock = true;
                    this.historyIdx += 1;
                    const cmd: string = this.history[this.historyIdx];
                    $(`#command-box-${ this.containerID } input`).val(cmd);
                    this.parse(cmd);
                }
            } else if (autoCompleter && autoCompleter.state.list.length) {
                if (autoCompleter.state.list.length === 1 && autoCompleter.state.list2.length) {
                    autoCompleter.setState({
                        focusIdx2: (
                            autoCompleter.state.focusIdx2 + 1
                        ) % autoCompleter.state.list2.length
                    });
                } else {
                    autoCompleter.setState({
                        focusIdx: (
                            autoCompleter.state.focusIdx + 1
                        ) % autoCompleter.state.list.length
                    });
                }
            }
        }, 10);
        addHotKey(`#command-box-${ this.containerID }`, ["enter"], () => {
            this.run();
        }, 10);
    }

    public componentDidUpdate(): void {
        $(`#command-box-${ this.containerID } input`).val("");
        if (this.state.active) {
            $(`#command-box-${ this.containerID } input`).focus();
        }
        AutoCompleter.hide();
    }

    public componentWillUnmount(): void {
        AutoCompleter.hide();
        removeHotKey(`#command-box-${ this.containerID }`, ["esc"]);
        removeHotKey(`#command-box-${ this.containerID }`, ["tab"]);
        removeHotKey(`#command-box-${ this.containerID }`, ["up"]);
        removeHotKey(`#command-box-${ this.containerID }`, ["down"]);
        removeHotKey(`#command-box-${ this.containerID }`, ["enter"]);
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
        AutoCompleter.hide();
        if (this.state.active) {
            $(`#command-box-${ this.containerID } input`).val("");
            this.setState({
                active: false
            });
        }
    }

    protected parse(value: string): void {
        value = value.trimLeft();

        const offset = $(`#command-box-${ this.containerID } input`).offset()!;
        
        if (value.replace(" ", "").length === 0) {
            AutoCompleter.hide();
            return;
        }

        AutoCompleter.show(value, offset.left, offset.top);
    }

    protected run(): void {
        const command: string = $(`#command-box-${ this.containerID } input`).val()! as string | "";

        if (!command.trim().includes(" ")) {
            const name = command.trim();
            if (name && CommandDict[name]) {
                CommandDict[name].execute(parseParams(CommandDict[name], command));
            } else {
                console.error(`Can't resolve command: ${ command }`);
            }
        } else if (AutoCompleter.getRef()?.state.list.length === 1) {
            const name = AutoCompleter.getRef()!.state.list[0];
            if (name && CommandDict[name]) {
                CommandDict[name].execute(parseParams(CommandDict[name], command));
            } else {
                console.error(`Can't resolve command: ${ command }`);
            }
        } else {
            console.error(`Can't resolve command: ${ command }`);
        }
        
        this.history = [...this.history, command].slice(0, 10);

        $(`#command-box-${ this.containerID } input`).val("");

        this.setState({
            active: false
        });
    }

};
