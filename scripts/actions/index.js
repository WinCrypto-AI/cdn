const Handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');
function camelCaseToDash(myStr) {
    if (myStr) {
        return myStr.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    }
    return '';
}
function toProperCase(value) {
    if (value) {
        return value.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1); });
    }
    return '';
};
function toLowerCase(value) {
    if (value) {
        return new Handlebars.SafeString(value.toLowerCase());
    } else {
        return '';
    }
}
function toUpperCase(value) {
    if (value) {
        return new Handlebars.SafeString(value.toUpperCase());
    } else {
        return '';
    }
}
function toLowerFistCase(value) {
    if (value) {
        return value[0].toLowerCase() + value.substr(1);
    } else {
        return '';
    }
}
function dashToCamelCase(value) {
    const REGEX = /[-_]+(.)?/g;
    function toUpper(match, group1) {
        return group1 ? group1.toUpperCase() : '';
    }
    return value.replace(REGEX, toUpper);
}
function dashToProperCase(value) {
    const str = dashToCamelCase(value);
    return toProperCase(str);
}
Handlebars.registerHelper('toProperCase', toProperCase);
Handlebars.registerHelper('toLowerCase', toLowerCase);
Handlebars.registerHelper('toUpperCase', toUpperCase);
Handlebars.registerHelper('camelCaseToDash', camelCaseToDash);
Handlebars.registerHelper('toLowerFistCase', toLowerFistCase);
Handlebars.registerHelper('dashToProperCase', dashToProperCase);
class Action {
    createIndexByFolder = (forderPath) => {
        if (!forderPath) {
            throw "path empty";
        }
        if (forderPath.includes("@core") || forderPath.includes("@config")) {
            throw "Path system not change";
        }
        if (!fs.existsSync(forderPath)) {
            throw "path not existed";
        }

        const dirs = fs.readdirSync(forderPath, {
            encoding: 'utf-8'
        });

        if (dirs.length === 0) {
            return;
        }
        if (dirs.length === 1) {
            if (dirs[0] === "index.ts") {
                return;
            }
        }

        const pathIndex = path.join(forderPath, "index.ts");
        if (fs.existsSync(pathIndex)) {
            fs.truncateSync(pathIndex, 0)
        }
        for (const fileNameItem of dirs) {
            if (fileNameItem.includes(".DS_Store")) {
                continue;
            }
            const childPath = path.join(forderPath, fileNameItem);
            const isDirectory = fs.lstatSync(childPath).isDirectory();
            if (isDirectory) {
                const childDirs = fs.readdirSync(childPath, {
                    encoding: 'utf-8'
                });
                if (childDirs.length === 0) {
                    continue
                }
                this.createIndexByFolder(childPath)
            }
            if (forderPath.includes("services")) {
                if ((isDirectory && fileNameItem === "dto")) {
                    continue;
                }
            }

            if (fileNameItem === "index.ts") {
                continue;
            }
            const pathFileIndex = path.join(__dirname, '../templates/', 'index.hbs')
            const sourceIndex = fs.readFileSync(pathFileIndex, 'utf-8');
            const templateIndex = Handlebars.compile(sourceIndex);
            const contentsIndex = templateIndex({ file: fileNameItem.replace(".ts", "") });
            fs.appendFileSync(path.join(forderPath, 'index.ts'), "\r\n" + contentsIndex, {
                encoding: 'utf-8'
            })
        }

    }
}
const actions = new Action()
module.exports = actions;