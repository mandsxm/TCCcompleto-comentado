import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Modal, Alert} from 'react-native'; //importa tudo isso da biblioteca react native
import { useFonts, Poppins_700Bold } from '@expo-google-fonts/poppins'; //importa fonte poppins
import { Montserrat_400Regular, Montserrat_700Bold } from '@expo-google-fonts/montserrat'; //importa fonte montserrat
import { MaterialIcons } from '@expo/vector-icons'; //para exibir icones como lixeira, perfil, lupa e etc...
import { useState, useCallback } from 'react'; //importa useState = usado para guardar informações que podem mudar durante a execução do aplicativo. \ useCallback = memoriza uma função entre renderizações, mantendo a mesma referência enquanto suas dependências não mudarem.
import AsyncStorage from '@react-native-async-storage/async-storage'; //importa AsyncStorage, que permite armazenar dados localmente no dispositivo.
import { router, useFocusEffect } from 'expo-router'; //importa router, utilizado para navegar entre as telas do aplicativo. | importa userFocusEffect = executa um efeito quando a tela está em foco

export default function Tabela() { //exporta (outros arquivos do projeto podem importar essa função) default (função principal do arquivo) a função Tabela

  const [fontsLoaded] = useFonts({ //variável fontsLoaded = usa a desestruturação de um array para obter o primeiro valor retornado por useFonts.
    Poppins_700Bold,
    Montserrat_400Regular,
  });
  //A variável fontsLoaded geralmente recebe um valor booleano:
  //true: as fontes terminaram de carregar.
  //false: as fontes ainda estão carregando ou não terminaram o carregamento.

  //userState = guarda os estados que podem mudar durante o uso do app
  const [produtoAberto, setProdutoAberto] = useState(null); //diz que inicialmente não está mostrando os detalhes de nenhum produto, mas pode ser aberto mais tarde
  const [menuAberto, setMenuAberto] = useState(false); //abertura do menu lateral | false: 
  const [imagemAberta, setImagemAberta] = useState(null); //null:
  const [produtos, setProdutos] = useState([]); //[]: array vazio | no incio a tabela aparece sem produtos
  const [nomeUsuario, setNomeUsuario] = useState(''); //guarda o nome recuperado do armazenamento local e permite mostrá-lo na interface. 
  const [tipoUsuario, setTipoUsuario] = useState(''); //guarda a categoria do usuário, como "admin" ou "user".
  //usa um hook, useState. | Hook usado para lembrar de infos e fazer ações automáticas.

  //CARREGA OS USUARIOS
  // recupera o nome e o tipo do usuário que estão salvos no celular e atualiza os estados do React para exibir essas informações na barra lateral do aplicativo.
  useFocusEffect( //recupera as informações do usuario quando ele entra na tela da tabela ou volta para ela depois de navegar para outra tela
    useCallback(() => { //memoriza a função passada pra ele
      const carregarUsuario = async () => { //cria a função carregarUsuario assincrona (usa await pra esperar algo carregar antes de ser executada)
        const nome = await AsyncStorage.getItem('nomeUsuario'); //cria a função nome que armazena localmente os dados do Item em "nomeUsuario"
        const tipo = await AsyncStorage.getItem('tipoUsuario'); //como tem await, essa função espera a função de cima terminar pra depois ser executada

        setNomeUsuario(nome || ''); //Essas linhas colocam os dados recuperados nos estados do React.
        setTipoUsuario(tipo || ''); // || = funciona como uma alternativa: se o valor recuperado for null, será utilizada uma string vazia ('').
      };

      carregarUsuario(); //chama a função que foi criada - que pegou os dados do usuario - mostra as infos do usuario (NOME+TIPO)
    }, [])
  );

  //CARREGA OS PRODUTOS
  useFocusEffect(
  useCallback(() => {
    const buscarProdutos = async () => { //cria a função buscarProdutos assincrona
      try { //TENTA buscar os produtos - mas pode dar erro (ex: nao ter produtos)
        const resposta = await fetch('http://10.154.20.25:5000/tabela_app'); //cria a função assincrona 'resposta' que envia a requisição HTTP ao endereço do servidor
        //O fetch faz esse pedido e 'resposta' representa o retorno recebido.
        const dados = await resposta.json(); //a função dados recebe a 'resposta' em formato json

        if (dados.success) { //verifica se a busca da variavel 'dados' deu certo
          const produtosFormatados = dados.produtos.map((item) => ({ //cria a variavel produtosFormatados que vai guardar uma nova lista de produtos pegando o 'dados'+'produto'(é a propriedade de 'dados' que contém a lista de produtos.)
          //.map((item)) => ({ = percorre cada elemento da lista por vez. | ((item)) = cria um novo objeto par cada produto.
            id: item.id,
            responsavel: item.responsavel,
            nome: item.nome,
            categoria: item.categoria,
            quantidade: item.qtde,
            estoque_min: item.estoque_min,
            preco: item.preco,
            descricao: item.descricao,
            imagem: item.imagem,
          }));

          setProdutos(produtosFormatados); //atualiza a lista de produtos
        }
      } catch (erro) { //regista erros de requisiçãoou processamento (por causa do 'try')
        console.log('ERRO AO BUSCAR PRODUTOS:', erro); 
      }
    };

    buscarProdutos(); //executa a função de busca
  }, [])
);

// EXCLUIR ITEM
const excluirItem = (id) => { //a função excluirItem pega o id do produto que identifica qual produto quer excluir
  Alert.alert( //manda mensagem de alerta
    'Excluir item',
    'Tem certeza que deseja excluir este item?',
    [
      { text: 'Cancelar', style: 'cancel' }, //dá a opção de cancelar ou excluir
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {//função onPress assincrona
          try { //tenta
            const resposta = await fetch( //chama a resposta que envia a requisição HTTP com o id do item que sera excluido
              `http://10.154.20.25:5000/excluir/${id}`,
              { method: 'DELETE' } //usa o metodo delete
            );

            const data = await resposta.json(); //na função data pega a resposta da requisição em json
            console.log('RESPOSTA EXCLUIR:', data); //console.log() mostra a resposta no console, o que ajuda a verificar o resultado da operação.

            if (data.success) {// a exclusão deu certo
              Alert.alert('Sucesso', 'Item excluído com sucesso!'); //manda mensagem de sucesso

              // Remove da tabela sem precisar recarregar
              setProdutos((produtosAtuais) => //
                produtosAtuais.filter((item) => item.id !== id) //
              );
            } else { //se não deu certo
              Alert.alert('Erro', data.erro || 'Erro ao excluir o item.'); //mensagem de erro
            }
          } catch (erro) { //se o tentar nao deu
            console.log('ERRO AO EXCLUIR:', erro); //registra o erro no console
            Alert.alert('Erro', 'Não foi possível conectar ao servidor.'); //
          }
        },
      },
    ]
  );
};

  return (
    <View style={styles.background}>

<Modal
  visible={imagemAberta !== null}
  transparent={true}
  animationType="fade"
  onRequestClose={() => setImagemAberta(null)}
>
  <View style={styles.fundoPopup}>
    <View style={styles.popup}>

      <TouchableOpacity
        style={styles.fecharPopup}
        onPress={() => setImagemAberta(null)}
      >
        <MaterialIcons
          name="close"
          size={25}
          color="#FFFFFF"
        />
      </TouchableOpacity>

      {imagemAberta && (
        <Image
          source={{
            uri: `http://10.154.20.25:5000${imagemAberta}`
          }}
          style={styles.imagemPopup}
          resizeMode="contain"
        />
      )}

    </View>
  </View>
</Modal>

      {/* NAVBAR */}
      <View style={styles.navbar}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setMenuAberto(!menuAberto)}
        >
          <MaterialIcons
            name="menu"
            size={30}
            color="#FFFFFF"
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/tabela')}>
          <Text style={styles.link}>ESTOQUE</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/editar')}>
          <Text style={styles.link}>EDITAR</Text>
        </TouchableOpacity>

        {tipoUsuario === 'admin' && (
          <>
            <TouchableOpacity
              onPress={() => router.push('/contas')}
            >
              <Text style={styles.link}>
                CONTAS
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push('/cadastro')}
            >
              <Text style={styles.link}>
                CADASTRO
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* SIDEBAR */}
      {menuAberto && (
        <View style={styles.sidebar}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setMenuAberto(false)}
          >
            <MaterialIcons
              name="close"
              size={25}
              color="#FFFFFF"
            />
          </TouchableOpacity>

          <Text style={styles.sidebarTitulo}>USUÁRIO</Text>
          <Text style={styles.usuario}>{nomeUsuario}</Text>
          <Text style={styles.tipo}>
            {tipoUsuario === 'admin' ? 'Administrador' : 'Usuário'}
          </Text>

          <TouchableOpacity
            style={styles.logout}
            onPress={() => router.replace('/login')}
          >
            <MaterialIcons
              name="logout"
              size={20}
              color="#FFFFFF"
            />
            <Text style={styles.logoutTexto}>DESLOGAR</Text>
          </TouchableOpacity>
        </View>
      )}

      <Text style={styles.titulo}>
        {"Boas-vindas ao\nAlmoxarifado!"}
      </Text>

      <View style={styles.tabela}>

        {/* CABEÇALHO */}
        <View style={styles.linha}>
          <View style={styles.id}>
            <Text style={styles.cabecalho}>ID</Text>
          </View>
          <View style={styles.nome}>
            <Text style={styles.cabecalho}>NOME</Text>
          </View>
          <View style={styles.responsavel}>
            <Text style={styles.cabecalho}>RESPONSÁVEL</Text>
          </View>
          <View style={styles.acao}>
            <Text style={styles.cabecalho}>AÇÃO</Text>
          </View>
        </View>

        {/* PRODUTOS */}
        <FlatList
          data={produtos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <>
              <View style={styles.linha}>
                <View style={styles.id}>
                  <Text style={styles.texto}>{item.id}</Text>
                </View>

                <View style={styles.nome}>
                  <Text style={styles.texto}>{item.nome}</Text>
                </View>

                <View style={styles.responsavel}>
                  <Text style={styles.texto}>{item.responsavel}</Text>
                </View>

                <View style={styles.acao}>
                  <TouchableOpacity
                    style={styles.botao}
                    onPress={() =>
                      setProdutoAberto(
                        produtoAberto === item.id ? null : item.id
                      )
                    }
                  >
                    <MaterialIcons
                      name="visibility"
                      size={16}
                      color="#FFFFFF"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                      style={styles.botaoExcluir}
                      onPress={() => excluirItem(item.id)}
                    >
                      <MaterialIcons
                        name="delete"
                        size={24}
                        color="#FFFFFF"
                      />
                    </TouchableOpacity>
                </View>
              </View>

              {/* DETALHES A MAIS */}
              {produtoAberto === item.id && (
                <View style={styles.detalhes}>
                  <Text style={styles.detalhe}>
                    <Text style={styles.negrito}>CATEGORIA:</Text> {item.categoria}
                  </Text>

                  <Text style={styles.detalhe}>
                    <Text style={styles.negrito}>QUANTIDADE:</Text> {item.quantidade}
                  </Text>

                  <Text style={styles.detalhe}>
                    <Text style={styles.negrito}>QUANT MÍN:</Text> {item.estoque_min}
                  </Text>

                  <Text style={styles.detalhe}>
                    <Text style={styles.negrito}>PREÇO:</Text> {item.preco}
                  </Text>

                  <Text style={styles.detalhe}>
                    <Text style={styles.negrito}>DESCRIÇÃO:</Text> {item.descricao}
                  </Text>

                  <TouchableOpacity
                    style={styles.botaoImagem}
                    onPress={() => setImagemAberta(item.imagem)}
                  >
                    <MaterialIcons
                      name="image"
                      size={18}
                      color="#FFFFFF"
                    />
                  </TouchableOpacity>
                </View> 
              )}
            </>
          )}
        />

      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#F0F1F2',
  },
  titulo: {
    fontSize: 25,
    textAlign: 'center',
    color: '#1D3273',
    marginBottom: 25,
    fontFamily: 'Poppins_700Bold',
  },
    navbar: {
    height: 60,
    backgroundColor: '#1D3273',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingLeft: 10,
    marginTop: 30,
    marginBottom: 30,
    zIndex: 10,
  },
  link: {
    color: '#FFFFFF',
    fontSize: 14,
    marginLeft: 25,
    fontFamily: 'Poppins_700Bold',
  },
  tabela: {
    marginHorizontal: 15,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#F28705',
    borderRadius: 8,
    overflow: 'hidden',
  },
  sidebar: {
    position: 'absolute',
    left: 0,
    top: 30,
    width: 250,
    height: '100%',
    backgroundColor: '#1D3273',
    zIndex: 100,
    paddingTop: 20,
    paddingHorizontal: 20,
   },
  sidebarTitulo: {
    color: '#FFFFFF',
    fontSize: 22,
    fontFamily: 'Poppins_700Bold',
    marginBottom: 30,
  },
  usuario: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Poppins_700Bold',
    marginBottom: 5,
  },
  tipo: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Montserrat_400Regular',
    marginBottom: 30,
  },
  logout: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.3)',
  },
  logoutTexto: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Poppins_700Bold',
  },
  closeButton: {
    position: 'absolute',
    right: 10,
    top: 2,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linha: {
    flexDirection: 'row',
    minHeight: 48,
    borderBottomWidth: 1,
    borderBottomColor: '#F28705',
  },
  id: {
    width: '15%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#F28705',
  },
  nome: {
    width: '30%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#F28705',
  },
  responsavel: {
    width: '35%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#F28705',
  },
  cabecalho: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 13,
    color: '#333333',
    textAlign: 'center',
  },
  texto: {
    fontSize: 14,
    color: '#333333',
    textAlign: 'center',
  },
  acao: {
    width: '20%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  botao: {
    width: 26,
    height: 26,
    backgroundColor: '#1D3273',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botaoExcluir: {
    width: 26,
    height: 26,
    backgroundColor: '#1D3273',
    borderRadius: 5,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  botaoImagem: {
    width: 40,
    height: 40,
    backgroundColor: '#1D3273',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 10,
  },
  detalhes: {
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F28705',
  },
  detalhe: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 4,
  },
  negrito: {
    fontWeight: 'bold',
  },
  fundoPopup: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popup: {
    width: '80%',
    height: '60%',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fecharPopup: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
    backgroundColor: '#1D3273',
    borderRadius: 15,
    padding: 5,
  },
  imagemPopup: {
    width: '100%',
    height: '80%',
  },
});
