import * as React from 'react';
import messages from '../../i18n/en-US';
import features from './features';

const TOKEN = __TOKEN__ || 'aiMADZorjZDCJEfi7zREbvHBo2K70MXf'; // eslint-disable-line
const FOLDER_ID = __FOLDERID__ || '51964781421'; // eslint-disable-line
const FILE_ID = __FILEID__ || '308566420378'; // eslint-disable-line

function withConfig(WrappedComponent) {
    return class extends React.PureComponent {
        render() {
            return (
                <WrappedComponent
                    features={features}
                    fileId={FILE_ID}
                    language="en-US"
                    messages={messages}
                    rootFolderId={FOLDER_ID}
                    token={TOKEN}
                    {...this.props}
                />
            );
        }
    };
}

export default withConfig;
