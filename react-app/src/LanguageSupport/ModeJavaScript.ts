/*
 * @Author: Kanata You 
 * @Date: 2020-11-10 15:35:28 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2020-11-10 18:55:31
 */

import { HighlighterItem, getTokens } from "../Handlers/CodeHighlighter";
import { KeywordType } from "../Shared/Types";


export const ModeJavaScript: HighlighterItem = {
    name: "JavaScript",
    reg: ["js"],
    highlighter: (text: string) => {
        const reserved: {[key: string]: KeywordType;} = {
            arguments: "keyword",
            boolean: "type",
            break: "control",
            case: "control",
            catch: "control",
            class: "declare",
            const: "declare",
            continue: "control",
            debugger: "declare",
            default: "control",
            delete: "operator",
            do: "control",
            else: "control",
            enum: "declare",
            export: "modifier",
            extends: "operator",
            false: "constance",
            for: "control",
            function: "declare",
            if: "control",
            implements: "operator",
            import: "operator",
            in: "operator",
            instanceof: "operator",
            interface: "declare",
            let: "declare",
            new: "operator",
            null: "constance",
            private: "modifier",
            protected: "modifier",
            public: "modifier",
            return: "control",
            static: "modifier",
            super: "keyword",
            switch: "control",
            this: "keyword",
            throw: "control",
            true: "constance",
            try: "control",
            typeof: "operator",
            var: "declare",
            void: "type",
            while: "control",
            with: "control",
            yield: "control"
        };

        const tokens = getTokens(text).map(d => {
            if (reserved.hasOwnProperty(d)) {
                return `<code class="${ reserved[d] }" >${ d }</code>`;
            }
            return /[0-9]/.test(d[0]) ? `<code class="number" >${ d }</code>`
                : /[a-zA-Z$&]/.test(d[0]) ? `<code class="token" >${ d }</code>`
                : / {1,}/.test(d) && (
                    / {1,}/.exec(d)![0].length === d.length
                ) ? `<code class="space" >${
                    new Array(d.length).fill("·", 0, d.length).join("")
                }</code>`
                : d[0] === "_" ? `<code class="unused" >${ d }</code>`
                : `<code class="unknown" >${ d }</code>`;
        });

        return tokens.join("");
    }
};
