import SectionHeader from '../components/SectionHeader';
import NavBar_Simple from '#/components/topnavbar/NavBar_Simple';

function GeneralSettingsPresenter() {
	return (
		<>
			<NavBar_Simple label={'General Settings'} />
			<SectionHeader label={'Language'} iconId={'language'} />
			<SectionHeader label={'Timelines'} iconId={'language'} />
		</>
	);
}

export default GeneralSettingsPresenter;
