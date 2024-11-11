import { Color, ColorSpace } from 'iroay/iroay';
import { Chart } from '$lib/chart';

type Pair    = [number, number];
type Triplet = [number, number, number];

export class ChartXyy extends Chart {

	public setTriplet(c: Color, t: Triplet): void {
		c.set(ColorSpace.Xyy, t);
	}

	public getTriplet(c: Color): Triplet {
		return c.asXyy();
	}

	public getMapZ(c: Color): number {
		return 0 | c.asXyy()[2];
	}

	public getMapZLevel(base: Color, c: Color) {
		const x: number = c.asXyy()[2];
		const o: number = base.asXyy()[2];

		if (Math.abs(o - x) < 0.01) return 'same';
		if (o < x) return 'high';
		return 'low';
	}

	static MX: number = 0.85;
	static MY: number = 0.85;

	public cToXy(c: Color): Pair {
		const t: Triplet = c.asXyy();
		return [
			t[0] / ChartXyy.MX,
			1 - t[1] / ChartXyy.MY,
		];
	}

	public xyToC(base: Color, x: number, y: number, dest: Color): void {
		const tb: Triplet = base.asXyy();
		const tn = [
			x * ChartXyy.MX,
			(1 - y) * ChartXyy.MY,
			tb[2],
		] as Triplet;
		dest.set(ColorSpace.Xyy, tn);
	}

	public dToC(base: Color, d: number, dest: Color): void {
		const tb: Triplet = base.asXyy();
		let y: number = tb[2] + (d > 0 ? 0.01 : -0.01);
		if (y < 0) y = 0;
		if (1 < y) y = 1;

		dest.set(ColorSpace.Xyy, [tb[0], tb[1], y]);
	}

}
