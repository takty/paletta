import { Color, ColorSpace } from 'colorjst/src/colorjst';
import { Chart } from '$lib/chart';

type Pair = [number, number];
type Triplet = [number, number, number];

export class ChartYxy extends Chart {

	public setTriplet(c: Color, t: Triplet): void {
		c.set(ColorSpace.Yxy, t);
	}

	public getTriplet(c: Color): Triplet {
		return c.asYxy();
	}

	public getMapZ(c: Color): number {
		return 0 | c.asYxy()[0];
	}

	public getMapZLevel(base: Color, c: Color) {
		const x = c.asYxy()[0];
		const o = base.asYxy()[0];

		if (Math.abs(o - x) < 0.01) return 'same';
		if (o < x) return 'high';
		return 'low';
	}

	static MX = 0.85;
	static MY = 0.85;

	public cToXy(c: Color): Pair {
		const t = c.asYxy();
		return [
			t[1] / ChartYxy.MX,
			1 - t[2] / ChartYxy.MY,
		];
	}

	public xyToC(base: Color, x: number, y: number, dest: Color): void {
		const tb = base.asYxy();
		const tn = [
			tb[0],
			x * ChartYxy.MX,
			(1 - y) * ChartYxy.MY,
		] as Triplet;
		dest.set(ColorSpace.Yxy, tn);
	}

	public dToC(base: Color, d: number, dest: Color): void {
		const tb = base.asYxy();
		let y = tb[0] + (d > 0 ? 0.01 : -0.01);
		if (y < 0) y = 0;
		if (1 < y) y = 1;

		dest.set(ColorSpace.Yxy, [y, tb[1], tb[2]]);
	}

}
