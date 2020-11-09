/*
 * @Author: Kanata You 
 * @Date: 2020-10-28 19:20:37 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2020-11-09 15:23:34
 */


import axios from "axios";
import { encodeIPC } from "../Shared/Helper";
import { Main } from "../WindowAppearance/Main";
import { Editor } from "../Components/Editor";


export type Command<P extends string | never = string, A extends string | never = string> = {
    params: Array<{
        name: P;
        description: string;
        default?: string;
        autoComplete?: (input: string) => Promise<string[]>;
    }>;
    args: Array<{
        name: A;
        requireValue: boolean;
        description: string;
        autoComplete?: (input: string) => Promise<string[]>;
    }>;
    description: string;
    execute: (paramParser: ParamParser<P, A>) => void;
};


const pathAutoComplete = async (input: string) => {
    input = input.trim();
    let list: Array<string> = [];

    if (input) {
        if (input.endsWith("/")) {
            await axios.get<string[] | null>("/ls/" + encodeIPC(input)).then(value => {
                if (value && value.data !== null) {
                    try {
                        list = value.data.map(d => input + d);
                    } catch {}
                }
            });
        } else if (input.includes("/")) {
            const routes = input.split("/");
            const parent = routes.map(
                (s, i) => i < routes.length - 1 ? s : ""
            ).join("/");
            const current = routes[routes.length - 1];
            const pattern = new RegExp(current.toLowerCase().split("").join(".*"));
            await axios.get<string[] | null>("/ls/" + encodeIPC(parent)).then(value => {
                if (value && value.data !== null) {
                    try {
                        list = value.data.filter(
                            d => pattern.test(d.toLowerCase())
                        ).map(
                            d => parent + d
                        );
                    } catch {}
                }
            });
        }
    }
    
    return list;
};

export const CommandDict: {[name: string]: Command<string | never, string | never>;} = {
    op: {
        params: [{
            name: "filename",
            description: "the file you want to open",
            autoComplete: pathAutoComplete
        }],
        args: [{
            name: "-e",
            requireValue: false,
            description: "reject if the file does not exist"
        }, {
            name: "-clear",
            requireValue: false,
            description: "clear the file if it has already exist"
        }],
        description: "Open or create a file to edit.",
        execute: (paramParser: ParamParser<"filename", "-e" | "-clear">) => {
            const filename: string = paramParser.getParam("filename") || "";
            const existedOnly = paramParser.getArgs("-e");
            const clearWhenOpen = paramParser.getArgs("-clear");

            axios.get<{ path: string; data: string; }>(
                `/op/${ encodeIPC(filename) }/${ existedOnly ? 1 : 0 }/${ clearWhenOpen ? 1 : 0 }`
            ).then(value => {
                Main.loadFile(value.data);
            }).catch(err => {
                console.error("command op", err)
            });
        }
    },
    opdir: {
        params: [{
            name: "foldername",
            description: "the folder you want to open",
            autoComplete: pathAutoComplete
        }],
        args: [],
        description: "Open a folder to edit.",
        execute: (_paramParser: ParamParser<"foldername", never>) => {}
    },
    opwsp: {
        params: [{
            name: "filename",
            description: "the workspace you want to open",
            autoComplete: pathAutoComplete
        }],
        args: [],
        description: "Open a workspace to edit.",
        execute: (_paramParser: ParamParser<"filename", never>) => {}
    },
    s: {
        params: [{
            name: "filename",
            default: "OVERWRITE",
            description: "the new filename to be saved as, default to overwrite",
            autoComplete: pathAutoComplete
        }],
        args: [],
        description: "Save the current editing file.",
        execute: (paramParser: ParamParser<"filename", never>) => {
            if (Editor.curRef?.state.file) {
                const filename: string = paramParser.getParam("filename") || "";
    
                axios.post<{ path: string; data: string; }>(
                    `/s/${
                        encodeIPC(Editor.curRef.state.file.path)
                    }/${
                        encodeIPC(filename) || "OVERWRITE"
                    }`, {
                        data: Editor.getData()
                    }
                ).catch(err => {
                    console.error("command s", err)
                });
            }
        }
    }
};

export type ParamParser<P extends string, A extends string> = {
    getParam: (p: P) => string | undefined;
    getArgs: (a: A) => string | undefined | true;
};

export const parseParams = <P extends string, A extends string>(cmd: Command, input: string): ParamParser<P, A> => {
    let params: {[name: string]: string} = {};
    let args: {[name: string]: string | true} = {};

    let paramIdx: number = 0;
    let argName: string | null = null;
    let argWaitingForValue: boolean = false;
    
    input.split(/ {1,}/).slice(1).forEach(b => {
        const argSet = cmd.args.filter(
            a => a.name === b
        );
        if (argSet.length) {
            argName = b;
            if (argSet[0].requireValue) {
                argWaitingForValue = true;
            } else {
                args[argName] = true;
                argWaitingForValue = false;
            }
        } else {
            if (argName && argWaitingForValue) {
                args[argName] = b;
                argWaitingForValue = false;
            } else if (cmd.params[paramIdx]) {
                params[cmd.params[paramIdx].name] = b;
                paramIdx += 1;
                argName = null;
            }
        }
    });

    return {
        getParam: (p: P) => params[p],
        getArgs: (a: A) => args[a]
    };
};
