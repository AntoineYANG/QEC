/*
 * @Author: Kanata You 
 * @Date: 2020-10-28 20:08:55 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2020-11-02 23:16:04
 */

import React, { Component } from "react";
import $ from "jquery";
import { CommandDict, parseParams } from "../Handlers/CommandParser";


export interface AutoCompleterProps {};

export interface AutoCompleterState {
    active: boolean;
    x: number;
    y: number;
    list: Array<string>;
    list2: Array<string>;
    currentParam: null | number | string;
    focusIdx: number;
    focusIdx2: number;
};

export class AutoCompleter extends Component<AutoCompleterProps, AutoCompleterState> {

    protected static currentRef: AutoCompleter | null = null;

    public static getRef() {
        return AutoCompleter.currentRef;
    }

    public static show(value: string, x?: number, y?: number): void {
        if (AutoCompleter.currentRef) {
            if (value.includes(" ")) {
                const name: string = value.split(" ")[0];
                if (CommandDict[name]) {
                    let paramIdx: number = 0;
                    let argName: string | null = null;
                    let argWaitingForValue: boolean = false;
                    
                    value.split(/ {1,}/).slice(1).forEach(b => {
                        const argSet = CommandDict[name].args.filter(
                            a => a.name === b
                        );
                        if (argSet.length) {
                            argName = b;
                            argWaitingForValue = argSet[0].requireValue;
                        } else {
                            if (argWaitingForValue) {
                                argWaitingForValue = false;
                            } else {
                                paramIdx += 1;
                                argName = null;
                            }
                        }
                    });

                    const curParam: number | string | null = ((
                        argName as string | null
                    ) ?? paramIdx) || null;

                    AutoCompleter.currentRef.setState({
                        list: [name],
                        list2: [],
                        focusIdx: 0,
                        focusIdx2: 0,
                        currentParam: curParam,
                        active: true,
                        x: x || AutoCompleter.currentRef.state.x,
                        y: y || AutoCompleter.currentRef.state.y
                    });

                    if (curParam) {
                        const getter = parseParams(CommandDict[name], value);

                        if (typeof curParam === "string") {
                            const check = CommandDict[name].args.filter(
                                d => d.name === curParam
                            )[0].autoComplete;

                            if (check) {
                                check(getter.getParam(curParam) || "").then(value => {
                                    if (value) {
                                        AutoCompleter.currentRef?.setState({
                                            list2: value,
                                            focusIdx2: 0,
                                            active: true
                                        });
                                    }
                                });
                            }
                        } else if (curParam - 1 < CommandDict[name].params.length) {
                            const check = CommandDict[name].params[
                                curParam - 1
                            ].autoComplete;
                            
                            if (check) {
                                check(getter.getParam(
                                    CommandDict[name].params[curParam - 1].name
                                ) || "").then(value => {
                                    if (value) {
                                        AutoCompleter.currentRef?.setState({
                                            list2: value,
                                            focusIdx2: 0,
                                            active: true
                                        });
                                    }
                                });
                            }
                        }
                    }
                } else {
                    AutoCompleter.currentRef.setState({
                        list: [],
                        list2: [],
                        focusIdx: 0,
                        focusIdx2: 0,
                        currentParam: null,
                        active: false
                    });
                }
            } else {
                const pattern = new RegExp(value.split("").join(".*").toLowerCase());

                AutoCompleter.currentRef.setState({
                    list: Object.keys(CommandDict).filter(
                        keyname => pattern.test(keyname.toLowerCase())
                    ),
                    focusIdx: 0,
                    currentParam: null,
                    active: true,
                    x: x || AutoCompleter.currentRef.state.x,
                    y: y || AutoCompleter.currentRef.state.y
                });
            }
        }
    }

    public static hide(): void {
        if (AutoCompleter.currentRef) {
            AutoCompleter.currentRef.setState({
                active: false
            });
        }
    }

    public constructor(props: AutoCompleterProps) {
        super(props);
        this.state = {
            active: false,
            x: 200,
            y: 200,
            list: [],
            list2: [],
            currentParam: null,
            focusIdx: 0,
            focusIdx2: 0
        };
    }

