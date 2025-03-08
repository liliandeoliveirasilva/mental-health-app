import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, TouchableOpacity, Alert } from 'react-native';
import { Card, Title, Paragraph, Button, Chip, Divider, List, TextInput, Avatar, IconButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const activities = [
  { id: '1', name: 'Grupo de Apoio', schedule: 'Segunda-feira, 14h', participants: 12 },
  { id: '2', name: 'Oficina de Arte', schedule: 'Terça-feira, 15h', participants: 8 },
  { id: '3', name: 'Terapia em Grupo', schedule: 'Quarta-feira, 10h', participants: 15 },
  { id: '4', name: 'Yoga e Meditação', schedule: 'Quinta-feira, 9h', participants: 10 },
  { id: '5', name: 'Música e Expressão', schedule: 'Sexta-feira, 16h', participants: 14 }
];

export default function CommunityScreen() {
  const [expandedActivity, setExpandedActivity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const savedPosts = await AsyncStorage.getItem('communityPosts');
      if (savedPosts) {
        setPosts(JSON.parse(savedPosts));
      }
      setLoading(false);
    } catch (error) {
      console.error('Error loading posts:', error);
      Alert.alert('Erro', 'Não foi possível carregar as publicações.');
      setLoading(false);
    }
  };

  const handleAddPost = async () => {
    if (!newPost.trim()) {
      Alert.alert('Erro', 'Por favor, escreva algo para publicar.');
      return;
    }

    const post = {
      id: Date.now().toString(),
      content: newPost.trim(),
      author: 'Usuário',
      likes: 0,
      comments: [],
      timestamp: new Date().toISOString()
    };

    try {
      const updatedPosts = [post, ...posts];
      await AsyncStorage.setItem('communityPosts', JSON.stringify(updatedPosts));
      setPosts(updatedPosts);
      setNewPost('');
      Alert.alert('Sucesso', 'Sua publicação foi compartilhada!');
    } catch (error) {
      console.error('Error saving post:', error);
      Alert.alert('Erro', 'Não foi possível salvar sua publicação.');
    }
  };

  const handleLike = async (postId) => {
    try {
      const updatedPosts = posts.map(post =>
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      );
      await AsyncStorage.setItem('communityPosts', JSON.stringify(updatedPosts));
      setPosts(updatedPosts);
    } catch (error) {
      console.error('Error updating likes:', error);
      Alert.alert('Erro', 'Não foi possível curtir a publicação.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.headerCard}>
        <Card.Content>
          <Title style={styles.mainTitle}>CAPS Guanhães</Title>
          <Paragraph style={styles.paragraph}>
            Nosso CAPS Guanhães é um serviço de saúde mental que acompanha pessoas em situação 
            de sofrimento mental grave e persistente.
          </Paragraph>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Title style={styles.statNumber}>5+</Title>
              <Paragraph style={styles.statLabel}>Atividades</Paragraph>
            </View>
            <View style={styles.statItem}>
              <Title style={styles.statNumber}>50+</Title>
              <Paragraph style={styles.statLabel}>Participantes</Paragraph>
            </View>
            <View style={styles.statItem}>
              <Title style={styles.statNumber}>10+</Title>
              <Paragraph style={styles.statLabel}>Profissionais</Paragraph>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.subtitle}>Compartilhe sua experiência</Title>
          <TextInput
            multiline
            numberOfLines={3}
            value={newPost}
            onChangeText={setNewPost}
            placeholder="O que você gostaria de compartilhar?"
            style={styles.input}
          />
          <Button
            mode="contained"
            onPress={handleAddPost}
            style={styles.postButton}
          >
            Publicar
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.subtitle}>Feed da Comunidade</Title>
          {posts.map((post) => (
            <Card key={post.id} style={styles.postCard}>
              <Card.Content>
                <View style={styles.postHeader}>
                  <Avatar.Text size={40} label={post.author[0]} style={styles.avatar} />
                  <View style={styles.postHeaderInfo}>
                    <Title style={styles.postAuthor}>{post.author}</Title>
                    <Paragraph style={styles.postTime}>
                      {new Date(post.timestamp).toLocaleDateString('pt-BR')}
                    </Paragraph>
                  </View>
                </View>
                <Paragraph style={styles.postContent}>{post.content}</Paragraph>
                <View style={styles.postActions}>
                  <Button
                    icon="heart"
                    onPress={() => handleLike(post.id)}
                    style={styles.likeButton}
                    labelStyle={styles.likeButtonLabel}
                  >
                    {post.likes}
                  </Button>
                </View>
              </Card.Content>
            </Card>
          ))}
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.subtitle}>Atividades Disponíveis</Title>
          {activities.map((activity) => (
            <List.Accordion
              key={activity.id}
              title={activity.name}
              description={activity.schedule}
              expanded={expandedActivity === activity.id}
              onPress={() => setExpandedActivity(expandedActivity === activity.id ? null : activity.id)}
              style={styles.accordion}
              titleStyle={styles.accordionTitle}
              descriptionStyle={styles.accordionDescription}
            >
              <View style={styles.activityDetails}>
                <Paragraph style={styles.activityInfo}>
                  Participantes atuais: {activity.participants}
                </Paragraph>
                <Button
                  mode="contained"
                  onPress={() => alert(`Inscrição realizada para ${activity.name}`)}
                  style={styles.joinButton}
                >
                  Participar
                </Button>
              </View>
            </List.Accordion>
          ))}
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F9FF',
    padding: 16,
  },
  headerCard: {
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: '#1976D2',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  mainTitle: {
    fontSize: 24,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
    fontWeight: 'bold',
  },
  paragraph: {
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.9,
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#FFFFFF',
    opacity: 0.9,
  },
  card: {
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  subtitle: {
    fontSize: 20,
    color: '#1976D2',
    marginBottom: 16,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
    borderColor: '#1976D2',
  },
  postButton: {
    borderRadius: 8,
  },
  postCard: {
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderColor: '#E0E0E0',
    borderWidth: 1,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    backgroundColor: '#1976D2',
  },
  postHeaderInfo: {
    marginLeft: 12,
    flex: 1,
  },
  postAuthor: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  postTime: {
    fontSize: 12,
    color: '#666666',
  },
  postContent: {
    fontSize: 14,
    color: '#333333',
    lineHeight: 20,
    marginBottom: 12,
  },
  postActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeButton: {
    marginRight: 16,
  },
  likeButtonLabel: {
    fontSize: 14,
    color: '#1976D2',
  },
  accordion: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  accordionTitle: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '600',
  },
  accordionDescription: {
    fontSize: 14,
    color: '#666666',
  },
  activityDetails: {
    padding: 16,
    backgroundColor: '#F5F9FF',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  activityInfo: {
    fontSize: 14,
    color: '#333333',
    marginBottom: 12,
  },
  joinButton: {
    borderRadius: 8,
  },
});