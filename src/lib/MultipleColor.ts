/**
 * Multiple Colors
 *
 * @author Takty
 */

import { RGB, Lab, Yxy, Munsell, PCCS, XYZ, LMS, ColorVisionSimulation } from 'colorjst/src/colorjst';

export class MultipleColor {
	private xyz: [number, number, number] = [0, 0, 0];
	private rgb: [number, number, number] = [0, 0, 0];
	private lab: [number, number, number] = [0, 0, 0];
	private lch: [number, number, number] = [0, 0, 0];
	private yxy: [number, number, number] = [0, 0, 0];
	private mun: [number, number, number] = [0, 0, 0];
	private pccs: [number, number, number] = [0, 0, 0];
	private tone: [number, number, number] = [0, 0, 0];

	private munStr = '';
	private pccsStr = '';

	// RGB ---------------------------------------------------------------------

	public setRgb(index: number, val: number): void {
		this.rgb[index] = val;
		this.rgbUpdated();
	}

	public getRgb(): [number, number, number] {
		return [...this.rgb];
	}

	private rgbUpdated(): void {
		this.xyz = RGB.toXYZ(this.rgb);
		this.lab = XYZ.toLab(this.xyz);
		this.lch = Lab.toPolarCoordinate(this.lab);
		this.yxy = XYZ.toYxy(this.xyz);

		this.mun  = Munsell.fromXYZ(this.xyz);
		this.pccs = PCCS.fromMunsell(this.mun);
		this.tone = PCCS.toToneCoordinate(this.pccs);

		this.munStr  = Munsell.toString(this.mun);
		this.pccsStr = PCCS.toString(this.pccs);
	}

	// Lab ---------------------------------------------------------------------

	public setLab(index: number, val: number): void {
		this.lab[index] = val;
		this.labUpdated();
	}

	public getLab(): [number, number, number] {
		return [...this.lab];
	}

	private labUpdated(): void {
		this.lch = Lab.toPolarCoordinate(this.lab);
		this.xyz = Lab.toXYZ(this.lab);
		this.rgb = RGB.fromXYZ(this.xyz);
		this.yxy = XYZ.toYxy(this.xyz);

		this.mun  = Munsell.fromXYZ(this.xyz);
		this.pccs = PCCS.fromMunsell(this.mun);
		this.tone = PCCS.toToneCoordinate(this.pccs);

		this.munStr  = Munsell.toString(this.mun);
		this.pccsStr = PCCS.toString(this.pccs);
	}

	public getLabP(): [number, number, number] {
		const lms = LMS.fromXYZ(this.xyz);
		const lms_p = ColorVisionSimulation.lmsToProtanopia(lms);
		const xyz = LMS.toXYZ(lms_p);
		return XYZ.toLab(xyz);
	}

	public getLabD(): [number, number, number] {
		const lms = LMS.fromXYZ(this.xyz);
		const lms_d = ColorVisionSimulation.lmsToDeuteranopia(lms);
		const xyz = LMS.toXYZ(lms_d);
		return XYZ.toLab(xyz);
	}



	// Lch (Lab) ---------------------------------------------------------------

	public setLch(index: number, val: number): void {
		this.lch[index] = val;
		this.lchUpdated();
	}

	public getLch(): [number, number, number] {
		return [...this.lch];
	}

	private lchUpdated(): void {
		this.lab = Lab.toOrthogonalCoordinate(this.lch);
		this.xyz = Lab.toXYZ(this.lab);
		this.rgb = RGB.fromXYZ(this.xyz);
		this.yxy = XYZ.toYxy(this.xyz);

		this.mun  = Munsell.fromXYZ(this.xyz);
		this.pccs = PCCS.fromMunsell(this.mun);
		this.tone = PCCS.toToneCoordinate(this.pccs);

		this.munStr  = Munsell.toString(this.mun);
		this.pccsStr = PCCS.toString(this.pccs);
	}

	// Yxy ---------------------------------------------------------------------

	public setYxy(index: number, val: number): void {
		this.yxy[index] = val;
		this.yxyUpdated();
	}

	public getYxy(): [number, number, number] {
		return [...this.yxy];
	}

	private yxyUpdated(): void {
		this.xyz = Yxy.toXYZ(this.yxy);
		this.rgb = RGB.fromXYZ(this.xyz);
		this.lab = XYZ.toLab(this.xyz);
		this.lch = Lab.toPolarCoordinate(this.lab);

		this.mun  = Munsell.fromXYZ(this.xyz);
		// this.pccs = PCCS.fromMunsell(this.mun);
		// this.tone = PCCS.toToneCoordinate(this.pccs);

		// this.munStr  = Munsell.toString(this.mun);
		// this.pccsStr = PCCS.toString(this.pccs);
	}

	// Munsell -----------------------------------------------------------------

	public setMunsell(index: number, val: number): void {
		this.mun[index] = val;
		this.munsellUpdated();
	}

	public getMunsell(): [number, number, number] {
		return [...this.mun];
	}

	public getMunsellNotation(): string {
		return this.munStr;
	}

	private munsellUpdated(): void {
		this.xyz = Munsell.toXYZ(this.mun);
		this.rgb = RGB.fromXYZ(this.xyz);
		this.lab = XYZ.toLab(this.xyz);
		this.lch = Lab.toPolarCoordinate(this.lab);
		this.yxy = XYZ.toYxy(this.xyz);

		this.pccs = PCCS.fromMunsell(this.mun);
		this.tone = PCCS.toToneCoordinate(this.pccs);

		this.munStr  = Munsell.toString(this.mun);
		this.pccsStr = PCCS.toString(this.pccs);
	}

	// PCCS --------------------------------------------------------------------

	public setPccs(index: number, val: number): void {
		this.pccs[index] = val;
		this.pccsUpdated();
	}

	public getPccs(): [number, number, number] {
		return [...this.pccs];
	}

	public getPccsNotation(): string {
		return this.pccsStr;
	}

	private pccsUpdated(): void {
		this.mun  = PCCS.toMunsell(this.pccs);
		this.tone = PCCS.toToneCoordinate(this.pccs);

		this.xyz = Munsell.toXYZ(this.mun);
		this.rgb = RGB.fromXYZ(this.xyz);
		this.lab = XYZ.toLab(this.xyz);
		this.lch = Lab.toPolarCoordinate(this.lab);
		this.yxy = XYZ.toYxy(this.xyz);

		this.munStr  = Munsell.toString(this.mun);
		this.pccsStr = PCCS.toString(this.pccs);
	}

	// Tone (PCCS) -------------------------------------------------------------

	public setTone(index: number, val: number): void {
		this.tone[index] = val;
		this.toneUpdated();
	}

	public getTone(): [number, number, number] {
		return [...this.tone];
	}

	private toneUpdated(): void {
		this.pccs = PCCS.toNormalCoordinate(this.tone);
		this.mun  = PCCS.toMunsell(this.pccs);

		this.xyz = Munsell.toXYZ(this.mun);
		this.rgb = RGB.fromXYZ(this.xyz);
		this.lab = XYZ.toLab(this.xyz);
		this.lch = Lab.toPolarCoordinate(this.lab);
		this.yxy = XYZ.toYxy(this.xyz);

		this.munStr  = Munsell.toString(this.mun);
		this.pccsStr = PCCS.toString(this.pccs);
	}
}
