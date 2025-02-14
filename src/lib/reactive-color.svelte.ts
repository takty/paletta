import { ColorSpace, Color } from 'iroay/iroay';

type Triplet = [number, number, number];

export class ReactiveColor {
	current: number = $state(0);
	values : [Color, Color] = $state([new Color(), new Color()]);

	munStr : string = $derived(this.values[this.current].asMunsellNotation());
	pccsStr: string = $derived(this.values[this.current].asPCCSNotation());

	#rgb : Triplet = $derived(this.values[this.current].asRgb());
	#hsl : Triplet = $derived(this.values[this.current].asHsl());
	#lab : Triplet = $derived(this.values[this.current].asLab());
	#lch : Triplet = $derived(this.values[this.current].asLch());
	#xyy : Triplet = $derived(this.values[this.current].asXyy());
	#mun : Triplet = $derived(this.values[this.current].asMunsell());
	#pccs: Triplet = $derived(this.values[this.current].asPccs());
	#tone: Triplet = $derived(this.values[this.current].asTone());

	get rgb0(): number { return this.#rgb[0]; }
	get rgb1(): number { return this.#rgb[1]; }
	get rgb2(): number { return this.#rgb[2]; }
	set rgb0(v: number) { this.updated(ColorSpace.Rgb, 0, v); }
	set rgb1(v: number) { this.updated(ColorSpace.Rgb, 1, v); }
	set rgb2(v: number) { this.updated(ColorSpace.Rgb, 2, v); }

	get hsl0(): number { return this.#hsl[0]; }
	get hsl1(): number { return this.#hsl[1]; }
	get hsl2(): number { return this.#hsl[2]; }
	set hsl0(v: number) { this.updated(ColorSpace.Hsl, 0, v); }
	set hsl1(v: number) { this.updated(ColorSpace.Hsl, 1, v); }
	set hsl2(v: number) { this.updated(ColorSpace.Hsl, 2, v); }

	get lab0(): number { return this.#lab[0]; }
	get lab1(): number { return this.#lab[1]; }
	get lab2(): number { return this.#lab[2]; }
	set lab0(v: number) { this.updated(ColorSpace.Lab, 0, v); }
	set lab1(v: number) { this.updated(ColorSpace.Lab, 1, v); }
	set lab2(v: number) { this.updated(ColorSpace.Lab, 2, v); }

	get lch0(): number { return this.#lch[0]; }
	get lch1(): number { return this.#lch[1]; }
	get lch2(): number { return this.#lch[2]; }
	set lch0(v: number) { this.updated(ColorSpace.Lch, 0, v); }
	set lch1(v: number) { this.updated(ColorSpace.Lch, 1, v); }
	set lch2(v: number) { this.updated(ColorSpace.Lch, 2, v); }

	get xyy0(): number { return this.#xyy[0]; }
	get xyy1(): number { return this.#xyy[1]; }
	get xyy2(): number { return this.#xyy[2]; }
	set xyy0(v: number) { this.updated(ColorSpace.Xyy, 0, v); }
	set xyy1(v: number) { this.updated(ColorSpace.Xyy, 1, v); }
	set xyy2(v: number) { this.updated(ColorSpace.Xyy, 2, v); }

	get mun0(): number { return this.#mun[0]; }
	get mun1(): number { return this.#mun[1]; }
	get mun2(): number { return this.#mun[2]; }
	set mun0(v: number) { this.updated(ColorSpace.Munsell, 0, v); }
	set mun1(v: number) { this.updated(ColorSpace.Munsell, 1, v); }
	set mun2(v: number) { this.updated(ColorSpace.Munsell, 2, v); }

	get pccs0(): number { return this.#pccs[0]; }
	get pccs1(): number { return this.#pccs[1]; }
	get pccs2(): number { return this.#pccs[2]; }
	set pccs0(v: number) { this.updated(ColorSpace.Pccs, 0, v); }
	set pccs1(v: number) { this.updated(ColorSpace.Pccs, 1, v); }
	set pccs2(v: number) { this.updated(ColorSpace.Pccs, 2, v); }

	get tone0(): number { return this.#tone[0]; }
	get tone1(): number { return this.#tone[1]; }
	set tone0(v: number) { this.updated(ColorSpace.Tone, 0, v); }
	set tone1(v: number) { this.updated(ColorSpace.Tone, 1, v); }

	updated(cs: ColorSpace, idx: number, v: number): void {
		const t: Triplet = this.values[this.current].as(cs);
		t[idx] = v;
		this.values[this.current] = new Color(cs, t);
	}

	set(str: string): void {
		const c: Color | null = Color.fromString(str);
		if (!c) return;
		this.values[this.current] = c;
	}
}
