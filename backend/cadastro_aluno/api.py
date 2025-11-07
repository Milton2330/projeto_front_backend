from ninja.errors import HttpError
from ninja import Router
from typing import List
from cadastro_aluno.models import (
    TbAlunos,
    TbDisciplinas,
    TbEnderecos
)
router = Router()
from cadastro_aluno.schemas import (
    AlunosSchema,
    AlunoCreateSchema,
    AlunoUpdateSchema,
    DisciplinaUpdateSchema,
    DisciplinaCompletaSchema,
    DisciplinaSchema,
    DisciplinaCreateSchema,
    EnderecoCompletoSchema,
    EnderecoCreateSchema,
    EnderecoUpdateSchema,
    MensagemErro)

    
##################### Disciplinas #################################
@router.get("/disciplina-por-id/{discplina_id}", response=list[DisciplinaCompletaSchema])
def consulta_discplina(request, discplina_id: int):
    """
    Consulta uma disciplina específica por ID usando o ORM do Django.
    """
    try:
        # Usamos .filter(id=...) que é seguro contra SQL Injection.
        # .all().values() retorna um QuerySet de dicionários,
        qs = TbDisciplinas.objects.filter(id=discplina_id).all().values()
        
        return list(qs)
        
    except Exception as e:
        return 400, {"mensagem": f"Erro ao consultar disciplina por id: {e}"}

@router.get("/disciplina-por-semestre/{semestre}", response=list[DisciplinaCompletaSchema])
def consulta_disciplinas_por_semestre(request, semestre: int):
    """
    Consulta disciplinas por semestre usando o ORM do Django.
    """
    try:
        # Filtro seguro do ORM: .filter(semestre=semestre)
        # .all().values() para manter o padrão das suas outras APIs.
        qs = TbDisciplinas.objects.filter(semestre=semestre).all().values()
        
        return list(qs)
        
    except Exception as e:
        return 400, {"mensagem": f"Erro ao consultar disciplinas por semestre: {e}"}

# busca de disciplinas
@router.get("/disciplinas", response=List[DisciplinaSchema])
def listar_disciplinas(request):
    """
    Retorna uma lista de todas as disciplinas disponíveis 
    com seus IDs e nomes.
    """
    qs = TbDisciplinas.objects.all().values('id', 'disciplina')
    return list(qs)

@router.post("/inserir-disciplina/")
def inserir_disciplina(request, payload: DisciplinaCreateSchema):
    """
    Insere uma nova disciplina no banco de dados usando o ORM.
    O 'payload' é validado automaticamente pelo 'DisciplinaCreateSchema'.
    """
    dados_para_criar = payload.dict()
    
    try:
        # 2. Usa o método .create() do ORM.
        # O ' ** ' desempacota o dicionário, passando os valores
        # como argumentos (ex: disciplina="Cálculo", carga=60, ...)
        nova_disciplina = TbDisciplinas.objects.create(**dados_para_criar)
        return {"id_criado": nova_disciplina.id, "mensagem": "Disciplina cadastrada com sucesso"}
    
    except Exception as e:
        return 400, {"mensagem": f"Erro ao cadastrar disciplina: {e}"}
    
@router.put("/atualizar-disciplina/{disciplina_id}")
def atualizar_disciplina(request, disciplina_id: int, payload: DisciplinaUpdateSchema):
    """
    Atualiza uma disciplina existente usando o ORM.
    O 'payload' é validado pelo 'DisciplinaUpdateSchema'.
    """

    dados_para_atualizar = payload.dict(exclude_unset=True)


    try:
        num_rows = TbDisciplinas.objects.filter(id=disciplina_id).update(**dados_para_atualizar)

        return {"mensagem": "Disciplina atualizada com sucesso"}
    
    except Exception as e:
        return 400, {"mensagem": f"Erro ao atualizar disciplina: {e}"}    
    
@router.delete("/deletar-disciplina/{disciplina_id}") 
def deletar_disciplina(request, disciplina_id: int):
    """
    Deleta uma disciplina específica pelo ID usando o ORM.
    """
    try:
        disciplina_para_deletar = TbDisciplinas.objects.get(id=disciplina_id)        
        disciplina_para_deletar.delete()

        return {"mensagem": f"Disciplina com ID {disciplina_id} deletada com sucesso"}
    
    except TbDisciplinas.DoesNotExist:

        return 404, {"mensagem": f"Disciplina com ID {disciplina_id} não encontrada."}
    
    except Exception as e:
      
        return 400, {"mensagem": f"Erro ao deletar disciplina: {e}"}    
