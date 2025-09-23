import { AppSidebar } from '@/components/sidebars/SidebarLeft';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { CategoryHeader } from '@/components/CategoryHeader';
import { StaticTabSwitcher } from '@/tabs/StaticTabSwitcher';

export default function Home() {
	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				<CategoryHeader />
				<main className="overflow-scroll flex-1 bg-gray-100">
					<StaticTabSwitcher />
				</main>
			</SidebarInset>
		</SidebarProvider>
	);
}
