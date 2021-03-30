import { connect } from 'react-redux';
import { fetchArchive, revive } from './../../store/archive/actions';
import ViewToggleComponent from '../feature/FeatureView/FeatureView';
import { hasPermission } from '../../permissions';
import { fetchTags } from '../../store/feature-tags/actions';

export default connect(
    (state, props) => ({
        features: state.archive.get('list').toArray(),
        featureToggle: state.archive
            .get('list')
            .toArray()
            .find(toggle => toggle.name === props.featureToggleName),
        tagTypes: state.tagTypes.toJS(),
        featureTags: state.featureTags.toJS(),
        activeTab: props.activeTab,
        hasPermission: hasPermission.bind(null, state.user.get('profile')),
    }),
    {
        fetchArchive,
        revive,
        fetchTags,
    }
)(ViewToggleComponent);
