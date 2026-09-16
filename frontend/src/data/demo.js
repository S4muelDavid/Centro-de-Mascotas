// src/data/demo.js
// Contenido de respaldo mientras la base de datos no está conectada.
// Tiene exactamente la misma forma que devuelven las tablas de MySQL,
// así que cuando ejecutes schema.sql + seed.sql las secciones cambian
// a datos reales sin tocar ni una línea de los componentes.

export const SERVICIOS_DEMO = [
  {
    id: 1,
    icono: '🏡',
    titulo: 'Adopción acompañada',
    descripcion:
      'Conoces a la mascota sin compromiso, revisamos juntos si encaja con tu casa y tu rutina, y solo entonces firmamos la adopción.'
  },
  {
    id: 2,
    icono: '🩺',
    titulo: 'Salud al día',
    descripcion:
      'Cada animal sale esterilizado, desparasitado y con el esquema de vacunas completo. Te entregamos su carné médico.'
  },
  {
    id: 3,
    icono: '📋',
    titulo: 'Seguimiento a 6 meses',
    descripcion:
      'Te escribimos al mes, a los tres meses y a los seis para ver cómo va la adaptación y resolver dudas de convivencia.'
  },
  {
    id: 4,
    icono: '🤝',
    titulo: 'Red de hogares de paso',
    descripcion:
      'Rescatamos animales en riesgo y los cuidamos en casas voluntarias mientras aparece su familia definitiva.'
  }
];

export const MASCOTAS_DEMO = [
  {
    id: 1, nombre: 'Luna', especie: 'perro', raza: 'Mestiza', sexo: 'hembra',
    edad_meses: 24, tamano: 'mediano', estado: 'disponible', esterilizado: 1, vacunado: 1,
    foto_url: null,
    descripcion: 'Llegó tímida y hoy saluda a todo el mundo. Camina bien con correa y se lleva con otros perros.'
  },
  {
    id: 2, nombre: 'Michi', especie: 'gato', raza: 'Común europeo', sexo: 'macho',
    edad_meses: 12, tamano: 'pequeno', estado: 'disponible', esterilizado: 1, vacunado: 1,
    foto_url: null,
    descripcion: 'Tranquilo, dormilón y muy limpio. Ideal para apartamento.'
  },
  {
    id: 3, nombre: 'Rocky', especie: 'perro', raza: 'Criollo', sexo: 'macho',
    edad_meses: 36, tamano: 'grande', estado: 'disponible', esterilizado: 1, vacunado: 1,
    foto_url: null,
    descripcion: 'Energía para rato. Busca una familia que salga a caminar todos los días.'
  },
  {
    id: 4, nombre: 'Nina', especie: 'gato', raza: 'Siamesa', sexo: 'hembra',
    edad_meses: 6, tamano: 'pequeno', estado: 'disponible', esterilizado: 0, vacunado: 1,
    foto_url: null,
    descripcion: 'Curiosa y habladora. Se adapta rápido y adora las cajas de cartón.'
  },
  {
    id: 5, nombre: 'Canela', especie: 'perro', raza: 'Beagle mestiza', sexo: 'hembra',
    edad_meses: 18, tamano: 'mediano', estado: 'disponible', esterilizado: 1, vacunado: 1,
    foto_url: null,
    descripcion: 'Dulce con los niños y obsesionada con la comida. Aprende trucos en minutos.'
  },
  {
    id: 6, nombre: 'Simón', especie: 'gato', raza: 'Naranja mestizo', sexo: 'macho',
    edad_meses: 30, tamano: 'mediano', estado: 'disponible', esterilizado: 1, vacunado: 1,
    foto_url: null,
    descripcion: 'Independiente de día, compañero de noche. Ya vivió con perros.'
  }
];

export const RESUMEN_DEMO = { disponible: 6, en_proceso: 1, adoptada: 1 };

export const ESPECIES_DEMO = [
  { id_especie: 1, nombre: 'Perro', descripcion: 'Canino doméstico', total: 3 },
  { id_especie: 2, nombre: 'Gato', descripcion: 'Felino doméstico', total: 3 }
];

