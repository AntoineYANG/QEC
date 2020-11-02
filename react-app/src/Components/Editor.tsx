/*
 * @Author: Kanata You 
 * @Date: 2020-11-02 23:45:16 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2020-11-03 00:06:21
 */

import React, { Component } from "react";
import $ from "jquery";


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

    public constructor(props: EditorProps) {
        super(props);
        this.state = {};

        this.textarea = React.createRef<HTMLTextAreaElement>();
    }

    public render(): JSX.Element {
        return (
            <div className="editor" >
                <textarea ref={ this.textarea } spellCheck={ false }
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
    }

    public componentDidUpdate(): void {
        $(this.textarea.current!).val(this.state.file?.data || "");
    }

};
