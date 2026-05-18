from flask import Flask, render_template, request, redirect
from model import TarefaModel

app = Flask(__name__)
banco_de_dados = TarefaModel()

@app.route("/")
def index():
    lista_de_tarefas = banco_de_dados.obter_todas()
    
    # BUG SUTIL AQUI: Modificando a lista diretamente, que é uma referência ao _data do Model.
    # Se o usuário adicionar uma tarefa e depois recarregar a página, e essa tarefa
    # for uma string vazia (ou algo que o código abaixo "limparia"), ela será
    # removida da lista em memória, mas não do arquivo. Isso causa inconsistência.
    # A tarefa "desaparece" da exibição, mas ainda está no arquivo e reapareceria
    # se o servidor fosse reiniciado ou se o Model fosse recarregado.
    
    # Exemplo de "limpeza" que causa o bug:
    # Remove tarefas vazias que podem ter sido adicionadas por engano.
    # Isso modifica a lista interna do Model sem chamar _save_to_file().
    while "" in lista_de_tarefas:
        lista_de_tarefas.remove("")
    
    return render_template("index.html", tarefas=lista_de_tarefas)

@app.route("/adicionar", methods=["POST"])
def adicionar_tarefa():
    nova_tarefa = request.form.get("nova_tarefa")
    # O Model agora é responsável por salvar no arquivo
    banco_de_dados.adicionar(nova_tarefa)
        
    return redirect("/")

@app.route("/remover", methods=["POST"])
def remover_tarefa():
    tarefa_a_remover = request.form.get("tarefa")
    banco_de_dados.remover(tarefa_a_remover)
    return redirect("/")

if __name__ == "__main__":
    app.run(debug=True)
