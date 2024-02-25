import fs from "fs";

export const readFile = (path: string) => {
    const data = fs.readFileSync(path, 'utf-8');
    return JSON.parse(data);
}

export const writeFile = (path: string, data: string) => {
    fs.writeFileSync(path, data);
}

export const getUniqueID = () => {
    return Math.ceil(Math.random()*10000);
}