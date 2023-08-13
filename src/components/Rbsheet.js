import React, {useRef} from 'react';
import RBSheet from 'react-native-raw-bottom-sheet';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  TouchableOpacity,
  View,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const Rbsheet = ({silref, amac, kaydetref}) => {
  if (amac == 'sil' && silref.current) {
    silref.current.open();
  } else if (amac == 'kaydet' && kaydetref.current) {
    kaydetref.current.open();
  }

  const Kapat = () => {
    if (amac == 'sil') {
      silref.current.close();
    } else if (amac == 'kaydet') {
      kaydetref.current.close();
    }
  };

  return (
    <SafeAreaView>
      {amac == 'sil' && (
        <View>
          <RBSheet
            ref={silref}
            height={150}
            openDuration={200}
            customStyles={{
              container: {
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#039BE5',
              },
            }}>
            <Text style={{fontSize: 16, fontWeight: '500', marginBottom: 20}}>
              Sohbeti Silmek İstediğinizden Emin Misiniz ?{' '}
            </Text>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <TouchableOpacity
                onPress={() => Kapat()}
                style={{
                  padding: 10,
                  backgroundColor: 'red',
                  elevation: 5,
                  borderRadius: 5,
                }}>
                <Text
                  style={{
                    fontSize: 15,
                    color: 'whitesmoke',
                    fontWeight: '500',
                  }}>
                  Hayır
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  padding: 10,
                  backgroundColor: 'green',
                  marginLeft: 20,
                  elevation: 5,
                  borderRadius: 5,
                }}>
                <Text
                  style={{
                    fontSize: 15,
                    color: 'whitesmoke',
                    fontWeight: '500',
                  }}>
                  Evet
                </Text>
              </TouchableOpacity>
            </View>
          </RBSheet>
        </View>
      )}
      {amac == 'kaydet' && (
        <View>
          <RBSheet
            ref={kaydetref}
            height={200}
            openDuration={200}
            customStyles={{
              container: {
                justifyContent: 'flex-start',
                alignItems: 'center',
                backgroundColor: '#039BE5',
              },
            }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '500',
                marginBottom: 0,
                marginTop: 20,
              }}>
              Kaydedeceğiniz Başlık İsmini Girin
            </Text>
            <TextInput
              style={{
                borderRadius: 5,
                elevation: 5,
                paddingTop: 0,
                paddingBottom: 0,
                backgroundColor: 'whitesmoke',
                width: '80%',
                height: 35,
                marginBottom: 10,
                fontSize: 14,
                marginTop: 10,
              }}
              placeholder="Bir metin giriniz."
            />
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <TouchableOpacity
                onPress={() => Kapat()}
                style={{
                  padding: 10,
                  backgroundColor: 'red',
                  elevation: 5,
                  borderRadius: 5,
                }}>
                <Text
                  style={{
                    fontSize: 15,
                    color: 'whitesmoke',
                    fontWeight: '500',
                  }}>
                  Vazgeç
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  padding: 10,
                  backgroundColor: 'green',
                  marginLeft: 20,
                  elevation: 5,
                  borderRadius: 5,
                }}>
                <Text
                  style={{
                    fontSize: 15,
                    color: 'whitesmoke',
                    fontWeight: '500',
                  }}>
                  Kaydet
                </Text>
              </TouchableOpacity>
            </View>
          </RBSheet>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Rbsheet;
