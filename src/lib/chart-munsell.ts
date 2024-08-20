import { Color, ColorSpace } from 'iroay/iroay';
import { Chart } from '$lib/chart';

type Pair = [number, number];
type Triplet = [number, number, number];

export class ChartMunsell extends Chart {

	public setTriplet(c: Color, t: Triplet): void {
		c.set(ColorSpace.Munsell, t);
	}

	public getTriplet(c: Color): Triplet {
		return c.asMunsell();
	}

	public getMapZ(c: Color): number {
		return 0 | c.asMunsell()[1];
	}

	public getMapZLevel(base: Color, c: Color) {
		const x = c.asMunsell()[1];
		const o = base.asMunsell()[1];

		if (Math.abs(o - x) < 0.01) return 'same';
		if (o < x) return 'high';
		return 'low';
	}

	static MC = 33;

	public cToXy(c: Color): Pair {
		const t = c.asMunsell();

		if (t[0] === -1 || t[2] === -1) {
			return [0.5, 0.5];
		}
		const rad = ((t[0] - 30) / 100) * (Math.PI * 2);
		return [
			Math.cos(rad) * (t[2] / ChartMunsell.MC) * 0.5 + 0.5,
			Math.sin(rad) * (t[2] / ChartMunsell.MC) * 0.5 + 0.5,
		];
	}

	public xyToC(base: Color, x: number, y: number, dest: Color): void {
		const tb = base.asMunsell();

		const xx = x - 0.5, yy = y - 0.5;
		const rad = (yy > 0) ? Math.atan2(yy, xx) : (Math.atan2(-yy, -xx) + Math.PI);

		let tb0 = rad / (Math.PI * 2) * 100 + 30;
		if (tb0 >= 100) tb0 -= 100;

		const tn = [
			tb0,
			tb[1],
			Math.sqrt((xx / 0.5 * ChartMunsell.MC) * (xx / 0.5 * ChartMunsell.MC) + (yy / 0.5 * ChartMunsell.MC) * (yy / 0.5 * ChartMunsell.MC)),
		] as Triplet;
		dest.set(ColorSpace.Munsell, tn);
	}

	public dToC(base: Color, d: number, dest: Color): void {
		const tb = base.asMunsell();
		let y = tb[1] + (d > 0 ? 0.1 : -0.1);
		if (y < 0) y = 0;
		if (10 < y) y = 10;

		dest.set(ColorSpace.Munsell, [tb[0], y, tb[2]]);
	}

}
