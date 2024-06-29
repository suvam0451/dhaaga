'use client';

import styles from './page.module.css';
import { Box } from '@mantine/core';
import { MainContainer, RootContainer } from './styles/App';
import AppNavBar from '@/app/components/shared/AppNavBar';
import FeatureGalleryWidget from '@/app/components/widgets/feature-gallery';
import AppFooter from '@/app/components/shared/AppFooter';
import Introduction from '@/app/components/Introduction';
import SeeAllFeatures from '@/app/SeeAllFeatures';
import ModuleRouter from '@/app/components/ModuleRouter';

export default function Home() {
	return (
		<main className={styles.main}>
			<RootContainer>
				<MainContainer>
					<Box
						style={{
							minHeight: '100vh',
							display: 'flex',
							flexDirection: 'column',
						}}
					>
						<AppNavBar />
						<Introduction />
						<Box style={{ flexGrow: 1 }}></Box>
						<SeeAllFeatures />
					</Box>

					<FeatureGalleryWidget />
					<ModuleRouter />
					<Box style={{ flexGrow: 1 }}></Box>

					<AppFooter />
				</MainContainer>
			</RootContainer>
		</main>
	);
}
