const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

// Determina si estamos en desarrollo o en producción
const dev = process.env.NODE_ENV !== 'production';
// Inicializa la app de Next
const app = next({ dev });
// Obtiene el manejador de rutas de Next
const handle = app.getRequestHandler();

// Puerto por defecto (puede ser sobrescrito por cPanel)
const port = process.env.PORT || 3000;

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    // Dejar que Next maneje todas las rutas
    handle(req, res, parsedUrl);
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(`> Servidor listo en puerto ${port} (modo ${dev ? 'dev' : 'prod'})`);
  });
});
