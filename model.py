import os

class TarefaModel:
    _file_path = 'tarefas.txt'

    def __init__(self):
        self._data = self._load_from_file() # Carrega os dados na inicialização

    def _load_from_file(self):
        if os.path.exists(self._file_path):
            with open(self._file_path, 'r') as f:
                return [line.strip() for line in f if line.strip()]
        return []

    def _save_to_file(self):
        with open(self._file_path, 'w') as f:
            for tarefa in self._data:
                f.write(tarefa + '\n')

    def obter_todas(self):
        # BUG SUTIL AQUI: Retorna a referência direta à lista interna (_data).
        # Se o código que chama obter_todas() modificar esta lista diretamente,
        # essas modificações afetarão o estado interno do Model, mas não serão
        # salvas no arquivo, a menos que add_item ou remove_item sejam chamados.
        # Isso pode levar a uma inconsistência entre o estado em memória e o arquivo.
        return self._data

    def adicionar(self, nova_tarefa):
        self._data.append(nova_tarefa)
        self._save_to_file()

    def remover(self, tarefa):
        if tarefa in self._data:
            self._data.remove(tarefa)
            self._save_to_file()
            return True
        return False
