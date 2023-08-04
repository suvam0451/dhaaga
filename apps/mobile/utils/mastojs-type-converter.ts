type LowerToUpperToLowerCaseMapper = {
	a: "A";
	b: "B";
	c: "C";
	d: "D";
	e: "E";
	f: "F";
	g: "G";
	h: "H";
	i: "I";
	j: "J";
	k: "K";
	l: "L";
	m: "M";
	n: "N";
	o: "O";
	p: "P";
	q: "Q";
	r: "R";
	s: "S";
	t: "T";
	u: "U";
	v: "V";
	w: "W";
	x: "X";
	y: "Y";
	z: "Z";
	// ... and so on
};

type UpperToLowerCaseMapper = {
	A: "a";
	B: "b";
	C: "c";
	D: "d";
	E: "e";
	F: "f";
	G: "g";
	H: "h";
	I: "i";
	J: "j";
	K: "k";
	L: "l";
	M: "m";
	N: "n";
	O: "o";
	P: "p";
	Q: "q";
	R: "r";
	S: "s";
	T: "t";
	U: "u";
	V: "v";
	W: "w";
	X: "x";
	Y: "y";
	Z: "z";

	// ... and so on
};

type GetObjValues<T> = T extends Record<any, infer V> ? V : never;

export type SwitchKeyValue<
	T,
	// step 1
	T1 extends Record<string, any> = {
		[K in keyof T]: { key: K; value: T[K] };
	},
	// step 2
	T2 = {
		[K in GetObjValues<T1>["value"]]: Extract<
			GetObjValues<T1>,
			{ value: K }
		>["key"];
	}
> = T2;

type HeadLetter<T> = T extends `${infer FirstLetter}${infer _Rest}`
	? FirstLetter
	: never;
type TailLetters<T> = T extends `${infer _FirstLetter}${infer Rest}`
	? Rest
	: never;

type LetterToLower<T> = T extends `${infer FirstLetter}${infer _Rest}`
	? FirstLetter extends keyof UpperToLowerCaseMapper
		? UpperToLowerCaseMapper[FirstLetter]
		: FirstLetter
	: T;

type LetterToUpper<T> = T extends `${infer FirstLetter}${infer _Rest}`
	? FirstLetter extends keyof LowerToUpperToLowerCaseMapper
		? LowerToUpperToLowerCaseMapper[FirstLetter]
		: FirstLetter
	: T;

type ToLowerCase<T> = T extends ""
	? T
	: `${LetterToLower<HeadLetter<T>>}${ToLowerCase<TailLetters<T>>}`;

type ToSentenceCase<T> = `${LetterToUpper<HeadLetter<T>>}${ToLowerCase<
	TailLetters<T>
>}`;

type ToPascalCase<T> = T extends ``
	? T
	: T extends `${infer FirstWord}_${infer RestLetters}`
	? `${ToSentenceCase<FirstWord>}${ToPascalCase<RestLetters>}`
	: ToSentenceCase<T>;

export type UpperCaseToCamelCase<T> = `${ToLowerCase<
	HeadLetter<T>
>}${TailLetters<ToPascalCase<T>>}`;

type Cast<T, U> = T extends U ? T : any;

export type TransformKeysToCamelCase<
	T extends Record<string, any>,
	T0 = { [K in keyof T]: UpperCaseToCamelCase<K> },
	T1 = SwitchKeyValue<T0>,
	T2 = {
		[K in keyof T1]: T[Cast<T1[K], string>];
	}
> = T2;
