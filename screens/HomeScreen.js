import React from 'react';
import { ScrollView, StyleSheet, View, Linking } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const features = [
  {
    id: '1',
    title: 'Diário',
    description: 'Registre seus pensamentos e emoções diárias',
    icon: 'book-open-variant',
    route: 'Diário'
  },
  {
    id: '2',
    title: 'Meditação',
    description: 'Pratique meditação guiada para melhorar sua saúde mental',
    icon: 'meditation',
    route: 'Meditação'
  },
  {
    id: '3',
    title: 'Lembretes',
    description: 'Configure lembretes para suas atividades de bem-estar',
    icon: 'bell',
    route: 'Lembretes'
  },
  {
    id: '4',
    title: 'Comunidade',
    description: 'Conecte-se e compartilhe experiências com outras pessoas',
    icon: 'account-group',
    route: 'Comunidade'
  },
  {
    id: '5',
    title: 'Recursos',
    description: 'Encontre recursos e locais de apoio próximos na cidade de Guanhães',
    icon: 'map-marker',
    route: 'Recursos'
  },
  {
    id: '6',
    title: 'Agendamentos',
    description: 'Entre em contato via WhatsApp para agendar sua consulta',
    icon: 'calendar-clock',
    action: () => Linking.openURL('whatsapp://send?phone=5533991968730')
  }
];

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.headerTitle}>Bem-vindo ao seu espaço de saúde mental</Title>
        <Paragraph style={styles.headerSubtitle}>Escolha uma opção abaixo para começar</Paragraph>
      </View>
      <View style={styles.grid}>
        {features.map((feature) => (
          <Card
            key={feature.id}
            style={styles.card}
            onPress={() => feature.action ? feature.action() : navigation.navigate(feature.route)}
          >
            <Card.Content style={styles.cardContent}>
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons
                  name={feature.icon}
                  size={36}
                  color="#1976D2"
                />
              </View>
              <Title style={styles.title}>{feature.title}</Title>
              <Paragraph style={styles.description}>{feature.description}</Paragraph>
            </Card.Content>
          </Card>
        ))}
      </View>
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
    marginBottom: 16,
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    justifyContent: 'space-between',
  },
  card: {
    width: '47%',
    marginBottom: 16,
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
    padding: 16,
    alignItems: 'center',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#1976D2',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
    color: '#1976D2',
    fontWeight: '600',
  },
  description: {
    fontSize: 12,
    textAlign: 'center',
    color: '#666666',
    lineHeight: 16,
  },
});