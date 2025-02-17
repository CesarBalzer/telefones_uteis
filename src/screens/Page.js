import { useNavigation } from '@react-navigation/native';
import { Text, Button, View } from 'react-native';

const Page = () => {
  const navigation = useNavigation();

  return (
    <View>
      <Text>Page</Text>
      <Button
        title="Log out"
        // navigation reset allows us to reset the navigation hierarchy
        // and set 'Login' as the root
        onPress={() =>
          navigation.reset({ index: 0, routes: [{ name: 'Login' }] })
        }
      />
    </View>
  );
};

export default Page;
