import { LegendList } from '@legendapp/list';
import React from 'react';
import { View } from 'react-native';
import { NativeTextBold } from '#/ui/NativeText';

type Props = {
	forwardedRef: any;
	userId: string;
	onScroll: any;
	headerHeight: number;
};

function UserProfileMiscView({ forwardedRef, onScroll }: Props) {
	return (
		<LegendList
			ref={forwardedRef}
			data={[]}
			renderItem={({ item }) => <View />}
			ListEmptyComponent={
				<View>
					<NativeTextBold>Nothing to see here... for now</NativeTextBold>
					<NativeTextBold>
						We miiiiiiight jump into the tiktok clone bandwagon a year late into
						the party 😏
					</NativeTextBold>
				</View>
			}
			onScroll={onScroll}
		/>
	);
}

export default UserProfileMiscView;
