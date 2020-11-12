import React, { useCallback, useRef, useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import { useAuth } from '../../../hooks/AuthContext';
import api from '../../../services/api';

import Icon from 'react-native-vector-icons/Feather';
import Input from '../../../components/Input';
import Button from '../../../components/Button';

import { 
  Container,
  Header,
  TopHeaderContainer,
  HeaderTitle,
  IconButton,
  ProfileImage,
  TabContainer,
  Tab,
  TabText,
  InputContainer,
  ButtonContainer,
} from './styles';

interface Profile {
  id: string;
  name: string;
  email: string;
  image: string;
}

interface ProfileParams {
  profile: Profile;
}

const EditProfile: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { updateUser } = useAuth();
  const { goBack, navigate, reset } = useNavigation();
  const { profile } = useRoute().params as ProfileParams;

  const [selectedTab, setSelectedTab] = useState('profile');
  
  const handleGoBack = useCallback(() => {
    goBack();
  }, []);

  const handleSubmitForm = useCallback(async (data) => {
    if (selectedTab === 'profile') {
      console.log(data);
      if (!data.email && !data.name || data.email === '' && data.name === '') {
        goBack();

        return;
      }

      try{
        const requestBody = {
          email: data.email ? data.email : profile.email,
          name: data.name ? data.name : profile.name,
        }

        const response = await api.put('profile', requestBody);

        const user = response.data;

        updateUser(user);

        Alert.alert('Perfil atualizado!');

        reset({
          index: 0,
          routes: [
            { name: 'Profile' },
          ]
        });

        navigate('Profile');
      }catch(err) {
        Alert.alert('Houve um problema ao atualizar o perfil');
      }
    }
    if (selectedTab === 'password') {

    }
  }, []);

  return (
    <Container>
      <Header>
        <TopHeaderContainer>
          <IconButton onPress={handleGoBack}>
            <Icon name="chevron-left" size={20} color="#aeaeb3"/>
          </IconButton>

          <HeaderTitle>Editar Perfil</HeaderTitle>

          <IconButton />
        </TopHeaderContainer>

        <ProfileImage source={{ uri: profile.image }} />
      </Header>

      <TabContainer>
        <Tab 
          selected={selectedTab === 'profile'} 
          onPress={() => setSelectedTab('profile')}
        >
          <TabText selected={selectedTab === 'profile'}>Dados</TabText>
        </Tab>
        <Tab 
          selected={selectedTab === 'password'} 
          onPress={() => setSelectedTab('password')}
        >
          <TabText selected={selectedTab === 'password'}>Trocar senha</TabText>
        </Tab>
      </TabContainer>

      <Form ref={formRef} onSubmit={handleSubmitForm} >
        {selectedTab === 'profile' ? (
          <InputContainer>
            <Input 
              name="name" 
              placeholder="Nome"
              defaultValue={profile.name}
              icon="user" 
              />
            <Input 
              name="email"
              placeholder="E-mail"
              defaultValue={profile.email}
              icon="mail"
            />    
          </InputContainer>
        ) : (
          <InputContainer>
            <Input
              name="currentPassword"
              placeholder="Senha atual"
              icon="lock"
            />    
            <Input 
              name="newPassword"
              placeholder="Nova senha"
              icon="lock"
            />    
            <Input 
              name="confirmPassword"
              placeholder="Confirmar senha"
              icon="lock"
            />    
          </InputContainer>
        )}
      </Form>

      <ButtonContainer>
        <Button 
          text="Salvar alterações"
          onPress={() => {formRef.current?.submitForm()}}
        />
      </ButtonContainer>
    </Container>
  );
};

export default EditProfile;
