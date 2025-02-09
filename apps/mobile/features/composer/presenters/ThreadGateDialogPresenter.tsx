import { ThreadGateSetting } from '../reducers/composer.reducer';

type Props = {
	seed: ThreadGateSetting[];
	onSubmit: (threadGates: ThreadGateSetting[]) => void;
};

function ThreadGateDialogPresenter({}: Props) {}
