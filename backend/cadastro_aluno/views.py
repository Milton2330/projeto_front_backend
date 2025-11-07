
# from cadastro_aluno.models import TbAlunos,TbEnderecos
# import pandas as pd


# qs = TbAlunos.objects.all().values()
# df_alunos = pd.DataFrame(qs)

# qs = TbEnderecos.objects.all().values()
# df_enderecos = pd.DataFrame(qs)

# TbAlunos.objects.filter(id=160).values()
# TbAlunos.objects.create(**{ 
#                            'matricula': '9999', 
#                            'nome': 'Laerte Django', 
#                            'email': 'laerteemail@exemplo.com', 
#                            'endereco_id': None, 
#                            'nome_mae':'LaerteMae'})

# TbAlunos.objects.filter(id=79).delete()
# TbAlunos.objects.filter(id=79).update(**{"nome_mae":"Dona Maria"})