    public render(): JSX.Element {
        const currentCmd = CommandDict[this.state.list[this.state.focusIdx]];

        let currentDescr: string = "";

        if (currentCmd && this.state.currentParam !== null) {
            if (typeof this.state.currentParam === "string") {
                currentDescr = currentCmd.args.filter(
                    d => d.name === this.state.currentParam
                )[0].description;
            } else if (currentCmd.params.length > this.state.currentParam - 1) {
                currentDescr = currentCmd.params[this.state.currentParam - 1].description;
            }
        }

        const srcList = this.state.currentParam ? this.state.list2 : this.state.list;
        
        const count: number = srcList.length;
        const maxPerPage: number = 10;

        const startIdx: number = Math.floor(
            (this.state.currentParam ? this.state.focusIdx2 : this.state.focusIdx)
            / maxPerPage
        ) * maxPerPage;

        let list: Array<string> = [];

        if (count <= maxPerPage) {
            list = this.state.currentParam ? this.state.list2 : this.state.list;
        } else {
            for (let i: number = startIdx; i < startIdx + maxPerPage && i < count; i++) {
                list.push(srcList[i])
            }
        }

        return (
            <div style={{
                zIndex: 10000,
                position: "fixed",
                left: this.state.x,
                bottom: $(window).innerHeight()! - this.state.y,
                pointerEvents: "none",
                display: this.state.active && this.state.list.length ? "flex" : "none",
                flexDirection: "column"
            }} >
                {
                    currentCmd ? (
                        <div key="detail" style={{
                            color: "rgb(64,172,225)",
                            border: `1px solid rgb(91,95,97)`,
                            borderBottom: "none",
                            padding: "0.3em 0.7em",
                            width: "32.6em",
                            background: `rgb(26,29,33)`
                        }} >
                            <label>
                                <span key="name" >
                                    { this.state.list[this.state.focusIdx] + " " }
                                </span>
                                {
                                    currentCmd.params.map(
                                        (d, i) => (
                                            i + 1 === this.state.currentParam ? (
                                                <span key={ `param_${ i }` } >
                                                    <b>
                                                        { " " }
                                                        <u>
                                                            { `[${ d.name }]` }
                                                        </u>
                                                    </b>
                                                </span>
                                            ) : (
                                                <span key={ `param_${ i }` } >
                                                    { ` [${ d.name }]` }
                                                </span>
                                            )
                                        )
                                    )
                                }
                                {
                                    currentCmd.args.map(
                                        (d, i) => (
                                            d.name === this.state.currentParam ? (
                                                <span key={ `arg_${ d.name }` } >
                                                    <b>
                                                        { i ? "|" : " " }
                                                        <u>
                                                        {
                                                            `${ d.name }${
                                                                d.requireValue ? "()" : ""
                                                            }`
                                                        }
                                                        </u>
                                                    </b>
                                                </span>
                                            ) : (
                                                <span key={ `arg_${ d.name }` } >
                                                    {
                                                        `${
                                                            i ? "|" : " "
                                                        }${ d.name }${
                                                            d.requireValue ? "()" : ""
                                                        }` }
                                                </span>
                                            )
                                        )
                                    )
                                }
                            </label>
                            {
                                this.state.currentParam === null ? null : (
                                    <div key="cmd-descri" >
                                        <small>
                                            <i>
                                                { currentCmd.description }
                                            </i>
                                        </small>
                                    </div>
                                )
                            }
                            {
                                currentDescr ? (
                                    <>
                                        <div key="paramDescr" style={{
                                            borderTop: "1px solid rgba(64, 172, 225, 0.5)",
                                            marginTop: "0.5em",
                                            padding: "0.2em 0 0.1em"
                                        }} >
                                            <small>
                                                { currentDescr }
                                            </small>
                                        </div>
                                    </>
                                ) : null
                            }
                        </div>
                    ) : (
                        <div key="unknown" style={{
                            color: "rgb(64,172,225)",
                            border: `1px solid rgb(91,95,97)`,
                            borderBottom: "none",
                            padding: "0.3em 0.7em",
                            background: `rgb(26,29,33)`,
                            width: "32em"
                        }} >
                            <label>
                                Unknown command
                            </label>
                        </div>
                    )
                }
                {
                    this.state.list.length ? (
                        <div key="list" style={{
                            display: "flex",
                            flexDirection: "column",
                            color: "rgb(64,172,225)",
                            fontWeight: "bold",
                            border: `1px solid rgb(91,95,97)`,
                            background: `rgb(26,29,33)`
                        }} >
                        {
                            count > maxPerPage ? (
                                <div key="page-count" style={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    fontWeight: "normal",
                                    color: "rgb(200,200,200)"
                                }} >
                                    <label style={{
                                        display: "inline-block",
                                        padding: "0.2em 1em",
                                        width: "6em",
                                        textAlign: "right"
                                    }} >
                                    {
                                        `${ (
                                            this.state.currentParam ? this.state.focusIdx2 : this.state.focusIdx
                                        ) + 1 }/${ count }`
                                    }
                                    </label>
                                </div>
                            ) : null
                        }
                        {
                            this.state.currentParam === null ? (
                                list.map((item, i) => {
                                    return (
                                        <div key={ i }
                                        style={{
                                            display: "flex"
                                        }} >
                                            <label key="name" style={{
                                                display: "inline-block",
                                                padding: "0.3em 1em",
                                                width: "6em",
                                                background: i + startIdx === this.state.focusIdx ? (
                                                    "rgb(52,57,64)"
                                                ) : ""
                                            }} >
                                                { item }
                                            </label>
                                            <label key="descri" style={{
                                                display: "inline-block",
                                                padding: "0.3em 1em",
                                                width: "24em",
                                                background: i + startIdx === this.state.focusIdx ? (
                                                    "rgb(52,57,64)"
                                                ) : "",
                                                fontWeight: "normal"
                                            }} >
                                                { CommandDict[item].description }
                                            </label>
                                        </div>
                                    );
                                })
                            ) : (
                                list.map((item, i) => {
                                    return (
                                        <div key={ i }
                                        style={{
                                            display: "flex"
                                        }} >
                                            <label key="name" style={{
                                                display: "inline-block",
                                                padding: "0.12em 1em",
                                                width: "31.4em",
                                                background: i + startIdx === this.state.focusIdx2 ? (
                                                    "rgb(52,57,64)"
                                                ) : ""
                                            }} >
                                                { item.split("/").reverse()[0] }
                                            </label>
                                        </div>
                                    );
                                })
                            )
                        }
                        </div>
                    ) : null
                }
            </div>
        );
    }

    public componentDidMount(): void {
        AutoCompleter.currentRef = this;
    }

};
