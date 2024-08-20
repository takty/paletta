import { Color, ColorSpace } from 'iroay/iroay';
import { Chart } from '$lib/chart';

type Pair = [number, number];
type Triplet = [number, number, number];

export class ChartTone extends Chart {

	public setTriplet(c: Color, t: Triplet): void {
		c.set(ColorSpace.Tone, t);
	}

	public getTriplet(c: Color): Triplet {
		return c.asTone();
	}

	public getMapZ(c: Color): number {
		return 0 | c.asTone()[0];
	}

	public getMapZLevel(base: Color, c: Color) {
		const x = c.asTone()[0];
		const o = base.asTone()[0];

		if (Math.abs(o - x) < 0.01) return 'same';
		if (o < x) return 'high';
		return 'low';
	}

	static MS = 10;
	static ML = 10;

	public cToXy(c: Color): Pair {
		const t = c.asTone();
		if (t[0] === -1) {
			return [0, 0];
		}
		return [
			t[2] / ChartTone.MS,
			1 - t[1] / ChartTone.MS,
		];
	}

	public xyToC(base: Color, x: number, y: number, dest: Color): void {
		const tb = base.asTone();

		const tn = [
			tb[0],
			(1 - y) * ChartTone.ML,
			x * ChartTone.MS,
		] as Triplet;
		dest.set(ColorSpace.Tone, tn);
	}

	public dToC(base: Color, d: number, dest: Color): void {
		const tb = base.asTone();
		let y = tb[0] + (d > 0 ? 0.1 : -0.1);
		if (y < 0) y = 0;
		if (10 < y) y = 10;

		dest.set(ColorSpace.Tone, [tb[0], y, tb[2]]);
	}

}
