import bicicletas from "./images-cards/bicicletas.png";
import books from "./images-cards/books.png";
import wheels from "./images-cards/wheels.png";
import colection from "./images-cards/colection.png";
import construction from "./images-cards/construction.png";
import dress from "./images-cards/dress.png";
import garden from "./images-cards/garden.png";
import tractor from "./images-cards/tractor.png";
import traffic from "./images-cards/traffic-cone.png";
import kids from "./images-cards/kids.png";
import sport from "./images-cards/sport.png";
import services from "./images-cards/services.png";
import machine from "./images-cards/machine.png";
import motorbyke from "./images-cards/motorbyke.png";
import job from "./images-cards/job.png";
import others from "./images-cards/others.png";
import tech from "./images-cards/tech.png";

export interface CategoryConfig {
  image: string;
  alt: string;
}

export const CATEGORY_UI_CONFIG: Record<string, CategoryConfig> = {
  "bicicletas": {
    image: bicicletas,
    alt: "Encuentra bicicletas de segunda mano"
  },
  "cine, libros y música": {
    image: books,
    alt: "Cine, libros y música en Vento"
  },
  "coches": {
    image: wheels,
    alt: "Coches de ocasión al mejor precio"
  },
  "coleccionismo": {
    image: colection,
    alt: "Artículos de coleccionismo únicos"
  },
  "construcción y reformas": {
    image: construction,
    alt: "Materiales de construcción y reformas"
  },
  "motos": {
    image: motorbyke,
    alt: "Motos de segunda mano revisadas"
  },
  "deporte y ocio": {
    image: sport,
    alt: "Equipamiento para deporte y ocio"
  },
  "electrodomésticos": {
    image: machine,
    alt: "Electrodomésticos eficientes y baratos"
  },
  "empleo": {
    image: job,
    alt: "Ofertas de empleo en tu zona"
  },
  "industria y agricultura": {
    image: tractor,
    alt: "Maquinaria industrial y agrícola"
  },
  "moda y accesorios": {
    image: dress,
    alt: "Moda y accesorios de tendencia"
  },
  "motor y accesorios": {
    image: traffic,
    alt: "Accesorios para motor y recambios"
  },
  "hogar y jardín": {
    image: garden,
    alt: "Todo para tu hogar y jardín"
  },
  "niños y bebés": {
    image: kids,
    alt: "Productos para niños y bebés"
  },
  "otros": {
    image: others,
    alt: "Otras categorías de productos"
  },
  "servicios": {
    image: services,
    alt: "Servicios profesionales en Vento"
  },
  "tecnología y electrónica": {
    image: tech,
    alt: "Lo último en tecnología y electrónica"
  },
};

export const CATEGORY_GROUPS = [
  {
    title: "Todo lo que necesitas para tus mejores hábitos",
    description: "Invierte en tu bienestar y tiempo libre.",
    items: ["bicicletas", "cine, libros y música", "deporte y ocio", "tecnología y electrónica", "niños y bebés"]
  },
  {
    title: "Muévete a tu manera",
    description: "Vehículos, recambios y oportunidades para despegar.",
    items: ["coches", "motos", "motor y accesorios", "otros", "empleo"]
  },
  {
    title: "Equipa tu hogar y proyectos",
    description: "Desde reformas en casa hasta maquinaria especializada.",
    items: ["hogar y jardín", "electrodomésticos", "construcción y reformas", "industria y agricultura", "servicios"]
  },
  {
    title: "Estilo y Coleccionismo",
    description: "Objetos con historia y la moda que mejor te sienta.",
    items: ["moda y accesorios", "coleccionismo"]
  }
];

export const DEFAULT_CATEGORY_CONFIG: CategoryConfig = {
  image: "/electronics.webp",
  alt: "Categoría de productos Vento"
};
