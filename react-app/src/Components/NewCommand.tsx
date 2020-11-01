/*
 * @Author: Kanata You 
 * @Date: 2020-10-22 00:32:54 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2020-11-02 01:47:25
 */

import React, { Component } from "react";
import $ from "jquery";
import { addHotKey, removeHotKey, initHotKeyListeners } from "../Shared/Listeners";
import { CommandDict, parseParams } from "../Handlers/CommandParser";
import { AutoCompleter } from "./AutoCompleter";


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
                const name = autoCompleter.state.list[autoCompleter.state.focusIdx];
                if (name) {
                    const val: string = (
                        $(`#command-box-${ this.containerID } input`).val()! as string
                    ).trimLeft();
                    if (val.includes(" ")) {
                        const curParam = autoCompleter.state.currentParam;
                        if (curParam !== null) {
                            // const getter = parseParams(CommandDict[name], val);
                            // let check: (input: string) => Array<string> = () => [];
                            // if (typeof curParam === "string") {
                            //     check = CommandDict[name].args.filter(
                            //         d => d.name === name
                            //     )[0].autoComplete || check;
                            // } else if (curParam - 1 < CommandDict[name].params.length) {
                            //     check = CommandDict[name].params[
                            //         curParam - 1
                            //     ].autoComplete || check;
                            // }
                            // console.log(check(val));
                        }
                    } else {
                        $(`#command-box-${ this.containerID } input`).val(
                            name + " "
                        );
                        this.parse(name + " ");
                    }
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
                autoCompleter.setState({
                    focusIdx: (
                        autoCompleter.state.list.length + autoCompleter.state.focusIdx - 1
                    ) % autoCompleter.state.list.length
                });
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
                autoCompleter.setState({
                    focusIdx: (
                        autoCompleter.state.focusIdx + 1
                    ) % autoCompleter.state.list.length
                });
            }
        }, 10);
        addHotKey(`#command-box-${ this.containerID }`, ["enter"], () => {
            this.run();
        }, 10);
    }

    public componentDidUpdate(): void {
        if (this.state.active) {
            $(`#command-box-${ this.containerID } input`).val("").focus();
        }
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
        
        this.history = [...this.history, command].slice(0, 10);

        $(`#command-box-${ this.containerID } input`).val("");
        this.parse("");
    }

};
