class TableExtWizard extends TableBasedObjectWizard {

    constructor() {
        super(1);

        this._fieldsgrid = new TableFieldsGridView(false);
        htmlHelper.hideById("prevBtn");
        htmlHelper.hideById("nextBtn");
    }

    onMessage(message) {    
        super.onMessage(message); 

        switch (message.command) {
            case 'setTypes':
                this.setTypes(message.data);
                break;
        }
    }

    setTables(data) {
        super.setTables(data);
        this.sendMessage({
            command : "loadTypes"
        });
    }

    setData(data) {
        super.setData(data);

        //initialize inputs
        document.getElementById("objectid").value = this._data.objectId;
        document.getElementById("objectname").value = this._data.objectName;
        document.getElementById("srctable").value = this._data.selectedTable;
        //initialize field list
        if (this._data.fields) {
            this._fieldsgrid.setData(this._data.fields);
        }
        else {
            this._fieldsgrid.setData([]);
        }
        this.loadTables();
    }

    setTypes(types) {
        this._fieldsgrid.setAutocomplete('dataType', types);
    }

    onFinish() {
        this.collectStepData(true);

        if (!this.canFinish()) {
            return;
        }
            
        this.sendMessage({
            command: "finishClick",
            data: {
                objectId : this._data.objectId,
                objectName : this._data.objectName,
                selectedTable : this._data.selectedTable,
                fields: this._data.fields
            }
        });
    }

    collectStepData(finishSelected) {
        this._data.objectId = document.getElementById("objectid").value;
        this._data.objectName = document.getElementById("objectname").value;
        this._data.selectedTable = document.getElementById("srctable").value;
        this._data.fields = this._fieldsgrid.getData();
    }

    canFinish() {
        if (!super.canFinish) {
            return false;
        }

        if ((!this._data.selectedTable) || (this._data.selectedTable == '')) {
            this.sendMessage({
                command: 'showError',
                message: 'Please enter a target object name.'
            });
            return false;
        }
        return true;
    }
}

var wizard;

window.onload = function() {
    wizard = new TableExtWizard();
};
