import fs from 'fs/promises';
import { pascal } from 'radash';
import { fileURLToPath } from 'url';
import { relative } from 'path';

const ICONS = [];
const SOURCES = [
	'entypo/Entypo',
	'entypo/Entypo Social Extension',
];

for (const source of SOURCES) {
	const files = await fs.readdir(source);

	for (const file of files) {
		const filePath = new URL(`${source}/${file}`, import.meta.url);
		const fileName = 'entypo' + pascal(file.replace('.svg', ''));

		const iconContents = await fs.readFile(filePath, 'utf-8');
		const path = iconContents.match(/\bd="([^"]+)"/)[1].replace(/\s+/g, '');

		ICONS.push({
			raw: relative('.', fileURLToPath(filePath)),
			name: fileName,
			path: path
		})
	}
}

let indexText = '';
let markdownText = '| Name | Preview |\n| --- | --- |\n';


ICONS.forEach(icon => {
	indexText += `export const ${icon.name} = '${icon.path}';\n`;
	markdownText += `| \`${icon.name}\` | <img src="${icon.raw}">\n`;
});

fs.writeFile('src/index.ts', indexText);
fs.writeFile('ICONS.md', markdownText);
