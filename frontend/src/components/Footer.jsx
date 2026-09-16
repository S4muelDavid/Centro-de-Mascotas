// src/components/Footer.jsx
import Huella from './Huella.jsx';
import '../styles/footer.css';

export default function Footer({ onNavegar }) {
  return (
    <footer className="pie">
      <div className="contenedor pie-inner">
        <div className="pie-marca">
          <Huella tamano={28} />
          <span>Huellitas</span>
          <p>Centro de adopción de mascotas. Cada huella cuenta una historia.</p>
        </div>

        <div className="pie-columna">
          <h3>Apartados</h3>
          <button type="button" onClick={() => onNavegar('servicios')}>Servicios</button>
          <button type="button" onClick={() => onNavegar('mascotas')}>Mascotas</button>
          <button type="button" onClick={() => onNavegar('ingreso')}>Ingreso de mascotas</button>
          <button type="button" onClick={() => onNavegar('opiniones')}>Opiniones</button>
        </div>

        <div className="pie-columna">
          <h3>Contacto</h3>
          <a href="tel:+576041234567">(604) 123 4567</a>
          <a href="mailto:hola@huellitas.org">hola@huellitas.org</a>
          <p>Carrera 45 #12-30, Medellín</p>
          <p>Visitas de martes a domingo, 9:00 a 17:00</p>
        </div>
      </div>

      <div className="contenedor pie-legal">
        <p>© {new Date().getFullYear()} Huellitas</p>
        <p>Proyecto académico · Node, Express, MySQL y React</p>
      </div>
    </footer>
  );
}
