/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */
import { Resvg, initWasm } from '@resvg/resvg-wasm';
import resvgwasm from './index_bg.wasm';

export default {
	async fetch(request, env, ctx) {
		console.log(request)
		try {
			await initWasm(resvgwasm);

			// const opts = {
			// 	font: {
			// 		loadSystemFonts: false,
			// 	},
			// };

			// 加载字体
			const fontData = await loadFont();

			const options = {
				...getOptionsFromUrl(request.url),
				fonts: [fontData],
				defaultFontFamily: {
					sansSerifFamily: 'Roboto',
					serifFamily: 'Roboto',
					cursiveFamily: 'Roboto',
					fantasyFamily: 'Roboto',
					monospaceFamily: 'Roboto',
				},
			};

			const resvg = new Resvg(generateSVG(1000), options);

			const pngData = resvg.render();
			const pngBuffer = pngData.asPng();


			return new Response(pngBuffer, {
				headers: {
					'Content-Type': 'image/png'
				},
				status: 200
			});
		} catch (error) {
			console.error('Resvg wasm not initialized');
			return new Response('Hello World!');
		}
	},
};

function generateSVG(milestone) {
	return `
		<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
		  <rect width="800" height="600" fill="#eaf0ff"/>
		  <circle cx="400" cy="150" r="80" fill="#ffc600"/>
		  <text x="400" y="180" font-size="80" text-anchor="middle" fill="#fff">⭐</text>
		  <text x="400" y="300" font-size="40" text-anchor="middle" fill="#333">Efficiency Tools Sharing</text>
		  <text x="400" y="400" font-size="80" text-anchor="middle" fill="#ff3c00">${milestone}</text>
		  <text x="400" y="450" font-size="24" text-anchor="middle" fill="#666">Total Likes and Favorites exceeded</text>
		  <text x="400" y="490" font-size="24" text-anchor="middle" fill="#666">more than 99% of creators</text>
		</svg>
	  `;
}

function getOptionsFromUrl(url) {
	try {
		const { searchParams } = new URL(url);
		const scale = Number(searchParams.get('scale')) || 1;
		const backgroundColor = searchParams.get('background') || undefined;
		return { scale, backgroundColor };
	} catch (e) {
		return {};
	}
}

// 加载字体数据
async function loadFont() {
	const fontResponse = await fetch(
		'https://fonts.googleapis.com/css2?family=Roboto:wght@400&display=swap'
	);
	const css = await fontResponse.text();

	// 从 CSS 中提取字体 URL
	const fontUrl = css.match(/url\((.*?)\)/)[1];

	// 获取字体文件数据
	const fontData = await fetch(fontUrl).then(res => res.arrayBuffer());
	return fontData;
};
