from typing import Optional, List
from ninja import Schema
from pydantic import EmailStr
######### ALUNOS ################
class AlunosSchema(Schema):
    id: int #adcionado
    nome: Optional[str] = None
    email: Optional[str] = None
    nome_mae: Optional[str] = None 
class AlunoCreateSchema(Schema):
    matricula: str
    nome: str
    email: Optional[EmailStr] = None 
    endereco_id: Optional[int] = None
    nome_mae: Optional[str] = None
class AlunoUpdateSchema(Schema):
    matricula: Optional[str] = None
    nome: Optional[str] = None
    email: Optional[EmailStr] = None
    endereco_id: Optional[int] = None
    nome_mae: Optional[str] = None
######### ERROR ################
class MensagemErro(Schema):
    mensagem: str
######### DISCIPLINAS ################
class DisciplinaCompletaSchema(Schema):
    id: int
    disciplina: str
    carga: int
    semestre: int
class DisciplinaCreateSchema(Schema):
    disciplina: str
    carga: int
    semestre: int    
class DisciplinaUpdateSchema(Schema):
    disciplina: Optional[str] = None
    carga: Optional[int] = None
    semestre: Optional[int] = None
class DisciplinaSchema(Schema):
    id: int
    disciplina: str    
######### ENDERECOS ################
class EnderecoCompletoSchema(Schema):
    id: int
    cep: str
    endereco: str
    bairro: Optional[str] = None
    cidade: str
    estado: str
    regiao: Optional[str] = None    
class EnderecoCompletoSchema(Schema):
    id: int
    cep: str
    endereco: str
    bairro: Optional[str] = None
    cidade: str
    estado: str
    regiao: Optional[str] = None
class EnderecoCreateSchema(Schema):
    cep: str
    endereco: str
    bairro: Optional[str] = None
    cidade: str
    estado: str
    regiao: Optional[str] = None    
class EnderecoUpdateSchema(Schema):
    cep: Optional[str] = None
    endereco: Optional[str] = None
    bairro: Optional[str] = None
    cidade: Optional[str] = None
    estado: Optional[str] = None
    regiao: Optional[str] = None    
class EnderecoCreateSchema(Schema):
    cep: str
    endereco: str 
    bairro: Optional[str] = None
    cidade: str
    estado: str