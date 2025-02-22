import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Card, Title, Text } from 'react-native-paper';

const meditations = [
  {
    id: '1',
    title: 'Respiração Consciente',
    description: 'Uma prática simples de respiração para reduzir ansiedade.',
    audioUrl: 'https://www.youtube.com/watch?v=HE-082IZs4w&ab_channel=TudoSobreEspiritualidade'
  },
  {
    id: '2',
    title: 'Meditação para Relaxamento Profundo',
    description: 'Relaxamento profundo para relaxar profundamente.',
    audioUrl: 'https://www.youtube.com/watch?v=dkg1N8-cFV8&ab_channel=YogaMudraRaissaZoccal'
  },
  {
    id: '3',
    title: 'Redução de Estresse',
    description: 'Técnicas de mindfulness para momentos de estresse.',
    audioUrl: 'https://www.youtube.com/watch?v=dyYO-k-fQDQ&ab_channel=MeditarparaDespertar'
  },
  {
    id: '4',
    title: 'Redução de Ansiedade',
    description: 'Técnicas de meditação para controle de ansiedade.',
    audioUrl: 'https://www.youtube.com/watch?v=dyYO-k-fQDQ&t=9s&ab_channel=MeditarparaDespertar'
  },
  {
    id: '5',
    title: 'Meditacão para Dormir',
    description: 'Técnicas de meditação para dormir bem.',
    audioUrl: 'https://www.youtube.com/watch?v=z52ba6k1LSE&t=2s&ab_channel=MeditarparaDespertar'
  }
];

export default function MeditationScreen() {
  async function openYoutubeLink(meditation) {
    try {
      const supported = await Linking.canOpenURL(meditation.audioUrl);
      if (supported) {
        await Linking.openURL(meditation.audioUrl);
      } else {
        alert('Não foi possível abrir o link da meditação');
      }
    } catch (error) {
      console.error('Error opening YouTube link:', error);
      alert('Ocorreu um erro ao tentar abrir a meditação');
    }
  }

  return (
    <ScrollView style={styles.container}>
      {meditations.map((meditation) => (
        <TouchableOpacity
          key={meditation.id}
          onPress={() => openYoutubeLink(meditation)}
        >
          <Card style={styles.meditationCard}>
            <Card.Content>
              <Title>{meditation.title}</Title>
              <Text>{meditation.duration}</Text>
              <Text style={styles.description}>{meditation.description}</Text>
            </Card.Content>
          </Card>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f6f6f6',
    borderColor: '#1976D2',
    borderWidth: 1,
  },
  meditationCard: {
    marginBottom: 12,
    borderColor: '#1976D2',
    borderWidth: 1,
    borderRadius: 8,
    elevation: 4,
  },
  description: {
    marginTop: 8,
    color: '#666',
    lineHeight: 20,
  },
});