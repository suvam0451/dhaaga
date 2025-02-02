import AppTopNavbar, {
	APP_TOPBAR_TYPE_ENUM,
} from '../../../components/shared/topnavbar/AppTopNavbar';
import useScrollMoreOnPageEnd from '../../../states/useScrollMoreOnPageEnd';
import SectionHeader from '../components/SectionHeader';

function GeneralSettingsPresenter() {
	const { translateY } = useScrollMoreOnPageEnd();

	return (
		<AppTopNavbar
			type={APP_TOPBAR_TYPE_ENUM.GENERIC}
			title={'General Settings'}
			translateY={translateY}
		>
			<SectionHeader label={'Language'} iconId={'language'} />
			<SectionHeader label={'Timelines'} iconId={'language'} />
		</AppTopNavbar>
	);
}

export default GeneralSettingsPresenter;
