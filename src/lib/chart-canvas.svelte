<!-- color-chart.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { Color, ColorSpace } from 'iroay/iroay';
	import { Chart } from '$lib/chart';
	import { ChartLab } from '$lib/chart-lab';
	import { ChartYxy } from '$lib/chart-yxy';
	import { ChartMunsell } from '$lib/chart-munsell';
	import { ChartPCCS } from '$lib/chart-pccs';
	import { ChartTone } from '$lib/chart-tone';

	interface Props {
		width? : number;
		height?: number;

		vision?             : '' | 'p' | 'd';
		isSaturationVisible?: boolean;

		isProtanopiaMarkerVisible?    : boolean;
		isDeuteranopiaMarkerVisible?  : boolean;
		isUnsaturationMarkerVisible?  : boolean;
		isIsochromaticEllipsisVisible?: boolean;

		chart?   : 'lab' | 'yxy' | 'munsell' | 'pccs' | 'tone';
		current? : number;
		value?   : Color;
		onupdate?: (c: Color) => void;
	}

	let {
		width  = 256,
		height = 256,

		vision              = '',
		isSaturationVisible = false,

		isProtanopiaMarkerVisible     = false,
		isDeuteranopiaMarkerVisible   = false,
		isUnsaturationMarkerVisible   = true,
		isIsochromaticEllipsisVisible = true,

		chart    = 'lab',
		current  = 0,
		value    = $bindable(new Color()),
		onupdate = (c: Color): void => {},
	} : Props = $props();

	const chartToObj = {
		'lab'    : new ChartLab(),
		'yxy'    : new ChartYxy(),
		'munsell': new ChartMunsell(),
		'pccs'   : new ChartPCCS(),
		'tone'   : new ChartTone(),
	};

	const cc: Chart = $derived(chartToObj[chart]);

	const cs: [Color, Color]   = [new Color(), new Color()];
	const ls: [string, string] = ['L', 'R'];

	let can: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;

	onMount((): void => {
		ctx = can.getContext('2d') as CanvasRenderingContext2D;
	});

	$effect((): void => {
		if (ctx) update(value, current);
	});

	function update(val: Color, cur: number): void {
		cs[cur] = val;
		cc.drawMap(ctx, cs[cur], isSaturationVisible, isIsochromaticEllipsisVisible, vision);

		let doUsMarker: boolean = false;

		for (let i: number = 0; i < cs.length; ++i) {
			const sat: boolean = cs[i].isRGBSaturated(true);
			const stroke = cur === i ? '#000' : '#777';
			cc.drawMarker(ctx, cs[i], cs[cur], sat ? '#f00' : '#fff', stroke, ls[i]);

			if(isProtanopiaMarkerVisible) {
				cc.drawMarker(ctx, cs[i].toProtanopia(), cs[cur], '#fff', stroke, ls[i] + ' p');
			}
			if(isDeuteranopiaMarkerVisible) {
				cc.drawMarker(ctx, cs[i].toDeuteranopia(), cs[cur], '#fff', stroke, ls[i] + ' d');
			}
			if (cur === i && sat) doUsMarker = true;
		}
		if(isUnsaturationMarkerVisible && doUsMarker) {
			const c = new Color(ColorSpace.RGB, cs[cur].asRGB());
			cc.drawMarker(ctx, c, cs[cur], '#fff', '#000', `s (${cc.getMapZ(c)})`);
		}
	}

	function pointMap({ offsetX: x, offsetY: y }: { offsetX: number, offsetY: number }): void {
		cc.xyToC(cs[current], x / width, y / height, cs[current]);
		onupdate(cs[current]);
	}

	function wheelMap({ deltaY: d }: { deltaY: number }): void {
		cc.dToC(cs[current], d, cs[current]);
		onupdate(cs[current]);
	}
</script>

<canvas bind:this={can} {width} {height} onclick={pointMap} onwheel={wheelMap}></canvas>
