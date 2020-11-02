/*
 * @Author: Kanata You 
 * @Date: 2020-11-02 21:10:45 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2020-11-02 23:43:25
 */

const express = require('express');
const app = express();
const fs = require("fs");
const process = require('child_process');


const decodeIPC = str => str.split("$s").join("/").split("$d").join(".");


app.get("/", (req, res) => {
    res.send({
        success: true
    });
});

app.get("/ls/:dir", (req, res) => {
    const dir = decodeIPC(req.params["dir"]);
    res.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:3000");
    fs.readdir(dir, (err, files) => {
        if (err) {
            res.send(null);
        } else {
            res.send(files);
        }
    });
});

app.get("/op/:filename/:existedOnly/:clearWhenOpen", (req, res) => {
    filename = decodeIPC(req.params["filename"]);
    existedOnly = req.params["existedOnly"] === 1;
    clearWhenOpen = req.params["clearWhenOpen"] === 1;
    res.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:3000");
    fs.readFile(filename, (err, data) => {
        if (err) {
            if (err.errno === -4058 && !existedOnly) {
                fs.writeFileSync(filename, "");
                res.json({
                    path: filename,
                    data: "" + (fs.readFileSync(filename))
                });
            } else {
                res.send(err);
            }
        } else {
            res.json({
                path: filename,
                data: "" + (data)
            });
        }
    });
});


const server = app.listen(2369, () => {
    const addr = server.address().address;
    const host = addr === "::" ? "127.0.0.1" : addr;
    const port = server.address().port;
    console.log("Back-end server opened at http://" + host + ":" + port);
});
