import React, { PureComponent } from 'react';
import { NativeModules, requireNativeComponent, View, Text } from 'react-native';
import PropTypes from 'prop-types';

class MosambeeNativeView extends PureComponent {

	constructor(props) {
		super(props);
	}

	render() {
		return <MosambeeFrameView {...this.props}  />;
	}
}

MosambeeNativeView.propTypes = {
	mosambeeParameters: PropTypes.object,
	...View.propTypes,
}

const MosambeeFrameView = requireNativeComponent("MosambeePayment", MosambeeNativeView);

export default MosambeeNativeView;