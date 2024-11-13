sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel" // Adicionando o módulo JSONModel
], function (Controller, Fragment, JSONModel) {
    "use strict";

    return Controller.extend("dns.com.br.praticamodel1.controller.View1", {

        // Método onInit para inicializar o modelo JSON com a lista de dependentes
        onInit: function () {
            var oModel = this.getOwnerComponent().getModel("dependenteModel");

            if (!oModel) {
                // Se não, criamos um novo modelo JSON
                oModel = new JSONModel({
                    "dependentes": [],
                    "dependente": {
                        "nome": "",
                        "dataNascimento": "",
                        "genero": "", // Inicializa o genero como uma string vazia
                        "altura": ""
                    }
                });
                this.getOwnerComponent().setModel(oModel, "dependenteModel");
            }

            this.getView().setModel(oModel, "dependenteModel");
        },

        // Método para abrir o diálogo (Popup)
        onOpenDialog: function () {
            var oView = this.getView(),
                oDialogKids = this.getView().byId("dialog");

            // Garantir que o genero seja inicializado com um valor válido (se necessário)
            var oModel = this.getView().getModel("dependenteModel");
            var oDependente = oModel.getProperty("/dependente");

            if (!oDependente.genero) {
                oDependente.genero = "M"; // Defina o valor padrão como "Masculino" (M)
                oModel.setProperty("/dependente/genero", "M");
            }

            if (!oDialogKids) {
                Fragment.load({
                    id: oView.getId(),
                    name: "dns.com.br.praticamodel1.view.Dialog",
                    type: "XML",
                    controller: this
                }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    oDialog.open();
                });
            } else {
                oDialogKids.open();
            }
        },

        // Método para fechar o popup
        onClosePopup: function () {
            this.getView().byId("dialog").close();
        },

        // Método para capturar a alteração da seleção no SegmentedButton
        onSegmentedButtonSelect: function (oEvent) {
            // Obter o valor do "selectedKey"
            var sSelectedKey = oEvent.getParameter("selectedKey");

            // Atualizar o modelo com o novo valor de "genero"
            var oModel = this.getView().getModel("dependenteModel");
            oModel.setProperty("/dependente/genero", sSelectedKey);
        },

        // Método para salvar os dados do dependente e atualizar a tabela
        onSave: function () {
            var oModel = this.getView().getModel("dependenteModel");
            var oDependenteData = oModel.getProperty("/dependente");

            // Garantir que a altura seja convertida para float, substituindo "." por ","
            var altura = oDependenteData.altura;
            if (altura) {
                altura = altura.replace('.', ','); // Convertendo ponto para vírgula
                oDependenteData.altura = altura; // Atualizando a altura
            } else {
                sap.m.MessageToast.show("Altura inválida! Por favor, insira um valor.");
                return;
            }

            // Capturando o valor de sexo (genero)
            var genero = oDependenteData.genero;
            if (!genero) {
                sap.m.MessageToast.show("Por favor, selecione o sexo.");
                return;
            }

            // Obtendo a lista atual de dependentes
            var aDependentes = oModel.getProperty("/dependentes");

            // Adicionando o novo dependente à lista
            aDependentes.push(oDependenteData);

            // Atualizando a lista de dependentes no modelo
            oModel.setProperty("/dependentes", aDependentes);

            // Limpando os campos do formulário
            oModel.setProperty("/dependente", {
                "nome": "",
                "dataNascimento": "",
                "genero": "", // Limpeza do valor de genero
                "altura": ""
            });

            // Fechando o diálogo
            this.getView().byId("dialog").close();

            // Exibindo uma mensagem de sucesso
            sap.m.MessageToast.show("Dependente salvo com sucesso!");

            // A tabela será automaticamente atualizada, pois está vinculada ao modelo
        }
    });
});