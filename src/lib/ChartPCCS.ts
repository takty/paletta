import { Color, ColorSpace } from 'colorjst/src/colorjst';

type Triplet = [number, number, number];

export class ChartPCCS {

	public static setTriplet(c: Color, t: Triplet) {
		c.set(ColorSpace.PCCS, t);
	}

	public static getTriplet(c: Color) {
		return c.asPCCS();
	}

	public static getMapZ(c: Color): number {
		return 0 | c.asPCCS()[0];
	}

	public static getMapZLevel(base: Color, c: Color) {
		const x = c.asPCCS()[0];
		const o = base.asPCCS()[0];

		if (Math.abs(o - x) < 0.01) return 'same';
		if (o < x) return 'high';
		return 'low';
	}

	static MS = 10;

	public static cToXy(c: Color) {
		const t = c.asPCCS();
		if (t[0] === -1 || t[2] === -1) {
			return [0.5, 0.5];
		}
		const rad = ((t[0] - 8) / 24) * (Math.PI * 2);
		return [
			Math.cos(rad) * (t[2] / ChartPCCS.MS) * 0.5 + 0.5,
			Math.sin(rad) * (t[2] / ChartPCCS.MS) * 0.5 + 0.5,
		];
	}

	public static xyToC(base: Color, x: number, y: number, dest: Color): void {
		const tb = base.asPCCS();

		const xx = x - 0.5, yy = y - 0.5;
		const rad = ((yy > 0) ? Math.atan2(yy, xx) : (Math.atan2(-yy, -xx) + Math.PI)) / (Math.PI * 2.0);

		let tb0 = rad * 24 + 8;
		if (tb0 >= 24) tb0 -= 24;
		if (tb0 < 0) tb0 += 24;

		const tn = [
			tb0,
			tb[1],
			Math.sqrt((xx / 0.5 * ChartPCCS.MS) * (xx / 0.5 * ChartPCCS.MS) + (yy / 0.5 * ChartPCCS.MS) * (yy / 0.5 * ChartPCCS.MS)),
		] as Triplet;
		dest.set(ColorSpace.PCCS, tn);
	}

	public static dToC(base: Color, d: number, dest: Color): void {
		const tb = base.asPCCS();
		let y = tb[0] + (d > 0 ? 0.1 : -0.1);
		if (y < 0) y = 0;
		if (10 < y) y = 10;

		dest.set(ColorSpace.PCCS, [tb[0], y, tb[2]]);
	}

}
