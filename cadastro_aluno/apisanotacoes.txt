from fastapi import FastAPI
from typing import List
import pandas as pd
from pathlib import Path
from sqlalchemy import create_engine, text 
from dotenv import load_dotenv
import os
load_dotenv()
senha_db=os.getenv("senha_db")


#    ------------- APIS TABELA ENDERECO -------------

# coneccao com o banco de dados 
engine = create_engine(f"mysql+pymysql://root:{senha_db}@127.0.0.1:3306/db_escola")

app = FastAPI()

#cosnulta de enderecos por id 
@app.get("/enderecos-por-id/{id}",response_model=List[dict])
def consulta_enderecos(id:int):
    df_endereco = pd.read_sql(f"""select * from tb_enderecos
                            where id = {id}""", con=engine)
    return df_endereco.to_dict(orient="records")

# consulta de enderecos por estado
@app.get("/enderecos-por-estado/{estado}",response_model=List[dict])
def consulta_enderecos(estado:str):
    df_endereco = pd.read_sql(f"""select * from tb_enderecos
                            where estado = {estado}""", con=engine)
    return df_endereco.to_dict(orient="records")

# insercao de dados pelo postman 
@app.post("/inserir-endereco/",response_model=dict)
def inserir_endereco(dados_endereco:dict):
    with engine.begin() as conn:
        conn.execute(
            text( """
                insert into tb_enderecos
                (cep, endereco, bairro,cidade,estado,regiao)
                values (:cep,:endereco,:bairro,:cidade,:estado,:regiao)
                    """),dados_endereco
        )
    return {"mensagem:":"endereco cadastrado com sucesso"}

#updtade de dados pelo postman
@app.put("/atualizar-enderecos/{endereco_id}", response_model=dict)
def atualizar_endereco(endereco_id: int, dados_endereco: dict):

    with engine.begin() as conn:
        conn.execute(
            text(f"""
                UPDATE tb_enderecos
                SET
                    cep = :cep,
                    endereco = :endereco,
                    bairro = :bairro,
                    cidade = :cidade,
                    estado = :estado,
                    regiao = :regiao
                WHERE id = {endereco_id}
            """),
            dados_endereco
        )
    

    return {"mensagem": "endereco atualizado com sucesso"}


@app.delete("/deletar-linha-tabela-enderecos/{id}",response_model=dict)
def deletar_linha_tabela_enderecos(id: int):
    with engine.begin() as conn:
        conn.execute(
            text( f"""
                DELETE FROM tb_enderecos WHERE id ={id}; 
                    """)
        )
    return {"mensagem": f"{id} da tabela enderecos deletada com sucesso"}



#    ------------- APIS TABELA ALUNOS -------------

#consulta de alunos por id 
@app.get("/aluno-por-id/{aluno_id}",response_model=List[dict])
def consulta_enderecos(aluno_id:int):
    df_alunos = pd.read_sql(f"""select * from tb_alunos
                            where id = {aluno_id}""", con=engine)
    return df_alunos.to_dict(orient="records")

# consulta de informações de aluno nome
@app.get("/alunos-por-nome/{nome}",response_model=List[dict])
def consulta_enderecos(nome:str):
    df_alunos = pd.read_sql(f"""select * from tb_alunos
                            where nome = {nome}""", con=engine)
    return df_alunos.to_dict(orient="records")

# insercao de dados pelo postman 
@app.post("/inserir-aluno/",response_model=dict)
def inserir_endereco(dados_alunos:dict):
    with engine.begin() as conn:
        conn.execute(
            text( """
                insert into tb_alunos
                (matricula, nome, email,endereco_id)
                values (:matricula,:nome,:email,:endereco_id)
                    """),dados_alunos
        )
    return {"mensagem:":"endereco cadastrado com sucesso"}

#updtade de dados pelo postman
@app.put("/atualizar-alunos/{aluno_id}", response_model=dict)
def atualizar_endereco(aluno_id: int, dados_alunos: dict):

    with engine.begin() as conn:
        conn.execute(
            text(f"""
                UPDATE tb_alunos
                SET
                    matricula = :matricula,
                    nome = :nome,
                    email = :email,
                    endereco_id = :endereco_id
                WHERE id = {aluno_id}
            """),
            dados_alunos
        )
    return {"mensagem": "tabela alunos atualizado com sucesso"}

# delete de dados pelo postman 
@app.delete("/deletar-linha-tabela-alunos/{aluno_id}",response_model=dict)
def deletar_linha_tabela_enderecos(aluno_id: int):
    with engine.begin() as conn:
        conn.execute(
            text( f"""
                DELETE FROM tb_alunos WHERE id ={aluno_id}; 
                    """)
        )
    return {"mensagem": f"{aluno_id} da tabela alunos deletada com sucesso"}


#    ------------- APIS TABELA DISCIPLINAS -------------

#consulta de discplina por id 
@app.get("/disciplina-por-id/{discplina_id}",response_model=List[dict])
def consulta_discplina(discplina_id:int):
    df_discplinas = pd.read_sql(f"""select * from tb_disciplinas
                            where id = {discplina_id}""", con=engine)
    return df_discplinas.to_dict(orient="records")

# consulta de discplina por nota
@app.get("/disciplina-por-semestre/{semestre}",response_model=List[dict])
def consulta_discplina(semestre:int):
    df_discplinas = pd.read_sql(f"""select * from tb_disciplinas
                            where semestre = {semestre}""", con=engine)
    return df_discplinas.to_dict(orient="records")

# insercao de dados pelo postman 
@app.post("/inserir-disciplina/",response_model=dict)
def dados_disciplina(dados_disciplina:dict):
    with engine.begin() as conn:
        conn.execute(
            text( """
                insert into tb_disciplinas
                (disciplina, carga, semestre)
                values (:disciplina,:carga,:semestre)
                    """),dados_disciplina
        )
    return {"mensagem:":"Disciplina cadastrada com sucesso"}

#updtade de dados pelo postman
@app.put("/atualizar-disciplina/{disciplina_id}", response_model=dict)
def atualizar_disciplina(disciplina_id: int, dados_disciplinas: dict):

    with engine.begin() as conn:
        conn.execute(
            text(f"""
                UPDATE tb_disciplinas
                SET
                    disciplina = :disciplina,
                    carga = :carga,
                    semestre = :semestre
                WHERE id = {disciplina_id}
            """),
            dados_disciplinas
        )
    return {"mensagem": "tabela Disciplina atualizado com sucesso"}

#delete de dados pelo postman
@app.delete("/deletar-linha-tabela-disciplinas/{disciplina_id}",response_model=dict)
def deletar_linha_tabela_notas(disciplina_id: int):
    with engine.begin() as conn:
        conn.execute(
            text( f"""
                DELETE FROM tb_disciplinas WHERE id ={disciplina_id}; 
                    """)
        )
    return {"mensagem": f"{disciplina_id} da tabela alunos deletada com sucesso"}