##################### ENDERECOS #################################
@router.get("/enderecos-por-id/{id}", response=list[EnderecoCompletoSchema])
def consulta_enderecos(request, id: int):
    """
    Consulta um endereço específico por ID usando o ORM do Django.
    """
    try:

        qs = TbEnderecos.objects.filter(id=id).all().values()

        return list(qs)
        
    except Exception as e:
        return 400, {"mensagem": f"Erro ao consultar endereço por id: {e}"}
    
@router.get("/enderecos-por-estado/{estado}", response=list[EnderecoCompletoSchema])
def consulta_enderecos_por_estado(request, estado: str):
    """
    Consulta endereços por estado usando o ORM do Django.
    """
    try:

        qs = TbEnderecos.objects.filter(estado__iexact=estado).all().values()
        
        return list(qs)
        
    except Exception as e:
        return 400, {"mensagem": f"Erro ao consultar endereços por estado: {e}"}    
    
@router.post("/inserir-endereco/")
def inserir_endereco(request, payload: EnderecoCreateSchema):
    """
    Insere um novo endereço no banco de dados usando o ORM.
    O 'payload' é validado automaticamente pelo 'EnderecoCreateSchema'.
    """
    
    dados_para_criar = payload.dict()
    
    try:
        # O ' ** ' desempacota o dicionário, passando os valores
        # como argumentos (ex: cep="...", endereco="...", ...).
        novo_endereco = TbEnderecos.objects.create(**dados_para_criar)
        
        return {"id_criado": novo_endereco.id, "mensagem": "Endereço cadastrado com sucesso"}
    
    except Exception as e:
        return 400, {"mensagem": f"Erro ao cadastrar endereço: {e}"}    

@router.put("/atualizar-enderecos/{endereco_id}")
def atualizar_endereco(request, endereco_id: int, payload: EnderecoUpdateSchema):
    """
    Atualiza um endereço existente usando o ORM.
    O 'payload' é validado pelo 'EnderecoUpdateSchema'.
    """

    # 'exclude_unset=True' ignora campos que não estavam no JSON.
    # Ex: Se o JSON for {"cidade": "Rio"}, o dict será {'cidade': 'Rio'}
    dados_para_atualizar = payload.dict(exclude_unset=True)
    try:
 
        num_rows = TbEnderecos.objects.filter(id=endereco_id).update(**dados_para_atualizar)

        return {"mensagem": "Endereço atualizado com sucesso"}
    
    except Exception as e:
        return 400, {"mensagem": f"Erro ao atualizar endereço: {e}"}
#################### ALUNOS ########################

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

@router.get("/alunos-por-nome/{nome}", response=list[AlunosSchema])
def consultar_alunos_por_nome(request, nome: str):
    """
    Consulta alunos por nome usando o ORM do Django.
    """
    try:
        # 'nome__icontains' é a forma segura do Django de fazer
        # uma busca parcial (como "LIKE" no SQL) que ignora
        # maiúsculas/minúsculas (o 'i' é de 'insensitive').
        # Isso é muito melhor do que uma busca exata (nome=nome).
        qs = TbAlunos.objects.filter(nome__icontains=nome).all().values()
        
        return list(qs)
        
    except Exception as e:
        return 400, {"mensagem": f"Erro ao consultar aluno por nome: {e}"}
    
# inserir alunos
@router.post("/inserir-aluno/", response={200:dict, 400: MensagemErro})
def inserir_aluno(request, payload: AlunoCreateSchema):
    # Converte o schema validado em um dicionário
    dados_para_criar = payload.dict()
    try:
        # O ' ** ' desempacota o dicionário, passando os valores
        aluno_novo = TbAlunos.objects.create(**dados_para_criar)
        # Retorna o ID do aluno criado e uma mensagem de sucesso
        # O status 201 (Created) é mais adequado para POST
        return  {"id_criado": aluno_novo.id, "mensagem": "Aluno cadastrado com sucesso"}
    except Exception as e:
        return 400, {"mensagem": f"Erro ao cadastrar: {e}"}







