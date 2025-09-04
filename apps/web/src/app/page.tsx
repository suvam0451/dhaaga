import { AppSidebar } from '@/components/sidebars/SidebarLeft';
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from '@/components/ui/sidebar';
import { CategoryHeader } from '@/components/CategoryHeader';
import { Separator } from '@/components/ui/separator';
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { StaticTabSwitcher } from '@/tabs/StaticTabSwitcher';

export default function Home() {
	return (
		<div className={'max-w-screen overflow-clip'}>
			<SidebarProvider>
				<AppSidebar />
				<SidebarInset className={'flex-1 overflow-scroll'}>
					<header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b">
						<div className="flex items-center gap-2 px-4">
							<SidebarTrigger className="-ml-1" />
							<Separator orientation="vertical" className="mr-2 h-4" />
							<Breadcrumb>
								<BreadcrumbList>
									<BreadcrumbItem className="hidden md:block">
										<BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
									</BreadcrumbItem>
									<BreadcrumbSeparator className="hidden md:block" />
									<BreadcrumbItem>
										<BreadcrumbPage>Home</BreadcrumbPage>
									</BreadcrumbItem>
								</BreadcrumbList>
							</Breadcrumb>
						</div>
					</header>
					<main>
						<CategoryHeader />
						<StaticTabSwitcher active={true} tabId={'guides'} />
					</main>
					{/*<div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">*/}
					{/*	<footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center"></footer>*/}
					{/*</div>*/}
				</SidebarInset>
			</SidebarProvider>
		</div>
	);
}
