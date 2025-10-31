from typing import Optional, List
from ninja import Schema
from pydantic import EmailStr

class AlunosSchema(Schema):
    id: int #adcionado
    nome: Optional[str] = None
    email: Optional[str] = None
    nome_mae: Optional[str] = None 
# NOVO SCHEMA PARA CRIAÇÃO (ENTRADA DE DADOS)
class EnderecoCreateSchema(Schema):
    cep: str
    endereco: str 
    bairro: Optional[str] = None
    cidade: str
    estado: str
class AlunoCreateSchema(Schema):
    matricula: str
    nome: str
    email: Optional[EmailStr] = None 
    endereco_id: Optional[int] = None
    nome_mae: Optional[str] = None
    # Objeto aninhado com os dados do Endereço
    endereco_info: EnderecoCreateSchema
    # Lista de IDs das matérias pré-existentes
    disciplinas_ids: List[int]
# NOVO SCHEMA PARA ATUALIZACAO (ENTRADA DE DADOS)

class AlunoUpdateSchema(Schema):
    matricula: Optional[str] = None
    nome: Optional[str] = None
    email: Optional[EmailStr] = None
    endereco_id: Optional[int] = None
    nome_mae: Optional[str] = None
    # Objeto aninhado com os dados do Endereço
    endereco_info: EnderecoCreateSchema
    # Lista de IDs das matérias pré-existentes
    disciplinas_ids: List[int]
class MessageResponseSchema(Schema):
    mensagem: str
class DisciplinaSchema(Schema):
    id: int
    disciplina: str

class EnderecoSchema(Schema):
    cep: str
    endereco: str
    bairro: Optional[str]
    cidade: str
    estado: str

# 2. Schema para exibir a lista de matérias e notas
class DisciplinaNotaSchema(Schema):
    disciplina_nome: str
    carga: int
    semestre: int
    nota: Optional[float] 

# 3. Schema principal que junta tudo
class AlunoDetalheSchema(Schema):
    id: int
    matricula: str
    nome: str
    email: Optional[str]
    nome_mae: Optional[str]
    # Objeto de endereço (pode ser nulo)
    endereco: Optional[EnderecoSchema] 
    # Lista de matérias/notas
    matriculas: List[DisciplinaNotaSchema]
 