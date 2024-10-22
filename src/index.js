/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */
import { initialize, svg2png } from 'svg2png-wasm';
import wasm from 'svg2png-wasm/svg2png_wasm_bg.wasm';
// import roboto from './Roboto-Thin.ttf';

initialize(wasm).catch((error) => {
	console.log('initialize error: ', error)
});

export default {
	async fetch(request, env, ctx) {
		console.log(request)
		try {
			// 加载字体
			const fontData = await loadFont();

			const options = {
				...getOptionsFromUrl(request.url),
      	fonts: await Promise.all([new Uint8Array(fontData)]),
      	// fonts: await Promise.all([new Uint8Array(roboto)]),
				defaultFontFamily: {
					sansSerifFamily: 'Roboto',
					serifFamily: 'Roboto',
					cursiveFamily: 'Roboto',
					fantasyFamily: 'Roboto',
					monospaceFamily: 'Roboto',
				},
			};
  		const svgtext = `
				<svg version="1.1" xmlns="http://www.w3.org/2000/svg" height="120" width="120">
					<circle cx="60" cy="60" r="60" stroke="black" stroke-width="0" fill="pink"/>
					<text x="60" y="70" font-size="20" text-anchor="middle" fill="#fff" font-weight="bold">Hello world</text>
				</svg>
			`;

			const svgtext2 = `
				<svg viewBox="0 0 240 80" xmlns="http://www.w3.org/2000/svg">
					<text x="20" y="35" font-size="13" font-style="italic" font-family="sans-serif">My</text>
					<text x="40" y="35" font-size="30" font-weight="bold" font-family="sans-serif">cat</text>
					<text x="55" y="55" font-size="13" font-style="italic" font-family="sans-serif">is</text>
					<text x="65" y="55" font-size="40" font-style="italic" font-family="serif" fill="red">Grumpy!</text>
				</svg>
			`;
    	const buf = await svg2png(svgtext2, options);
			// const buf = svg2png(generateSVG(1000), options);
			return new Response(buf, {
				headers: {
					'Content-Type': 'image/png'
				},
				status: 200
			});
		} catch (error) {
			console.log(error.message)
			return new Response('Hello World!' + error.message);
		}
	},
};

