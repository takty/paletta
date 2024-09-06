import { Color, Difference } from 'iroay/iroay';

type Pair = [number, number];
type Triplet = [number, number, number];

export abstract class Chart {

	public abstract setTriplet(c: Color, t: Triplet): void;

	public abstract getTriplet(c: Color): Triplet;

	public abstract getMapZ(c: Color): number;

	public abstract getMapZLevel(base: Color, c: Color): 'same' | 'high' | 'low';

	public abstract cToXy(c: Color): Pair;

	public abstract xyToC(base: Color, x: number, y: number, dest: Color): void;

	public abstract dToC(base: Color, d: number, dest: Color): void;


	// -------------------------------------------------------------------------


	public drawMap(ctx: CanvasRenderingContext2D, base: Color, isSaturationVisible: boolean, isIsochromaticEllipsisVisible: boolean, vision: '' | 'p' | 'd'): void {
		const width = ctx.canvas.width, height = ctx.canvas.height;
		ctx.fillStyle = '#f0f0f0';
		ctx.fillRect(0, 0, width, height);

		const c: Color = new Color();
		const baseSim: Color = this.simulateVision(base, vision);

		for (let y = 0; y < height; ++y) {
			for (let x = 0; x < width; ++x) {
				this.xyToC(base, x / width, y / height, c);
				const cSim: Color = this.simulateVision(c, vision);

				if (isIsochromaticEllipsisVisible) {
					const d = cSim.distanceTo(baseSim) * 0.92;
					if (Math.abs(Difference.NBS.APPRECIABLE - d) < 0.14) {
						ctx.fillStyle = '#fff';
						ctx.fillRect(x, y, 1, 1);
						continue;
					}
				}
				if (isSaturationVisible || !c.isRGBSaturated(true)) {
					const rgb = cSim.asRGB();
					this.setPixel(ctx, x, y, rgb);
				}
			}
		}
	}

	private simulateVision(src: Color, vision: '' | 'p' | 'd') {
		switch (vision) {
			case 'p': return src.toProtanopia();
			case 'd': return src.toDeuteranopia();
		}
		return src;
	}

	private setPixel(ctx: CanvasRenderingContext2D, x: number, y: number, [r, g, b]: Triplet) {
		ctx.fillStyle = `rgb(${r},${g},${b}`;
		ctx.fillRect(x, y, 1, 1);
	}


	// -------------------------------------------------------------------------


	public drawMarker(ctx: CanvasRenderingContext2D, c: Color, base: Color, fill: string, stroke: string, str: string): void {
		const [lx, ly] = this.cToXy(c);
		const x = lx * ctx.canvas.width;
		const y = ly * ctx.canvas.height;

		ctx.save();
		ctx.fillStyle = fill;
		ctx.strokeStyle = stroke;

		switch (this.getMapZLevel(base, c)) {
			case 'same': this.drawMarkerSame(ctx, x, y); break;
			case 'high': this.drawMarkerHigh(ctx, x, y); break;
			case 'low': this.drawMarkerLow(ctx, x, y); break;
		}
		ctx.restore();
		this.drawMarkerLabel(ctx, x, y, str);
	}

	private drawMarkerSame(ctx: CanvasRenderingContext2D, x: number, y: number): void {
		ctx.save();
		ctx.fillRect(x - 2, y - 2, 4, 4);
		ctx.strokeRect(x - 2, y - 2, 4, 4);
		ctx.restore();
	}

	private drawMarkerHigh(ctx: CanvasRenderingContext2D, x: number, y: number): void {
		ctx.save();
		ctx.beginPath();
		ctx.ellipse(x, y, 2, 2, 0, 0, 2 * Math.PI);
		ctx.fill();
		ctx.stroke();
		ctx.restore();
	}

	private drawMarkerLow(ctx: CanvasRenderingContext2D, x: number, y: number): void {
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

	private drawMarkerLabel(ctx: CanvasRenderingContext2D, x: number, y: number, str: string): void {
		ctx.save();
		ctx.lineWidth = 2.5;
		ctx.strokeStyle = 'black';
		ctx.strokeText(str, x + 8, y);
		ctx.lineWidth = 1;
		ctx.fillStyle = 'white';
		ctx.fillText(str, x + 8, y);
		ctx.restore();
	}

}
