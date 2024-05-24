#!/usr/bin/node

// Copyright © 2024- Luka Ivanović
// This code is licensed under the terms of the ISC licence (see LICENCE for details)

Array.prototype.pops = function () {
    this.pop();
    return this;
};
Array.prototype.shifts = function () {
    this.shift();
    return this;
};
Array.prototype.cleans = function () {
    return this.pops().shifts();
}

let data = '';
process.stdin.on('data', chunk => {
    data += chunk;
});

process.stdin.on('end', () => {
    data = data.trim();
    let lines = data.split("\n");
    let scheme = lines.at(0).trim().split("|").map(name => name.trim()).cleans();
    let format = lines.at(1).trim().split("|").map(name => name.trim()).cleans().map(format => {
        if (format.startsWith(":") && format.endsWith(":")) {
            return "center"
        } else if (format.endsWith(":")) {
            return "right"
        } else {
            return "left"
        }
    })
    for (let i = format.length; i < scheme.length; i += 1) {
        format.push("left");
    }
    const rows = [];
    let width = []
    if (Array.isArray(scheme)) width = scheme.map(s => s.length + 2);
    lines = lines.slice(2);
    let i = 3;
    for (let line of lines) {
        const fields = line.trim().split("|").map(name => name.trim()).cleans();
        // here we should report if there is missing fields
        fields.map((field, i) => {
            if (field.length + 2 > width[i]) {
                width[i] = field.length + 2;
            }
        })
        rows.push(fields);
        i += 1
    }
    console.log("|" + scheme.map((s, i) => {
        return pad(s, width[i], format[i]);
    }).join("|") + "|")
    console.log("|" + format.map((f, i) => {
        switch (f) {
            case "left":
                return " " + ":" + "-".repeat(width[i] - 3) + " ";
            case "right":
                return " " + "-".repeat(width[i] - 3) + ":" + " ";
            case "center":
                return " " + ":" + "-".repeat(width[i] - 4) + ":" + " ";
            default:
                return ""
        }
    }).join("|") + "|")
    rows.forEach(row => {
        console.log("|" + row.map((r, i) => {
            return pad(r, width[i], format[i]);
        }).join("|") + "|")
    })
});

process.stdin.resume();

function pad(text, width, alignment) {
    if ((text.length + 2) > width) {
        console.error("cannot fit `", text, "` int desired width");
        return text
    }
    width -= 2;
    width -= text.length;
    let res = " ";
    switch (alignment) {
        case "center":
            const start = Math.floor(width / 2);
            const end = width - start;
            res += " ".repeat(start);
            res += text;
            res += " ".repeat(end);
            break;
        case "left":
            res += text;
            res += " ".repeat(width)
            break;
        case "right":
            res += " ".repeat(width);
            res += text;
            break;
        default:
            console.error("invalid alignment")
    }
    res += " ";
    return res;
}
