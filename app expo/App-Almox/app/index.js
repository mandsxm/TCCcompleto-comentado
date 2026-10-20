import { Redirect } from 'expo-router'; //importa o redirect

export default function Index() { //cria e exporta a função index
  return <Redirect href="/login" />; //retorna o redirecionamento de /login
}


//conclusão: rota inicial do app, a pessoa entra no app e vai pra pagina de login automaticamente