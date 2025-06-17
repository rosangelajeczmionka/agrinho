let carros = [];
let galinhas = [];
let galinhaControlada;

function setup() {
  createCanvas(800, 400);

  // Carros
  for (let i = 0; i < 3; i++) {
    carros.push({
      x: random(400, 750),
      y: 330 + i * 20,
      dir: random([1, -1]),
      speed: random(1, 2),
      tombado: false,
      color: color(random(255), random(255), random(255))
    });
  }

  // Galinhas automáticas
  galinhas = [
    { x: 120, y: 330, cor: color(255, 255, 255), dir: 1, offset: 0, fase: 1, caiu: false },
    { x: 180, y: 340, cor: color(255, 200, 200), dir: -1, offset: 0, fase: 1, caiu: false }
  ];

  // Galinha controlada pelo jogador
  galinhaControlada = {
    x: 250,
    y: 330,
    cor: color(255, 150, 0),
    dir: 1,
    caiu: false
  };
}

function draw() {
  background(135, 206, 235);
  stroke(0);
  line(width / 2, 0, width / 2, height);

  drawField();
  drawHenHouse();
  moveGalinhas();
  drawGalinhas();

  drawCity();
  drawStreet();
  moveCars();
  drawCars();

  moveGalinhaControlada();
  drawGalinhaControlada();
  checarColisaoGalinhaCarro();
}

// --------- Campo ---------
function drawField() {
  noStroke();
  fill(34, 139, 34);
  rect(0, height / 2, width / 2, height / 2);

  fill(255, 204, 0);
  ellipse(80, 80, 60); // sol

  fill(139, 69, 19);
  rect(100, height / 2 - 40, 20, 40); // tronco
  fill(34, 139, 34);
  ellipse(110, height / 2 - 60, 60, 60); // copa
}

function drawHenHouse() {
  fill(150, 75, 0);
  rect(40, 250, 80, 60);
  fill(120, 30, 0);
  triangle(30, 250, 80, 220, 130, 250);
  fill(80, 40, 0);
  rect(70, 280, 20, 30);
}

// --------- Galinhas automáticas ---------
function moveGalinhas() {
  for (let g of galinhas) {
    if (g.caiu) continue;

    g.offset += g.fase * 0.3;
    if (abs(g.offset) > 5) {
      g.fase *= -1;
    }

    g.x += g.fase * 0.3 * g.dir;

    if (g.x < 10 || g.x > width / 2 - 10) {
      g.caiu = true;
    }
  }
}

function drawGalinhas() {
  for (let g of galinhas) {
    desenharGalinha(g.x, g.y, g.cor, g.dir, g.caiu);
  }
}

// --------- Galinha controlada ---------
function moveGalinhaControlada() {
  if (galinhaControlada.caiu) return;

  if (keyIsDown(LEFT_ARROW)) {
    galinhaControlada.x -= 2;
    galinhaControlada.dir = -1;
  }
  if (keyIsDown(RIGHT_ARROW)) {
    galinhaControlada.x += 2;
    galinhaControlada.dir = 1;
  }
  if (keyIsDown(UP_ARROW)) {
    galinhaControlada.y -= 2;
  }
  if (keyIsDown(DOWN_ARROW)) {
    galinhaControlada.y += 2;
  }

  // Limite de borda
  if (galinhaControlada.x < 0 || galinhaControlada.x > width || galinhaControlada.y > height || galinhaControlada.y < 0) {
    galinhaControlada.caiu = true;
  }
}

function drawGalinhaControlada() {
  desenharGalinha(galinhaControlada.x, galinhaControlada.y, galinhaControlada.cor, galinhaControlada.dir, galinhaControlada.caiu);
}

// --------- Desenho genérico de galinha ---------
function desenharGalinha(x, y, cor, dir, caiu) {
  push();
  translate(x, y);

  if (caiu) {
    rotate(HALF_PI);
  } else {
    scale(dir, 1);
  }

  fill(cor);
  ellipse(0, 0, 25, 25); // corpo
  ellipse(-5, -7, 15, 15); // cabeça

  fill(0);
  ellipse(-7, -9, 3, 3); // olho

  fill(255, 165, 0);
  triangle(-12, -7, -12, -5, -17, -6); // bico

  fill(255, 0, 0);
  ellipse(-8, -13, 4);
  ellipse(-5, -14, 4); // crista

  stroke(255, 165, 0);
  strokeWeight(2);
  line(-5, 12, -5, 18); // perna esquerda
  line(5, 12, 5, 18);   // perna direita
  line(-5, 18, -8, 20);
  line(-5, 18, -2, 20);
  line(5, 18, 2, 20);
  line(5, 18, 8, 20);
  noStroke();

  pop();
}

// --------- Carros ---------
function moveCars() {
  for (let car of carros) {
    if (!car.tombado) {
      car.x += car.speed * car.dir;
      if (car.x > width - 40 || car.x < width / 2) {
        car.dir *= -1;
      }
    }
  }
}

function drawCars() {
  for (let car of carros) {
    push();
    fill(car.color);
    if (car.tombado) {
      translate(car.x, car.y);
      rotate(HALF_PI);
      rect(0, 0, 40, 20);
      fill(0);
      ellipse(5, 20, 10);
      ellipse(35, 20, 10);
    } else {
      rect(car.x, car.y, 40, 20);
      fill(0);
      ellipse(car.x + 5, car.y + 20, 10);
      ellipse(car.x + 35, car.y + 20, 10);
    }
    pop();
  }
}

// --------- Colisão ---------
function checarColisaoGalinhaCarro() {
  for (let car of carros) {
    if (car.tombado) continue;

    let d = dist(galinhaControlada.x, galinhaControlada.y, car.x + 20, car.y + 10);
    if (d < 25) {
      car.tombado = true;
    }
  }
}

// --------- Cidade ---------
function drawCity() {
  fill(180);
  rect(width / 2, height / 2, width / 2, height / 2);

  drawBuilding(430, 180, 50, 180, 4, 3);
  drawBuilding(500, 160, 60, 200, 5, 4);
  drawBuilding(580, 190, 40, 160, 4, 2);
}

function drawBuilding(x, y, w, h, linhas, colunas) {
  fill(50);
  rect(x, y, w, h);

  let margemX = 8;
  let margemY = 10;
  let larguraJanela = 10;
  let alturaJanela = 12;
  let espacamentoX = (w - 2 * margemX - colunas * larguraJanela) / (colunas - 1);
  let espacamentoY = (h - 2 * margemY - linhas * alturaJanela) / (linhas - 1);

  fill(255, 255, 0);
  for (let i = 0; i < linhas; i++) {
    for (let j = 0; j < colunas; j++) {
      let px = x + margemX + j * (larguraJanela + espacamentoX);
      let py = y + margemY + i * (alturaJanela + espacamentoY);
      rect(px, py, larguraJanela, alturaJanela);
    }
  }
}

function drawStreet() {
  fill(60);
  rect(width / 2, 320, width / 2, 40);

  stroke(255);
  strokeWeight(2);
  for (let x = width / 2 + 10; x < width; x += 30) {
    line(x, 340, x + 15, 340);
  }
  noStroke();
}
