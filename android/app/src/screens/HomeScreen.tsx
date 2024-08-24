import React from 'react';
import { StyleSheet, Text, View, Dimensions, ViewStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Card from '../components/card';

const { width } = Dimensions.get('window');
const CARD_SIZE = width / 2 - 30; // Adjust as needed

const HomeScreen: React.FC = () => {
  const navigation = useNavigation();

  const handleCardPress = (category: string) => {
    navigation.navigate('MenuScreen', { category });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.salonName}>Salon Name</Text>
      <Card
        title="Men's Services"
        onPress={() => handleCardPress('Men')}
        style={{ width: CARD_SIZE, height: CARD_SIZE } as ViewStyle}
      />
      <Card
        title="Women's Services"
        onPress={() => handleCardPress('Women')}
        style={{ width: CARD_SIZE, height: CARD_SIZE } as ViewStyle}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#000000',
    justifyContent: 'center', // Center cards vertically
    alignItems: 'center', // Center cards horizontally
  },
  salonName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#FFA500',
  },
});

export default HomeScreen;