export const PRODUCTOS_DEMO = {
  productos: [
    { id: 1, nombre: 'Comida Perro Adulto 15kg', descripcion: 'Bulto de concentrado para perros', precio: 120000, stock: 30, estado_stock: 'disponible', proveedor: 'PetFood Co.' },
    { id: 2, nombre: 'Shampoo Antipulgas 500ml', descripcion: 'Higiene y control de parásitos', precio: 28000, stock: 40, estado_stock: 'disponible', proveedor: 'Higiene Pet' },
    { id: 3, nombre: 'Rascador Gato 3 Niveles', descripcion: 'Torre de entrenamiento para felinos', precio: 110000, stock: 15, estado_stock: 'bajo', proveedor: 'Mundo Felino' },
    { id: 4, nombre: 'Antibiótico Amoxicilina Vet', descripcion: 'Caja x 10 tabletas', precio: 35000, stock: 60, estado_stock: 'disponible', proveedor: 'FarmaVet' }
  ],
  resumen: { referencias: 10, unidades: 610, valor_inventario: 25680000, en_stock_bajo: 1 }
};

export const EQUIPO_DEMO = {
  veterinarios: [
    { id: 1, nombre_completo: 'Mario Gómez', especialidad: 'Medicina General', correo: 'mario.vet@clinica.com', telefono: '3101112233' },
    { id: 2, nombre_completo: 'Diana Restrepo', especialidad: 'Cirugía', correo: 'diana.vet@clinica.com', telefono: '3102223344' },
    { id: 6, nombre_completo: 'Valeria Delgado', especialidad: 'Animales Exóticos', correo: 'valeria.vet@clinica.com', telefono: '3106667788' }
  ],
  empleados: [
    { id: 3, nombre_completo: 'Jorge Díaz', cargo: 'Administrador', estado: 'Activo' },
    { id: 10, nombre_completo: 'Elena Rojas', cargo: 'Gestora de Adopciones', estado: 'Activo' },
    { id: 1, nombre_completo: 'Pedro Morales', cargo: 'Recepcionista', estado: 'Activo' }
  ],
  resumen: {
    veterinarios: { total: 10, especialidades: 10 },
    empleados: { total: 9, activos: 9 }
  }
};

export const OPINIONES_DEMO = {
  opiniones: [
    {
      id: 1, nombre_autor: 'Camila R.', mascota: 'Toby', calificacion: 5,
      texto: 'El proceso fue cercano y transparente. Nos explicaron todo sin apuro y hoy Toby duerme en el sofá como si siempre hubiera vivido aquí.'
    },
    {
      id: 2, nombre_autor: 'Julián M.', mascota: 'Pelusa', calificacion: 5,
      texto: 'Lo que más me gustó fue el seguimiento después de la adopción. Se nota que les importa cómo termina la historia.'
    },
    {
      id: 3, nombre_autor: 'Daniela P.', mascota: 'Simón', calificacion: 5,
      texto: 'Entregué a Simón cuando ya no podía cuidarlo. En tres semanas tenía un hogar y me mandaron fotos para que estuviera tranquila.'
    },
    {
      id: 4, nombre_autor: 'Andrés V.', mascota: 'Luna', calificacion: 4,
      texto: 'Nos ayudaron a elegir según nuestro apartamento y nuestros horarios, no según la mascota que más rápido salía.'
    }
  ],
  promedio: '4.8',
  total: 4
};

// La sección de ingreso no lista datos: solo envía el formulario.
// Los pasos son contenido fijo de la página, no de la base.
export const PASOS_INGRESO = [
  {
    numero: 1,
    titulo: 'Cuéntanos su historia',
    descripcion: 'Nombre, edad aproximada, especie y cómo llegó a ti. Entre más sepamos, mejor buscamos su familia.'
  },
  {
    numero: 2,
    titulo: 'Revisamos su salud',
    descripcion: 'Coordinamos una valoración veterinaria y, si hace falta, esterilización y vacunas antes de publicarla.'
  },
  {
    numero: 3,
    titulo: 'Te contactamos',
    descripcion: 'Una persona del equipo te escribe en menos de cinco días para acordar los siguientes pasos.'
  },
  {
    numero: 4,
    titulo: 'Entra al catálogo',
    descripcion: 'La mascota aparece en la sección de adopción y empezamos a recibir solicitudes de familias interesadas.'
  }
];
