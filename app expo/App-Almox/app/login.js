import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity } from 'react-native'; //importa tudo isso da biblioteca react native
import { useFonts, Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter'; //importa fonte inter
import { Montserrat_400Regular, Montserrat_700Bold } from '@expo-google-fonts/montserrat'; //importa fonte montserrat
import { Poppins_700Bold } from '@expo-google-fonts/poppins'; //importa fonta poppins
import { LinearGradient } from 'expo-linear-gradient'; //importa linear gradiente
import AsyncStorage from '@react-native-async-storage/async-storage'; //importa AsyncStorage, que permite armazenar dados localmente no dispositivo.
import { useState } from 'react'; //importa useState usado para guardar informações que podem mudar durante a execução do aplicativo.
import { router } from 'expo-router'; //importa router, utilizado para navegar entre as telas do aplicativo.

export default function Login() { //exporta (outros arquivos do projeto podem importar essa função) default (função principal do arquivo) a função Login

  const [fontsLoaded] = useFonts({ //variável fontsLoaded = usa a desestruturação de um array para obter o primeiro valor retornado por useFonts.
    Inter_400Regular,
    Inter_700Bold,
    Montserrat_400Regular,
    Montserrat_700Bold,
    Poppins_700Bold,
  });
  //A variável fontsLoaded geralmente recebe um valor booleano:
  //true: as fontes terminaram de carregar.
  //false: as fontes ainda estão carregando ou não terminaram o carregamento.

  const [email, setEmail] = useState(''); //declara a variavel que recebe os dois valores retornados pelo useState | email = guarad o valor atual do email | setEmail = para atualizar o email | useState('') = cria um estado com valor inicial vazio ('').
  const [senha, setSenha] = useState(''); 

  const [emailFocus, setEmailFocus] = useState(false); //declara a variavel que guarda o estado atual do foco do campo de e-mail e a função utilizada para alterar esse estado | useState(false) = define o valor inicial como false, ou seja, o campo começa sem foco.
  const [senhaFocus, setSenhaFocus] = useState(false); 

  const fazerLogin = async () => { //declara a função fazerLogin 
  try { //inicia um bloco de código no qual podem ocorrer erros.
    const resposta = await fetch('http://10.154.20.25:5000/login_app', { //declara a variavel resposta que 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        senha: senha,
      }),
    });

    const dados = await resposta.json();

    console.log('STATUS:', resposta.status);
    console.log('RESPOSTA DO SERVIDOR:', dados);

    if (!resposta.ok) {
      alert(dados.mensagem || 'Email ou senha incorretos');
      return;
    }

    await AsyncStorage.setItem('tipoUsuario', dados.tipo);
    await AsyncStorage.setItem('nomeUsuario', dados.usuario);
    await AsyncStorage.setItem('emailUsuario', dados.email);

    router.replace('/tabela');

  } catch (erro) {
    console.log(erro);
    alert('Não foi possível conectar ao servidor');
  }
};

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>

      <Image
        source={require('../assets/industria.png')}
        style={styles.background}
        resizeMode="cover"
      />

      <LinearGradient
        colors={[
          'rgba(29, 50, 115, 0.25)',
          'rgba(82, 104, 168, 0.95)'
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.gradient}
      />

      <View style={styles.content}>

        <Text style={styles.paragraph1}>
          BOAS-VINDAS
        </Text>

        <Text style={styles.paragraph2}>
          AO SENAI ALMOXARIFADO
        </Text>

        <View style={styles.inputContainer}>

          <Image
            source={require('../assets/fiep.png')}
            style={styles.logo}
          />

          <Text style={styles.email}>
            Email
          </Text>

          <TextInput
            style={[
              styles.input,
              emailFocus && styles.inputFocus
            ]}
            placeholder="seunome@empresa.com"
            placeholderTextColor="#888"
            value={email}
            onChangeText={setEmail}
            onFocus={() => setEmailFocus(true)}
            onBlur={() => setEmailFocus(false)}
          />

          <Text style={styles.senha}>
            Senha
          </Text>

          <TextInput
            style={[
              styles.input,
              senhaFocus && styles.inputFocus
            ]}
            placeholder="Digite sua senha"
            placeholderTextColor="#888"
            value={senha}
            onChangeText={setSenha}
            onFocus={() => setSenhaFocus(true)}
            onBlur={() => setSenhaFocus(false)}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={fazerLogin}
          >
            <Text style={styles.buttonText}>
              ENTRAR
            </Text>
          </TouchableOpacity>

        </View>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  background: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },

  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  content: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    paddingTop: 100,
    paddingBottom: 60,
  },

  paragraph1: {
    width: '90%',
    fontSize: 23,
    fontFamily: 'Montserrat_400Regular',
    color: '#F0F1F2',
    textAlign: 'left',
    marginBottom: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 0,
  },

  paragraph2: {
    width: '90%',
    fontSize: 25,
    fontFamily: 'Montserrat_700Bold',
    color: '#F0F1F2',
    textAlign: 'left',
    marginBottom: 30,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 0,
  },

  inputContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    width: '90%',
    maxWidth: 350,
    minHeight: 435,
    marginTop: 50,
    paddingVertical: 20,
    paddingHorizontal: 10,
  },

  logo: {
    width: '100%',
    height: 110,
    resizeMode: 'contain',
    marginBottom: 20,
    alignSelf: 'center',
  },

  email: {
    color: '#1f1f1f',
    width: '90%',
    fontSize: 20,
    lineHeight: 25,
    fontFamily: 'Poppins_700Bold',
    marginBottom: 8,
    alignSelf: 'center',
  },

  senha: {
    color: '#1f1f1f',
    width: '90%',
    fontSize: 20,
    lineHeight: 25,
    fontFamily: 'Poppins_700Bold',
    marginBottom: 8,
    alignSelf: 'center',
  },

  input: {
    width: '90%',
    height: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D4D4D4',
    paddingHorizontal: 15,
    marginBottom: 15,
    alignSelf: 'center',
    outlineStyle: 'none',
  },

  inputFocus: {
    borderColor: '#1D3273',
    borderWidth: 2,
  },

  button: {
    width: '90%',
    height: 50,
    backgroundColor: '#1D3273',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 10,
  },

  buttonText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 16,
    color: '#FFFFFF',
  },
});