from ninja.errors import HttpError
from ninja import Router
from typing import List
from cadastro_aluno.models import TbAlunos, TbEnderecos, TbDisciplinas,TbNotas
router = Router()
from cadastro_aluno.schemas import AlunosSchema,AlunoCreateSchema,AlunoUpdateSchema,DisciplinaSchema,AlunoDetalheSchema
# busca de disciplinas
@router.get("/disciplinas", response=List[DisciplinaSchema])
def listar_disciplinas(request):
    """
    Retorna uma lista de todas as disciplinas disponíveis 
    com seus IDs e nomes.
    """
    qs = TbDisciplinas.objects.all().values('id', 'disciplina')
    return list(qs)


@router.get("/consultar-alunos")
def consultar_alunos(request):
    qs = TbAlunos.objects.all().values()
    return list(qs)

#consulta de alunos por id 
@router.get("/aluno-por-id/{aluno_id}",response= list[AlunosSchema])
def consultar_aluno_id(request,aluno_id:int):
    qs = TbAlunos.objects.filter(id=aluno_id).all().values()
    return list(qs)

# consulta de alunos por id 
@router.get("/alunos-por-nome/{nome}", response=list[AlunosSchema])
def consultar_alunos_por_nome(request, nome: str):
    qs = TbAlunos.objects.filter(nome__icontains=nome).values()
# Retorna a lista de alunos encontrados
    return list(qs)

#inserir alunos
@router.post("/inserir-aluno/")
def inserir_aluno(request, payload: AlunoCreateSchema):
    
    # --- Início da Adaptação ---
    # 1. Em vez de 'payload.dict()', separamos os dados
    try:
        dados_endereco = payload.endereco_info.dict()
        disciplinas_ids = payload.disciplinas_ids
        
        # 2. Processamos o Endereço (achar ou criar)
        endereco_obj, criado = TbEnderecos.objects.get_or_create(
            cep=dados_endereco['cep'], 
            defaults=dados_endereco # Usa o resto dos dados se precisar CRIAR
        )
    except Exception as e:
        return 400, {"mensagem": f"Erro ao processar dados de endereço: {e}"}

    try:
        # Note que não passamos 'payload' inteiro, só os campos de Aluno
        aluno_novo = TbAlunos.objects.create(
            matricula=payload.matricula,
            nome=payload.nome,
            email=payload.email,
            nome_mae=payload.nome_mae,
            endereco=endereco_obj # Ligamos o endereço que processamos
        )
    except Exception as e:
        # Pega erros (ex: matrícula duplicada)
        return 400, {"mensagem": f"Erro ao cadastrar aluno: {e}"}

    # 4. (NOVO) Processar as disciplinas (ligar aluno às matérias)
    try:
        for disc_id in disciplinas_ids:
            disciplina_obj = TbDisciplinas.objects.get(id=disc_id)
            TbNotas.objects.create(
                aluno=aluno_novo,
                disciplina=disciplina_obj,
                nota=None # Começa sem nota
            )
    except TbDisciplinas.DoesNotExist:
        aluno_novo.delete() # DESFAZ O ALUNO (importante)
        return 400, {"mensagem": f"Erro: Disciplina ID {disc_id} não existe. Cadastro desfeito."}
    
    # 5. Sucesso (seu retorno original)
    return {"id_criado": aluno_novo.id, "mensagem": "Aluno cadastrado com sucesso"}



# Atualizar aluno
@router.put("/atualizar-aluno/{aluno_id}", response=dict)
def atualizar_aluno(request, aluno_id: int, dados: AlunoUpdateSchema):
    qs = TbAlunos.objects.filter(id=aluno_id).update(**dados.dict())
    return {"mensagem": "Aluno atualizado com sucesso"}

#delete 
@router.delete("/deletar-alunos/{aluno_id}")
def deletar_aluno(request, aluno_id: int):
    aluno = TbAlunos.objects.get(id=aluno_id)
    aluno.delete()
    
    # 4. Retorna a mensagem de sucesso
    return {"mensagem": f"Aluno com ID {aluno_id} deletado com sucesso"}



# ADICIONE O NOVO ENDPOINT DE CONSULTA DETALHADA ABAIXO

@router.get("/aluno-detalhe-por-nome/{nome}", response=List[AlunoDetalheSchema])
def consultar_detalhe_por_nome(request, nome: str):
    """
    Busca alunos pelo nome e retorna seus detalhes completos,
    incluindo endereço e lista de disciplinas com notas.
    """
    alunos_encontrados = TbAlunos.objects.filter(nome__icontains=nome).select_related('endereco')
    
    # Se não achar ninguém, retorna uma lista vazia
    if not alunos_encontrados.exists():
        return []

    # Lista final que será retornada
    lista_completa_resposta = []
    
    # 2. Itera sobre cada aluno encontrado
    for aluno in alunos_encontrados:
        
        # 3. Busca as notas e disciplinas para ESTE aluno
        # .select_related('disciplina') otimiza a busca
        notas_do_aluno_db = TbNotas.objects.filter(aluno=aluno).select_related('disciplina')
        
        # Lista para guardar as matérias/notas formatadas
        matriculas_json = []
        for nota_db in notas_do_aluno_db:
            # Verifica se a disciplina existe antes de acessá-la
            if nota_db.disciplina:
                matriculas_json.append({
                    "disciplina_nome": nota_db.disciplina.disciplina,
                    "carga": nota_db.disciplina.carga,
                    "semestre": nota_db.disciplina.semestre,
                    "nota": nota_db.nota # Django/Ninja cuidam da conversão Decimal -> float
                })

        # 4. Formata o endereço (se o aluno tiver um)
        endereco_json = None
        if aluno.endereco:
            endereco_json = {
                "cep": aluno.endereco.cep,
                "endereco": aluno.endereco.endereco,
                "bairro": aluno.endereco.bairro,
                "cidade": aluno.endereco.cidade,
                "estado": aluno.endereco.estado
            }
        
        # 5. Junta tudo no formato do schema AlunoDetalheSchema
        aluno_formatado = {
            "id": aluno.id,
            "matricula": aluno.matricula,
            "nome": aluno.nome,
            "email": aluno.email,
            "nome_mae": aluno.nome_mae,
            "endereco": endereco_json,
            "matriculas": matriculas_json
        }
        
        lista_completa_resposta.append(aluno_formatado)
        
    # 6. Retorna a lista de alunos formatados
    return lista_completa_resposta

###################################

# # inserir alunos
# @router.post("/inserir-aluno/")
# def inserir_aluno(request, payload: AlunoCreateSchema):
#     # Converte o schema validado em um dicionário
#     dados_para_criar = payload.dict()
#     disciplinas_ids = payload.disciplinas_ids
#     try:
        
#         # O ' ** ' desempacota o dicionário, passando os valores
#         aluno_novo = TbAlunos.objects.create(**dados_para_criar)
#         # Retorna o ID do aluno criado e uma mensagem de sucesso
#         # O status 201 (Created) é mais adequado para POST
#         return  {"id_criado": aluno_novo.id, "mensagem": "Aluno cadastrado com sucesso"}
#     except Exception as e:
#         # Captura erros (ex: matrícula duplicada, endereco_id não existe)
#         return 400, {"mensagem": f"Erro ao cadastrar: {e}"}







