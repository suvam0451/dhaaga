import React, {
	createContext,
	useContext,
	useMemo,
	useRef,
	useState,
} from 'react';
import BottomSheet, {
	BottomSheetBackdrop,
	BottomSheetView,
	SNAP_POINT_TYPE,
} from '@gorhom/bottom-sheet';
import { View } from 'react-native';
import HashtagBottomSheet from '../components/bottom-sheets/Hashtag';
import { useGlobalMmkvContext } from './useGlobalMMkvCache';
import globalMmkvCacheServices from '../services/globalMmkvCache.services';
import * as Crypto from 'expo-crypto';
import ExternalLinkActionSheet from '../components/bottom-sheets/Link';
import PostComposerBottomSheet from '../components/bottom-sheets/PostComposer';
import { APP_FONT } from '../styles/AppTheme';
import WithActivitypubStatusContext from './useStatus';
import Status from '../components/bottom-sheets/Status';

export enum BOTTOM_SHEET_ENUM {
	HASHTAG = 'Hashtag',
	LINK = 'Link',
	STATUS_COMPOSER = 'StatusComposer',
	STATUS_MENU = 'StatusMenu',
	NA = 'N/A',
}

type Type = {
	visible: boolean;
	type: BOTTOM_SHEET_ENUM | null;
	setVisible: (state: boolean) => void;
	setBottomSheetContent: (content: any) => void;
	setBottomSheetType: (input: BOTTOM_SHEET_ENUM) => void;
	updateRequestId: () => void;
};

const defaultValue: Type = {
	visible: false,
	type: null,
	setVisible: function (state: boolean): void {
		throw new Error('Function not implemented.');
	},
	setBottomSheetContent: function (content: any): void {
		throw new Error('Function not implemented.');
	},
	setBottomSheetType: function (input: string): void {
		throw new Error('Function not implemented.');
	},
	updateRequestId: undefined,
};

const GorhomBottomSheetContext = createContext<Type>(defaultValue);

export function useGorhomActionSheetContext() {
	return useContext(GorhomBottomSheetContext);
}

type Props = {
	children: any;
};

/**
 * @param type of bottom sheet to show
 * @param requestId updates the component state/data
 * @constructor
 */
function BottomSheetContent({
	type,
	requestId,
}: {
	type: string;
	requestId: string;
}) {
	const { globalDb } = useGlobalMmkvContext();

	return useMemo(() => {
		switch (type) {
			case BOTTOM_SHEET_ENUM.HASHTAG: {
				const x = globalMmkvCacheServices.getBottomSheetProp_Hashtag(globalDb);
				if (!x) return <View></View>;
				return <HashtagBottomSheet visible={true} id={x.name} />;
			}
			case BOTTOM_SHEET_ENUM.LINK: {
				const x = globalMmkvCacheServices.getBottomSheetProp_Link(globalDb);
				if (!x) return <View></View>;
				return (
					<ExternalLinkActionSheet url={x.url} displayName={x.displayName} />
				);
			}
			case BOTTOM_SHEET_ENUM.STATUS_COMPOSER: {
				return <PostComposerBottomSheet />;
			}
			case BOTTOM_SHEET_ENUM.STATUS_MENU: {
				const x = globalMmkvCacheServices.getBottomSheetProp_Status(globalDb);
				if (!x) return <View></View>;
				return (
					<WithActivitypubStatusContext status={x}>
						<Status />
					</WithActivitypubStatusContext>
				);
			}
			default:
				return <View></View>;
		}
	}, [requestId]);
}

function WithGorhomBottomSheetContext({ children }: Props) {
	const [BottomSheetType, setBottomSheetType] = useState('N/A');
	const [RequestId, setRequestId] = useState(null);
	const ref = useRef<BottomSheet>();

	function setVisible(state: boolean) {
		ref?.current?.expand();
	}

	function close() {
		setVisible(false);
	}

	function setter(input: any) {}

	function setBottomSheetTypeFn(input: string) {
		setBottomSheetType(input);
	}

	function onBottomSheetChanged(
		index: number,
		position: number,
		type: SNAP_POINT_TYPE,
	) {}

	/**
	 * Updating the UUID after saving all relevant data in cache
	 * Will cause the bottom sheet to refetch/update
	 */
	function updateRequestIdFn() {
		setRequestId(Crypto.randomUUID());
	}

	const Content = useMemo(() => {
		return <BottomSheetContent type={BottomSheetType} requestId={RequestId} />;
	}, [RequestId]);

	return (
		<GorhomBottomSheetContext.Provider
			value={{
				visible: false,
				type: BOTTOM_SHEET_ENUM.NA,
				setVisible,
				setBottomSheetContent: setter,
				setBottomSheetType: setBottomSheetTypeFn,
				updateRequestId: updateRequestIdFn,
			}}
		>
			{children}
			<BottomSheet
				onChange={onBottomSheetChanged}
				ref={ref}
				index={-1}
				enablePanDownToClose={true}
				enableOverDrag={false}
				snapPoints={['50%']}
				backgroundStyle={{
					backgroundColor: '#2C2C2C',
				}}
				backdropComponent={(props) => (
					<BottomSheetBackdrop
						{...props}
						pressBehavior="close"
						disappearsOnIndex={-1}
						appearsOnIndex={0}
						opacity={0.5}
						enableTouchThrough={false}
					/>
				)}
				handleIndicatorStyle={{ backgroundColor: APP_FONT.MONTSERRAT_BODY }}
			>
				<BottomSheetView>{Content}</BottomSheetView>
			</BottomSheet>
		</GorhomBottomSheetContext.Provider>
	);
}

export default WithGorhomBottomSheetContext;
