//Aligns ag-grid cell content to the start of the cell
export default class CustomCellRenderer {
    init(params) {
      this.eGui = document.createElement('div');
      this.eGui.style.textAlign = 'start';
      this.eGui.innerHTML = params.value;
    }
  
    getGui() {
      return this.eGui;
    }
  }