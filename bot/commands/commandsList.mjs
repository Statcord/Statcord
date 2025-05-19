import botinfo from './botinfo.mjs'
import bots from './bots.mjs';

const files = [
	botinfo,
	bots
];

export default new Map(
	files.map((file) => {
		return [file.name, file];
	}),
);