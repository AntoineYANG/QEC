/*
 * @Author: Kanata You 
 * @Date: 2020-11-02 23:45:16 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2020-11-10 18:50:36
 */

import React, { Component } from "react";
import axios from "axios";
import $ from "jquery";
import { initHotKeyListeners, addHotKey, removeHotKey } from "../Shared/Listeners";
import { Main } from "../WindowAppearance/Main";
import { encodeIPC } from "../Shared/Helper";
import { codeHighlighter } from "../Handlers/CodeHighlighter";


export interface EditorProps {};

export interface EditorState {
    file?: {
        path: string;
        data: string;
    };
};

export class Editor extends Component<EditorProps, EditorState> {

    protected codeContainer: React.RefObject<HTMLTextAreaElement>;
    protected codeCanvas: React.RefObject<HTMLDivElement>;
    public static curRef: Editor | null = null;
    protected readonly containerID: number;

    protected autoSaveLock: boolean;

    public constructor(props: EditorProps) {
        super(props);
        this.state = {};

        this.containerID = Math.floor(Math.random() * 1000000);

        this.codeContainer = React.createRef<HTMLTextAreaElement>();
        this.codeCanvas = React.createRef<HTMLDivElement>();

        this.autoSaveLock = false;
    }

    public render(): JSX.Element {
        return (
            <div className="editor" id={ `editor-box-${ this.containerID }` }
            onKeyDown={
                e => {
                    if (e.key === "Tab") {
                        const value = Editor.getData();
                        const selectionStart = this.codeContainer.current!.selectionStart;
                        const selectionEnd = this.codeContainer.current!.selectionEnd;
                        const left = value.substring(0, selectionStart);
                        const right = value.substring(selectionStart);
                        if (e.shiftKey) {
                            if (selectionStart === selectionEnd) {
                                for (let i: number = 4; i > 0; i--) {
                                    if (left.endsWith(new Array(i).fill(" ", 0, i).join(""))) {
                                        $(this.codeContainer.current!).val(
                                            left.substring(0, left.length - i) + right
                                        );
                                        this.highlight();
                                        this.autoSave();
                                        this.codeContainer.current!.setSelectionRange(
                                            selectionStart - i, selectionStart - i
                                        );
                                        return;
                                    }
                                }
                            }
                        } else {
                            if (selectionStart === selectionEnd) {
                                $(this.codeContainer.current!).val(left + "    " + right);
                                this.highlight();
                                this.autoSave();
                                this.codeContainer.current!.setSelectionRange(
                                    selectionStart + 4, selectionStart + 4
                                );
                            }
                        }
                    }
                    e.stopPropagation();
                }
            } >
                <div key="0" className="codeCanvas"
                ref={ this.codeCanvas } spellCheck={ false }
                style={{
                    width: "calc(100vw - 24px)",
                    padding: "12px 20px",
                    height: "calc(100vh - 52px)",
                    border: "none",
                    resize: "none",
                    background: "none",
                    fontSize: "13.6px",
                    whiteSpace: "pre",
                    lineHeight: "1.3em",
                    letterSpacing: "0.2px",
                    overflow: "scroll",
                    color: "rgb(200,200,200)"
                }} />
                <textarea key="1" className="codeContainer"
                ref={ this.codeContainer } spellCheck={ false }
                onInput={
                    () => {
                        this.highlight();
                        this.autoSave();
                    }
                }
                onScroll={
                    e => {
                        this.codeCanvas.current!.scrollTo(
                            e.currentTarget.scrollLeft,
                            e.currentTarget.scrollTop
                        );
                    }
                }
                style={{
                    width: "calc(100vw - 24px)",
                    padding: "12px 20px",
                    height: "calc(100vh - 52px)",
                    position: "relative",
                    top: "calc(28px - 100vh)",
                    border: "none",
                    resize: "none",
                    background: "none",
                    fontSize: "13.6px",
                    whiteSpace: "pre",
                    lineHeight: "1.3em",
                    letterSpacing: "0.2px",
                    overflow: "scroll",
                    color: "#FFFFFF00",
                    caretColor: "rgb(253,236,224)"
                }} />
            </div>
        );
    }

    public componentDidMount(): void {
        Editor.curRef = this;
        initHotKeyListeners(`#editor-box-${ this.containerID }`, false);
        addHotKey(`#editor-box-${ this.containerID }`, ["ctrl", "enter"], () => {
            Main.openCmd();
        }, 100);
    }

    public componentWillUnmount(): void {
        removeHotKey(`#editor-box-${ this.containerID }`, ["ctrl", "enter"]);
    }

    public componentDidUpdate(): void {
        $(this.codeContainer.current!).val(this.state.file?.data || "").focus();
        $(this.codeCanvas.current!).html((
            this.state.file?.data || ""
        ) + "<div style='width: 100%; height: 50vh;'></div>");
        this.highlight();
    }

    public static getData(): string {
        return Editor.curRef?.codeContainer.current ? $(
            Editor.curRef.codeContainer.current
        ).val()! as string || "" : "";
    }

    protected highlight(): void {
        if (this.state.file) {
            const data: string = codeHighlighter.parse(this.state.file.path, Editor.getData());
            // const pos = document.getSelection()?.getRangeAt(0);
            // console.log(pos);
            $(this.codeCanvas.current!).html(
                data + "<div style='width: 100%; height: 50vh;'></div>"
            );
        }
    }

    protected autoSave(): void {
        if (this.autoSaveLock) {
            return;
        } else if (this.state.file) {
            this.autoSaveLock = true;

            axios.post(
                `/as/${ encodeIPC(this.state.file.path) }`, {
                    data: $(this.codeContainer.current!).val()! as string || ""
                }
            ).then(value => {
                if (value.data === true) {
                    setTimeout(() => {
                        this.autoSaveLock = false;
                    }, 3000);
                }
            });
        }
    }

};
