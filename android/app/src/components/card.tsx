import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface CardProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
}

const Card: React.FC<CardProps> = ({ title, onPress, style }) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.card, style]}>
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#444',
    borderRadius: 8,
    padding: 20,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%', // Ensure the card has height
    width: '100%',  // Ensure the card has width
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Card;
