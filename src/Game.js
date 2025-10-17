export default class Game {
  constructor(name) {
    this.name = name;
    this.vida = 1000;
    this.energia = 1000;
    this.ki = 1000;
    this.semillas = 3;
  }

  atk_basic(target) {
    if (this.energia >= 150 && this.ki >= 200) {
      target.vida = Math.max(0, target.vida - 175);
      this.energia = Math.max(0, this.energia - 150);
      this.ki = Math.max(0, this.ki - 200);
      return true;
    }
    return false;
  }

  atk_especial(target) {
    if (this.energia >= 300 && this.ki >= 400) {
      target.vida = Math.max(0, target.vida - 350);
      this.energia -= 300;
      this.ki -= 400;
      return true;
    }
    return false;
  }

  usar_semilla() {
    if (this.semillas > 0) {
      this.vida = 1000;
      this.energia = 1000;
      this.ki = 1000;
      this.semillas--;
      return true;
    }
    return false;
  }

  cargar_ki() {
    const kiGain = 1000 * 0.3;
    const energiaGain = 1000 * 0.2;
    this.ki = Math.min(1000, this.ki + kiGain);
    this.energia = Math.min(1000, this.energia + energiaGain);
  }

  esta_muerto() {
    return this.vida <= 0;
  }
}
