import React, { useEffect, useState } from 'react';
import { Image, StatusBar } from 'react-native';
import { FlatList } from 'react-native';
import {
  Button,
  DeviceEventEmitter,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import RNFS from 'react-native-fs';
import {
  addShortcutToScreen,
  exists,
  // removeShortcut,
  removeAllShortcuts,
  // addPinnedShortcut,
  // addShortcut,
  // checkPermissionToCall,
  // updateShortcut,
  addDetailToShortcut,
  // getDrawableImageNames,
} from 'react-native-shortcuts-launcher';

const App = () => {
  const [idShortcut, setIdShortcut] = useState();
  // const [images, setImages] = useState([]);
  const [imagePaths, setImagePaths] = useState([]);
  // const imageDir = RNFS.DocumentDirectoryPath + '/assets';
  // const imagesDir = RNFS.MainBundlePath + '/assets/icons';

  const getAllFilePathsFromFolder = async (folderName) => {
    const reader = await RNFS.readDirAssets(folderName);
    // console.log('READER => ', reader);
    const directories = reader.filter((item) => item.isDirectory());
    // console.log('DIRECTORIES => ', directories);
    const files = reader
      .filter((item) => item.isFile())
      .map((file) => file.path);

    const directioriesFilesPromises = directories.map((dir) =>
      getAllFilePathsFromFolder(dir.path)
    );

    const directioriesFiles = await (
      await Promise.all(directioriesFilesPromises)
    ).flat(Infinity);

    return [...files, ...directioriesFiles];
  };

  useEffect(() => {
    const listFilesInAssetsIcons = async () => {
      const files = await getAllFilePathsFromFolder('icons');
      console.log('FILES => ', files);

      const imageFiles = files.filter((filename) => filename.includes('.png'));
      setImagePaths(imageFiles);
    };

    listFilesInAssetsIcons();
  }, []);

  useEffect(() => {
    DeviceEventEmitter.addListener('quickActionShortcut', (data) => {
      console.log(data.title);
      console.log(data.type);
      console.log(data.userInfo);
    });
  }, []);

  // const checkPermission = () => {
  //   checkPermissionToCall();
  // };

  const addDetail = () => {
    addDetailToShortcut({
      id: idShortcut?.toString(),
      shortLabel: 'sample',
      longLabel: 'sample label',
      iconFolderName: 'drawable',
      iconName: 'sos',
    });
  };

  const createShortCut = async () => {
    try {
      let url = `whatsapp://send?text=Teste de mensagem&42999339947`;
      const e = await addShortcutToScreen({
        id: Date.now().toString(),
        phoneNumber: '554299339947',
        shortLabel: 'BAGUA',
        longLabel: 'Balzer',
        iconFolderName: 'drawable',
        iconName: 'heart',
      });

      console.log('CREATE SHORTCUTS => ', e);
      setIdShortcut(e.shortcutId);
    } catch (err) {
      console.log('ERRO CREATE SHORTCUTS => ', err);
    }
  };

  // const pinnedShortcut = () => {
  //   const shortcuts = {
  //     id: Date.now().toString(),
  //     iconBitmap: 'null',
  //     phone: '01542999120288',
  //     shortLabel: 'Short Label',
  //     longLabel: 'Long label',
  //     iconFolderName: 'drawable',
  //     iconName: 'axe',
  //     intent: {
  //       action: 'android.intent.action.CALL',
  //       // "categories": [
  //       // 'android.intent.category.CALL', // Built-in Android category
  //       // 'MY_CATEGORY' // Custom categories are also supported
  //       // ],
  //       flags: 'FLAG_ACTIVITY_CLEAR_TOP',
  //       // "data": 'myapp://telefones_uteis/index.html?param=value', // Must be a well-formed URI
  //       // "extras": {
  //       //   'android.intent.extra.SUBJECT': 'Hello world!', // Built-in Android extra (string)
  //       //   'nro_fone': '99999999999', // Custom extras are also supported (boolean, number and string only)
  //       // }
  //       phone: '01542999339947', // Custom extras are also supported (boolean, number and string only)
  //     },
  //   };
  //   // const jsonString = JSON.stringify(shortcuts);
  //   // const jsonArray = new JSONArray(jsonString);

  //   addPinnedShortcut(JSON.stringify(shortcuts))
  //     .then(function (e) {
  //       console.log('ADD PINNED SHORTCUTS => ', e);
  //     })
  //     .catch(function (err) {
  //       console.log('ERRO PINNED SHORTCUTS => ', err);
  //     });
  // };

  const checkExistsShortCut = () => {
    exists('id1')
      .then(function (e) {
        console.log('RN APP SHORTCUTS => ', e);
      })
      .catch(function (err) {
        console.log('ERRO RN APP SHORTCUTS => ', err);
      });
  };

  const removeAllShortCuts = () => {
    removeAllShortcuts();
  };

  // const getDrawableImages = async () => {
  //   try {
  //     const imagePaths = await getDrawableImageNames();
  //     const images = imagePaths.map((imagePath) => ({ uri: imagePath }));
  //     setImages(images);
  //     console.log('GET DRAWABLE IMAGES IMAGES => ', images);
  //   } catch (error) {
  //     console.log('GET DRAWABLE IMAGES ERROR => ', error);
  //   }
  // };

  // const ImageList = ({ images }) => {
  //   return (
  //     <FlatList
  //       data={images}
  //       renderItem={({ item }) => (
  //         <View>
  //           <Image
  //             source={{ uri: item.uri }}
  //             style={{ width: 100, height: 100 }}
  //           />
  //         </View>
  //       )}
  //       keyExtractor={(item) => item.key}
  //     />
  //   );
  // };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Image source={{ uri: `asset:/${item}` }} style={styles.imageItem} />
      <Text>{item}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      {/* <View style={styles.actions}>
        <Button style={styles.buttons} title="Call to my love!" onPress={handleCallNumber}></Button>
      </View> */}
      <View style={styles.actions}>
        <Button
          style={styles.buttons}
          title="Create shortcut"
          onPress={createShortCut}
        />
      </View>
      <View style={styles.actions}>
        <Button
          style={styles.buttons}
          title="Add details"
          onPress={addDetail}
        />
      </View>
      {/* <View style={styles.actions}>
        <Button
          style={styles.buttons}
          title="GET IMAGENS"
          onPress={getDrawableImages}
        ></Button>
      </View> */}
      {/* <ImageList images={images} /> */}
      <View style={styles.list}>
        <FlatList
          data={imagePaths}
          renderItem={renderItem}
          keyExtractor={(item) => item}
        />
      </View>
      {/* <View style={styles.actions}>
        <Button style={styles.buttons} title="Check permission!" onPress={checkPermission}></Button>
      </View> */}
      <View style={styles.actions}>
        <Button
          style={styles.buttons}
          title="Check shortcut!"
          onPress={checkExistsShortCut}
        />
      </View>
      {/* <View style={styles.actions}>
        <Button
          style={styles.buttons}
          title="Pinned shortcut!"
          onPress={pinnedShortcut}
        ></Button>
      </View> */}
      {/* <View style={styles.actions}>
        <Button style={styles.buttons} title="Added detail to shortcut!" onPress={addedShortCut}></Button>
      </View> */}
      <View style={styles.actions}>
        <Button
          style={styles.buttons}
          title="Remove all shortcut"
          onPress={removeAllShortCuts}
        />
      </View>
      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e9e9e9',
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  actions: {
    // flex: 1,
    marginVertical: 20,
  },
  buttons: {
    padding: 20,
    marginVertical: 10,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fffff4',
  },
  imageItem: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  list: { height: 300 },
});

export default App;
