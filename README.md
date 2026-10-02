# FILIPE // Tech-Noir Portfolio

Landing page minimalista e responsiva para portfólio.

## Estrutura

- `index.html` — página principal
- `style.css` — visual tech-noir, responsividade e microinterações
- `script.js` — chuva de código, cursor, digitação, tilt 3D, compilação visual e relógio
- `status.php` — endpoint opcional para leitura de status/uptime do servidor
- `assets/filipe.png` — retrato enviado

## Como executar

### Opção 1 — estático
Abra `index.html` no navegador. Tudo da interface funciona sem PHP.

### Opção 2 — servidor local com PHP
Na pasta do projeto:

```bash
php -S localhost:8000
```

Depois acesse:

```text
http://localhost:8000
```

O `status.php` pode ser acessado em `/status.php`.

## Links configurados

- GitHub: https://github.com/LipexDev
- LinkedIn: https://www.linkedin.com/in/filipe-da-silva-santos-2a825710b
- Instagram: https://www.instagram.com/o_filipesantos

## Observação sobre uptime

O rodapé mostra o uptime da própria página no navegador. O `status.php` também consegue informar o uptime do servidor quando hospedado em Linux com `/proc/uptime`.

## Personalização

Edite as variáveis no topo de `style.css` para trocar fundo, cobre, tipografia e demais tokens.
