import fs from 'fs/promises';
import path from 'path';

const dataDirectory = path.join(process.cwd(), 'src/data');

export async function getJSONData(filename: string) {
    try {
        const filePath = path.join(dataDirectory, filename);
        const fileContents = await fs.readFile(filePath, 'utf8');
        return JSON.parse(fileContents);
    } catch (error) {
        console.error(`Error reading ${filename}:`, error);
        throw new Error(`Could not read data from ${filename}`);
    }
}

export async function writeJSONData(filename: string, data: any) {
    try {
        const filePath = path.join(dataDirectory, filename);
        await fs.writeFile(filePath, JSON.stringify(data, null, 4), 'utf8');
    } catch (error) {
        console.error(`Error writing ${filename}:`, error);
        throw new Error(`Could not write data to ${filename}`);
    }
}
