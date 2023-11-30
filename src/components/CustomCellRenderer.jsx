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