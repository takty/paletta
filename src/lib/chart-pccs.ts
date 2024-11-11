import { Color, ColorSpace } from 'iroay/iroay';
import { Chart } from '$lib/chart';

type Pair    = [number, number];
type Triplet = [number, number, number];

export class ChartPCCS extends Chart {

	public setTriplet(c: Color, t: Triplet): void {
		c.set(ColorSpace.Pccs, t);
	}

	public getTriplet(c: Color): Triplet {
		return c.asPccs();
	}

	public getMapZ(c: Color): number {
		return 0 | c.asPccs()[0];
	}

	public getMapZLevel(base: Color, c: Color) {
		const x: number = c.asPccs()[0];
		const o: number = base.asPccs()[0];

		if (Math.abs(o - x) < 0.01) return 'same';
		if (o < x) return 'high';
		return 'low';
	}

	static MS: number = 10;

	public cToXy(c: Color): Pair {
		const t: Triplet = c.asPccs();
		if (t[0] === -1 || t[2] === -1) {
			return [0.5, 0.5];
		}
		const rad: number = ((t[0] - 8) / 24) * (Math.PI * 2);
		return [
			Math.cos(rad) * (t[2] / ChartPCCS.MS) * 0.5 + 0.5,
			Math.sin(rad) * (t[2] / ChartPCCS.MS) * 0.5 + 0.5,
		];
	}

	public xyToC(base: Color, x: number, y: number, dest: Color): void {
		const tb: Triplet = base.asPccs();

		const xx : number = x - 0.5;
		const yy : number = y - 0.5;
		const rad: number = ((yy > 0) ? Math.atan2(yy, xx) : (Math.atan2(-yy, -xx) + Math.PI)) / (Math.PI * 2.0);

		let tb0: number = rad * 24 + 8;
		if (tb0 >= 24) tb0 -= 24;
		if (tb0 < 0) tb0 += 24;

		const tn = [
			tb0,
			tb[1],
			Math.sqrt((xx / 0.5 * ChartPCCS.MS) * (xx / 0.5 * ChartPCCS.MS) + (yy / 0.5 * ChartPCCS.MS) * (yy / 0.5 * ChartPCCS.MS)),
		] as Triplet;
		dest.set(ColorSpace.Pccs, tn);
	}

	public dToC(base: Color, d: number, dest: Color): void {
		const tb: Triplet = base.asPccs();
		let y: number = tb[0] + (d > 0 ? 0.1 : -0.1);
		if (y < 0) y = 0;
		if (10 < y) y = 10;

		dest.set(ColorSpace.Pccs, [tb[0], y, tb[2]]);
	}

}
