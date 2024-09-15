import {
	createContext,
	MutableRefObject,
	useContext,
	useRef,
	useState,
} from 'react';
import BottomSheet, {
	BottomSheetBackdrop,
	BottomSheetView,
	SNAP_POINT_TYPE,
} from '@gorhom/bottom-sheet';
import * as Crypto from 'expo-crypto';
import { APP_FONT } from '../styles/AppTheme';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import BottomSheetFactory from '../components/bottom-sheets/BottomSheetFactory';
import { ActivityPubStatusAppDtoType } from '../services/approto/activitypub-status-dto.service';

export enum BOTTOM_SHEET_ENUM {
	HASHTAG = 'Hashtag',
	LINK = 'Link',
	STATUS_COMPOSER = 'StatusComposer',
	STATUS_MENU = 'StatusMenu',
	NA = 'N/A',
	ADD_REACTION = 'AddReaction',
}

type Type = {
	ref: MutableRefObject<BottomSheetMethods>;
	visible: boolean;
	type: BOTTOM_SHEET_ENUM | null;
	setVisible: (state: boolean) => void;
	setBottomSheetContent: (content: any) => void;
	setBottomSheetType: (input: BOTTOM_SHEET_ENUM) => void;
	updateRequestId: () => void;

	// static refs
	PostRef: MutableRefObject<ActivityPubStatusAppDtoType>;
};

const defaultValue: Type = {
	visible: false,
	type: null,
	PostRef: undefined,
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
	ref: undefined,
};

const GorhomBottomSheetContext = createContext<Type>(defaultValue);

export function useGorhomActionSheetContext() {
	return useContext(GorhomBottomSheetContext);
}

type Props = {
	children: any;
};

function WithGorhomBottomSheetContext({ children }: Props) {
	const [BottomSheetType, setBottomSheetType] = useState('N/A');
	const [RequestId, setRequestId] = useState(null);
	const ref = useRef<BottomSheet>();

	function setVisible(state: boolean) {
		ref?.current?.expand();
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

	const PostRef = useRef<ActivityPubStatusAppDtoType>(null);

	return (
		<GorhomBottomSheetContext.Provider
			value={{
				visible: false,
				type: BOTTOM_SHEET_ENUM.NA,
				setVisible,
				setBottomSheetContent: setter,
				setBottomSheetType: setBottomSheetTypeFn,
				updateRequestId: updateRequestIdFn,
				ref,
				PostRef,
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
				<BottomSheetView>
					<BottomSheetFactory type={BottomSheetType} requestId={RequestId} />;
				</BottomSheetView>
			</BottomSheet>
		</GorhomBottomSheetContext.Provider>
	);
}

export default WithGorhomBottomSheetContext;
