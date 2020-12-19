import './App.css';
/* Componente de lista de tareas */
import  {useEffect, useReducer} from 'react';
/*TODO: 
    - Dark Mode
    - Transitions
*/

const Selector = (props) => {   
  let initialOpts = [{id:"it1", val : false, text : null, color : 'violet'}, {id:"it2", val : false, text : null, color : 'magenta'}, {id:"it3", val : false, text : null, color : 'blue'}];
  /* Tomar parametros de la URL y agregarlos a los objs de las opciones */
  const setOptions = (initialOpts) => {
    const params = new URLSearchParams(window.location.search)
        for (let index = 0; index < initialOpts.length; index++) {
            initialOpts[index].text = params.get('var' + index)
        }
        return {opts: initialOpts, hist: []};
    }
   
  const manageOpts = (id, newstate, curhist) => {
      if(newstate == true){
          // Agregar a activos
          if(curhist.length == 2){
              // Nuevo arreglo : último elemento + nuevo
              let newhist = [curhist.pop(), id];
              return newhist;
          }else{
              let newhist = [...curhist];
              newhist.push(id);
              return newhist;
          }
      }else{
          let newhist = [...curhist];
          // Buscar item desactivado en la lista
          let i = curhist.findIndex((it) => it == id);
          newhist.splice(i, 1);
          // Eliminar el item desactivado de la lista
          return newhist;
      }
  };

  const manageChk = (opts, hist) => {
      return opts.map((item) => {
          let nitem = {...item}
          if(hist.find((hit) => item.id == hit) == undefined){
                nitem.val = false;
          }else{
                nitem.val = true;
          }
          return nitem;
      });
  }
  

  const selReducer = (state, action) => {
    let nhist = manageOpts(action.source, !action.chk, state.hist);
    let nopts = manageChk(state.opts, nhist);
    return {opts: nopts, hist : nhist};
  };
  const [options, dispatch] = useReducer(selReducer, initialOpts, setOptions);
  
  const Options = (props) => {
      return (
          props.items.opts.map((item) => {
            return (
                <div className="optbox" key={item.id} >
                    {item.val ? <label style={{fontWeight: 'bold'}}>{item.text}</label> : <label> {item.text} </label>}
                    <label className="switch">
                    <input type="checkbox" checked= {item.val} onChange = { () => dispatch({source : item.id, chk : item.val})} />
                    <span className={`slider slider-${item.color} round`}></span>
                </label>
            </div>)
          })
      )
  }

  return (
    <div className = "container">
        <Options items = {options} />
    </div>
  )
};

export default Selector;
