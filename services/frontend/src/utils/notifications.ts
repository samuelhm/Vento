import { toast } from 'sonner';
import { type NotificationType } from '../types/notificationTypes';

export const notify = (type: NotificationType, title: string, description?: string) => {
  return toast[type](title, {
    description,
    style: {
      backgroundColor: type === 'success' ? 'var(--color-primary-dark)' : undefined,
      color: type === 'success' ? 'white' : undefined,
      border: 'none',
    },
    className: 'rounded-2xl shadow-2xl font-sans p-4',
  });
};

export const handleAction = (type: NotificationType, title: string, description: string) => {
  
    notify(type, title, description);

};
//This is an example about how to call the handle function. 
//This function can be modified in the try... catch... part so that
// whe can costumize it whe needed
//
////////////////////////////////////////////////////
    // <button 
    //         onClick={() => handleAction("success", "Anuncio Publicado!", "Tu articulo ya es visible para toda la comunidad")}
    //         className="mt-6 cursor-pointer flex items-center justify-center w-fit px-6 py-2.5 rounded-full bg-white text-[var(--color-primary-dark)] text-sm font-bold"
    //       >
    //         testing button
    //       </button>
    /////////////////////////////////
    /////////////////////////////////
    //Import this function to call it
    //import { handleAction } from "../../utils/notifications";
    //////////////////////////////////////////