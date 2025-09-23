'use client';

import { useState, useRef } from 'react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { SidebarTrigger } from './ui/sidebar';
import PinCategory from './nav/PinCategory';
import { IoNewspaper } from 'react-icons/io5';

const PIN_CATEGORY_ICON_SIZE = 24;

export function CategoryHeader() {
	const scrollAreaRef = useRef<HTMLDivElement>(null);

	const [PinCategoryExpanded, setPinCategoryExpanded] = useState<
		'users' | 'tags' | 'feeds' | null
	>(null);
	const FEED_PINS = ['one', 'two', 'three', 'four', 'five'];
	const USER_PINS = ['one', 'two', 'three', 'four', 'five'];
	const TAG_PINS = ['one', 'two', 'three', 'four', 'five'];

	function togglePinCategory(cat: 'users' | 'tags' | 'feeds') {
		setPinCategoryExpanded(PinCategoryExpanded === cat ? null : cat);
	}

	return (
		<div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			{/* Left fade gradient */}
			{/* <div className="absolute left-0 top-0 z-10 h-full w-8 bg-gradient-to-r from-background/95 to-transparent pointer-events-none" /> */}

			{/* Right fade gradient */}
			{/* <div className="absolute right-0 top-0 z-10 h-full w-8 bg-gradient-to-l from-background/95 to-transparent pointer-events-none" /> */}

			<ScrollArea className="w-full" ref={scrollAreaRef}>
				<div className="flex items-center space-x-3 px-4 py-3">
					<SidebarTrigger className="-ml-1" />

					<PinCategory
						label="Feeds"
						Icon={<IoNewspaper size={PIN_CATEGORY_ICON_SIZE} />}
						isExpanded={PinCategoryExpanded === 'feeds'}
						items={FEED_PINS}
						onClick={() => {
							togglePinCategory('feeds');
						}}
					/>
					<PinCategory
						label="Users"
						Icon={<IoNewspaper size={PIN_CATEGORY_ICON_SIZE} />}
						isExpanded={PinCategoryExpanded === 'users'}
						items={USER_PINS}
						onClick={() => {
							togglePinCategory('users');
						}}
					/>
					<PinCategory
						label="Tags"
						Icon={<IoNewspaper size={PIN_CATEGORY_ICON_SIZE} />}
						isExpanded={PinCategoryExpanded === 'tags'}
						items={TAG_PINS}
						onClick={() => {
							togglePinCategory('tags');
						}}
					/>
				</div>
				<ScrollBar orientation="horizontal" className="invisible" />
			</ScrollArea>
		</div>
	);
}
