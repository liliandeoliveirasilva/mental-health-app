import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';

export default function CommunityScreen() {
  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>CAPS Guanhães</Title>
          <Paragraph style={styles.paragraph}>
            Nosso CAPS Guanhães é um serviço de saúde mental que acompanha pessoas em situação 
            de sofrimento mental grave e persistente.
          </Paragraph>
          <Paragraph style={styles.paragraph}>
            Nós desenvolvemos várias estratégias terapêuticas adequadas às pessoas que são 
            acompanhadas aqui.
          </Paragraph>
          <Paragraph style={styles.paragraph}>
            Tudo junto e misturado! Temos oficinas, atividades culturais, grupos terapêuticos, 
            atendimentos individualizados, suporte e orientação aos familiares, lazer e orientação 
            sobre os direitos em saúde mental dos usuários.
          </Paragraph>
          <Title style={styles.subtitle}>Atividades Disponíveis</Title>
          <Paragraph style={styles.paragraph}>
            Este é o quadro atual de nossas atividades coletivas.
          </Paragraph>
          <Paragraph style={styles.highlight}>
            Se você é um usuários do CAPS Guanhães pode participar de quantas desejar!
          </Paragraph>
        </Card.Content>
      </Card>
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
  card: {
    marginBottom: 16,
    borderColor: '#1976D2',
    borderWidth: 1,
    borderRadius: 8,
    elevation: 4,
  },
  paragraph: {
    marginBottom: 16,
    fontSize: 16,
    lineHeight: 24,
  },
  subtitle: {
    marginTop: 24,
    marginBottom: 16,
    fontSize: 20,
  },
  highlight: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1976D2',
  },
});