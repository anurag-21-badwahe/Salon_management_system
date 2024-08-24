import React from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import salonData from '../data/salonMenu';
import { RouteProp } from '@react-navigation/native';

type RootStackParamList = {
  Home: undefined;
  MenuScreen: { category: string };
  Auth: undefined;
};

type MenuScreenRouteProp = RouteProp<RootStackParamList, 'MenuScreen'>;

interface MenuScreenProps {
  route: MenuScreenRouteProp;
}

const MenuScreen: React.FC<MenuScreenProps> = ({ route }) => {
  const { category } = route.params;
  const services = salonData.salonMenu[category as keyof typeof salonData.salonMenu];

  // Sort services by price in ascending order
  const sortedServices = [...services].sort((a, b) => a.price - b.price);

  const renderItem = ({ item }: { item: { service: string; price: number } }) => (
    <View style={styles.menuItem}>
      <Text style={styles.serviceName}>{item.service}</Text>
      <Text style={styles.servicePrice}>₹{item.price}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{category} Services</Text>
      <FlatList
        data={sortedServices}
        renderItem={renderItem}
        keyExtractor={(item) => item.service}
        contentContainerStyle={styles.menuList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#000000',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FFA500',
  },
  menuList: {
    flexGrow: 1,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#FFFFFF',
    backgroundColor: '#333333',
  },
  serviceName: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  servicePrice: {
    fontSize: 18,
    color: '#FFA500',
  },
});

export default MenuScreen;
