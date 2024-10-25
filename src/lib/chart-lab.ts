import { Color, ColorSpace } from 'iroay/iroay';
import { Chart } from '$lib/chart';

type Pair    = [number, number];
type Triplet = [number, number, number];

export class ChartLab extends Chart {

	public setTriplet(c: Color, t: Triplet): void {
		c.set(ColorSpace.Lab, t);
	}

	public getTriplet(c: Color): Triplet {
		return c.asLab();
	}

	public getMapZ(c: Color): number {
		return 0 | c.asLab()[0];
	}

	public getMapZLevel(base: Color, c: Color) {
		const x: number = c.asLab()[0];
		const o: number = base.asLab()[0];

		if (Math.abs(o - x) < 1) return 'same';
		if (o < x) return 'high';
		return 'low';
	}

	static HX: number = 128;
	static HY: number = 128;

	public cToXy(c: Color): Pair {
		const t: Triplet = c.asLab();
		return [
			((t[1] / (2 * ChartLab.HX) + 0.5)),
			((1 - (t[2] / (2 * ChartLab.HY) + 0.5)))
		];
	}

	public xyToC(base: Color, x: number, y: number, dest: Color): void {
		const tb: Triplet = base.asLab();
		const tn = [
			tb[0],
			(x - 0.5) * 2 * ChartLab.HX,
			((1 - y) - 0.5) * 2 * ChartLab.HY,
		] as Triplet;
		dest.set(ColorSpace.Lab, tn);
	}

	public dToC(base: Color, d: number, dest: Color): void {
		const tb: Triplet = base.asLab();
		let ls: number = tb[0] + (d > 0 ? 1 : -1);
		if (ls < 0) ls = 0;
		if (100 < ls) ls = 100;

		dest.set(ColorSpace.Lab, [ls, tb[1], tb[2]]);
	}

}
