from django.contrib import admin
from django.urls import path
from ninja import NinjaAPI
from cadastro_aluno.api import router as router_cadastro_alunos

api = NinjaAPI()


api.add_router("/cadastro_aluno/", router_cadastro_alunos)#  

urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/v1/",api.urls)
]
