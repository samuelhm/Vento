import logo from "../../../assets/images/logo/vento-icon.webp"
import logoGithub from "../../../assets/images/logo/github.png"
import { useNavigate } from 'react-router'


const footerValues = [{
  id: 1,
  title: "Vento",
  details : [{
    description : "¿Quienes somos?",
    reference : "/about",
  }, 
  {
    description : "¿Como funciona?",
    reference : "/howitworks",
  }
  ],
},
{
  id: 2,
  title: "Informacion legal",
  details : [{
    description : "Terminos y Condiciones",
    reference : "/terms",
  }
  ],
},
{
  id: 3,
  title: "Soporte",
  details : [{
    description : "Centro de Ayuda",
    reference : "/help",
  }, 
  {
    description : "Consejos de seguridad",
    reference : "/safetytips",
  },
  {
    description : "Reglas de la comunidad",
    reference : "/rules",
  }
  ],
}
];

export const Footer = () => {

  const navigate = useNavigate();

  const handleFooterPages = (path: string) => {

    navigate(path);
  }


  const displayLists = footerValues.map(element => {
    return (
      <div key={element.id} className="flex flex-col gap-3">
        <div className="font-bold text-gray-700 text-sm">{element.title}</div>
        <ul className="space-y-1">
          {element.details.map(e => (
            <li onClick={() => handleFooterPages(e.reference)} key={e.description} className="text-gray-500 hover:text-gray-700 cursor-pointer text-xs">
              {e.description}
            </li>
          ))}
        </ul>
      </div>
    );
  });

  return (

    <footer>
      <hr className="border-gray-200" />
      <div className="flex flex-col sm:flex-row items-center gap-2 justify-center max-w-6xl mx-auto py-8 w-full">
        <div >
          <img
            src={logo}
            alt="logo vento"
            className="w-32 m-8 md:w-32 lg:48 h-auto text-white"
          />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
          {displayLists}
        </div>
      </div>
      <hr className="border-gray-200" />
      <div className="flex justify-center items-center gap-8 p-4 m-full">
        <div className="text-gray-400 text-xs">Barcelona, Campus 42</div>
       <a href="https://github.com/sneymz00/ft_Vento" target="_blank"> <img
          src={logoGithub}
          alt="logo github"
          className="w-4 h-4"
        />
        </a>
        <div className="text-gray-400 text-xs">© 2026 Vento. Todos los derechos reservados</div>
      </div>
    </footer>
  );
};