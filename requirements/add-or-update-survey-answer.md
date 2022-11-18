# Responder enquete

> ## Caso de sucesso

1. ✅ Recebe uma requisição do tipo **PUT** na rota **/api/surveys/{survey_id}/answers**
2. ✅ Valida se a requisição foi feita por um **usuário**
3. ✅ Valida o parâmetro **survey_id**
4. ✅ Valida se o campo **answer** é uma resposta válida
5. ✅ **Cria** a resposta de enquete com os dados fornecidos caso não tenha um registro
6. ✅ **Atualiza** uma resposta de enquete com os dados fornecidos caso já tenha um registro
7. ✅ Retorna **200** com os dados da resposta da enquete

> ## Exceções

1. ✅ Retorna erro **404** se a API não existir
2. ✅ Retorna erro **403** se não for um usuário
3. ✅ Retorna erro **403** se o survey_id passado na URL for inválido
4. ✅ Retorna erro **403** se a resposta enviada pelo client for uma resposta inválida
5. ✅ Retorna erro **500** se der erro ao tentar criar a resposta da enquete
6. ✅ Retorna erro **500** se der erro ao tentar atualizar a resposta da enquete
7. ✅ Retorna erro **500** se der erro ao tentar carregar a enquete