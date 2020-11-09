/*
 * @Author: Kanata You 
 * @Date: 2020-11-02 23:45:16 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2020-11-09 15:25:58
 */

import React, { Component } from "react";
import axios from "axios";
import $ from "jquery";
import { initHotKeyListeners, addHotKey, removeHotKey } from "../Shared/Listeners";
import { Main } from "../WindowAppearance/Main";
import { encodeIPC } from "../Shared/Helper";


export interface EditorProps {};

export interface EditorState {
    file?: {
        path: string;
        data: string;
    };
};

export class Editor extends Component<EditorProps, EditorState> {

    protected textarea: React.RefObject<HTMLTextAreaElement>;
    public static curRef: Editor | null = null;
    protected readonly containerID: number;

    protected autoSaveLock: boolean;

    public constructor(props: EditorProps) {
        super(props);
        this.state = {};

        this.containerID = Math.floor(Math.random() * 1000000);

        this.textarea = React.createRef<HTMLTextAreaElement>();

        this.autoSaveLock = false;
    }

    public render(): JSX.Element {
        return (
            <div className="editor" id={ `editor-box-${ this.containerID }` }
            onKeyDown={
                e => {
                    e.stopPropagation();
                }
            } >
                <textarea ref={ this.textarea } spellCheck={ false }
                onChange={
                    () => {
                        this.autoSave();
                    }
                }
                style={{
                    width: "calc(100vw - 24px)",
                    padding: "12px 20px",
                    height: "calc(100vh - 52px)",
                    border: "none",
                    resize: "none",
                    background: "none",
                    color: "rgb(200,200,200)"
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
        $(this.textarea.current!).val(this.state.file?.data || "").focus();
    }

    public static getData(): string {
        return Editor.curRef?.textarea.current ? $(
            Editor.curRef.textarea.current
        ).val()! as string || "" : "";
    }

    protected autoSave(): void {
        if (this.autoSaveLock) {
            return;
        } else if (this.state.file) {
            this.autoSaveLock = true;

            axios.post(
                `/as/${ encodeIPC(this.state.file.path) }`, {
                    data: $(this.textarea.current!).val()! as string || ""
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
