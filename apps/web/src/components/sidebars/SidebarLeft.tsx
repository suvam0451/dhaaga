'use client';

import type * as React from 'react';
import {
	Home,
	Compass,
	Heart,
	MessageCircle,
	Bookmark,
	Settings,
	TrendingUp,
	Video,
	Music,
	Sparkles,
	SquarePlus,
	Inbox,
} from 'lucide-react';

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Main navigation items
const navMain = [
	{
		title: 'Social Hub',
		url: '#',
		icon: Home,
		isActive: true,
	},
	{
		title: 'Discover',
		url: '#',
		icon: Compass,
	},
	{
		title: 'Compose',
		url: '#',
		icon: SquarePlus,
	},
	{
		title: 'Inbox',
		url: '#',
		icon: Inbox,
	},
];

// Discover section
const discover = [
	{
		title: 'Trending',
		url: '#',
		icon: TrendingUp,
	},
	{
		title: 'Music',
		url: '#',
		icon: Music,
	},
	{
		title: 'Effects',
		url: '#',
		icon: Sparkles,
	},
];

// Personal section
const personal = [
	{
		title: 'Likes',
		url: '#',
		icon: Heart,
	},
	{
		title: 'Bookmarks',
		url: '#',
		icon: Bookmark,
	},
	{
		title: 'Posts',
		url: '#',
		icon: MessageCircle,
	},
];

const appModules = [
	{
		title: 'Guides',
		url: '#',
	},
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size="lg" asChild>
							<a href="#" className="font-bold">
								<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 text-white">
									<Video className="size-4" />
								</div>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-semibold">Dhaaga (Web)</span>
									<span className="truncate text-xs text-muted-foreground">
										v0.16.0
									</span>
								</div>
							</a>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>

			<SidebarContent>
				{/* Main Navigation */}
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							{navMain.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton
										asChild
										isActive={item.isActive}
										tooltip={item.title}
									>
										<a href={item.url}>
											<item.icon />
											<span>{item.title}</span>
										</a>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>

				{/* Discover Section */}
				<SidebarGroup>
					<SidebarGroupLabel>Discover</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{discover.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton asChild tooltip={item.title}>
										<a href={item.url}>
											<item.icon />
											<span>{item.title}</span>
										</a>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>

				{/* Personal Section */}
				<SidebarGroup>
					<SidebarGroupLabel>Account</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{personal.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton asChild tooltip={item.title}>
										<a href={item.url}>
											<item.icon />
											<span>{item.title}</span>
										</a>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>

				<SidebarGroup>
					<SidebarGroupLabel>App</SidebarGroupLabel>
					<SidebarGroupContent></SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>

			<SidebarFooter>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton asChild tooltip="Profile">
							<a href="#" className="flex items-center gap-2">
								<Avatar className="h-6 w-6">
									<AvatarImage
										src="/placeholder.svg?height=24&width=24"
										alt="User"
									/>
									<AvatarFallback>U</AvatarFallback>
								</Avatar>
								<span className="font-medium">Your Profile</span>
							</a>
						</SidebarMenuButton>
					</SidebarMenuItem>
					<SidebarMenuItem>
						<SidebarMenuButton asChild tooltip="Settings">
							<a href="#">
								<Settings />
								<span>Settings</span>
							</a>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>

			<SidebarRail />
		</Sidebar>
	);
}
