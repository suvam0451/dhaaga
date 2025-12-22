import React from 'react';

type SVGComponent = React.ComponentType<any> | undefined;

interface ChristmasAssets {
	ChristmasBellOutline: SVGComponent;
	ChristmasBellFilledOutline: SVGComponent;
	ChristmasScarfFilledOutline: SVGComponent;
	ChristmasScarfOutline: SVGComponent;
	ChristmasTeapotFilledOutline: SVGComponent;
	ChristmasTeapotOutline: SVGComponent;
	ChristmasMufflersFilledOutline: SVGComponent;
	ChristmasMufflersOutline: SVGComponent;
	ChristmasGiftBoxFilledOutline: SVGComponent;
	ChristmasGiftBoxOutline: SVGComponent;
	ChristmasReindeerOutline: SVGComponent;
	ChristmasReindeerFilledOutline: SVGComponent;
	ChristmasMessage: SVGComponent;
	ChristmasGlovesOutline: SVGComponent;
	ChristmasGlovesFilledOutline: SVGComponent;
}

const ChristmasPack: ChristmasAssets = {
	ChristmasBellOutline: undefined,
	ChristmasBellFilledOutline: undefined,
	ChristmasScarfFilledOutline: undefined,
	ChristmasScarfOutline: undefined,
	ChristmasTeapotFilledOutline: undefined,
	ChristmasTeapotOutline: undefined,
	ChristmasMufflersFilledOutline: undefined,
	ChristmasMufflersOutline: undefined,
	ChristmasGiftBoxFilledOutline: undefined,
	ChristmasGiftBoxOutline: undefined,
	ChristmasReindeerOutline: undefined,
	ChristmasReindeerFilledOutline: undefined,
	ChristmasMessage: undefined,
	ChristmasGlovesOutline: undefined,
	ChristmasGlovesFilledOutline: undefined,
};

try {
	ChristmasPack.ChristmasBellOutline =
		require('#/features/skins/svgs/christmas/navbar/ChristmasBellOutline').default;
	ChristmasPack.ChristmasBellFilledOutline =
		require('#/features/skins/svgs/christmas/navbar/ChristmasBellFilledOutline').default;
	ChristmasPack.ChristmasScarfFilledOutline =
		require('#/features/skins/svgs/christmas/navbar/ChristmasScarfFilledOutline').default;
	ChristmasPack.ChristmasScarfOutline =
		require('#/features/skins/svgs/christmas/navbar/ChristmasScarfOutline').default;
	ChristmasPack.ChristmasTeapotFilledOutline =
		require('#/features/skins/svgs/christmas/navbar/ChristmasTeapotFilledOutline').default;
	ChristmasPack.ChristmasTeapotOutline =
		require('#/features/skins/svgs/christmas/navbar/ChristmasTeapotOutline').default;
	ChristmasPack.ChristmasMufflersFilledOutline =
		require('#/features/skins/svgs/christmas/navbar/ChristmasMufflersFilledOutline').default;
	ChristmasPack.ChristmasMufflersOutline =
		require('#/features/skins/svgs/christmas/navbar/ChristmasMufflersOutline').default;
	ChristmasPack.ChristmasGiftBoxFilledOutline =
		require('#/skins/christmas/icons/ChristmasGiftBoxFilledOutline').default;
	ChristmasPack.ChristmasGiftBoxOutline =
		require('#/skins/christmas/icons/ChristmasGiftBoxOutline').default;
	ChristmasPack.ChristmasReindeerOutline =
		require('#/skins/christmas/icons/ChristmasReindeerOutline').default;
	ChristmasPack.ChristmasReindeerFilledOutline =
		require('#/skins/christmas/icons/ChristmasReindeerFilledOutline').default;
	ChristmasPack.ChristmasMessage =
		require('#/skins/christmas/icons/ChristmasMessage').default;
	ChristmasPack.ChristmasGlovesOutline =
		require('#/skins/christmas/icons/ChristmasGlovesOutline').default;
	ChristmasPack.ChristmasGlovesFilledOutline =
		require('#/skins/christmas/icons/ChristmasGlovesFilledOutline').default;
} catch (e) {
	console.warn(
		'[WARN]: some Christmas SVGs not loaded, licensed svgs missing.',
	);
}

export { ChristmasPack };
