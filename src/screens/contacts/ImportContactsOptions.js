import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const ImportContactsOptions = ({
  setShowOptions,
  fetchContacts,
  importContacts,
  contacts,
}) => (
  <View
    style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    }}
  >
    <Text style={{ fontSize: 18, textAlign: 'center', marginBottom: 20 }}>
      Como você gostaria de carregar seus contatos?
    </Text>

    {!contacts && (
      <TouchableOpacity
        style={[styles.button, { backgroundColor: 'green' }]}
        onPress={() => {
          setShowOptions(false);
          fetchContacts();
        }}
      >
        <Text style={styles.buttonText}>Visualizar Contatos</Text>
      </TouchableOpacity>
    )}

    <TouchableOpacity
      style={[styles.button, { backgroundColor: 'purple' }]}
      onPress={() => {
        setShowOptions(false);
        importContacts();
      }}
    >
      <Text style={styles.buttonText}>Importar para o App</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={[styles.button, { backgroundColor: 'gray' }]}
      onPress={() => {
        setShowOptions(false);
        importContacts(true);
      }}
    >
      <Text style={styles.buttonText}>Sobrescrever Tudo</Text>
    </TouchableOpacity>
  </View>
);

const styles = {
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
};

export default ImportContactsOptions;
