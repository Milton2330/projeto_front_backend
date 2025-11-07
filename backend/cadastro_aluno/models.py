from django.db import models

class TbAlunos(models.Model):
    matricula = models.CharField(unique=True, max_length=20)
    nome = models.CharField(max_length=255)
    email = models.CharField(max_length=100, blank=True, null=True)
    endereco = models.ForeignKey('TbEnderecos', models.DO_NOTHING, blank=True, null=True)
    nome_mae = models.CharField(max_length=255,blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'tb_alunos'


class TbDisciplinas(models.Model):
    disciplina = models.CharField(max_length=255)
    carga = models.IntegerField()
    semestre = models.IntegerField()

    class Meta:
        managed = True
        db_table = 'tb_disciplinas'


class TbEnderecos(models.Model):
    cep = models.CharField(unique=True, max_length=10)
    endereco = models.CharField(max_length=255)
    bairro = models.CharField(max_length=50, blank=True, null=True)
    cidade = models.CharField(max_length=100)
    estado = models.CharField(max_length=50)
    regiao = models.CharField(max_length=50, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'tb_enderecos'


class TbNotas(models.Model):
    aluno = models.ForeignKey(TbAlunos, models.DO_NOTHING,blank=True, null=True)
    disciplina = models.ForeignKey(TbDisciplinas, models.DO_NOTHING, blank=True, null=True)
    nota = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'tb_notas'



