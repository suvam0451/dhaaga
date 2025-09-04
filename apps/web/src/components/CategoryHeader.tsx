'use client';

import * as React from 'react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const categories = [
	{ id: 'foryou', label: 'For You', isActive: true },
	{ id: 'following', label: 'Following', isActive: false },
	{ id: 'gaming', label: 'Gaming', isActive: false },
	{ id: 'food', label: 'Food', isActive: false },
	{ id: 'travel', label: 'Travel', isActive: false },
	{ id: 'music', label: 'Music', isActive: false },
	{ id: 'dance', label: 'Dance', isActive: false },
	{ id: 'comedy', label: 'Comedy', isActive: false },
	{ id: 'sports', label: 'Sports', isActive: false },
	{ id: 'fashion', label: 'Fashion', isActive: false },
	{ id: 'beauty', label: 'Beauty', isActive: false },
	{ id: 'pets', label: 'Pets', isActive: false },
	{ id: 'diy', label: 'DIY', isActive: false },
	{ id: 'education', label: 'Education', isActive: false },
	{ id: 'tech', label: 'Tech', isActive: false },
];

export function CategoryHeader() {
	const [activeCategory, setActiveCategory] = React.useState('foryou');
	const scrollAreaRef = React.useRef<HTMLDivElement>(null);

	const handleCategoryClick = (categoryId: string) => {
		setActiveCategory(categoryId);
	};

	return (
		<div className="relative border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			{/* Left fade gradient */}
			<div className="absolute left-0 top-0 z-10 h-full w-8 bg-gradient-to-r from-background/95 to-transparent pointer-events-none" />

			{/* Right fade gradient */}
			<div className="absolute right-0 top-0 z-10 h-full w-8 bg-gradient-to-l from-background/95 to-transparent pointer-events-none" />

			<ScrollArea className="w-full" ref={scrollAreaRef}>
				<div className="flex items-center space-x-1 px-4 py-3">
					{categories.map((category) => (
						<Button
							key={category.id}
							variant="ghost"
							size="sm"
							onClick={() => handleCategoryClick(category.id)}
							className={cn(
								'relative shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 hover:bg-accent/50',
								activeCategory === category.id
									? 'bg-foreground text-background hover:bg-foreground/90'
									: 'text-muted-foreground hover:text-foreground',
							)}
						>
							{category.label}
							{activeCategory === category.id && (
								<div className="absolute bottom-0 left-1/2 h-0.5 w-6 -translate-x-1/2 translate-y-1 rounded-full bg-background" />
							)}
						</Button>
					))}
				</div>
				<ScrollBar orientation="horizontal" className="invisible" />
			</ScrollArea>
		</div>
	);
}
