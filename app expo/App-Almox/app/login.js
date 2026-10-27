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

  const fazerLogin = async () => { //declara a função fazerLogin, que pode executar funções assíncronas | = (chama a função pra ser executada) | 
  try { //tentar executar um bloco de código e permitir tratar erros caso alguma operação falhe.
    const resposta = await fetch('http://10.154.20.25:5000/login_app', { //Essa linha faz uma requisição a um servidor e guarda a resposta recebida na variável resposta.
      method: 'POST', //vai usar o método POST, envia dados ao servidor
      headers: { //cabeçalho do HTTP - informações adicionais que acompanham a requisição e ajudam o servidor a entender como interpretar os dados recebidos.
        'Content-Type': 'application/json', //indica o formato do conteúdo que estamos enviado = JSON
      },
      body: JSON.stringify({ //o body é um requisição HTTP em formato de string de JSON
        email: email, //a propriedade email tem o valor da variavel email
        senha: senha, //a propriedade senha tem o valor da variavel senha
      }),
    });

    const dados = await resposta.json(); //a variavel dados para e espera pra receber a resposta em JSON

    console.log('STATUS:', resposta.status); //mostra o código de status HTTP da resposta no console.
    console.log('RESPOSTA DO SERVIDOR:', dados); //imprime no console o conteúdo que você armazenou na variável dados.

    if (!resposta.ok) { //verifica se a requisição HTTP não foi bem-sucedida.
      alert(dados.mensagem || 'Email ou senha incorretos'); //exibe uma mensagem na tela.
      return; //encerra a execução atual | As instruções que vierem depois desse return não são executadas.
    }

    await AsyncStorage.setItem('tipoUsuario', dados.tipo); //salva o tipo de usuário no armazenamento local do aplicativo. | AsyncStorage: é uma biblioteca usada no React Native para armazenar dados persistentes no dispositivo.
    await AsyncStorage.setItem('nomeUsuario', dados.usuario); //salva o nome do usuário no dispositivo.
    await AsyncStorage.setItem('emailUsuario', dados.email); //salva o e-mail do usuário.

    router.replace('/tabela'); //navega para a tela /tabela do aplicativo.

  } catch (erro) { //inicia o bloco que trata exceções geradas dentro do try.
    console.log(erro); //imprime os detalhes do erro no console.
    alert('Não foi possível conectar ao servidor'); //exibe uma mensagem para o usuário informando que houve um problema.
  }
};

  if (!fontsLoaded) { //Se as fontes ainda não tiverem carregado...
    return null; //encerra a execução da função do componente naquele momento e retorna null.
  }

  return ( //
    <View style={styles.container}> //

      <Image //
        source={require('../assets/industria.png')} //
        style={styles.background} //
        resizeMode="cover" //
      />

      <LinearGradient //
        colors={[ //
          'rgba(29, 50, 115, 0.25)', //
          'rgba(82, 104, 168, 0.95)' //
        ]}
        start={{ x: 0, y: 0 }} //
        end={{ x: 0, y: 1 }} //
        style={styles.gradient} //
      />

      <View style={styles.content}> 

        <Text style={styles.paragraph1}> {/**/}
          BOAS-VINDAS
        </Text>

        <Text style={styles.paragraph2}> {/**/}
          AO SENAI ALMOXARIFADO
        </Text>

        <View style={styles.inputContainer}> {/**/}

          <Image /**/
            source={require('../assets/fiep.png')} /**/
            style={styles.logo} /**/
          />

          <Text style={styles.email}> {/**/}
            Email
          </Text>

          <TextInput /**/
            style={[ 
              styles.input, /**/
              emailFocus && styles.inputFocus /**/
            ]}
            placeholder="seunome@empresa.com" /**/
            placeholderTextColor="#888" /**/
            value={email} /**/
            onChangeText={setEmail} /**/
            onFocus={() => setEmailFocus(true)} /**/
            onBlur={() => setEmailFocus(false)} /**/
          />

          <Text style={styles.senha}> {/**/}
            Senha
          </Text>

          <TextInput /**/
            style={[ 
              styles.input, /**/
              senhaFocus && styles.inputFocus /**/
            ]}
            placeholder="Digite sua senha" /**/
            placeholderTextColor="#888" /**/
            value={senha} /**/
            onChangeText={setSenha} /**/
            onFocus={() => setSenhaFocus(true)} /**/
            onBlur={() => setSenhaFocus(false)} /**/
          />

          <TouchableOpacity /**/
            style={styles.button} /**/
            onPress={fazerLogin} /**/
          >
            <Text style={styles.buttonText}> /**/
              ENTRAR
            </Text>
          </TouchableOpacity>

        </View>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({ /**/
  container: { /**/ 
    flex: 1, /**/
  },

  background: { /**/
    position: 'absolute', /**/
    width: '100%', /**/
    height: '100%', /**/
  },

  gradient: { /**/
    position: 'absolute', /**/
    top: 0, /**/
    left: 0, /**/
    right: 0, /**/
    bottom: 0, /**/
  },

  content: { /**/
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