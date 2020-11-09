/*
 * @Author: Kanata You 
 * @Date: 2020-11-02 21:10:45 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2020-11-09 15:24:25
 */

const express = require('express');
const app = express();
const fs = require("fs");
const process = require('child_process');
const bodyParser = require('body-parser');


app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(bodyParser.json());


const decodeIPC = str => str.split("$s").join("/").split("$d").join(".");


let config = {
    storagePath: "e:/zone/storage"
};


const getStoragePath = path => {
    return (config.storagePath + "/" + (
        path.split("/").join("_@s_").split(".").join("_@d_")
    )).split(/\/\.?\//).join("/") + ".tmp";
};

const getParentPath = path => {
    let pl = path.split("/");
    
    pl = pl.filter((d, i) => {
        return i === pl.length - 1 && d === "" ? false : true;
    });
    
    return pl.map((d, i) => {
        return i === pl.length - 1 ? "" : d;
    }).join("/");
};

const accessPath = (path, onfulfilled, onrejected) => {
    if (fs.existsSync(path)) {
        onfulfilled();
    } else {
        try {
            fs.mkdirSync(path);
            onfulfilled();
        } catch (err) {
            if (err.errno === -4058) {
                accessPath(getParentPath(path), () => {
                    onfulfilled();
                }, onrejected);
            } else {
                onrejected(err);
            }
        }
    }
};

const accessFile = (path, data, onfulfilled, onrejected) => {
    try {
        fs.writeFileSync(path, data);
        onfulfilled();
    } catch (err) {
        if (err.errno === -4058) {
            accessPath(getParentPath(path), () => {
                accessFile(path, data, onfulfilled, onrejected);
            }, onrejected);
        } else {
            onrejected(err);
        }
    }
};


app.get("/initConfig", (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:3000");
    fs.readFile("./public/config.json", (err, data) => {
        if (err) {
            res.send(null);
        } else {
            const c = JSON.parse(data);
            for (const key in c) {
                if (c.hasOwnProperty(key) && config.hasOwnProperty(key)) {
                    config[key] = c[key];
                }
            }
            res.send(config);
        }
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
    const filename = decodeIPC(req.params["filename"]);
    const existedOnly = req.params["existedOnly"] === "1";
    const clearWhenOpen = req.params["clearWhenOpen"] === "1";
    res.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:3000");

    if (clearWhenOpen) {
        accessFile(getStoragePath(filename), "", () => {
            res.json({
                path: filename,
                data: "" + (fs.readFileSync(getStoragePath(filename)))
            });
        }, err => {
            res.send(err);
        });
    } else {
        fs.readFile(getStoragePath(filename), (err, data) => {
            if (err) {
                fs.readFile(filename, (err, data) => {
                    if (err) {
                        if (err.errno === -4058 && !existedOnly) {
                            accessFile(filename, "", () => {
                                res.json({
                                    path: filename,
                                    data: "" + (fs.readFileSync(filename))
                                });
                            }, err => {
                                res.send(err);
                            });
                        } else {
                            res.send(err);
                        }
                    } else {
                        res.json({
                            path: filename,
                            data: "" + (data),
                            modified: false
                        });
                    }
                });
            } else {
                res.json({
                    path: filename,
                    data: "" + (data),
                    modified: true
                });
            }
        });
    }
});

app.post("/as/:file", (req, res) => {
    const file = decodeIPC(req.params["file"]);
    const data = req.body["data"] || "";

    res.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:3000");
    const path = getStoragePath(file);

    accessFile(path, data, () => {
        res.send(true);
    }, err => {
        res.send(err);
    });
});

app.post("/s/:file/:filename", (req, res) => {
    const file = decodeIPC(req.params["file"]);
    const filename = decodeIPC(req.params["filename"]);
    const data = req.body["data"] || "";
    const path = getStoragePath(file);

    res.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:3000");

    accessFile(path, data, () => {
        fs.readFile(path, (err, data) => {
            if (err) {
                res.send(err);
            } else {
                accessFile(filename === "OVERWRITE" ? file : filename, data, () => {
                    fs.unlinkSync(path);
                    res.send(true);
                }, err => {
                    res.send(err);
                });
            }
        });
    }, err => {
        res.send(err);
    });
});


const server = app.listen(2369, () => {
    const addr = server.address().address;
    const host = addr === "::" ? "127.0.0.1" : addr;
    const port = server.address().port;
    console.log("Back-end server opened at http://" + host + ":" + port);
});
