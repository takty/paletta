<!-- ColorChart.svelte -->
<script lang="ts" type="module">
	import { onMount } from 'svelte';
	import { Color, ColorSpace } from 'colorjst/src/colorjst';
	import { Chart } from '$lib/chart';
	import { ChartLab } from '$lib/chart-lab';
	import { ChartYxy } from '$lib/chart-yxy';
	import { ChartMunsell } from '$lib/chart-munsell';
	import { ChartPCCS } from '$lib/chart-pccs';
	import { ChartTone } from '$lib/chart-tone';

	export let width = 256;
	export let height = 256;

	export let isSaturationVisible = false;
	export let isUnsaturationMarkerVisible = true;
	export let isIsochromaticEllipsisVisible = true;

	export let vision: null | 'p' | 'd' = null;
	export let isProtanopiaMarkerVisible = false;
	export let isDeuteranopiaMarkerVisible = false;

	export let chart: 'lab' | 'yxy' | 'munsell' | 'pccs' | 'tone' = 'lab';
	export let current = 0;
	export let value: Color;
	export let onUpdate: (c: Color) => void;

	let curChart: Chart = new ChartLab();
	const ms: [Color, Color] = [new Color(), new Color()];
	const ls = ['L', 'R'];

	let can: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;

	onMount(() => {
		ctx = can.getContext('2d') as CanvasRenderingContext2D;
	});

	$: {
		if (ctx) update(value);
	}
	$: {
		switch (chart) {
			case 'lab': curChart = new ChartLab(); break;
			case 'yxy': curChart = new ChartYxy(); break;
			case 'munsell': curChart = new ChartMunsell(); break;
			case 'pccs': curChart = new ChartPCCS(); break;
			case 'tone': curChart = new ChartTone(); break;
		}
	}

	function update(value: Color) {
		ms[current] = value;
		curChart.drawMap(ctx, ms[current], isSaturationVisible, isIsochromaticEllipsisVisible, vision);

		let doUsMarker = false;

		for (let i = 0; i < ms.length; ++i) {
			const sat = ms[i].isRGBSaturated(true);
			const stroke = current === i ? '#000' : '#777';
			curChart.drawMarker(ctx, ms[i], ms[current], sat ? '#f00' : '#fff', stroke, ls[i]);

			if(isProtanopiaMarkerVisible) {
				curChart.drawMarker(ctx, ms[i].toProtanopia(), ms[current], '#fff', stroke, ls[i] + ' p');
			}
			if(isDeuteranopiaMarkerVisible) {
				curChart.drawMarker(ctx, ms[i].toDeuteranopia(), ms[current], '#fff', stroke, ls[i] + ' d');
			}
			if (current === i && sat) doUsMarker = true;
		}
		if(isUnsaturationMarkerVisible && doUsMarker) {
			const c = new Color(ColorSpace.RGB, ms[current].asRGB());
			curChart.drawMarker(ctx, c, ms[current], '#fff', '#000', `s (${curChart.getMapZ(c)})`);
		}
	}

	function pointMap({ offsetX: x, offsetY: y }: { offsetX: number, offsetY: number }) {
		curChart.xyToC(ms[current], x / width, y / height, ms[current]);
		onUpdate(ms[current]);
	}

	function wheelMap({ deltaY: d }: { deltaY: number }) {
		curChart.dToC(ms[current], d, ms[current]);
		onUpdate(ms[current]);
	}
</script>

<canvas bind:this={can} {width} {height} on:click={pointMap} on:wheel={wheelMap}></canvas>
