from django.contrib import admin
from django.urls import path
from ninja import NinjaAPI, Redoc
from cadastro_aluno.api import router as router_cadastro_alunos

api = NinjaAPI(
    version= "1.0",
    title="API para o sistema de escola do IBMEC",
    description="Essa api servem para controlar as notas dos alunos",
    docs=Redoc()
)


api.add_router("/cadastro_aluno/", router_cadastro_alunos)#  

urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/v1/",api.urls)
]
