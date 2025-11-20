import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/sidebars/SidebarLeft';
import { CategoryHeader } from '@/components/CategoryHeader';
import { StaticTabSwitcher } from '@/tabs/StaticTabSwitcher';

import './globals.css';

function Page() {
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

const root = document.getElementById('root');

ReactDOM.createRoot(root).render(
	<BrowserRouter>
		<Routes>
			<Route path="/" element={<Page />} />
		</Routes>
	</BrowserRouter>,
);