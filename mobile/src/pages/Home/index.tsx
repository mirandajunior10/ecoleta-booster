import React, { useEffect, useState } from 'react'
import { Feather as Icon } from "@expo/vector-icons";
import { View, StyleSheet, Image, Text, ImageBackground, Picker } from 'react-native';
import { RectButton } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import axios from 'axios'


interface IBGEUFResponse {
  sigla: string
}
interface IBGECityResponse {
  nome: string
}

const Home = () => {

  const [UFs, setUFs] = useState<string[]>([])
  const [selectedUF, setSelectedUF] = useState('0')

  const [cities, setCities] = useState<string[]>([])
  const [selectedCity, setSelectedCity] = useState('0')

  const navigation = useNavigation()



  useEffect(() => {
    axios
      .get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
      .then(response => {
        const ufInitials = response.data.map(uf => uf.sigla)
        ufInitials.sort()
        setUFs(ufInitials)
      })
  }, [])


  useEffect(() => {
    if (selectedUF === '0') return

    axios
      .get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUF}/municipios`)
      .then(response => {
        const cities = response.data.map(city => city.nome)
        setCities(cities)
      })
  }, [selectedUF])

  return (
    <ImageBackground
      source={require('../../assets/home-background.png')}
      style={styles.container}
      imageStyle={{ width: 274, height: 368 }}
    >
      <View style={styles.main}>
        <Image source={require('../../assets/logo.png')} />
        <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
        <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
      </View>





      <View style={styles.footer}>
        <Picker style={styles.select} selectedValue={selectedUF} onValueChange={(value, position) => setSelectedUF(value)}>
          {UFs.map(uf => (
            <Picker.Item key={uf} label={uf} value={uf}></Picker.Item>
          ))}
        </Picker>

        <Picker style={styles.select} selectedValue={selectedCity} onValueChange={(value, position) => setSelectedCity(value)}>
          {cities.map(city => (
            <Picker.Item key={city} label={city} value={city}></Picker.Item>
          ))}
        </Picker>
        <RectButton style={styles.button} onPress={() => { navigation.navigate("Points", { uf: selectedUF, city: selectedCity }) }}>
          <View style={styles.buttonIcon}>
            <Text>
              <Icon name='arrow-right' color='#fff' size={24} />
            </Text>
          </View>
          <Text style={styles.buttonText}>
            Entrar
          </Text>
        </RectButton>
      </View>
    </ImageBackground>
  )
}

export default Home


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    fontSize: 16
  },

  input: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  }
});