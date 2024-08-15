<!-- ColorChart.svelte -->
<script lang="ts" type="module">
	import { onMount } from 'svelte';
	import { Color, ColorSpace, Evaluation } from 'colorjst/src/colorjst';
	import { ChartLab } from '$lib/ChartLab';
	import { ChartYxy } from '$lib/ChartYxy';
	import { ChartMunsell } from '$lib/ChartMunsell';
	import { ChartPCCS } from '$lib/ChartPCCS';
	import { ChartTone } from '$lib/ChartTone';

	type Triplet = [number, number, number];

	export let width = 256;
	export let height = 256;

	export let current = 0;
	export let isSaturationVisible = true;
	export let isUnsaturationMarkerVisible = true;
	export let isIsochromaticEllipsisVisible = true;

	export let vision = 'p';
	export let isSimulationEnabled = false;
	export let isProtanopiaMarkerVisible = false;
	export let isDeuteranopiaMarkerVisible = false;

	export let onUpdate: (vs: Triplet) => void;
	export let value: Triplet = [0, 0, 0];
	let doingUpdate = false;

	const curChart = ChartMunsell;
	const ms: [Color, Color] = [new Color(), new Color()];

	let can: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;

	onMount(() => {
		ctx = can.getContext('2d') as CanvasRenderingContext2D;
	});

	$: {
		if (ctx && !doingUpdate) update(value);
	}

	function update(value: Triplet) {
		curChart.setTriplet(ms[current], value);
		drawMap(ctx, ms[current]);

		ms[0].asRGB();
		ms[1].asRGB();
		const sat = [ms[0].isRGBSaturated(), ms[1].isRGBSaturated()];
		const ls = ['L', 'R'];
		let doUsMarker = false;

		for (let i = 0; i < ms.length; ++i) {
			drawMarker(ctx, ms[i], sat[i] ? '#f00' : '#fff', ls[i], current === i, ms[current]);

			if(isProtanopiaMarkerVisible) {
				drawMarker(ctx, ms[i].toProtanopia(), '#fff', ls[i] + ' p', current === i, ms[current]);
			}
			if(isDeuteranopiaMarkerVisible) {
				drawMarker(ctx, ms[i].toDeuteranopia(), '#fff', ls[i] + ' d', current === i, ms[current]);
			}

			if (current === i && sat[i]) doUsMarker = true;
		}
		if(isUnsaturationMarkerVisible && doUsMarker) {
			const c = new Color(ColorSpace.RGB, ms[current].asRGB());
			drawMarker(ctx, c, '#fff', `s (${curChart.getMapZ(c)})`, true, ms[current]);
		}
	}

	function pointMap(x: number, y: number, button: number) {
		const oldCur = current;
		switch(button) {
		case 0: current = 0; break;
		case 3: current = 1; break;
		}
		curChart.xyToC(ms[oldCur], x / width, y / height, ms[current]);
		ms[current] = ms[current];
		const vs = curChart.getTriplet(ms[current]);
		doingUpdate = true;
		onUpdate(vs);
		doingUpdate = false;
	}

	function wheelMap(r: number) {
		curChart.dToC(ms[current], r, ms[current]);
		ms[current] = ms[current];
		const vs = curChart.getTriplet(ms[current]);
		doingUpdate = true;
		onUpdate(vs);
		doingUpdate = false;
	}

	function drawMarker(ctx: CanvasRenderingContext2D, c: Color, fill: string, str: string, cur: boolean, base: Color): void {
		const [lx, ly] = curChart.cToXy(c);
		const x = lx * width, y = ly * height;
		const bl = curChart.getMapZLevel(base, c);

		ctx.save();
		ctx.fillStyle = fill;
		ctx.strokeStyle = cur ? '#000' : '#777';

		switch (bl) {
			case 'same': drawMarkerSame(ctx, x, y); break;
			case 'high': drawMarkerHigh(ctx, x, y); break;
			case 'low' : drawMarkerLow(ctx, x, y); break;
		}
		ctx.restore();
		drawMarkerLabel(ctx, x, y, str);
 	}

	 function drawMarkerSame(ctx: CanvasRenderingContext2D, x: number, y: number): void {
		ctx.save();
		ctx.fillRect(x - 2, y - 2, 4, 4);
		ctx.strokeRect(x - 2, y - 2, 4, 4);
		ctx.restore();
 	}

	 function drawMarkerHigh(ctx: CanvasRenderingContext2D, x: number, y: number): void {
		ctx.save();
		ctx.beginPath();
		ctx.ellipse(x, y, 2, 2, 0, 0, 2 * Math.PI);
		ctx.fill();
		ctx.stroke();
		ctx.restore();
	}

	function drawMarkerLow(ctx: CanvasRenderingContext2D, x: number, y: number): void {
		ctx.save();
		ctx.beginPath();
		ctx.moveTo(x, y - 3);
		ctx.lineTo(x + 3, y);
		ctx.lineTo(x, y + 3);
		ctx.lineTo(x - 3, y);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
		ctx.restore();
	}

	function drawMarkerLabel(ctx: CanvasRenderingContext2D, x: number, y: number, str: string): void {
		ctx.save();
		ctx.lineWidth = 1.5;
		ctx.strokeStyle = "black";
		ctx.strokeText(str, x + 8, y);
		ctx.lineWidth = 1;
		ctx.fillStyle = "white";
		ctx.fillText(str, x + 8, y);
		ctx.restore();
	}

	function drawMap(ctx: CanvasRenderingContext2D, base: Color): void {
		ctx.fillStyle = '#f0f0f0';
		ctx.fillRect(0, 0, width, height);

		const c: Color = new Color();
		const baseSim: Color = simulateVision(base);

		for (let y = 0; y < height; ++y) {
			for (let x = 0; x < width; ++x) {
				curChart.xyToC(base, x/ width, y / height, c);
				const cSim: Color = simulateVision(c);

				if (isIsochromaticEllipsisVisible) {
					const d = cSim.distanceTo(baseSim) * 0.92;
					if (Math.abs(Evaluation.NBS_APPRECIABLE - d) < 0.14) {
						ctx.fillStyle = '#fff';
						ctx.fillRect(x, y, 1, 1);
						continue;
					}
				}
				c.asRGB();
				c.asYxy();
				c.asMunsell();
				if (isSaturationVisible || (!c.isRGBSaturated() && !c.isMunsellSaturated())) {
					const rgb = cSim.asRGB();
					setPixel(ctx, x, y, rgb);
				}
			}
		}
	}

	function simulateVision(src: Color) {
		if (isSimulationEnabled) {
			switch(vision) {
			case 'p': return src.toProtanopia();
			case 'd': return src.toDeuteranopia();
			}
		}
		return src;
	}

	function setPixel(ctx: CanvasRenderingContext2D, x: number, y: number, [r = 0, g = 0, b = 0]: Triplet) {
		ctx.fillStyle = `rgb(${r},${g},${b}`;
		ctx.fillRect(x, y, 1, 1);
	}
</script>

<canvas bind:this={can} {width} {height} on:click={e => pointMap(e.offsetX, e.offsetY, e.button)} on:wheel={e => wheelMap(e.deltaY)}></canvas>