function generateSVG(milestone) {
	return `
<svg width="800" height="800" viewBox="0 0 1024 1024" class="icon" xmlns="http://www.w3.org/2000/svg">
  <path d="m512.7 472.2-43.3 75.1h86.7z" fill="#843A5F"/>
  <path d="M633.6 174.6H392.9l-73.8 347 194.1 215.7 193.1-214.5 1-1.2z" fill="#843A5F"/>
  <path d="M298.4 656.8a214 214 0 1 0 428 0 214 214 0 1 0-428 0" fill="#AE9AA4"/>
  <path d="M512.4 873.8c-58 0-112.5-22.6-153.5-63.6s-63.6-95.5-63.6-153.5 22.6-112.5 63.6-153.5 95.5-63.6 153.5-63.6 112.5 22.6 153.5 63.6 63.6 95.5 63.6 153.5-22.6 112.5-63.6 153.5c-41.1 41-95.6 63.6-153.5 63.6m0-428c-116.4 0-211 94.7-211 211s94.7 211 211 211c116.4 0 211-94.7 211-211s-94.7-211-211-211" fill="#843A5F"/>
  <path d="m512.4 578-70.5-121.9h140.9z" fill="#FFF"/>
  <path d="m512.4 584-75.6-131H588zm-65.3-124.9 65.2 113 65.2-113zm228.1-273.7-.2-.4c-5.8-18.4-14.7-35.6-26.3-51.1l-.1-.2c-5.5-7.3-11.7-14.3-18.4-20.7-19.6-18.8-43.7-32.8-69.7-40.4-15.6-4.6-31.8-6.9-48.2-6.9-14.3 0-28.6 1.8-42.3 5.3-1.8.5-3.2.8-4.5 1.2-26.8 7.6-51.6 21.9-71.7 41.4-26.8 25.9-44.1 59-49.9 95.6-1.4 8.8-2.1 17.9-2.1 27 0 15.1 2 30 5.9 44.4 2 7.6 4.6 15.1 7.7 22.2 26.8 63.1 88.4 103.8 157 103.8 63.5 0 121.3-34.9 150.9-91 4.3-8 7.9-16.6 10.8-25.3 5.8-17.4 8.8-35.6 8.8-54.1 0-17.3-2.6-34.4-7.7-50.8" fill="#843A5F"/>
  <path d="M364.9 294.4a149.1 176.4 0 1 0 298.2 0 149.1 176.4 0 1 0-298.2 0" fill="#E6D8DF"/>
  <path d="M514 473.8c-83.9 0-152.1-80.5-152.1-179.4S430.2 115 514 115s152.1 80.5 152.1 179.4S597.9 473.8 514 473.8m0-352.8c-80.6 0-146.1 77.8-146.1 173.4S433.5 467.8 514 467.8c80.6 0 146.1-77.8 146.1-173.4S594.6 121 514 121" fill="#843A5F"/>
  <path d="M513.5 412.1c-23.1 0-46.5-5.6-46.5-16.3h6c0 3.5 14.3 10.3 40.5 10.3s40.5-6.8 40.5-10.3h6c0 10.7-23.4 16.3-46.5 16.3" fill="#843A5F"/>
  <path d="M750 923.1H275.5c-6.6 0-12-5.4-12-12V535.5c0-6.6 5.4-12 12-12H750c6.6 0 12 5.4 12 12v375.6c0 6.6-5.4 12-12 12" fill="#FFF"/>
  <path d="M750 926.1H275.5c-8.3 0-15-6.7-15-15V535.5c0-8.3 6.7-15 15-15H750c8.3 0 15 6.7 15 15v375.6c0 8.3-6.7 15-15 15M275.5 526.5c-5 0-9 4-9 9v375.6c0 5 4 9 9 9H750c5 0 9-4 9-9V535.5c0-5-4-9-9-9z" fill="#843A5F"/>
  <path d="M287.7 749.9c-12.9 18-33.9 18-46.8 0s-12.9-47.1 0-65c12.9-18 33.9-18 46.8 0 12.9 17.9 12.9 47 0 65" fill="#E6D8DF"/>
  <path d="M264.3 766.4c-9.8 0-19-5.2-25.8-14.7-13.6-18.9-13.6-49.7 0-68.6 6.8-9.5 16-14.7 25.8-14.7s19 5.2 25.8 14.7c13.6 18.9 13.6 49.7 0 68.6-6.8 9.4-16 14.7-25.8 14.7m0-92c-7.8 0-15.3 4.3-21 12.2-12.2 17-12.2 44.6 0 61.5 5.7 7.9 13.1 12.2 21 12.2s15.3-4.3 21-12.2c12.2-17 12.2-44.6 0-61.5-5.8-7.9-13.2-12.2-21-12.2" fill="#843A5F"/>
  <path d="M785.8 749.9c-12.9 18-33.9 18-46.8 0s-12.9-47.1 0-65c12.9-18 33.9-18 46.8 0 12.9 17.9 12.9 47 0 65" fill="#E6D8DF"/>
  <path d="M762.4 766.4c-9.8 0-19-5.2-25.8-14.7-13.6-18.9-13.6-49.7 0-68.6 6.8-9.5 16-14.7 25.8-14.7s19 5.2 25.8 14.7c13.6 18.9 13.6 49.7 0 68.6-6.8 9.4-16 14.7-25.8 14.7m0-92c-7.8 0-15.3 4.3-21 12.2-12.2 17-12.2 44.6 0 61.5 5.7 7.9 13.1 12.2 21 12.2s15.3-4.3 21-12.2c12.2-17 12.2-44.6 0-61.5-5.7-7.9-13.1-12.2-21-12.2M635.3 137.5 583 108.3l-2.7 2c-5-3.1-17.7-4.9-49.6-2.6-23.6 1.7-47.2 4.9-47.4 5l-.4.1-94.4 42.2-32 20.3 4.8 126.4c-.6 3.9-.6 6.1-.6 6.4v.5l7.8 23.4-1.1-29.9c1.4-9.3 5.9-28.5 19.6-51.1 17.9-29.4 55.8-70.8 134.5-100.6 3-1.1 5.8-2.2 8.5-3.3l-1.6 1.2h9.2c43.5 0 74.8 45.5 93.5 83.7 20.5 42 30.5 84.5 30.6 85l5.7 24.7 1.2-154.2z" fill="#843A5F"/>
  <path d="M572 320.7a29.7 16.3 0 1 0 59.4 0 29.7 16.3 0 1 0-59.4 0" fill="#FF9FB9"/>
  <path d="M578 257.3c-11.5 0-20.9 12.7-20.9 28.4S566.5 314 578 314s20.9-12.7 20.9-28.4-9.4-28.3-20.9-28.3" fill="#843A5F"/>
  <path d="M569 291.8a9 9.9 0 1 0 18 0 9 9.9 0 1 0-18 0" fill="#FFF"/>
  <path d="M547 253.7c8.3-8.1 19-13.6 30.2-16.4 14.2-3.6 24.8 3.1 34.8 12.6 1.4 1.3 3.5-.8 2.1-2.1-9.5-9.1-20.5-16.6-34.3-14.2-12.9 2.3-25.6 8.8-35 17.9-1.3 1.4.8 3.5 2.2 2.2" fill="#843A5F"/>
  <path d="M396.7 320.7a29.7 16.3 0 1 0 59.4 0 29.7 16.3 0 1 0-59.4 0" fill="#FF9FB9"/>
  <path d="M450.1 257.3c-11.5 0-20.9 12.7-20.9 28.4s9.4 28.4 20.9 28.4 20.9-12.7 20.9-28.4-9.4-28.4-20.9-28.4" fill="#843A5F"/>
  <path d="M441.1 291.8a9 9.9 0 1 0 18 0 9 9.9 0 1 0-18 0" fill="#FFF"/>
  <path d="M483.2 251.5c-9.3-9.1-22.1-15.6-35-17.9-13.8-2.4-24.7 5-34.3 14.2-1.4 1.3.7 3.5 2.1 2.1 9.9-9.5 20.6-16.2 34.8-12.6 11.2 2.8 21.9 8.3 30.2 16.4 1.5 1.3 3.6-.8 2.2-2.2" fill="#843A5F"/>
  <path d="m514.3 551.1 167 67s-29 229-167 270z" fill="#AE9AA4"/>
  <path d="M511.3 546.6 338 616.1l.3 2.3c.1.6 7.6 58.3 31.9 120.3 14.3 36.5 31.6 67.4 51.4 91.7 24.9 30.6 53.7 50.9 85.8 60.5l3.9 1.1 3.9-1.1c32.1-9.5 60.9-29.9 85.8-60.5 19.8-24.3 37.1-55.2 51.4-91.7 24.4-62 31.9-119.8 31.9-120.3l.3-2.3zm135.5 190c-21.7 55.3-61.7 125.1-129.5 147.4V555.5L678 620c-1.6 11.2-9.9 62.2-31.2 116.6" fill="#843A5F"/>
  <path d="M482.3 696.4v-53.9h85.5v53.9h-32.2v12.9h41v18.2h-29.3c7.4 9.4 17.6 17.2 30.5 23.4-2.3 5.1-5.9 11.3-10.5 18.8-14.1-8.6-24.6-19.1-31.6-31.6v38.7H514v-38.1c-7.4 12.1-18.6 22.9-33.4 32.2-1.6-2.7-4.5-6.6-8.8-11.7-1.6-2-2.7-3.3-3.5-4.1v21.7H449v-63.3c-3.5 5.9-7 11.1-10.5 15.8-.4-3.9-1.2-9.4-2.3-16.4q-1.2-8.25-1.8-12.9c10.2-18.8 17.8-39.5 22.9-62.1l21.1 5.3c-2.3 9.8-5.7 19.7-10 29.9v81.4c14.1-7.4 25-16.4 32.8-27h-28.7v-18.2H514v-12.9zm20.5-35.1v17h44.5v-17z" fill="#FFF"/>
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
}