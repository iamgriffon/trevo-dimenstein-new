<script setup lang="ts">
import Layout from "@/components/common/Layout.vue";
</script>

<template>
  <Layout title="Termos de Uso">
    <section
      class="w-full h-3/5 flex flex-col gap-4 px-8 overflow-text p-5 border border-gray-300 rounded-lg max-h-[70vh] overflow-scroll"
    >
      <section>
        <h3 class="text-lg font-medium">Sumário</h3>
        <ol class="list-decimal">
          <li>LISTA DE SIGLAS E ABREVIATURAS</li>
          <li>OBJETIVO</li>
          <li>APLICAÇÃO</li>
          <li>REFERÊNCIAS</li>
          <li>DEFINIÇÕES</li>
          <li>REGRAS GERAIS</li>
          <li>DISPONIBILIZAÇÃO E RESPONSABILIDADE SOBRE EQUIPAMENTOS</li>
          <li>ADESÃO E UTILIZAÇÃO DE APLICATIVOS EXTERNOS</li>
          <li>SEGURANÇA E MONITORAMENTO DA INFORMAÇÃO</li>
          <li>ATIVOS DE TI</li>
          <li>ACESSO AOS SISTEMAS E EQUIPAMENTOS</li>
          <li>RESPONSABILIDADE SOBRE EQUIPAMENTOS PESSOAIS</li>
          <li>IDENTIFICAÇÃO DE PESSOAS E ACESSO ÀS INFORMAÇÕES</li>
          <li>CLASSIFICAÇÃO DA INFORMAÇÃO</li>
          <li>PROTEÇÃO CONTRA AMEAÇAS DIGITAIS</li>
          <li>DESCARTE DE MÍDIAS</li>
          <li>TRATAMENTO DE INCIDENTES</li>
          <li>MEDIDAS DISCIPLINARES POR VIOLAÇÃO DA PSI</li>
          <li>PRESTADORES DE SERVIÇOS</li>
          <li>COMPETÊNCIA E RESPONSABILIDADES</li>
          <li>ARQUIVOS EM NUVEM AWS</li>
          <li>CONTROLES E REGISTROS DA QUALIDADE</li>
          <li>GLOSSÁRIO</li>
          <li>FOLHA DE APROVAÇÃO</li>
        </ol>
      </section>
      <section>
        <h3 class="text-lg font-medium">Histórico de Alterações</h3>
        <table>
          <thead>
            <tr>
              <th>Revisao</th>
              <th>Referências</th>
              <th>Responsavel</th>
              <th>Data de Execuçao</th>
              <th>Resumo da Alteração</th>
            </tr> 
          </thead>
          <tbody>
            <tr>
              <td></td>
              <td>Politica de Segurança da Informação</td>
              <td>Gabriel Nascimento</td>
              <td>01/10/2023</td>
              <td>Primeira Versão</td>
            </tr>
          </tbody>
        </table>
      </section>
      <section id="lista-de-siglas-e-abreviaturas">
        <h3 class="text-lg font-medium">LISTA DE SIGLAS E ABREVIATURAS</h3>
        <p>ABNT – Associação Brasileira de Normas Técnicas</p>
        <p>CLT – Consolidação das Leis do Trabalho</p>
        <p>CONARQ – Conselho Nacional de Arquivos</p>
        <p>CTDE – Câmara Técnica de Documentos Eletrônicos</p>
        <p>ISO – International Organization for Standardization</p>
        <p>PSI – Política de Segurança da Informação</p>
        <p>LGPD – Lei Geral de Proteção de Dados.</p>
      </section>
      <section id="objetivo" class="flex flex-col gap-2">
        <h3 class="text-lg font-medium">OBJETIVO</h3>
        <p>
          Este Código tem como objetivo normatizar diversos aspectos
          relacionados à segurança da informação, em conformidade com a Política
          de Segurança da Informação da RAD DIMENSTEIN.
        </p>
        <p>
          Por meio da orientação e do estabelecimento das diretrizes da empresa
          para proteger seus ativos de informação, a RAD DIMENSTEIN visa
          determinar os padrões de comportamentos relacionados à segurança da
          informação, adequados às necessidades do negócio, e também os de
          proteção legal da entidade e de seus indivíduos.
        </p>
        <p>
          Os riscos típicos que a aplicação deste Código pretende evitar são:
        </p>
        <ol class="list-decimal">
          <li>Revelação de informações sensíveis;</li>
          <li>Revelação de informações pessoais;</li>
          <li>Modificações indevidas de dados e programas;</li>
          <li>Perda de dados e programas;</li>
          <li>Destruição ou perda de recursos e instalações;</li>
          <li>Interdições ou interrupções de serviços essenciais;</li>
          <li>Roubo ou furto de propriedades.</li>
          <li>Utilização indevida de dados.</li>
          <li>Acessos não autorizados.</li>
        </ol>
        <p>Esses riscos ocorrem pelos seguintes motivos:</p>
        <ol class="list-decimal">
          <li>Negligência – atos não intencionais de usuários.</li>
          <li>Subversão – ataques disfarçados praticados por usuários.</li>
          <li>Acidente – ocorrências acidentais e por fatores alheios.</li>
          <li>Ataque furtivo – ataques praticados por pessoas estranhas.</li>
          <li>
            Ataque forçado – ataques às claras praticados por usuários ou
            estranhos.
          </li>
          <li>Ilícitas - ocorrências Ilícitas e por fatores alheios.</li>
        </ol>
      </section>
      <section id="aplicacao">
        <h3 class="text-lg font-medium">APLICAÇÃO</h3>
        <p>
          As regras, recomendações e conceitos deste Código são aplicáveis a
          todos os empregados, estagiários e aprendizes da RAD DIMENSTEIN, à sua
          Diretoria, aos seus prestadores de serviços e aos eventuais visitantes
          que tenham acesso a quaisquer informações da RAD DIMENSTEIN. Todos
          esses grupos são denominados "usuários" sempre que tratados de forma
          indistinta neste documento.
        </p>
        <p>
          Empregados, estagiários e prestadores de serviços da RAD DIMENSTEIN
          que trabalham na área de Tecnologia da Informação distinguem-se dos
          demais usuários pelo fato de possuírem obrigações, direitos e
          privilégios diferenciados para a necessária administração do ambiente
          computacional e de rede. Neste documento, esses colaboradores são
          denominados como "equipe ou setor Administrativo".
        </p>
        <p>
          Todos, indistintamente, são responsáveis pela observação e cumprimento
          da RAD DIMENSTEIN bem como deste Código de Segurança da Informação.
        </p>
        <p>
          Neste documento, a menção a uma determinada gerência refere-se à área
          como um todo, representada pelo seu respectivo gerente, mas não
          limitada a ele. Consequentemente, a menção à responsabilidade de uma
          determinada Gerência em fazer alguma coisa não implica que o próprio
          gerente deve executar a tarefa, mas sim que ele é responsável pela
          correta execução da tarefa, mesmo quando a delega.
        </p>
        <p>
          A PSI é o ponto de partida para a gestão da segurança da informação no
          âmbito da RAD DIMENSTEIN e sua aplicação ocorre por meio de normas,
          procedimentos operacionais, instruções de trabalho e formulários dela
          derivados, garantindo assim sua perenidade.
        </p>
      </section>
      <section id="referencias">
        <h3 class="text-lg font-medium">REFERÊNCIAS</h3>
        <p>
          ABNT NBR ISO IEC 27001 – Código de práticas para a gestão da segurança
          da informação.
        </p>
        <p>
          ABNT NBR ISO IEC 27002 – Código de práticas para controles de
          segurança da informação.
        </p>
        <p>
          Consumerization of IT: Risk Mitigation Strategies – 2012 - European
          Network and Information Security Agency.
        </p>
        <p>
          Estratégia de Segurança da Informação e Comunicações e de Segurança
          Cibernética da Administração Pública Federal 2015-2018 v.1.0 – 2015 –
          Presidência da República.
        </p>
      </section>
      <section id="definicoes">
        <h3 class="text-lg font-medium">1. DEFINIÇÕES</h3>
        <p>No contexto deste Código, são adotadas as definições a seguir.</p>
        <h4 class="text-lg font-medium">1.1 Informação</h4>
        <p>
          Resultado da produção, manipulação, organização ou processamento de
          dados que represente uma modificação no conhecimento do sistema que a
          recebe.
        </p>
        <p>
          Um dado não é considerado informação quando, sem o devido
          processamento, for insuficiente para conferir sentido ou significado a
          uma determinada matéria.
        </p>
        <p>
          Porém, será considerado como informação o dado que, mesmo não
          processado, for suficiente para produzir modificações no conhecimento
          de sistemas humanizados ou informatizados.
        </p>
        <h4 class="text-lg font-medium">1.2 Equipamento</h4>
        <p>
          Todo dispositivo utilizado para processamento, produção,
          transformação, manipulação, organização ou transmissão de informações
          no ambiente da RAD DIMENSTEIN ou que seja de sua propriedade. Essa
          denominação engloba computadores, impressoras, scanners, smartphones,
          roteadores, switches, servidores, centrais telefônicas, aparelhos
          telefônicos, câmeras, monitores, dentre outros. No contexto deste
          Código, os equipamentos podem ser referenciados como hardware.
        </p>
        <h4 class="text-lg font-medium">1.3 Aplicativo</h4>
        <p>
          Qualquer programa ou grupo de programas que instrui o hardware sobre a
          execução de uma tarefa. No contexto deste Código, os aplicativos podem
          ser referenciados como sistema, aplicativo interno ou software, e
          podem estar instalados localmente ou disponibilizados na internet.
        </p>
        <h4 class="text-lg font-medium">1.4 Aplicativo Externo</h4>
        <p>
          Programas, serviços, assinaturas ou contratos disponibilizados por
          outra empresa de forma eletrônica, seja por meio de aplicativos ou de
          sítios virtuais.
        </p>
        <h4 class="text-lg font-medium">1.5 Recurso de TI ou Ativo de TI</h4>
        <p>
          Refere-se genericamente aos equipamentos e aplicativos, internos e
          externos.
        </p>
        <h4 class="text-lg font-medium">1.6 Empregado</h4>
        <p>
          Denominação dada à pessoa contratada cujo vínculo de cunho
          empregatício é regido pela CLT - Consolidação das Leis do Trabalho.
        </p>

        <h4 class="text-lg font-medium">
          1.7 Prestador de Serviço ou Terceiro
        </h4>
        <p>
          Parte contratada pela RAD DIMENSTEIN que tem acesso às instalações,
          recursos e informações necessárias para o cumprimento de suas
          obrigações profissionais.
        </p>
        Fazem parte dessa categoria: autônomos, terceiros, contratados diretos,
        cooperativas, pessoa jurídica ou pessoa física, subcontratado,
        terceirizado e quarteirizado.

        <h4 class="text-lg font-medium">1.8 Ambiente da RAD DIMENSTEI</h4>
        <p>
          Refere-se ao ambiente físico, instalações e também ao ambiente
          denominado virtual, que compreende os servidores, rede e serviços
          tecnológicos ofertados pela RAD DIMENSTEIN, que podem estar hospedados
          localmente ou remotamente, em serviço de nuvem.
        </p>

        <h4 class="text-lg font-medium">1.9 Identidade Lógica</h4>
        <p>
          Conjunto de informações que caracterizam o usuário no contexto dos
          sistemas de informação. Cada usuário na RAD DIMENSTEIN possui uma
          identidade lógica que, na medida do possível, é única e lhe dá acesso
          aos sistemas e recursos inerentes a sua atuação.
        </p>
      </section>
      <section id="regras-gerais">
        <h3 class="text-lg font-medium">2. REGRAS GERAIS</h3>
        <p>
          Para o perfeito entendimento e aplicação deste Código, são
          estabelecidas as seguintes regras gerais.
        </p>
        <h3 class="text-lg font-medium">2.1 Informação na RAD DIMENSTEIN</h3>
        <p>
          Toda e qualquer ação em relação à informação na RAD DIMENSTEIN deve
          ser orientada explicitamente por este Código, resguardados os direitos
          e penalidades conforme legislação vigente.
        </p>
        <h3 class="text-lg font-medium">
          2.2 Termo de Ciência, Responsabilidade e Confidencialidade
        </h3>
        <p>
          Instrumento de concordância que trata das obrigações relativas à
          confidencialidade das informações, uso de equipamentos e compromisso
          com as determinações da Política de Segurança da Informação.
        </p>
        <p>
          Todos os usuários devem ter acesso a este PSI e atestar o seu
          conhecimento por meio de assinatura no Termo de Ciência,
          Responsabilidade e Compromisso.
        </p>
        <p>
          É o instrumento a ser assinado individualmente por cada usuário,
          atestando e acatando este Código.
        </p>
        <h3 class="text-lg font-medium">
          2.3 Do uso de Equipamentos e Aplicativos da RAD DIMENSTEIN
        </h3>
        <p>
          Equipamentos e aplicativos são fornecidos pela RAD DIMENSTEIN para que
          seus usuários os utilizem no desempenho de suas atividades
          profissionais, sendo que o uso para fins particulares é entendido e
          aceitado, desde que sejam respeitados os limites da razoabilidade.
        </p>

        <h3 class="text-lg font-medium">
          2.4 Circulação de Informação na RAD DIMENSTEIN
        </h3>
        <p>
          A informação deve circular livremente dentro do ambiente da RAD
          DIMENSTEIN, desde que sejam observadas as regras específicas para cada
          tipo de informação, conforme a classificação da informação detalhada
          nesse PSI.
        </p>

        <h3 class="text-lg font-medium">
          2.5 Materiais de Terceiros Protegidos por Direito autoral
        </h3>
        <p>
          Os computadores e sistemas da RAD DIMENSTEIN não podem ser utilizados
          para baixar, copiar, modificar, enviar, encaminhar ou receber
          materiais protegidos por Direito Autoral, segredo industrial, sigilo
          financeiro ou quaisquer outros dispositivos a estes assemelhados, sem
          a autorização prévia e expressa do titular de direito.
        </p>
        <p>
          Sob nenhuma circunstância os equipamentos e sistemas da RAD DIMENSTEIN
          podem ser utilizados para a troca direta de arquivos de material não
          licenciado, incluindo arquivos de áudio e vídeo.
        </p>
        <p>
          Nos casos de dúvida sobre direitos de proteção de qualquer material ou
          conteúdo, ou se o mesmo é adequado para transferência, deve-se,
          sempre, decidir pelo não envio e consultar a chefia imediata ou o
          setor Administrativo da RAD DIMENSTEIN.
        </p>

        <h3 class="text-lg font-medium">
          2.6 Manipulação de Material Impróprio ou Proibido
        </h3>
        <p>
          É proibida a utilização dos recursos da RAD DIMENSTEIN para
          distribuição, arquivamento, publicação, veiculação ou execução de
          material com teor pornográfico, homofóbico, sexista, de pedofilia, de
          cunho racista discriminatório ou qualquer com outro teor proibido
          pelas leis brasileiras.
        </p>

        <h3 class="text-lg font-medium">
          2.7 Obrigatoriedade de Elaboração de Mapa de Risco para Projetos
          Internos da RAD DIMENSTEIN
        </h3>
        <p>
          Todo projeto interno da RAD DIMENSTEIN que implique em mudança ou
          implantação de um processo, informatizado ou não, deverá gerar um mapa
          de risco em relação à segurança da informação. Esse mapa será
          analisado pelo Coordenador Administrativo, que deverá emitir parecer
          em relação ao mapa e ao projeto, autorizando a continuidade do projeto
          ou recomendando alterações. Fica a critério do da Diretoria a dispensa
          de mapa de risco para projetos de menor dimensão, devendo a decisão de
          dispensa ser devidamente justificada.
        </p>

        <h3 class="text-lg font-medium">
          2.8 Responsabilidade Pelo Cumprimento da PSI
        </h3>
        <p>
          Todos os usuários são responsáveis pelo cumprimento das disposições da
          Política de Segurança da Informação da RAD DIMENSTEIN, materializada
          através deste Código de Segurança da Informação.
        </p>

        <h3 class="text-lg font-medium">
          2.9 Prazo Para Implantação de Controles, Processos e Procedimentos
        </h3>
        <p>
          Todos os controles, processos, procedimentos e o próprio Comitê de
          Segurança da Informação deverão estar implantados em até 12 (doze)
          meses após a entrada em vigor deste Código.
        </p>

        <h3 class="text-lg font-medium">
          2.10 Cláusula de Confidencialidade em Contratos de Trabalho
        </h3>
        <p>
          É obrigatória a presença de cláusula de confidencialidade em todos os
          contratos de trabalho para que possa ser concedido o acesso do usuário
          aos ativos de informação disponibilizados pela RAD DIMENSTEIN.
        </p>
      </section>
      <section>
        <h3 class="text-lg font-medium">
          3 DISPONIBILIZAÇÃO E RESPONSABILIDADE SOBRE EQUIPAMENTOS
        </h3>
        <p>
          Todos os equipamentos da RAD DIMENSTEIN são de uso exclusivo para o
          alcance dos objetivos da organização e disponibilizados de acordo com
          as necessidades específicas dos usuários para o desempenho de suas
          atribuições.
        </p>

        <h4 class="text-lg font-medium">
          3.1 Responsabilidade Sobre Equipamentos Recebidos
        </h4>
        <p>
          Os usuários são responsáveis pela segurança dos equipamentos recebidos
          e devem ser responsabilizados caso haja caracterização de mau uso.
        </p>
        <p>
          Os equipamentos recebidos dependerão de permissão do setor
          Administrativo para serem utilizados em atividades externas ao
          ambiente da RAD DIMENSTEIN.
        </p>

        <h5 class="text-lg font-medium">
          A) Perda de Equipamento de Propriedade da RAD DIMENSTEIN.
        </h5>
        <p>
          Quando um equipamento de propriedade da RAD DIMENSTEIN for subtraído
          ou perdido, o usuário deve comunicar imediatamente o fato ao setor
          Administrativo, que dará ciência ao Comitê de Segurança da Informação.
        </p>
        <p>
          Nos casos de furto ou roubo de equipamentos da RAD DIMENSTEIN em
          atividades externas, o usuário que dele tinha a posse deverá registrar
          Boletim de Ocorrência policial e apresentar imediatamente ao setor
          Administrativo da RAD DIMENSTEIN. O Boletim de Ocorrência deverá ser
          anexado ao dossiê profissional, se a vítima for empregado, estagiário
          ou aprendiz da RAD DIMENSTEIN.
        </p>

        <h5 class="text-lg font-medium">B) Caracterização de Mau Uso</h5>
        <p>
          A caracterização de mau uso se dá mediante reconhecimento do próprio
          usuário ou, no caso de constatação pela equipe do setor
          Administrativo, por meio de análise e decisão do Comitê de Segurança
          da Informação.
        </p>

        <h4 class="text-lg font-medium">
          3.2 Custos com Reparos e Reposições de Equipamentos Danificados ou
          Perdidos
        </h4>
        <p>
          Nos casos de mau uso, o usuário deverá assumir os custos de reparo ou,
          na impossibilidade de conserto, de nova aquisição de equipamento de
          mesma marca e modelo.
        </p>
        <p>
          No caso de perda, o usuário deverá assumir os custos de nova aquisição
          de equipamento de mesma marca e modelo.
        </p>
        <p>
          Caso o equipamento perdido ou danificado de forma irreparável não seja
          mais fabricado, deverá ser utilizado como referência outro equipamento
          similar, preferencialmente do mesmo fabricante.
        </p>
        <p>
          As regras de ressarcimento de custos para reparo ou aquisição de novo
          equipamento não são aplicáveis nos casos de roubo ou furto, desde que
          o usuário apresente o Boletim de Ocorrência policial.
        </p>

        <h4 class="text-lg font-medium">3.3 Troca de Senha do Usuário</h4>
        <p>
          Mediante a comunicação de perda, extravio, furto ou roubo, a equipe de
          administrativa deverá trocar as senhas do usuário que utilizava o
          equipamento.
        </p>
      </section>
      <section>
        <h3 class="text-lg font-medium">
          4 ADESÃO E UTILIZAÇÃO DE APLICATIVOS EXTERNOS
        </h3>
        <p>
          Todos os aplicativos externos utilizados pelos usuários para
          consecução de suas atividades são de responsabilidade da RAD
          DIMENSTEIN, permanecendo mantidos pela organização e não pelos
          usuários.
        </p>

        <h4 class="text-lg font-medium">4.1 Termos de Licenças</h4>
        <p>
          Os usuários não podem concordar com termos de licenças sem a anuência
          prévia da Administração.
        </p>

        <h4 class="text-lg font-medium">
          4.2 Adesões aos Aplicativos Externos
        </h4>
        <p>
          Todas as adesões aos aplicativos externos devem ser feitas em nome da
          RAD DIMENSTEIN, não sendo permitida a utilização de nomes de pessoas
          físicas, empregados, estagiários, aprendizes ou terceirizados, a não
          ser na qualidade de representante técnico ou funcional, quando
          solicitado pelo fornecedor.
        </p>
        <p>
          Os procedimentos para adesões a aplicativos pagos devem ser
          solicitados à Administração, que dará início ao processo internamente,
          demandando às demais áreas envolvidas nos procedimentos de compra.
        </p>
        <p>
          Para adesão a aplicativos não pagos, os chamados "free", o usuário
          deve solicitar à Administração, que deverá fazer a adesão.
          Enquadram-se nesta categoria não só os aplicativos de mercado, mas
          também aqueles fornecidos sem custos por fornecedores ou
          financiadores, por exemplo.
        </p>
        <p>
          O endereço eletrônico institucional de referência
          administrativo@radimenstein.com.br deve ser usado em qualquer condição
          de aquisição ou adesão a aplicativos externos.
        </p>

        <h4 class="text-lg font-medium">
          4.3 Senhas de Acesso aos Aplicativos Externos
        </h4>
        <p>
          Todas as senhas de acesso devem ser informadas ao setor
          Administrativo, que se responsabiliza pelo armazenamento em local
          seguro, com a identificação dos usuários autorizados a utilizá-las.
        </p>
      </section>
      <section>
        <h3 class="text-lg font-medium">
          5 SEGURANÇA E MONITORAMENTO DA INFORMAÇÃO
        </h3>
        <p>
          Visando garantir a segurança das suas informações, a RAD DIMENSTEIN
          pode estabelecer procedimentos de inspeção e monitoração de seus
          sistemas e equipamentos. Os procedimentos de inspeção e monitoramento
          devem abranger todos os usuários, inclusive os alocados na equipe
          Administrativo. Para isso, uma auditoria técnica anual deverá ser
          realizada ou quando o Comitê de Segurança da Informação julgar
          necessária.
        </p>

        <h4 class="text-lg font-medium">
          5.1 O Papel do setor Administrativo nas Ações de Monitoramento de
          Sistemas e Equipamentos
        </h4>
        <p>
          O setor Administrativo é responsável pela realização de monitoramentos
          gerais, que não dependem de solicitação, para detectar eventuais
          desvios na utilização dos recursos, sendo que tais desvios devem ser
          reportados ao Coordenador Administrativo.
        </p>
        <p>
          A execução das ações de monitoramento é feita exclusivamente pelo
          setor Administrativo.
        </p>

        <h4 class="text-lg font-medium">
          5.2 Formas de Monitoramento de Sistemas e Equipamentos
        </h4>
        <p>
          A RAD DIMENSTEIN, através do setor Administrativo, poderá exercer o
          monitoramento de seus sistemas e equipamentos sem necessitar de prévio
          aviso ou permissão do usuário.
        </p>
        <p>
          Os procedimentos para garantir a segurança da informação, podem
          incluir ações de diferentes tipos.
        </p>
        <h5 class="text-lg font-medium">
          - Instalação de Dispositivos ou Sistemas de Monitoramentos
        </h5>
        <p>
          A RAD DIMENSTEIN poderá instalar dispositivos ou sistemas de
          monitoramentos em quaisquer equipamentos, sistemas, serviços ou
          dispositivos de rede e utilizar as informações geradas por estes
          dispositivos ou sistemas para identificar os usuários e seus
          respectivos acessos efetuados, bem como os materiais manipulados.
        </p>
        <h5 class="text-lg font-medium">- Inspeção Física nos Equipamentos</h5>
        <p>
          A qualquer tempo, a RAD DIMENSTEIN poderá executar a inspeção física
          nos equipamentos de sua propriedade.
        </p>
        <h5 class="text-lg font-medium">
          - Utilização de Informações Obtidas em Procedimentos Disciplinares
        </h5>
        <p>
          A RAD DIMENSTEIN poderá utilizar as informações obtidas pelos sistemas
          de monitoramento e auditoria para embasar as medidas disciplinares
          previstas neste Código.
        </p>
      </section>
      <section>
        <h3 class="text-lg font-medium">6. ATIVOS DE TI</h3>
        <p>
          A RAD DIMENSTEIN possui alguns ativos de ti que usamos para o
          monitoramento e armazenamentos de dados.
        </p>
      </section>
      <section>
        <h3 class="text-lg font-medium">
          7 ACESSO AOS SISTEMAS E EQUIPAMENTOS
        </h3>
        <p>
          Todos os acessos dos usuários aos sistemas utilizados pela RAD
          DIMENSTEIN devem estar atrelados a perfis específicos condizentes com
          sua função e cargo, no caso de empregados, estagiários e aprendizes,
          ou ao uso específico, no caso de terceiros, sendo proibido o acúmulo
          de perfis.
        </p>

        <h4 class="text-lg font-medium">7.1 Perfil de Acesso</h4>
        <p>
          A atribuição e gerenciamento de perfis de acesso aos sistemas são de
          responsabilidade do setor Administrativo e englobam todos os sistemas
          em uso.
        </p>
        <p>
          Padrão: 08h às 18h. Fora desse período, somente será autorizado o
          acesso mediante aprovação prévia do gestor superior.
        </p>

        <h4 class="text-lg font-medium">
          7.2 Criação e Cancelamento de Perfis
        </h4>
        <p>
          O Coordenador Administrativo é responsável pela aprovação para criação
          e cancelamento de perfis.
        </p>
        <p>
          Em determinados sistemas de propriedade da RAD DIMENSTEIN, como o
          TREVO (ou outro que venha a substituir), onde são disponibilizados os
          relatórios referentes aos serviços executados pela RAD DIMENSTEIN,
          sendo estes os principais "produtos finais" da empresa, os empregados,
          estagiários e aprendizes da RAD DIMENSTEIN possuem perfis com
          autorização para criação de novos usuários terceiros, sendo estes
          últimos voltados apenas aos clientes da empresa.
        </p>

        <h4 class="text-lg font-medium">7.3 Restrição de Acesso do Usuário</h4>
        <p>
          Sem necessidade de prévia autorização, a equipe Administrativa pode
          restringir o acesso dos usuários que forem detectados exaurindo ou
          prejudicando algum recurso tecnológico.
        </p>
        <p>
          A restrição imposta ao usuário deve ser comunicada formalmente pelo
          Coordenador, que se encarregará de informar aos demais componentes do
          Comitê de Segurança da Informação.
        </p>
        <p>
          O Coordenador Administrativo decide sobre a manutenção ou retirada da
          restrição e suas possíveis consequências, com base nas informações
          fornecidas pela equipe Administrativa.
        </p>
      </section>
      <section>
        <h3 class="text-lg font-medium">
          8 RESPONSABILIDADE SOBRE EQUIPAMENTOS PESSOAIS
        </h3>
        <p>
          Os equipamentos pessoais trazidos e/ ou mantidos nas dependências da
          RAD DIMENSTEIN são de responsabilidade exclusiva do proprietário ou
          usuário.
        </p>

        <h4 class="text-lg font-medium">
          8.1 Perda ou Furto de Equipamentos Pessoais
        </h4>
        <p>
          Eventuais perdas ou furtos de equipamentos pessoais são de
          responsabilidade exclusiva dos usuários, não cabendo à RAD DIMENSTEIN
          qualquer obrigação de reposição ou indenização em eventuais casos de
          sinistros dessas naturezas. O setor Administrativo deverá elaborar os
          procedimentos para a entrada e saída de equipamentos pessoais
          eventualmente utilizados em trabalhos que envolvam informação.
        </p>

        <h4 class="text-lg font-medium">
          8.2 Instalação de Sistemas e Serviços da RAD DIMENSTEIN em
          Equipamentos Pessoais
        </h4>
        <p>
          Os sistemas e serviços de TI da RAD DIMENSTEIN não podem ser
          utilizados em equipamentos pessoais, exceto se autorizado pela
          Gerência de TI ou se estiverem liberados para uso público.
        </p>
        <h5 class="text-lg font-medium">
          Segurança da Informação na Utilização de Sistemas e Serviços da RAD
          DIMENSTEIN em Equipamentos Pessoais
        </h5>
        <p>
          Caso haja liberação para uso de aplicativos internos ou externos em
          algum equipamento pessoal, a equipe Administrativa deverá verificar se
          tal equipamento possui a proteção apropriada para o uso autorizado.
        </p>
      </section>
      <section>
        <h3 class="text-lg font-medium">
          9 IDENTIFICAÇÃO DE PESSOAS E ACESSO ÀS INFORMAÇÕES
        </h3>
        <p>
          Todos os dispositivos de reconhecimento de pessoas utilizados na RAD
          DIMENSTEIN, como o número de registro do empregado, das identificações
          de acessos aos sistemas, dos certificados, das assinaturas digitais,
          entre outros, têm de estar associados a uma pessoa física e atrelados
          inequivocamente aos seus documentos oficiais reconhecidos pela
          legislação brasileira.
        </p>

        <h4 class="text-lg font-medium">
          9.1 Criação e Controle das Identidades Lógicas e Certificações
          Digitais
        </h4>
        <p>
          O Coordenador Administrativo é responsável pela criação e controle das
          certificações digitais e identidades lógicas dos diretores,
          empregados, estagiários, aprendizes e prestadores de serviço na RAD
          DIMENSTEIN.
        </p>

        <h4 class="text-lg font-medium">
          9.2 Acesso físico no ambiente corporativo
        </h4>
        <p>
          A entrada e saída de funcionários são controlados pela portaria, que
          deve apresentar um documento com identificação legal e registro da sua
          digital para liberação de acesso no prédio. No caso de visitantes,
          somente é autorizado mediante liberação do Coordenador e/ou Diretor,
          sendo informada a portaria.
        </p>
        <p>
          A segurança e o controle do prédio são inteiramente de
          responsabilidade de fiscalização do condomínio, sempre com o aceite
          dos responsáveis da RAD DIMENSTEIN tais com Sócios, Diretores e
          Coordenador Administrativo.
        </p>

        <h4 class="text-lg font-medium">
          9.3 Desligamento ou Remanejamento de Empregados, estagiários e
          aprendizes da RAD DIMENSTEIN.
        </h4>
        <p>Nos casos de desligamento ou remanejamento de empregado da RAD</p>
        <p>
          DIMENSTEIN, o setor Administrativo fica responsável pelo tratamento
          junto à portaria e aos processos rescisórios.
        </p>

        <h4 class="text-lg font-medium">
          9.4 Desligamento de Prestador de Serviço
        </h4>
        <p>
          Nos casos de desligamento de prestador de serviço, o gestor da área
          tomadora do serviço deverá comunicar o fato imediatamente à equipe
          Administrativa.
        </p>

        <h4 class="text-lg font-medium">
          9.5 Bloqueio de Acesso do Usuário nos Casos de Desligamento
        </h4>
        <p>
          Quando algum usuário se desligar da RAD DIMENSTEIN, a equipe
          Administrativa deverá bloquear imediatamente o acesso aos sistemas e
          equipamentos aos quais ele tinha acesso.
        </p>
      </section>
      <section>
        <h3 class="text-lg font-medium">10 CLASSIFICAÇÃO DA INFORMAÇÃO</h3>
        <p>
          Todos os usuários são responsáveis pelas informações da RAD DIMENSTEIN
          que circulam em diferentes formatos e meios de comunicação, dentro e
          fora da organização.
        </p>
        <p>
          Toda informação deve ser protegida e mantida sob sigilo conforme a sua
          importância e criticidade para a RAD DIMENSTEIN.
        </p>
        <p>
          Quanto mais crítica ou sigilosa, maiores cuidados devem ser dedicados
          ao manuseio, arquivamento e eventual descarte.
        </p>

        <h4 class="text-lg font-medium">
          10.1 Informação em Documentos Físicos e Eletrônicos
        </h4>
        <p>
          A RAD DIMENSTEIN trabalha com documentos físicos e eletrônicos,
          criados internamente ou recebidos de terceiros. Todos os documentos
          são de propriedade da RAD DIMENSTEIN e, portanto, devem ser
          protegidos, pois podem conter informações corporativas críticas.
        </p>

        <h4 class="text-lg font-medium">
          10.2 Processo de Classificação da Informação
        </h4>
        <p>
          O Diretor-Presidente e o Coordenador Administrativo da RAD DIMENSTEIN
          são responsáveis pela classificação dos tipos de documento, podendo
          delegar essa função total ou parcialmente, por meio de instrumento
          formal.
        </p>
        <p>
          O processo de classificação da informação consiste em identificar
          quais são os níveis de proteção requeridos, bem como estabelecer
          classes e formas de identificalas, além de determinar os controles de
          proteção necessários a cada uma delas. O sistema de classificação de
          informação da RAD DIMENSTEIN obedece a seguinte estrutura, de acordo
          com a sua criticidade:
        </p>
        <h5 class="text-lg font-medium">Informação Confidencial</h5>
        <p>
          É a informação da RAD DIMENSTEIN e/ ou de seus clientes e parceiros
          com o mais alto grau de confidencialidade e restrição, onde, se for
          divulgada sem autorização, pode causar danos materiais significativos
          ou até mesmo colocar em risco a viabilidade do negócio da RAD
          DIMENSTEIN. São limitadas a um número reduzido de pessoas, pois exigem
          medidas especiais de controle e proteção contra acessos ou cópias não
          autorizadas.
        </p>
        <h5 class="text-lg font-medium">Informação Interna</h5>
        <p>
          É toda informação cujo conhecimento é limitado ao ambiente interno e
          aos propósitos da RAD DIMENSTEIN. Apenas os empregados, estagiários ou
          aprendizes e prestadores de serviços podem ter acesso a essas
          informações e sua revelação ao público em geral só poderá ocorrer se
          explicitamente autorizada pela organização.
        </p>
        <h5 class="text-lg font-medium">Informação não classificada</h5>
        <p>
          Toda informação não classificada deve ser considerada como INTERNA.
        </p>
      </section>
      <section>
        <h3 class="text-lg font-medium">11 PROTEÇÃO CONTRA AMEAÇAS DIGITAIS</h3>
        <p>
          Os hábitos seguros contra ameaças digitais são de responsabilidade de
          todos os usuários, que devem seguir as recomendações da equipe
          Administrativa, divulgadas pelos instrumentos de comunicação
          disponíveis na RAD DIMENSTEIN.
        </p>

        <h4 class="text-lg font-medium">
          11.1 Proteção Contra Aplicativos Mal-Intencionados
        </h4>
        <p>
          A proteção contra aplicativos mal-intencionados deve ser realizada por
          meio de ações conjuntas dos profissionais de TI, sistemas de proteção,
          procedimentos de segurança e comportamento dos usuários.
        </p>

        <h4 class="text-lg font-medium">
          11.2 Aquisição e Instalação de Sistemas ou Equipamento de Prevenção
        </h4>
        <p>
          A aquisição e instalação de sistemas ou equipamentos de prevenção
          contra ameaças digitais são de responsabilidade exclusiva da equipe
          Administrativa.
        </p>

        <h4 class="text-lg font-medium">11.3 Instalações de Aplicativos</h4>
        <p>
          Todo e qualquer aplicativo deve ser instalado exclusivamente pelo
          Coordenador Administrativo ou por profissional de TI indicado pelo
          mesmo.
        </p>

        <h4 class="text-lg font-medium">
          11.4 Aplicativos Ilegais ou não homologados
        </h4>
        <p>
          Não são permitidas instalações de aplicativos ilegais ou não
          homologados pelo Coordenador Administrativo nos equipamentos da RAD
          DIMENSTEIN.
        </p>

        <h4 class="text-lg font-medium">
          11.5 Lista dos Aplicativos homologados
        </h4>
        <p>
          O Coordenador Administrativo deve elaborar lista com todos os
          aplicativos homologados e disponibilizá-la através dos instrumentos de
          comunicação disponíveis na RAD DIMENSTEIN.
        </p>

        <h4 class="text-lg font-medium">11.6 Wi-Fi Convidados</h4>
        <p>
          Para melhor segurança e controle de acesso à internet, todos os
          computadores da RAD DIMENSTEIN terão o acesso à rede e aos dados do
          servidor (sempre respeitando as regras de controle de acesso de acordo
          com a hierarquia e função de suas atividades). Os demais equipamentos
          pessoais, como notebook e celulares dos empregados, terão o acesso
          limitado apenas ao "Wi-Fi Convidado".
        </p>
      </section>
      <section>
        <h3 class="text-lg font-medium">12. DESCARTE DE MIDIAS</h3>
        <p>
          O processo de eliminação da informação é tão ou mais importante que a
          sua geração ou armazenamento. Por isso, o descarte de mídias ou
          eliminação de conteúdos de informação sensível ou sigilosa deve
          atender os seguintes procedimentos para o descarte seguro:
        </p>
        <h4 class="text-lg font-medium">12.1 Mídias Físicas</h4>
        <p>
          Dispositivos de armazenamento (CDs, DVDs, discos rígidos, Pen-Drive,
          memórias "flash" e outros meios de armazenamento) devem ser
          descartados através da destruição física através da fragmentadora que
          se encontra no setor Administrativo.
        </p>
        <p>
          Documentos impressos que contenham informações pessoais, financeiras
          ou outros dados importantes para a empresa devem ser destruídos
          através da fragmentadora que se encontra no setor Administrativo.
        </p>

        <h4 class="text-lg font-medium">12.2 Mídias Virtuais</h4>
        <p>
          Quando houver a necessidade de exclusão ou desinstalação de softwares,
          a responsabilidade fica inteiramente com o Coordenador Administrativo
          ou com profissional de T.I. indicado pelo mesmo.
        </p>
        <p>
          Para os casos de exclusão de arquivos digitais, os profissionais devem
          previamente solicitar autorização dos coordenadores de seus setores.
        </p>
      </section>
      <section>
        <h3 class="text-lg font-medium">13 TRATAMENTO DE INCIDENTES</h3>
        <p>
          Ao tomar conhecimento de uma brecha, incidente e/ ou violação deste
          Código, o usuário não deverá fazer nenhum teste para checar possíveis
          falhas na segurança.
        </p>
        <p>
          A efetivação de testes de vulnerabilidade ou tentativa para solucionar
          possíveis brechas podem ser interpretadas como tentativa de violação
          da segurança e o usuário que assim proceder poderá ser
          responsabilizado legalmente.
        </p>

        <h4 class="text-lg font-medium">
          13.1 Comunicação de Incidentes de Segurança da Informação
        </h4>
        <p>
          Ao perceber uma possível brecha, incidente ou violação da PSI, o
          usuário deverá comunicar o fato ao Coordenador Administrativo.
        </p>

        <h4 class="text-lg font-medium">
          13.2 Documentação de Incidentes de Segurança da Informação
        </h4>
        <p>
          A equipe Administrativa deve documentar todas as ocorrências de
          brechas ou incidentes de segurança e colher todas as evidências
          possíveis quando identificar violações intencionais, inclusive usando
          as atas notariais, quando necessário.
        </p>
      </section>
      <section>
        <h3 class="text-lg font-medium">
          14 MEDIDAS DISCIPLINARES POR VIOLAÇÃO DA PSI
        </h3>
        <p>
          Os usuários que cometerem excessos ao utilizar os recursos
          disponibilizados pela RAD DIMENSTEIN podem ter seus privilégios
          cancelados.
        </p>

        <h4 class="text-lg font-medium">14.1 Ação Disciplinar</h4>
        <p>
          A violação das normas estabelecidas neste Código de Segurança da
          Informação, de suas alterações ou de normas complementares é
          considerada infração, cuja natureza e gravidade implicam na utilização
          de medidas disciplinares ao usuário que assim proceder.
        </p>

        <h4 class="text-lg font-medium">
          14.2 Notificação da Violação da PSI à Administração.
        </h4>
        <p>
          Quando houver alguma violação deste PSI, o supervisor de cada setor
          deve notificar o fato ao Coordenador Administrativo.
        </p>
        <p>
          A notificação emitida pela Administrativa deve indicar o tipo de
          violação e se houve reincidência por parte do usuário.
        </p>

        <h4 class="text-lg font-medium">14.3 Medidas Disciplinares Cabíveis</h4>
        <p>
          O Coordenador Administrativo decide sobre a aplicação das medidas
          disciplinares cabíveis, conforme a gravidade e em conformidade com a
          legislação em vigor.
        </p>

        <h4 class="text-lg font-medium">
          14.4 Níveis de Gravidade de Eventual Violação da PSI
        </h4>
        <p>
          De acordo com a gravidade da infração eventualmente cometida, os
          impactos e eventuais prejuízos causados por ela, a RAD DIMENSTEIN
          poderá aplicar sanções cabíveis e proporcionais, conforme previsto na
          legislação em vigor e no Código de Ética e Conduta da RAD DIMENSTEIN.
        </p>
        <p>
          A gravidade da infração deve ser explicitada, levando-se em
          consideração os riscos aos quais a RAD DIMENSTEIN foi exposta e os
          prejuízos causados.
        </p>
        <p>A gravidade das violações da PSI é classificada como:</p>
        <h5 class="text-lg font-medium">Violação de Baixa Gravidade</h5>
        <p>
          Violação que não gera consequências imediatas e pode ser sanada
          imediatamente.
        </p>
        <h5 class="text-lg font-medium">Violação de Média Gravidade</h5>
        <p>
          Violação que pode gerar ou não prejuízo, porém requer tempo e esforço
          considerável para corrigi-la.
        </p>
        <h5 class="text-lg font-medium">Violação de Alta Gravidade</h5>
        <p>
          Violação que gera consequências imediatas, trazendo prejuízos para a
          imagem da RAD DIMENSTEIN e para a continuidade do negócio ou
          financeira.
        </p>

        <h4 class="text-lg font-medium">14.5 Casos Omissos</h4>
        <p>
          Os casos omissos, não previstos neste Código, devem ser avaliados e
          tratados pelo Coordenador Administrativo e pelos sócios da empresa.
        </p>
      </section>
      <section>
        <h3 class="text-lg font-medium">15 PRESTADORES DE SERVIÇOS</h3>
        <p>
          Os prestadores de serviços contratados pela RAD DIMENSTEIN devem estar
          atentos à prevenção de riscos e impactos à confidencialidade, proteção
          e segurança da informação da RAD DIMENSTEIN, comunicando os casos de
          incidentes e/ ou violações da PSI ao responsável pela contratação.
        </p>

        <h4 class="text-lg font-medium">
          15.1 Violações Cometidas por Prestadores de Serviço
        </h4>
        <p>
          Caso o usuário em questão seja um prestador de serviço, a RAD
          DIMENSTEIN poderá aplicar sanções cabíveis e proporcionais conforme
          previsto na legislação em vigor e em contrato.
        </p>

        <h4 class="text-lg font-medium">
          15.2 Violações Cometidas por Empregados de Empresas Prestadoras de
          Serviços
        </h4>
        <p>
          Havendo violação da PSI por empregado de empresa prestadora de
          serviço, a RAD DIMENSTEIN deverá notificar a infração à empresa
          contratada, que deverá tomar as medidas cabíveis.
        </p>

        <h4 class="text-lg font-medium">
          15.3 Cláusulas Obrigatórias em Contratos com Prestadores de Serviços
        </h4>
        <p>
          Para garantir o cumprimento da Política de Segurança da Informação da
          RAD DIMENSTEIN, os contratos firmados com prestadores de serviços
          devem conter cláusulas específicas:
        </p>
        <h5 class="text-lg font-medium">- Cláusula de Confidencialidade</h5>
        <p>
          É obrigatória a presença de cláusula de confidencialidade em todos os
          contratos de prestação de serviço para que possa ser concedido o
          acesso do usuário aos ativos de informação disponibilizados pela
          Fundação.
        </p>
        <h5 class="text-lg font-medium">
          - Cláusula de Conhecimento e Cumprimento da PSI
        </h5>
        <p>
          Todos os contratos assinados com prestadores de serviços que atuem
          dentro do ambiente da RAD DIMENSTEIN, devem conter cláusula que
          especifique o compromisso em seguir as regras deste Código.
        </p>
        <h5 class="text-lg font-medium">
          - Confidencialidade Após Término da Prestação do Serviço
        </h5>
        <p>
          O direito autoral e a confidencialidade das informações da RAD
          DIMENSTEIN ou dos seus parceiros devem ser preservados em todos os
          trabalhos realizados em nome da RAD DIMENSTEIN, mesmo após o término
          do referido trabalho, por tempo indeterminado ou formalmente expresso
          pela RAD DIMENSTEIN.
        </p>

        <h4 class="text-lg font-medium">
          15.4 Utilização de Equipamentos Próprios por Prestadores de Serviços
        </h4>
        <p>
          Prestadores de serviços que necessitem utilizar equipamentos próprios
          para o desempenho de suas atribuições também estão sujeitos às
          diretrizes da PSI e deste Código.
        </p>

        <h4 class="text-lg font-medium">
          15.5 Acesso de Prestadores de Serviços ao Ambiente Tecnológico da RAD
          DIMENSTEIN a partir de Equipamentos Próprios
        </h4>
        <p>
          Os equipamentos dos prestadores de serviços que necessitem de acesso
          ao ambiente tecnológico da RAD DIMENSTEIN devem ser configurados pelo
          Coordenador Administrativo e os privilégios dados ao usuário e ao
          equipamento devem ser limitados ao mínimo necessário para a execução
          das tarefas estabelecidas no contrato.
        </p>

        <h4 class="text-lg font-medium">
          15.6 Encerramento das Atividades de Prestadores de Serviços
        </h4>
        <p>
          O encerramento das atividades dos prestadores de serviços deve ser
          comunicado imediatamente ao setor Administrativo.
        </p>

        <h4 class="text-lg font-medium">
          15.7 Devolução de Recursos Disponibilizados pela RAD DIMENSTEIN.
        </h4>
        <p>
          Todos os prestadores de serviço, no encerramento de suas atividades,
          devem devolver integralmente os recursos disponibilizados pela RAD
          DIMENSTEIN, ou que vieram a ter acesso em decorrência da sua
          contratação e que estejam sob sua posse ou responsabilidade.
        </p>

        <h4 class="text-lg font-medium">
          15.8 Cancelamento de Acessos ao Fim das Atividades, Contratos ou
          Acordos.
        </h4>
        <p>
          Todos os acessos concedidos aos prestadores de serviços devem ser
          cancelados pela equipe Administrativa após o encerramento das
          atividades, contratos ou acordos.
        </p>
      </section>
      <section>
        <h3 class="text-lg font-medium">16 COMPETÊNCIA E RESPONSABILIDADES</h3>
        <p>
          Todos os usuários são responsáveis pelo cumprimento das determinações
          deste Código.
        </p>

        <h4 class="text-lg font-medium">
          16.1 Responsabilidades Gerais de Todos os Empregados da RAD DIMENSTEIN
        </h4>
        <p>
          Cumprir as normas estabelecidas por este Código, bem como manter-se
          informado sobre suas atualizações e as normas dele derivadas;
        </p>
        <p>
          Comunicar o setor Administrativo, com cópia aos superiores imediatos,
          quaisquer atos ou situações que, segundo sua percepção ou avaliação,
          coloquem em risco a segurança da informação;
        </p>
        <p>
          Ter comportamento idôneo com relação à utilização dos recursos de
          T.I.;
        </p>
        <p>
          Ser ético na aquisição, tratamento e utilização da informação
          corporativa;
        </p>
        <p>
          Praticar atos pautados nas regras e orientações contidas neste código.
        </p>

        <h4 class="text-lg font-medium">
          16.2 Responsabilidades Específicas dos Diretores, Gerentes e
          Supervisores
        </h4>
        <p>
          Adequar as normas, os processos, procedimentos e sistemas sob sua
          responsabilidade para atender à PSI.
        </p>
        <p>
          Ter postura exemplar em relação à segurança da informação, servindo
          como modelo de conduta para os membros de suas respectivas equipes;
        </p>
        <p>
          Apresentar e informar aos futuros usuários, em fase de contratação e
          formalização dos contratos individuais de trabalho, de prestação de
          serviços ou de parceria, a exigibilidade de cumprimento deste Código;
        </p>
        <p>
          Verificar se todos os membros de suas respectivas equipes tomaram
          conhecimento deste código e assinaram o Termo de Compromisso,
          assumindo o dever de cumprirem as normas estabelecidas, bem como se
          comprometendo a manterem sigilo e confidencialidade sobre todos os
          ativos de informações da RAD DIMENSTEIN, mesmo quando desligados;
        </p>
        <p>
          Providenciar para que os prestadores de serviços e outros usuários que
          não estejam cobertos por um contrato assinem o Termo de Compromisso e
          Ciência antes de receberem acesso às informações em formato físico ou
          digital da RAD DIMENSTEIN.
        </p>
        <p>Comunicar às suas equipes as atualizações deste Código.</p>

        <h4 class="text-lg font-medium">
          16.3 Responsabilidades Específicas da equipe Administrativa
        </h4>
        <p>
          Pela característica de seus privilégios, manter sigilo sobre as
          informações e dados da RAD DIMENSTEIN e dos usuários, restringindo-se
          a acessá-los somente quando forem necessários para a execução das
          atividades operacionais sob sua responsabilidade;
        </p>
        <p>
          Segregar as funções administrativas, operacionais e educacionais nos
          sistemas, a fim de restringir ao mínimo necessário os poderes de cada
          usuário e eliminar, ou ao menos reduzir, a existência de pessoas que
          possam excluir os logs e trilhas de auditoria das suas próprias ações;
        </p>
        <p>
          Testar a eficácia dos controles e ferramentas de segurança utilizadas
          e informar aos gestores das demais áreas e ao Comitê de Segurança da
          Informação sobre os riscos residuais;
        </p>
        <p>
          Planejar, implantar, fornecer e monitorar a capacidade de armazenagem,
          processamento e transmissão, necessários para garantir a segurança
          requerida pelas áreas de negócio;
        </p>
        <p>
          Realizar auditorias periódicas de configurações técnicas e análise de
          riscos, para subsidiar as decisões do Comitê de Segurança da
          Informação;
        </p>
        <p>
          Administrar, proteger e testar as cópias de segurança dos programas e
          dados relacionados aos processos críticos e relevantes para a RAD
          DIMENSTEIN;
        </p>
        <p>
          Proteger continuamente todos os sistemas e equipamentos da organização
          contra códigos maliciosos e garantir que os novos sistemas e
          equipamentos só entrem para o ambiente de produção após estarem livres
          de códigos maliciosos e/ ou indesejados; viii. Monitorar o ambiente
          gerar indicadores e históricos de todos os fatos relevantes que possam
          impactar na segurança da informação;
        </p>
        <p>
          Implantar controles que gerem registros auditáveis para retirada e
          transporte de mídias das informações custodiadas pela equipe
          Administrativa nos ambientes totalmente controlados por ela;
        </p>
        <p>
          Gerar e manter as trilhas para auditoria com nível de detalhe
          suficiente para rastrear possíveis falhas e fraudes. Para as trilhas
          geradas e/ ou mantidas em meio eletrônico, implantar controles de
          integridade para torná-las juridicamente válidas como evidências;
        </p>
        <p>
          Configurar os equipamentos, ferramentas e sistemas concedidos aos
          usuários com todos os controles necessários, para cumprir os
          requerimentos de segurança estabelecidos por este Código;
        </p>
        <p>
          Manter os sistemas atualizados em suas versões mais recentes, bem como
          os equipamentos que necessitam de atualizações de firmware;
        </p>
        <p>
          Acompanhar a evolução tecnológica e propor novas soluções para
          garantir que o ambiente tecnológico da RAD DIMENSTEIN se mantenha
          seguro;
        </p>
        <p>
          Definir as regras formais para instalação de software e hardware em
          ambiente de produção institucional, exigindo o seu cumprimento dentro
          da organização;
        </p>
        <p>
          Garantir segurança especial para sistemas com acesso público,
          procurando fazê-lo guardar as evidências que permitam a
          rastreabilidade para fins de auditoria ou investigação;
        </p>
        <p>
          Garantir que todos os servidores, estações e demais dispositivos com
          acesso à rede da RAD DIMENSTEIN operem com o relógio sincronizado com
          os servidores de tempo oficiais do governo brasileiro;
        </p>
        <p>
          Garantir que não sejam introduzidas vulnerabilidades ou fragilidades
          no ambiente de produção da RAD DIMENSTEIN em processo de mudança,
          sendo ideal a auditoria de código e a proteção contratual para
          controle e atribuição de responsabilidade no caso de uso de terceiros;
        </p>
        <p>
          Garantir que as informações de um usuário não sejam removidas de forma
          irrecuperável antes de disponibilizar o ativo para outro usuário,
          quando ocorrer movimentação interna dos ativos de T.I.;
        </p>
        <p>
          Bloquear em 24 horas os acessos de usuários por motivo de desligamento
          da RAD DIMENSTEIN, incidente, investigação ou outra situação que exija
          medida restritiva para fins de resguardar os ativos da RAD DIMENSTEIN;
        </p>
        <p>
          Promover a conscientização dos usuários em relação à relevância da
          segurança da informação para o negócio da RAD DIMENSTEIN, mediante
          campanhas, palestras, treinamentos e outros meios de endomarketing;
        </p>
        <p>
          Apoiar as avaliações e as adequações de controles específicos de
          segurança da informação para novos sistemas ou serviços;
        </p>
        <p>
          Propor as metodologias e os processos específicos para a segurança da
          informação, como avaliação de risco e sistema de classificação da
          informação;
        </p>
        <p>
          Propor e apoiar iniciativas que visem à segurança dos ativos de
          informação da RAD DIMENSTEIN;
        </p>
        <p>
          Disponibilizar os indicadores de segurança gerados, bem como as
          principais ocorrências, para a Diretoria e Gerentes da RAD DIMENSTEIN.
          A disponibilização deve ser periódica e os prazos acordados entre as
          partes;
        </p>
        <p>
          Garantir o sigilo sobre as senhas de acesso aos sistemas e
          equipamentos, não as fornecendo, em hipótese alguma, a usuários;
        </p>
        <p>
          Garantir o controle de acessos aos ambientes de processamento e
          armazenamento das informações da RAD DIMENSTEIN por meio de
          estabelecimento de perímetros de segurança;
        </p>
        <p>
          Planejar e aplicar proteções físicas contra fenômenos naturais bem
          como contra incêndio, infiltrações e outros sinistros que possam
          trazer danos aos equipamentos de processamento e armazenamento das
          informações.
        </p>
      </section>
      <section>
        <h3 class="text-lg font-medium">17. ARQUIVOS EM NUVEM AWS</h3>
        <p>
          Muitos documentos disponibilizados pela empresa ficam em nuvem, para o
          acesso dos clientes e dos usuários internos, seguindo a divisão
          conforme abaixo:
        </p>
        <h5 class="text-lg font-medium">Conta Administrador:</h5>
        tem a permissão mestre e consegue realizar:
        <p>A) Cadastrar usuários de todos os tipos.</p>
        <p>B) Cancelar e excluir usuários de todos os tipos</p>
        <p>C) Alterar cadastros e permissões</p>
        <p>D) Excluir usuários</p>
        <p>E) Monitorar Logs</p>
        <p>
          F) Visualizar, excluir, alterar, assinar, liberar e renomear
          documentos (laudos e certificados).
        </p>

        <h5 class="text-lg font-medium">Rad Físico:</h5>
        Tem as permissões:
        <p>A) Cadastrar usuários tipo cliente.</p>
        <p>B) Assinar e liberar (laudos e certificados).</p>
        <p>
          C) Visualizar, inserir, excluir renomear, documentos (laudos e
          certificados).
        </p>

        <h5 class="text-lg font-medium">Rad Admin:</h5>
        Tem as permissões:
        <p>A) Cadastrar usuários tipo cliente.</p>
        <p>
          B) Visualizar, inserir, excluir e renomear documentos (laudos e
          certificados).
        </p>

        <h5 class="text-lg font-medium">Cliente:</h5>
        Usuário indicado pelo cliente. Tem acesso a uma ou mais unidades, com
        permissão apenas visualizar documentos (laudos e certificados).
        <p>
          Para modificar ou alterar dados, as solicitações devem ser
          encaminhadas para o e-mail: laudos.radimenstein@gmail.com
        </p>

        <h5 class="text-lg font-medium">Cliente MN:</h5>
        Tem as permissões:
        <p>A) Visualizar documentos;</p>
        <p>
          B) Inserir dados limitados de medições periódicas, executadas pelos
          próprios profissionais do cliente;
        </p>
        <p>
          Para demais alterações sempre solicitar para o e-mail:
          fsayuri.rad@gmail.com
        </p>
      </section>
      <section>
        <h3 class="text-lg font-medium">
          18. CONTROLES E REGISTROS DA QUALIDADE
        </h3>
        <p>
          Os controles e registros da Qualidade que evidenciam a correta
          aplicação da PSI estão relacionados a seguir:
        </p>
        <p>- Mapa de riscos de segurança da informação;</p>
        <p>
          - Relatório de registros de incidentes de segurança da informação;
        </p>
        <p>- Mapa de controle de acessos;</p>
        <p>- Relatório de registro de backups realizados;</p>
        <p>- Planejamento de exercícios de recuperações de registros;</p>
        <p>- Execução de exercícios de recuperações de registros;</p>
        <p>- Controle de assinantes dos Termos de Compromisso e Ciência;</p>
        <p>- Mapa de estrutura de prevenções contra-ataques externos;</p>
        <p>
          - Registros de atualizações de defesas individuais (antivírus,
          antispyware, etc.); J. Atas das reuniões do Comitê de Segurança da
          Informação;
        </p>
      </section>
      <section class="mb-4">
        <h3 class="text-lg font-medium">
          MATRIZ DE RESPONSABILIDADE PARA ELABORAÇÃO DO CÓDIGO DE SEGURANÇA DA
          INFORMAÇÃO
        </h3>

        <table>
          <thead>
            <tr>
              <th><br />ATIVIDADE</th>
              <th><br />RESPONSABILIDADE</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><br />Elaboração do Código de Segurança da Informação</td>
              <td><br />Analista Administrativo</td>
            </tr>
            <tr>
              <td>
                <br />1ª Aprovação – Formatação e Revisão de <br />
                <br />Conteúdo
              </td>
              <td><br />Coordenador Administrativo</td>
            </tr>
            <tr>
              <td><br />2ª Aprovação – Responsabilidade Direta</td>
              <td><br />Coordenador Administrativo</td>
            </tr>
            <tr>
              <td><br />3ª Aprovação – Legalidade</td>
              <td><br />Coordenador Administrativo</td>
            </tr>
            <tr>
              <td><br />4ª Aprovação – Ratificação do Projeto</td>
              <td><br />Coordenador Administrativo</td>
            </tr>
            <tr>
              <td><br />Revisão Textual</td>
              <td><br />Coordenador Administrativo</td>
            </tr>
            <tr>
              <td><br />Revisão Geral Codificação e Controle</td>
              <td><br />Coordenador Administrativo</td>
            </tr>
            <tr>
              <td>
                <br />6ª Aprovação – Homologação de Atendimento a Requisitos
              </td>
              <td><br />Coordenador Administrativo</td>
            </tr>
            <tr>
              <td><br />Divulgação</td>
              <td><br />Coordenador Administrativo</td>
            </tr>
          </tbody>
        </table>
      </section>
      <section>
        <h3 class="text-lg font-medium">GLOSSÁRIO</h3>
        <p>
          <strong>Ameaças:</strong> situações que exploram uma vulnerabilidade.
          Exemplo: vírus, spam, acesso indevido, hackers etc.
        </p>
        <p>
          <strong>Aplicativos mal-intencionados:</strong> são programas de
          computador desenvolvidos para causar algum tipo de dano aos arquivos,
          aos sistemas ou às redes de computadores, bem como para capturar
          informações ou utilizar seu equipamento para ações danosas a outras
          máquinas ou redes. Podem ser introduzidas por meio de arquivos anexos
          aos e-mails, mídias removíveis contaminadas, configuração inadequada
          no sistema operacional de seu equipamento ou, ainda, arquivos obtidos
          na Internet.
        </p>
        <p>
          <strong>Arquivo/ Arquivos em Nuvem:</strong> em qualquer sistema de
          computador, arquivo é um conjunto de dados disponível aos usuários
          (inclusive o próprio sistema e os programas aplicativos), capaz de ser
          manipulado (por exemplo: movido, copiado, apagado etc.).
        </p>
        <p>
          <strong>Ata notarial:</strong> trata-se de uma das espécies do gênero
          instrumento público notarial, por cujo meio o tabelião de notas acolhe
          e relata, na forma legal adequada, fato ou fatos jurídicos que ele vê
          e ouve com seus próprios sentidos, quer sejam fatos naturais quer
          sejam fatos humanos, esses últimos desde que não constituam negócio
          jurídico.
        </p>
        <p>
          <strong>Backup:</strong> cópia de segurança dos dados originais ou
          conjunto de dados mantidos por questão de segurança, a fim de garantir
          sua disponibilidade.
        </p>
        <p>
          <strong>Computação em grade:</strong> ou grid computing, é um modelo
          computacional capaz de alcançar altas taxas de velocidade de
          processamento dividindo as tarefas em diversas máquinas, que formam
          uma máquina virtual.
        </p>
        <p>
          <strong>Confidencialidade:</strong> garantia de que o acesso à
          informação seja obtido somente por pessoas autorizadas.
        </p>
        <p>
          <strong>Controle de acesso:</strong> controle efetuado sobre um
          hardware ou software para prevenir ou detectar o acesso não autorizado
          a sistemas, informações, equipamentos, instalações, entre outros,
          inclusive o perímetro de segurança de equipamentos e áreas de
          processamento e armazenamento de informações.
        </p>
        <p>
          <strong>Copyright:</strong> direito autoral, propriedade literária ou
          artística.
        </p>
        <p>
          <strong>Datacenter:</strong> é um ambiente projetado para abrigar
          servidores e outros componentes como sistemas de armazenamento de
          dados (storages) e ativos de rede (switches, roteadores). Em geral um
          datacenter deve prover ambiente de rede, segurança física, sistema de
          combate e prevenção a incêndios, refrigeração e energia.
        </p>
        <p>
          <strong>Disponibilidade:</strong> garantia de que os usuários
          autorizados obtenham acesso à informação e aos ativos correspondentes
          sempre que necessário.
        </p>
        <p>
          <strong>Documento:</strong> é toda unidade de registro de informações,
          qualquer que seja o suporte ou formato. Em outras palavras, a
          informação pode estar registrada em papel, em arquivo eletrônico, em
          uma placa de identificação ou em qualquer outro tipo de suporte.
        </p>
        <p>
          <strong>E-mail (Correio eletrônico):</strong> correspondência
          eletrônica trocada entre partes distintas.
        </p>
        <p>
          <strong>Empregado:</strong> denominação dada à pessoa contratada cujo
          vínculo de cunho empregatício é regido pela CLT - Consolidação das
          Leis do Trabalho.
        </p>
        <p>
          <strong>Firmware:</strong> conjunto de instruções operacionais
          programadas diretamente no hardware de um equipamento eletrônico.
        </p>
        <p>
          <strong>Integridade:</strong> garantia de que a informação seja
          mantida em seu estado original, visando protegê-la, na guarda ou
          transmissão, contra alterações indevidas, intencionais ou acidentais.
        </p>
        <p>
          <strong>Internet:</strong> acrônimo de Interconnected Networks. Rede
          global e descentralizada de computadores, interconectados pelo uso de
          protocolos comuns de comunicação.
        </p>
        <p>
          <strong>Intranet:</strong> rede privada utilizada por uma organização.
        </p>
        <p>
          <strong>Malware (aplicativo mal-intencionado):</strong> software
          criado para infectar computadores privados e cometer crimes como
          fraude e roubo de identidade. Esses programas são criados
          especificamente para roubo de dados.
        </p>
        <p>
          <strong>Mídia:</strong> meio de transmissão e/ou armazenamento de
          dados.
        </p>
        <p>
          <strong>Parceiro:</strong> empresa que participa com a Rad Dimenstein
          no desenvolvimento de determinados projetos.
        </p>
        <p>
          <strong>Perímetro de segurança:</strong> área física ou virtual que
          circunda determinado ambiente, garantindo a sua impenetrabilidade em
          relação a eventuais ameaças.
        </p>
        <p>
          <strong>Redes Sociais:</strong> são as páginas da Internet pelas quais
          os usuários se conectam para se comunicar, trocar experiências e
          compartilhar conhecimentos. As redes sociais podem proporcionar
          diferentes meios de interação entre seus membros: sociais (Exemplos:
          Facebook, MySpace, Twitter, Instagram, WhatsApp), ou profissionais
          (Exemplo: LinkedIn).
        </p>
        <p>
          <strong>Senhas:</strong> dispositivos de verificação de identidade.
          Não podem ser compartilhadas com outras pessoas em nenhuma hipótese,
          pois o uso de senhas de outra pessoa constitui crime tipificado no
          Código Penal Brasileiro (Art. 307 – Falsa identidade).
        </p>
        <p>
          <strong>Serviço de nuvem:</strong> também referenciado como computação
          em nuvem, refere-se à utilização de memória, capacidade de
          armazenamento e processamento utilizando computadores interligados e
          seguindo o princípio da computação em grade (grid computing).
        </p>
        <p>
          <strong>Servidor:</strong> termo genérico que designa o computador
          considerado central em algum processo. Assim, existem servidores de
          impressão (Gerência impressões em cada rede), de arquivos (armazenam
          os arquivos criados pelos usuários) e de mensagem (Gerência as
          mensagens enviadas e recebidas por componentes da rede), entre outros.
        </p>
        <p>
          <strong>Sítio virtual:</strong> página ou conjunto de páginas na
          Internet.
        </p>
        <p>
          <strong>Transferência de arquivos:</strong> processo de envio de dados
          entre duas ou mais fontes.
        </p>
      </section>
    </section>
  </Layout>
</template>
