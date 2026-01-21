import botinfo from './botinfo.mjs'
import bots from './bots.mjs';
import graph from './graph.mjs';

const files = [
	botinfo,
	bots,
	graph
];

export default new Map(
	files.map((file) => {
		return [file.name, file];
	}),
);