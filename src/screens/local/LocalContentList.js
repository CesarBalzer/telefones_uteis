import React from 'react';
import { View } from 'react-native';
import SkelletonPhoneItem from '../../skeletons/SkelletonPhoneItem';
import LocalContent from '../../components/Content/LocalContent';

const LocalContentList = ({ phones, loading }) => {
  return (
    <View>
      {loading
        ? [1, 2, 3, 4, 5].map((i) => <SkelletonPhoneItem key={i} />)
        : <LocalContent data={phones} />}
    </View>
  );
};

export default LocalContentList;
