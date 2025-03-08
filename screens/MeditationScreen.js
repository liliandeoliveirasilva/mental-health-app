import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Linking, ActivityIndicator } from 'react-native';
import { Card, Title, Text, Snackbar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const meditations = [
  {
    id: '1',
    title: 'Respiração Consciente',
    description: 'Uma prática simples de respiração para reduzir ansiedade.',
    audioUrl: 'https://www.youtube.com/watch?v=HE-082IZs4w&ab_channel=TudoSobreEspiritualidade',
    icon: 'breath'
  },
  {
    id: '2',
    title: 'Meditação para Relaxamento Profundo',
    description: 'Relaxamento profundo para relaxar profundamente.',
    audioUrl: 'https://www.youtube.com/watch?v=dkg1N8-cFV8&ab_channel=YogaMudraRaissaZoccal',
    icon: 'yoga'
  },
  {
    id: '3',
    title: 'Redução de Estresse',
    description: 'Técnicas de mindfulness para momentos de estresse.',
    audioUrl: 'https://www.youtube.com/watch?v=dyYO-k-fQDQ&ab_channel=MeditarparaDespertar',
    icon: 'meditation'
  },
  {
    id: '4',
    title: 'Redução de Ansiedade',
    description: 'Técnicas de meditação para controle de ansiedade.',
    audioUrl: 'https://www.youtube.com/watch?v=dyYO-k-fQDQ&t=9s&ab_channel=MeditarparaDespertar',
    icon: 'heart-pulse'
  },
  {
    id: '5',
    title: 'Meditacão para Dormir',
    description: 'Técnicas de meditação para dormir bem.',
    audioUrl: 'https://www.youtube.com/watch?v=z52ba6k1LSE&t=2s&ab_channel=MeditarparaDespertar',
    icon: 'moon-waning-crescent'
  }
];

export default function MeditationScreen() {
  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const showSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  async function openYoutubeLink(meditation) {
    setLoading(true);
    try {
      const supported = await Linking.canOpenURL(meditation.audioUrl);
      if (supported) {
        await Linking.openURL(meditation.audioUrl);
      } else {
        showSnackbar('Não foi possível abrir o link da meditação');
      }
    } catch (error) {
      console.error('Error opening YouTube link:', error);
      showSnackbar('Ocorreu um erro ao tentar abrir a meditação');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={styles.container}>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1976D2" />
          <Text style={styles.loadingText}>Abrindo meditação...</Text>
        </View>
      )}
      <View style={styles.header}>
        <Title style={styles.headerTitle}>Meditações Guiadas</Title>
        <Text style={styles.headerSubtitle}>Escolha uma meditação para começar sua prática</Text>
      </View>
      <View style={styles.meditationList}>
        {meditations.map((meditation) => (
          <TouchableOpacity
            key={meditation.id}
            onPress={() => openYoutubeLink(meditation)}
            style={styles.meditationCardWrapper}
          >
            <Card style={styles.meditationCard}>
              <Card.Content style={styles.cardContent}>
                <View style={styles.iconContainer}>
                  <MaterialCommunityIcons
                    name={meditation.icon}
                    size={32}
                    color="#1976D2"
                  />
                </View>
                <View style={styles.textContainer}>
                  <Title style={styles.title}>{meditation.title}</Title>
                  <Text style={styles.description}>{meditation.description}</Text>
                </View>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        ))}
      </View>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={styles.snackbar}
      >
        {snackbarMessage}
      </Snackbar>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F9FF',
  },
  header: {
    padding: 24,
    backgroundColor: '#1976D2',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 24,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.9,
  },
  meditationList: {
    padding: 16,
  },
  meditationCardWrapper: {
    marginBottom: 16,
  },
  meditationCard: {
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    color: '#1976D2',
    marginBottom: 4,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#1976D2',
    fontWeight: '500',
  },
  snackbar: {
    margin: 16,
    borderRadius: 8,
    backgroundColor: '#323232',
  },
});