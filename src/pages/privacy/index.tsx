import { GetStaticProps } from 'next';

import { Text, Flex, Heading, UnorderedList, ListItem } from '@chakra-ui/react';

export default function Privacy() {
  return (
    <Flex w="100wh" h="100vh" align="center" justify="center">
      <Flex
        flexDir="column"
        maxWidth={1024}
        overflowY="auto"
        maxH="100vh"
        p="50px 20px"
      >
        <Heading>Política Privacidade</Heading>
        <Text mt="15px">
          A sua privacidade é importante para nós. É política do iEnvironment
          respeitar a sua privacidade em relação a qualquer informação sua que
          possamos coletar no site iEnvironment, e outros sites que possuímos e
          operamos.
        </Text>
        <Text mt="15px">
          Solicitamos informações pessoais apenas quando realmente precisamos
          delas para lhe fornecer um serviço. Fazemo-lo por meios justos e
          legais, com o seu conhecimento e consentimento. Também informamos por
          que estamos coletando e como será usado.
        </Text>
        <Text mt="15px">
          Apenas retemos as informações coletadas pelo tempo necessário para
          fornecer o serviço solicitado. Quando armazenamos dados, protegemos
          dentro de meios comercialmente aceitáveis ​​para evitar perdas e
          roubos, bem como acesso, divulgação, cópia, uso ou modificação não
          autorizados.
        </Text>
        <Text mt="15px">
          Não compartilhamos informações de identificação pessoal publicamente
          ou com terceiros, exceto quando exigido por lei.
        </Text>
        <Text mt="15px">
          O nosso site pode ter links para sites externos que não são operados
          por nós. Esteja ciente de que não temos controle sobre o conteúdo e
          práticas desses sites e não podemos aceitar responsabilidade por suas
          respectivas políticas de privacidade.
        </Text>
        <Text mt="15px">
          Você é livre para recusar a nossa solicitação de informações pessoais,
          entendendo que talvez não possamos fornecer alguns dos serviços
          desejados.
        </Text>
        <Text mt="15px">
          O uso continuado de nosso site será considerado como aceitação de
          nossas práticas em torno de privacidade e informações pessoais. Se
          você tiver alguma dúvida sobre como lidamos com dados do usuário e
          informações pessoais, entre em contato conosco.
        </Text>
        <Text mt="15px">
          Você é livre para recusar a nossa solicitação de informações pessoais,
          entendendo que talvez não possamos fornecer alguns dos serviços
          desejados.
        </Text>

        <Heading mt="25px">Política de Cookies iEnvironment</Heading>
        <Heading mt="15px" size="md">
          O que são cookies?
        </Heading>
        <Text mt="15px">
          Como é prática comum em quase todos os sites profissionais, este site
          usa cookies, que são pequenos arquivos baixados no seu computador,
          para melhorar sua experiência. Esta página descreve quais informações
          eles coletam, como as usamos e por que às vezes precisamos armazenar
          esses cookies. Também compartilharemos como você pode impedir que
          esses cookies sejam armazenados, no entanto, isso pode fazer o
          downgrade ou 'quebrar' certos elementos da funcionalidade do site.
        </Text>
        <Heading mt="15px" size="md">
          Como usamos os cookies?
        </Heading>
        <Text mt="15px">
          Utilizamos cookies por vários motivos, detalhados abaixo.
          Infelizmente, na maioria dos casos, não existem opções padrão do setor
          para desativar os cookies sem desativar completamente a funcionalidade
          e os recursos que eles adicionam a este site. É recomendável que você
          deixe todos os cookies se não tiver certeza se precisa ou não deles,
          caso sejam usados ​​para fornecer um serviço que você usa.
        </Text>
        <Heading mt="15px" size="md">
          Desativar cookies
        </Heading>
        <Text mt="15px">
          Você pode impedir a configuração de cookies ajustando as configurações
          do seu navegador (consulte a Ajuda do navegador para saber como fazer
          isso). Esteja ciente de que a desativação de cookies afetará a
          funcionalidade deste e de muitos outros sites que você visita. A
          desativação de cookies geralmente resultará na desativação de
          determinadas funcionalidades e recursos deste site. Portanto, é
          recomendável que você não desative os cookies.
        </Text>
        <Heading mt="15px" size="md">
          Cookies que definimos
        </Heading>
        <UnorderedList mt="15px" spacing={3}>
          <ListItem>Cookies relacionados à conta</ListItem>
          <Text>
            Se você criar uma conta connosco, usaremos cookies para o
            gerenciamento do processo de inscrição e administração geral. Esses
            cookies geralmente serão excluídos quando você sair do sistema,
            porém, em alguns casos, eles poderão permanecer posteriormente para
            lembrar as preferências do seu site ao sair.
          </Text>
          <ListItem>Cookies relacionados ao login</ListItem>
          <Text>
            Utilizamos cookies quando você está logado, para que possamos
            lembrar dessa ação. Isso evita que você precise fazer login sempre
            que visitar uma nova página. Esses cookies são normalmente removidos
            ou limpos quando você efetua logout para garantir que você possa
            acessar apenas a recursos e áreas restritas ao efetuar login.
          </Text>
          <ListItem>Cookies relacionados a formulários</ListItem>
          <Text>
            Quando você envia dados por meio de um formulário como os
            encontrados nas páginas de contacto ou nos formulários de
            comentários, os cookies podem ser configurados para lembrar os
            detalhes do usuário para correspondência futura.
          </Text>
        </UnorderedList>
        <Heading mt="15px" size="md">
          Compromisso do Usuário
        </Heading>
        <Text mt="15px">
          O usuário se compromete a fazer uso adequado dos conteúdos e da
          informação que o iEnvironment oferece no site e com caráter
          enunciativo, mas não limitativo:
        </Text>
        <Heading mt="15px" size="md">
          Mais informações
        </Heading>
        <Text mt="15px">
          Esperemos que esteja esclarecido e, como mencionado anteriormente, se
          houver algo que você não tem certeza se precisa ou não, geralmente é
          mais seguro deixar os cookies ativados, caso interaja com um dos
          recursos que você usa em nosso site.
        </Text>
        <Text>
          Esta política é efetiva a partir de <b> October/2021</b>.
        </Text>
      </Flex>
    </Flex>
  );
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  return {
    props: {},
  };
};
